# The construction environment: gates, rules and where they live in the code

This document describes the technical elements of the environment (Onto Studio) that the paper
refers to, and points to the source file that implements each one. The files are in
`source-snapshot/`, copied unchanged from the development repository; none of them was modified
after 2026-10-06, the date on which version 0.2.0 of the ontology was generated. Comments, prompts
and messages in the code are in Brazilian Portuguese.

The snapshot is not a runnable application: it contains only the modules that hold prompts, rules
and closed vocabularies. The complete application, Onto Studio, is not part of this repository.

## Design rule

The model proposes, a human decides, and provenance records both. Four mechanisms implement it:

| Mechanism | What it does |
|---|---|
| Status gate | Every model output destined for an artifact is stored as *pendente* (pending) and enters only when a human marks it *mantida* (kept); writing is refused while anything is pending |
| Nothing is deleted | Discard, undo and deactivate are status changes that record author and date |
| Whole-proposal refusal | A malformed answer, or one with a single item outside the bounds of the phase, is saved verbatim and refused in full |
| Rules in code | Every rule of the method that admits a mechanical form is enforced by the environment, whichever model is used |

## Sub-phases and source files

| Sub-phase | Role of the model | Source file |
|---|---|---|
| Scope interview | conducts the interview with the administrator and drafts the questionnaire and the cast of respondent profiles | `lib/instrumentos/escopo.js`, `lib/perfis.js`, `resources/template-questionario-asd.md` |
| ASD — interviews | interviewer for human and synthetic respondents alike: same prompt, same greeting, same closing condition, same cap on turns | `lib/instrumentos/asd.js`, `lib/prompt.js`, `lib/entrevista.js` |
| ASD — synthetic panel | plays the respondent, as a persona with declared limits of knowledge and a prohibition on inventing names, figures and norms | `lib/painel.js` |
| ASD — provenance | header on every response (human, named model, or undeclared) and the tag for items that rest on synthetic evidence only | `lib/proveniencia.js` |
| ASD — consolidation | compiles scope, target users, requirements and behaviors from the responses | `lib/compilarRequisitos.js` |
| DCI | compiles the table of data categories | `lib/compilarCategorias.js` |
| DKC | compiles the survey of sources and, after human review, the entity table | `lib/compilarCaptura.js` |
| DKD | compiles one merged proposal; every class, property and relationship is born pending; naming rules | `lib/compilarDKD.js`, `lib/assistenteDkd.js` |
| ORR | structures pasted research into a catalog entry (no web access) and proposes correspondence and gap rows | `lib/compilarOrr.js` |
| EOA | types the correspondences that ORR kept and writes definitions; the ORR boundary | `lib/eoa/compilar.js`, `lib/eoa/fronteira.js` |
| OCO | suggests datatypes only; generation is deterministic | `lib/oco/sugerirTipos.js`, `lib/oco/gerador.js`, `lib/oco/constantes.js` |
| OCO — identifiers | external identifiers confirmed by exact match against a cached copy of the source | `lib/oco/iris.js` |
| OCO — validation | twelve blocking rules and non-blocking warnings | `lib/oco/validador.js` |
| OCO — reasoning | optional DL reasoning (HermiT) over core, alignment module and cached external sources | `lib/oco/raciocinador.js` |
| Adjustments | register, application as a layer over the construction inputs, hierarchy suggester, conversational assistant | `lib/ajustes/registro.js`, `lib/ajustes/aplicar.js`, `lib/ajustes/sugerirHierarquia.js`, `lib/ajustes/assistente.js` |

## The twelve blocking rules of the validator

Source: `lib/oco/validador.js`. An error from any rule blocks the writing of the ontology.

| Rule | Checks that… | Kind |
|---|---|---|
| E1 | each generated file is valid Turtle | well-formedness |
| E2 | every term of the ontology's namespace that is used is declared | well-formedness |
| E3 | every domain and range names a declared class or a datatype | well-formedness |
| E4 | no two own classes collapse into mutual subsumption through the closure of subclass and equivalence axioms | reuse invariant |
| E5 | no alignment induces a subclass relation between own classes that the preliminary ontology does not declare | reuse invariant |
| E6 | no own property is declared equivalent to an external property | reuse invariant |
| E7 | only datatypes of the OWL 2 datatype map are emitted | reuse invariant |
| E8 | a property defined by a chain is not a sub-property of an external one | reuse invariant |
| E9 | identifiers from sources reused in annotation-only modes never appear in OWL axioms | reuse invariant |
| E10 | every external identifier used is confirmed in the identifier catalog | reuse invariant |
| E11 | every class carries its provenance annotation and every property the comment that states its origin | reuse invariant |
| E12 | a local name denotes one thing: never an attribute and a relationship, or a class, at once | reuse invariant |

Three rules (E1–E3) check well-formedness and nine (E4–E12) are invariants of sound reuse. In the
table of reuse invariants of the paper, E4 and E5 share one row.

Non-blocking warnings reported by the same module: attributes that default to `xsd:string` for lack
of a type decision (A2); an external source without a recorded version, or with a cache older than
90 days (A3); chains that use an inverse property, outside the OWL 2 RL profile (A4); DL reasoning
not run for the current generation (A5).

The reasoner module removes `owl:imports` statements before merging the files it hands to HermiT,
so the triple counts it reports exclude them: the core and the alignment module together count
4,535 triples there, and 4,540 in the published files, which include five import statements.

## Closed vocabularies

Source: `lib/oco/constantes.js`, `lib/ajustes/registro.js`.

- **Mapping types (EOA/OCO):** `eq` (equivalence), `sub` (sub-class or sub-property), `sup`
  (super-class), `close` (close match), `desenho` (design inspiration, annotation only).
- **Datatypes offered for attributes:** `string`, `boolean`, `decimal`, `integer`, `dateTime`,
  `anyURI`.
- **Adjustment operations (11):** add or remove a super-class; create, remove or alter a class; add,
  remove or alter an attribute; add, remove or alter a relationship.
- **Evidence sources of an adjustment (5):** domain expert, system metadata, norm or regulation,
  external ontology, modeling decision. A motive and a source are mandatory; the assistant cannot
  mark the source "domain expert".

## Models used in the case study

Recorded in the artifacts themselves:

- Synthetic respondents: `claude-sonnet-5` (header of each file in
  `construction/especificacao/respostas-asd/`).
- Suggested adjustments: 509 of the 515 registered adjustments carry the prefix `sugestão da IA`
  with the model that suggested them — `claude-fable-5-1` (395) and `claude-opus-5-5` (70) working
  through a coding agent (Claude Code) with the administrator's authorization, and `claude-opus-5-5`
  (33) and `claude-sonnet-5` (11) through the suggestion features of the environment.
- Scope interview: interviewer `claude-opus-5` (header of
  `construction/especificacao/00-escopo-entrevista.md`).
- Reuse review (ORR): correspondence proposal written by `claude-fable-5-1` through a coding agent
  (provenance section of `construction/especificacao/05-reuso-ontologias.md`).
- Alignment (EOA): proposal generated by `claude-sonnet-5` (header of
  `construction/implementacao/01-alinhamento-classes.md`).
- The artifacts of the ASD consolidation, DCI, DKC and DKD do not name the model that compiled them.
