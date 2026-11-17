'use strict';

const path = require('path');
const { montarSystemPrompt, carregarQuestionario, CODIGOS_OBRIGATORIOS } = require('../prompt');
const { gravarResposta } = require('../finalizar');

// Instrumento da entrevista ASD: o que antes estava embutido no loop.
//
// Um instrumento é um par (prompt do entrevistador, condição de encerramento).
// Extraí-lo do loop é o que permite a entrevista de escopo compartilhar o mesmo
// motor sem duplicar o protocolo — e é o protocolo idêntico entre as vias que
// torna comparável o que sai de cada uma.
module.exports = {
  id: 'asd',

  saudacao: 'Olá! Vamos começar. Pode falar um pouco sobre sua função e experiência com o domínio?',

  blocoFinal: 'FINAL',

  // Injetado como mensagem de sistema quando a entrevista se aproxima do teto de
  // turnos. Não relaxa a validação: manda encerrar, e o bloco produzido continua
  // tendo de cobrir o núcleo B/C/D para virar artefato.
  avisoDeFechamento:
    'Você está chegando ao limite de turnos desta entrevista. Encerre agora: ' +
    'produza o bloco FINAL com tudo o que já foi coberto até aqui, sem fazer novas perguntas.',

  montarPrompt({ dominio, perfil }) {
    return montarSystemPrompt(dominio, perfil, carregarQuestionario(dominio));
  },

  // Rede de segurança independente do modelo: não aceita encerrar sem o núcleo B/C/D.
  validar(markdown) {
    const faltando = CODIGOS_OBRIGATORIOS.filter(
      (codigo) => !new RegExp(`\\*\\*${codigo}\\.`, 'i').test(markdown)
    );
    return { ok: faltando.length === 0, faltando };
  },

  concluir(sessao, markdown, opts) {
    const destino = gravarResposta(sessao.dominio, sessao.perfil, markdown,
      opts.proveniencia || { tipo: 'humano' });
    return {
      destinos: [destino],
      // Nome do arquivo (sem caminho) para o chamador gravar em convites.arquivo_resposta.
      arquivo: path.basename(destino),
      reply: 'Muito obrigado! Sua entrevista foi concluída e registrada com sucesso.',
    };
  },
};
