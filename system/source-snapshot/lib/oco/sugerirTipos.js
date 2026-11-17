'use strict';

// Sugestão de tipos de dados (xsd) por LLM, para os atributos da DKD ainda sem
// tipo decidido na Construção. O modelo só sugere: a sugestão fica em
// oco_sugestoes_tipos e só vira decisão (oco_tipos_dados) quando o humano a
// aplica. Resposta fora do formato, com atributo que não está pendente, tipo
// fora da lista ou sem justificativa recusa tudo, e a resposta bruta fica salva.

const { conexao } = require('../db');
const llm = require('../llm');
const compilarDKD = require('../compilarDKD');
const { classesMantidas } = require('./gerador');
const { falha, TIPOS_XSD } = require('./constantes');
const { listarAtributos, ontologiaAjustada } = require('./decisoes');

const BLOCO_TIPOS_RE = /```TIPOS\b\s*([\s\S]*?)```/;

function montarSystemPrompt(slug) {
  return `Você apoia a subfase OCO (Ontology Construction) de um processo de construção de \
ontologia, para o domínio "${slug}". Você recebe atributos (data properties) da ontologia \
preliminar (DKD), cada um com as classes onde aparece e a descrição registrada na DKD.

Para cada atributo, sugira o tipo de dado XSD mais adequado, escolhendo EXCLUSIVAMENTE entre: \
${TIPOS_XSD.join(', ')}.

Critérios:
- Baseie-se no nome E na descrição. Identificadores, códigos, números de documento, matrícula, \
placa, protocolo e referências são "string" (podem ter letras, zeros à esquerda ou pontuação), \
mesmo que o nome comece por "numero".
- Datas e instantes são "dateTime". Valores monetários, percentuais e medidas são "decimal". \
Contagens são "integer". Indicadores sim/não são "boolean". Endereços web são "anyURI".
- Se a descrição não permitir decidir com segurança, NÃO inclua o atributo na resposta — ele \
continuará como texto (string) até um humano decidir. Não invente informação.

Seja conciso em "justificativa" — 1 frase curta, citando o que na descrição ou no nome levou à \
escolha. Escreva em português do Brasil.

Responda APENAS com um bloco cercado \`\`\`TIPOS contendo um único objeto JSON, sem texto antes \
ou depois, no formato exato:

{
  "tipos": [
    { "atributo": "dataDeAquisicao", "tipo": "dateTime", "justificativa": "..." }
  ]
}`;
}

function descricoesPorAtributo(dkd) {
  const descricoes = new Map();
  for (const c of classesMantidas(dkd)) {
    for (const p of (c.propriedades || []).filter((x) => x.status === 'mantida')) {
      if (!descricoes.has(p.nome)) descricoes.set(p.nome, new Set());
      if (typeof p.descricao === 'string' && p.descricao.trim()) descricoes.get(p.nome).add(p.descricao.trim());
    }
  }
  return descricoes;
}

async function sugerirTiposComIa(slug) {
  // A ontologia ajustada: atributo renomeado ou criado por ajuste leva a descrição.
  const dkd = compilarDKD.listarDkd(slug);
  const ajustada = ontologiaAjustada(slug, { dkd });
  const pendentes = listarAtributos(slug, dkd, ajustada).filter((a) => !a.tipo);
  if (!pendentes.length) throw falha(409, 'Todos os atributos já têm tipo decidido — nada a sugerir.');
  const descricoes = descricoesPorAtributo(ajustada.insumos.dkd);

  const textoAtributos = pendentes.map((a) => {
    const desc = [...(descricoes.get(a.nome) || [])].join(' / ');
    return `- ${a.nome} (classes: ${a.classes.join(', ')})${desc ? `: ${desc}` : ': [sem descrição na DKD]'}`;
  }).join('\n');

  const resposta = await llm.chatComContinuacao([
    { role: 'system', content: montarSystemPrompt(slug) },
    { role: 'user', content: `Atributos sem tipo decidido do domínio "${slug}":\n${textoAtributos}` },
  ], { maxTokens: 32000 });

  const recusar = (motivo) => {
    const arquivo = llm.avisarRespostaSemFormato(`sugerir tipos — domínio "${slug}" (${motivo})`, resposta);
    return falha(502, `Sugestão do modelo recusada (${motivo}). Nada foi gravado. Resposta bruta salva em ${arquivo}.`);
  };
  const m = typeof resposta === 'string' ? resposta.match(BLOCO_TIPOS_RE) : null;
  if (!m) throw recusar('bloco ```TIPOS ausente');
  let proposta;
  try {
    proposta = JSON.parse(m[1].trim());
  } catch (err) {
    throw recusar(`JSON inválido: ${err.message}`);
  }
  if (!proposta || !Array.isArray(proposta.tipos)) throw recusar('esperado {tipos: [...]}');

  const nomesPendentes = new Set(pendentes.map((a) => a.nome));
  const vistos = new Set();
  for (const t of proposta.tipos) {
    const naoTexto = ['atributo', 'tipo', 'justificativa'].find((c) => typeof (t || {})[c] !== 'string');
    if (naoTexto) throw recusar(`campo "${naoTexto}" não é texto`);
    if (!nomesPendentes.has(t.atributo)) throw recusar(`"${t.atributo}" não é atributo sem tipo decidido na DKD`);
    if (!TIPOS_XSD.includes(t.tipo)) throw recusar(`tipo "${t.tipo}" inválido para "${t.atributo}"`);
    if (!t.justificativa.trim()) throw recusar(`"${t.atributo}" sem justificativa`);
    if (vistos.has(t.atributo)) throw recusar(`atributo "${t.atributo}" repetido`);
    vistos.add(t.atributo);
  }

  const { provider, model } = llm.descreverConfig();
  const modelo = `${model} (${provider})`;
  const agora = new Date().toISOString();
  const conn = conexao();
  conn.exec('BEGIN');
  try {
    // Uma nova sugestão substitui a anterior dos atributos pendentes; o que o
    // modelo omitiu fica sem sugestão da IA (volta à regra de nome, se houver).
    const apagar = conn.prepare('DELETE FROM oco_sugestoes_tipos WHERE dominio = ? AND atributo = ?');
    for (const nome of nomesPendentes) apagar.run(slug, nome);
    const ins = conn.prepare(
      'INSERT INTO oco_sugestoes_tipos (dominio, atributo, tipo_xsd, justificativa, modelo, gerado_em) VALUES (?, ?, ?, ?, ?, ?)'
    );
    for (const t of proposta.tipos) ins.run(slug, t.atributo, t.tipo, t.justificativa.trim(), modelo, agora);
    conn.exec('COMMIT');
  } catch (err) {
    conn.exec('ROLLBACK');
    throw err;
  }
  return { sugeridos: proposta.tipos.length, semSugestao: pendentes.length - proposta.tipos.length, modelo };
}

module.exports = { sugerirTiposComIa };
