'use strict';

const fs = require('fs');
const path = require('path');
const { perfisPath } = require('./prompt');
const { slugify } = require('./util');

// O cadastro é um ARTEFATO do repositório, não registro interno da aplicação:
// quem foi consultado — e com que limites declarados — faz parte do lastro da
// especificação e precisa ser revisável a olho nu.
//
// | Perfil | Papel e experiência | Limites de conhecimento | Modelo |
// "Modelo" é opcional; aceita "provedor:modelo" ou "—" para usar o .env.

/**
 * "anthropic:claude-sonnet-5" → { provider: 'anthropic', model: 'claude-sonnet-5' }
 * "gpt-4o-mini"               → { model: 'gpt-4o-mini' }
 * "" | "—" | "-" | "default"  → {} (usa a configuração do .env)
 */
function parseModelo(celula) {
  const texto = String(celula || '').trim().replace(/^`|`$/g, '');
  if (!texto || /^(—|-|–|default|padr[ãa]o)$/i.test(texto)) return {};
  const idx = texto.indexOf(':');
  if (idx === -1) return { model: texto };
  return {
    provider: texto.slice(0, idx).trim().toLowerCase(),
    model: texto.slice(idx + 1).trim(),
  };
}

/**
 * Função pura sobre o markdown da tabela — o instrumento de escopo precisa
 * parsear o cadastro para validá-lo ANTES de gravar o artefato.
 */
function parseTabela(markdown) {
  const linhas = String(markdown).split('\n').filter((l) => l.trim().startsWith('|'));
  const dados = linhas.filter((l) => !/^\|?\s*:?-+:?\s*\|/.test(l));
  return dados
    .slice(1) // a primeira linha de tabela restante é o cabeçalho
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((cols) => cols.length >= 2 && cols[0])
    .map(([perfil, experiencia, limites, modelo]) => ({
      id: slugify(perfil),
      perfil,
      experiencia: experiencia || '',
      limites: limites || '',
      chatOpts: parseModelo(modelo),
    }));
}

function lerPerfis(slug) {
  const p = perfisPath(slug);
  if (!fs.existsSync(p)) {
    throw new Error('Ainda não há cadastro de perfis de respondente para este domínio.');
  }
  return fs.readFileSync(p, 'utf8');
}

function existePerfis(slug) {
  return fs.existsSync(perfisPath(slug));
}

function salvarPerfis(slug, markdown) {
  const destino = perfisPath(slug);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8');
  return destino;
}

function listarPerfis(slug) {
  return parseTabela(lerPerfis(slug));
}

module.exports = { lerPerfis, salvarPerfis, existePerfis, listarPerfis, parseTabela, parseModelo };
