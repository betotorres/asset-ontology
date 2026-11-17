'use strict';

// Validação estrutural da ontologia gerada (spec 6.1–6.2). Erros bloqueiam
// Gravar; avisos não. Cada achado aponta a regra e o elemento.

const N3 = require('n3');

const { NS, TIPOS_PROV, OWL2_DATATYPES } = require('./constantes');
const { local, classesMantidas, extrairRelacoes } = require('./gerador');

const { RDF, RDFS, OWL, XSD, SKOS, PROV } = NS;

const DECLARACOES = new Set([`${OWL}Class`, `${OWL}ObjectProperty`, `${OWL}DatatypeProperty`, `${OWL}AnnotationProperty`]);
const AXIOMAS_OWL = new Set([`${OWL}equivalentClass`, `${RDFS}subClassOf`, `${OWL}equivalentProperty`, `${RDFS}subPropertyOf`]);
const MAPEAMENTO = new Set([...AXIOMAS_OWL, `${SKOS}exactMatch`, `${SKOS}closeMatch`, `${SKOS}broadMatch`, `${SKOS}narrowMatch`]);
const VOCABULARIOS = [RDF, RDFS, OWL, XSD, SKOS, NS.DCTERMS];

function parse(nome, texto, erros) {
  try {
    return new N3.Parser().parse(texto);
  } catch (err) {
    erros.push({ regra: 'E1', elemento: nome, mensagem: `${nome} não é Turtle válido: ${err.message}` });
    return null;
  }
}

function fechoDkd(dkd) {
  const { subDe } = extrairRelacoes(classesMantidas(dkd));
  const diretas = new Map([...subDe].map(([nome, destinos]) => [nome, new Set(destinos)]));
  return alcancaveis(diretas);
}

// Para cada nó, o conjunto de nós alcançáveis (sem incluir o próprio, salvo ciclo).
function alcancaveis(arestas) {
  const resultado = new Map();
  for (const inicio of arestas.keys()) {
    const vistos = new Set();
    const pilha = [...arestas.get(inicio)];
    while (pilha.length) {
      const n = pilha.pop();
      if (vistos.has(n)) continue;
      vistos.add(n);
      for (const m of arestas.get(n) || []) pilha.push(m);
    }
    resultado.set(inicio, vistos);
  }
  return resultado;
}

function validar({ nucleo, alinhamentos, insumos, hash }) {
  const erros = [];
  const avisos = [];
  const qn = parse('ontologia.ttl', nucleo, erros);
  const qa = parse('ontologia-alinhamentos.ttl', alinhamentos, erros);
  if (!qn || !qa) return { erros, avisos };

  const ns = insumos.config.namespace;
  const nosso = (t) => t.termType === 'NamedNode' && t.value.startsWith(ns);
  const externo = (t) => t.termType === 'NamedNode' && !t.value.startsWith(ns) && !VOCABULARIOS.some((v) => t.value.startsWith(v));
  const curto = (v) => (v.startsWith(ns) ? `${insumos.config.prefixo}:${v.slice(ns.length)}` : v);
  const store = new N3.Store([...qn, ...qa]);
  const todos = store.getQuads(null, null, null, null);
  const objetos = (s, p) => store.getObjects(s, p, null);
  const ontologias = new Set(store.getSubjects(`${RDF}type`, `${OWL}Ontology`, null).map((t) => t.value));

  const declarados = new Map();
  const tiposPorIri = new Map();
  for (const q of todos) {
    if (q.predicate.value === `${RDF}type` && DECLARACOES.has(q.object.value) && nosso(q.subject)) {
      declarados.set(q.subject.value, q.object.value);
      if (!tiposPorIri.has(q.subject.value)) tiposPorIri.set(q.subject.value, new Set());
      tiposPorIri.get(q.subject.value).add(q.object.value);
    }
  }
  const classesNossas = [...declarados].filter(([, t]) => t === `${OWL}Class`).map(([v]) => v);

  // E2 — referências ao namespace declaradas
  const naoDeclarados = new Set();
  for (const q of todos) {
    for (const t of [q.subject, q.predicate, q.object]) {
      if (nosso(t) && !declarados.has(t.value) && !ontologias.has(t.value)) naoDeclarados.add(t.value);
    }
  }
  for (const v of naoDeclarados) erros.push({ regra: 'E2', elemento: curto(v), mensagem: `${curto(v)} é usado mas não está declarado.` });

  // E3 — domínio/alcance
  const listaDe = (no) => {
    const itens = [];
    let atual = no;
    while (atual && atual.value !== `${RDF}nil`) {
      const primeiro = objetos(atual, `${RDF}first`)[0];
      if (primeiro) itens.push(primeiro);
      atual = objetos(atual, `${RDF}rest`)[0];
    }
    return itens;
  };
  const alvoValido = (o) => {
    if (o.termType === 'NamedNode') {
      if (nosso(o)) return declarados.get(o.value) === `${OWL}Class`;
      return OWL2_DATATYPES.has(o.value) || o.value.startsWith(XSD) || externo(o);
    }
    if (o.termType === 'BlankNode') {
      const uniao = objetos(o, `${OWL}unionOf`)[0];
      return Boolean(uniao) && listaDe(uniao).every(alvoValido);
    }
    return false;
  };
  for (const p of [`${RDFS}domain`, `${RDFS}range`]) {
    for (const q of store.getQuads(null, p, null, null)) {
      if (!alvoValido(q.object)) {
        erros.push({ regra: 'E3', elemento: curto(q.subject.value), mensagem: `${curto(q.subject.value)}: ${p === `${RDFS}domain` ? 'domínio' : 'alcance'} aponta para algo que não é classe declarada nem datatype.` });
      }
    }
  }

  // E4/E5 — colapso e subclasses não previstas na DKD
  const arestas = new Map();
  const ligar = (a, b) => { if (!arestas.has(a)) arestas.set(a, new Set()); arestas.get(a).add(b); };
  for (const q of store.getQuads(null, `${RDFS}subClassOf`, null, null)) {
    if (q.subject.termType === 'NamedNode' && q.object.termType === 'NamedNode') ligar(q.subject.value, q.object.value);
  }
  for (const q of store.getQuads(null, `${OWL}equivalentClass`, null, null)) {
    if (q.subject.termType === 'NamedNode' && q.object.termType === 'NamedNode') { ligar(q.subject.value, q.object.value); ligar(q.object.value, q.subject.value); }
  }
  const fecho = alcancaveis(arestas);
  const nomeLocal = new Map((insumos.dkd.classes || []).filter((c) => c.status === 'mantida').map((c) => [ns + local(c.nome), c.nome]));
  const dkd = fechoDkd(insumos.dkd);
  const colapsos = new Set();
  for (const a of classesNossas) {
    for (const b of fecho.get(a) || []) {
      if (b === a || !classesNossas.includes(b)) continue;
      if ((fecho.get(b) || new Set()).has(a)) {
        const par = [a, b].sort().map(curto).join(' ≡ ');
        if (!colapsos.has(par)) {
          colapsos.add(par);
          erros.push({ regra: 'E4', elemento: par, mensagem: `Colapso: ${par} (subsunção mútua pelo fecho de subClassOf/equivalentClass).` });
        }
        continue;
      }
      const na = nomeLocal.get(a);
      const nb = nomeLocal.get(b);
      if (!na || !nb || !(dkd.get(na) || new Set()).has(nb)) {
        erros.push({ regra: 'E5', elemento: curto(a), mensagem: `${curto(a)} ⊑ ${curto(b)} decorre dos mapeamentos, mas não das relações É_SUBCLASSE_DE da DKD.` });
      }
    }
  }

  // E6 — equivalentProperty com IRI externa
  for (const q of store.getQuads(null, `${OWL}equivalentProperty`, null, null)) {
    if (externo(q.subject) || externo(q.object)) {
      erros.push({ regra: 'E6', elemento: curto(q.subject.value), mensagem: `${curto(q.subject.value)} usa owl:equivalentProperty com IRI externa (${q.object.value}).` });
    }
  }

  // E7 — datatypes do OWL 2
  const usados = new Set();
  for (const q of store.getQuads(null, `${RDFS}range`, null, null)) {
    if (q.object.termType === 'NamedNode' && (q.object.value.startsWith(XSD) || store.countQuads(q.object, `${RDF}type`, `${RDFS}Datatype`, null))) usados.add(q.object.value);
  }
  for (const q of todos) {
    if (q.object.termType === 'Literal' && !q.object.language && !ontologias.has(q.subject.value)) usados.add(q.object.datatype.value);
  }
  for (const d of usados) if (!OWL2_DATATYPES.has(d)) erros.push({ regra: 'E7', elemento: d, mensagem: `Datatype fora do OWL 2: ${d}.` });

  // E8 — propriedade com cadeia não é subpropriedade de IRI externa
  for (const s of store.getSubjects(`${OWL}propertyChainAxiom`, null, null)) {
    for (const o of objetos(s, `${RDFS}subPropertyOf`)) {
      if (externo(o)) erros.push({ regra: 'E8', elemento: curto(s.value), mensagem: `${curto(s.value)} tem owl:propertyChainAxiom e é rdfs:subPropertyOf de ${o.value} (externa).` });
    }
  }

  // E9 — IRIs de fontes skos/desenho fora de axiomas OWL
  const siglaDe = new Map();
  for (const [chave, iri] of Object.entries(insumos.iris)) siglaDe.set(iri, chave.split('|')[0]);
  for (const q of todos) {
    if (!AXIOMAS_OWL.has(q.predicate.value) || q.object.termType !== 'NamedNode') continue;
    const sigla = siglaDe.get(q.object.value);
    const fonte = sigla && insumos.fontes[sigla];
    if (fonte && fonte.modo !== 'owl') {
      erros.push({ regra: 'E9', elemento: curto(q.subject.value), mensagem: `${curto(q.subject.value)}: ${q.object.value} é de ${sigla} (modo ${fonte.modo}) e não pode entrar em axioma OWL.` });
    }
  }

  // E10 — IRI externa usada está confirmada
  const permitidas = new Set([...Object.values(insumos.iris), ...TIPOS_PROV.map((t) => PROV + t)]);
  for (const q of qa) {
    if (!MAPEAMENTO.has(q.predicate.value) || !externo(q.object)) continue;
    if (!permitidas.has(q.object.value)) {
      erros.push({ regra: 'E10', elemento: curto(q.subject.value), mensagem: `${curto(q.subject.value)} referencia ${q.object.value}, que não está confirmada no catálogo de IRIs.` });
    }
  }

  // E12 — um IRI, um tipo: atributo e relação (ou classe) com o mesmo nome local
  // viram punning ilegal no OWL 2 DL e a ferramenta que carrega descarta uma das declarações
  for (const [v, tipos] of tiposPorIri) {
    if (tipos.size > 1) {
      const nomes = [...tipos].map((t) => t.slice(OWL.length)).sort().join(' e ');
      erros.push({ regra: 'E12', elemento: curto(v), mensagem: `${curto(v)} está declarado como ${nomes}: atributo, relação e classe não podem ter o mesmo nome.` });
    }
  }

  // E11 — proveniência de classes e comentário de propriedades
  const provPred = `${ns}proveniencia`;
  for (const [v, tipo] of declarados) {
    if (tipo === `${OWL}Class` && !store.countQuads(v, provPred, null, null)) {
      erros.push({ regra: 'E11', elemento: curto(v), mensagem: `Classe ${curto(v)} sem ${insumos.config.prefixo}:proveniencia.` });
    }
    if ((tipo === `${OWL}ObjectProperty` || tipo === `${OWL}DatatypeProperty`) && !store.countQuads(v, `${RDFS}comment`, null, null)) {
      erros.push({ regra: 'E11', elemento: curto(v), mensagem: `Propriedade ${curto(v)} sem rdfs:comment de origem na DKD.` });
    }
  }

  // Avisos
  const semTipo = [...new Set((insumos.dkd.classes || []).filter((c) => c.status === 'mantida')
    .flatMap((c) => (c.propriedades || []).filter((p) => p.status === 'mantida').map((p) => p.nome)))]
    .filter((n) => !insumos.tiposDados[n]).sort();
  if (semTipo.length) avisos.push({ regra: 'A2', elemento: `${semTipo.length} atributo(s)`, mensagem: `${semTipo.length} atributo(s) com alcance xsd:string por falta de decisão de tipo.`, itens: semTipo });

  const agora = Date.parse(insumos.agora || new Date().toISOString());
  for (const f of Object.values(insumos.fontes)) {
    if (f.modo !== 'owl') continue;
    if (!f.versao) avisos.push({ regra: 'A3', elemento: f.sigla, mensagem: `${f.sigla}: fonte sem versão registrada.` });
    if (f.baixadoEm && agora - Date.parse(f.baixadoEm) > 90 * 24 * 3600 * 1000) {
      avisos.push({ regra: 'A3', elemento: f.sigla, mensagem: `${f.sigla}: cache baixado há mais de 90 dias.` });
    }
  }
  const comInversa = insumos.cadeias.filter((c) => c.cadeia.some((p) => p.startsWith('^'))).map((c) => c.propriedade);
  if (comInversa.length) avisos.push({ regra: 'A4', elemento: comInversa.join(', '), mensagem: `Cadeias com inversa (fora do perfil OWL 2 RL): ${comInversa.join(', ')}.` });

  if (!insumos.ultimoDl || insumos.ultimoDl.hash !== hash) {
    avisos.push({ regra: 'A5', elemento: 'DL', mensagem: 'Validação DL não executada para esta geração.' });
  }

  return { erros, avisos };
}

module.exports = { validar };
