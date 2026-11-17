# REC — Asset Recovery Ontology (version 0.2.0) and its construction record

This repository holds the **REC ontology** for the asset-recovery domain (tracing, freezing,
confiscation, international cooperation and disposal of assets linked to crime) together with the
**complete record of how it was built**: the artifacts of every construction sub-phase, the register
of structural adjustments with their evidence sources, and the rules and prompts of the environment
that produced them.

It accompanies the paper:

> Torres, J.A.S., et al. *Human-Gated LLM Assistance for Data-Driven Ontology Construction: Provenance
> and Preliminary External Evaluation.* Manuscript in preparation.

The ontology was built with the data-driven process of Torres et al. (2024), instrumented with
language models under one rule: *the model proposes, a human decides, and provenance records both*.

No restricted system or non-public data source was accessed to build the ontology. The interview
profiles describe roles in the domain; the synthetic respondents are LLM personas, and the human
respondents are university researchers with experience in the domain, not staff of the institution
whose roles the profiles describe.

> **Interviews with human respondents are not published in this repository.** They were left out on
> purpose: only the responses of the six synthetic personas are included, under
> `construction/especificacao/respostas-asd/`.

## Contents

| Path | What it is |
|---|---|
| `ontology/ontologia.ttl` | Core ontology: own classes, properties and hierarchy, with provenance annotations |
| `ontology/ontologia-alinhamentos.ttl` | Alignment module (bridge): imports the core and carries every axiom or annotation that refers to an external vocabulary |
| `ontology/catalog-v001.xml` | Lets Protégé / the OWL API resolve the import of the core locally |
| `construction/especificacao/` | Specification stage: scope interview, questionnaire, cast of respondent profiles, synthetic responses, requirements (ASD), data categories (DCI), knowledge capture (DKC), preliminary ontology (DKD), reuse review (ORR) |
| `construction/implementacao/` | Implementation stage: class and relationship alignment tables (EOA), construction decisions (OCO), the register of 515 structural adjustments, and the 214 confirmed external identifiers |
| `evidence/` | Reasoner analysis, interview timing and the factual inventory of the environment used for the figures reported in the paper |
| `system/` | Technical description of the environment (gates, validator rules, adjustment operations) and a snapshot of the source files that contain the prompts and the rules |

The construction artifacts are in **Brazilian Portuguese**, as produced, with one change: the name of
the institution whose roles the profiles describe was replaced by the generic designations *órgão
central* (central body) and *ministério* (ministry), in the text and in four file names. The ontology
files and the source snapshot never named it and are unchanged. The names of the sub-phases (ASD,
DCI, DKC, DKD, ORR, EOA, OCO) follow the reference process.

## The ontology at a glance

| | |
|---|---|
| Namespace | `https://www.latitude.unb.br/ontologia/recuperacao-ativos#` (prefix `rec:`) |
| Version | `0.2.0-oco`, generated on 2026-10-06 |
| Classes | 125 |
| Object properties / datatype properties | 185 / 262 |
| Subclass axioms between own classes | 93 |
| Property chains | 2 (`rec:titularDe`, `rec:temParte`) |
| Triples | 4,231 (core) + 309 (alignment module) |
| Reused vocabularies | FIBO, FOAF, FollowTheMoney, ORG, PROV-O, REGORG, schema.org; ACO and SUMO as design references (annotations only) |

Labels and definitions are in Portuguese (`@pt-BR`).

### Reading the provenance

- `rec:proveniencia` on every class: the data categories in which the concept was identified, or the
  mark of a manual addition.
- `skos:changeNote` on every element created or altered by a structural adjustment, in the form
  `AJ-<id> (<date>, fonte: <evidence source>): <motive>`. The evidence source is one of
  *especialista* (domain expert), *metadado* (system metadata), *norma* (norm or regulation),
  *ontologia_externa* (external ontology) or *modelagem* (modeling decision). When the adjustment was
  suggested by a language model, the motive starts with `sugestão da IA (<model>…)`.
- `[requer pesquisa adicional]` ("requires further research") marks what still awaits confirmation
  from experts or institutional sources. It occurs 87 times.

The full register is `construction/implementacao/04-ajustes-manuais.md`: 499 active adjustments and
16 undone; 449 of the active ones cite a modeling decision alone.

### Opening the files

Open `ontology/ontologia-alinhamentos.ttl` in Protégé: the catalog resolves the import of the core
from the same folder. The other imports (FOAF, ORG, PROV-O, REGORG) are fetched from the web. With
Python:

```python
from rdflib import Graph
g = Graph().parse("ontology/ontologia.ttl")
g.parse("ontology/ontologia-alinhamentos.ttl")
print(len(g))  # 4540
```

## Known issues in version 0.2.0

- **Unresolved logical conflict.** With the external ontologies loaded, a DL reasoner finds
  `rec:SucessaoDeEntidade` and `org:ChangeEvent` unsatisfiable. The cause and the candidate fixes are
  in `evidence/reasoner-analysis.md`. The core and the alignment module alone are consistent.
- **No instance constraints.** The core declares no disjoint classes and no cardinality or value
  restrictions.
- **Open definitions.** 14 classes and 41 datatype properties still carry the gap marker.
- **The namespace does not resolve on the web.** Use the files in this repository.
- **Evidence still to be validated.** 39 of the 74 requirements of the specification rest on
  synthetic responses only and are tagged as such in `construction/especificacao/01-escopo-e-requisitos.md`.

## What is not here

- The interviews given by human respondents (see the note at the top of this page).
- The judicial documents and the knowledge graph used in the external evaluation described in the
  paper. They are real case files and cannot be shared.
- The code of the knowledge-graph pipeline (available from the corresponding author on request).

## The environment

The ontology was built with **Onto Studio**, a web application that conducts the sub-phases under
human approval gates. `system/SYSTEM.md` describes the gates, the twelve blocking rules of the
validator, the eleven adjustment operations and the evidence sources, and points to the source file
that implements each one; `system/source-snapshot/` holds those files as they were when the ontology
was generated.

## License

The ontology, the construction artifacts and the documents in this repository are released under the
[Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/)
(see `LICENSE`). The files under `system/source-snapshot/` are source code under the MIT License
(see `system/source-snapshot/LICENSE`). The reused external vocabularies keep their own licenses.

## How to cite

See `CITATION.cff`, or use:

```bibtex
@misc{torres2026rec,
  author       = {Torres, José Alberto Sousa},
  title        = {{REC}: Asset Recovery Ontology and its construction record, version 0.2.0},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/betotorres/asset-ontology},
  note         = {Version 0.2.0}
}
```

Reference process:

> Torres, J.A.S., da Silva, D.A., de Oliveira Albuquerque, R., Amvame Nze, G.D., Sandoval Orozco,
> A.L., García Villalba, L.J. (2024). Ontology development for asset concealment investigation: A
> methodological approach and case study in asset recovery. *Applied Sciences* 14, 9654.
