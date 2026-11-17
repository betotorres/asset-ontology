'use strict';

// Aplicação dos ajustes manuais estruturais sobre os insumos da Construção
// (spec 4.1) — função pura. Opera sobre insumos.dkd.classes (só o que está
// 'mantida'), mapeamentosClasse, mapeamentosRelacao e tiposDados, em ordem de
// id, só ajustes ativos. O gerador recebe o resultado sem mudança de contrato.
//
// Ajuste que não se aplica mais (alvo sumiu da base, nome passou a existir na
// DKD, ciclo…) é órfão: não é aplicado e volta com a causa. Na criação, o mesmo
// motivo vira recusa 400 (validarNovo).

const { motivoNomeInvalido, normalizarBusca } = require('../compilarDKD');
const { motivoTipoInvalido } = require('../eoa/fronteira');
const { local, nomePropriedade } = require('../oco/gerador');
const { falha, TIPOS_XSD } = require('../oco/constantes');
const { rotulo } = require('./registro');

const SUBCLASSE = 'É_SUBCLASSE_DE';

// Campos de cada operação (spec 3.2). Opcional vazio é omitido.
const CAMPOS = {
  adicionar_superclasse: { obrigatorios: ['classe', 'superclasse'], opcionais: [] },
  remover_superclasse: { obrigatorios: ['classe', 'superclasse'], opcionais: [] },
  criar_classe: { obrigatorios: ['nome', 'definicao'], opcionais: ['superclasse'], alinhamentos: true },
  remover_classe: { obrigatorios: ['nome'], opcionais: [] },
  alterar_classe: { obrigatorios: ['nome', 'definicao'], opcionais: [] },
  adicionar_atributo: { obrigatorios: ['classe', 'nome', 'tipo'], opcionais: ['descricao'] },
  remover_atributo: { obrigatorios: ['classe', 'nome'], opcionais: [] },
  alterar_atributo: { obrigatorios: ['classe', 'nome'], opcionais: ['novoNome', 'tipo', 'novaClasse'] },
  adicionar_relacao: { obrigatorios: ['origem', 'verbo', 'destino'], opcionais: [], alinhamentos: true },
  remover_relacao: { obrigatorios: ['origem', 'verbo', 'destino'], opcionais: [] },
  alterar_relacao: { obrigatorios: ['origem', 'verbo', 'destino'], opcionais: ['novoVerbo', 'novaOrigem', 'novoDestino'] },
};

function texto(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function recusa(mensagem) {
  return falha(400, mensagem);
}

function exigir(condicao, mensagem) {
  if (!condicao) throw recusa(mensagem);
}

// Parâmetros na forma canônica: só os campos da operação, texto aparado.
function normalizarParametros(operacao, parametros) {
  const campos = CAMPOS[operacao];
  exigir(campos, `operação inválida: "${operacao}"`);
  exigir(parametros && typeof parametros === 'object' && !Array.isArray(parametros), 'informe os parâmetros da operação');
  const p = {};
  for (const k of campos.obrigatorios) {
    exigir(texto(parametros[k]), `informe "${k}"`);
    p[k] = texto(parametros[k]);
  }
  for (const k of campos.opcionais) if (texto(parametros[k])) p[k] = texto(parametros[k]);
  if (campos.alinhamentos && parametros.alinhamentos !== undefined && parametros.alinhamentos !== null) {
    exigir(Array.isArray(parametros.alinhamentos), '"alinhamentos" deve ser uma lista de { ontologiaId, termo, tipo }');
    for (const a of parametros.alinhamentos) exigir(a && Number.isInteger(Number(a.ontologiaId)) && a.ontologiaId !== '' && a.ontologiaId !== null, 'alinhamento: informe "ontologiaId"');
    if (parametros.alinhamentos.length) {
      p.alinhamentos = parametros.alinhamentos.map((a) => ({
        ontologiaId: Number(a && a.ontologiaId), termo: texto(a && a.termo) || '', tipo: a && typeof a.tipo === 'string' ? a.tipo : '',
      }));
    }
  }
  return p;
}

// --- Estado de trabalho ----------------------------------------------------------

function estadoInicial(insumos) {
  return {
    dkd: { ...insumos.dkd, classes: JSON.parse(JSON.stringify((insumos.dkd && insumos.dkd.classes) || [])) },
    mapeamentosClasse: (insumos.mapeamentosClasse || []).map((m) => ({ ...m })),
    mapeamentosRelacao: (insumos.mapeamentosRelacao || []).map((m) => ({ ...m })),
    tiposDados: { ...(insumos.tiposDados || {}) },
    justificativasTipos: { ...(insumos.justificativasTipos || {}) },
    fontes: insumos.fontes || {},
  };
}

const mantidas = (s) => s.dkd.classes.filter((c) => c.status === 'mantida');
const achar = (s, nome) => mantidas(s).find((c) => c.nome === nome) || null;

// Relações mantidas cujo destino é classe mantida (o que o gerador emite).
function relacoesVivas(s) {
  const classes = mantidas(s);
  const porNome = new Set(classes.map((c) => c.nome));
  const porId = new Map(classes.map((c) => [c.id, c.nome]));
  const vivas = [];
  for (const c of classes) {
    for (const r of c.relacoes || []) {
      if (r.status !== 'mantida') continue;
      const destino = r.classeDestinoNome || porId.get(r.classeDestinoId);
      if (destino && porNome.has(destino)) vivas.push({ classe: c, r, origem: c.nome, verbo: r.tipo, destino });
    }
  }
  return vivas;
}

const superclasses = (s, nome) => relacoesVivas(s).filter((x) => x.origem === nome && x.verbo === SUBCLASSE).map((x) => x.destino);
const acharRelacao = (s, origem, verbo, destino) => relacoesVivas(s).find((x) => x.origem === origem && x.verbo === verbo && x.destino === destino) || null;

function ancestrais(s, nome) {
  const vistos = new Set();
  const pilha = [nome];
  while (pilha.length) {
    for (const pai of superclasses(s, pilha.pop())) {
      if (!vistos.has(pai)) { vistos.add(pai); pilha.push(pai); }
    }
  }
  return vistos;
}

function exigirClasse(s, nome) {
  const c = achar(s, nome);
  exigir(c, `a classe "${nome}" não existe na ontologia ajustada`);
  return c;
}

function exigirAtributo(c, nome) {
  const p = (c.propriedades || []).find((x) => x.status === 'mantida' && x.nome === nome);
  exigir(p, `o atributo "${c.nome}.${nome}" não existe na ontologia ajustada`);
  return p;
}

function exigirNomeLivreDeClasse(s, nome) {
  const motivo = motivoNomeInvalido('classe', nome);
  exigir(!motivo, motivo);
  const igual = mantidas(s).find((c) => normalizarBusca(c.nome) === normalizarBusca(nome));
  exigir(!igual, `já existe a classe "${igual && igual.nome}"`);
}

function exigirNomeLivreDeAtributo(c, nome) {
  const motivo = motivoNomeInvalido('atributo', nome);
  exigir(!motivo, motivo);
  const igual = (c.propriedades || []).find((p) => p.status === 'mantida' && normalizarBusca(p.nome) === normalizarBusca(nome));
  exigir(!igual, `a classe "${c.nome}" já tem o atributo "${igual && igual.nome}"`);
}

function exigirVerbo(verbo) {
  const motivo = motivoNomeInvalido('verbo', verbo);
  exigir(!motivo, motivo);
  exigir(verbo !== SUBCLASSE, `${SUBCLASSE} é hierarquia: use adicionar_superclasse`);
}

function exigirSemCiclo(s, classe, superclasse) {
  exigir(classe !== superclasse, `ciclo na hierarquia: "${classe}" não pode ser superclasse de si mesma`);
  exigir(!ancestrais(s, superclasse).has(classe), `ciclo na hierarquia: "${superclasse}" já é subclasse de "${classe}"`);
}

// Tipo xsd que o atributo terá sob o nome `nome`: um nome é uma data property
// só, com um alcance; entrar num nome que já tem tipo decidido diferente é recusado.
function exigirTipoCompativel(s, nome, tipo, usosAlem) {
  exigir(TIPOS_XSD.includes(tipo), `tipo "${tipo}" inválido: use ${TIPOS_XSD.join(', ')}`);
  const atual = s.tiposDados[nome];
  exigir(!usosAlem || !atual || atual === tipo, `o atributo "${nome}" já existe em outra classe com tipo xsd:${atual}; use o mesmo tipo`);
}

const usosDoNome = (s, nome, exceto) => mantidas(s).filter((c) => c !== exceto && (c.propriedades || []).some((p) => p.status === 'mantida' && p.nome === nome)).length;

// Alinhamentos de ajuste seguem as regras do EOA: ontologia com fonte
// cadastrada, TIPOS_MAPEAMENTO e desenho↔modo da fonte. `existentes` são os
// mapeamentos que o elemento já tem: repetir ontologia + termo é recusado.
function validarAlinhamentos(s, lista = [], existentes = []) {
  const porId = new Map(Object.values(s.fontes).map((f) => [Number(f.ontologiaId), f]));
  const vistos = new Set();
  return lista.map((a) => {
    const fonte = porId.get(a.ontologiaId);
    exigir(fonte, `alinhamento: a ontologia ${a.ontologiaId} não tem fonte cadastrada na Construção`);
    exigir(a.termo, `alinhamento com ${fonte.sigla}: informe o termo externo`);
    const motivo = motivoTipoInvalido(a.tipo, fonte.modo);
    exigir(!motivo, `alinhamento com ${fonte.sigla}: ${motivo}`);
    const chave = `${fonte.ontologiaId}|${a.termo}`;
    exigir(!vistos.has(chave), `alinhamento repetido: ${fonte.sigla} ${a.termo}`);
    const mesmaFonte = (m) => (m.ontologiaId !== undefined && m.ontologiaId !== null ? Number(m.ontologiaId) === Number(fonte.ontologiaId) : m.sigla === fonte.sigla);
    exigir(!existentes.some((m) => mesmaFonte(m) && m.termo === a.termo), `já existe o mapeamento do elemento com ${fonte.sigla} ${a.termo}`);
    vistos.add(chave);
    return { ontologiaId: fonte.ontologiaId, ontologia: fonte.nome, sigla: fonte.sigla, termo: a.termo, tipo: a.tipo };
  });
}

function novaRelacao(verbo, destino, aj, base = {}) {
  return {
    ...base, tipo: verbo, classeDestinoNome: destino, classeDestinoId: null, status: 'mantida',
    justificativa: base.justificativa || null, origemCategorias: base.origemCategorias || [], manual: false, ajuste: aj,
  };
}

function removerRelacao(rel) {
  rel.classe.relacoes = rel.classe.relacoes.filter((r) => r !== rel.r);
}

// --- Operações ---------------------------------------------------------------------
// Cada uma valida tudo antes de mudar o estado (recusa não deixa meia aplicação)
// e devolve as marcas: elemento tocado e, quando o elemento continua existindo,
// o nome local que recebe o skos:changeNote.

const OPERACOES = {
  adicionar_superclasse(s, p, aj) {
    const c = exigirClasse(s, p.classe);
    exigirClasse(s, p.superclasse);
    exigir(!superclasses(s, p.classe).includes(p.superclasse), `"${p.classe}" já é subclasse de "${p.superclasse}"`);
    exigirSemCiclo(s, p.classe, p.superclasse);
    c.relacoes = [...(c.relacoes || []), novaRelacao(SUBCLASSE, p.superclasse, aj)];
    return [{ tipo: 'classes', chave: p.classe, nota: local(p.classe) }];
  },

  remover_superclasse(s, p) {
    exigirClasse(s, p.classe);
    const arestas = relacoesVivas(s).filter((x) => x.origem === p.classe && x.verbo === SUBCLASSE && x.destino === p.superclasse);
    exigir(arestas.length, `"${p.classe}" não é subclasse de "${p.superclasse}" na ontologia ajustada`);
    for (const a of arestas) removerRelacao(a);
    return [{ tipo: 'classes', chave: p.classe, nota: local(p.classe) }];
  },

  criar_classe(s, p, aj) {
    exigirNomeLivreDeClasse(s, p.nome);
    if (p.superclasse) exigirClasse(s, p.superclasse);
    const alinhamentos = validarAlinhamentos(s, p.alinhamentos, s.mapeamentosClasse.filter((m) => m.classe === p.nome));
    s.dkd.classes.push({
      id: null, nome: p.nome, descricao: p.definicao, justificativa: null, origemCategorias: [], manual: false, status: 'mantida', ajuste: aj,
      propriedades: [], relacoes: p.superclasse ? [novaRelacao(SUBCLASSE, p.superclasse, aj)] : [],
    });
    for (const a of alinhamentos) s.mapeamentosClasse.push({ classe: p.nome, ...a, registro: 'ajuste', ajuste: aj });
    return [{ tipo: 'classes', chave: p.nome, nota: local(p.nome) }];
  },

  // Só a definição (rdfs:comment) muda; nome, hierarquia, atributos e relações ficam.
  alterar_classe(s, p, aj) {
    const c = exigirClasse(s, p.nome);
    exigir(p.definicao !== (c.descricao || '').trim(), 'alteração sem nenhuma mudança: a definição é a mesma');
    c.descricao = p.definicao;
    c.ajuste = aj;
    return [{ tipo: 'classes', chave: p.nome, nota: local(p.nome) }];
  },

  remover_classe(s, p) {
    const c = exigirClasse(s, p.nome);
    const vivas = relacoesVivas(s);
    const subclasses = vivas.filter((x) => x.verbo === SUBCLASSE && x.destino === p.nome).map((x) => x.origem);
    exigir(!subclasses.length, `"${p.nome}" ainda tem subclasse(s): ${subclasses.join(', ')} — remova ou mova antes`);
    const atributos = (c.propriedades || []).filter((x) => x.status === 'mantida').map((x) => x.nome);
    exigir(!atributos.length, `"${p.nome}" ainda tem atributo(s): ${atributos.join(', ')} — remova ou mova antes`);
    const relacoes = vivas.filter((x) => x.verbo !== SUBCLASSE && (x.origem === p.nome || x.destino === p.nome)).map((x) => `${x.origem} ${x.verbo} ${x.destino}`);
    exigir(!relacoes.length, `"${p.nome}" ainda tem relação(ões): ${relacoes.join('; ')} — remova ou altere antes`);
    s.dkd.classes = s.dkd.classes.filter((x) => x !== c);
    s.mapeamentosClasse = s.mapeamentosClasse.filter((m) => m.classe !== p.nome);
    return [];
  },

  adicionar_atributo(s, p, aj, ajuste) {
    const c = exigirClasse(s, p.classe);
    exigirNomeLivreDeAtributo(c, p.nome);
    exigirTipoCompativel(s, p.nome, p.tipo, usosDoNome(s, p.nome, null) > 0);
    c.propriedades = [...(c.propriedades || []), {
      nome: p.nome, descricao: p.descricao || `adicionado pelo ajuste manual ${aj}`, justificativa: null, manual: false, status: 'mantida', ajuste: aj,
    }];
    definirTipo(s, p.nome, p.tipo, aj, ajuste);
    return [{ tipo: 'atributos', chave: `${p.classe}.${p.nome}`, nota: local(p.nome) }];
  },

  remover_atributo(s, p) {
    const c = exigirClasse(s, p.classe);
    const atributo = exigirAtributo(c, p.nome);
    c.propriedades = c.propriedades.filter((x) => x !== atributo);
    return [{ tipo: 'classes', chave: p.classe, nota: local(p.classe) }];
  },

  alterar_atributo(s, p, aj, ajuste) {
    const c = exigirClasse(s, p.classe);
    const atributo = exigirAtributo(c, p.nome);
    const nome = p.novoNome || p.nome;
    const alvo = p.novaClasse ? exigirClasse(s, p.novaClasse) : c;
    const mudaNome = nome !== p.nome;
    const mudaClasse = alvo !== c;
    const mudaTipo = Boolean(p.tipo) && p.tipo !== s.tiposDados[nome];
    exigir(mudaNome || mudaClasse || mudaTipo, 'alteração sem nenhuma mudança: informe novo nome, nova classe ou outro tipo');
    if (mudaNome || mudaClasse) {
      if (mudaNome) exigirNomeLivreDeAtributo(alvo, nome);
      else exigir(!(alvo.propriedades || []).some((x) => x.status === 'mantida' && x.nome === nome), `a classe "${alvo.nome}" já tem o atributo "${nome}"`);
    }
    // Renomear sem informar tipo leva o tipo decidido do nome antigo para o novo.
    const tipoFinal = p.tipo || (mudaNome ? s.tiposDados[p.nome] : undefined);
    if (tipoFinal) exigirTipoCompativel(s, nome, tipoFinal, mudaNome && usosDoNome(s, nome, null) > 0);
    c.propriedades = c.propriedades.filter((x) => x !== atributo);
    alvo.propriedades = [...(alvo.propriedades || []), { ...atributo, nome, ajuste: aj }];
    if (tipoFinal) definirTipo(s, nome, tipoFinal, aj, ajuste);
    if (mudaNome && usosDoNome(s, p.nome, null) === 0) {
      delete s.tiposDados[p.nome];
      delete s.justificativasTipos[p.nome];
    }
    return [{ tipo: 'atributos', chave: `${alvo.nome}.${nome}`, nota: local(nome) }];
  },

  adicionar_relacao(s, p, aj) {
    const c = exigirClasse(s, p.origem);
    exigirClasse(s, p.destino);
    exigirVerbo(p.verbo);
    exigir(!acharRelacao(s, p.origem, p.verbo, p.destino), `a relação "${p.origem} ${p.verbo} ${p.destino}" já existe`);
    const alinhamentos = validarAlinhamentos(s, p.alinhamentos,
      s.mapeamentosRelacao.filter((m) => m.origem === p.origem && m.verbo === p.verbo && m.destino === p.destino));
    c.relacoes = [...(c.relacoes || []), novaRelacao(p.verbo, p.destino, aj)];
    for (const a of alinhamentos) s.mapeamentosRelacao.push({ origem: p.origem, verbo: p.verbo, destino: p.destino, ...a, registro: 'ajuste', ajuste: aj });
    return [{ tipo: 'relacoes', chave: `${p.origem}|${p.verbo}|${p.destino}`, nota: nomePropriedade(p) }];
  },

  remover_relacao(s, p) {
    exigir(p.verbo !== SUBCLASSE, `${SUBCLASSE} é hierarquia: use remover_superclasse`);
    const rel = acharRelacao(s, p.origem, p.verbo, p.destino);
    exigir(rel, `a relação "${p.origem} ${p.verbo} ${p.destino}" não existe na ontologia ajustada`);
    removerRelacao(rel);
    s.mapeamentosRelacao = s.mapeamentosRelacao.filter((m) => !(m.origem === p.origem && m.verbo === p.verbo && m.destino === p.destino));
    return [{ tipo: 'classes', chave: p.origem, nota: local(p.origem) }];
  },

  alterar_relacao(s, p, aj) {
    exigir(p.verbo !== SUBCLASSE, `${SUBCLASSE} é hierarquia: use as operações de superclasse`);
    const rel = acharRelacao(s, p.origem, p.verbo, p.destino);
    exigir(rel, `a relação "${p.origem} ${p.verbo} ${p.destino}" não existe na ontologia ajustada`);
    const nova = { origem: p.novaOrigem || p.origem, verbo: p.novoVerbo || p.verbo, destino: p.novoDestino || p.destino };
    exigir(nova.origem !== p.origem || nova.verbo !== p.verbo || nova.destino !== p.destino,
      'alteração sem nenhuma mudança: informe novo verbo, nova origem ou novo destino');
    const origem = exigirClasse(s, nova.origem);
    exigirClasse(s, nova.destino);
    exigirVerbo(nova.verbo);
    exigir(!acharRelacao(s, nova.origem, nova.verbo, nova.destino), `a relação "${nova.origem} ${nova.verbo} ${nova.destino}" já existe`);
    removerRelacao(rel);
    s.mapeamentosRelacao = s.mapeamentosRelacao.filter((m) => !(m.origem === p.origem && m.verbo === p.verbo && m.destino === p.destino));
    origem.relacoes = [...(origem.relacoes || []), novaRelacao(nova.verbo, nova.destino, aj, { justificativa: rel.r.justificativa, origemCategorias: rel.r.origemCategorias })];
    return [{ tipo: 'relacoes', chave: `${nova.origem}|${nova.verbo}|${nova.destino}`, nota: nomePropriedade(nova) }];
  },
};

// Tipo dado no ajuste vale como tipo decidido (spec 4.1).
function definirTipo(s, nome, tipo, aj, ajuste) {
  s.tiposDados[nome] = tipo;
  s.justificativasTipos[nome] = `${aj} (ajuste manual): ${ajuste.motivo}`;
  s.origemTipos[nome] = ajuste.id;
}

function nota(ajuste) {
  return `${rotulo(ajuste.id)} (${String(ajuste.criadoEm || '').slice(0, 10)}, fonte: ${ajuste.fonte}): ${ajuste.motivo}`;
}

function aplicarUm(s, ajuste) {
  const p = normalizarParametros(ajuste.operacao, ajuste.parametros);
  return OPERACOES[ajuste.operacao](s, p, rotulo(ajuste.id), ajuste);
}

function marcasVazias() {
  return { classes: {}, atributos: {}, relacoes: {} };
}

// aplicarAjustes(insumos, ajustes) → { insumos, aplicados, orfaos, anotacoes, marcas, origemTipos }
// - aplicados: ids dos ajustes aplicados, em ordem;
// - orfaos: [{ id, operacao, motivo, causa }] — não aplicados;
// - anotacoes: { <nomeLocal>: [texto do skos:changeNote] } para o gerador;
// - marcas: { classes: { Nome: [ids] }, atributos: { 'Classe.nome': [ids] }, relacoes: { 'O|V|D': [ids] } };
// - origemTipos: { atributo: id do ajuste que decidiu o tipo }.
// Sem ajuste ativo, devolve os mesmos insumos (paridade byte a byte).
function aplicarAjustes(insumos, ajustes = []) {
  const ativos = ajustes.filter((a) => (a.situacao || 'ativo') === 'ativo')
    .sort((a, b) => (a.id === null ? Infinity : a.id) - (b.id === null ? Infinity : b.id));
  if (!ativos.length) return { insumos, aplicados: [], orfaos: [], anotacoes: {}, marcas: marcasVazias(), origemTipos: {} };
  const s = { ...estadoInicial(insumos), origemTipos: {} };
  const aplicados = [];
  const orfaos = [];
  const anotacoes = {};
  const marcas = marcasVazias();
  for (const ajuste of ativos) {
    let tocados;
    try {
      tocados = aplicarUm(s, ajuste);
    } catch (err) {
      if (err.status !== 400) throw err;
      orfaos.push({ id: ajuste.id, operacao: ajuste.operacao, motivo: ajuste.motivo, causa: err.message });
      continue;
    }
    aplicados.push(ajuste.id);
    for (const t of tocados) {
      (marcas[t.tipo][t.chave] = marcas[t.tipo][t.chave] || []).push(ajuste.id);
      if (t.nota) (anotacoes[t.nota] = anotacoes[t.nota] || []).push(nota(ajuste));
    }
  }
  return {
    insumos: {
      ...insumos, dkd: s.dkd, mapeamentosClasse: s.mapeamentosClasse, mapeamentosRelacao: s.mapeamentosRelacao,
      tiposDados: s.tiposDados, justificativasTipos: s.justificativasTipos,
    },
    aplicados, orfaos, anotacoes, marcas, origemTipos: s.origemTipos,
  };
}

// Validação ao criar (spec 3.3): o ajuste novo é aplicado, em memória, sobre a
// ontologia já ajustada pelos ativos anteriores; qualquer motivo de órfão é
// recusa. Devolve os parâmetros canônicos e o resultado com o ajuste aplicado.
function validarNovo(insumos, anteriores, { operacao, parametros, motivo, fonte }) {
  let canonicos;
  try {
    canonicos = normalizarParametros(operacao, parametros);
  } catch (err) {
    throw falha(400, `Ajuste recusado: ${err.message}.`, { causa: err.message });
  }
  // Renomear sem informar tipo leva o tipo decidido do nome antigo: congela-o
  // nos parâmetros, para que apagar depois a linha do nome antigo na Construção
  // não transforme o atributo renomeado em xsd:string.
  if (operacao === 'alterar_atributo' && canonicos.novoNome && canonicos.novoNome !== canonicos.nome && !canonicos.tipo) {
    const tipoAntigo = aplicarAjustes(insumos, anteriores).insumos.tiposDados[canonicos.nome];
    if (tipoAntigo) canonicos.tipo = tipoAntigo;
  }
  const novo = { id: null, operacao, parametros: canonicos, motivo, fonte, criadoEm: new Date().toISOString(), situacao: 'ativo' };
  const resultado = aplicarAjustes(insumos, [...anteriores, novo]);
  const recusado = resultado.orfaos.find((o) => o.id === null);
  if (recusado) throw falha(400, `Ajuste recusado: ${recusado.causa}.`, { causa: recusado.causa });
  return { parametros: canonicos, resultado };
}

// Termos externos dos alinhamentos de ajuste — precisam de linha em oco_iris
// (garantirPendentes) como qualquer termo usado.
function termosDeAjuste(resultado) {
  const { mapeamentosClasse = [], mapeamentosRelacao = [] } = resultado.insumos;
  return [
    ...mapeamentosClasse.filter((m) => m.registro === 'ajuste').map((m) => ({ ontologiaId: m.ontologiaId, termo: m.termo, tipoTermo: 'classe' })),
    ...mapeamentosRelacao.filter((m) => m.registro === 'ajuste').map((m) => ({ ontologiaId: m.ontologiaId, termo: m.termo, tipoTermo: 'propriedade' })),
  ];
}

module.exports = { CAMPOS, normalizarParametros, aplicarAjustes, validarNovo, termosDeAjuste };
