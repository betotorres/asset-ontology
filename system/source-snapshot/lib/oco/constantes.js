'use strict';

// Vocabulários fechados da etapa Construção (OCO). Qualquer valor fora destas
// listas é recusado na entrada (importação, rotas) — o gerador confia nelas.

const TIPOS_MAPEAMENTO = ['eq', 'sub', 'sup', 'close', 'desenho'];
const MODOS_REUSO = ['owl', 'skos', 'desenho'];
const FORMATOS_FONTE = ['turtle', 'rdfxml'];
const TIPOS_XSD = ['string', 'boolean', 'decimal', 'integer', 'dateTime', 'anyURI'];
const TIPOS_PROV = ['Activity', 'Entity', 'Agent', 'SoftwareAgent'];
const STATUS_IRI = ['confirmada', 'pendente', 'ambigua', 'nao_encontrada'];

const NS = {
  RDF: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  RDFS: 'http://www.w3.org/2000/01/rdf-schema#',
  OWL: 'http://www.w3.org/2002/07/owl#',
  XSD: 'http://www.w3.org/2001/XMLSchema#',
  SKOS: 'http://www.w3.org/2004/02/skos/core#',
  DCTERMS: 'http://purl.org/dc/terms/',
  PROV: 'http://www.w3.org/ns/prov#',
};

// Datatype map do OWL 2 (OWL 2 Structural Specification, seção 4). xsd:date e
// xsd:duration NÃO estão aqui — o HermiT recusa a ontologia inteira com eles.
const OWL2_DATATYPES = new Set([
  ...['string', 'normalizedString', 'token', 'language', 'Name', 'NCName', 'NMTOKEN', 'boolean', 'decimal', 'integer',
    'nonNegativeInteger', 'nonPositiveInteger', 'positiveInteger', 'negativeInteger', 'long', 'int', 'short', 'byte',
    'unsignedLong', 'unsignedInt', 'unsignedShort', 'unsignedByte', 'double', 'float', 'dateTime', 'dateTimeStamp',
    'hexBinary', 'base64Binary', 'anyURI'].map((t) => NS.XSD + t),
  `${NS.RDFS}Literal`, `${NS.RDF}PlainLiteral`, `${NS.RDF}XMLLiteral`, `${NS.RDF}langString`, `${NS.OWL}real`, `${NS.OWL}rational`,
]);

// IRI http(s) sem os caracteres que o IRIREF do Turtle proíbe (espaço, < > " { } | \\ ^ `):
// um ">" aceito aqui escreveria triplas extras no .ttl gerado.
const IRI_HTTP = /^https?:\/\/[^\s<>"{}|\\^`]+$/;

function iriHttpValida(valor) {
  return typeof valor === 'string' && IRI_HTTP.test(valor);
}

// Erro com status HTTP e detalhes estruturados — as rotas devolvem
// { erro: mensagem, ...detalhes } com esse status.
function falha(status, mensagem, detalhes = {}) {
  const err = new Error(mensagem);
  err.status = status;
  err.detalhes = detalhes;
  return err;
}

module.exports = { falha, IRI_HTTP, iriHttpValida, TIPOS_MAPEAMENTO, MODOS_REUSO, FORMATOS_FONTE, TIPOS_XSD, TIPOS_PROV, STATUS_IRI, NS, OWL2_DATATYPES };
