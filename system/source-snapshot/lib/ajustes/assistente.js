'use strict';

// Assistente de conversa da etapa ④ Ajustes (spec 2026-10-06). O modelo lê a
// ontologia ajustada, a especificação do domínio e o cache das ontologias
// externas por ferramentas de leitura, e só PROPÕE mudanças — um lote de
// ajustes (as 11 operações de sempre) e/ou desfazeres. A proposta fica na
// mensagem e só entra quando um administrador a aplica: numa transação, pelas
// mesmas funções da tela (criarAjuste, desfazerAjuste), tudo ou nada.

const fs = require('node:fs');
const path = require('node:path');
const llm = require('../llm');
const { conexao } = require('../db');
const decisoes = require('../oco/decisoes');
const geracao = require('../oco/geracao');
const fontesOco = require('../oco/fontes');
const { normalizar: normalizarTermo } = require('../oco/indice');
const { repoRoot } = require('../oco/caminhos');
const { falha, TIPOS_XSD } = require('../oco/constantes');
const { normalizarBusca } = require('../compilarDKD');
const registro = require('./registro');
const estado = require('./estado');
const chat = require('./chat');

const MAX_RODADAS_FERRAMENTA = 15;
const MAX_MENSAGENS_HISTORICO = 30;
const MAX_RESULTADO = 20000; // caracteres por tool_result
const FONTES_DO_MODELO = registro.FONTES.filter((f) => f !== 'especialista');
const TEXTO_RESPOSTA_VAZIA = '(sem resposta de texto)';

const prefixoMotivo = (modelo) => `sugestão da IA (${modelo}, via assistente de ajustes), autorizada pelo administrador: `;

// --- Ferramentas ------------------------------------------------------------------

const objeto = (properties, required = []) => ({ type: 'object', properties, required });
const texto = (description) => ({ type: 'string', description });

const FERRAMENTAS_LEITURA = [
  {
    name: 'ver_hierarquia',
    description: 'Árvore de classes da ontologia ajustada (rdfs:subClassOf), a partir de uma classe ou das raízes (sob owl:Thing). Cada nó traz contagem de atributos, relações e subclasses.',
    input_schema: objeto({ classe: texto('Classe de partida (opcional; sem ela, as raízes).'), profundidade: { type: 'number', description: 'Níveis a descer (padrão 2).' } }),
  },
  {
    name: 'buscar_classe',
    description: 'Tudo sobre uma classe da ontologia ajustada: definição, superclasses, subclasses, atributos (tipo e descrição), relações de saída e de entrada, alinhamentos externos, ajustes (AJ) que a tocaram, categorias DKC de origem e justificativa da DKD.',
    input_schema: objeto({ nome: texto('Nome exato ou aproximado (sem diferenciar acento/maiúscula).') }, ['nome']),
  },
  {
    name: 'listar_classes',
    description: 'Nomes das classes da ontologia ajustada que contêm o trecho (sem o trecho, todas).',
    input_schema: objeto({ filtro: texto('Trecho do nome.') }),
  },
  {
    name: 'buscar_atributo',
    description: 'Classes em que um atributo cujo nome contém o trecho aparece, com tipo xsd e descrição.',
    input_schema: objeto({ trecho: texto('Trecho do nome do atributo.') }, ['trecho']),
  },
  {
    name: 'buscar_relacao',
    description: 'Pares origem–verbo–destino cujo verbo contém o trecho, com alinhamentos externos.',
    input_schema: objeto({ trecho: texto('Trecho do verbo (ex.: TITULAR).') }, ['trecho']),
  },
  {
    name: 'ler_lastro',
    description: 'Linhas dos artefatos de especificação do domínio (ASD, DCI, DKC, DKD, ORR e respostas ASD) que citam o termo, com arquivo e número da linha. Use para fundamentar uma proposta em evidência do próprio domínio.',
    input_schema: objeto({ termo: texto('Termo a procurar (sem diferenciar acento/maiúscula).'), limite: { type: 'number', description: 'Máximo de linhas (padrão 40).' } }, ['termo']),
  },
  {
    name: 'buscar_termo_externo',
    description: 'Procura nas ontologias externas com fonte em cache (FIBO, PROV, FOAF…) termos cujo rótulo ou nome local contém o trecho. Devolve sigla, IRI, tipo e rótulo. Use antes de propor alinhamento.',
    input_schema: objeto({ trecho: texto('Trecho do termo, em inglês na maioria das fontes.'), sigla: texto('Restringe a uma ontologia (opcional).') }, ['trecho']),
  },
  {
    name: 'ver_registro',
    description: 'Ajustes já registrados (AJ, operação, alvo, motivo, fonte, situação), mais recentes primeiro.',
    input_schema: objeto({ filtro: texto('Trecho de alvo, operação ou motivo (opcional).'), situacao: { type: 'string', enum: ['ativo', 'orfao', 'desfeito'] } }),
  },
  {
    name: 'validar',
    description: 'Validação estrutural da ontologia ajustada atual (erros e avisos), ou o motivo pelo qual a geração é recusada.',
    input_schema: objeto({}),
  },
];

const PARAMETROS_DOC = Object.entries({
  adicionar_superclasse: '{ classe, superclasse }',
  remover_superclasse: '{ classe, superclasse }',
  criar_classe: '{ nome, definicao, superclasse?, alinhamentos? }',
  remover_classe: '{ nome } — só sem subclasse, atributo próprio nem relação',
  alterar_classe: '{ nome, definicao }',
  adicionar_atributo: `{ classe, nome, tipo (${TIPOS_XSD.join('|')}), descricao? }`,
  remover_atributo: '{ classe, nome }',
  alterar_atributo: '{ classe, nome, novoNome?, tipo?, novaClasse? }',
  adicionar_relacao: '{ origem, verbo, destino, alinhamentos? }',
  remover_relacao: '{ origem, verbo, destino }',
  alterar_relacao: '{ origem, verbo, destino, novoVerbo?, novaOrigem?, novoDestino? }',
}).map(([op, p]) => `${op} ${p}`).join('; ');

const FERRAMENTA_PROPOR = {
  name: 'propor_mudancas',
  description: `Registra uma proposta de mudanças para o administrador decidir. NÃO executa nada. Operações e parâmetros: ${PARAMETROS_DOC}. alinhamentos = [{ sigla, termo, tipo (eq|sub|sup|close|desenho) }]. Cada ajuste exige motivo (o lastro, em uma ou duas frases) e fonte.`,
  input_schema: objeto({
    resumo: texto('Explicação curta da proposta, mostrada ao administrador.'),
    desfazer: { type: 'array', items: { type: 'number' }, description: 'Ids (número do AJ) de ajustes a desfazer.' },
    ajustes: {
      type: 'array',
      items: objeto({
        operacao: { type: 'string', enum: registro.OPERACOES },
        parametros: { type: 'object' },
        motivo: texto('Lastro do ajuste.'),
        fonte: { type: 'string', enum: FONTES_DO_MODELO, description: 'metadado/norma/ontologia_externa só com evidência citada no motivo; senão modelagem.' },
      }, ['operacao', 'parametros', 'motivo', 'fonte']),
    },
  }, ['resumo']),
};

// --- Contexto de leitura (uma vez por mensagem: a ontologia não muda no meio) -----

function contexto(slug) {
  const ajustada = decisoes.ontologiaAjustada(slug);
  const arvore = estado.montarArvore(ajustada);
  const porNome = new Map(arvore.classes.map((c) => [c.nome, c]));
  const dkdPorNome = new Map(ajustada.insumos.dkd.classes.map((c) => [c.nome, c]));
  const acharClasse = (nome) => {
    if (porNome.has(nome)) return porNome.get(nome);
    const alvo = normalizarBusca(String(nome || ''));
    return arvore.classes.find((c) => normalizarBusca(c.nome) === alvo) || null;
  };
  return { slug, ajustada, arvore, porNome, dkdPorNome, acharClasse };
}

const contem = (valor, trecho) => normalizarBusca(String(valor ?? '')).includes(normalizarBusca(String(trecho ?? '')));

function verHierarquia(ctx, { classe, profundidade = 2 }) {
  const raiz = classe ? ctx.acharClasse(classe) : null;
  if (classe && !raiz) return { erro: `Classe "${classe}" não encontrada.` };
  const limite = Math.max(1, Math.min(Number(profundidade) || 2, 6));
  const no = (nome, nivel, caminho) => {
    const c = ctx.porNome.get(nome);
    const item = { nome, atributos: c.atributos.length, relacoes: c.saida.length, subclasses: c.subclasses.length };
    if (c.superclasses.length > 1) item.outrasSuperclasses = c.superclasses;
    if (nivel < limite && !caminho.includes(nome) && c.subclasses.length) item.filhas = c.subclasses.map((f) => no(f, nivel + 1, [...caminho, nome]));
    return item;
  };
  return raiz ? no(raiz.nome, 0, []) : { owlThing: ctx.arvore.raizes.map((r) => no(r, 1, [])) };
}

function buscarClasse(ctx, { nome }) {
  const c = ctx.acharClasse(nome);
  if (!c) return { erro: `Classe "${nome}" não encontrada. Use listar_classes.` };
  const dkd = ctx.dkdPorNome.get(c.nome) || {};
  return {
    ...c,
    justificativaDkd: dkd.justificativa || null,
    categoriasDkc: dkd.origemCategorias || [],
    criadaPorAjuste: dkd.ajuste || null,
  };
}

function buscarAtributo(ctx, { trecho }) {
  return ctx.arvore.classes.flatMap((c) => c.atributos.filter((a) => contem(a.nome, trecho)).map((a) => ({ classe: c.nome, ...a })));
}

function buscarRelacao(ctx, { trecho }) {
  return ctx.arvore.classes.flatMap((c) => c.saida.filter((r) => contem(r.verbo, trecho)));
}

function arquivosDeEspecificacao(slug) {
  const raiz = path.join(repoRoot(), 'trabalho', 'ontologia', slug, 'especificacao');
  const saida = [];
  const andar = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) andar(p);
      else if (e.name.endsWith('.md')) saida.push(p);
    }
  };
  andar(raiz);
  return saida;
}

function lerLastro(ctx, { termo, limite = 40 }) {
  if (!termo || !String(termo).trim()) return { erro: 'Informe o termo.' };
  const max = Math.max(1, Math.min(Number(limite) || 40, 100));
  const achados = [];
  for (const arquivo of arquivosDeEspecificacao(ctx.slug)) {
    const linhas = fs.readFileSync(arquivo, 'utf8').split('\n');
    for (const [i, linha] of linhas.entries()) {
      if (!contem(linha, termo)) continue;
      achados.push({ arquivo: path.relative(repoRoot(), arquivo), linha: i + 1, texto: linha.length > 500 ? `${linha.slice(0, 500)}…` : linha });
      if (achados.length >= max) return { achados, truncado: true };
    }
  }
  return { achados, truncado: false };
}

async function buscarTermoExterno(ctx, { trecho, sigla }) {
  const alvo = normalizarTermo(trecho || '');
  if (!alvo) return { erro: 'Informe o trecho.' };
  const fontes = Object.values(decisoes.listarFontesPorSigla()).filter((f) => !sigla || f.sigla === sigla);
  const resultados = [];
  const semCache = [];
  for (const f of fontes) {
    if (f.modo === 'desenho' || !f.arquivoCache) {
      semCache.push(`${f.sigla} (${f.modo === 'desenho' ? 'modo desenho, sem IRI' : 'sem arquivo em cache'})`);
      continue;
    }
    let indice;
    try {
      indice = await fontesOco.indiceDaFonte(f);
    } catch (err) {
      semCache.push(`${f.sigla} (${err.message})`);
      continue;
    }
    for (const [chave, termos] of indice) {
      if (!chave.includes(alvo)) continue;
      for (const t of termos.values()) resultados.push({ sigla: f.sigla, iri: t.iri, tipo: t.tipo, rotulo: t.rotulo });
    }
  }
  const unicos = [...new Map(resultados.map((r) => [`${r.sigla}|${r.iri}`, r])).values()];
  return { termos: unicos.slice(0, 40), total: unicos.length, semCache };
}

function verRegistro(ctx, { filtro, situacao }) {
  const lista = estado.registroComSituacao(ctx.slug, ctx.ajustada).reverse()
    .filter((a) => (!situacao || a.situacao === situacao) && (!filtro || [a.rotulo, a.rotuloOperacao, a.alvo, a.motivo].some((v) => contem(v, filtro))))
    .map((a) => ({ aj: a.rotulo, id: a.id, operacao: a.operacao, alvo: a.alvo, motivo: a.motivo, fonte: a.fonte, situacao: a.situacao, causa: a.causa, autor: a.autor, data: String(a.criadoEm).slice(0, 10) }));
  return { total: lista.length, ajustes: lista.slice(0, 60) };
}

function validarOntologia(ctx) {
  try {
    const r = geracao.validarEstrutural(ctx.slug);
    return { erros: r.erros.slice(0, 40), avisos: r.avisos.slice(0, 40), totalErros: r.erros.length, totalAvisos: r.avisos.length };
  } catch (err) {
    if (err.status && err.status < 500) return { recusa: err.message, ...(err.detalhes || {}) };
    throw err;
  }
}

async function executarLeitura(ctx, nome, input = {}) {
  switch (nome) {
    case 'ver_hierarquia': return verHierarquia(ctx, input);
    case 'buscar_classe': return buscarClasse(ctx, input);
    case 'listar_classes': return ctx.arvore.classes.filter((c) => !input.filtro || contem(c.nome, input.filtro)).map((c) => c.nome);
    case 'buscar_atributo': return buscarAtributo(ctx, input);
    case 'buscar_relacao': return buscarRelacao(ctx, input);
    case 'ler_lastro': return lerLastro(ctx, input);
    case 'buscar_termo_externo': return buscarTermoExterno(ctx, input);
    case 'ver_registro': return verRegistro(ctx, input);
    case 'validar': return validarOntologia(ctx);
    default: return { erro: `Ferramenta desconhecida: ${nome}` };
  }
}

// --- Proposta ------------------------------------------------------------------------

// Confere a forma (não a estrutura: essa é do Aplicar, contra o estado de então)
// e devolve os itens legíveis. Lança Error com a mensagem para o modelo corrigir.
function validarProposta(slug, input, porSigla) {
  if (!input || typeof input.resumo !== 'string' || !input.resumo.trim()) throw new Error('"resumo" é obrigatório.');
  const desfazer = (input.desfazer || []).map((id) => {
    const a = registro.obter(slug, Number(id));
    if (!a) throw new Error(`AJ-${id} não existe neste domínio.`);
    if (a.situacao === 'desfeito') throw new Error(`${a.rotulo} já está desfeito.`);
    return { id: a.id, rotulo: a.rotulo, rotuloOperacao: a.rotuloOperacao, alvo: a.alvo };
  });
  const ajustes = (input.ajustes || []).map((aj, i) => {
    const n = `ajuste ${i + 1}`;
    if (!aj || !registro.OPERACOES.includes(aj.operacao)) throw new Error(`${n}: operação desconhecida "${aj && aj.operacao}". Use ${registro.OPERACOES.join(', ')}.`);
    if (!aj.parametros || typeof aj.parametros !== 'object') throw new Error(`${n}: "parametros" deve ser um objeto.`);
    if (typeof aj.motivo !== 'string' || !aj.motivo.trim()) throw new Error(`${n}: "motivo" é obrigatório — nada entra sem lastro.`);
    if (!FONTES_DO_MODELO.includes(aj.fonte)) throw new Error(`${n}: fonte "${aj.fonte}" inválida. Use ${FONTES_DO_MODELO.join(', ')} (especialista só o administrador marca).`);
    const parametros = { ...aj.parametros };
    if (parametros.alinhamentos !== undefined) {
      if (!Array.isArray(parametros.alinhamentos)) throw new Error(`${n}: "alinhamentos" deve ser uma lista.`);
      parametros.alinhamentos = parametros.alinhamentos.map((m) => {
        const fonte = m && porSigla[m.sigla];
        if (!fonte) throw new Error(`${n}: ontologia "${m && m.sigla}" sem fonte cadastrada. Siglas: ${Object.keys(porSigla).join(', ')}.`);
        return { ontologiaId: fonte.ontologiaId, sigla: fonte.sigla, termo: m.termo, tipo: m.tipo };
      });
    }
    return {
      operacao: aj.operacao, rotuloOperacao: registro.ROTULO_OPERACAO[aj.operacao], alvo: registro.alvo(aj.operacao, parametros),
      parametros, motivo: aj.motivo.trim(), fonte: aj.fonte,
    };
  });
  if (!desfazer.length && !ajustes.length) throw new Error('A proposta não tem ajuste nem desfazer.');
  return { resumo: input.resumo.trim(), desfazer, ajustes };
}

// Junta propostas feitas na mesma mensagem (o modelo pode chamar a ferramenta mais de uma vez).
function juntar(atual, nova) {
  if (!atual) return nova;
  const ids = new Set(atual.desfazer.map((d) => d.id));
  return {
    resumo: `${atual.resumo}\n${nova.resumo}`,
    desfazer: [...atual.desfazer, ...nova.desfazer.filter((d) => !ids.has(d.id))],
    ajustes: [...atual.ajustes, ...nova.ajustes],
  };
}

// --- Conversa ------------------------------------------------------------------------

function montarSystemPrompt(slug) {
  return `Você é o assistente da etapa de ajustes manuais estruturais (subfase OCO, Ontology \
Construction) do processo de construção de ontologias de TORRES et al. (2024), no domínio \
"${slug}". Conversa em português do Brasil com um administrador — muitas vezes um especialista do \
domínio — que revisa a ontologia gerada: classes, definições, atributos, relações e hierarquia.

Como trabalhar:
- Consulte os dados com as ferramentas antes de afirmar qualquer coisa. Nunca invente classe, \
atributo, relação, AJ ou IRI. Cite nomes exatos.
- Nada entra sem lastro. Fundamente cada proposta em evidência: ler_lastro (especificação do \
domínio), buscar_termo_externo (ontologias de referência), norma citada pelo administrador. Onde \
falta evidência, diga "[requer pesquisa adicional]" em vez de preencher com plausibilidade.
- Classes são genéricas, nunca instâncias: nomeie o papel ("ÓrgãoDeInvestigação"), não o órgão.
- Nomes: classe em PascalCase, atributo em camelCase, verbo de relação em MAIÚSCULAS_COM_SUBLINHADO, \
com acentos (os nomes são em português).
- Definição de classe: gênero próximo + diferença específica.
- Ao revisar, vá por partes e explique o porquê; pergunte quando a decisão depende de \
conhecimento do especialista.

Mudanças: você só PROPÕE, com propor_mudancas; o administrador vê um cartão e decide o que \
aplicar. Pode haver várias operações num lote (ex.: criar a classe-mãe e depois mover as filhas — \
a ordem importa). Fonte de cada ajuste: "metadado", "norma" ou "ontologia_externa" só com a \
evidência citada no motivo; o resto é "modelagem". Você não muda DKD, alinhamento, IRIs nem \
decisões da Construção: se o problema estiver lá, diga em qual etapa resolver — Especificação \
(DKC: captura por categoria; DKD: ontologia preliminar; ORR: reuso), Implementação ① e ② \
(alinhamento de classes e de relações) ou ③ Construção (tipos, IRIs, PROV, cadeias). Depois de propor, \
resuma em uma ou duas frases o que propôs e aguarde.`;
}

function rotuloProposta(m) {
  if (!m.proposta) return '';
  const itens = [
    ...m.proposta.desfazer.map((d) => `desfazer ${d.rotulo}`),
    ...m.proposta.ajustes.map((a) => `${a.operacao} ${a.alvo}`),
  ].join('; ');
  const situacao = m.aplicadaEm
    ? `aplicada por ${m.aplicadaPor}${m.resultado && m.resultado.ajustes ? ` → ${m.resultado.ajustes.map((a) => a.rotulo).join(', ')}` : ''}`
    : 'não aplicada';
  return `\n[proposta: ${itens} — ${situacao}]`;
}

function historico(slug) {
  const mensagens = [];
  for (const m of chat.listar(slug).filter((x) => x.papel !== 'sistema').slice(-MAX_MENSAGENS_HISTORICO)) {
    const role = m.papel === 'usuario' ? 'user' : 'assistant';
    const content = `${m.conteudo}${rotuloProposta(m)}`;
    const anterior = mensagens[mensagens.length - 1];
    if (anterior && anterior.role === role) anterior.content += `\n${content}`;
    else mensagens.push({ role, content });
  }
  // A Messages API exige que a conversa comece pelo usuário.
  while (mensagens.length && mensagens[0].role !== 'user') mensagens.shift();
  return mensagens;
}

const opcoesModelo = () => (process.env.LLM_MODELO_AJUSTES ? { model: process.env.LLM_MODELO_AJUSTES } : {});

function descreverModelo() {
  const { provider, model } = llm.descreverConfig(opcoesModelo());
  return `${model} (${provider})`;
}

const recortar = (valor) => {
  const s = JSON.stringify(valor);
  return s.length > MAX_RESULTADO ? `${s.slice(0, MAX_RESULTADO)}… [resultado truncado: refine a consulta]` : s;
};

async function enviarMensagem(slug, mensagemUsuario, autor) {
  if (typeof mensagemUsuario !== 'string' || !mensagemUsuario.trim()) throw falha(400, 'Mensagem vazia.');
  estado.exigirPreCondicoes(slug);
  chat.salvar(slug, { papel: 'usuario', conteudo: mensagemUsuario.trim(), autor });

  const ctx = contexto(slug);
  const porSigla = decisoes.listarFontesPorSigla();
  const ferramentas = [...FERRAMENTAS_LEITURA, FERRAMENTA_PROPOR];
  const mensagens = [{ role: 'system', content: montarSystemPrompt(slug) }, ...historico(slug)];
  let proposta = null;

  for (let rodada = 0; rodada < MAX_RODADAS_FERRAMENTA; rodada += 1) {
    const resposta = await llm.chatComFerramentas(mensagens, ferramentas, opcoesModelo());
    if (!resposta.toolUses.length) {
      const conteudo = resposta.texto && resposta.texto.trim() ? resposta.texto : TEXTO_RESPOSTA_VAZIA;
      return chat.salvar(slug, { papel: 'assistente', conteudo, proposta: proposta && { ...proposta, modelo: descreverModelo() } });
    }
    mensagens.push({ role: 'assistant', content: resposta.blocks });
    const resultados = [];
    for (const tu of resposta.toolUses) {
      try {
        if (tu.name === 'propor_mudancas') {
          proposta = juntar(proposta, validarProposta(slug, tu.input, porSigla));
          resultados.push({ type: 'tool_result', tool_use_id: tu.id, content: 'Proposta registrada; aguarda a decisão do administrador no cartão.' });
        } else {
          resultados.push({ type: 'tool_result', tool_use_id: tu.id, content: recortar(await executarLeitura(ctx, tu.name, tu.input)) });
        }
      } catch (err) {
        resultados.push({ type: 'tool_result', tool_use_id: tu.id, content: err.message, is_error: true });
      }
    }
    mensagens.push({ role: 'user', content: resultados });
  }
  return chat.salvar(slug, {
    papel: 'assistente',
    conteudo: `Atingi o limite de ${MAX_RODADAS_FERRAMENTA} consultas nesta mensagem sem concluir. Peça para eu continuar de onde parei.`,
    proposta: proposta && { ...proposta, modelo: descreverModelo() },
  });
}

// --- Aplicar ---------------------------------------------------------------------------

// selecao: { desfazer: [ids], ajustes: [índices], fontes: { índice: fonte } }.
// Numa transação: desfazeres (do mais novo ao mais antigo, para que dependente
// saia antes do ajuste de que depende) e depois os ajustes, em ordem. Qualquer
// recusa desfaz tudo e volta com o item que a causou.
function aplicarProposta(slug, mensagemId, selecao = {}, autor) {
  const m = chat.obter(Number(mensagemId));
  if (!m || m.dominio !== slug) throw falha(404, 'Mensagem não encontrada.');
  if (!m.proposta) throw falha(400, 'Esta mensagem não tem proposta.');
  if (m.aplicadaEm) throw falha(409, `Esta proposta já foi aplicada por ${m.aplicadaPor}.`);
  const p = m.proposta;
  const idsPropostos = new Set(p.desfazer.map((d) => d.id));
  const desfazer = [...new Set((selecao.desfazer || []).map(Number))];
  for (const id of desfazer) if (!idsPropostos.has(id)) throw falha(400, `AJ-${id} não faz parte desta proposta.`);
  const indices = [...new Set((selecao.ajustes || []).map(Number))].sort((a, b) => a - b);
  for (const i of indices) if (!p.ajustes[i]) throw falha(400, `Item ${i + 1} não faz parte desta proposta.`);
  if (!desfazer.length && !indices.length) throw falha(400, 'Nada selecionado para aplicar.');
  const fontes = selecao.fontes || {};
  for (const [i, f] of Object.entries(fontes)) if (!registro.FONTES.includes(f)) throw falha(400, `Item ${Number(i) + 1}: fonte "${f}" inválida.`);

  estado.exigirPreCondicoes(slug);
  const conn = conexao();
  const desfeitos = [];
  const criados = [];
  conn.exec('BEGIN');
  try {
    for (const id of [...desfazer].sort((a, b) => b - a)) {
      try {
        desfeitos.push(estado.desfazerAjuste(slug, id, autor));
      } catch (err) {
        err.message = `Desfazer AJ-${id}: ${err.message}`;
        throw err;
      }
    }
    for (const i of indices) {
      const a = p.ajustes[i];
      const parametros = { ...a.parametros };
      if (parametros.alinhamentos) parametros.alinhamentos = parametros.alinhamentos.map(({ ontologiaId, termo, tipo }) => ({ ontologiaId, termo, tipo }));
      try {
        const criado = estado.criarAjuste(slug, {
          operacao: a.operacao, parametros, motivo: `${prefixoMotivo(p.modelo)}${a.motivo}`, fonte: fontes[i] || a.fonte,
        }, autor);
        criados.push({ ...criado, indice: i });
      } catch (err) {
        err.message = `Item ${i + 1} (${a.rotuloOperacao}: ${a.alvo}): ${err.message} Nada desta proposta foi aplicado.`;
        throw err;
      }
    }
    const resultado = { desfeitos: desfeitos.map((a) => ({ id: a.id, rotulo: a.rotulo })), ajustes: criados.map((a) => ({ id: a.id, rotulo: a.rotulo, alvo: a.alvo, indice: a.indice, fonte: a.fonte })) };
    chat.marcarAplicada(m.id, autor, resultado);
    conn.exec('COMMIT');
    return { mensagem: chat.obter(m.id), ...resultado };
  } catch (err) {
    conn.exec('ROLLBACK');
    throw err;
  }
}

module.exports = {
  MAX_RODADAS_FERRAMENTA, FERRAMENTAS_LEITURA, FERRAMENTA_PROPOR, prefixoMotivo,
  montarSystemPrompt, executarLeitura, contexto, validarProposta, enviarMensagem, aplicarProposta,
};
