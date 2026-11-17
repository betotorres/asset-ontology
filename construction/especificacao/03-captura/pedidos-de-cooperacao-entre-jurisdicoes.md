# Levantamento de fontes — Pedidos de cooperação entre jurisdições (recuperacao-ativos)

> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais.

## Atores considerados

Critério de seleção: foram incluídos apenas atores que aparecem nas respostas ASD (sobretudo nas seções G1/G2, complementadas por F1/F3 e pelos relatos de fluxo em B/C) como **produtores, custodiantes, intermediários ou destinatários** de dados relativos a pedidos de cooperação jurídica internacional em matéria patrimonial — isto é, atores que geram ou recebem registro de pedido ativo/passivo, correspondência entre jurisdições, medida requerida, documentos exigidos, pedidos complementares, respostas e desfechos. Atores mencionados apenas em outras categorias de dados (ex.: custódia de registros patrimoniais domésticos, gestão física do bem) não foram incluídos, salvo quando aparecem como parte do fluxo de cooperação.

| Ator | Papel na categoria | Fonte (resposta ASD) |
|---|---|---|
| **Órgão central — Autoridade Central brasileira** | Intermediário oficial entre autoridade brasileira e país estrangeiro; instrui, envia, recebe e acompanha pedidos ativos e passivos; registra tramitação em sistema interno | Analista de cooperação jurídica internacional (A1, B1.3, G1); Coordenador/gestor do órgão central (B1, G1); Analista de busca patrimonial humano (E1) |
| **Coordenação/direção do órgão central** | Gestão da carteira de casos de cooperação; priorização, cobrança formal, escalonamento e articulação institucional/diplomática | Coordenador/gestor do órgão central (A1, A3, B1, E1, G1) |
| **Equipe de TI/automação (RPA) do ministério** | Integração de sistemas, parsing de documentos do fluxo internacional, geração de minutas, reconciliação de versões e de respostas tardias | Analista de TI/dados e automação (A1, A3, C4, F1) |
| **Autoridade requisitante brasileira (juízo de origem, MP, polícia)** | Produz a decisão/requerimento que fundamenta o pedido; é cobrada em saneamento/complementação; consome resposta sobre status | Analista de cooperação internacional (C3, E1, G1); Coordenador do órgão central (G1); MP externo (F1, G1) |
| **STJ** | Exequatur de cartas rogatórias (em ambos os sentidos) | Analista de cooperação internacional (B1.2, G1, E1) |
| **Ministério das Relações Exteriores (Itamaraty)** | Via diplomática; nota verbal em casos sem tratado ou sem canal técnico direto; classificação de informação diplomática | Analista de cooperação internacional (B3, G1, H1) |
| **Autoridade central estrangeira** | Contraparte oficial: recebe/envia pedido, formula pedidos de esclarecimento, devolve resposta e desfecho | Analista de cooperação internacional (B1.3, B2, F1, G1); Coordenador do órgão central (B1, C4, F1, G1); MP externo (F1, G2) |
| **Autoridade requerida no país estrangeiro (MP local, agência de recuperação de ativos, unidade de inteligência financeira estrangeira)** | Executa/instrui o pedido no país de destino; não necessariamente coincide com a autoridade central | Analista de cooperação internacional (B1.8, G1) |
| **Unidades de Inteligência Financeira estrangeiras (rede Egmont)** | Canal de troca de informação financeira entre FIUs, apontado como fonte desejada/complementar ao trâmite formal | Analista de busca patrimonial humano (D2, F3); MP externo (F3) |
| **Redes de cooperação (CARIN, ARINSA, RRAG) e pontos de contato de recuperação de ativos** | Canal informal/complementar de contato entre jurisdições | Analista de busca patrimonial humano (G2); Analista de cooperação internacional (F1, F3, G2); Coordenador do órgão central (F3 — reconhece existência sem domínio técnico) |
| **Juízo brasileiro competente para cumprimento (pedido passivo)** | Executa no Brasil a medida requerida por país estrangeiro | Analista de cooperação internacional (G1) |
| **Instituição financeira / terceiro custodiante do bem no país de destino** | Executa materialmente a medida (bloqueio de conta etc.) | Analista de cooperação internacional (G1); Analista de TI (G1) |
| **Área de busca patrimonial (órgão central)** | Produz o dossiê que instrui o pedido de cooperação (consumidor a montante) | Analista de busca patrimonial sintético (A3, E1) |
| **Área jurídica / assessoria de análise substantiva** | Valida mérito antes da minuta; consultada em questões de enquadramento (ex.: confisco sem condenação) | Analista de cooperação internacional (C4 — Caso 2); Analista de TI (G1); Assessor jurídico (B4, G1) |
| **Organismo internacional de cooperação (papel não identificado)** | Possível intermediário/plataforma; papel não esclarecido pelos respondentes | Analista de TI (G1, F1); Coordenador do órgão central (G1) |

Observação de proveniência: com exceção do analista de busca patrimonial humano (respondente humano) e da resposta do membro externo do sistema de justiça, as demais respostas são de agentes sintéticos (evidência de terceira classe), exigindo validação humana antes de virarem lastro de modelagem.

Lacuna de ator: **G1 do respondente humano não identificou os atores com precisão** (resposta em aberto), o que reduz o lastro de primeira classe desta seção. [requer pesquisa adicional]

## Sistemas e bases por ator

### Órgão central — Autoridade Central brasileira

- **Sistema interno de controle de tramitação de processos de cooperação** — nome técnico não confirmado pelos respondentes (o analista de cooperação declara não ter certeza do nome; o coordenador refere-se a "sistema de tramitação (não identificado com precisão)"; o analista de TI evitou nomear sistemas por incerteza). Elementos mencionados:
  - número do processo/referência interna (usado como chave primária de cruzamento entre sistemas);
  - direção do pedido: ativo (Brasil solicita) / passivo (Brasil recebe);
  - país solicitante/solicitado;
  - autoridade central/requerente (juiz, MP, autoridade estrangeira);
  - autoridade central de origem e de destino;
  - tratado/instrumento aplicável (registrado como *string* de referência; nem sempre explícito ou padronizado);
  - tipo de medida solicitada (bloqueio, sequestro, confisco, repatriação) — campo categórico ou texto livre;
  - descrição do bem/ativo (campo livre);
  - valor estimado (nem sempre preenchido; ambiguidade entre valor de face e estimativa; às vezes sem indicação de moeda);
  - dados de pessoa física/jurídica envolvida (dados sensíveis);
  - prazo/urgência do pedido;
  - status do pedido (frequentemente inferido pelo histórico, não campo explícito);
  - histórico de andamento/status ao longo do tempo (sequência de estados, não valor único);
  - datas de envio e de resposta (base para cálculo de prazo médio e de tempo parado);
  - vínculo pedido ↔ documentos anexos (um-para-muitos, com status próprio de conformidade por documento);
  - vínculo pedido ↔ pedido complementar (sub-pedido de esclarecimento);
  - vínculo pedido ↔ decisão judicial que o fundamenta.
  - Formato/tecnologia, identificador oficial, estrutura de tabelas e órgão gestor: [requer pesquisa adicional]

- **Sistema/módulo de controle de correspondência internacional** (mencionado pelo analista de TI em F1, sem nome). Atributos mencionados: registro de correspondência trocada; data de recebimento de documento (frequentemente confundida com data de processamento interno). Demais metadados: [requer pesquisa adicional]

- **Caixa de e-mail institucional** — descrita como canal central de comunicação com autoridades centrais estrangeiras e como fonte "semi-oficial". Propriedades mencionadas: conteúdo de pedidos de esclarecimento, motivos de devolução/saneamento, respostas e desfechos; sem espelho automático no sistema (lançamento manual posterior, gerando desatualização de status). Estrutura e política de retenção: [requer pesquisa adicional]

- **Planilhas de controle paralelas da equipe** — usadas para controle de prazo/SLA, criticidade de gestão e prazos de resposta previstos em tratado (controle manual, sem alerta automático). Campos concretos: [requer pesquisa adicional]

- **Base/repositório de acordos e tratados** — não confirmado se é plataforma unificada ou pasta de referência individual (analista de cooperação, F1). Conteúdo desejado: vigência, reservas, signatários (F3). [requer pesquisa adicional]

- **Documentos anexados (PDFs, formulários escaneados, traduções)** — apontados como única fonte primária de certos dados. Propriedades mencionadas: formulário padronizado por tratado (ex.: "formulário da Convenção de Palermo", "modelo do MLAT com os EUA"); tradução (às vezes juramentada) com possível divergência entre original e tradução; apostilamento/legalização consular; narrativa dos fatos/resumo do caso em parágrafo livre com variação de estilo e idioma; formato de data exigido por tratado/formulário (ex.: ISO 8601); campo obrigatório de citação de tratado/base legal (sistema verifica presença, não correção jurídica).

- **Checklist de bloqueio de fluxo por tradução** — mencionado pelo analista de TI (G2): o sistema bloqueia o fluxo até a tradução chegar. Implementação técnica: [requer pesquisa adicional]

### Coordenação/direção do órgão central

- **Planilha paralela de criticidade/priorização da carteira** — "criticidade" não é campo estruturado; vive em planilha paralela e em reuniões. Elementos mencionados como critérios: valor estimado do ativo, prazo de prescrição, relevância/peso institucional (cobrança de autoridade, repercussão midiática), "caso sensível" (sem definição formal). Estrutura de arquivo/campos: [requer pesquisa adicional]
- **Reuniões semanais de acompanhamento** — fonte tácita relevante registrada como fonte pelo coordenador (F1). Sem registro estruturado.
- **Ofícios e correspondência oficial com outros órgãos brasileiros** — mencionados como fonte (F1). Metadados: [requer pesquisa adicional]
- **Contato informal/telefônico em casos urgentes** — declarado como não registrado formalmente (F1).
- Indicadores de gestão mencionados (sem sistema identificado): marco de bloqueio efetivado; marco de repatriação; "estoque/carteira parada" (casos sem movimentação há X tempo); fase do fluxo (recebido, em análise, aguardando resposta externa, com medida aplicada, concluído); tempo médio de resposta por país; escalonamento. Fonte/sistema de onde esses indicadores seriam extraídos: [requer pesquisa adicional]

### Equipe de TI/automação (RPA) do ministério

- **Pipeline de parsing/extração de documentos do fluxo internacional** — extrai dos documentos recebidos: número do processo/referência, país solicitante/solicitado, autoridade central/requerente, descrição do bem/ativo, valor estimado, base legal/tratado aplicável, tipo de medida, dados de pessoa física/jurídica, prazo/urgência, status.
  - Propriedades de qualidade mencionadas: *flag* de baixa confiança para revisão humana; reconciliação de versões (versão N ↔ versão N-1 do mesmo documento); vínculo pedido ↔ resposta religado via número de referência (respostas podem chegar meses depois); vínculo pessoa ↔ pessoa (ex.: representante legal) como vínculo de menor confiança.
  - Inconsistências tratadas (sem correção automática, apenas sinalização): grafia divergente de nomes entre idiomas/traduções; valores divergentes por conversão de câmbio em datas distintas; ambiguidade de formato de data (mês/dia vs. dia/mês); terminologia divergente entre "seizure", "freezing", "forfeiture", "confiscation" e "sequestro"/"bloqueio".
  - Tecnologia, linguagem, nome oficial da ferramenta, cobertura: [requer pesquisa adicional]
- **Gerador automático de minutas** — produz minuta a partir de dados validados pela área jurídica, com revisão humana obrigatória antes de assinatura/envio. Templates e campos mapeados: [requer pesquisa adicional]
- **Logs de acesso a documentos com dado sensível e restrição de acesso por perfil** — mencionados como prática (H1), sem detalhe técnico de implementação. [requer pesquisa adicional]

### Autoridade requisitante brasileira (juízo de origem, MP, polícia)

- **Sistema de processo eletrônico da Justiça Federal / autos digitais** — fonte da decisão judicial que fundamenta o pedido; no recorte desta categoria, interessa como origem dos documentos exigidos e como referência externa. Propriedades mencionadas da decisão como documento de entrada: data, juízo de origem, tipo de medida determinada, individualização do bem (CPF/CNPJ, número de conta, instituição — frequentemente ausente e causa de saneamento), descrição fática da conduta. Nome do sistema, campos e API: [requer pesquisa adicional]
- **Sistemas internos do MP** (controle de prazo/distribuição, não análise patrimonial) — mencionados pelo MP externo (F1); relevância para esta categoria limitada ao acompanhamento interno do pedido internacional. [requer pesquisa adicional]
- **Retorno da autoridade central recebido nos autos** — o MP externo declara não ter acesso a base internacional direta; recebe apenas o retorno. Formato do retorno: [requer pesquisa adicional]
- Lacuna estrutural apontada: ausência de identificador único que amarre o processo de origem (Judiciário) ao processo no país requerido — cada lado tem numeração própria, sem elo automático.

### STJ

- **Sistema de exequatur de cartas rogatórias** — mencionado apenas pelo papel (G1), sem identificação de sistema, campos ou forma de acesso. [requer pesquisa adicional]

### Ministério das Relações Exteriores (Itamaraty)

- **Nota verbal / correspondência diplomática** — instrumento formal usado quando não há canal técnico direto; pode ter grau de sigilo próprio, regido por normas do Itamaraty. Sistema de registro, numeração e metadados: [requer pesquisa adicional]

### Autoridade central estrangeira / autoridade requerida no exterior

- **Sistemas de tramitação de cooperação de outros países** — o analista de cooperação declara que **não existe interoperabilidade ou portal comum de status**, até onde sabe; comunicação é por ofício, e-mail ou nota verbal.
- **Correspondência recebida** (ofícios, e-mails, notas verbais, formulários) — propriedades mencionadas: número de referência estrangeiro; pedidos de esclarecimento/complementação; motivo de devolução ou saneamento (falta de tradução, apostilamento, dupla incriminação, formulário incompleto); exigências extras por tradição jurídica (common law: certificação/affidavits; civil law: cópia autenticada e tradução juramentada); resposta e desfecho (cumprido/recusado/sem resposta); confirmação de bloqueio no exterior.
- **Registro de exigências formais por país** (tradução juramentada, nível de detalhamento da fundamentação, prazos distintos, legalização/apostilamento) — reconhecido como gargalo prático, sem base consolidada. [requer pesquisa adicional]

### Unidades de Inteligência Financeira estrangeiras (rede Egmont)

- **Canal/rede Egmont para troca de informação entre FIUs** — citado como fonte externa desejada (D2, F3 do respondente humano; F3 do MP externo). Nenhum campo, formato ou nível de acesso descrito. [requer pesquisa adicional]

### Redes CARIN, ARINSA, RRAG e pontos de contato de recuperação de ativos

- **Canais das redes de cooperação** — descritos como acesso pontual/informal, "não como base consultável" (analista de cooperação, F1 e F3); o coordenador reconhece a existência mas não domina nome/funcionamento técnico; o respondente humano lista as redes em G2. Estrutura, registro de contatos, formato das respostas: [requer pesquisa adicional]

### Instituição financeira / custodiante do bem no país de destino

- Executa materialmente a medida; sem interação direta com os respondentes e sem sistema identificado. [requer pesquisa adicional]

### Área de busca patrimonial (órgão central)

- **Dossiê do caso** (controles próprios: planilhas e pastas, descritos como artesanais) — produto que instrui o pedido de cooperação. Propriedades mencionadas: alvo; título que fundamenta a busca; o que foi localizado (com individualização mínima); grau de confiança (confirmado/provável/hipótese); pendências; procedência de cada dado (base e data da consulta); resultado persistido como "foto" datada. Relevância para esta categoria: insumo obrigatório do pedido e fonte da individualização do bem exigida pelo país requerido. Estrutura de arquivo/campos formais: [requer pesquisa adicional]

### Área jurídica / assessoria de análise substantiva

- **Manifestação técnica/parecer** e validação de mérito antes da minuta — sem sistema próprio identificado nesta categoria. [requer pesquisa adicional]

### Organismo internacional de cooperação (não identificado)

- **Possível portal/plataforma de organismo internacional de cooperação** — o analista de TI menciona existência incerta e desconhece como se conectaria ao pipeline; também menciona número de referência de "sistema/plataforma internacional" como possível fonte de cruzamento. [requer pesquisa adicional]

### Instrumentos normativos citados como base legal dos pedidos (não são sistemas, mas condicionam campos)

Mencionados em G2 do respondente humano e em B1/C4 dos demais: ENCLA; Convenção das Nações Unidas contra a Corrupção (UNCAC); Convenção de Palermo; tratados bilaterais de MLAT (EUA, Portugal, países do Mercosul, entre outros); Convenção Interamericana contra a Corrupção (OEA); Convenção da Apostila de Haia (apostilamento); reciprocidade (quando não há tratado). Registro estruturado de vigência, reservas e signatários: [requer pesquisa adicional]

## Sistemas e propriedades identificados

| Sistema/base | Ator(es) | Propriedades conhecidas | Lacunas |
|---|---|---|---|
| Sistema interno de controle de tramitação de processos de cooperação (nome não confirmado) | Órgão central; Coordenação do órgão central; TI/RPA do ministério | Número do processo/referência interna (chave primária de cruzamento); direção do pedido (ativo/passivo); país solicitante/solicitado; autoridade central/requerente; autoridade central de origem e de destino; tratado/instrumento aplicável (string de referência); tipo de medida solicitada (bloqueio, sequestro, confisco, repatriação — categórico ou texto livre); descrição do bem/ativo (campo livre); valor estimado (opcional, ambíguo entre face e estimativa, às vezes sem moeda); dados de pessoa física/jurídica envolvida (sensíveis); prazo/urgência; status (frequentemente inferido do histórico); histórico de andamento/estados no tempo; datas de envio e de resposta; vínculo com documentos anexos (1:N, status de conformidade por documento); vínculo com pedido complementar; vínculo com decisão judicial de origem | Nome oficial e sigla do sistema; órgão gestor; tecnologia/arquitetura; dicionário de dados e nomes reais de campos; domínios/listas de valores de "tipo de medida" e "status"; se "motivo de devolução/saneamento" existe como campo (respondentes dizem que não é estruturado); se há campo de fase do fluxo; política de identificador de caso vs. pedido; forma de acesso/API — todos [requer pesquisa adicional] |
| Sistema/módulo de controle de correspondência internacional | Órgão central; TI/RPA do ministério | Registro de correspondência com autoridade central estrangeira; data de recebimento de documento (com risco de confusão com data de processamento interno, distorcendo métrica de tempo de resposta) | Nome do módulo; se é parte do sistema de tramitação ou independente; campos reais; regra de vinculação ao pedido; tratamento de nota verbal — [requer pesquisa adicional] |
| Caixa de e-mail institucional (fonte semi-oficial) | Órgão central; Coordenação do órgão central | Correspondência com autoridades centrais estrangeiras; motivos de devolução/saneamento em texto livre; respostas e desfechos que chegam antes do lançamento formal; motivo real de caso parado; sem espelho automático no sistema (lançamento manual posterior) | Domínio/serviço de e-mail; política de retenção e arquivamento; se há qualquer indexação ou vinculação ao número do pedido; volume — [requer pesquisa adicional] |
| Planilhas de controle paralelas (prazos/SLA e criticidade) | Órgão central (equipe e coordenação) | Controle de prazo/SLA por pedido; prazos de resposta previstos em tratado (controle manual, sem alerta automático); "criticidade" de gestão (valor do ativo, prazo de prescrição, relevância institucional); "caso sensível" (sem definição formal); tempo parado por caso | Nomes de arquivos/colunas reais; local de armazenamento; responsável pela manutenção; grau de padronização entre coordenações — [requer pesquisa adicional] |
| Pipeline de parsing/extração de documentos (RPA) | TI/RPA do ministério | Campos extraídos: referência, país, autoridade, tipo de medida, descrição do bem, valor estimado, base legal/tratado, dados de pessoa, prazo/urgência, status; flag de baixa confiança por campo; reconciliação versão N ↔ versão N-1; religação pedido ↔ resposta pelo número de referência; vínculos reconstruídos: processo↔pedido, pedido↔país/autoridade, pedido↔anexos, ativo↔pessoa (texto livre, baixa confiança), pessoa↔pessoa; inconsistências tratadas por sinalização (grafia de nomes entre idiomas, câmbio por data, formato de data mês/dia vs. dia/mês, terminologia seizure/freezing/forfeiture/confiscation) | Nome da ferramenta; stack tecnológico; taxa de cobertura e acurácia; onde a flag de confiança é persistida; se existe entity resolution implementado (descrito como problema não resolvido) — [requer pesquisa adicional] |
| Gerador automático de minutas | TI/RPA do ministério; área jurídica (validação) | Geração a partir de dados já validados pela área jurídica; revisão humana obrigatória antes de assinatura/envio; validação de formato de data exigido por tratado (ex.: ISO 8601); verificação de presença (não de correção) de citação de tratado/base legal; checklist que bloqueia o fluxo até chegada da tradução | Templates existentes por tratado/país; mapeamento campo→documento; registro de nível de confiança exibido ao revisor (apontado como requisito ausente) — [requer pesquisa adicional] |
| Documentos e anexos do pedido (PDFs, formulários, traduções, affidavits) | Órgão central; autoridade central estrangeira; TI/RPA | Formulário padronizado por instrumento (ex.: formulário da Convenção de Palermo; modelo do MLAT com os EUA); tradução (às vezes juramentada), com possível divergência entre original e tradução; apostilamento/legalização consular; cópias autenticadas; affidavits/certificação (exigência mais frequente em common law); narrativa dos fatos/resumo do caso em texto livre, com variação de estilo e idioma; status de conformidade por documento; documentos de país estrangeiro em formulário mais padronizado (facilitam extração) | Lista real de formulários por tratado; onde se materializa o apostilamento como dado (campo, anexo ou selo digital — explicitamente incerto para o respondente de TI); repositório documental usado; nomenclatura de arquivos — [requer pesquisa adicional] |
| Correspondência recebida da autoridade central estrangeira (ofícios, e-mails, notas verbais) | Autoridade central estrangeira; autoridade requerida no exterior; órgão central; MRE | Número de referência estrangeiro; pedido de esclarecimento/complementação; motivo de devolução/saneamento (falta de tradução, apostilamento, dupla incriminação, formulário incompleto — sem lista fechada); exigências extras por tradição jurídica; resposta e desfecho (cumprido / recusado / sem resposta); confirmação de bloqueio no exterior; prazo estourado sem comunicação | Inexistência de interoperabilidade ou portal comum de status entre países (declarada); ausência de identificador comum entre numeração brasileira e estrangeira; estrutura formal das respostas por país; taxa de resposta real — [requer pesquisa adicional] |
| Base/repositório de acordos e tratados | Órgão central | Instrumento aplicável por pedido; exigências de forma por instrumento; prazos de resposta previstos em tratado; instrumentos citados: UNCAC, Convenção de Palermo, Convenção Interamericana contra a Corrupção (OEA), MLATs bilaterais (EUA, Portugal, Mercosul), Convenção da Apostila de Haia, reciprocidade; ENCLA como marco de política | Não confirmado se é plataforma unificada ou pasta de referência individual; ausência de base consolidada com vigência, reservas e signatários (apontada como necessidade); identificador dos instrumentos — [requer pesquisa adicional] |
| Sistema de processo eletrônico da Justiça Federal / autos digitais (como origem do pedido) | Juízo de origem; MP; órgão central (recebe via ofício) | Decisão/título que fundamenta o pedido, com data, juízo de origem, tipo de medida determinada; descrição fática da conduta; individualização do bem (CPF/CNPJ, número de conta, instituição) — frequentemente ausente e causa de saneamento; processo em segredo de justiça (restrição de acesso) | Nome do sistema não citado pelos respondentes; ausência de identificador único ligando processo de origem ao pedido internacional e ao processo no país requerido; órgão central não consulta diretamente (recebe por ofício) — [requer pesquisa adicional] |
| Sistemas internos do MP (controle de prazo/distribuição) | Ministério Público | Controle de prazo e distribuição; não realizam análise patrimonial; retorno da autoridade central chega aos autos, sem acesso a base internacional direta | Nome dos sistemas; campos; se registram status de pedido internacional — [requer pesquisa adicional] |
| Sistema de exequatur de cartas rogatórias | STJ | Papel de concessão de exequatur em cartas rogatórias, nos dois sentidos | Nome do sistema, campos, numeração, forma de vinculação ao pedido no órgão central, forma de acesso — [requer pesquisa adicional] |
| Nota verbal / correspondência diplomática | MRE (Itamaraty); órgão central | Instrumento usado quando não há tratado ou canal técnico direto; pode ter grau de sigilo próprio segundo normas do Itamaraty | Sistema de registro, numeração, metadados, prazo, forma de vinculação ao pedido — [requer pesquisa adicional] |
| Canal/rede Egmont (FIUs estrangeiras) | UIFs estrangeiras; COAF (implícito como contraparte nacional) | Citado como canal de resposta de unidades de inteligência financeira estrangeiras e como fonte externa que agregaria valor | Nenhum campo, formato, identificador de requisição, prazo ou nível de acesso descrito nas respostas — [requer pesquisa adicional] |
| Canais das redes CARIN, ARINSA, RRAG e pontos de contato de recuperação de ativos | Redes internacionais; órgão central | Descritos como canal informal/complementar ao trâmite formal, de acesso pontual, "não como base consultável"; úteis para agilizar contato | Funcionamento técnico não dominado por nenhum respondente; inexistência de registro estruturado de contatos e respostas; relação com o número do pedido formal — [requer pesquisa adicional] |
| Portal/plataforma de organismo internacional de cooperação (existência incerta) | Organismo internacional não identificado; TI/RPA | Menção a número de referência de "sistema/plataforma internacional" como possível chave de cruzamento com o sistema interno | Existência, nome, papel e forma de conexão ao pipeline explicitamente incertos para os respondentes — [requer pesquisa adicional] |
| Reuniões semanais de acompanhamento e contato informal/telefônico | Coordenação do órgão central; analistas | Reconhecidos como fonte de informação relevante sobre motivo de travamento, criticidade e peso institucional; contato informal declarado como não registrado formalmente | Conhecimento tácito sem qualquer registro estruturado; nenhuma propriedade capturável hoje — [requer pesquisa adicional] |
| Dossiê de busca patrimonial (planilhas e pastas próprias) | Área de busca patrimonial (órgão central) | Alvo; título que fundamenta a busca; bens localizados com individualização mínima; grau de confiança (confirmado/provável/hipótese); pendências; procedência de cada dado (base e data da consulta); resultado como "foto" datada | Estrutura formal de campos; ausência de retroalimentação como dado pesquisável; não há memória institucional consultável entre casos — [requer pesquisa adicional] |
| Controles de sigilo e acesso (logs, perfis, mascaramento) | TI/RPA do ministério; órgão central | Log de acesso a documentos com dado sensível; restrição de acesso por perfil (segregação entre dado bruto e status agregado); segmentação interna no órgão central (nem toda equipe acessa todos os casos); validação prévia de compartilhamento externo; mascaramento/anonimização em relatórios agregados como prática, não política formal; princípio da especialidade e confidencialidade de tratado como restrição de reuso entre casos | Implementação técnica não detalhada; política de retenção desconhecida; normas formais a validar com compliance/proteção de dados — [requer pesquisa adicional] |
