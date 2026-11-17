'use strict';

const fs = require('fs');
const path = require('path');
const llm = require('./llm');
const { listarArquivos, lerArquivo } = require('./respostas');

function repoRoot() {
  return process.env.ONTOLOGY_REPO_ROOT
    ? path.resolve(process.env.ONTOLOGY_REPO_ROOT)
    : path.resolve(__dirname, '..', '..', '..');
}

function categoriasPath(slug) {
  return path.join(repoRoot(), 'trabalho', 'ontologia', slug, 'especificacao', '02-categorias-de-dados.md');
}

const BLOCO_RE = /```CATEGORIAS\s*([\s\S]*?)```/;

/**
 * Usa o LLM para extrair, das respostas ASD (sobretudo a seção F — dados, sistemas
 * e lacunas), as categorias de dados da subfase DCI (Data Cluster Identification).
 */
async function compilarCategoriasParaDominio(slug) {
  const arquivos = listarArquivos(slug);
  if (arquivos.length === 0) {
    throw new Error('Ainda não há respostas coletadas para este domínio.');
  }

  const respostasConcatenadas = arquivos
    .map((nome) => `## Resposta: ${nome}\n\n${lerArquivo(slug, nome)}`)
    .join('\n\n---\n\n');

  const systemPrompt = `Você conduz a subfase DCI (Data Cluster Identification) de um processo de \
especificação de ontologia, para o domínio "${slug}". Sua fonte é a seção F ("Dados, sistemas e lacunas") \
das respostas ASD abaixo, complementada pelo restante das respostas quando elas mencionarem dados ou bases. \
Identifique os *data clusters*: agrupamentos de sistemas, bases e esquemas mencionados, reais e relacionados \
ao domínio. Escreva em português do Brasil. Baseie-se apenas no que está de fato nas respostas, sem inventar \
sistemas não mencionados.

EIXO DE CATEGORIZAÇÃO — escolha um antes de montar a tabela e declare-o no parágrafo de introdução.
O eixo é TEMÁTICO: assunto, área de interesse ou finalidade do dado. NÃO descreva funcionalidades de cada \
sistema individualmente; o quadro precisa ser amplo o bastante para conectar múltiplas organizações, não \
restrito ao contexto de uma só.

Estes eixos são PROIBIDOS, porque descrevem o percurso do dado e não o seu conteúdo:
- origem ou custódia do dado (de quem é, quem guarda);
- canal de aquisição (como o dado chegou: requisição formal, scraping, exportação, convênio);
- estágio de processamento (bruto, tratado, consolidado, produto final);
- fronteira organizacional (interno vs. externo, nacional vs. internacional, por órgão);
- um sistema individual por categoria.
As respostas VÃO descrever o dado por esses eixos, porque o respondente narra a própria rotina. Traduzir \
isso para um eixo temático é exatamente a sua tarefa — não reproduza a organização da resposta.

VERIFICAÇÃO OBRIGATÓRIA — antes de fechar a tabela, releia cada NOME de categoria e responda: ele diz SOBRE \
O QUE É o dado? Se o nome só faz sentido quando se sabe quem produziu, quem guarda, por onde o dado chegou \
ou em que ponto do fluxo ele está, o nome está errado — renomeie pelo assunto. Sinais de que uma categoria \
precisa ser refeita: o nome menciona organizações, unidades, países, parceria, cooperação, requisição, \
coleta, bruto, consolidado, interno ou externo. Um mesmo assunto tratado por organizações diferentes é UMA \
categoria, não uma por organização.

TESTE DE DISCRIMINAÇÃO — aplique a cada par de categorias antes de fechar a tabela: duas categorias só se \
justificam se levarem a classes ou atributos DIFERENTES na etapa seguinte (DKC). Se renderiam a mesma tabela \
de entidades, funda-as numa só. Se o mesmo exemplo de base ou sistema puder ser citado em duas categorias, \
elas não estão discriminadas: refaça o corte. E se uma categoria abarca praticamente tudo, ela não \
categoriza nada: subdivida-a.

LACUNAS NÃO SÃO CATEGORIA. Lacuna é ausência de dado; categoria é dado que existe e será percorrido pela \
DKC. Uma lacuna na tabela faz a DKC procurar metadados de algo que não existe. As lacunas apuradas vão para \
uma seção própria, em BULLETS, depois da tabela — jamais em formato de tabela.

O documento deve conter, nesta ordem:
1. Um título "# Categorias de dados — ${slug}".
2. Uma introdução de 1 parágrafo que DECLARA o eixo temático adotado e por que ele foi escolhido para este \
domínio. Não cite os códigos das perguntas do questionário (F1, F2, F3) — descreva as fontes por extenso.
3. Uma ÚNICA tabela markdown de duas colunas "Categoria" e "Descrição", uma linha por categoria. Cada \
descrição termina com 2 ou 3 exemplos concretos entre parênteses, extraídos das respostas, no formato \
"(ex.: ..., ...)".
4. Uma seção "## Lacunas identificadas", em bullets, com as ausências e problemas de qualidade/integração \
relatados. Se não houver nenhuma, escreva um único bullet dizendo isso.

Não use nenhuma outra tabela no documento além da tabela de categorias.

Responda APENAS com o bloco abaixo, sem nenhum texto antes ou depois:

\`\`\`CATEGORIAS
(documento completo no formato acima)
\`\`\``;

  const userPrompt = `Respostas coletadas para o domínio "${slug}":\n\n${respostasConcatenadas}`;

  // Ver lib/compilarRequisitos.js: 8192 já truncou documento real; streaming
  // em chatAnthropic torna seguro pedir mais.
  const resposta = await llm.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], { maxTokens: 64000 });

  const m = resposta.match(BLOCO_RE);
  if (!m) {
    const arquivo = llm.avisarRespostaSemFormato(`compilar DCI — domínio "${slug}"`, resposta);
    throw new Error(`O modelo não retornou o documento no formato esperado. Resposta bruta salva em ${arquivo}. Tente novamente.`);
  }
  return m[1].trim();
}

function salvarCategorias(slug, markdown) {
  const destino = categoriasPath(slug);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8');
  return destino;
}

function existeCategorias(slug) {
  return fs.existsSync(categoriasPath(slug));
}

function lerCategorias(slug) {
  const p = categoriasPath(slug);
  if (!fs.existsSync(p)) {
    throw new Error('Ainda não há categorias de dados compiladas para este domínio.');
  }
  return fs.readFileSync(p, 'utf8');
}

/**
 * Extrai as linhas da tabela "Categoria | Descrição" de 02-categorias-de-dados.md,
 * ignorando a linha separadora (|---|---|). Usado pela subfase seguinte (DKC) para
 * saber quais categorias percorrer.
 *
 * Considera apenas o PRIMEIRO bloco contíguo de linhas de tabela. As lacunas do ASD
 * vão em bullets, fora da tabela (ver o prompt de compilação), justamente porque
 * lacuna é ausência de dado e viraria categoria vazia na DKC; se ainda assim o
 * documento trouxer uma segunda tabela, ela é ignorada em vez de virar categoria.
 */
function listarCategorias(slug) {
  const texto = lerCategorias(slug);
  const todas = texto.split('\n');
  const inicio = todas.findIndex((l) => l.trim().startsWith('|'));
  if (inicio === -1) return [];
  const fim = todas.findIndex((l, i) => i > inicio && !l.trim().startsWith('|'));
  const linhas = todas.slice(inicio, fim === -1 ? undefined : fim);
  const dados = linhas.filter((l) => !/^\|?\s*:?-+:?\s*\|/.test(l));
  // A primeira linha de tabela restante é o cabeçalho; descarta.
  return dados
    .slice(1)
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((cols) => cols.length >= 2 && cols[0])
    .map(([categoria, descricao]) => ({ categoria, descricao }));
}

module.exports = {
  compilarCategoriasParaDominio,
  salvarCategorias,
  existeCategorias,
  lerCategorias,
  listarCategorias,
};
