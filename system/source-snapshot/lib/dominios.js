'use strict';

const fs = require('fs');
const path = require('path');
const { questionarioPath, respostasDir } = require('./prompt');
const { isValidSlug } = require('./util');
const invites = require('./invites');
const sessionStore = require('./sessionStore');

function repoRoot() {
  return process.env.ONTOLOGY_REPO_ROOT
    ? path.resolve(process.env.ONTOLOGY_REPO_ROOT)
    : path.resolve(__dirname, '..', '..', '..');
}

function ontologiaDir() {
  return path.join(repoRoot(), 'trabalho', 'ontologia');
}

function existeDominio(slug) {
  return isValidSlug(slug) && fs.existsSync(questionarioPath(slug));
}

function listarDominios() {
  const base = ontologiaDir();
  if (!fs.existsSync(base)) return [];
  const convitesPorDominio = invites.contarPorDominio();

  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => existeDominio(slug))
    .map((slug) => {
      const stat = fs.statSync(questionarioPath(slug));
      const dirResp = respostasDir(slug);
      const totalRespostas = fs.existsSync(dirResp)
        ? fs.readdirSync(dirResp).filter((f) => f.endsWith('.md')).length
        : 0;
      const convites = convitesPorDominio[slug] || { total: 0, concluidos: 0 };
      return {
        slug,
        criadoEm: stat.birthtime,
        totalRespostas,
        totalConvites: convites.total,
        convitesConcluidos: convites.concluidos,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

// Não há mais `criarDominio`: um domínio passa a nascer da conclusão da entrevista
// de escopo (lib/instrumentos/escopo.js), que grava questionário, cadastro de
// perfis e transcrição de uma vez. Criar a pasta por outro caminho produziria um
// domínio sem lastro de como o escopo foi decidido.

/**
 * Apaga permanentemente um domínio: convites (e as sessões de entrevista associadas
 * a cada token) e toda a pasta trabalho/ontologia/<slug> (questionário, respostas,
 * e os documentos compilados de ASD/DCI/DKC). Não há como desfazer esta operação.
 */
function excluirDominio(slug) {
  if (!existeDominio(slug)) {
    throw new Error(`Domínio "${slug}" não encontrado.`);
  }

  const tokensRemovidos = invites.removerConvitesPorDominio(slug);
  tokensRemovidos.forEach((token) => sessionStore.removerSessao(token));
  // A entrevista de escopo não tem convite; sua sessão é endereçada pelo slug e
  // sobreviveria à exclusão do domínio se não fosse removida aqui.
  sessionStore.removerSessao(`escopo:${slug}`);

  const dir = path.join(ontologiaDir(), slug);
  fs.rmSync(dir, { recursive: true, force: true });
}

module.exports = { existeDominio, listarDominios, excluirDominio };
