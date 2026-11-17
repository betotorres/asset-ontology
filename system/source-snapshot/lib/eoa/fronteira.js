'use strict';

// Fronteira do Alinhamento (EOA), spec 1.1: o que a revisão ORR autoriza.
// Classes: só pares (classe, ontologia, termo) mantidos como correspondência.
// Relações: só ontologias elegíveis (selecionadas no domínio e com ao menos um
// par mantido) e termos que constam no resumo de conceitos do catálogo.
// Módulo sem dependência de lib/oco/decisoes.js: a Construção também o usa
// para detectar órfãos.

const { conexao } = require('../db');
const compilarOrr = require('../compilarOrr');
const { falha, TIPOS_MAPEAMENTO } = require('../oco/constantes');

function chavePar(classe, ontologiaId, termo) {
  return `${classe}|${ontologiaId}|${termo}`;
}

function chaveRelacao(origem, verbo, destino) {
  return `${origem}|${verbo}|${destino}`;
}

// Correspondências mantidas na revisão ORR do domínio.
function paresOrr(slug) {
  return conexao().prepare(
    `SELECT classe_nossa, ontologia_id, conceito_externo, justificativa FROM orr_conceitos
     WHERE dominio = ? AND tipo = 'correspondencia' AND status = 'mantida'
       AND ontologia_id IS NOT NULL AND classe_nossa IS NOT NULL AND conceito_externo IS NOT NULL
     ORDER BY classe_nossa, ontologia_id, conceito_externo, id`
  ).all(slug).map((l) => ({ classe: l.classe_nossa, ontologiaId: l.ontologia_id, termo: l.conceito_externo, justificativa: l.justificativa }));
}

// Sigla e modo de reuso por ontologia. Ontologia sem fonte cadastrada não
// aparece aqui: o modo dela é desconhecido (null) — ver motivoTipoInvalido.
function fontesPorOntologia() {
  return new Map(conexao().prepare('SELECT ontologia_id, sigla, modo_reuso FROM oco_fontes_ontologia').all()
    .map((l) => [l.ontologia_id, { sigla: l.sigla, modo: l.modo_reuso }]));
}

// Catálogo inteiro com sigla e modo, por id.
function ontologiasPorId() {
  const fontes = fontesPorOntologia();
  return new Map(compilarOrr.listarOntologias().map((o) => [o.id, {
    id: o.id, nome: o.nome, resumoDeConceitos: o.resumoDeConceitos,
    sigla: fontes.has(o.id) ? fontes.get(o.id).sigla : null, modo: fontes.has(o.id) ? fontes.get(o.id).modo : null,
  }]));
}

// Ontologias que podem fornecer propriedades: selecionadas no domínio E com ao
// menos um par mantido no ORR (ontologia toda descartada fica fora).
function ontologiasElegiveis(slug) {
  const selecionadas = new Set(compilarOrr.listarIdsSelecionados(slug));
  const comPar = new Set(paresOrr(slug).map((p) => p.ontologiaId));
  return [...ontologiasPorId().values()].filter((o) => selecionadas.has(o.id) && comPar.has(o.id));
}

// O termo consta no resumo como palavra inteira, sem diferenciar caixa.
function termoNoResumo(resumo, termo) {
  if (typeof termo !== 'string' || !termo.trim()) return false;
  const literal = termo.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}_])${literal}(?![\\p{L}\\p{N}_])`, 'iu').test(String(resumo || ''));
}

// Mesma regra de importar e de fontes.atualizarFonte: 'desenho' só em fonte
// modo desenho, e fonte modo desenho só aceita 'desenho'. Ontologia sem fonte
// cadastrada (modo null) aceita qualquer tipo: o modo ainda não foi decidido, e
// é o cadastro da fonte que confere as linhas vivas (conferirModoContraMapeamentos).
// Sem isso, uma linha nascida antes do cadastro não teria como virar 'desenho'.
function motivoTipoInvalido(tipo, modo) {
  if (!TIPOS_MAPEAMENTO.includes(tipo)) return `tipo "${tipo}" inválido (use ${TIPOS_MAPEAMENTO.join(', ')})`;
  if (modo === null || modo === undefined) return null;
  if ((tipo === 'desenho') !== (modo === 'desenho')) return 'tipo "desenho" só vale para ontologia em modo desenho, e ontologia em modo desenho só aceita "desenho"';
  return null;
}

function exigirTipo(tipo, modo) {
  const motivo = motivoTipoInvalido(tipo, modo);
  if (motivo) throw falha(400, `Tipo recusado: ${motivo}.`);
}

// Leitura única da fronteira do domínio, para conferir várias linhas.
function contexto(slug) {
  return {
    chavesOrr: new Set(paresOrr(slug).map((p) => chavePar(p.classe, p.ontologiaId, p.termo))),
    idsElegiveis: new Set(ontologiasElegiveis(slug).map((o) => o.id)),
    resumoPorId: new Map([...ontologiasPorId().values()].map((o) => [o.id, o.resumoDeConceitos])),
  };
}

// Critério do ORR para órfãos. Não vale para linha 'importado': o alinhamento
// legado foi escrito à mão antes da fronteira existir (parte dele fora do ORR)
// e é adotado como está; editar a linha na tela a torna 'eoa' e sujeita à regra.
function foraDoOrr(ctx, { classe, ontologiaId, termo }) {
  return !ctx.chavesOrr.has(chavePar(classe, ontologiaId, termo));
}

function motivoForaDaFronteiraClasse(ctx, linha) {
  if (linha.registro === 'importado' || !foraDoOrr(ctx, linha)) return null;
  return `o par "${linha.classe} → ${linha.termo}" não está mantido na revisão ORR`;
}

function motivoForaDaFronteiraRelacao(ctx, linha) {
  if (linha.registro === 'importado' || ctx.idsElegiveis.has(linha.ontologiaId)) return null;
  return `a ontologia "${linha.ontologia}" não é elegível (selecionada no domínio e com par mantido na revisão ORR)`;
}

// Linha 'importado' que a fronteira de relações não autorizaria hoje: ontologia
// não elegível ou termo ausente do resumo. É só um aviso para a tela (o legado
// é adotado como está); editar a linha a torna 'eoa' e a submete à fronteira.
function legadoForaDaFronteiraRelacao(ctx, linha) {
  if (linha.registro !== 'importado') return false;
  return !ctx.idsElegiveis.has(linha.ontologiaId) || !termoNoResumo(ctx.resumoPorId.get(linha.ontologiaId), linha.termo);
}

module.exports = {
  chavePar, chaveRelacao, paresOrr, fontesPorOntologia, ontologiasPorId, ontologiasElegiveis, termoNoResumo,
  motivoTipoInvalido, exigirTipo, contexto, foraDoOrr, motivoForaDaFronteiraClasse, motivoForaDaFronteiraRelacao,
  legadoForaDaFronteiraRelacao,
};
