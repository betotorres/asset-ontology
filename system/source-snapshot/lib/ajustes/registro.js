'use strict';

// Registro dos ajustes manuais estruturais (etapa ④ da Implementação): uma
// linha por ajuste, com lastro (motivo + fonte), autor e data. Desfazer só
// marca — o histórico não se apaga. Aqui fica só o que não depende da
// ontologia; alvo existente, nomes, ciclos e dependências são de aplicar.js.

const { conexao } = require('../db');
const { falha } = require('../oco/constantes');

const OPERACOES = [
  'adicionar_superclasse', 'remover_superclasse', 'criar_classe', 'remover_classe', 'alterar_classe',
  'adicionar_atributo', 'remover_atributo', 'alterar_atributo',
  'adicionar_relacao', 'remover_relacao', 'alterar_relacao',
];

// A fonte separa ajuste com evidência de decisão de modelagem: o registro torna
// visível quanto da ontologia final se apoia em julgamento (HiPPO).
const FONTES = ['especialista', 'metadado', 'norma', 'ontologia_externa', 'modelagem'];
const ROTULO_FONTE = {
  especialista: 'especialista do domínio',
  metadado: 'metadado de sistema',
  norma: 'norma ou regulamento',
  ontologia_externa: 'ontologia externa',
  modelagem: 'decisão de modelagem',
};

const ROTULO_OPERACAO = {
  adicionar_superclasse: 'Adicionar superclasse',
  remover_superclasse: 'Remover superclasse',
  criar_classe: 'Criar classe',
  remover_classe: 'Remover classe',
  alterar_classe: 'Alterar definição de classe',
  adicionar_atributo: 'Adicionar atributo',
  remover_atributo: 'Remover atributo',
  alterar_atributo: 'Alterar atributo',
  adicionar_relacao: 'Adicionar relação',
  remover_relacao: 'Remover relação',
  alterar_relacao: 'Alterar relação',
};

const rotulo = (id) => `AJ-${id}`;

function texto(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

// O alvo do ajuste em uma linha legível (registro na tela e no 04-).
function alvo(operacao, p = {}) {
  const rel = (o, v, d) => `${o} ${v} ${d}`;
  switch (operacao) {
    case 'adicionar_superclasse':
    case 'remover_superclasse':
      return `${p.classe} ⊂ ${p.superclasse}`;
    case 'criar_classe':
      return p.superclasse ? `${p.nome} ⊂ ${p.superclasse}` : String(p.nome);
    case 'remover_classe':
      return String(p.nome);
    case 'alterar_classe':
      return `${p.nome} (definição)`;
    case 'adicionar_atributo':
      return `${p.classe}.${p.nome} (xsd:${p.tipo})`;
    case 'remover_atributo':
      return `${p.classe}.${p.nome}`;
    case 'alterar_atributo':
      return `${p.classe}.${p.nome} → ${p.novaClasse || p.classe}.${p.novoNome || p.nome}${p.tipo ? ` (xsd:${p.tipo})` : ''}`;
    case 'adicionar_relacao':
    case 'remover_relacao':
      return rel(p.origem, p.verbo, p.destino);
    case 'alterar_relacao':
      return `${rel(p.origem, p.verbo, p.destino)} → ${rel(p.novaOrigem || p.origem, p.novoVerbo || p.verbo, p.novoDestino || p.destino)}`;
    default:
      return '';
  }
}

function validarLastro({ operacao, parametros, motivo, fonte } = {}) {
  if (!OPERACOES.includes(operacao)) throw falha(400, `Operação inválida: use ${OPERACOES.join(', ')}.`);
  if (!parametros || typeof parametros !== 'object' || Array.isArray(parametros)) throw falha(400, 'Informe os parâmetros da operação.');
  if (!texto(motivo)) throw falha(400, 'Informe o motivo do ajuste: nada entra sem lastro.');
  if (!texto(fonte)) throw falha(400, 'Informe a fonte do ajuste: nada entra sem lastro.');
  if (!FONTES.includes(fonte)) throw falha(400, `Fonte inválida: use ${FONTES.join(', ')}.`);
}

function daLinha(l) {
  const parametros = JSON.parse(l.parametros);
  return {
    id: l.id, rotulo: rotulo(l.id), operacao: l.operacao, rotuloOperacao: ROTULO_OPERACAO[l.operacao] || l.operacao,
    alvo: alvo(l.operacao, parametros), parametros, motivo: l.motivo, fonte: l.fonte, autor: l.autor, criadoEm: l.criado_em,
    situacao: l.situacao, desfeitoEm: l.desfeito_em, desfeitoPor: l.desfeito_por,
  };
}

function obter(slug, id) {
  const l = conexao().prepare('SELECT * FROM ajustes WHERE id = ? AND dominio = ?').get(id, slug);
  return l ? daLinha(l) : null;
}

function listar(slug) {
  return conexao().prepare('SELECT * FROM ajustes WHERE dominio = ? ORDER BY id').all(slug).map(daLinha);
}

function listarAtivos(slug) {
  return listar(slug).filter((a) => a.situacao === 'ativo');
}

// Grava um ajuste já validado contra a ontologia (ver lib/ajustes/estado.js).
// O autor vem da sessão do administrador, nunca do corpo da requisição.
function inserir(slug, { operacao, parametros, motivo, fonte } = {}, autor, { agora = new Date().toISOString() } = {}) {
  validarLastro({ operacao, parametros, motivo, fonte });
  if (!texto(autor)) throw falha(400, 'Autor do ajuste não identificado.');
  const conn = conexao();
  conn.prepare(
    'INSERT INTO ajustes (dominio, operacao, parametros, motivo, fonte, autor, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(slug, operacao, JSON.stringify(parametros), motivo.trim(), fonte, autor.trim(), agora);
  return obter(slug, Number(conn.prepare('SELECT last_insert_rowid() AS id').get().id));
}

function marcarDesfeito(slug, id, autor, { agora = new Date().toISOString() } = {}) {
  const ajuste = obter(slug, id);
  if (!ajuste) throw falha(404, 'Ajuste não encontrado.');
  if (ajuste.situacao === 'desfeito') throw falha(409, `${ajuste.rotulo} já foi desfeito.`);
  if (!texto(autor)) throw falha(400, 'Autor do desfazer não identificado.');
  conexao().prepare("UPDATE ajustes SET situacao = 'desfeito', desfeito_em = ?, desfeito_por = ? WHERE id = ?").run(agora, autor.trim(), id);
  return obter(slug, id);
}

module.exports = {
  OPERACOES, FONTES, ROTULO_FONTE, ROTULO_OPERACAO, rotulo, alvo, validarLastro, obter, listar, listarAtivos, inserir, marcarDesfeito,
};
