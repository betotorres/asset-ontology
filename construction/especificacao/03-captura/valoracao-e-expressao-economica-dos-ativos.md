# Levantamento de fontes — Valoração e expressão econômica dos ativos (recuperacao-ativos)
> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais.

## Atores considerados

Critério de seleção: foram incluídos apenas os atores mencionados nas respostas ASD (sobretudo G1 e G2, complementados por F1/F3) que **produzem, custodiam, atualizam ou consomem informação sobre o valor econômico de um ativo** — valor venal, valor declarado, valor estimado, valor de avaliação, valor do dano/valor a recuperar, moeda e conversão cambial. Atores citados no domínio mas sem papel identificado na valoração (ex.: polícia, defesa técnica, oficial de justiça) foram deixados de fora deste recorte, sem prejuízo de revisão posterior.

| Ator | Papel na valoração (conforme ASD) | Fonte da menção |
|---|---|---|
| Prefeituras / cadastro tributário municipal | Custódia do valor venal e do cadastro tributário do imóvel | F1/F3/G1 (analista humano de busca patrimonial) |
| Serventias de registro de imóveis (cartórios de imóveis) | Custódia da matrícula e dos atos registrais, inclusive valor declarado em cada transmissão e ônus averbados | G1, C3, F2/F3 (analista humano); F1 (assessor jurídico); F1 (MP) |
| Tabelionatos de notas / CENSEC | Escrituras e procurações — valor declarado no ato notarial | F3 (analista humano de busca patrimonial), G1 |
| Receita Federal | Renda e patrimônio declarados (base de comparação de compatibilidade econômica) | D2/F3 (analista humano); F3 (MP); G1 |
| Órgão central — área de busca patrimonial | Produz o dossiê com valor cadastral e juízo sobre valor real; extrai do título o valor do dano/valor a recuperar | A1/A3, B1, D3, F1 (analista de busca patrimonial, humano e sintético) |
| Órgão central — área de cooperação jurídica internacional | Registra valor/ativo no pedido de cooperação; lida com equivalência de moeda e de categorias entre jurisdições | B1, C3, F1 (analista de cooperação); G1 |
| Órgão central — coordenação/gestão de carteira | Usa valor estimado do ativo como critério de priorização/criticidade | B1, C3, D1 (coordenador/gestor) |
| Órgão central — área de TI/dados e automação (RPA) | Faz parsing do campo "valor estimado", trata moeda ausente e divergência por câmbio em datas distintas | B1, C2, F2, F3 (analista de TI/RPA) |
| Ministério Público | Solicita medidas sobre bens, acompanha valor total sob medida cautelar e atualização de avaliação | G1, D1 (membro do sistema de justiça) |
| Magistratura / juízos (processo eletrônico) | Decisões que fixam valor do dano, alcance da constrição, alienação antecipada e perdimento | G1, B1, F1 (MP; assessor jurídico; analista de busca patrimonial) |
| Assessoria jurídica de perdimento e destinação | Analisa alcance econômico do perdimento e dependência de avaliação patrimonial prévia à destinação | A1/A3, C2, D1 (assessor jurídico) |
| Órgãos de gestão patrimonial / área de execução da destinação | Recebem o bem e conduzem avaliação/leilão (fronteira declarada fora do escopo desta fase) | G1 (MP; assessor jurídico) |
| Autoridade central estrangeira / autoridade requerida | Informa valores bloqueados/localizados no exterior, em moeda estrangeira | G1/G2 (analista de cooperação; coordenador) |
| Instituição financeira / custodiante do bem | Executa a medida e detém o valor efetivamente bloqueado | G1 (analista de cooperação; analista de TI/RPA) |
| Provedor de taxas de câmbio históricas oficiais | Base desejada para converter valores conforme a data do documento | F3 (analista de TI/RPA) — instituição específica não nomeada: [requer pesquisa adicional] |

Observação de proveniência: apenas a resposta do analista de busca patrimonial do órgão central é de respondente humano; as demais são de agentes LLM (evidência de terceira classe) e precisam de validação antes de virar lastro de modelagem.

## Sistemas e bases por ator

### Prefeituras — cadastro tributário municipal
- Citado como fonte consultada de rotina na busca patrimonial (F1) e como base externa desejada em versão integrada nacionalmente (F3).
- Atributo de valor mencionado: **valor venal / valor cadastral** do imóvel, usado como coluna padrão da tabela de resposta do dossiê (D3: "identificação do bem, serventia/município, titular atual, data do último ato, valor cadastral, origem/data da consulta").
- Qualidade conhecida: valor "não confiável" como proxy de valor de mercado (F2); há inconsistência observada entre matrícula e cadastro tributário municipal (C2), sem que o analista tenha meio de verificar.
- Nome do sistema, formato de acesso, estrutura de campos, periodicidade de atualização e cobertura por município: [requer pesquisa adicional].

### Serventias de registro de imóveis — matrícula e atos registrais
- Vínculos com carga econômica explicitados em C3: `bem ↔ ato registral (data, natureza, partes)` e `bem ↔ titular anterior (data, **valor declarado**)`.
- Prática distorsiva registrada em C2: **subdeclaração de valor na escritura**; **oneração proposital do bem** e **alienação fiduciária usada para diluir aparência de valor** (C1/C2).
- Problemas de qualidade (F2): fragmentação do imobiliário entre serventias; cobertura desigual entre regiões; ausência de histórico; desatualização/atraso de averbação.
- Base externa desejada (F3): "ponto único nacional de registro de imóveis".
- Estrutura de campos de valor na matrícula (tipo, moeda, obrigatoriedade), formato de extração e identificador: [requer pesquisa adicional].

### Tabelionatos de notas / CENSEC
- Citado pelo respondente humano (F3) como base externa que agregaria valor — "CENSEC (tabelionatos, escrituras, procurações)"; também "registro de notas/escrituras" como base desejada.
- Propriedade econômica associada por inferência do próprio relato: valor declarado em escritura (ver C2, subdeclaração). Campos concretos do CENSEC: [requer pesquisa adicional].
- Nível de acesso atual "não detalhado pelo respondente" (F3).

### Receita Federal — dados de renda e declaração
- Consultada com acesso restrito (F1: "dado de renda e declaração (acesso restrito)").
- Uso econômico: apurar **incompatibilidade renda × patrimônio** (D2, C1) e capacidade financeira de terceiro de boa-fé (MP, D1.6/D2); "declarações de renda retificadas a posteriori para criar lastro de capacidade financeira" (MP, C2).
- Campos, granularidade (valores por bem declarado? por ano-calendário?), via de acesso e base legal: [requer pesquisa adicional].

### Autos digitais / sistema de processo eletrônico (Justiça Federal e demais juízos)
- Fonte primária do **título** que fundamenta a busca — sentença, acórdão, decisão de bloqueio — que, segundo o analista humano (B1), "define valor e alcance".
- Conceito de valor extraído do título: **valor do dano / valor a recuperar**, descrito como "régua para saber se a busca já 'cobriu' o caso" (B1).
- Valores e avaliações aparecem em texto livre: MP (B5) — "valor atualizado do bem ao longo do tempo (sem controle automático de reavaliação)"; assessor jurídico (C2) — "contestação de avaliação patrimonial para reduzir expressão econômica da constrição ou alegar desproporcionalidade".
- Nome do sistema não citado com precisão pelos respondentes (F1: "sistema eletrônico de tramitação, sem citar sistema específico"): [requer pesquisa adicional].

### Sistema de tramitação de pedidos de cooperação (órgão central) e pipeline de parsing/RPA
- Campo identificado no parsing de documentos do fluxo internacional (TI/RPA, B1, item 5): **"valor estimado"** — "nem sempre preenchido, ambiguidade entre valor de face e estimativa".
- Problema de qualidade (F2): "falta de padronização de moeda (campo de valor às vezes sem indicação de moeda)".
- Problema de consistência (C2): "valores que parecem mudar mas são conversões de câmbio em datas diferentes"; tratamento atual é *flag* de baixa confiança para revisão humana, sem correção automática.
- Uso gerencial (coordenador, B1/C3): `caso ↔ valor estimado do ativo` como filtro de priorização e "criticidade" (esta última não estruturada, vive em planilha paralela).
- Nome oficial do sistema de tramitação não confirmado por nenhum respondente: [requer pesquisa adicional]. Dicionário de dados, tipo/precisão do campo de valor e presença (ou não) de campo de moeda: [requer pesquisa adicional].

### Dossiê de busca patrimonial e controles próprios (planilhas e pastas)
- F1 (analista humano): "controles próprios (planilha e pastas de dossiê, artesanal)".
- Propriedades de valor efetivamente registradas no produto: valor cadastral do bem, origem e data da consulta, grau de confiança (confirmado/provável/hipótese).
- Lacuna explícita (B5): "o valor real do imóvel (só há venal/declarado, sem campo para estimativa)"; e "a data de corte da consulta (resultado é 'foto' de um dia, nem sempre marcada)" — crítica para datar qualquer valor.
- Pergunta de competência dependente de valoração que hoje não se responde (D1/D2): "Desses imóveis, quais valem de verdade acima de tal valor?" — classificada como impossível hoje, pois "valor de mercado real (não é dado, é julgamento)".
- Estrutura de colunas real das planilhas: [requer pesquisa adicional].

### Controles de acompanhamento de ativos com perdimento decretado (equipe de apoio administrativo)
- Citado pelo assessor jurídico (F1): "planilhas/controles internos de acompanhamento de ativos com perdimento decretado, mantidos por equipe de apoio administrativo (respondente não detalha estrutura)".
- Demanda de valoração associada (D1.8): "de todos os ativos com perdimento definitivo, quantos/quais dependem de **avaliação patrimonial** ou leilão antes da destinação".
- Estrutura, responsável formal e campos: [requer pesquisa adicional].

### Base de taxas de câmbio históricas oficiais (base desejada, inexistente no pipeline)
- F3 (TI/RPA): "base de taxas de câmbio históricas oficiais **vinculada à data do documento**"; o próprio respondente registra que "não soube precisar nomes ou nível de acesso dessas bases".
- Instituição provedora, granularidade (diária?), moedas cobertas e forma de integração: [requer pesquisa adicional].

### Demandas de valoração sem sistema identificado
- MP (D1.3 e D1.10): "bens sem avaliação atualizada há mais de X anos" e "valor total de bens sob medida cautelar, segregado por tipo" — nenhuma fonte estruturada foi indicada como capaz de responder hoje.
- Analista humano (B5) e MP (B5): valor atualizado do bem ao longo do tempo é apontado por ambos como **não registrado hoje**, disperso em texto livre.
- Alienação antecipada (MP, B1) — "venda judicial do bem antes da sentença, por risco de deterioração/desvalorização/custo" — é mencionada como conceito, sem indicação de sistema que registre o valor obtido: [requer pesquisa adicional].

## Sistemas e propriedades identificados

| Sistema/base | Ator(es) | Propriedades conhecidas | Lacunas |
|---|---|---|---|
| Cadastro tributário municipal | Prefeituras; consumido por analista de busca patrimonial (órgão central) | Valor venal / "valor cadastral" do imóvel; identificação do bem; município | Nome/plataforma por município; estrutura de campos; data de referência do valor venal; periodicidade de atualização; cobertura nacional; forma de acesso — [requer pesquisa adicional]. Divergência conhecida com a matrícula, sem meio de verificação |
| Matrícula e atos registrais de imóveis | Serventias de registro de imóveis; consumido pelo órgão central (busca patrimonial), MP, assessoria jurídica | Valor declarado na transmissão (vinculado a `bem ↔ titular anterior`); data e natureza do ato registral; partes; ônus/gravames averbados (inclusive alienação fiduciária); serventia e município | Nome dos campos e sua obrigatoriedade; moeda e formato do valor; identificador único do bem (ausente — F2); ausência de histórico consolidado; cobertura desigual; atraso de averbação — [requer pesquisa adicional] |
| CENSEC / atos notariais (escrituras e procurações) | Tabelionatos de notas; desejado pelo órgão central (busca patrimonial) | Escritura como fonte do valor declarado na aquisição (contexto de subdeclaração); procurações | Campos reais do CENSEC; se o valor do ato é pesquisável; nível de acesso do órgão central; identificador do ato — [requer pesquisa adicional] |
| Bases de renda e declaração (Receita Federal) | Receita Federal; consumido pelo órgão central, MP | Renda declarada; patrimônio declarado — usados para juízo de compatibilidade econômica (renda × patrimônio) | Campos exatos; se há valor por bem declarado e ano-calendário; via e base legal de acesso; tratamento de declarações retificadas — [requer pesquisa adicional] |
| Autos digitais / processo eletrônico (título: sentença, acórdão, decisão de bloqueio) | Juízos (Justiça Federal e demais); MP; órgão central; assessoria jurídica | Valor do dano / valor a recuperar fixado no título; alcance da constrição; data da decisão; juízo de origem; referências a avaliação patrimonial e a contestação de avaliação (em texto livre) | Nome do(s) sistema(s) não confirmado; ausência de campo estruturado para valor do bem e para avaliação; ausência de identificador único e persistente do bem; valor atualizado ao longo do tempo inexistente — [requer pesquisa adicional] |
| Sistema de tramitação de pedidos de cooperação + pipeline de parsing/RPA | Órgão central (cooperação internacional, coordenação, TI/RPA); autoridade central estrangeira | Campo "valor estimado" do ativo (frequentemente vazio; ambíguo entre valor de face e estimativa); número do processo/referência; país; tipo de medida; descrição do bem (texto livre); *flag* de baixa confiança aplicada a divergências de valor | Nome oficial do sistema; dicionário de dados; tipo/precisão do campo de valor; **ausência de campo de moeda**; ausência de data de referência do valor; divergências por câmbio em datas distintas não resolvidas — [requer pesquisa adicional] |
| Planilhas paralelas de gestão de carteira | Órgão central (coordenação/gestão) | Valor estimado do ativo como insumo de "criticidade"/priorização (não estruturado no sistema oficial) | Estrutura das planilhas; quem mantém; definição formal de criticidade; relação com o campo de valor do sistema de tramitação — [requer pesquisa adicional] |
| Dossiê de busca patrimonial e controles próprios (planilhas/pastas) | Órgão central (analista de busca patrimonial) | Valor cadastral do bem; identificação do bem; serventia/município; titular atual; data do último ato; origem e data da consulta; grau de confiança (confirmado/provável/hipótese) | Não há campo para valor de mercado/estimativa; data de corte da consulta nem sempre marcada; resultado não persistido como "foto" datada; nada retroalimenta base pesquisável; estrutura de colunas real — [requer pesquisa adicional] |
| Controles internos de ativos com perdimento decretado | Assessoria jurídica (equipe de apoio administrativo); autoridade decisória de destinação | Registro de ativos com perdimento decretado; sinalização de dependência de avaliação patrimonial/leilão antes da destinação | Estrutura e campos não detalhados pelo respondente; ausência de campo de valor de avaliação e de data da avaliação; responsável formal — [requer pesquisa adicional] |
| Base de taxas de câmbio históricas oficiais (desejada, inexistente) | Órgão central (TI/RPA); provedor não nomeado | Requisito declarado: taxa de câmbio histórica **vinculada à data do documento**, para reconciliar valores que divergem apenas por conversão | Instituição provedora; granularidade (diária/de fechamento); moedas cobertas; forma de integração; nível de acesso — [requer pesquisa adicional] |
| Registro de valor bloqueado no exterior (retorno de cooperação) | Autoridade central estrangeira; instituição financeira/custodiante; órgão central | Valor efetivamente bloqueado informado no retorno do pedido (marco "bloqueio confirmado") | Se existe sistema/base ou apenas ofício e e-mail; moeda e data de referência do valor informado; ausência de registro estruturado do desfecho (respostas chegam por canal informal) — [requer pesquisa adicional] |
| Avaliação patrimonial para leilão/destinação | Órgãos de gestão patrimonial / área de execução da destinação | Existência da etapa de avaliação antes do leilão/destinação (mencionada em caso concreto e em pergunta de competência); alienação antecipada motivada por risco de desvalorização | Nenhum sistema, laudo, campo, metodologia ou responsável identificado nas respostas — tema declarado fora do escopo por vários respondentes — [requer pesquisa adicional] |
