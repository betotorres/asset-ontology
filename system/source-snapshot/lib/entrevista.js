'use strict';

const llm = require('./llm');

/**
 * Um turno de entrevista, para qualquer instrumento.
 *
 * Muta `sessao.history` e `sessao.done`; não persiste — quem chama decide quando
 * salvar. Este é o ponto único onde o protocolo vive: a via humana (HTTP), a via
 * de agente (painel) e a entrevista de escopo precisam ser estruturalmente
 * idênticas, senão comparar o que sai de cada uma perde sentido.
 *
 * @param {{history: Array, done: boolean, dominio: string, perfil: string}} sessao
 * @param {string} texto fala do respondente
 * @param {{instrumento: object, proveniencia?: object}} opts
 */
async function processarTurno(sessao, texto, opts) {
  const { instrumento } = opts;
  if (!instrumento) throw new Error('processarTurno exige um instrumento.');

  sessao.history.push({ role: 'user', content: texto.trim() });

  // O entrevistador roda sempre na configuração do ambiente: o instrumento tem
  // de ser constante entre respondentes.
  const resposta = await llm.chat(sessao.history);

  const re = new RegExp('```' + instrumento.blocoFinal + '\\s*([\\s\\S]*?)```');
  const casado = resposta.match(re);

  if (!casado) {
    sessao.history.push({ role: 'assistant', content: resposta });
    return { reply: resposta, done: false };
  }

  const markdown = casado[1].trim();
  const validacao = instrumento.validar(markdown);
  if (!validacao.ok) {
    const aviso = `Ainda faltam informações obrigatórias (${validacao.faltando.join(', ')}). ` +
      'Por favor, continue a entrevista antes de encerrar.';
    sessao.history.push({ role: 'assistant', content: resposta });
    sessao.history.push({ role: 'system', content: aviso });
    return {
      reply: 'Só mais algumas perguntas antes de encerrarmos — vamos continuar.',
      done: false,
      faltando: validacao.faltando,
    };
  }

  const conclusao = instrumento.concluir(sessao, markdown, opts);
  sessao.done = true;
  sessao.history.push({ role: 'assistant', content: resposta });

  // `arquivo` é propagado porque o chamador precisa dele para vincular o convite
  // ao artefato produzido; `destinos` é a lista completa de saídas.
  return {
    reply: conclusao.reply,
    done: true,
    destinos: conclusao.destinos,
    arquivo: conclusao.arquivo ?? null,
  };
}

module.exports = { processarTurno };
