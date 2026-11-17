# Inventário factual do sistema (fonte dos números do artigo)

Levantado em 2026-10-06 sobre `ferramentas/entrevistador-asd/` (branch
`escopo-cadastro-persistencia`) e `docs/superpowers/specs/` (9 specs, 1.965 linhas). Caminhos
relativos a `ferramentas/entrevistador-asd/`.

## Números

| Métrica | Valor |
|---|---|
| Módulos JS em `lib/` (ajustes 9, eoa 4, oco 15, instrumentos 2) | 56 |
| Linhas em `lib/` | 9.662 |
| Linhas em `public/*.js` (10 arquivos) | 4.717 |
| `server.js` | 1.112 linhas |
| Rotas HTTP | 122 |
| Tabelas SQLite | 32 |
| Arquivos de teste (`node:test`, LLM por stub, sem rede) | 55 |
| Casos de teste | 443 |
| Regras bloqueantes do validador OWL | 12 (E1–E12) + 4 avisos |
| Operações de ajuste estrutural | 11 |
| Fontes de lastro de ajuste | 5 |
| Tipos de mapeamento (EOA/OCO) | 5 (`eq`, `sub`, `sup`, `close`, `desenho`) |
| Datatypes XSD permitidos | 6 (string, boolean, decimal, integer, dateTime, anyURI) |
| Commits no repositório | 187 (2026-09-02 → 2026-10-06) |

## Pilha

Node ≥ 24 (`node:sqlite`, `DatabaseSync`), Express 4, SQLite em `data/entrevistador.db`,
`n3` + `rdfxml-streaming-parser` para RDF, `d3` para visualização; autenticação por usuário/senha
com `scrypt` (`node:crypto`); zip próprio sem dependência. Dois protocolos de LLM
(`lib/llm.js`): `openai` (qualquer `/chat/completions`) e `anthropic` (`/v1/messages`), com chave
por provedor para misturar fornecedores no painel. Tool-use (`chatComFerramentas`) e
anti-truncamento (`chatComContinuacao`) só no caminho anthropic. Estado e decisões no banco;
artefatos (Markdown/TTL) versionados em `trabalho/ontologia/<slug>/`.

## Subfase × o que o LLM gera × gate humano × invariante

| Subfase | LLM gera | Gate humano | Artefato | Invariante no código |
|---|---|---|---|---|
| Escopo (pré-ASD) | entrevista de escopo; questionário e perfis (`===QUESTIONARIO===`, `===PERFIS===`) | admin conduz e encerra | `00-questionario-asd.md`, `00-perfis-respondentes.md`, `00-escopo-entrevista.md` | `MIN_PERFIS = 3`; slug kebab-case ≤ 60 |
| ASD | entrevistador (sempre modelo do `.env`); respondente sintético (opcional); consolidado | respondente humano responde; consolidado é rascunho editável | `respostas-asd/<perfil>.md` (prefixo `agente-`), `01-escopo-e-requisitos.md` | trava B1/C1/D1 obrigatórios no bloco FINAL; `MAX_TURNOS = 50`, aviso em 40; estouro ⇒ nada gravado; marcador `[lastro apenas sintético — requer validação humana]` |
| DCI | tabela de categorias | rascunho editável | `02-categorias-de-dados.md` | eixo temático obrigatório; proíbe eixo por origem/custódia/canal/estágio |
| DKC | levantamento de fontes; depois entidades | modelagem só após levantamento revisado | `03-captura/<cat>.md`, `<cat>-entidades.md` | "nunca invente"; `[requer pesquisa adicional]` propagado |
| DKD | compilação única por domínio (JSON, até 128k tokens com continuação); assistente de chat propõe | cada classe/propriedade/relação nasce `pendente`; humano mantém/descarta/adiciona; Gravar recusa com pendente > 0; assistente só aplica com clique | `04-ontologia-preliminar.md` | relação para classe inexistente invalida proposta inteira; relação só se origem e destino mantidos; descartar não apaga; nomes PascalCase / camelCase / VERBO_MAIÚSCULO (`motivoNomeInvalido`) |
| ORR | estrutura o texto de pesquisa colado (sem web); linhas `correspondencia`/`lacuna_nossa`/`lacuna_externa` | revisão do cadastro; cada linha `pendente` → decisão | `05-reuso-ontologias.md` (+ `## Proveniência`) | "LLM só organiza, não inventa — o texto colado é o lastro" |
| EOA | tipos (`eq/sub/sup/close/desenho`), definições formais (gênero + diferença), relações | toda linha `pendente`; Gravar exige 0 pendentes e 0 órfãos | `01-alinhamento-classes.md`, `02-alinhamento-relacoes.md` | **fronteira ORR**: classe só com par `mantida`; propriedade externa só se consta como palavra inteira no resumo da ontologia selecionada; item fora da fronteira recusa a proposta inteira; `INSERT OR IGNORE` nunca substitui decisão |
| OCO | só sugestão de datatypes XSD (`oco_sugestoes_tipos`) | decisões de construção na tela; IRI ambígua/não encontrada exige escolha humana com evidência | `ontologia.ttl`, `ontologia-alinhamentos.ttl`, `03-construcao.md` | resolução de IRI por casamento exato em cache, sem LLM nem web; IRI não `confirmada` bloqueia; invariantes do gerador; E1–E12; DL opcional |
| Ajustes (④) | assistente propõe lote das 11 operações / desfazeres; sugestão de hierarquia | motivo + fonte obrigatórios; lote aplicado em transação tudo-ou-nada; modelo não marca fonte `especialista` | `04-ajustes-manuais.md` + os 3 da Construção (`gravarTudo`) | `skos:changeNote "AJ-<id> (<data>, fonte: <fonte>): <motivo>"`; desfazer marca `desfeito` (409 se houver dependentes); órfão bloqueia (409 `ajustesOrfaos`); sem ajuste ativo a saída é idêntica (paridade) |
| Visualização (⑤) | — | — | `visualizacao.html` (export) | só leitura; circle packing d3; cor por natureza PROV efetiva |

## Invariantes do gerador OWL

1. Nunca `owl:equivalentProperty` com externa (`eq` de propriedade ⇒ `rdfs:subPropertyOf` + `skos:exactMatch`).
2. FollowTheMoney só por SKOS.
3. Só datatypes do OWL 2.
4. Propriedade com cadeia não é subpropriedade de externa.
5. Verbo sobrecarregado ⇒ `rec:<verbo>_<Origem> ⊑ rec:<verbo>` por par.
6. Dois arquivos: núcleo sem IRI externa em axioma; bridge com `owl:imports`.
7. `eq`→`owl:equivalentClass`, `sub`→`rdfs:subClassOf`, `sup`→`skos:narrowMatch`, `close`→`skos:closeMatch`, `desenho`→`rec:origemDeDesenho`; fonte em modo `skos` ⇒ `exact/broad/narrow/closeMatch`.
8. Nomes locais ASCII; verbo camelCase.

## Regras do validador (bloqueiam Gravar)

E1 Turtle válido · E2 termo usado declarado · E3 domain/range para classe declarada ou datatype ·
E4 sem colapso (duas classes não se subsumem mutuamente) · E5 nenhuma subclasse fora do fecho
`É_SUBCLASSE_DE` da DKD · E6 sem `owl:equivalentProperty` externo · E7 datatype do OWL 2 · E8 cadeia
não é subpropriedade de externa · E9 IRI de fonte `skos`/`desenho` fora de axioma OWL · E10 toda IRI
externa `confirmada` · E11 sem órfão (`rec:proveniencia` em classe; origem DKD em propriedade) ·
E12 um IRI, um tipo (sem punning). Avisos: A2 `xsd:string` por omissão; A3 fonte sem versão ou
cache > 90 dias; A4 cadeia com inversa; A5 DL não executado para o hash atual. Recusas do Gravar,
em ordem: órfão/IRI não confirmada → E1–E12 → último DL `inconsistente`/`insatisfativel` para o
mesmo hash.

## Agentes-especialistas (ASD)

- Personas = linhas de `00-perfis-respondentes.md` (`Perfil | Papel e experiência | Limites de
  conhecimento | Modelo`), parseadas por `lib/perfis.js`; coluna Modelo aceita `provedor:modelo`.
- Prompt da persona (`lib/prompt.js:97-122`): papel, experiência e limites ("o que você NÃO tem
  como saber"); regra principal proíbe inventar sistema, campo, número, norma ou estatística — lacuna
  declarada é resposta correta. Temperatura 0,8.
- Loop único `processarTurno` (`lib/entrevista.js`) para humano, agente e escopo; entrevistador
  recebe só o rótulo do perfil (`painel.js:181-185`).
- Proveniência (`lib/proveniencia.js`): blockquote após o título — agente: "respondente sintético
  (agente LLM) — modelo X via Y … Evidência de terceira classe"; humano: "respondente humano";
  arquivo sem marcação = `desconhecida`, nunca humano.
- `compilarRequisitos.js:47-60` injeta o marcador para requisitos apoiados só em resposta sintética
  ou não declarada e registra contagem humanas/sintéticas/não declaradas.
- `lib/cobertura.js`: `semLastroHumano` para perfil com 0 humanas e > 0 sintéticas.
- Turnos medidos neste repositório: 20–34 por entrevista.

## Proveniência e rastreabilidade

`skos:changeNote` por ajuste; prefixo "sugestão da IA (<modelo>…), autorizada pelo administrador:";
export `completo`/`sem_ia`/`sem_notas` (arquivo gravado mantém tudo); `data/respostas-brutas/`
guarda toda resposta de LLM fora do formato (proposta recusada inteira); cabeçalhos
"Proveniência" em respostas, escopo, ORR, EOA, Construção; `rec:proveniencia` por classe (E11);
status `pendente/mantida/descartada`; origem `importado/eoa/manual`; `oco_iris.origem` +
`evidencia`; desfazer em vez de apagar em ajustes, sugestões, usuários; transcrições integrais em
`sessoes`/`mensagens`; versão da fonte externa no cabeçalho do bridge.

## DL (HermiT)

`lib/oco/raciocinador.js`: `spawn(JAVA_BIN, ['-Xmx4g','-cp',HERMIT_JAR,
'org.semanticweb.HermiT.cli.CommandLine','-U','--ignoreUnsupportedDatatypes', file://<mesclado>])`,
timeout 300 s; núcleo + bridge + fontes `owl` em cache; fonte > 50.000 triplas por extração de
módulos (FIBO); sem rede. Resultado `consistente | insatisfativel | inconsistente | erro | timeout`
gravado em `oco_config.ultimo_dl` com o hash. Em 2026-10-06, antes do artigo, nunca havia sido
executado para `recuperacao-ativos`.

## Domínio `recuperacao-ativos` (estudo de caso)

- ASD: 6 perfis; 7 respostas (6 sintéticas, `claude-sonnet-5` via anthropic, 2026-09-11; 1
  humana, mesmo perfil "Analista de busca patrimonial", 2026-09-11).
- DCI: 9 categorias. DKC: 18 arquivos (levantamento + entidades).
- ORR (2026-09-13): 9 ontologias avaliadas (ACO, FIBO, FOAF, FollowTheMoney, MNI/CNJ, PROV-O,
  SUMO/SUMO-F, W3C ORG, REGORG, schema.org); 144 mantidos / 40 descartados / 9 adicionados
  manualmente; MNI descartado integralmente (0/16).
- OCO (execução manual 2026-09-13, `relatorio.json`): 81 classes, 236 data properties, 94 object
  properties, 141 pares de relação; mapeamentos de classe eq 13 / sub 20 / sup 2 / close 4 /
  skosFTM 29 / design 20 / prov 24; de propriedade eq 20 / sub 42 / close 32 / skosFTM 26 / design 2;
  214 IRIs externas.
- Ontologia atual (`03-construcao.md`, 2026-10-06, hash `3a6b06df…`, após ajustes): 125 classes,
  93 subclasses declaradas, 262 data properties, 133 object properties por verbo + 51
  especializações por par, 221 pares de relação, 90 mapeamentos de classe, 126 de propriedade, 58
  classes tipadas em PROV-O. (O `grep -c owl:Class` no TTL dá 216 porque conta também restrições e
  uniões anônimas — não usar.)
- DL (2026-10-06, ver `analise-hermit.md`): núcleo + bridge = consistente; com as 6 fontes `owl`
  em cache (40.301 triplas) = **insatisfatível** (`rec:SucessaoDeEntidade`, `org:ChangeEvent`),
  causa: AJ-259 (fonte: modelagem) × `eq` com `org:ChangeEvent` × PROV `Entity ⊥ Activity`.
- Ajustes (`04-ajustes-manuais.md`, 2026-10-06): 499 ativos, 16 desfeitos; por fonte —
  especialista 2, metadado 10, norma 21, ontologia externa 17, decisão de modelagem 449; 509
  linhas com prefixo "sugestão da IA" (modelos `claude-sonnet-5`, `claude-opus-5-5`).
- `redes-sociais`: ASD–DKC; par humano/agente para "Analista de inteligência" (801 vs 1.610 palavras).
- Respostas pareadas em `recuperacao-ativos`: humano 1.029 vs agente 2.473 palavras.
