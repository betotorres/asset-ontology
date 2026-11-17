'use strict';

const fs = require('fs');
const path = require('path');
const { codigosDoTemplate, caminhoTemplate, questionarioPath } = require('../prompt');
const perfis = require('../perfis');
const llm = require('../llm');

// Instrumento da entrevista de ESCOPO: quem responde é o administrador do
// processo, não um especialista do domínio. A saída não é uma resposta ASD, e sim
// o instrumento de coleta em si — questionário adaptado ao domínio e cadastro de
// quem deve respondê-lo.

const MIN_PERFIS = 3;
const DELIM_Q = '===QUESTIONARIO===';
const DELIM_P = '===PERFIS===';

function partir(markdown) {
  const iQ = markdown.indexOf(DELIM_Q);
  const iP = markdown.indexOf(DELIM_P);
  if (iQ === -1 || iP === -1 || iP < iQ) return null;
  return {
    questionario: markdown.slice(iQ + DELIM_Q.length, iP).trim(),
    perfis: markdown.slice(iP + DELIM_P.length).trim(),
  };
}

/**
 * A decisão de escopo determina o formato de toda a coleta subsequente e hoje
 * não deixa rastro. Guardar a conversa é o princípio de "nada entra sem lastro"
 * aplicado à etapa mais opaca do processo.
 */
function gravarTranscricao(sessao) {
  const { provider, model } = llm.descreverConfig();
  const cabecalho = [
    `# Entrevista de escopo — ${sessao.dominio}`,
    '',
    `> **Proveniência:** entrevista conduzida em ${new Date().toISOString()} ` +
      `· entrevistador \`${model}\` via \`${provider}\``,
    '',
  ];
  const dialogo = sessao.history
    .filter((m) => m.role !== 'system')
    .map((m) => `**${m.role === 'assistant' ? 'Entrevistador' : 'Administrador'}:** ${m.content}`)
    .join('\n\n');

  const destino = path.join(path.dirname(questionarioPath(sessao.dominio)),
    '00-escopo-entrevista.md');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, `${cabecalho.join('\n')}${dialogo}\n`, 'utf8');
  return destino;
}

module.exports = {
  id: 'escopo',

  saudacao: 'Vamos definir o escopo deste domínio. Comece me contando, com suas palavras, ' +
            'do que ele trata e que fenômeno a ontologia precisa representar.',

  blocoFinal: 'ESCOPO',

  // Usado pelo "Gerar com o que temos": encerra a coleta sem desligar a validação.
  avisoDeFechamento:
    'Já temos contexto suficiente. Encerre agora e produza o bloco ESCOPO.',

  montarPrompt({ dominio }) {
    const template = fs.readFileSync(caminhoTemplate(), 'utf8');
    return `Você entrevista o administrador de um processo de especificação de ontologia \
para definir o escopo do domínio "${dominio}". A conversa é curta — algo entre 6 e 10 trocas.

Cubra, de forma conversacional e uma pergunta por vez: o fenômeno que a ontologia precisa \
representar; as organizações e atores que participam do ciclo de vida da informação; os \
sistemas e bases que existem hoje; quem são os profissionais que saberiam responder sobre \
o domínio; o que fica explicitamente FORA do escopo; e as restrições legais e de sigilo.

Nunca invente fatos sobre o domínio: sua função é perguntar, não preencher lacunas.

Quando tiver contexto suficiente, ou quando o administrador pedir para encerrar, responda \
APENAS com o bloco abaixo, sem nada antes ou depois:

\`\`\`ESCOPO
${DELIM_Q}
(o questionário completo adaptado ao domínio, preservando EXATAMENTE a estrutura, os \
títulos de seção e TODOS os códigos de pergunta do template; substitua apenas os \
placeholders e os exemplos entre parênteses; remova a seção "Após a coleta")
${DELIM_P}
# Perfis de respondentes — ${dominio}

| Perfil | Papel e experiência | Limites de conhecimento | Modelo |
|---|---|---|---|
(ao menos ${MIN_PERFIS} linhas; perfis heterogêneos, de organizações e níveis diferentes; \
"Limites de conhecimento" é obrigatório e específico — é o que impede um respondente \
sintético de inventar detalhe fora do seu papel; deixe "—" na coluna Modelo)
\`\`\`

Template de referência do questionário:

${template}`;
  },

  // Trava independente do modelo, análoga à cobertura B/C/D da entrevista ASD.
  validar(markdown) {
    const partes = partir(markdown);
    if (!partes) {
      return { ok: false, faltando: ['delimitadores ===QUESTIONARIO=== e ===PERFIS==='] };
    }
    const faltando = [];

    const esperados = codigosDoTemplate();
    const presentes = new Set(
      [...partes.questionario.matchAll(/\*\*([A-Z]\d+)\.\*\*/g)].map((m) => m[1])
    );
    const ausentes = esperados.filter((c) => !presentes.has(c));
    if (ausentes.length) faltando.push(`códigos de pergunta ausentes: ${ausentes.join(', ')}`);

    const linhas = perfis.parseTabela(partes.perfis)
      .filter((p) => p.perfil && p.experiencia && p.limites);
    if (linhas.length < MIN_PERFIS) {
      faltando.push(`ao menos ${MIN_PERFIS} perfis completos (há ${linhas.length})`);
    }

    return { ok: faltando.length === 0, faltando };
  },

  concluir(sessao, markdown) {
    const partes = partir(markdown);
    const destinoQ = questionarioPath(sessao.dominio);
    fs.mkdirSync(path.dirname(destinoQ), { recursive: true });
    fs.writeFileSync(destinoQ, `${partes.questionario}\n`, 'utf8');
    const destinoP = perfis.salvarPerfis(sessao.dominio, partes.perfis);
    const destinoT = gravarTranscricao(sessao);
    return {
      destinos: [destinoQ, destinoP, destinoT],
      reply: 'Escopo definido. Questionário, cadastro de perfis e transcrição foram gravados.',
    };
  },
};
