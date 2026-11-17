'use strict';

const fs = require('fs');
const path = require('path');
const llm = require('./llm');
const { listarCapturas, lerCaptura } = require('./compilarCaptura');
const { conexao } = require('./db');

function repoRoot() {
  return process.env.ONTOLOGY_REPO_ROOT
    ? path.resolve(process.env.ONTOLOGY_REPO_ROOT)
    : path.resolve(__dirname, '..', '..', '..');
}

function ontologiaPreliminarPath(slug) {
  return path.join(repoRoot(), 'trabalho', 'ontologia', slug, 'especificacao', '04-ontologia-preliminar.md');
}

function existeOntologiaPreliminar(slug) {
  return fs.existsSync(ontologiaPreliminarPath(slug));
}

function apagarOntologiaPreliminar(slug) {
  const caminho = ontologiaPreliminarPath(slug);
  if (fs.existsSync(caminho)) fs.unlinkSync(caminho);
}

const BLOCO_RE = /```DKD\s*([\s\S]*?)```/;

function montarSystemPromptDKD(slug) {
  return `Você conduz a subfase DKD (Domain Knowledge Documentation) de um processo de \
especificação de ontologia, para o domínio "${slug}". Você recebe abaixo, uma por categoria, as \
tabelas de entidades/atributos/relacionamentos já modeladas na subfase anterior (DKC). Seu trabalho \
é CONSOLIDAR essas categorias numa lista única de classes candidatas: quando a mesma classe (ou \
conceito claramente equivalente) aparece em mais de uma categoria, funda-a numa só candidata, unindo \
os atributos e citando de quais categorias cada pedaço veio.

IMPORTANTE: isto é uma PROPOSTA para revisão humana, não a ontologia final. Baseie-se EXCLUSIVAMENTE \
no que já está modelado nas categorias recebidas — não reprocesse respostas ASD, não invente classe, \
atributo ou relação sem lastro no que foi capturado. Onde uma categoria já sinalizar \
"[requer pesquisa adicional]", propague a marcação no lugar correspondente em vez de resolvê-la.

REGRA CRÍTICA — classes são genéricas, não instâncias: as categorias recebidas já deveriam ter \
generalizado nomes próprios de organizações/atores específicos, mas se algum escapou (ex.: \
"PolíciaFederal" em vez de "ÓrgãoDeInvestigação"), corrija na consolidação — nome próprio nunca é \
nome de classe.

Seja conciso nos campos de texto livre — cada resposta consolida um domínio inteiro numa única \
mensagem, e prosa longa arrisca estourar o limite de saída. Em "justificativa", 1 frase curta \
basta; nunca repita a lista de categorias de origem por extenso ali — isso já está estruturado em \
"origemCategorias".

Responda APENAS com um bloco cercado \`\`\`DKD contendo um único objeto JSON, sem nenhum texto antes \
ou depois, no formato exato:

{
  "classes": [
    {
      "nome": "NomeDaClasseGenérica",
      "descricao": "papel da classe no domínio, em 1-2 frases",
      "justificativa": "por que existe / de onde veio; se fundida, cite as categorias e o motivo da fusão",
      "origemCategorias": ["slug-da-categoria-1", "slug-da-categoria-2"],
      "propriedades": [
        { "nome": "nomeDoAtributo", "descricao": "o que representa", "justificativa": "de onde veio / por que manter" }
      ]
    }
  ],
  "relacoes": [
    {
      "origem": "NomeDaClasseGenérica",
      "destino": "OutraClasseGenérica",
      "tipo": "TIPO_DO_RELACIONAMENTO",
      "justificativa": "por que existe; se fundida a partir de relações repetidas entre categorias, diga isso",
      "origemCategorias": ["slug-da-categoria-1"]
    }
  ]
}

Toda relação em "relacoes" deve referenciar, em "origem" e "destino", um "nome" que exista em "classes" \
— nunca referencie uma classe que você não incluiu na lista.

Escreva "descricao" e "justificativa" em português do Brasil.`;
}

/**
 * Consolida todas as categorias já capturadas na DKC (03-captura/*-entidades.md)
 * numa proposta única de classes/propriedades/relações, via LLM. Não grava nada —
 * devolve a proposta já validada para o chamador persistir (ver inserirProposta).
 */
async function compilarDKDParaDominio(slug) {
  const arquivos = listarCapturas(slug).filter((f) => f.endsWith('-entidades.md'));
  if (arquivos.length === 0) {
    throw new Error('Nenhuma categoria com entidades compiladas — rode a compilação de DKC antes.');
  }
  const consolidado = arquivos
    .map((arquivo) => `## Categoria: ${arquivo.replace(/-entidades\.md$/, '')}\n\n${lerCaptura(slug, arquivo)}`)
    .join('\n\n---\n\n');

  // A DKD consolida o domínio inteiro numa resposta só (ao contrário dos outros
  // compiladores, que rodam por categoria) — precisa de bem mais espaço de saída
  // do que o padrão de 64000 usado alhures. 128000 é o teto de saída de
  // claude-opus-5; chatComContinuacao ainda cobre o caso de um domínio tão
  // grande que estoure isso, retomando de onde o modelo parou em vez de
  // descartar e recomeçar do zero.
  const resposta = await llm.chatComContinuacao([
    { role: 'system', content: montarSystemPromptDKD(slug) },
    { role: 'user', content: `Categorias da DKC já capturadas para o domínio "${slug}":\n\n${consolidado}` },
  ], { maxTokens: 128000 });

  const m = resposta.match(BLOCO_RE);
  const erroFormato = (motivo) => {
    const arquivo = llm.avisarRespostaSemFormato(`compilar DKD — domínio "${slug}" (${motivo})`, resposta);
    return new Error(`O modelo não retornou a proposta de consolidação no formato esperado (${motivo}). Resposta bruta salva em ${arquivo}.`);
  };
  if (!m) throw erroFormato('bloco ```DKD ausente');

  let proposta;
  try {
    proposta = JSON.parse(m[1].trim());
  } catch (err) {
    throw erroFormato(`JSON inválido: ${err.message}`);
  }
  if (!proposta || !Array.isArray(proposta.classes) || !Array.isArray(proposta.relacoes)) {
    throw erroFormato('esperado {classes: [...], relacoes: [...]}');
  }
  const nomesClasses = new Set(proposta.classes.map((c) => c.nome));
  for (const rel of proposta.relacoes) {
    if (!nomesClasses.has(rel.origem) || !nomesClasses.has(rel.destino)) {
      throw erroFormato(`relação "${rel.origem} —${rel.tipo}→ ${rel.destino}" referencia classe inexistente`);
    }
  }
  return proposta;
}

// --- Persistência ---------------------------------------------------------

function existeEstadoDkd(slug) {
  const linha = conexao().prepare('SELECT COUNT(*) AS n FROM dkd_classes WHERE dominio = ?').get(slug);
  return linha.n > 0;
}

/**
 * Apaga todo o estado dkd_* de um domínio, na ordem que respeita as FKs
 * (relações e propriedades antes das classes que elas referenciam).
 */
function apagarEstadoDkd(slug) {
  const conn = conexao();
  const ids = conn.prepare('SELECT id FROM dkd_classes WHERE dominio = ?').all(slug).map((l) => l.id);
  if (ids.length === 0) return;
  const marcadores = ids.map(() => '?').join(',');
  conn.prepare(`DELETE FROM dkd_relacoes WHERE classe_origem_id IN (${marcadores}) OR classe_destino_id IN (${marcadores})`).run(...ids, ...ids);
  conn.prepare(`DELETE FROM dkd_propriedades WHERE classe_id IN (${marcadores})`).run(...ids);
  conn.prepare('DELETE FROM dkd_classes WHERE dominio = ?').run(slug);
}

/**
 * Grava a proposta validada (ver compilarDKDParaDominio) no banco, todas as
 * linhas como 'pendente'. Classes primeiro (para ter os ids), depois
 * propriedades e relações, resolvendo nome -> id pelo mapa construído na
 * própria inserção das classes.
 */
function inserirProposta(slug, proposta) {
  const conn = conexao();
  const agora = new Date().toISOString();
  const idPorNome = new Map();

  for (const classe of proposta.classes) {
    conn.prepare(
      `INSERT INTO dkd_classes (dominio, nome, descricao, justificativa, origem_categorias, manual, status, criado_em)
       VALUES (?, ?, ?, ?, ?, 0, 'pendente', ?)`
    ).run(slug, classe.nome, classe.descricao || null, classe.justificativa || null,
      JSON.stringify(classe.origemCategorias || []), agora);
    const id = conn.prepare('SELECT last_insert_rowid() AS id').get().id;
    idPorNome.set(classe.nome, id);

    for (const prop of (classe.propriedades || [])) {
      conn.prepare(
        `INSERT INTO dkd_propriedades (classe_id, nome, descricao, justificativa, manual, status)
         VALUES (?, ?, ?, ?, 0, 'pendente')`
      ).run(id, prop.nome, prop.descricao || null, prop.justificativa || null);
    }
  }

  for (const rel of proposta.relacoes) {
    conn.prepare(
      `INSERT INTO dkd_relacoes (classe_origem_id, classe_destino_id, tipo, justificativa, origem_categorias, manual, status)
       VALUES (?, ?, ?, ?, ?, 0, 'pendente')`
    ).run(idPorNome.get(rel.origem), idPorNome.get(rel.destino), rel.tipo,
      rel.justificativa || null, JSON.stringify(rel.origemCategorias || []));
  }
}

function daClasse(l) {
  return {
    id: l.id, nome: l.nome, descricao: l.descricao, justificativa: l.justificativa,
    origemCategorias: JSON.parse(l.origem_categorias || '[]'), manual: Boolean(l.manual), status: l.status,
  };
}

function daPropriedade(l) {
  return {
    id: l.id, classeId: l.classe_id, nome: l.nome, descricao: l.descricao,
    justificativa: l.justificativa, manual: Boolean(l.manual), status: l.status,
  };
}

function daRelacao(l, nomesPorId) {
  return {
    id: l.id, tipo: l.tipo, justificativa: l.justificativa,
    origemCategorias: JSON.parse(l.origem_categorias || '[]'), manual: Boolean(l.manual), status: l.status,
    classeOrigemId: l.classe_origem_id, classeDestinoId: l.classe_destino_id,
    classeOrigemNome: nomesPorId.get(l.classe_origem_id), classeDestinoNome: nomesPorId.get(l.classe_destino_id),
  };
}

/**
 * Classes com propriedades e relações-onde-é-origem aninhadas, mais o resumo
 * combinado (pendentes/mantidas/descartadas somando os três tipos de item) —
 * é o que a aba DKD do painel consome inteiro numa só chamada.
 */
function listarDkd(slug) {
  const conn = conexao();
  const classes = conn.prepare('SELECT * FROM dkd_classes WHERE dominio = ? ORDER BY nome').all(slug);
  const nomesPorId = new Map(classes.map((c) => [c.id, c.nome]));
  const propsPorClasse = new Map();
  const relsPorOrigem = new Map();

  if (classes.length > 0) {
    const ids = classes.map((c) => c.id);
    const marcadores = ids.map(() => '?').join(',');
    conn.prepare(`SELECT * FROM dkd_propriedades WHERE classe_id IN (${marcadores}) ORDER BY nome`).all(...ids)
      .forEach((p) => {
        if (!propsPorClasse.has(p.classe_id)) propsPorClasse.set(p.classe_id, []);
        propsPorClasse.get(p.classe_id).push(daPropriedade(p));
      });
    conn.prepare(`SELECT * FROM dkd_relacoes WHERE classe_origem_id IN (${marcadores}) ORDER BY tipo`).all(...ids)
      .forEach((r) => {
        if (!relsPorOrigem.has(r.classe_origem_id)) relsPorOrigem.set(r.classe_origem_id, []);
        relsPorOrigem.get(r.classe_origem_id).push(daRelacao(r, nomesPorId));
      });
  }

  const classesCompletas = classes.map((c) => ({
    ...daClasse(c),
    propriedades: propsPorClasse.get(c.id) || [],
    relacoes: relsPorOrigem.get(c.id) || [],
  }));

  const contagem = { pendentes: 0, mantidas: 0, descartadas: 0 };
  const somar = (status) => {
    if (status === 'pendente') contagem.pendentes += 1;
    else if (status === 'mantida') contagem.mantidas += 1;
    else if (status === 'descartada') contagem.descartadas += 1;
  };
  classes.forEach((c) => somar(c.status));
  [...propsPorClasse.values()].flat().forEach((p) => somar(p.status));
  [...relsPorOrigem.values()].flat().forEach((r) => somar(r.status));

  return { classes: classesCompletas, resumo: contagem };
}

function normalizarBusca(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Regras de nome dos elementos da ontologia: classe em PascalCase, atributo em
// camelCase, verbo em MAIÚSCULAS_COM_SUBLINHADO — com acentos, porque os nomes
// da DKD são em português. Usadas pelos ajustes manuais da Implementação
// (lib/ajustes/aplicar.js); a revisão da DKD não as aplica.
const REGRAS_NOME = {
  classe: { padrao: /^\p{Lu}[\p{L}\p{N}]*$/u, descricao: 'PascalCase (maiúscula inicial, só letras e dígitos)' },
  atributo: { padrao: /^\p{Ll}[\p{L}\p{N}]*$/u, descricao: 'camelCase (minúscula inicial, só letras e dígitos)' },
  verbo: { padrao: /^\p{Lu}[\p{Lu}\p{N}]*(?:_[\p{Lu}\p{N}]+)*$/u, descricao: 'MAIÚSCULAS_COM_SUBLINHADO' },
};

function motivoNomeInvalido(tipo, nome) {
  const regra = REGRAS_NOME[tipo];
  if (typeof nome === 'string' && regra.padrao.test(nome)) return null;
  return `o nome de ${tipo} "${nome}" está fora da regra: use ${regra.descricao}`;
}

/**
 * Uma classe com o mesmo formato de listarDkd(), mais relacoesComoDestino —
 * as relacoes de OUTRAS classes que apontam pra esta. listarDkd() só aninha
 * relacoes onde a classe é origem; o assistente da DKD (Task 4+) precisa dos
 * dois sentidos pra responder "quem aponta pra essa classe" sem o chamador
 * ter que varrer o dominio inteiro toda vez.
 */
function buscarClassePorNome(slug, nome) {
  const { classes } = listarDkd(slug);
  const alvo = normalizarBusca(nome);
  const classe = classes.find((c) => normalizarBusca(c.nome) === alvo);
  if (!classe) return null;
  const relacoesComoDestino = classes
    .flatMap((c) => c.relacoes.map((r) => ({ ...r, classeOrigemNomeReal: c.nome })))
    .filter((r) => r.classeDestinoId === classe.id)
    .map((r) => ({
      id: r.id, tipo: r.tipo, justificativa: r.justificativa, status: r.status, manual: r.manual,
      classeOrigemId: r.classeOrigemId, classeOrigemNome: r.classeOrigemNomeReal,
    }));
  return { ...classe, relacoesComoDestino };
}

function listarNomesClasses(slug, filtro) {
  const { classes } = listarDkd(slug);
  const alvo = filtro ? normalizarBusca(filtro) : '';
  return classes
    .filter((c) => !alvo || normalizarBusca(c.nome).includes(alvo))
    .map((c) => ({ nome: c.nome, status: c.status }));
}

function listarVocabularioRelacao(slug, termo) {
  const { classes } = listarDkd(slug);
  const alvo = termo ? normalizarBusca(termo) : '';
  const tipos = new Set();
  classes.forEach((c) => c.relacoes.forEach((r) => {
    if (!alvo || normalizarBusca(r.tipo).includes(alvo)) tipos.add(r.tipo);
  }));
  return [...tipos].sort();
}

const STATUS_VALIDOS = new Set(['mantida', 'descartada']);

/**
 * Descartar uma classe descarta em cascata suas próprias propriedades e as
 * relações em que ela é origem ou destino — uma propriedade ou relação de
 * classe descartada não tem sentido ficar mantida/pendente (decidirRelacao já
 * recusa "mantida" nesse caso; aqui fechamos o outro lado: nada fica pra trás
 * bloqueando resumo.pendentes). Não propaga além disso — uma classe do outro
 * lado de uma relação descartada continua decidida por si mesma.
 */
function decidirClasse(id, status) {
  if (!STATUS_VALIDOS.has(status)) throw new Error('Status inválido — use "mantida" ou "descartada".');
  const conn = conexao();
  const info = conn.prepare('UPDATE dkd_classes SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) throw new Error('Classe não encontrada.');
  if (status === 'descartada') {
    conn.prepare('UPDATE dkd_propriedades SET status = ? WHERE classe_id = ?').run('descartada', id);
    conn.prepare('UPDATE dkd_relacoes SET status = ? WHERE classe_origem_id = ? OR classe_destino_id = ?').run('descartada', id, id);
  }
}

/**
 * Renomeia uma classe. Seguro sem cascata: relações referenciam classe por id
 * (classe_origem_id/classe_destino_id), nunca por nome, e listarDkd/
 * gravarOntologiaPreliminar sempre leem o nome atual do banco — não existe
 * nome duplicado em cache pra atualizar em outro lugar.
 */
function renomearClasse(id, novoNome) {
  if (typeof novoNome !== 'string' || !novoNome.trim()) throw new Error('Informe o novo nome da classe.');
  const nome = novoNome.trim();
  const conn = conexao();
  const atual = conn.prepare('SELECT dominio FROM dkd_classes WHERE id = ?').get(id);
  if (!atual) throw new Error('Classe não encontrada.');
  const alvo = normalizarBusca(nome);
  const outras = conn.prepare('SELECT nome FROM dkd_classes WHERE dominio = ? AND id != ?').all(atual.dominio, id);
  if (outras.some((c) => normalizarBusca(c.nome) === alvo)) {
    throw new Error(`Já existe uma classe chamada "${nome}" neste domínio.`);
  }
  conn.prepare('UPDATE dkd_classes SET nome = ? WHERE id = ?').run(nome, id);
}

function decidirPropriedade(id, status) {
  if (!STATUS_VALIDOS.has(status)) throw new Error('Status inválido — use "mantida" ou "descartada".');
  const info = conexao().prepare('UPDATE dkd_propriedades SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) throw new Error('Propriedade não encontrada.');
}

/**
 * Recusa "mantida" se a classe de origem ou destino não estiver mantida —
 * evita uma relação apontando para uma classe que a revisão já descartou
 * (ou que ainda nem foi decidida).
 */
function decidirRelacao(id, status) {
  if (!STATUS_VALIDOS.has(status)) throw new Error('Status inválido — use "mantida" ou "descartada".');
  const conn = conexao();
  if (status === 'mantida') {
    const rel = conn.prepare('SELECT classe_origem_id, classe_destino_id FROM dkd_relacoes WHERE id = ?').get(id);
    if (!rel) throw new Error('Relação não encontrada.');
    const origem = conn.prepare('SELECT status FROM dkd_classes WHERE id = ?').get(rel.classe_origem_id);
    const destino = conn.prepare('SELECT status FROM dkd_classes WHERE id = ?').get(rel.classe_destino_id);
    if (!origem || origem.status !== 'mantida' || !destino || destino.status !== 'mantida') {
      throw new Error('Não é possível manter uma relação cuja classe de origem ou destino não está mantida.');
    }
  }
  const info = conn.prepare('UPDATE dkd_relacoes SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) throw new Error('Relação não encontrada.');
}

function adicionarClasseManual(slug, { nome, descricao }) {
  if (typeof nome !== 'string' || !nome.trim()) throw new Error('Informe o nome da classe.');
  const conn = conexao();
  conn.prepare(
    `INSERT INTO dkd_classes (dominio, nome, descricao, justificativa, origem_categorias, manual, status, criado_em)
     VALUES (?, ?, ?, NULL, '[]', 1, 'mantida', ?)`
  ).run(slug, nome.trim(), descricao || null, new Date().toISOString());
  const id = conn.prepare('SELECT last_insert_rowid() AS id').get().id;
  return { id, nome: nome.trim(), descricao: descricao || null };
}

function adicionarPropriedadeManual(slug, { classeId, nome, descricao }) {
  if (typeof nome !== 'string' || !nome.trim()) throw new Error('Informe o nome da propriedade.');
  const conn = conexao();
  const classe = conn.prepare('SELECT id FROM dkd_classes WHERE id = ? AND dominio = ?').get(classeId, slug);
  if (!classe) throw new Error('Classe não encontrada.');
  conn.prepare(
    `INSERT INTO dkd_propriedades (classe_id, nome, descricao, justificativa, manual, status)
     VALUES (?, ?, ?, NULL, 1, 'mantida')`
  ).run(classeId, nome.trim(), descricao || null);
  const id = conn.prepare('SELECT last_insert_rowid() AS id').get().id;
  return { id, classeId, nome: nome.trim(), descricao: descricao || null };
}

function adicionarRelacaoManual(slug, { origemId, destinoId, tipo, justificativa }) {
  if (typeof tipo !== 'string' || !tipo.trim()) throw new Error('Informe o tipo da relação.');
  const conn = conexao();
  const origem = conn.prepare('SELECT id FROM dkd_classes WHERE id = ? AND dominio = ?').get(origemId, slug);
  const destino = conn.prepare('SELECT id FROM dkd_classes WHERE id = ? AND dominio = ?').get(destinoId, slug);
  if (!origem || !destino) throw new Error('Classe de origem ou destino não encontrada.');
  conn.prepare(
    `INSERT INTO dkd_relacoes (classe_origem_id, classe_destino_id, tipo, justificativa, origem_categorias, manual, status)
     VALUES (?, ?, ?, ?, '[]', 1, 'mantida')`
  ).run(origemId, destinoId, tipo.trim(), justificativa || null);
  const id = conn.prepare('SELECT last_insert_rowid() AS id').get().id;
  return { id, origemId, destinoId, tipo: tipo.trim(), justificativa: justificativa || null };
}

/**
 * Gera 04-ontologia-preliminar.md a partir dos itens 'mantida'. Recusa
 * enquanto houver qualquer pendente — nada entra no artefato final sem
 * decisão humana explícita.
 */
function gravarOntologiaPreliminar(slug) {
  const { classes, resumo } = listarDkd(slug);
  if (resumo.pendentes > 0) {
    throw new Error(`Ainda há ${resumo.pendentes} item(ns) pendente(s) de decisão.`);
  }
  const classesMantidas = classes.filter((c) => c.status === 'mantida');
  if (classesMantidas.length === 0) {
    throw new Error('Nenhuma classe mantida — nada para gravar.');
  }
  const idsMantidos = new Set(classesMantidas.map((c) => c.id));

  const totalRelacoes = classesMantidas.reduce((n, c) => n + c.relacoes.filter((r) => r.status === 'mantida' && idsMantidos.has(r.classeDestinoId)).length, 0);
  const totalDescartadas = classes.filter((c) => c.status === 'descartada').length
    + classes.flatMap((c) => c.propriedades).filter((p) => p.status === 'descartada').length
    + classes.flatMap((c) => c.relacoes).filter((r) => r.status === 'descartada').length;
  const totalManuais = classes.filter((c) => c.manual).length
    + classes.flatMap((c) => c.propriedades).filter((p) => p.manual).length
    + classes.flatMap((c) => c.relacoes).filter((r) => r.manual).length;

  let md = `# Ontologia preliminar — ${slug}\n> Consolidada a partir da DKC. ${classesMantidas.length} classes e ${totalRelacoes} relações mantidas (${totalDescartadas} descartadas na revisão, ${totalManuais} adicionadas manualmente).\n\n## Classes\n\n`;

  const fundidas = [];
  for (const classe of classesMantidas) {
    md += `### ${classe.nome}\n`;
    if (classe.descricao) md += `${classe.descricao}\n`;
    if (classe.manual) {
      md += `*(adicionado manualmente na revisão)*\n`;
    } else {
      if (classe.origemCategorias.length) md += `Consolidada a partir de: ${classe.origemCategorias.join(', ')}.\n`;
      if (classe.justificativa) md += `Justificativa: ${classe.justificativa}\n`;
      if (classe.origemCategorias.length > 1) {
        fundidas.push(`- **${classe.nome}**: unificada a partir de ${classe.origemCategorias.length} categorias — ${classe.justificativa || 'ver justificativa acima'}.`);
      }
    }
    const propsMantidas = classe.propriedades.filter((p) => p.status === 'mantida');
    if (propsMantidas.length) {
      md += `\n**Atributos:**\n`;
      propsMantidas.forEach((p) => {
        const marca = p.manual ? ' *(adicionado manualmente na revisão)*' : '';
        md += `- ${p.nome}${p.descricao ? ` — ${p.descricao}` : ''}${marca}\n`;
      });
    }
    md += '\n';
  }

  md += `## Relações\n\n| Origem | Relação | Destino | Observação |\n|---|---|---|---|\n`;
  for (const classe of classesMantidas) {
    classe.relacoes.filter((r) => r.status === 'mantida' && idsMantidos.has(r.classeDestinoId)).forEach((r) => {
      const marca = r.manual ? '*(adicionado manualmente na revisão)*' : '';
      md += `| ${classe.nome} | ${r.tipo} | ${r.classeDestinoNome} | ${marca} |\n`;
    });
  }

  md += `\n## Diagrama\n\n\`\`\`mermaid\nclassDiagram\n`;
  for (const classe of classesMantidas) {
    classe.relacoes.filter((r) => r.status === 'mantida' && idsMantidos.has(r.classeDestinoId)).forEach((r) => {
      md += `  ${classe.nome} --> ${r.classeDestinoNome} : ${r.tipo}\n`;
    });
  }
  md += `\`\`\`\n`;

  if (fundidas.length) {
    md += `\n## Registro de fusões\n${fundidas.join('\n')}\n`;
  }

  const destino = ontologiaPreliminarPath(slug);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, md, 'utf8');
  return destino;
}

module.exports = {
  compilarDKDParaDominio,
  existeOntologiaPreliminar,
  apagarOntologiaPreliminar,
  existeEstadoDkd,
  apagarEstadoDkd,
  inserirProposta,
  listarDkd,
  buscarClassePorNome,
  listarNomesClasses,
  listarVocabularioRelacao,
  decidirClasse,
  decidirPropriedade,
  decidirRelacao,
  renomearClasse,
  adicionarClasseManual,
  adicionarPropriedadeManual,
  adicionarRelacaoManual,
  gravarOntologiaPreliminar,
  normalizarBusca,
  REGRAS_NOME,
  motivoNomeInvalido,
};
