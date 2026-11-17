'use strict';

const fs = require('fs');
const path = require('path');
const llm = require('./llm');
const { listarArquivos, lerArquivo } = require('./respostas');
const { classificar } = require('./proveniencia');

function repoRoot() {
  return process.env.ONTOLOGY_REPO_ROOT
    ? path.resolve(process.env.ONTOLOGY_REPO_ROOT)
    : path.resolve(__dirname, '..', '..', '..');
}

function escopoRequisitosPath(slug) {
  return path.join(repoRoot(), 'trabalho', 'ontologia', slug, 'especificacao', '01-escopo-e-requisitos.md');
}

const BLOCO_RE = /```ESCOPO\s*([\s\S]*?)```/;

/**
 * Usa o LLM para compilar as respostas ASD coletadas de um domínio no entregável
 * da subfase ASD (escopo, usuários-alvo, requisitos e tabela de comportamentos),
 * no mesmo formato produzido manualmente pela skill especificacao-ontologia.
 */
async function compilarRequisitosParaDominio(slug) {
  const arquivos = listarArquivos(slug);
  if (arquivos.length === 0) {
    throw new Error('Ainda não há respostas coletadas para este domínio.');
  }

  const classificadas = arquivos.map((nome) => {
    const conteudo = lerArquivo(slug, nome);
    return { nome, conteudo, proveniencia: classificar(conteudo) };
  });

  const respostasConcatenadas = classificadas
    .map(({ nome, conteudo, proveniencia }) =>
      `## Resposta: ${nome}\n(origem desta resposta: ${proveniencia.tipo})\n\n${conteudo}`)
    .join('\n\n---\n\n');

  const humanas = classificadas.filter((r) => r.proveniencia.tipo === 'humano').length;
  const sinteticas = classificadas.filter((r) => r.proveniencia.tipo === 'agente').length;
  const desconhecidas = classificadas.length - humanas - sinteticas;

  // A regra de proveniência só é injetada quando há resposta sintética ou de origem
  // não declarada na base — num domínio 100% humano, ela seria ruído no prompt.
  const regraProveniencia = (sinteticas + desconhecidas) > 0 ? `

PROVENIÊNCIA DAS FONTES — esta base tem ${humanas} resposta(s) de respondente humano, \
${sinteticas} de respondente sintético (agente LLM) e ${desconhecidas} de origem não declarada. \
Resposta sintética é evidência de terceira classe: abaixo de metadado real de sistema e de \
especialista humano, e não sustenta sozinha uma decisão de modelagem. Portanto:
- Todo requisito ou comportamento que se apoie EXCLUSIVAMENTE em respostas sintéticas e/ou de \
origem não declarada deve terminar com a marcação " [lastro apenas sintético — requer validação humana]".
- Itens com ao menos uma resposta humana sustentando não recebem marcação.
- Não descarte os itens sintéticos: eles servem para pré-aquecer a pauta da entrevista com \
especialistas reais. Apenas deixe a origem visível.
- Acrescente, logo após o título do documento, uma linha em blockquote informando essa \
composição de fontes (quantas humanas, sintéticas e não declaradas).` : '';

  const systemPrompt = `Você compila respostas de entrevistas da subfase ASD (Application Field and \
Scope Definition) de um processo de especificação de ontologia em um único documento consolidado, para \
o domínio "${slug}". Combine as respostas de todos os respondentes, eliminando redundância mas preservando \
divergências relevantes entre perfis. Escreva em português do Brasil. O documento deve conter, nesta ordem:

1. Um título "# Escopo e requisitos — ${slug}".
2. Uma seção "## Campo de aplicação e escopo" descrevendo o domínio e o que a ontologia deve endereçar.
3. Uma seção "## Usuários-alvo" listando os perfis de usuário identificados e como usarão a ontologia.
4. Uma seção "## Requisitos" com uma tabela markdown de duas colunas "Id" e "Requisito", numerando \
cada requisito verificável levantado (um requisito por linha, sem quebras de linha dentro da célula).
5. Uma seção "## Tabela de comportamentos do domínio" com uma tabela markdown de duas colunas \
"Id" e "Descrição do comportamento", numerando cada comportamento observado que a ontologia precisa representar.${regraProveniencia}

Responda APENAS com o bloco abaixo, sem nenhum texto antes ou depois:

\`\`\`ESCOPO
(documento completo no formato acima)
\`\`\``;

  const userPrompt = `Respostas coletadas para o domínio "${slug}":\n\n${respostasConcatenadas}`;

  // 8192 (padrão de lib/llm.js) é curto demais para domínios ricos — já vimos
  // truncar no meio de "## Requisitos". Documento de compilação pode ficar
  // grande; o streaming em chatAnthropic torna seguro pedir bem mais.
  const resposta = await llm.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], { maxTokens: 64000 });

  const m = resposta.match(BLOCO_RE);
  if (!m) {
    const arquivo = llm.avisarRespostaSemFormato(`compilar ASD — domínio "${slug}"`, resposta);
    throw new Error(`O modelo não retornou o documento no formato esperado. Resposta bruta salva em ${arquivo}. Tente novamente.`);
  }
  return m[1].trim();
}

function salvarEscopoRequisitos(slug, markdown) {
  const destino = escopoRequisitosPath(slug);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8');
  return destino;
}

function existeEscopoRequisitos(slug) {
  return fs.existsSync(escopoRequisitosPath(slug));
}

function lerEscopoRequisitos(slug) {
  const p = escopoRequisitosPath(slug);
  if (!fs.existsSync(p)) {
    throw new Error('Ainda não há escopo e requisitos compilados para este domínio.');
  }
  return fs.readFileSync(p, 'utf8');
}

module.exports = {
  compilarRequisitosParaDominio,
  salvarEscopoRequisitos,
  existeEscopoRequisitos,
  lerEscopoRequisitos,
};
