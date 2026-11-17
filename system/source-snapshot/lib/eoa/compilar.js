'use strict';

// Compilação do Alinhamento (EOA) via LLM. O modelo só propõe: toda linha entra
// 'pendente' e nada é substituído — recompilar preenche apenas o que falta
// (INSERT OR IGNORE). A validação de fronteira recusa a proposta inteira ao
// primeiro item fora dela, e a resposta bruta fica salva para inspeção.

const { conexao } = require('../db');
const llm = require('../llm');
const compilarDKD = require('../compilarDKD');
const { visaoDkd, listarMapeamentos } = require('../oco/decisoes');
const { classesMantidas } = require('../oco/gerador');
const { falha } = require('../oco/constantes');
const fronteira = require('./fronteira');
const estado = require('./estado');

const BLOCO_EOA_RE = /```EOA\b\s*([\s\S]*?)```/;
const SEM_PROPOSTA = 'sem proposta do modelo';
const LACUNA = '[requer pesquisa adicional]';
// Notação dos tipos nos prompts e nos artefatos (Tables 4.2 e 4.3).
const SIMBOLO = { eq: '≡', sub: '⊑', sup: '⊒', close: '≈', desenho: 'desenho' };

function texto(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

// Chama o modelo e devolve o objeto do bloco ```EOA. recusar(motivo) salva a
// resposta bruta e monta o erro — os validadores de cada etapa o usam também.
async function pedirProposta(mensagens, contexto) {
  const resposta = await llm.chatComContinuacao(mensagens, { maxTokens: 64000 });
  const recusar = (motivo) => {
    const arquivo = llm.avisarRespostaSemFormato(`${contexto} (${motivo})`, resposta);
    return falha(502, `Proposta do modelo recusada (${motivo}). Nada foi gravado. Resposta bruta salva em ${arquivo}.`);
  };
  const m = resposta.match(BLOCO_EOA_RE);
  if (!m) throw recusar('bloco ```EOA ausente');
  let proposta;
  try {
    proposta = JSON.parse(m[1].trim());
  } catch (err) {
    throw recusar(`JSON inválido: ${err.message}`);
  }
  if (!proposta || typeof proposta !== 'object' || Array.isArray(proposta)) throw recusar('esperado um objeto JSON');
  return { proposta, recusar };
}

// Primeiro campo de `campos` que não é texto. O JSON do modelo pode trazer
// lista ou número onde se espera texto; interpolado numa chave, ['Agent'] vira
// "Agent" e passaria pela fronteira até estourar no bind do SQLite. Campos em
// `opcionais` podem faltar (undefined/null), mas, presentes, têm de ser texto.
function campoNaoTexto(item, campos, opcionais = []) {
  return campos.find((c) => typeof item[c] !== 'string')
    || opcionais.find((c) => item[c] !== undefined && item[c] !== null && typeof item[c] !== 'string')
    || null;
}

function modeloEmUso() {
  const { provider, model } = llm.descreverConfig();
  return `${model} (${provider})`;
}

function emTransacao(fn) {
  const conn = conexao();
  conn.exec('BEGIN');
  try {
    const resultado = fn(conn);
    conn.exec('COMMIT');
    return resultado;
  } catch (err) {
    conn.exec('ROLLBACK');
    throw err;
  }
}

// --- Classes -------------------------------------------------------------------

function montarSystemPromptClasses(slug) {
  return `Você conduz a subfase EOA (Existing Ontology Alignment), passo de alinhamento de classes \
(TORRES et al., 2024, seção 4.1.2.1, Table 4.2), para o domínio "${slug}". Você recebe as classes \
mantidas da DKD (descrição, atributos e relações) e, para cada classe, as correspondências com \
ontologias externas que a revisão humana do ORR manteve.

Duas tarefas:

1. DEFINIÇÃO FORMAL de cada classe, no padrão gênero próximo + diferença específica, em uma frase. \
Use EXCLUSIVAMENTE a descrição, os atributos e as relações listados para a classe. Não acrescente \
conhecimento seu sobre o domínio. Onde faltar informação para definir, escreva literalmente \
${LACUNA} no lugar do que falta.

2. TIPO de cada correspondência listada. Você NÃO cria correspondência: só tipa os pares recebidos, \
com exatamente a mesma classe, o mesmo ontologiaId e o mesmo termo. Tipos:
- "eq": o conceito externo é equivalente ao nosso (≡);
- "sub": nossa classe é mais específica que o conceito externo (⊑);
- "sup": nossa classe é mais ampla que o conceito externo (⊒);
- "close": perspectiva parecida, semântica diferente (≈);
- "desenho": obrigatório, e só permitido, quando a ontologia está em modo "desenho".

Em "justificativa", uma frase curta dizendo por que esse tipo.

Responda APENAS com um bloco cercado \`\`\`EOA contendo um único objeto JSON, sem texto antes ou \
depois, no formato exato:

{
  "definicoes": [ { "classe": "Pessoa", "definicao": "..." } ],
  "mapeamentos": [ { "classe": "Pessoa", "ontologiaId": 3, "termo": "LegalEntity", "tipo": "eq", "justificativa": "..." } ]
}

Escreva "definicao" e "justificativa" em português do Brasil.`;
}

function montarEntradaClasses(slug, mantidas, pares, ontologias) {
  const paresPorClasse = new Map();
  for (const p of pares) {
    if (!paresPorClasse.has(p.classe)) paresPorClasse.set(p.classe, []);
    paresPorClasse.get(p.classe).push(p);
  }
  const nomes = new Set(mantidas.map((c) => c.nome));
  const blocos = mantidas.map((c) => {
    const atributos = (c.propriedades || []).filter((p) => p.status === 'mantida')
      .map((p) => `  - ${p.nome}${p.descricao ? `: ${p.descricao}` : ''}`);
    const relacoes = (c.relacoes || []).filter((r) => r.status === 'mantida' && nomes.has(r.classeDestinoNome))
      .map((r) => `  - ${c.nome} ${r.tipo} ${r.classeDestinoNome}`);
    const correspondencias = (paresPorClasse.get(c.nome) || [])
      .map((p) => `  - ontologiaId=${p.ontologiaId} termo="${p.termo}"${p.justificativa ? ` — ORR: ${p.justificativa}` : ''}`);
    return [
      `### ${c.nome}`,
      `Descrição: ${c.descricao || '(sem descrição na DKD)'}`,
      `Atributos:\n${atributos.join('\n') || '  (nenhum)'}`,
      `Relações:\n${relacoes.join('\n') || '  (nenhuma)'}`,
      `Correspondências mantidas no ORR:\n${correspondencias.join('\n') || '  (nenhuma)'}`,
    ].join('\n');
  });
  const usadas = new Set(pares.map((p) => p.ontologiaId));
  const fontes = [...ontologias.values()].filter((o) => usadas.has(o.id))
    .map((o) => `- ontologiaId=${o.id}: ${o.nome} (modo: ${o.modo || 'não cadastrado'})`);
  return `Classes da DKD (mantidas) do domínio "${slug}":\n\n${blocos.join('\n\n')}\n\nOntologias:\n${fontes.join('\n')}`;
}

/**
 * Propõe definições formais e tipos para os pares mantidos no ORR. Pares que o
 * modelo não cobrir entram pendentes com tipo "close" ("desenho" em fonte modo
 * desenho) e justificativa "sem proposta do modelo", para o humano decidir.
 */
async function compilarClasses(slug) {
  estado.exigirPreCondicoes(slug, 'classes');
  const mantidas = classesMantidas(compilarDKD.listarDkd(slug));
  if (!mantidas.length) throw falha(409, 'Nenhuma classe mantida na DKD deste domínio.');
  const nomes = new Set(mantidas.map((c) => c.nome));
  const pares = fronteira.paresOrr(slug).filter((p) => nomes.has(p.classe));
  if (!pares.length) throw falha(409, 'Nenhuma correspondência mantida no ORR aponta para classe mantida na DKD.');
  const ontologias = fronteira.ontologiasPorId();
  const modoDe = (ontologiaId) => (ontologias.has(ontologiaId) ? ontologias.get(ontologiaId).modo : null);
  const chavesOrr = new Set(pares.map((p) => fronteira.chavePar(p.classe, p.ontologiaId, p.termo)));

  const { proposta, recusar } = await pedirProposta([
    { role: 'system', content: montarSystemPromptClasses(slug) },
    { role: 'user', content: montarEntradaClasses(slug, mantidas, pares, ontologias) },
  ], `compilar EOA classes — domínio "${slug}"`);

  if (!Array.isArray(proposta.definicoes) || !Array.isArray(proposta.mapeamentos)) throw recusar('esperado {definicoes: [...], mapeamentos: [...]}');
  const definidas = new Set();
  const exigirTexto = (item, onde, campos, opcionais) => {
    const campo = item && typeof item === 'object' ? campoNaoTexto(item, campos, opcionais) : null;
    if (campo) throw recusar(`${onde}: "${campo}" deve ser texto, veio ${JSON.stringify(item[campo])}`);
  };
  for (const d of proposta.definicoes) {
    exigirTexto(d, 'definição', ['classe', 'definicao']);
    if (!d || !nomes.has(d.classe)) throw recusar(`definição para a classe "${d && d.classe}", que não está mantida na DKD`);
    if (!texto(d.definicao)) throw recusar(`definição vazia para a classe "${d.classe}"`);
    if (definidas.has(d.classe)) throw recusar(`definição repetida para a classe "${d.classe}"`);
    definidas.add(d.classe);
  }
  const cobertos = new Set();
  for (const m of proposta.mapeamentos) {
    exigirTexto(m, 'mapeamento', ['classe', 'termo', 'tipo'], ['justificativa']);
    if (!m || !nomes.has(m.classe)) throw recusar(`mapeamento para a classe "${m && m.classe}", que não está mantida na DKD`);
    if (!Number.isInteger(m.ontologiaId)) throw recusar(`mapeamento "${m.classe} → ${m.termo}": ontologiaId ${JSON.stringify(m.ontologiaId)} inválido (esperado inteiro)`);
    const chave = fronteira.chavePar(m.classe, m.ontologiaId, m.termo);
    if (!chavesOrr.has(chave)) throw recusar(`o par "${m.classe} → ${m.termo}" (ontologiaId ${m.ontologiaId}) não é correspondência mantida no ORR`);
    const motivo = fronteira.motivoTipoInvalido(m.tipo, modoDe(m.ontologiaId));
    if (motivo) throw recusar(`par "${m.classe} → ${m.termo}": ${motivo}`);
    if (cobertos.has(chave)) throw recusar(`par "${m.classe} → ${m.termo}" repetido`);
    cobertos.add(chave);
  }

  const modelo = modeloEmUso();
  const inseridas = emTransacao((conn) => {
    const n = { mapeamentos: 0, semProposta: 0, definicoes: 0 };
    const ins = conn.prepare(
      `INSERT OR IGNORE INTO eoa_mapeamentos_classe (dominio, classe_nossa, ontologia_id, termo_externo, tipo, origem, status, justificativa, manual)
       VALUES (?, ?, ?, ?, ?, 'eoa', 'pendente', ?, 0)`
    );
    for (const m of proposta.mapeamentos) n.mapeamentos += Number(ins.run(slug, m.classe, m.ontologiaId, m.termo, m.tipo, texto(m.justificativa)).changes);
    for (const p of pares) {
      if (cobertos.has(fronteira.chavePar(p.classe, p.ontologiaId, p.termo))) continue;
      const tipo = modoDe(p.ontologiaId) === 'desenho' ? 'desenho' : 'close';
      n.semProposta += Number(ins.run(slug, p.classe, p.ontologiaId, p.termo, tipo, SEM_PROPOSTA).changes);
    }
    const insDefinicao = conn.prepare("INSERT OR IGNORE INTO eoa_definicoes (dominio, classe, definicao, status, manual) VALUES (?, ?, ?, 'pendente', 0)");
    for (const d of proposta.definicoes) n.definicoes += Number(insDefinicao.run(slug, d.classe, d.definicao.trim()).changes);
    return n;
  });
  estado.registrarProveniencia(slug, 'classes', modelo);
  return { ...inseridas, modelo };
}

// --- Relações ------------------------------------------------------------------

function montarSystemPromptRelacoes(slug) {
  return `Você conduz a subfase EOA (Existing Ontology Alignment), passo de alinhamento de \
relacionamentos (TORRES et al., 2024, seção 4.1.2.1, Table 4.3), para o domínio "${slug}". Você recebe \
as relações mantidas da DKD (Origem VERBO Destino), o alinhamento de classes já decidido e o resumo de \
conceitos de cada ontologia externa elegível.

Para cada relação da DKD, decida UMA das duas saídas:

1. "mapeamentos": a relação corresponde a uma propriedade de uma ontologia elegível. O "termo" tem de \
ser o nome da propriedade EXATAMENTE como aparece no resumo de conceitos daquela ontologia — não \
use propriedade que você conhece de outra fonte e que o resumo não lista. Uma relação pode ter \
mapeamento em mais de uma ontologia. Tipos:
- "eq": a propriedade externa é equivalente à nossa (≡);
- "sub": nossa relação é mais específica que a propriedade externa (⊑);
- "sup": nossa relação é mais ampla que a propriedade externa (⊒);
- "close": perspectiva parecida, semântica diferente (≈);
- "desenho": obrigatório, e só permitido, quando a ontologia está em modo "desenho".
Se a correspondência depende de reificação (a relação é uma ponta de classe reificada) ou de uma \
cadeia de propriedades, diga isso na justificativa — não são tipos.

2. "proprias": nenhuma ontologia elegível tem propriedade correspondente no resumo. A relação é \
própria do domínio.

Cada relação recebida aparece em "mapeamentos" ou em "proprias", nunca nas duas. Use origem, verbo \
e destino exatamente como recebidos. Em "justificativa", uma frase curta.

Responda APENAS com um bloco cercado \`\`\`EOA contendo um único objeto JSON, sem texto antes ou \
depois, no formato exato:

{
  "mapeamentos": [ { "origem": "Pessoa", "verbo": "TITULAR_DE", "destino": "Ativo", "ontologiaId": 2, "termo": "holds", "tipo": "sub", "justificativa": "..." } ],
  "proprias": [ { "origem": "...", "verbo": "...", "destino": "...", "justificativa": "..." } ]
}

Escreva "justificativa" em português do Brasil.`;
}

function montarEntradaRelacoes(slug, relacoes, mapeamentosClasse, elegiveis) {
  const textoRelacoes = relacoes.map((r) => `- ${r.origem} ${r.verbo} ${r.destino}${r.justificativa ? ` — ${r.justificativa}` : ''}`).join('\n');
  const textoClasses = mapeamentosClasse.map((m) => `- ${m.classe} ${SIMBOLO[m.tipo]} ${m.termo} (${m.sigla || m.ontologia})`).join('\n');
  const textoOntologias = elegiveis.map((o) => `[ontologiaId=${o.id}] ${o.nome} (modo: ${o.modo || 'não cadastrado'})\nResumo de conceitos: ${o.resumoDeConceitos}`).join('\n\n');
  return `Relações da DKD (mantidas) do domínio "${slug}":\n${textoRelacoes}\n\nAlinhamento de classes (mantido):\n${textoClasses || '(nenhum)'}\n\nOntologias elegíveis:\n\n${textoOntologias}`;
}

/**
 * Propõe propriedades externas para as relações mantidas da DKD. Relação que
 * ficar sem linha viva (não descartada) e sem decisão "próprio" entra em
 * eoa_relacoes_proprias como pendente — a do modelo com a justificativa dele,
 * a não coberta com "sem proposta do modelo".
 */
async function compilarRelacoes(slug) {
  estado.exigirPreCondicoes(slug, 'relacoes');
  const v = visaoDkd(compilarDKD.listarDkd(slug));
  const relacoes = estado.estadoRelacoes(slug).relacoes;
  if (!relacoes.length) throw falha(409, 'Nenhuma relação mantida na DKD deste domínio (além de É_SUBCLASSE_DE).');
  const elegiveis = fronteira.ontologiasElegiveis(slug);
  if (!elegiveis.length) throw falha(409, 'Nenhuma ontologia elegível: selecione ontologias no domínio e mantenha ao menos um par de cada na revisão ORR.');
  const porId = new Map(elegiveis.map((o) => [o.id, o]));

  const { proposta, recusar } = await pedirProposta([
    { role: 'system', content: montarSystemPromptRelacoes(slug) },
    { role: 'user', content: montarEntradaRelacoes(slug, relacoes, listarMapeamentos(slug).classes, elegiveis) },
  ], `compilar EOA relações — domínio "${slug}"`);

  if (!Array.isArray(proposta.mapeamentos)) throw recusar('esperado {mapeamentos: [...], proprias: [...]}');
  const proprias = proposta.proprias === undefined ? [] : proposta.proprias;
  if (!Array.isArray(proprias)) throw recusar('"proprias" deve ser uma lista');
  const rotulo = (r) => `${r && r.origem} ${r && r.verbo} ${r && r.destino}`;
  const chaveDe = (r) => fronteira.chaveRelacao(r.origem, r.verbo, r.destino);
  const exigirTexto = (item, onde, campos, opcionais) => {
    const campo = item && typeof item === 'object' ? campoNaoTexto(item, campos, opcionais) : null;
    if (campo) throw recusar(`${onde}: "${campo}" deve ser texto, veio ${JSON.stringify(item[campo])}`);
  };
  const linhasVistas = new Set();
  const mapeadas = new Set();
  for (const m of proposta.mapeamentos) {
    exigirTexto(m, 'mapeamento', ['origem', 'verbo', 'destino', 'termo', 'tipo'], ['justificativa']);
    if (!m || !v.chavesPares.has(chaveDe(m))) throw recusar(`a relação "${rotulo(m)}" não está mantida na DKD`);
    if (!Number.isInteger(m.ontologiaId)) throw recusar(`relação "${rotulo(m)}": ontologiaId ${JSON.stringify(m.ontologiaId)} inválido (esperado inteiro)`);
    const ontologia = porId.get(m.ontologiaId);
    if (!ontologia) throw recusar(`relação "${rotulo(m)}": ontologiaId ${m.ontologiaId} não é elegível (selecionada no domínio e com par mantido no ORR)`);
    if (!fronteira.termoNoResumo(ontologia.resumoDeConceitos, m.termo)) throw recusar(`relação "${rotulo(m)}": o termo "${m.termo}" não consta no resumo de conceitos de "${ontologia.nome}"`);
    const motivo = fronteira.motivoTipoInvalido(m.tipo, ontologia.modo);
    if (motivo) throw recusar(`relação "${rotulo(m)}" → ${m.termo}: ${motivo}`);
    const linha = `${chaveDe(m)}|${m.ontologiaId}|${m.termo.trim()}`;
    if (linhasVistas.has(linha)) throw recusar(`relação "${rotulo(m)}" → ${m.termo} repetida`);
    linhasVistas.add(linha);
    mapeadas.add(chaveDe(m));
  }
  const propriasVistas = new Set();
  for (const p of proprias) {
    exigirTexto(p, 'relação própria', ['origem', 'verbo', 'destino'], ['justificativa']);
    if (!p || !v.chavesPares.has(chaveDe(p))) throw recusar(`a relação própria "${rotulo(p)}" não está mantida na DKD`);
    if (mapeadas.has(chaveDe(p))) throw recusar(`a relação "${rotulo(p)}" aparece em "mapeamentos" e em "proprias"`);
    if (propriasVistas.has(chaveDe(p))) throw recusar(`relação própria "${rotulo(p)}" repetida`);
    propriasVistas.add(chaveDe(p));
  }

  const modelo = modeloEmUso();
  const inseridas = emTransacao((conn) => {
    const n = { mapeamentos: 0, proprias: 0, semProposta: 0 };
    const ins = conn.prepare(
      `INSERT OR IGNORE INTO eoa_mapeamentos_relacao (dominio, origem_classe, verbo, destino_classe, ontologia_id, termo_externo, tipo, origem, status, justificativa, manual)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'eoa', 'pendente', ?, 0)`
    );
    for (const m of proposta.mapeamentos) {
      n.mapeamentos += Number(ins.run(slug, m.origem, m.verbo, m.destino, m.ontologiaId, m.termo.trim(), m.tipo, texto(m.justificativa)).changes);
    }
    const temLinhaViva = conn.prepare(
      "SELECT 1 FROM eoa_mapeamentos_relacao WHERE dominio = ? AND origem_classe = ? AND verbo = ? AND destino_classe = ? AND status <> 'descartada'"
    );
    const insPropria = conn.prepare(
      "INSERT OR IGNORE INTO eoa_relacoes_proprias (dominio, origem_classe, verbo, destino_classe, justificativa, status) VALUES (?, ?, ?, ?, ?, 'pendente')"
    );
    const justificativaDoModelo = new Map(proprias.map((p) => [chaveDe(p), texto(p.justificativa)]));
    for (const r of relacoes) {
      if (temLinhaViva.get(slug, r.origem, r.verbo, r.destino)) continue;
      const doModelo = justificativaDoModelo.has(chaveDe(r));
      const criada = Number(insPropria.run(slug, r.origem, r.verbo, r.destino, doModelo ? justificativaDoModelo.get(chaveDe(r)) : SEM_PROPOSTA).changes);
      if (doModelo) n.proprias += criada;
      else n.semProposta += criada;
    }
    return n;
  });
  estado.registrarProveniencia(slug, 'relacoes', modelo);
  return { ...inseridas, modelo };
}


module.exports = { compilarClasses, compilarRelacoes, SEM_PROPOSTA, LACUNA, SIMBOLO };
