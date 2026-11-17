'use strict';

const llm = require('./llm');
const compilarDKD = require('./compilarDKD');
const dkdChat = require('./dkdChat');

const MAX_RODADAS_FERRAMENTA = 6;

// Teto de mensagens (usuário + assistente, já contadas juntas) enviadas como
// histórico a cada chamada ao LLM — sem isso o custo/latência cresce
// linearmente com o tamanho da sessão de revisão e eventualmente estoura a
// janela de contexto. 20 mensagens (~10 trocas) é suficiente para manter a
// conversa coerente sem crescimento ilimitado.
const MAX_MENSAGENS_HISTORICO = 20;

// Texto salvo no lugar de uma resposta final vazia do LLM (corte por
// max_tokens, recusa, ou resposta só com blocos não-texto) — a Messages API
// rejeita `content` vazio, então uma mensagem de assistente com texto vazio
// nunca pode ficar persistida: ela voltaria como histórico inválido na
// próxima chamada.
const TEXTO_RESPOSTA_VAZIA = '(sem resposta de texto)';

const FERRAMENTAS_LEITURA = [
  {
    name: 'buscar_classe',
    description: 'Busca uma classe da proposta pelo nome (sem diferenciar maiúsculas/minúsculas ou acento) e devolve descrição, justificativa, status, propriedades e relações nos dois sentidos (como origem e como destino).',
    input_schema: { type: 'object', properties: { nome: { type: 'string' } }, required: ['nome'] },
  },
  {
    name: 'listar_classes',
    description: 'Lista os nomes e status de todas as classes do domínio, opcionalmente filtrando por um trecho do nome.',
    input_schema: { type: 'object', properties: { filtro: { type: 'string' } } },
  },
  {
    name: 'buscar_vocabulario_relacao',
    description: 'Lista os tipos de relação já usados no domínio (ex.: TITULARIZA, FUNDAMENTA_SE_EM), opcionalmente filtrando por um trecho do tipo — use antes de propor um novo tipo de relação, para reaproveitar nome já existente.',
    input_schema: { type: 'object', properties: { termo: { type: 'string' } } },
  },
];

const TIPOS_ACAO_VALIDOS = new Set([
  'descartar_classe', 'manter_classe',
  'descartar_propriedade', 'manter_propriedade',
  'descartar_relacao', 'manter_relacao',
  'criar_classe', 'criar_propriedade', 'criar_relacao',
  'renomear_classe',
]);

const FERRAMENTA_PROPOR = {
  name: 'propor_mudancas',
  description: 'Registra uma proposta de mudanças (manter/descartar itens existentes, criar classe/propriedade/relação manual, ou renomear uma classe existente). Não executa nada — só fica pendente até o usuário confirmar explicitamente na tela.',
  input_schema: {
    type: 'object',
    properties: {
      resumo: { type: 'string', description: 'Explicação curta da proposta, mostrada ao usuário.' },
      acoes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            tipo: { type: 'string' },
            id: { type: 'number' },
            nome: { type: 'string' },
            novoNome: { type: 'string', description: 'Novo nome da classe — só usado em renomear_classe.' },
            descricao: { type: 'string' },
            classeId: { type: 'number' },
            origemId: { type: 'number' },
            destinoId: { type: 'number' },
            tipoRelacao: { type: 'string', description: 'Tipo da relação a criar (ex.: TITULARIZA) — só usado em criar_relacao; não confundir com "tipo", que é o tipo da AÇÃO (ex.: "criar_relacao").' },
            justificativa: { type: 'string' },
          },
          required: ['tipo'],
        },
      },
    },
    required: ['resumo', 'acoes'],
  },
};

const CAMPOS_OBRIGATORIOS_POR_TIPO = {
  descartar_classe: ['id'], manter_classe: ['id'],
  descartar_propriedade: ['id'], manter_propriedade: ['id'],
  descartar_relacao: ['id'], manter_relacao: ['id'],
  criar_classe: ['nome'],
  criar_propriedade: ['classeId', 'nome'],
  criar_relacao: ['origemId', 'destinoId', 'tipoRelacao'],
  renomear_classe: ['id', 'novoNome'],
};

function validarProposta(input) {
  if (!input || typeof input.resumo !== 'string' || !Array.isArray(input.acoes) || input.acoes.length === 0) {
    return { valido: false, erro: 'Proposta inválida: "resumo" (string) e "acoes" (array não vazio) são obrigatórios.' };
  }
  for (const acao of input.acoes) {
    if (!TIPOS_ACAO_VALIDOS.has(acao.tipo)) {
      return { valido: false, erro: `Tipo de ação desconhecido: "${acao.tipo}". Use um de: ${[...TIPOS_ACAO_VALIDOS].join(', ')}.` };
    }
    const faltando = CAMPOS_OBRIGATORIOS_POR_TIPO[acao.tipo].filter((campo) => acao[campo] === undefined || acao[campo] === null || acao[campo] === '');
    if (faltando.length > 0) {
      return { valido: false, erro: `Ação "${acao.tipo}" está sem o(s) campo(s) obrigatório(s): ${faltando.join(', ')}.` };
    }
  }
  return { valido: true, acoes: input.acoes };
}

function montarSystemPrompt(slug) {
  return `Você ajuda um humano a revisar uma proposta de ontologia (domínio "${slug}") \
gerada por outro LLM a partir de dados de captura de conhecimento (DKC). A proposta tem \
classes, propriedades e relações, cada uma com status pendente/mantida/descartada.

Antes de responder, use as ferramentas de leitura para consultar os dados reais da \
proposta — nunca invente nome de classe, id ou relação. Ao sugerir uma nova relação, \
confira o vocabulário já usado com buscar_vocabulario_relacao antes de inventar um tipo \
novo.

Seja direto e objetivo nas respostas — cite ids reais quando propuser uma ação.`;
}

// Corta para as últimas MAX_MENSAGENS_HISTORICO mensagens (ordem cronológica
// preservada) e colapsa entradas consecutivas do mesmo papel juntando o
// conteúdo com quebra de linha — a Messages API não aceita turnos adjacentes
// do mesmo papel, e isso pode acontecer aqui em dois casos: (a) uma tentativa
// anterior falhou depois de a mensagem do usuário já ter sido salva, gerando
// dois 'usuario' seguidos; (b) uma mensagem de assistente com placeholder
// (ver TEXTO_RESPOSTA_VAZIA) ficando ao lado de outra do mesmo papel.
function historicoParaMensagens(slug) {
  const recentes = dkdChat.listarMensagens(slug).slice(-MAX_MENSAGENS_HISTORICO);
  const mensagens = [];
  for (const m of recentes) {
    const role = m.papel === 'usuario' ? 'user' : 'assistant';
    const anterior = mensagens[mensagens.length - 1];
    if (anterior && anterior.role === role) {
      anterior.content += `\n${m.conteudo}`;
    } else {
      mensagens.push({ role, content: m.conteudo });
    }
  }
  return mensagens;
}

async function executarFerramentaLeitura(slug, nome, input) {
  if (nome === 'buscar_classe') {
    const classe = compilarDKD.buscarClassePorNome(slug, input.nome);
    return classe || { erro: `Classe "${input.nome}" não encontrada.` };
  }
  if (nome === 'listar_classes') {
    return compilarDKD.listarNomesClasses(slug, input.filtro);
  }
  if (nome === 'buscar_vocabulario_relacao') {
    return compilarDKD.listarVocabularioRelacao(slug, input.termo);
  }
  return { erro: `Ferramenta desconhecida: ${nome}` };
}

async function enviarMensagem(slug, mensagemUsuario) {
  dkdChat.salvarMensagem(slug, 'usuario', mensagemUsuario, null);

  const mensagens = [
    { role: 'system', content: montarSystemPrompt(slug) },
    ...historicoParaMensagens(slug),
  ];
  const todasFerramentas = [...FERRAMENTAS_LEITURA, FERRAMENTA_PROPOR];
  let acoesPendentes = null;

  for (let rodada = 0; rodada < MAX_RODADAS_FERRAMENTA; rodada += 1) {
    const resposta = await llm.chatComFerramentas(mensagens, todasFerramentas);

    if (resposta.toolUses.length === 0) {
      // O texto real (mesmo vazio) volta pro chamador; só o que é PERSISTIDO
      // troca por um placeholder, pra nunca gravar `conteudo` vazio (rejeitado
      // pela API como histórico na próxima chamada).
      const conteudoPersistido = resposta.texto && resposta.texto.trim() !== ''
        ? resposta.texto
        : TEXTO_RESPOSTA_VAZIA;
      const salva = dkdChat.salvarMensagem(slug, 'assistente', conteudoPersistido, acoesPendentes);
      return { mensagemId: salva.id, texto: resposta.texto, acoesPropostas: acoesPendentes };
    }

    mensagens.push({ role: 'assistant', content: resposta.blocks });
    const resultados = await Promise.all(resposta.toolUses.map(async (tu) => {
      if (tu.name === 'propor_mudancas') {
        const validacao = validarProposta(tu.input);
        if (!validacao.valido) {
          return { type: 'tool_result', tool_use_id: tu.id, content: validacao.erro, is_error: true };
        }
        acoesPendentes = validacao.acoes;
        return { type: 'tool_result', tool_use_id: tu.id, content: 'Proposta registrada, aguardando confirmação do usuário.' };
      }
      return {
        type: 'tool_result', tool_use_id: tu.id,
        content: JSON.stringify(await executarFerramentaLeitura(slug, tu.name, tu.input)),
      };
    }));
    mensagens.push({ role: 'user', content: resultados });
  }

  throw new Error(`O assistente atingiu o limite de ${MAX_RODADAS_FERRAMENTA} rodadas de ferramenta sem concluir.`);
}

function aplicarAcaoDecisao(slug, decidirFn, tipoItem, id, statusPedido) {
  const { classes } = compilarDKD.listarDkd(slug);
  let item;
  if (tipoItem === 'classe') item = classes.find((c) => c.id === id);
  else if (tipoItem === 'propriedade') item = classes.flatMap((c) => c.propriedades).find((p) => p.id === id);
  else item = classes.flatMap((c) => c.relacoes).find((r) => r.id === id);

  if (!item) return { status: 'pulada', motivo: `${tipoItem} ${id} não encontrada.` };
  if (item.status === statusPedido) return { status: 'no-op' };
  if (item.status !== 'pendente') {
    return { status: 'pulada', motivo: `${tipoItem} ${id} já foi decidida como "${item.status}".` };
  }
  try {
    decidirFn(id, statusPedido);
    return { status: 'aplicada' };
  } catch (err) {
    return { status: 'pulada', motivo: err.message };
  }
}

function aplicarUmaAcao(slug, acao) {
  try {
    switch (acao.tipo) {
      case 'manter_classe': return aplicarAcaoDecisao(slug, compilarDKD.decidirClasse, 'classe', acao.id, 'mantida');
      case 'descartar_classe': return aplicarAcaoDecisao(slug, compilarDKD.decidirClasse, 'classe', acao.id, 'descartada');
      case 'manter_propriedade': return aplicarAcaoDecisao(slug, compilarDKD.decidirPropriedade, 'propriedade', acao.id, 'mantida');
      case 'descartar_propriedade': return aplicarAcaoDecisao(slug, compilarDKD.decidirPropriedade, 'propriedade', acao.id, 'descartada');
      case 'manter_relacao': return aplicarAcaoDecisao(slug, compilarDKD.decidirRelacao, 'relação', acao.id, 'mantida');
      case 'descartar_relacao': return aplicarAcaoDecisao(slug, compilarDKD.decidirRelacao, 'relação', acao.id, 'descartada');
      case 'criar_classe':
        compilarDKD.adicionarClasseManual(slug, { nome: acao.nome, descricao: acao.descricao });
        return { status: 'aplicada' };
      case 'criar_propriedade':
        compilarDKD.adicionarPropriedadeManual(slug, { classeId: acao.classeId, nome: acao.nome, descricao: acao.descricao });
        return { status: 'aplicada' };
      case 'criar_relacao':
        compilarDKD.adicionarRelacaoManual(slug, { origemId: acao.origemId, destinoId: acao.destinoId, tipo: acao.tipoRelacao, justificativa: acao.justificativa });
        return { status: 'aplicada' };
      case 'renomear_classe':
        compilarDKD.renomearClasse(acao.id, acao.novoNome);
        return { status: 'aplicada' };
      default:
        return { status: 'pulada', motivo: `Tipo de ação desconhecido: ${acao.tipo}` };
    }
  } catch (err) {
    return { status: 'pulada', motivo: err.message };
  }
}

/**
 * Executa uma proposta já confirmada pelo humano (mensagem.acoesPropostas),
 * reconferindo cada ação contra o estado atual do DKD antes de aplicá-la —
 * o tempo entre o LLM propor e o humano confirmar é uma janela em que outra
 * decisão (manual, ou de outra proposta) pode ter mudado o item. Cada ação é
 * avaliada e aplicada independentemente: uma ação ruim (invariante violado,
 * id inexistente, conflito com decisão humana anterior) é reportada como
 * 'pulada' e não aborta as demais.
 */
async function aplicarProposta(slug, mensagemId) {
  const mensagem = dkdChat.buscarMensagem(mensagemId);
  if (!mensagem) throw new Error(`Mensagem ${mensagemId} não encontrada.`);
  if (mensagem.dominio !== slug) throw new Error(`Mensagem ${mensagemId} não pertence ao domínio "${slug}".`);
  if (!mensagem.acoesPropostas) throw new Error(`Mensagem ${mensagemId} está sem proposta.`);
  if (mensagem.aplicadaEm) throw new Error(`Mensagem ${mensagemId} já foi aplicada.`);

  const resultados = mensagem.acoesPropostas.map((acao) => ({ acao, ...aplicarUmaAcao(slug, acao) }));
  dkdChat.marcarAplicada(mensagemId);
  return { resultados, resumo: compilarDKD.listarDkd(slug) };
}

module.exports = { enviarMensagem, aplicarProposta, MAX_RODADAS_FERRAMENTA, MAX_MENSAGENS_HISTORICO };
