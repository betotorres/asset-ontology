'use strict';

const path = require('path');
const llm = require('./llm');
const { conexao } = require('./db');
const invites = require('./invites');
const sessionStore = require('./sessionStore');
const perfis = require('./perfis');
const entrevista = require('./entrevista');
const instrumentoAsd = require('./instrumentos/asd');
const { carregarQuestionario, montarSystemPrompt, montarPersonaPrompt } = require('./prompt');
const { novoToken } = require('./util');

// Painel de agentes-especialistas: conduz a entrevista ASD com respondentes
// SINTÉTICOS, pela mesma porta que um respondente humano usa.
//
// A identidade estrutural entre as duas vias é intencional e não é um detalhe de
// implementação: o entrevistador é o mesmo prompt, no mesmo modelo do ambiente,
// com a mesma saudação inicial e a mesma trava de cobertura B/C/D. Só o
// respondente muda. É isso que permite comparar uma resposta sintética com uma
// humana sem que a diferença venha do instrumento.
//
// O painel é uma SEGUNDA FONTE, nunca substituição: serve para pré-aquecer a pauta
// antes de entrevistar especialistas reais, ou como cobertura provisória quando
// eles não estão disponíveis. A proveniência gravada em cada resposta (ver
// lib/proveniencia.js) é o que mantém essa hierarquia visível adiante.

// Teto de turnos por execução. Uma entrevista ASD completa costuma fechar bem
// antes disso (as medidas deste repositório ficam entre 20 e 34 turnos); o teto
// existe para conter um par entrevistador/respondente que entre em loop de
// cortesia sem nunca convergir para o bloco FINAL — humano cansa, agente não.
const MAX_TURNOS = 50;

// Antes de bater no teto, o entrevistador é avisado para encerrar. Sem isso, a
// entrevista morre no limite e não produz nada, depois de ~100 chamadas de LLM.
// O aviso não relaxa a validação: o bloco ainda tem de cobrir o núcleo B/C/D.
const TURNOS_AVISO = 40;

/**
 * Última execução de painel do domínio, na mesma forma que o admin já consome.
 * Devolve `null` quando o domínio nunca teve painel.
 */
function lerStatus(slug) {
  const conn = conexao();
  const p = conn.prepare(
    'SELECT * FROM paineis WHERE dominio = ? ORDER BY id DESC LIMIT 1'
  ).get(slug);
  if (!p) return null;
  const personas = conn.prepare(
    'SELECT * FROM painel_personas WHERE painel_id = ? ORDER BY rowid'
  ).all(p.id).map((l) => ({
    id: l.perfil_id, perfil: l.perfil, estado: l.estado,
    turnos: l.turnos, arquivo: l.arquivo, erro: l.erro,
  }));
  return {
    id: p.id, estado: p.estado, iniciadoEm: p.iniciado_em,
    concluidoEm: p.concluido_em, erro: p.erro, personas,
  };
}

function criarExecucao(slug, elenco) {
  const conn = conexao();
  conn.prepare(
    "INSERT INTO paineis (dominio, estado, iniciado_em) VALUES (?, 'executando', ?)"
  ).run(slug, new Date().toISOString());
  const id = conn.prepare('SELECT last_insert_rowid() AS id').get().id;
  const insere = conn.prepare(
    "INSERT INTO painel_personas (painel_id, perfil_id, perfil, estado) VALUES (?, ?, ?, 'pendente')"
  );
  elenco.forEach((p) => insere.run(id, p.id, p.perfil));
  return id;
}

// Atualização pontual de uma persona: o progresso é gravado a cada turno, e
// reescrever o status inteiro a cada vez era a origem da corrida antiga.
function atualizarPersona(painelId, perfilId, campos) {
  conexao().prepare(
    `UPDATE painel_personas SET estado = ?, turnos = ?, arquivo = ?, erro = ?
      WHERE painel_id = ? AND perfil_id = ?`
  ).run(campos.estado, campos.turnos ?? 0, campos.arquivo ?? null,
        campos.erro ?? null, painelId, perfilId);
}

function finalizarExecucao(painelId, estado, erro = null) {
  conexao().prepare(
    'UPDATE paineis SET estado = ?, concluido_em = ?, erro = ? WHERE id = ?'
  ).run(estado, new Date().toISOString(), erro, painelId);
}

// Painéis rodando NESTE processo. A tabela relata progresso; a autoridade sobre
// "está rodando" é a memória do processo, senão um servidor que caia no meio de
// um painel deixa o domínio travado num "executando" eterno.
const executando = new Set();

function emExecucao(slug) {
  return executando.has(slug);
}

/**
 * Chamado na subida do servidor: qualquer painel ainda marcado como "executando"
 * é resíduo de um processo anterior que morreu no meio.
 */
function marcarInterrompidos() {
  const conn = conexao();
  const orfaos = conn.prepare("SELECT id FROM paineis WHERE estado = 'executando'").all();
  for (const { id } of orfaos) {
    conn.prepare(
      `UPDATE painel_personas SET estado = 'interrompida'
        WHERE painel_id = ? AND estado IN ('pendente', 'entrevistando')`
    ).run(id);
    conn.prepare(
      `UPDATE paineis SET estado = 'interrompido', concluido_em = ?,
              erro = 'O servidor foi reiniciado durante a execução do painel.'
        WHERE id = ?`
    ).run(new Date().toISOString(), id);
  }
}

/**
 * Monta o histórico do ponto de vista do respondente: as falas do entrevistador
 * viram "user" e as da própria persona viram "assistant".
 *
 * As mensagens de sistema injetadas na sessão (o prompt do entrevistador e os
 * avisos da trava de cobertura) são descartadas de propósito — são o mecanismo
 * interno do instrumento, e vazá-las para o respondente o ensinaria a produzir a
 * resposta que fecha a validação em vez da resposta que ele de fato teria.
 */
function historicoParaRespondente(sessao, systemPrompt) {
  const conversa = sessao.history
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'user' : 'assistant',
      content: m.content,
    }));
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: instrumentoAsd.saudacao },
    ...conversa,
  ];
}

/**
 * Entrevistas de agente que começaram e não fecharam — por estouro de teto ou por
 * queda do servidor no meio. A transcrição está toda em `mensagens` (salva a cada
 * turno), então o material não se perde; o que falta é a chance de encerrar.
 *
 * @returns {Map<string, {token: string, turnos: number}>} indexado por perfil_id
 */
function retomavelPorPerfil(slug) {
  const linhas = conexao().prepare(
    `SELECT c.token AS token, c.perfil_id AS perfilId,
            (SELECT COUNT(*) FROM mensagens m
              WHERE m.sessao_id = s.id AND m.papel = 'assistant') AS turnos
       FROM convites c
       JOIN sessoes s ON s.id = c.token
      WHERE c.dominio = ? AND c.origem = 'agente' AND c.perfil_id IS NOT NULL
        AND c.concluido_em IS NULL AND s.concluida = 0
      ORDER BY s.atualizada_em DESC`
  ).all(slug);

  const mapa = new Map();
  // A mais recente por perfil vence; as anteriores continuam no banco como
  // trilha, mas retomar duas entrevistas do mesmo papel não faria sentido.
  for (const l of linhas) {
    if (!mapa.has(l.perfilId) && l.turnos > 0) {
      mapa.set(l.perfilId, { token: l.token, turnos: l.turnos });
    }
  }
  return mapa;
}

/**
 * Conduz uma entrevista completa com uma persona. Devolve o resultado; erros de
 * uma persona não derrubam o painel (ver executarPainel).
 *
 * Com `retomar`, continua a última entrevista inacabada daquele perfil em vez de
 * abrir uma nova: mesmo convite, mesma sessão, mesma transcrição. Abrir convite
 * novo faria disso uma segunda entrevista, não a continuação da primeira.
 */
async function entrevistarPersona(slug, persona, aoProgredir, { retomar = false } = {}) {
  // O perfil vai cru para o prompt do entrevistador: ele NÃO pode saber que está
  // falando com um agente, senão conduz a entrevista de forma diferente e a
  // comparação com as respostas humanas deixa de valer. A marcação de origem vive
  // fora do instrumento — no convite, no nome do arquivo e na proveniência.
  const perfil = persona.perfil;

  const anterior = retomar ? retomavelPorPerfil(slug).get(persona.id) : null;
  let token;
  let sessao;

  if (anterior) {
    token = anterior.token;
    sessao = sessionStore.carregarSessao(token);
  } else {
    const questionario = carregarQuestionario(slug);
    token = novoToken();
    // Reaproveita convite + sessionStore para que a transcrição fique persistida
    // nas tabelas sessoes/mensagens — é a trilha de auditoria do que o agente disse.
    invites.criarConvite({
      token, dominio: slug, perfil, perfilId: persona.id, origem: 'agente',
    });
    sessao = sessionStore.criarSessao(token, {
      tipo: 'asd',
      conviteToken: token,
      dominio: slug,
      perfil,
      origem: 'agente',
      history: [{ role: 'system', content: montarSystemPrompt(slug, perfil, questionario) }],
    });
  }

  // Contagem absoluta: numa retomada, os turnos já gastos contam para o aviso.
  // Uma entrevista que já estourou o teto é avisada de imediato — ela já provou
  // que não converge sozinha, e o objetivo da retomada é fechá-la, não explorar.
  const turnosAntes = sessao.history.filter((m) => m.role === 'assistant').length;
  let avisado = false;

  const personaPrompt = montarPersonaPrompt(slug, persona);
  const { provider, model } = llm.descreverConfig(persona.chatOpts);
  const proveniencia = {
    tipo: 'agente',
    provedor: provider,
    modelo: model,
    persona: persona.perfil,
  };

  for (let turno = 1; turno <= MAX_TURNOS; turno += 1) {
    if (!avisado && turnosAntes + turno >= TURNOS_AVISO && instrumentoAsd.avisoDeFechamento) {
      // Mensagem de sistema, como a trava de cobertura: entra no contexto do
      // entrevistador e não é vista pelo respondente (historicoParaRespondente
      // descarta system), então não ensina a persona a "responder para fechar".
      sessao.history.push({ role: 'system', content: instrumentoAsd.avisoDeFechamento });
      avisado = true;
    }

    // O respondente sintético fala. Temperatura mais alta que a do entrevistador:
    // queremos variação entre personas, não a mesma resposta média repetida.
    const fala = await llm.chat(historicoParaRespondente(sessao, personaPrompt), {
      ...persona.chatOpts,
      temperature: 0.8,
    });

    const resultado = await entrevista.processarTurno(sessao, fala, {
      instrumento: instrumentoAsd,
      proveniencia,
    });
    sessionStore.salvarSessao(token, sessao);
    // Turnos absolutos: numa retomada, o que interessa é o tamanho da entrevista,
    // não o da última execução.
    if (aoProgredir) aoProgredir({ turnos: turnosAntes + turno });

    if (resultado.done) {
      invites.marcarConcluido(token, resultado.arquivo);
      return { token, turnos: turnosAntes + turno, arquivo: resultado.destinos[0] };
    }
  }

  // Sem bloco FINAL dentro do teto: nada é gravado — um parcial gravado teria
  // aparência de resposta completa. A transcrição fica no banco e a entrevista
  // aparece como retomável, então o material não se perde junto com o artefato.
  throw new Error(
    `A entrevista não foi concluída em ${MAX_TURNOS} turnos — nada foi gravado. ` +
    'A conversa foi preservada: use "Retomar" para tentar encerrá-la.'
  );
}

/**
 * Dispara o painel em segundo plano e devolve o status inicial. O progresso é
 * persistido nas tabelas paineis/painel_personas para o admin acompanhar por polling:
 * um painel de várias personas leva minutos e não cabe num request HTTP.
 *
 * As personas rodam em sequência, uma chamada de LLM por vez, como já faz a
 * compilação de DKC — evita estourar rate limit do provedor.
 */
function iniciarPainel(slug, { apenas, retomar = false } = {}) {
  if (emExecucao(slug)) {
    throw new Error('Já existe um painel em execução para este domínio.');
  }

  let elenco = perfis.listarPerfis(slug);
  if (Array.isArray(apenas) && apenas.length > 0) {
    elenco = elenco.filter((p) => apenas.includes(p.id));
  }
  if (elenco.length === 0) {
    throw new Error('Nenhuma persona encontrada no elenco — gere e revise 00-perfis-respondentes.md antes.');
  }

  const painelId = criarExecucao(slug, elenco);
  executando.add(slug);

  (async () => {
    for (const persona of elenco) {
      atualizarPersona(painelId, persona.id, { estado: 'entrevistando' });
      try {
        const r = await entrevistarPersona(slug, persona, ({ turnos }) => {
          atualizarPersona(painelId, persona.id, { estado: 'entrevistando', turnos });
        }, { retomar });
        const arquivo = path.basename(r.arquivo);
        atualizarPersona(painelId, persona.id, { estado: 'concluida', turnos: r.turnos, arquivo });
        console.log(`[entrevistador-asd] Painel ${slug}: "${persona.perfil}" gravou ${arquivo}`);
      } catch (err) {
        atualizarPersona(painelId, persona.id, { estado: 'falhou', erro: err.message });
        console.error(`[entrevistador-asd] Painel ${slug}: "${persona.perfil}" falhou — ${err.message}`);
      }
    }
    finalizarExecucao(painelId, 'concluido');
  })()
    .catch((err) => finalizarExecucao(painelId, 'falhou', err.message))
    .finally(() => executando.delete(slug));

  return lerStatus(slug);
}

module.exports = {
  iniciarPainel,
  lerStatus,
  emExecucao,
  marcarInterrompidos,
  retomavelPorPerfil,
  MAX_TURNOS,
  TURNOS_AVISO,
};
