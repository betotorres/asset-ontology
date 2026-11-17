'use strict';

// Catálogo global de IRIs externas. Resolução automática pela fonte em cache
// (casamento exato normalizado de rótulo ou nome local), com fallback manual —
// IRI só vira "confirmada" com evidência. Sem LLM, sem busca na web.

const { conexao } = require('../db');
const fontes = require('./fontes');
const { buscar } = require('./indice');
const { falha, iriHttpValida, STATUS_IRI } = require('./constantes');

function daIri(l) {
  return {
    id: l.id, ontologiaId: l.ontologia_id, sigla: l.sigla, termo: l.termo, tipoTermo: l.tipo_termo, iri: l.iri, status: l.status,
    candidatos: l.candidatos ? JSON.parse(l.candidatos) : [], evidencia: l.evidencia, origem: l.origem, resolvidoEm: l.resolvido_em,
  };
}

const SELECT_IRI = `SELECT i.*, f.sigla FROM oco_iris i LEFT JOIN oco_fontes_ontologia f ON f.ontologia_id = i.ontologia_id`;

function listarIris({ status } = {}) {
  if (status && !STATUS_IRI.includes(status)) throw falha(400, `Status inválido: use ${STATUS_IRI.join(', ')}.`);
  const sql = `${SELECT_IRI} ${status ? 'WHERE i.status = ?' : ''} ORDER BY f.sigla, i.termo`;
  return (status ? conexao().prepare(sql).all(status) : conexao().prepare(sql).all()).map(daIri);
}

function contarIris() {
  const contagem = Object.fromEntries(STATUS_IRI.map((s) => [s, 0]));
  for (const l of conexao().prepare('SELECT status, COUNT(*) AS n FROM oco_iris GROUP BY status').all()) contagem[l.status] = l.n;
  return contagem;
}

function buscarIri(id) {
  const l = conexao().prepare(`${SELECT_IRI} WHERE i.id = ?`).get(Number(id));
  if (!l) throw falha(404, 'IRI não encontrada.');
  return daIri(l);
}

function tipoEsperado(tipoTermo) {
  if (!tipoTermo) return null;
  return tipoTermo === 'classe' ? 'classe' : 'propriedade';
}

async function resolverIri(id) {
  const item = buscarIri(id);
  if (item.status === 'confirmada') throw falha(409, 'Este termo já está confirmado.');
  const fonte = fontes.buscarFonte(item.ontologiaId);
  if (fonte.modo === 'desenho') throw falha(409, `${fonte.sigla} está em modo desenho e não usa IRI.`);
  if (!fonte.fonteUrl) throw falha(409, `${fonte.sigla} não tem fonte legível por máquina — informe a IRI manualmente.`);
  const indice = await fontes.indiceDaFonte(fonte);
  // IRI do arquivo da fonte passa pela mesma regra da manual antes de virar candidata.
  const candidatos = buscar(indice, item.termo, tipoEsperado(item.tipoTermo)).filter((c) => iriHttpValida(c.iri));
  const agora = new Date().toISOString();
  const conn = conexao();
  if (candidatos.length === 1) {
    const [c] = candidatos;
    const evidencia = `${fonte.fonteUrl} (versão ${fonte.versao || 'não registrada'}), rótulo '${c.rotulo}'`;
    conn.prepare(`UPDATE oco_iris SET iri = ?, tipo_termo = ?, status = 'confirmada', candidatos = NULL, evidencia = ?, origem = 'automatico', resolvido_em = ? WHERE id = ?`)
      .run(c.iri, c.tipo, evidencia, agora, item.id);
  } else if (candidatos.length > 1) {
    conn.prepare(`UPDATE oco_iris SET iri = NULL, status = 'ambigua', candidatos = ?, evidencia = NULL, origem = 'automatico', resolvido_em = ? WHERE id = ?`)
      .run(JSON.stringify(candidatos.map((c) => ({ iri: c.iri, tipo: c.tipo, rotulo: c.rotulo }))), agora, item.id);
  } else {
    conn.prepare(`UPDATE oco_iris SET iri = NULL, status = 'nao_encontrada', candidatos = NULL, evidencia = NULL, origem = 'automatico', resolvido_em = ? WHERE id = ?`)
      .run(agora, item.id);
  }
  return buscarIri(item.id);
}

async function resolverPendentes() {
  const resultado = { confirmadas: 0, ambiguas: 0, naoEncontradas: 0, ignoradas: [] };
  for (const item of listarIris({ status: 'pendente' })) {
    try {
      const r = await resolverIri(item.id);
      if (r.status === 'confirmada') resultado.confirmadas++;
      else if (r.status === 'ambigua') resultado.ambiguas++;
      else resultado.naoEncontradas++;
    } catch (err) {
      if (!err.status || err.status >= 500) throw err;
      resultado.ignoradas.push({ sigla: item.sigla, termo: item.termo, motivo: err.message });
    }
  }
  return resultado;
}

// Registro humano: IRI e evidência obrigatórias. Para termo ambíguo, escolher
// um dos candidatos dispensa evidência digitada (a fonte é a evidência).
function registrarManual(id, { iri, evidencia } = {}) {
  const item = buscarIri(id);
  const valor = String(iri || '').trim();
  if (!iriHttpValida(valor)) throw falha(400, 'Informe uma IRI http(s) válida (sem espaços nem < > " { } | \\ ^ `).');
  let texto = String(evidencia || '').trim();
  if (!texto && item.status === 'ambigua' && item.candidatos.some((c) => c.iri === valor)) {
    const fonte = fontes.buscarFonte(item.ontologiaId);
    texto = `Escolha humana entre ${item.candidatos.length} candidatos de ${fonte.fonteUrl} (versão ${fonte.versao || 'não registrada'})`;
  }
  if (!texto) throw falha(400, 'Informe a evidência (onde a IRI foi confirmada).');
  const candidato = item.candidatos.find((c) => c.iri === valor);
  conexao().prepare(`UPDATE oco_iris SET iri = ?, tipo_termo = COALESCE(?, tipo_termo), status = 'confirmada', candidatos = NULL, evidencia = ?, origem = 'manual', resolvido_em = ? WHERE id = ?`)
    .run(valor, candidato ? candidato.tipo : null, texto, new Date().toISOString(), item.id);
  return buscarIri(item.id);
}

module.exports = { listarIris, contarIris, buscarIri, resolverIri, resolverPendentes, registrarManual };
