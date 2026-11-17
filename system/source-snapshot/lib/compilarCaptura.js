'use strict';

const fs = require('fs');
const path = require('path');
const llm = require('./llm');
const { listarArquivos, lerArquivo } = require('./respostas');
const { listarCategorias } = require('./compilarCategorias');
const { slugify } = require('./util');

function repoRoot() {
  return process.env.ONTOLOGY_REPO_ROOT
    ? path.resolve(process.env.ONTOLOGY_REPO_ROOT)
    : path.resolve(__dirname, '..', '..', '..');
}

function capturaDir(slug) {
  return path.join(repoRoot(), 'trabalho', 'ontologia', slug, 'especificacao', '03-captura');
}

function capturaPath(slug, categoriaSlug) {
  return path.join(capturaDir(slug), `${categoriaSlug}.md`);
}

const BLOCO_RE = /```CAPTURA\s*([\s\S]*?)```/;

/**
 * Usa o LLM para rascunhar o levantamento de fontes da subfase DKC (Domain Knowledge
 * Capture) de uma categoria específica, a partir das respostas ASD (seções F — sistemas
 * — e G — atores/jurisdições). É um RASCUNHO inicial: a subfase DKC prevê mapeamento de
 * metadados reais (mesmo que parciais) por ator, o que exige pesquisa além da entrevista
 * — o documento deve deixar claro onde faltou lastro real e precisa de validação humana.
 * Não modela entidades/relacionamentos — isso fica a cargo de compilarEntidadesParaCategoria,
 * que parte deste levantamento já revisado/editado.
 */
async function compilarFontesParaCategoria(slug, categoria, descricaoCategoria) {
  const arquivos = listarArquivos(slug);
  if (arquivos.length === 0) {
    throw new Error('Ainda não há respostas coletadas para este domínio.');
  }
  const respostasConcatenadas = arquivos
    .map((nome) => `## Resposta: ${nome}\n\n${lerArquivo(slug, nome)}`)
    .join('\n\n---\n\n');

  const systemPrompt = `Você conduz o levantamento de fontes da subfase DKC (Domain Knowledge \
Capture) de um processo de especificação de ontologia, para o domínio "${slug}", especificamente para a \
categoria de dados "${categoria}" (${descricaoCategoria}). Suas fontes são as respostas ASD abaixo, sobretudo \
a seção G ("Atores e jurisdições": G1 organizações envolvidas, G2 aspectos interorganizacionais/transnacionais) \
para definir os atores relevantes, e a seção F ("Dados, sistemas e lacunas") para os sistemas/bases dentro \
desta categoria. Também use B/C quando derem pistas de sistemas, propriedades ou relacionamentos do domínio.

IMPORTANTE: isto é um RASCUNHO inicial de trabalho, não a captura final. A subfase DKC exige mapear \
metadados reais (mesmo que parciais) de cada sistema por ator, o que normalmente exige pesquisa além da \
entrevista. Baseie-se apenas no que está de fato nas respostas — nunca invente atributos ou sistemas que \
não tenham lastro nelas. Onde a informação disponível for insuficiente, escreva explicitamente \
"[requer pesquisa adicional]" em vez de inventar conteúdo. NÃO modele entidades, atributos de classe ou \
relacionamentos de ontologia neste documento — isso é feito em uma etapa posterior, a partir deste \
levantamento; aqui o objetivo é apenas registrar atores, sistemas e propriedades conhecidas.

Escreva em português do Brasil. O documento deve conter, nesta ordem:
1. Um título "# Levantamento de fontes — ${categoria} (${slug})" seguido da linha \
"> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais."
2. Uma seção "## Atores considerados" listando atores e o critério de seleção.
3. Uma seção "## Sistemas e bases por ator" com os sistemas/bases identificados por ator e atributos comuns mencionados.
4. Uma seção "## Sistemas e propriedades identificados" com uma tabela markdown de quatro colunas \
"Sistema/base", "Ator(es)", "Propriedades conhecidas" e "Lacunas", consolidando, sistema a sistema, os \
campos/propriedades concretos já mencionados na seção anterior (nomes de campo, tipo de dado, formato, \
identificador etc.) e o que ainda falta pesquisar. Esta tabela é o inventário bruto de dados desta categoria.

Responda APENAS com o bloco abaixo, sem nenhum texto antes ou depois:

\`\`\`CAPTURA
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
    const arquivo = llm.avisarRespostaSemFormato(`compilar DKC (fontes) — domínio "${slug}", categoria "${categoria}"`, resposta);
    throw new Error(`O modelo não retornou o levantamento de fontes no formato esperado para a categoria "${categoria}". Resposta bruta salva em ${arquivo}.`);
  }
  return m[1].trim();
}

/**
 * Usa o LLM para modelar entidades, atributos e relacionamentos a partir do
 * levantamento de fontes já compilado (e possivelmente editado manualmente) de uma
 * categoria — não reprocessa as respostas ASD originais, só o texto de fontes recebido.
 */
async function compilarEntidadesParaCategoria(slug, categoria, fontesMarkdown) {
  const systemPrompt = `Você conduz a modelagem de entidades, atributos e relacionamentos da subfase \
DKC (Domain Knowledge Capture) de um processo de especificação de ontologia, para o domínio "${slug}", \
categoria de dados "${categoria}". Você recebe abaixo o levantamento de fontes já revisado desta categoria \
(atores considerados, sistemas e bases por ator, e o inventário de sistemas e propriedades conhecidas).

IMPORTANTE: baseie-se EXCLUSIVAMENTE no levantamento de fontes recebido — não reprocesse ou reintroduza \
fatos de fora dele, e não invente atributos, entidades ou relacionamentos sem lastro nele. Onde o próprio \
levantamento já sinalizar "[requer pesquisa adicional]", propague essa marcação para o atributo correspondente \
em vez de inventar um valor.

REGRA CRÍTICA — classes são genéricas, não instâncias: uma ontologia define CLASSES/CONCEITOS genéricos \
que depois são instanciados; nomes próprios de organizações, órgãos ou atores específicos (ex.: "Polícia \
Federal", "Ministério Público", "COAF", "Banco do Brasil") NUNCA podem virar nome de classe. Generalize-os \
pelo papel/tipo que exercem no domínio (ex.: em vez da classe "PolíciaFederal" ou "MinistérioPúblico", use \
uma classe genérica como "ÓrgãoDeInvestigação" ou "AutoridadeCompetente"; em vez de "COAF_UIF", use algo como \
"UnidadeDeInteligênciaFinanceira"). O nome próprio específico, se relevante, só deve aparecer como exemplo \
entre parênteses dentro da descrição do atributo (ex.: "nome do órgão (ex.: Polícia Federal, Ministério \
Público)"), nunca como identificador de classe. Antes de finalizar, revise cada nome de classe da tabela e \
pergunte-se: "isto é um tipo genérico ou um nome próprio específico?" — se for nome próprio, generalize.

Escreva em português do Brasil. O documento deve conter, nesta ordem:
1. Um título "# Entidades e relacionamentos — ${categoria} (${slug})" seguido da linha \
"> Modelagem derivada do levantamento de fontes desta categoria — requer validação."
2. Uma seção "## Entidades, atributos e relacionamentos" com uma tabela markdown de duas colunas \
"Atributos" e "Entidades e relacionamentos", no padrão: cada linha lista uma ou mais classes GENÉRICAS com \
seus atributos na primeira coluna, e a notação "Classe_1 —RELACIONAMENTO→ Classe_2" na segunda.

Responda APENAS com o bloco abaixo, sem nenhum texto antes ou depois:

\`\`\`CAPTURA
(documento completo no formato acima)
\`\`\``;

  const userPrompt = `Levantamento de fontes desta categoria:\n\n${fontesMarkdown}`;

  // Ver lib/compilarRequisitos.js: 8192 já truncou documento real; streaming
  // em chatAnthropic torna seguro pedir mais.
  const resposta = await llm.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], { maxTokens: 64000 });

  const m = resposta.match(BLOCO_RE);
  if (!m) {
    const arquivo = llm.avisarRespostaSemFormato(`compilar DKC (entidades) — domínio "${slug}", categoria "${categoria}"`, resposta);
    throw new Error(`O modelo não retornou a modelagem de entidades no formato esperado para a categoria "${categoria}". Resposta bruta salva em ${arquivo}.`);
  }
  return m[1].trim();
}

function salvarCaptura(slug, categoriaSlug, markdown) {
  const destino = capturaPath(slug, categoriaSlug);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, markdown.endsWith('\n') ? markdown : `${markdown}\n`, 'utf8');
  return destino;
}

/**
 * Compila, em sequência (uma chamada de LLM por vez, para não sobrecarregar o
 * provedor), um arquivo de fontes 03-captura/<categoria>.md e um arquivo de entidades
 * 03-captura/<categoria>-entidades.md por categoria do DCI — o segundo é derivado do
 * primeiro, já salvo, e não das respostas ASD originais.
 */
async function compilarCapturaParaDominio(slug) {
  const categorias = listarCategorias(slug);
  if (categorias.length === 0) {
    throw new Error('Nenhuma categoria de dados encontrada — rode a compilação de DCI antes.');
  }
  const resultado = [];
  for (const { categoria, descricao } of categorias) {
    const categoriaSlug = slugify(categoria);
    const fontes = await compilarFontesParaCategoria(slug, categoria, descricao);
    const destinoFontes = salvarCaptura(slug, categoriaSlug, fontes);
    const entidades = await compilarEntidadesParaCategoria(slug, categoria, fontes);
    const destinoEntidades = salvarCaptura(slug, `${categoriaSlug}-entidades`, entidades);
    resultado.push({ categoria, arquivo: destinoFontes, arquivoEntidades: destinoEntidades });
  }
  return resultado;
}

/**
 * Recompila só o arquivo de entidades de uma categoria, a partir do arquivo de fontes
 * já salvo em disco (respeitando edições manuais feitas nele), sem tocar nas respostas
 * ASD originais nem no arquivo de fontes.
 */
async function recompilarEntidadesParaCategoria(slug, categoriaSlug) {
  const categorias = listarCategorias(slug);
  const encontrada = categorias.find((c) => slugify(c.categoria) === categoriaSlug);
  if (!encontrada) {
    throw new Error(`Categoria "${categoriaSlug}" não encontrada no DCI.`);
  }
  const fontes = lerCaptura(slug, `${categoriaSlug}.md`);
  const entidades = await compilarEntidadesParaCategoria(slug, encontrada.categoria, fontes);
  return salvarCaptura(slug, `${categoriaSlug}-entidades`, entidades);
}

function listarCapturas(slug) {
  const dir = capturaDir(slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

/**
 * Salva edição manual de um arquivo de captura já existente, dado o nome (com .md)
 * exposto pela listagem — mesma validação de nome usada na leitura.
 */
function salvarCapturaArquivo(slug, arquivo, markdown) {
  if (typeof arquivo !== 'string' || !arquivo.endsWith('.md') || arquivo.includes('/') || arquivo.includes('\\') || arquivo.includes('..')) {
    throw new Error('Nome de arquivo inválido.');
  }
  return salvarCaptura(slug, arquivo.slice(0, -3), markdown);
}

/**
 * Lê um arquivo de captura com validação estrita de nome (sem barras nem "..",
 * e confere que o caminho final continua dentro da pasta esperada).
 */
function lerCaptura(slug, arquivo) {
  if (typeof arquivo !== 'string' || !arquivo.endsWith('.md') || arquivo.includes('/') || arquivo.includes('\\') || arquivo.includes('..')) {
    throw new Error('Nome de arquivo inválido.');
  }
  const dir = capturaDir(slug);
  const destino = path.join(dir, arquivo);
  if (path.dirname(destino) !== dir || !fs.existsSync(destino)) {
    throw new Error('Arquivo não encontrado.');
  }
  return fs.readFileSync(destino, 'utf8');
}

module.exports = {
  compilarCapturaParaDominio,
  recompilarEntidadesParaCategoria,
  listarCapturas,
  lerCaptura,
  salvarCapturaArquivo,
};
