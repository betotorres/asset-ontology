'use strict';

// A tese posiciona o human-in-the-loop como a mitigação central do "Garbage In,
// Garbage Out" (4.1.4) e da HiPPO. Resposta produzida por um agente sintético é
// evidência de TERCEIRA CLASSE — abaixo de metadado real de sistema e de
// especialista humano. Para que a avaliação consiga ponderá-la, cada arquivo de
// resposta ASD carrega, logo abaixo do título, uma linha declarando sua origem.
//
// O marcador é markdown visível (e não um comentário HTML) de propósito: ele tem
// de sobreviver à leitura humana do artefato no repositório, à renderização no
// painel, e à edição manual — quem editar a resposta vê o que está declarando.

const LINHA_RE = /^>\s*\*\*Proveniência:\*\*\s*(.+)$/m;

/**
 * Monta o bloco de proveniência a ser inserido no arquivo de resposta.
 *
 * @param {{tipo: 'humano'|'agente', perfil?: string, provedor?: string,
 *          modelo?: string, persona?: string}} proveniencia
 */
function montarCabecalho(proveniencia = {}) {
  const quando = new Date().toISOString();
  if (proveniencia.tipo === 'agente') {
    const modelo = proveniencia.modelo || 'modelo não informado';
    const provedor = proveniencia.provedor || 'provedor não informado';
    return [
      `> **Proveniência:** respondente sintético (agente LLM) — modelo \`${modelo}\` via \`${provedor}\` · gerado em ${quando}`,
      '>',
      '> Evidência de terceira classe: abaixo de metadado real de sistema e de especialista humano.',
      '> Não sustenta sozinha decisão de modelagem — requer validação humana antes de virar lastro.',
    ].join('\n');
  }
  return `> **Proveniência:** respondente humano — entrevista conduzida em ${quando}`;
}

/**
 * Insere o cabeçalho logo após a linha de título do markdown produzido pelo
 * entrevistador (o bloco ```FINAL``` começa com "# Resposta ASD — ..."). Se por
 * algum motivo não houver título, prefixa o documento.
 */
function inserirCabecalho(markdown, proveniencia) {
  const cabecalho = montarCabecalho(proveniencia);
  const linhas = markdown.split('\n');
  const idxTitulo = linhas.findIndex((l) => l.trim().startsWith('#'));
  if (idxTitulo === -1) {
    return `${cabecalho}\n\n${markdown}`;
  }
  linhas.splice(idxTitulo + 1, 0, '', cabecalho);
  return linhas.join('\n');
}

/**
 * Classifica a origem de um arquivo de resposta já gravado.
 *
 * Respostas anteriores à introdução do painel (e qualquer arquivo editado a ponto
 * de perder o marcador) caem em "desconhecida" — deliberadamente não são tratadas
 * como humanas por omissão: presumir lastro que não foi declarado é exatamente o
 * erro que a marcação existe para evitar.
 *
 * @returns {{tipo: 'humano'|'agente'|'desconhecida', descricao: string}}
 */
function classificar(markdown) {
  const m = String(markdown || '').match(LINHA_RE);
  if (!m) {
    return { tipo: 'desconhecida', descricao: 'origem não declarada no arquivo' };
  }
  const descricao = m[1].trim();
  if (/sint[ée]tic/i.test(descricao) || /agente/i.test(descricao)) {
    return { tipo: 'agente', descricao };
  }
  return { tipo: 'humano', descricao };
}

module.exports = { montarCabecalho, inserirCabecalho, classificar };
