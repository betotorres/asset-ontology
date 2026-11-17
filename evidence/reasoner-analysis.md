# Análise DL (HermiT) — recuperacao-ativos — 2026-10-06

Executada pela própria via do painel (`lib/oco/geracao.validarDl`), fora do servidor, com
`JAVA_BIN` = JRE 11.0.25 do Protégé 5.6.9 e `HERMIT_JAR` = `HermiT.jar` distribuído com o
owlready2 (HermiT 1.4.x; o jar do plugin do Protégé não serve por falta de `gnu.getopt`). Hash da
geração: `3a6b06df2cfa5a51f2c1dbecefa490137509855e786ce6915d1435840f1a2948` (a mesma de
`03-construcao.md`). Antes desta data o DL nunca havia sido executado para o domínio.

## Execução 1 — só núcleo + bridge (cache de fontes vazio)

| | |
|---|---|
| Triplas | 4.535 |
| Fontes externas | 6 ausentes do cache (FIBO, FOAF, ORG, PROV-O, REGORG, schema) |
| Resultado | `consistente`, 0 classes insatisfatíveis |
| Tempo | 0,6 s |

Resultado fraco: sem os axiomas das ontologias importadas, a maior parte dos conflitos possíveis
não é visível.

## Execução 2 — núcleo + bridge + 6 fontes `owl` em cache

Fontes baixadas por `fontes.baixarFonte` (sem alteração do código): FIBO quickstart
(`master/latest`, 132.684 triplas, entra por extração de módulos → 15.017), FOAF 0.99 (635),
ORG (748 → 737), PROV-O (1.789 → 1.780), REGORG (84 → 82), schema.org latest (17.515).

| | |
|---|---|
| Triplas mescladas | 40.301 |
| Resultado | **`insatisfativel`** |
| Classes insatisfatíveis | `rec:SucessaoDeEntidade`, `org:ChangeEvent` |
| Tempo | 99,9 s |

Pelo critério do Gravar (recusa 3: último DL `inconsistente`/`insatisfativel` para o mesmo
hash), a ontologia atual **não poderia ser gravada** enquanto isso não for resolvido.

## Causa (verificada nos arquivos)

- `ontologia-alinhamentos.ttl:310`: `rec:SucessaoDeEntidade owl:equivalentClass org:ChangeEvent`
  (mapeamento `eq`, decidido no EOA; a classe foi adicionada manualmente na revisão da DKD a partir
  de lacuna externa mantida no ORR — FTM `Succession` e ORG `ChangeEvent`).
- `ontologia.ttl:871`: `rec:SucessaoDeEntidade rdfs:subClassOf rec:RelacaoReificada` — introduzido
  pelo ajuste **AJ-259 (2026-10-06, fonte: modelagem)**, sugestão da IA autorizada pelo administrador.
- `ontologia-alinhamentos.ttl:280`: `rec:RelacaoReificada rdfs:subClassOf prov:Entity` (tipagem PROV
  da Construção).
- `org.ttl:808`: `org:ChangeEvent rdfs:subClassOf prov:Activity`; `prov-o.ttl:56`:
  `prov:Activity owl:disjointWith prov:Entity`.

Logo `SucessaoDeEntidade ⊑ Entity ⊓ Activity ⊑ ⊥`, e, pela equivalência, `org:ChangeEvent` também.
O validador estrutural (E1–E12) não detecta isso — o conflito depende de axiomas de duas ontologias
externas (ORG e PROV-O) e de um ajuste apoiado só em decisão de modelagem. É o caso de uso previsto
para o DL opcional e um exemplo concreto de HiPPO exposto por evidência externa.

## Correções possíveis (decisão humana, não aplicada automaticamente)

1. Retirar `SucessaoDeEntidade` de `RelacaoReificada` (desfazer a parte de AJ-259 que a inclui) e
   tipá-la como `prov:Activity` — coerente com ORG (evento) e com a definição da própria classe
   ("Evento de fusão, cisão…"). Mantém a equivalência com `org:ChangeEvent`.
2. Rebaixar o mapeamento de `eq` para `close` (`skos:closeMatch`) — elimina a propagação, mas perde
   o reuso forte e mantém a tensão conceitual (um "evento" modelado como relação reificada/Entity).

A opção 1 é a conservadora do ponto de vista do método (a fonte externa prevalece sobre decisão de
modelagem).
