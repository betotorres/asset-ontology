'use strict';

// Validação DL opcional (spec 6.3): HermiT CLI sobre núcleo + alinhamentos +
// fontes owl em cache, num arquivo Turtle mesclado. Nada é buscado na rede.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const N3 = require('n3');

const { NS, OWL2_DATATYPES } = require('./constantes');
const { lerQuads } = require('./rdfArquivo');

const { RDF, RDFS, OWL, XSD } = NS;
const LITERAIS_DE_DATA = new Set([`${XSD}dateTime`, `${XSD}dateTimeStamp`, `${XSD}date`]);

function configurado(env = process.env) {
  return Boolean(env.JAVA_BIN && env.HERMIT_JAR);
}

const chaveTermo = (t) => `${t.termType}:${t.value}`;

// Remove de uma fonte externa o que o HermiT recusa: datatypes fora do OWL 2 e
// os nós anônimos que dependem deles, literais de data em anotações e owl:imports.
function filtrarExterna(quads) {
  const ruins = new Set();
  for (const q of quads) {
    const o = q.object;
    if (q.predicate.value === `${RDF}type` && o.value === `${RDFS}Datatype`) {
      if (q.subject.termType === 'BlankNode' || !OWL2_DATATYPES.has(q.subject.value)) ruins.add(chaveTermo(q.subject));
    }
    if (o.termType === 'NamedNode' && o.value.startsWith(XSD) && !OWL2_DATATYPES.has(o.value)) ruins.add(chaveTermo(o));
    if ([`${OWL}datatypeComplementOf`, `${OWL}onDatatype`, `${OWL}withRestrictions`].includes(q.predicate.value)) ruins.add(chaveTermo(q.subject));
  }
  const primeiros = new Map();
  for (const q of quads) if (q.predicate.value === `${RDF}first`) primeiros.set(chaveTermo(q.subject), q.object);
  for (const q of quads) {
    if (q.predicate.value === `${OWL}oneOf` && q.subject.termType === 'BlankNode') {
      const primeiro = primeiros.get(chaveTermo(q.object));
      if (primeiro && primeiro.termType === 'Literal') ruins.add(chaveTermo(q.subject));
    }
  }
  let restantes = quads.filter((q) => q.predicate.value !== `${OWL}imports`
    && !(q.object.termType === 'Literal' && (LITERAIS_DE_DATA.has(q.object.datatype.value) || (!q.object.language && !OWL2_DATATYPES.has(q.object.datatype.value)))));
  let mudou = true;
  while (mudou) {
    mudou = false;
    const proximos = [];
    for (const q of restantes) {
      const s = chaveTermo(q.subject);
      const o = chaveTermo(q.object);
      if (ruins.has(s) || ruins.has(o)) {
        if (q.subject.termType === 'BlankNode' && !ruins.has(s)) { ruins.add(s); mudou = true; }
        continue;
      }
      proximos.push(q);
    }
    restantes = proximos;
  }
  return restantes;
}

const moduloDe = (iri) => iri.replace(/[^/]+$/, '');
const hostDe = (iri) => { try { return new URL(iri).host; } catch { return null; } };

// Subconjunto da fonte: triplas cujo sujeito está nos módulos das IRIs
// referenciadas, mais módulos alcançados (2 iterações, mesmos hosts) e o fecho
// dos nós anônimos. Port de fibo-modulos.py.
function extrairModulos(quads, irisReferenciadas) {
  const modulos = new Set(irisReferenciadas.map(moduloDe));
  const hosts = new Set(irisReferenciadas.map(hostDe).filter(Boolean));
  const sub = new Set();
  for (let i = 0; i < 2; i++) {
    const novos = new Set();
    for (const q of quads) {
      if (q.subject.termType !== 'NamedNode' || !modulos.has(moduloDe(q.subject.value))) continue;
      sub.add(q);
      if (q.object.termType === 'NamedNode' && hosts.has(hostDe(q.object.value))) {
        const m = moduloDe(q.object.value);
        if (!modulos.has(m)) novos.add(m);
      }
    }
    for (const m of novos) modulos.add(m);
    if (!novos.size) break;
  }
  const porSujeitoAnonimo = new Map();
  for (const q of quads) {
    if (q.subject.termType !== 'BlankNode') continue;
    if (!porSujeitoAnonimo.has(q.subject.value)) porSujeitoAnonimo.set(q.subject.value, []);
    porSujeitoAnonimo.get(q.subject.value).push(q);
  }
  const pilha = [...sub].filter((q) => q.object.termType === 'BlankNode').map((q) => q.object.value);
  const vistos = new Set();
  while (pilha.length) {
    const id = pilha.pop();
    if (vistos.has(id)) continue;
    vistos.add(id);
    for (const q of porSujeitoAnonimo.get(id) || []) {
      sub.add(q);
      if (q.object.termType === 'BlankNode') pilha.push(q.object.value);
    }
  }
  return [...sub];
}

// Nós anônimos de arquivos diferentes podem ter o mesmo rótulo local (b0, b1…):
// prefixa por arquivo antes de mesclar.
function isolarAnonimos(quads, prefixo) {
  const { DataFactory } = N3;
  const t = (x) => (x.termType === 'BlankNode' ? DataFactory.blankNode(`${prefixo}_${x.value}`) : x);
  return quads.map((q) => DataFactory.quad(t(q.subject), q.predicate, t(q.object)));
}

function escreverTurtle(quads, caminho) {
  return new Promise((resolve, reject) => {
    const writer = new N3.Writer({ format: 'Turtle' });
    for (const q of quads) writer.addQuad(q.subject, q.predicate, q.object);
    writer.end((err, texto) => {
      if (err) return reject(err);
      fs.writeFileSync(caminho, texto, 'utf8');
      return resolve();
    });
  });
}

// Só o cabeçalho "Classes equivalent to 'owl:Nothing':" prova que o HermiT
// carregou e raciocinou; qualquer outra saída (erro de parse, exceção) é "erro".
function interpretarSaida(saida) {
  if (/InconsistentOntologyException/.test(saida)) return { resultado: 'inconsistente', insatisfativeis: [] };
  const linhas = saida.split('\n');
  const inicio = linhas.findIndex((l) => l.startsWith("Classes equivalent to 'owl:Nothing':"));
  if (inicio < 0) return { resultado: 'erro', insatisfativeis: [], mensagem: saida.slice(-2000) };
  const insatisfativeis = [];
  for (const l of linhas.slice(inicio + 1)) {
    if (!/^\s+\S/.test(l)) break;
    const nome = l.trim().replace(/^<|>$/g, '');
    if (nome !== 'owl:Nothing' && nome !== 'http://www.w3.org/2002/07/owl#Nothing') insatisfativeis.push(nome);
  }
  return { resultado: insatisfativeis.length ? 'insatisfativel' : 'consistente', insatisfativeis };
}

function executarHermit(arquivo, { env = process.env } = {}) {
  const timeoutS = Number(env.DL_TIMEOUT_S || 300);
  return new Promise((resolve) => {
    const inicio = Date.now();
    const proc = spawn(env.JAVA_BIN, ['-Xmx4g', '-cp', env.HERMIT_JAR, 'org.semanticweb.HermiT.cli.CommandLine', '-U', '--ignoreUnsupportedDatatypes', `file://${arquivo}`]);
    let saida = '';
    let estourou = false;
    proc.stdout.on('data', (d) => { saida += d; });
    proc.stderr.on('data', (d) => { saida += d; });
    const timer = setTimeout(() => { estourou = true; proc.kill('SIGKILL'); }, timeoutS * 1000);
    proc.on('error', (err) => { clearTimeout(timer); resolve({ resultado: 'erro', insatisfativeis: [], mensagem: err.message, tempoS: 0 }); });
    proc.on('close', (codigo) => {
      clearTimeout(timer);
      const tempoS = Math.round((Date.now() - inicio) / 100) / 10;
      if (estourou) return resolve({ resultado: 'timeout', insatisfativeis: [], tempoS });
      return resolve({ ...interpretarSaida(saida), codigo, tempoS });
    });
  });
}

// Monta o arquivo mesclado (núcleo + alinhamentos + fontes owl em cache) e roda
// o HermiT. `executar` é injetável para os testes não dependerem de Java.
async function validarDl({ insumos, geracao, caminhoCache }, { env = process.env, executar = executarHermit } = {}) {
  const limite = Number(env.DL_LIMITE_TRIPLAS || 50000);
  const semImports = (quads) => quads.filter((q) => q.predicate.value !== `${OWL}imports`);
  const todos = [
    ...isolarAnonimos(semImports(new N3.Parser().parse(geracao.nucleo)), 'nucleo'),
    ...isolarAnonimos(semImports(new N3.Parser().parse(geracao.alinhamentos)), 'alinhamentos'),
  ];
  const externas = [];
  for (const fonte of Object.values(insumos.fontes).filter((f) => f.modo === 'owl').sort((a, b) => a.sigla.localeCompare(b.sigla))) {
    const caminho = caminhoCache(fonte);
    if (!caminho || !fs.existsSync(caminho)) {
      externas.push({ sigla: fonte.sigla, triplas: 0, ausente: true });
      continue;
    }
    let quads = await lerQuads(caminho, fonte.formato);
    const total = quads.length;
    let modulos = false;
    if (total > limite) {
      const referenciadas = Object.entries(insumos.iris).filter(([k]) => k.startsWith(`${fonte.sigla}|`)).map(([, iri]) => iri);
      quads = extrairModulos(quads, referenciadas);
      modulos = true;
    }
    quads = filtrarExterna(quads);
    externas.push({ sigla: fonte.sigla, triplas: quads.length, totalNaFonte: total, modulos });
    todos.push(...isolarAnonimos(quads, `f${externas.length}`));
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oco-dl-'));
  try {
    const arquivo = path.join(dir, 'mesclado.ttl');
    await escreverTurtle(todos, arquivo);
    const r = await executar(arquivo, { env });
    return { resultado: r.resultado, insatisfativeis: r.insatisfativeis, tempoS: r.tempoS, mensagem: r.mensagem || null, triplas: todos.length, externas };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

module.exports = { configurado, filtrarExterna, extrairModulos, isolarAnonimos, escreverTurtle, interpretarSaida, executarHermit, validarDl };
