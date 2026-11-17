'use strict';

// Sugestão de hierarquia por LLM na etapa ④ Ajustes. O modelo lê a ontologia
// JÁ AJUSTADA e só propõe: pôr uma classe existente sob outra (`superclasse`,
// opcionalmente saindo de uma superclasse atual) ou criar uma classe-mãe nova
// que agrupe classes existentes (`nova_mae`). A proposta fica em
// ajustes_sugestoes e não toca a ontologia gerada; só vira ajuste(s) quando o
// humano a aceita, com motivo e fonte, pelo mesmo caminho de criação de
// ajuste (validação completa). Resposta fora do formato recusa tudo, e a
// resposta bruta fica salva (mesmo padrão de lib/oco/sugerirTipos.js).

const { conexao } = require('../db');
const llm = require('../llm');
const compilarDKD = require('../compilarDKD');
const decisoes = require('../oco/decisoes');
const { falha } = require('../oco/constantes');
const registro = require('./registro');
const estado = require('./estado');
const sugestoes = require('./sugestoes');

const BLOCO_HIERARQUIA_RE = /```HIERARQUIA\b\s*([\s\S]*?)```/;

function montarSystemPrompt(slug) {
  return `Você apoia a etapa de ajustes manuais estruturais da subfase OCO (Ontology Construction) \
de um processo de construção de ontologia, para o domínio "${slug}". Você recebe a ontologia já \
ajustada: por classe, a definição formal (gênero próximo + diferença específica), a tipagem PROV \
quando decidida, os alinhamentos com ontologias externas, as superclasses atuais, os atributos \
(com descrição) e as relações de saída.

Sua tarefa é SUGERIR melhorias de hierarquia (rdfs:subClassOf). Um humano decide cada sugestão; \
nada do que você propõe entra na ontologia sem essa decisão. Muitas classes estão soltas na raiz: \
o objetivo principal é organizá-las em categorias superiores coerentes.

Como analisar:
- Leia o GÊNERO de cada definição (o núcleo antes da diferença específica: "Pronunciamento \
judicial que…", "Registro público que…", "Resposta recebida de…"). Classes cujo gênero é o mesmo \
ou é especialização de um mesmo conceito são candidatas a ficar sob uma categoria comum — \
existente ou nova.
- Separe ATOS/EVENTOS (algo que acontece ou é praticado e produz efeito: decisão, ato notarial, \
medida, pedido, resposta) de REGISTROS/DOCUMENTOS (o que fica escrito ou anotado: registro, \
extrato, declaração, inscrição em lista) e de AGENTES (pessoas, órgãos, instituições) e de BENS. \
A tipagem PROV ajuda: prov:Activity indica ato/evento, prov:Entity indica registro/coisa, \
prov:Agent indica agente. Não misture ato e registro na mesma categoria-mãe.
- Os alinhamentos externos (ex.: ⊑ FOAF Agent, ≡ FIBO …) indicam a que categoria a classe pertence \
em vocabulários consolidados; use-os como evidência.
- Pode propor mais de um nível (ex.: uma categoria geral e, sob ela, subcategorias), desde que \
cada nível agrupe classes com algo em comum nas definições.

São dois tipos de sugestão:

1. "superclasse" — uma classe existente passa a ficar sob outra classe existente. Se ela deve \
DEIXAR uma superclasse atual (mover, e não só acrescentar), informe essa superclasse atual em \
"sairDe"; senão, omita "sairDe".
2. "nova_mae" — criar uma classe nova que agrupa duas ou mais classes existentes ("filhas"), \
opcionalmente sob uma superclasse existente ("superclasse").

Regras:
- Use SOMENTE nomes de classes que aparecem na lista, escritos exatamente como nela.
- Nome de classe nova: PascalCase (maiúscula inicial, só letras e dígitos), que não exista na \
lista, e GENÉRICO — nomeie o papel, nunca uma instância, um órgão, uma empresa ou um nome \
próprio (ex.: "OrgaoDeInvestigacao", e não "PoliciaFederal").
- A definição da classe nova diz o que as filhas têm em comum, com base apenas nas definições, \
atributos, relações e alinhamentos recebidos. Não invente informação.
- Não proponha remover uma superclasse sem pôr outra no lugar.
- Proponha só o que as definições sustentam; agrupamento sem gênero comum não é sugestão.
- "justificativa": 1 ou 2 frases curtas, citando o que nas definições, atributos ou relações \
sustenta a sugestão.

Escreva em português do Brasil. Responda APENAS com um bloco cercado \`\`\`HIERARQUIA contendo um \
único objeto JSON, sem texto antes ou depois, no formato exato:

{
  "sugestoes": [
    { "tipo": "superclasse", "classe": "ContaBancaria", "superclasse": "Ativo", "sairDe": "Registro", "justificativa": "..." },
    { "tipo": "nova_mae", "nome": "Agente", "definicao": "...", "filhas": ["PessoaFisica", "PessoaJuridica"], "superclasse": "Entidade", "justificativa": "..." }
  ]
}`;
}

const SIMBOLO = { eq: '≡', sub: '⊑', sup: '⊒', close: '≈', desenho: 'desenho' };

// Material extra por classe: definição formal aprovada no Alinhamento (①),
// tipagem PROV da Construção, alinhamentos externos e descrição dos atributos.
function contextoDasClasses(slug, ajustada) {
  const definicoes = new Map(conexao()
    .prepare("SELECT classe, definicao FROM eoa_definicoes WHERE dominio = ? AND status = 'mantida'")
    .all(slug).map((l) => [l.classe, l.definicao]));
  const prov = new Map(decisoes.listarTipagemProv(slug).map((t) => [t.classe, t.tipo]));
  const alinhamentos = new Map();
  for (const m of ajustada.insumos.mapeamentosClasse || []) {
    if (!alinhamentos.has(m.classe)) alinhamentos.set(m.classe, []);
    alinhamentos.get(m.classe).push(`${SIMBOLO[m.tipo] || m.tipo} ${m.sigla || m.ontologia} ${m.termo}`);
  }
  const descricaoAtributo = new Map();
  for (const c of (ajustada.insumos.dkd && ajustada.insumos.dkd.classes) || []) {
    for (const p of c.propriedades || []) {
      if (p.descricao && !descricaoAtributo.has(`${c.nome}|${p.nome}`)) descricaoAtributo.set(`${c.nome}|${p.nome}`, p.descricao.trim());
    }
  }
  return { definicoes, prov, alinhamentos, descricaoAtributo };
}

// A ontologia ajustada em texto, uma classe por item (a mesma árvore da tela).
function textoOntologia(arvore, ctx = { definicoes: new Map(), prov: new Map(), alinhamentos: new Map(), descricaoAtributo: new Map() }) {
  return arvore.classes.map((c) => {
    const atributo = (a) => {
      const d = ctx.descricaoAtributo.get(`${c.nome}|${a.nome}`);
      return d ? `${a.nome} (${d})` : a.nome;
    };
    const linhas = [
      `- ${c.nome}`,
      `  definição: ${ctx.definicoes.get(c.nome) || c.definicao || '[sem definição registrada]'}`,
    ];
    if (ctx.prov.has(c.nome)) linhas.push(`  tipagem PROV: prov:${ctx.prov.get(c.nome)}`);
    if (ctx.alinhamentos.has(c.nome)) linhas.push(`  alinhamentos: ${ctx.alinhamentos.get(c.nome).join('; ')}`);
    linhas.push(
      `  superclasses: ${c.superclasses.length ? c.superclasses.join(', ') : '(nenhuma — raiz)'}`,
      `  atributos: ${c.atributos.length ? c.atributos.map(atributo).join('; ') : '(nenhum)'}`,
      `  relações de saída: ${c.saida.length ? c.saida.map((r) => `${r.verbo} → ${r.destino}`).join('; ') : '(nenhuma)'}`,
    );
    return linhas.join('\n');
  }).join('\n');
}

// Opcional ausente: undefined, null ou texto vazio. Presente: tem de ser texto.
const ausente = (v) => v === undefined || v === null || (typeof v === 'string' && !v.trim());

// Valida uma sugestão contra a ontologia ajustada e devolve a forma canônica
// { tipo, parametros, justificativa, chave } — `chave` detecta repetição.
// Ciclos e demais regras ficam para a validação do ajuste, no aceite.
function validarSugestao(s, n, { classes, superclassesDe, normalizar }) {
  const erro = (motivo) => new Error(motivo);
  if (!s || typeof s !== 'object' || Array.isArray(s)) throw erro(`sugestão ${n} não é objeto`);
  const exigirTexto = (campo) => {
    if (typeof s[campo] !== 'string') throw erro(`campo "${campo}" não é texto`);
    return s[campo].trim();
  };
  const opcional = (campo) => {
    if (ausente(s[campo])) return null;
    if (typeof s[campo] !== 'string') throw erro(`campo "${campo}" não é texto`);
    return s[campo].trim();
  };
  const existente = (nome) => {
    if (!classes.has(nome)) throw erro(`a classe "${nome}" não existe na ontologia ajustada`);
    return nome;
  };

  const tipo = exigirTexto('tipo');
  if (!sugestoes.TIPOS.includes(tipo)) throw erro(`tipo "${tipo}" inválido: use ${sugestoes.TIPOS.join(', ')}`);

  if (tipo === 'superclasse') {
    const classe = existente(exigirTexto('classe'));
    const superclasse = existente(exigirTexto('superclasse'));
    const sairDe = opcional('sairDe');
    const justificativa = exigirTexto('justificativa');
    if (classe === superclasse) throw erro(`"${classe}" não pode ser superclasse de si mesma`);
    if ((superclassesDe.get(classe) || []).includes(superclasse)) throw erro(`"${classe}" já é subclasse de "${superclasse}"`);
    if (sairDe && !(superclassesDe.get(classe) || []).includes(sairDe)) throw erro(`"${sairDe}" não é superclasse atual de "${classe}"`);
    if (!justificativa) throw erro(`sugestão ${n} sem justificativa`);
    return {
      tipo, justificativa, chave: `superclasse|${classe}|${superclasse}`,
      parametros: { classe, superclasse, ...(sairDe ? { sairDe } : {}) },
    };
  }

  const nome = exigirTexto('nome');
  const definicao = exigirTexto('definicao');
  const superclasse = opcional('superclasse');
  const justificativa = exigirTexto('justificativa');
  const motivo = compilarDKD.motivoNomeInvalido('classe', nome);
  if (motivo) throw erro(motivo);
  const igual = [...classes].find((c) => normalizar(c) === normalizar(nome));
  if (igual) throw erro(`já existe a classe "${igual}"`);
  if (!Array.isArray(s.filhas) || s.filhas.length < 2) throw erro(`"${nome}" (nova_mae) exige "filhas" com pelo menos 2 filhas`);
  const filhas = [];
  for (const f of s.filhas) {
    if (typeof f !== 'string') throw erro('campo "filhas" não é texto');
    const filha = existente(f.trim());
    if (filhas.includes(filha)) throw erro(`filha "${filha}" repetida em "${nome}"`);
    filhas.push(filha);
  }
  if (superclasse) existente(superclasse);
  if (superclasse && filhas.includes(superclasse)) throw erro(`"${superclasse}" não pode ser filha e superclasse de "${nome}"`);
  if (!definicao) throw erro(`"${nome}" (nova_mae) sem definição`);
  if (!justificativa) throw erro(`sugestão ${n} sem justificativa`);
  return {
    tipo, justificativa, chave: `nova_mae|${normalizar(nome)}`,
    parametros: { nome, definicao, filhas, ...(superclasse ? { superclasse } : {}) },
  };
}

async function sugerirHierarquiaComIa(slug) {
  // Mesmas pré-condições de criar ajuste: sem a base gerável, nem chama o modelo.
  estado.exigirPreCondicoes(slug);
  const dkd = compilarDKD.listarDkd(slug);
  const ajustada = decisoes.ontologiaAjustada(slug, { dkd });
  const arvore = estado.montarArvore(ajustada);
  // Modelo próprio opcional para esta tarefa de modelagem (LLM_MODELO_HIERARQUIA);
  // sem ele, o modelo do .env.
  const opcoesModelo = process.env.LLM_MODELO_HIERARQUIA ? { model: process.env.LLM_MODELO_HIERARQUIA } : {};

  const resposta = await llm.chatComContinuacao([
    { role: 'system', content: montarSystemPrompt(slug) },
    { role: 'user', content: `Ontologia ajustada do domínio "${slug}" (${arvore.classes.length} classes):\n${textoOntologia(arvore, contextoDasClasses(slug, ajustada))}` },
  ], { maxTokens: 32000, ...opcoesModelo });

  const recusar = (motivo) => {
    const arquivo = llm.avisarRespostaSemFormato(`sugerir hierarquia — domínio "${slug}" (${motivo})`, resposta);
    return falha(502, `Sugestão do modelo recusada (${motivo}). Nada foi gravado. Resposta bruta salva em ${arquivo}.`);
  };
  const m = typeof resposta === 'string' ? resposta.match(BLOCO_HIERARQUIA_RE) : null;
  if (!m) throw recusar('bloco ```HIERARQUIA ausente');
  let proposta;
  try {
    proposta = JSON.parse(m[1].trim());
  } catch (err) {
    throw recusar(`JSON inválido: ${err.message}`);
  }
  if (!proposta || !Array.isArray(proposta.sugestoes)) throw recusar('esperado {sugestoes: [...]}');

  const contexto = {
    classes: new Set(arvore.classes.map((c) => c.nome)),
    superclassesDe: new Map(arvore.classes.map((c) => [c.nome, c.superclasses])),
    normalizar: compilarDKD.normalizarBusca,
  };
  const validas = [];
  const chaves = new Set();
  for (const [i, s] of proposta.sugestoes.entries()) {
    let v;
    try {
      v = validarSugestao(s, i + 1, contexto);
    } catch (err) {
      throw recusar(err.message);
    }
    if (chaves.has(v.chave)) throw recusar(`sugestão repetida: ${sugestoes.descrever(v.tipo, v.parametros)}`);
    chaves.add(v.chave);
    validas.push(v);
  }

  const { provider, model } = llm.descreverConfig(opcoesModelo);
  const modelo = `${model} (${provider})`;
  const pendentes = sugestoes.substituirPendentes(slug, validas, modelo);
  return { sugeridas: pendentes.length, modelo };
}

// Passos do aceite, em ordem: a classe-mãe nasce antes de receber as filhas; o
// mover acrescenta a nova superclasse antes de tirar a antiga.
function passos(s) {
  const p = s.parametros;
  if (s.tipo === 'nova_mae') {
    return [
      { operacao: 'criar_classe', parametros: { nome: p.nome, definicao: p.definicao, ...(p.superclasse ? { superclasse: p.superclasse } : {}) } },
      ...p.filhas.map((filha) => ({ operacao: 'adicionar_superclasse', parametros: { classe: filha, superclasse: p.nome } })),
    ];
  }
  return [
    { operacao: 'adicionar_superclasse', parametros: { classe: p.classe, superclasse: p.superclasse } },
    ...(p.sairDe ? [{ operacao: 'remover_superclasse', parametros: { classe: p.classe, superclasse: p.sairDe } }] : []),
  ];
}

// Aceite tudo-ou-nada: cada passo é um ajuste criado pelo caminho normal
// (validação completa, mesmo motivo e fonte, autor da sessão). Se um passo é
// recusado, os ajustes já criados neste aceite são marcados desfeitos (mesmo
// autor — o histórico não se apaga) e o erro volta; a sugestão segue pendente.
function aceitarSugestao(slug, id, { motivo, fonte } = {}, autor) {
  const s = sugestoes.exigirPendente(slug, id);
  const lista = passos(s);
  registro.validarLastro({ ...lista[0], motivo, fonte });
  const criados = [];
  try {
    for (const passo of lista) criados.push(estado.criarAjuste(slug, { ...passo, motivo, fonte }, autor));
    const sugestao = sugestoes.marcarDecidida(slug, s.id, 'aceita', autor.trim(), criados.map((a) => a.id));
    return { sugestao, ajustes: criados };
  } catch (err) {
    // Desfazer em ordem inversa é o que torna seguro chamar marcarDesfeito direto,
    // sem dependentesDe: cada ajuste deste aceite só pode ter como dependentes os
    // criados depois dele no mesmo aceite (nenhum outro foi criado no meio — o
    // aceite é síncrono), e esses já foram desfeitos quando chega a vez dele.
    for (const a of [...criados].reverse()) registro.marcarDesfeito(slug, a.id, autor);
    throw err;
  }
}

function ignorarSugestao(slug, id, autor) {
  const s = sugestoes.exigirPendente(slug, id);
  if (typeof autor !== 'string' || !autor.trim()) throw falha(400, 'Autor da decisão não identificado.');
  return sugestoes.marcarDecidida(slug, s.id, 'ignorada', autor.trim());
}

module.exports = { montarSystemPrompt, textoOntologia, validarSugestao, sugerirHierarquiaComIa, passos, aceitarSugestao, ignorarSugestao };
