'use strict';

// Gerador da ontologia (OCO) — função pura. Port de
// trabalho/ontologia/recuperacao-ativos/implementacao/oco/gerar-ttl.js: mesma
// saída (grafo) para os mesmos insumos, com o cabeçalho owl:Ontology genérico.
// Não decide nada que não esteja nos insumos: termo sem IRI confirmada é erro.

const crypto = require('node:crypto');
const { falha, NS } = require('./constantes');

const PRED_CLASSE = { eq: 'owl:equivalentClass', sub: 'rdfs:subClassOf', sup: 'skos:narrowMatch', close: 'skos:closeMatch' };
// Nunca owl:equivalentProperty para propriedade externa: nosso domínio/alcance
// passaria a valer para todo uso externo. ≡ vira subPropertyOf + skos:exactMatch.
const PRED_PROP = { eq: 'rdfs:subPropertyOf', sub: 'rdfs:subPropertyOf', sup: 'skos:narrowMatch', close: 'skos:closeMatch' };
const PRED_SKOS = { eq: 'skos:exactMatch', sub: 'skos:broadMatch', sup: 'skos:narrowMatch', close: 'skos:closeMatch' };

const ascii = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const local = (nome) => ascii(nome).replace(/[^A-Za-z0-9]/g, '');
const camel = (verbo) => {
  const p = ascii(verbo).toLowerCase().split('_').filter(Boolean);
  return p[0] + p.slice(1).map((x) => x[0].toUpperCase() + x.slice(1)).join('');
};
const lit = (s, lang) => JSON.stringify(String(s)) + (lang ? `@${lang}` : '');

// Hash do conteúdo dos dois módulos, ignorando a data de criação.
function hashDe(nucleo, alinhamentos) {
  const semData = (t) => t.split('\n').filter((l) => !/^\s*dcterms:created\b/.test(l)).join('\n');
  return crypto.createHash('sha256').update(semData(nucleo)).update('\0').update(semData(alinhamentos)).digest('hex');
}

function classesMantidas(dkd) {
  return (dkd.classes || []).filter((c) => c.status === 'mantida');
}

// Pares de relação mantidos (sem É_SUBCLASSE_DE) e subclasses, por nome.
function extrairRelacoes(mantidas) {
  const porNome = new Map(mantidas.map((c) => [c.nome, c]));
  const porId = new Map(mantidas.map((c) => [c.id, c.nome]));
  const subDe = new Map();
  const pares = [];
  for (const c of mantidas) {
    for (const r of (c.relacoes || []).filter((x) => x.status === 'mantida')) {
      const destino = r.classeDestinoNome || porId.get(r.classeDestinoId);
      if (!destino || !porNome.has(destino)) continue;
      if (r.tipo === 'É_SUBCLASSE_DE') {
        if (!subDe.has(c.nome)) subDe.set(c.nome, []);
        subDe.get(c.nome).push(destino);
      } else {
        pares.push({ origem: c.nome, verbo: r.tipo, destino, manual: Boolean(r.manual), justificativa: r.justificativa || null });
      }
    }
  }
  return { subDe, pares };
}

// LIGA da reificação de titularidade: dividido pelo destino (Pessoa → ligaTitular).
function nomePropriedade(par) {
  if (par.verbo === 'LIGA') return par.destino === 'Pessoa' ? 'ligaTitular' : 'ligaAtivo';
  return camel(par.verbo);
}

// Termos usados em mapeamentos de fontes owl/skos sem IRI confirmada.
function termosSemIri(insumos) {
  const faltam = new Set();
  const todos = [...insumos.mapeamentosClasse, ...insumos.mapeamentosRelacao];
  for (const m of todos) {
    const fonte = insumos.fontes[m.sigla];
    if (!fonte || fonte.modo === 'desenho') continue;
    if (!insumos.iris[`${m.sigla}|${m.termo}`]) faltam.add(`${m.sigla}|${m.termo}`);
  }
  return [...faltam].sort();
}

function gerar(insumos) {
  const faltam = termosSemIri(insumos);
  if (faltam.length) {
    throw falha(409, `Há ${faltam.length} termo(s) externo(s) sem IRI confirmada.`, { termosSemIri: faltam });
  }
  const { config, fontes, iris } = insumos;
  const P = config.prefixo;
  const iriNucleo = config.namespace.replace(/[#/]$/, '');
  const iriAlin = `${iriNucleo}-alinhamentos`;
  const hoje = (insumos.agora || new Date().toISOString()).slice(0, 10);

  const mantidas = classesMantidas(insumos.dkd).sort((a, b) => a.nome.localeCompare(b.nome));
  const { subDe, pares } = extrairRelacoes(mantidas);

  const prefixos = [
    `@prefix ${P}: <${config.namespace}> .`,
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix skos: <http://www.w3.org/2004/02/skos/core#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    `@prefix prov: <${NS.PROV}> .`,
    '',
  ];
  const N = [...prefixos];
  const A = [...prefixos];
  const wN = (s = '') => N.push(s);
  const wA = (s = '') => A.push(s);
  const r = (nome) => `${P}:${nome}`;
  // Proveniência dos ajustes manuais (etapa ④): um skos:changeNote por ajuste
  // ativo que criou ou alterou o elemento. Sem ajustes, nada muda na saída.
  const notasAjuste = insumos.anotacoesAjuste || {};
  const notas = (L, nomeLocal) => {
    for (const t of notasAjuste[nomeLocal] || []) L.push(`  skos:changeNote ${lit(t, 'pt-BR')}`);
  };

  const siglasOwl = Object.values(fontes).filter((f) => f.modo !== 'desenho').map((f) => f.sigla).sort();
  const importadas = Object.values(fontes).filter((f) => f.importar && f.iriOntologia).sort((a, b) => a.sigla.localeCompare(b.sigla));

  wN(`<${iriNucleo}> a owl:Ontology ;`);
  wN(`  dcterms:title ${lit(`Ontologia do domínio ${insumos.slug}`, 'pt-BR')} ;`);
  wN(`  dcterms:description ${lit('Núcleo da ontologia construída pelo processo TORRES et al. (2024): classes, propriedades e hierarquia próprias, com lastro na DKD. Os mapeamentos para ontologias externas estão no módulo de alinhamento, que importa este arquivo.', 'pt-BR')} ;`);
  wN(`  dcterms:created "${hoje}" ;`);
  wN('  dcterms:language "pt-BR" ;');
  wN(`  owl:versionInfo ${lit(config.versao)} .`);
  wN();
  wN('# --- Propriedades de anotação próprias');
  wN(`${r('proveniencia')} a owl:AnnotationProperty ; rdfs:label "proveniência"@pt-BR ; rdfs:comment "Origem do elemento no processo: categorias da DKC de onde foi consolidado, ou marcação de adição manual na revisão humana."@pt-BR .`);
  wN();

  const imports = [`<${iriNucleo}>`, ...importadas.map((f) => `<${f.iriOntologia}>`)];
  wA(`<${iriAlin}> a owl:Ontology ;`);
  wA(`  owl:imports ${imports.join(' , ')} ;`);
  wA(`  dcterms:title ${lit(`Ontologia do domínio ${insumos.slug} — módulo de alinhamento`, 'pt-BR')} ;`);
  wA(`  dcterms:description ${lit(`Módulo de alinhamento (EOA/OCO): importa o núcleo e declara o reuso de ontologias externas (${siglasOwl.join(', ')}), a tipagem PROV-O e as origens de desenho.`, 'pt-BR')} ;`);
  wA(`  dcterms:created "${hoje}" ;`);
  wA(`  owl:versionInfo ${lit(config.versao)} ;`);
  const versoes = Object.values(fontes).sort((a, b) => a.sigla.localeCompare(b.sigla))
    .map((f) => `${f.sigla} (${f.modo})${f.versao ? ` ${f.versao}` : ''}`).join('; ');
  wA(`  rdfs:comment ${lit(`Versões das ontologias reusadas: ${versoes}.`, 'pt-BR')} .`);
  wA();
  wA('# --- Propriedades de anotação do alinhamento');
  wA(`${r('origemDeDesenho')} a owl:AnnotationProperty ; rdfs:label "origem de desenho"@pt-BR ; rdfs:comment "Conceito de ontologia sem IRI OWL utilizável (ACO, SUMO) que serviu de referência de modelagem — registro de reuso sem axioma."@pt-BR .`);
  wA(`${r('referenciaExternaNaoResolvida')} a owl:AnnotationProperty ; rdfs:label "referência externa não resolvida"@pt-BR ; rdfs:comment "Correspondência decidida no EOA cuja IRI não pôde ser confirmada na fonte; fica como texto até resolução."@pt-BR .`);
  wA();

  const relatorio = {
    contagens: { classes: mantidas.length, dataProperties: 0, objectProperties: 0, especializacoes: 0, paresRelacao: pares.length, subclasses: 0 },
    mapeamentos: { classe: {}, propriedade: {} },
    classes: [], objectProperties: [], dataProperties: [],
  };
  const contar = (grupo, chave) => { relatorio.mapeamentos[grupo][chave] = (relatorio.mapeamentos[grupo][chave] || 0) + 1; };

  // Emite um mapeamento e devolve o registro para o relatório.
  function emitir(linhas, grupo, m) {
    const fonte = fontes[m.sigla];
    if (fonte.modo === 'desenho') {
      linhas.push(`  ${r('origemDeDesenho')} ${lit(`${fonte.rotulo}: ${m.termo}`)}`);
      contar(grupo, 'desenho');
      return { ...m, predicado: `${P}:origemDeDesenho`, iri: null };
    }
    const iri = iris[`${m.sigla}|${m.termo}`];
    const tabela = fonte.modo === 'skos' ? PRED_SKOS : (grupo === 'classe' ? PRED_CLASSE : PRED_PROP);
    const predicado = tabela[m.tipo];
    linhas.push(`  ${predicado} <${iri}>`);
    if (grupo === 'propriedade' && fonte.modo === 'owl' && m.tipo === 'eq') linhas.push(`  skos:exactMatch <${iri}>`);
    contar(grupo, fonte.modo === 'skos' ? `skos:${m.tipo}` : m.tipo);
    return { ...m, predicado, iri };
  }

  // --- Classes
  const provDe = new Map(insumos.tipagemProv.map((t) => [t.classe, t.tipo]));
  const mapsDeClasse = new Map();
  for (const m of insumos.mapeamentosClasse) {
    if (!mapsDeClasse.has(m.classe)) mapsDeClasse.set(m.classe, []);
    mapsDeClasse.get(m.classe).push(m);
  }
  wN(`# --- Classes (${mantidas.length}, da DKD)`);
  wA('# --- Alinhamento de classes');
  for (const c of mantidas) {
    const L = [`${r(local(c.nome))} a owl:Class`, `  rdfs:label ${lit(c.nome, 'pt-BR')}`];
    if (c.descricao) L.push(`  rdfs:comment ${lit(c.descricao, 'pt-BR')}`);
    const proveniencia = [];
    if (c.origemCategorias && c.origemCategorias.length) proveniencia.push(`DKC: ${c.origemCategorias.join(', ')}`);
    if (c.manual) proveniencia.push('adicionado manualmente na revisão humana da DKD');
    if (c.ajuste) proveniencia.push(`criada pelo ajuste manual estrutural ${c.ajuste} (04-ajustes-manuais.md)`);
    for (const p of proveniencia) L.push(`  ${r('proveniencia')} ${lit(p, 'pt-BR')}`);
    const superclasses = subDe.get(c.nome) || [];
    relatorio.contagens.subclasses += superclasses.length;
    for (const s of superclasses) L.push(`  rdfs:subClassOf ${r(local(s))}`);
    notas(L, local(c.nome));
    wN(L.join(' ;\n') + ' .');
    wN();

    const M = [];
    const registrados = [];
    if (provDe.has(c.nome)) { M.push(`  rdfs:subClassOf prov:${provDe.get(c.nome)}`); contar('classe', 'prov'); }
    for (const m of mapsDeClasse.get(c.nome) || []) registrados.push(emitir(M, 'classe', m));
    if (M.length) { wA(`${r(local(c.nome))}\n${M.join(' ;\n')} .`); wA(); }
    relatorio.classes.push({ nome: c.nome, local: local(c.nome), superclasses, proveniencia, tipoProv: provDe.get(c.nome) || null, mapeamentos: registrados });
  }

  // --- Data properties (só no núcleo)
  wN('# --- Data properties (por nome de atributo da DKD; domínio = união das classes que o usam)');
  const usosPorAtributo = new Map();
  for (const c of mantidas) {
    for (const p of (c.propriedades || []).filter((x) => x.status === 'mantida')) {
      if (!usosPorAtributo.has(p.nome)) usosPorAtributo.set(p.nome, []);
      usosPorAtributo.get(p.nome).push({ classe: c.nome, descricao: p.descricao });
    }
  }
  for (const [nome, usos] of [...usosPorAtributo.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const L = [`${r(local(nome))} a owl:DatatypeProperty`, `  rdfs:label ${lit(nome, 'pt-BR')}`];
    for (const u of usos) if (u.descricao) L.push(`  rdfs:comment ${lit(`[${u.classe}] ${u.descricao}`, 'pt-BR')}`);
    L.push(usos.length === 1 ? `  rdfs:domain ${r(local(usos[0].classe))}`
      : `  rdfs:domain [ a owl:Class ; owl:unionOf ( ${usos.map((u) => r(local(u.classe))).join(' ')} ) ]`);
    const tipo = insumos.tiposDados[nome] || null;
    L.push(`  rdfs:range xsd:${tipo || 'string'}`);
    notas(L, local(nome));
    wN(L.join(' ;\n') + ' .');
    wN();
    relatorio.dataProperties.push({ nome, local: local(nome), classes: usos.map((u) => u.classe), alcance: `xsd:${tipo || 'string'}`, tipoDecidido: Boolean(tipo) });
  }
  relatorio.contagens.dataProperties = usosPorAtributo.size;

  // --- Object properties
  wN('# --- Object properties (por verbo da DKD; domínio/alcance = união dos pares)');
  wA('# --- Alinhamento de propriedades');
  const porProp = new Map();
  for (const par of pares) {
    const n = nomePropriedade(par);
    if (!porProp.has(n)) porProp.set(n, { verbo: par.verbo, pares: [] });
    porProp.get(n).pares.push(par);
  }
  const superDe = {};
  for (const sp of insumos.superpropriedades) {
    const L = [`${r(sp.nome)} a owl:ObjectProperty`, `  rdfs:label ${lit(sp.rotulo, 'pt-BR')}`];
    if (sp.comentario) L.push(`  rdfs:comment ${lit(sp.comentario, 'pt-BR')}`);
    if (sp.alcance) L.push(`  rdfs:range ${r(local(sp.alcance))}`);
    wN(L.join(' ;\n') + ' .');
    wN();
    for (const v of sp.membros) superDe[camel(v)] = sp.nome;
  }
  const mapsDoPar = new Map();
  for (const m of insumos.mapeamentosRelacao) {
    const k = `${m.origem}|${m.verbo}|${m.destino}`;
    if (!mapsDoPar.has(k)) mapsDoPar.set(k, []);
    mapsDoPar.get(k).push(m);
  }
  const mapPar = (p) => mapsDoPar.get(`${p.origem}|${p.verbo}|${p.destino}`) || [];
  const chave = (m) => `${m.sigla}|${m.termo}|${m.tipo}`;
  for (const [n, { verbo, pares: ps }] of [...porProp.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))) {
    const L = [`${r(n)} a owl:ObjectProperty`, `  rdfs:label ${lit(verbo, 'pt-BR')}`];
    const doms = [...new Set(ps.map((p) => p.origem))];
    const rngs = [...new Set(ps.map((p) => p.destino))];
    L.push(doms.length === 1 ? `  rdfs:domain ${r(local(doms[0]))}` : `  rdfs:domain [ a owl:Class ; owl:unionOf ( ${doms.map((d) => r(local(d))).join(' ')} ) ]`);
    L.push(rngs.length === 1 ? `  rdfs:range ${r(local(rngs[0]))}` : `  rdfs:range [ a owl:Class ; owl:unionOf ( ${rngs.map((d) => r(local(d))).join(' ')} ) ]`);
    for (const p of ps) L.push(`  rdfs:comment ${lit(`${p.origem} ${p.verbo} ${p.destino}` + (p.justificativa ? ` — ${p.justificativa}` : ''), 'pt-BR')}`);
    if (ps.some((p) => p.manual)) L.push(`  ${r('proveniencia')} ${lit('inclui par(es) adicionado(s) manualmente na revisão humana da DKD', 'pt-BR')}`);
    if (superDe[n]) L.push(`  rdfs:subPropertyOf ${r(superDe[n])}`);
    notas(L, n);
    wN(L.join(' ;\n') + ' .');
    wN();

    // Mapeamento vai para a propriedade genérica só se valer, com o mesmo tipo,
    // para TODOS os pares do verbo; o resto vira subpropriedade por par.
    const comuns = mapPar(ps[0]).filter((m) => ps.every((q) => mapPar(q).some((x) => chave(x) === chave(m))));
    const M = [];
    const registrados = comuns.map((m) => emitir(M, 'propriedade', m));
    if (M.length) { wA(`${r(n)}\n${M.join(' ;\n')} .`); wA(); }
    const especializacoes = [];
    if (ps.length > 1) {
      // A subpropriedade leva o nome da origem; se a mesma origem tem mais de um
      // par com correspondência própria, leva também o destino — senão as IRIs
      // coincidem e os rdfs:range se somam (interseção).
      const comProprios = ps.filter((p) => mapPar(p).some((m) => !comuns.some((c) => chave(c) === chave(m))));
      const origensRepetidas = new Set(comProprios.map((p) => p.origem).filter((o, i, a) => a.indexOf(o) !== i));
      for (const p of comProprios) {
        const proprios = mapPar(p).filter((m) => !comuns.some((c) => chave(c) === chave(m)));
        const ambigua = origensRepetidas.has(p.origem);
        const nomeEsp = ambigua ? `${n}_${local(p.origem)}_${local(p.destino)}` : `${n}_${local(p.origem)}`;
        const rotuloEsp = ambigua ? `${p.verbo} (${p.origem} → ${p.destino})` : `${p.verbo} (${p.origem})`;
        wN([`${r(nomeEsp)} a owl:ObjectProperty`, `  rdfs:label ${lit(rotuloEsp, 'pt-BR')}`, `  rdfs:subPropertyOf ${r(n)}`,
          `  rdfs:domain ${r(local(p.origem))}`, `  rdfs:range ${r(local(p.destino))}`,
          `  rdfs:comment ${lit(`Especialização de ${n} para o par ${p.origem} ${p.verbo} ${p.destino}: o verbo é sobrecarregado na DKD e este par tem correspondência externa própria (02-alinhamento-relacoes.md).`, 'pt-BR')}`].join(' ;\n') + ' .');
        wN();
        const Me = [];
        const regEsp = proprios.map((m) => emitir(Me, 'propriedade', m));
        wA(`${r(nomeEsp)}\n${Me.join(' ;\n')} .`);
        wA();
        especializacoes.push({ nome: nomeEsp, par: `${p.origem} ${p.verbo} ${p.destino}`, mapeamentos: regEsp });
      }
    }
    relatorio.contagens.especializacoes += especializacoes.length;
    relatorio.objectProperties.push({ nome: n, verbo, dominios: doms, alcances: rngs, superpropriedade: superDe[n] || null, pares: ps.map((p) => `${p.origem} ${p.verbo} ${p.destino}`), mapeamentos: registrados, especializacoes });
  }
  relatorio.contagens.objectProperties = porProp.size;

  if (insumos.cadeias.length) {
    wN('# --- Cadeias de propriedades (atalhos das reificações)');
    for (const c of insumos.cadeias) {
      const passos = c.cadeia.map((p) => (p.startsWith('^') ? `[ owl:inverseOf ${r(p.slice(1))} ]` : r(p)));
      wN(`${r(c.propriedade)} owl:propertyChainAxiom ( ${passos.join(' ')} ) .`);
    }
    wN();
  }

  const nucleo = N.join('\n') + '\n';
  const alinhamentos = A.join('\n') + '\n';
  return { nucleo, alinhamentos, relatorio, hash: hashDe(nucleo, alinhamentos) };
}

module.exports = { gerar, local, camel, hashDe, termosSemIri, nomePropriedade, classesMantidas, extrairRelacoes };
