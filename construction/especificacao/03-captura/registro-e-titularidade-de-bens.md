# Levantamento de fontes — Registro e titularidade de bens (recuperacao-ativos)
> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais.

## Atores considerados

**Critério de seleção:** foram incluídos os atores citados nas respostas ASD (seções G1/G2, complementadas por F1/F3 e por pistas de B/C) que (a) produzem ou custodiam o dado de existência do bem e de quem consta como seu titular formal, ou (b) produzem/recebem atos registrais de transmissão e ônus, ou ainda (c) consomem esses dados na atividade de busca patrimonial e de cooperação. Ficaram **fora** desta categoria atores cuja relação é apenas com constrição judicial, gestão física, leilão ou destinação do bem, exceto quando o ato correspondente é averbado no próprio registro (ex.: indisponibilidade anotada em matrícula).

Peso de evidência: a única resposta de **respondente humano** é a do *Analista de busca patrimonial (órgão central)* de 2026-09-11T21:18; as demais são **respondentes sintéticos (agentes LLM)** — evidência de terceira classe, que exige validação humana.

| Ator | Papel nesta categoria | Origem na ASD |
|---|---|---|
| Serventias de registro de imóveis (cartórios/comarcas) | Custódia da matrícula, dos atos registrais de transmissão e das averbações de ônus | G1 (analista humano e sintético), F1/F3 |
| Tabelionatos de notas / CENSEC (Central Notarial de Serviços Eletrônicos Compartilhados) | Escrituras e procurações (atos notariais que antecedem/instrumentalizam a transmissão) | F3 (humano), F3 (analista sintético: "registro de notas/escrituras"), G1 |
| CNIB — Central Nacional de Indisponibilidade de Bens | Registro de indisponibilidades/bloqueios sobre imóveis | F3 (humano) |
| Órgãos de trânsito (DENATRAN/Detran) e RENAJUD | Propriedade e restrições de veículos | F3 (humano), F1/G1 (sintéticos: "trânsito", "Detran", "órgão de trânsito") |
| ANAC / RAB (Registro Aeronáutico Brasileiro) | Registro de propriedade de aeronaves | F3 (humano), B1/F3 (aeronaves) |
| Capitania dos Portos / Marinha do Brasil | Registro de propriedade de embarcações | F3 (humano), F3 (analista sintético) |
| INPI | Registro de propriedade intelectual | F3 e D2 (humano) |
| Juntas comerciais | Documentos arquivados, cadeia societária e integralização de bens em capital social (titularidade via PJ) | F1/F3/G1 (sintéticos), F3 (analista sintético: "documentos arquivados de junta comercial") |
| Receita Federal | Cadastro de pessoa física/jurídica (CPF/CNPJ) e bens/patrimônio declarados | D2/F1 (humano), F1/F3/G1 (sintéticos) |
| Prefeituras — cadastro tributário municipal (IPTU) | Cadastro do imóvel e valor venal; ponto de confronto com a matrícula | F1/F3/C2 (analista sintético) |
| Registro civil | Estado civil e regime de bens (afeta titularidade e comunhão) | F3/G1 (analista sintético), D2 (membro do sistema de justiça) |
| Cadastro de imóvel rural | Posse/exploração de imóvel rural | F3 (analista sintético) |
| Registros de propriedade e de beneficiário final em jurisdições estrangeiras (ex.: UK Companies House) | Titularidade de bens e de estruturas no exterior | D2/F3 (humano), F3 (analista sintético e de cooperação) |
| Órgão central — área de busca patrimonial | Consome os registros e produz o dossiê com titularidade atribuída e grau de confiança | A1/A3/F1 (humano e analista sintético) |
| Órgão central — autoridade central de cooperação | Veicula pedidos para obtenção de registros de titularidade no exterior | G1/G2 (analista de cooperação, coordenador) |

Atores mencionados no ASD mas **não atribuídos a esta categoria**: órgãos de gestão patrimonial/custódia física, fundos e entes destinatários do perdimento, COAF/SIMBA e UIFs estrangeiras (dados financeiros), exchanges de criptomoedas (KYC), MRE/STJ (trâmite). Registrados aqui apenas para evitar reprocessamento.

## Sistemas e bases por ator

### Serventias de registro de imóveis
- **Matrícula do imóvel** (base descentralizada por serventia/comarca). Atributos citados nas respostas: número/identificação da matrícula; serventia; município; titular atual; titular anterior; ato registral com **data**, **natureza** e **partes**; valor declarado na escritura; averbação de ônus (ex.: ônus averbado ligado a sócio da mesma cadeia); anotação de indisponibilidade/constrição com indicação do processo e da data ("desde quando"); registro de alienação fiduciária.
- **"Base patrimonial imobiliária"** citada pelo analista de busca como fonte que indica *existência* do bem, distinta do *conteúdo* do registro, que está na serventia. Nome oficial da base não foi informado — [requer pesquisa adicional].
- Características de qualidade relatadas: fragmentação por comarca/estado; cobertura desigual entre regiões; ausência de histórico (resultado é "foto" de um dia); desatualização/atraso de averbação; valor não confiável; ausência de identificador único e estável do bem.

### Tabelionatos de notas / CENSEC
- **CENSEC** — citado como base de "tabelionatos, escrituras, procurações". Conteúdo declarado: existência de escrituras e de procurações. Campos, chaves de consulta, granularidade e nível de acesso — [requer pesquisa adicional].
- Elementos correlatos citados em C1/C2: escritura com valor subdeclarado; contrato particular com data retroagida; "contrato de gaveta" (posse/pagamento sem titularidade registrada), explicitamente reconhecido como **não modelável hoje** por ausência de registro.

### CNIB — Central Nacional de Indisponibilidade de Bens
- Descrita apenas como base de "bloqueios de imóveis". Campos, forma de acesso e integração com as matrículas — [requer pesquisa adicional].

### Órgãos de trânsito (DENATRAN/Detran) e RENAJUD
- **RENAJUD/DENATRAN** citados como base de veículos. Usos mencionados: consulta de propriedade de veículos; certidões de órgão de trânsito recebidas como anexo processual. Campos concretos (placa, RENAVAM, chassi, proprietário, restrições) — [requer pesquisa adicional]; nenhum campo foi nomeado nas respostas.
- Caso ilustrativo citado: "veículo de luxo bloqueado em nome de familiar", indicando que titularidade formal e restrição judicial coexistem na base — confirmação — [requer pesquisa adicional].

### ANAC / RAB
- Citada como base de aeronaves. Nenhum campo, identificador (ex.: marca de nacionalidade/matrícula) ou modo de acesso foi mencionado — [requer pesquisa adicional].

### Capitania dos Portos / Marinha
- Citada como base de embarcações ("registro de embarcação"). Nenhum campo ou identificador mencionado — [requer pesquisa adicional].

### INPI
- Citado como base de "registros de propriedade intelectual", listada entre as fontes que agregariam valor e entre as que exigem cruzamento. Nenhum campo, tipo de ativo (marca, patente, desenho) ou identificador foi detalhado — [requer pesquisa adicional].

### Juntas comerciais
- Fontes citadas: consulta por ofício (não integrada); "documentos arquivados de junta comercial"; mapeamento de vínculos societários; cadeia societária navegável por níveis. Atributos citados em C3: percentual de participação; período de entrada/saída do sócio; relação PJ↔PJ; relação PJ↔bem.
- Relevância para esta categoria: integralização de imóveis como capital de holding familiar (caso descaracterizado C4 do analista humano/sintético) — a titularidade formal migra para a PJ.

### Receita Federal
- Citada como base de dados de pessoas físicas/jurídicas e de Imposto de Renda/declaração de patrimônio. Chaves de consulta mencionadas no vocabulário operacional: **CPF** e **CNPJ** ("puxar/bater CPF/CNPJ"). Uso nesta categoria: identificação/qualificação do titular e confronto renda × patrimônio. Campos de bens declarados — [requer pesquisa adicional].

### Prefeituras — cadastro tributário municipal
- Citado como fonte consultada pelo analista de busca. Atributo citado: **valor venal/valor cadastral** (usado como proxy, reconhecido como não confiável); endereço. Inconsistência entre matrícula e cadastro tributário municipal apontada como suspeita recorrente não verificável pelo analista.

### Registro civil
- Citado como fonte desejada, "incluindo regime de bens". Campos concretos — [requer pesquisa adicional].

### Cadastro de imóvel rural
- Citado como fonte desejada para "posse/exploração" de imóvel rural. Órgão responsável e nome do cadastro não foram informados — [requer pesquisa adicional].

### Registros estrangeiros de propriedade e de beneficiário final
- Citados: "registros de propriedade em jurisdições estrangeiras"; "registros de beneficiário final em outros países (ex.: UK Companies House, registros de paraísos fiscais)". Acesso: apenas via cooperação jurídica internacional/autoridade central; fora do alcance direto do analista. Campos e nível de acesso — [requer pesquisa adicional].

### Órgão central — busca patrimonial (bases próprias)
- **Dossiê do caso** e **planilhas/pastas de controle** (descritos como artesanais). Elementos registrados pelo analista, relevantes a esta categoria: identificação do bem; serventia/município; titular atual; data do último ato; valor cadastral; **origem e data da consulta**; **grau de confiança** (confirmado/provável/hipótese); pendências.
- **Knowledge graph** alimentado por extração (NER/LLM) de documentos, imagens e tabelas não estruturados (resposta humana, D3) — esquema e propriedades — [requer pesquisa adicional].
- Atributos declarados como **inexistentes hoje** e que a equipe gostaria de registrar: a negativa de consulta; a data de corte da consulta; o "porquê" do vínculo; a hipótese descartada; o grau de certeza da amarração de identidade (por documento / nome+data de nascimento / nome+município); valor real de mercado do imóvel.

### Autos judiciais e certidões anexadas (fonte secundária desta categoria)
- Certidões de cadastros/registros públicos (cartório, órgão de trânsito) recebidas **como anexo processual** — ou seja, o dado registral chega ao analista em PDF/imagem, não por consulta à base. Sistema de processo eletrônico da Justiça Federal citado como continente desses anexos; nome/versão — [requer pesquisa adicional].

## Sistemas e propriedades identificados

| Sistema/base | Ator(es) | Propriedades conhecidas | Lacunas |
|---|---|---|---|
| Matrícula de imóvel (registro predial descentralizado) | Serventias de registro de imóveis | Nº/identificação da matrícula; serventia; município; titular atual; titular anterior; ato registral (data, natureza, partes); valor declarado na escritura; averbação de ônus; anotação de indisponibilidade/constrição (processo, data de início); alienação fiduciária | Nome/UF das bases por serventia; formato e tipos de dado dos campos; existência de identificador nacional único do imóvel; se há histórico versionado ou só estado atual; regras de acesso e via de consulta (ofício, central eletrônica, integração) — [requer pesquisa adicional] |
| "Base patrimonial imobiliária" de indicação de existência de bem (nome não informado) | Serventia/central não identificada; consumida pelo órgão central | Indica *existência* de bem por titular, sem o conteúdo do registro | Nome oficial, operador, chave de consulta, campos retornados, cobertura geográfica, nível de acesso — [requer pesquisa adicional] |
| CENSEC | Tabelionatos de notas | Registro de escrituras; registro de procurações | Campos/metadados de cada índice (partes, data, natureza do ato, tabelionato); chaves de consulta (CPF/CNPJ?); se retorna teor ou apenas existência; nível de acesso do órgão central — [requer pesquisa adicional] |
| CNIB — Central Nacional de Indisponibilidade de Bens | Poder Judiciário / serventias | Ordens de indisponibilidade/bloqueio incidentes sobre imóveis | Campos (nº da ordem, juízo, CPF/CNPJ do titular, data, situação); se é orientada a pessoa ou a bem; forma de integração com matrícula; nível de acesso — [requer pesquisa adicional] |
| RENAJUD / base DENATRAN-Detran | Órgãos de trânsito; Judiciário | Propriedade de veículos; existência de restrição judicial sobre veículo (caso citado de veículo em nome de familiar) | Nenhum campo nomeado na ASD: placa, RENAVAM, chassi, proprietário, endereço, histórico de transferências, tipo de restrição — todos [requer pesquisa adicional]; distinção entre o que é RENAJUD (constrição) e o que é base cadastral de propriedade — [requer pesquisa adicional] |
| ANAC / RAB | ANAC | Registro de propriedade de aeronaves (apenas a existência da base foi citada) | Todos os campos e identificadores (matrícula da aeronave, proprietário, operador, ônus, gravames), formato e acesso — [requer pesquisa adicional] |
| Registro de embarcações — Capitania dos Portos/Marinha | Marinha do Brasil | Registro de propriedade de embarcações (apenas a existência da base foi citada) | Todos os campos e identificadores (inscrição, nome da embarcação, proprietário, hipoteca/ônus), formato e acesso — [requer pesquisa adicional] |
| INPI | INPI | Registros de propriedade intelectual atribuíveis a alvo (apenas a existência da base foi citada) | Tipos de ativo cobertos; identificadores de processo/registro; titular; cessões e transferências de titularidade; garantias; formato e acesso — [requer pesquisa adicional] |
| Juntas comerciais (atos e documentos arquivados) | Juntas comerciais estaduais | Vínculo pessoa↔PJ com percentual e período de entrada/saída; vínculo PJ↔PJ (cadeia navegável em níveis); vínculo PJ↔bem; documentos arquivados (contrato/alteração social) que registram integralização de imóveis em capital | Campos exatos e formatos; identificador do ato; existência de base nacional integrada; disponibilidade de histórico; acesso hoje por ofício e não integrado — [requer pesquisa adicional] |
| Cadastro CPF/CNPJ e declarações — Receita Federal | Receita Federal | CPF e CNPJ como chaves de consulta e de amarração de identidade; dados de qualificação de PF/PJ; renda/patrimônio declarados (para confronto de incompatibilidade) | Quais campos de bens declarados existem e em que granularidade; regime de sigilo fiscal aplicável; via de acesso do órgão central; se há campo de beneficiário final e sua confiabilidade (relatada como baixa) — [requer pesquisa adicional] |
| Cadastro tributário municipal (IPTU) | Prefeituras | Valor venal/valor cadastral do imóvel; endereço; identificação cadastral do imóvel | Nome/formato dos cadastros por município; inexistência de integração nacional; chave de reconciliação com a matrícula (fonte reconhecida de inconsistência); acesso — [requer pesquisa adicional] |
| Registro civil | Cartórios de registro civil | Estado civil; regime de bens | Campos, identificadores, existência de central nacional, acesso — [requer pesquisa adicional] |
| Cadastro de imóvel rural (nome/órgão não informados) | Não identificado na ASD | Indicação de posse/exploração de imóvel rural | Órgão responsável, nome do cadastro, campos, relação com a matrícula, acesso — [requer pesquisa adicional] |
| Registros estrangeiros de propriedade e de beneficiário final (ex.: UK Companies House, registros de paraísos fiscais) | Autoridades/registros estrangeiros; acessados via autoridade central | Titularidade de bens e de estruturas societárias no exterior; beneficiário final declarado | Todos os campos; jurisdições cobertas; forma de acesso (cooperação/MLAT/auxílio direto); restrições do princípio da especialidade sobre o dado obtido — [requer pesquisa adicional] |
| Dossiê de busca patrimonial e planilhas de controle (órgão central) | Órgão central — busca patrimonial | Identificação do bem; serventia/município; titular atual; data do último ato; valor cadastral; origem da consulta (base) e data da consulta; grau de confiança (confirmado/provável/hipótese); pendências; título que fundamenta a busca; alvo (CPF/CNPJ) | Estrutura real dos arquivos (colunas, tipos); ausência de campo para negativa de consulta, data de corte, "porquê" do vínculo, hipótese descartada, grau de certeza da amarração de identidade e valor de mercado — confirmados como inexistentes; formato de persistência versionada ("foto" datada) inexistente — [requer pesquisa adicional para desenho] |
| Knowledge graph interno alimentado por NER/LLM | Órgão central (equipe de análise/inteligência) | Armazena entidades, propriedades e vínculos extraídos de documentos, imagens e tabelas não estruturados | Esquema, tecnologia, propriedades efetivamente persistidas, procedência e grau de confiança por asserção — [requer pesquisa adicional] |
| Certidões registrais anexadas aos autos (processo eletrônico) | Serventias/órgãos de trânsito → Judiciário → órgão central | Teor de certidões de cartório e de órgão de trânsito, recebidas como anexo processual (PDF/imagem) | Nome/versão do sistema de processo eletrônico; ausência de estruturação (dado registral chega como documento, não como campo); inexistência de identificador único e persistente do bem entre peças — [requer pesquisa adicional] |

**Observação transversal (com lastro em F2/H3 de múltiplas respostas):** a lacuna apontada de forma convergente nesta categoria é a **ausência de identificador único e estável do ativo** e a **fragilidade da amarração de identidade do titular** (homônimos, grafias divergentes entre idiomas, duplicidade documental). Qualquer inventário de propriedades desta categoria deve prever, na etapa seguinte, o registro explícito de **procedência (base + data da consulta)** e de **grau de confiança/status probatório** por asserção de titularidade — requisito levantado independentemente por quatro respondentes.
