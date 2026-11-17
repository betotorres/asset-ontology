# Escopo e requisitos — recuperacao-ativos

> Composição das fontes desta compilação: 1 resposta de respondente humano, 6 respostas de respondente sintético (agente LLM) e 0 respostas de origem não declarada. Itens sustentados exclusivamente por respostas sintéticas estão marcados como tal e requerem validação humana antes de virar lastro de modelagem.

## Campo de aplicação e escopo

O domínio tratado é a **recuperação de ativos** — o conjunto de práticas de rastreamento patrimonial (também chamado de "busca patrimonial", usado como sinônimo), constrição, perdimento, cooperação jurídica internacional em matéria patrimonial e destinação de bens vinculados a ilícitos, com foco na atuação do órgão central e de seus interlocutores no sistema de justiça.

A ontologia deve endereçar, no mínimo:

- **Ativos e sua titularidade**: bens móveis e imóveis, veículos, embarcações, aeronaves, participações societárias, valores financeiros, criptoativos, bens de alto valor agregado (joias, obras de arte), com distinção explícita entre **titularidade formal** e **titularidade de fato / beneficiário final**.
- **Pessoas e organizações**: pessoas físicas, empresas, holdings, empresas de fachada, trusts e offshores, organizações criminosas, interpostas pessoas ("laranjas"), parentes, amigos e pessoas próximas, sócios ocultos.
- **Cadeias de ocultação**: representação de cadeias de interposição com múltiplos elos (condenado ↔ interposta pessoa ↔ interposta pessoa ↔ … ↔ ativo), camadas societárias sucessivas, e não apenas vínculos binários.
- **Medidas e efeitos jurídicos sobre o bem**: medida assecuratória (gênero), sequestro, arresto, hipoteca legal, bloqueio, indisponibilidade, perdimento, alienação antecipada e destinação final — com desambiguação dos termos polissêmicos ("bloqueio", "sequestro", "arresto" possuem sentido patrimonial específico neste domínio e outros sentidos fora dele).
- **Cooperação jurídica internacional**: pedido de cooperação (ativo e passivo), auxílio direto, carta rogatória, autoridade central brasileira e estrangeira, tratados e convenções aplicáveis, requisitos formais (tradução, apostilamento, legalização), marcos de tramitação, repatriação e repartição de ativos.
- **Tipificação penal e enquadramento legal**: o respondente humano considera que a tipologia criminal das leis brasileiras de recuperação de ativos (por exemplo, a Lei Raul Jungmann) e de legislações estrangeiras **deve** entrar no escopo. Há divergência relevante: os perfis jurídicos e de TI (sintéticos) sugerem manter a dogmática da tipificação penal **fora** do escopo, tratando-a como domínio conexo consumido como insumo. Essa divergência deve ser resolvida com especialistas reais.
- **Fora do escopo nesta fase (convergência entre humano e sintéticos)**: gestão física, guarda, custódia, avaliação operacional e leilão do bem após o perdimento; execução material da transferência de valores. A **destinação final** (fundo, vítima, erário, partilha internacional) é fronteiriça: o perfil de assessoria jurídica e o de MP/magistratura (sintéticos) defendem incluí-la como desfecho lógico, ainda que sem detalhar o "como".
- **Qualidade epistêmica da informação**: o modelo deve distinguir dado cadastral de inferência analítica, registrar procedência (base, data da consulta) e grau de confiança/status probatório de cada vínculo afirmado.

O formato de resposta esperado é predominantemente **rede de vínculos (grafo)**, complementado por linhas do tempo, tabelas filtráveis, fichas de ativo e painéis gerenciais. Na prática, a maior parte das fontes chega como documento de texto, imagem e tabela não estruturados, sendo processada por NER e LLMs para alimentar um knowledge graph.

## Usuários-alvo

- **Analista de busca patrimonial / inteligência patrimonial (órgão central)** — perfil nuclear e única fonte humana desta base. Lê autos, extrai indício patrimonial, define alvos de consulta, cruza cadastros nacionais e estrangeiros, reconstrói cadeias de interposição e entrega dossiê com o que foi localizado, grau de confiança e pendências.
- **Analista de cooperação jurídica internacional (órgão central)** — instrui, monta e acompanha pedidos de cooperação; verifica completude documental, tradução, apostilamento e tratado aplicável; monitora prazos e saneamentos. [lastro apenas sintético — requer validação humana]
- **Equipe jurídica do órgão central e assessoria jurídica em perdimento e destinação** — analisa decisões judiciais, identifica fundamento legal específico por bem, reconstitui cadeia de sub-rogação e subsidia decisões sobre destinação. Confirmado como usuário adicional pelo respondente humano; o detalhamento das tarefas de perdimento/destinação é sintético.
- **Coordenador/gestor de carteira do órgão central e direção do departamento** — usa visão agregada da carteira para priorizar casos, detectar estoque parado, escalonar cobranças e sustentar articulação institucional e diplomática. [lastro apenas sintético — requer validação humana]
- **Membros do Ministério Público e da magistratura** — fundamentam pedidos de medida cautelar, perdimento e decisões em incidentes de restituição; identificam sobreposição de investigados, laranjas e bens entre processos. [lastro apenas sintético — requer validação humana]
- **Outros analistas de inteligência e equipes de investigação patrimonial (incl. polícia judiciária)** — consumidores do grafo para robustecer inquéritos e dossiês.
- **Analista de TI/dados e automação (RPA)** — usa o modelo para parsing de documentos, entity resolution, geração assistida de minutas e indicadores de saúde do processo. [lastro apenas sintético — requer validação humana]
- **Autoridades centrais estrangeiras, órgãos de controle e defesa técnica** — beneficiários indiretos, com acesso filtrado, respeitando sigilo, especialidade e contraditório. [lastro apenas sintético — requer validação humana]

## Requisitos

| Id | Requisito |
|---|---|
| R1 | Representar ativos de tipos heterogêneos: bens imóveis, veículos, embarcações, aeronaves, participações societárias, valores e contas financeiras, criptoativos, propriedade intelectual e bens de alto valor agregado. |
| R2 | Atribuir a cada ativo um identificador único, estável e persistente ao longo de todo o ciclo de vida e entre processos, órgãos e jurisdições, suprindo a lacuna atual de ausência de identificador de ativo. |
| R3 | Distinguir explicitamente titularidade formal, titularidade de fato e beneficiário final de um ativo, permitindo que coexistam e divirjam. |
| R4 | Representar interposta pessoa ("laranja", "testa de ferro", "nome frio") como papel assumido por pessoa física ou jurídica em relação a um ativo e a um investigado/condenado. |
| R5 | Representar cadeias de interposição com número arbitrário de elos (condenado → interposta pessoa → … → ativo), não apenas vínculos binários. |
| R6 | Representar cadeias societárias em múltiplas camadas (holdings sucessivas, empresas de fachada, offshores, trusts) navegáveis do ativo até o beneficiário final. |
| R7 | Representar a figura do sócio oculto e a aquisição de participação societária como mecanismo de repasse dissimulado de vantagem indevida. |
| R8 | Representar vínculos de parentesco, afinidade, amizade e proximidade funcional entre pessoas, com tipo, origem e período de vigência. |
| R9 | Desambiguar os termos polissêmicos "bloqueio", "sequestro" e "arresto", fixando seu sentido patrimonial neste domínio e separando-o de sentidos externos (p.ex. sequestro de pessoa). |
| R10 | Registrar "rastreamento de ativos" e "busca patrimonial" como sinônimos do mesmo conceito. |
| R11 | Representar o vínculo entre ativo específico e a condenação/fato criminoso correspondente (nexo causal), hoje disperso em texto livre. |
| R12 | Registrar o valor do ativo com histórico ao longo do tempo (valor declarado, venal, estimado, atualizado), com data de referência de cada valoração. |
| R13 | Incluir no escopo a tipificação penal e a tipologia criminal das leis brasileiras de recuperação de ativos (p.ex. Lei Raul Jungmann) e de legislações estrangeiras. |
| R14 | Manter fora do escopo desta fase a gestão física, a guarda, a custódia e o leilão do bem após o perdimento. |
| R15 | Modelar medida assecuratória como gênero, com as espécies sequestro, arresto, hipoteca legal, bloqueio e indisponibilidade, cada uma com seus requisitos e regime jurídico distintos. [lastro apenas sintético — requer validação humana] |
| R16 | Representar perdimento sempre vinculado ao marco normativo específico invocado (penal, improbidade, lavagem, cooperação internacional), evitando tratá-lo como categoria única. [lastro apenas sintético — requer validação humana] |
| R17 | Representar as figuras de produto do crime, proveito do crime, bem sub-rogado e confisco alargado/extensivo. [lastro apenas sintético — requer validação humana] |
| R18 | Representar a cadeia de sub-rogação de um ativo (bem originário → conversões sucessivas → forma atual), com data e valor de cada conversão. [lastro apenas sintético — requer validação humana] |
| R19 | Representar a alegação de terceiro de boa-fé e o incidente de restituição, com status próprio (pendente, instância, deferida, indeferida). [lastro apenas sintético — requer validação humana] |
| R20 | Manter histórico consolidado de todas as decisões incidentes sobre um mesmo ativo ao longo do processo, com link à peça correspondente. [lastro apenas sintético — requer validação humana] |
| R21 | Representar o status atual do ativo no ciclo constrição provisória → perdimento definitivo → destinação em curso → destinação concluída. [lastro apenas sintético — requer validação humana] |
| R22 | Incluir a destinação final do bem (fundo, vítima, erário, ente federativo, partilha internacional) como ponta de saída do modelo, sem detalhar sua execução material. [lastro apenas sintético — requer validação humana] |
| R23 | Representar pedido de cooperação jurídica internacional como entidade própria, distinguindo pedido ativo e passivo. |
| R24 | Representar autoridade central (brasileira e estrangeira) e autoridade requisitante/requerida como papéis distintos, reconhecendo que o papel de autoridade central não é padronizado internacionalmente. [lastro apenas sintético — requer validação humana] |
| R25 | Distinguir auxílio direto e carta rogatória, com o instrumento/tratado aplicável determinando a via cabível. [lastro apenas sintético — requer validação humana] |
| R26 | Vincular cada pedido de cooperação ao tratado, convenção ou base de reciprocidade aplicável e ao dispositivo invocado. |
| R27 | Representar os marcos externamente visíveis do fluxo de cooperação (pedido formulado, saneamento, complementação, resposta recebida, bloqueio confirmado, repatriação), sem modelar a caixa-preta interna da tramitação estrangeira. [lastro apenas sintético — requer validação humana] |
| R28 | Estruturar o motivo de devolução/saneamento de pedido em lista categorizada (falta de tradução, ausência de apostilamento, dupla incriminação, formulário incompleto, individualização insuficiente do bem, entre outros). [lastro apenas sintético — requer validação humana] |
| R29 | Representar requisitos formais transnacionais como atributos verificáveis: tradução juramentada, apostilamento/legalização, formato de data, cópia autenticada, affidavit. [lastro apenas sintético — requer validação humana] |
| R30 | Amarrar múltiplos pedidos de cooperação paralelos, em países distintos, a um mesmo caso/decisão de origem, evitando fragmentação da visão de caso. [lastro apenas sintético — requer validação humana] |
| R31 | Registrar dupla incriminação e demais pressupostos de admissibilidade como condição avaliável do pedido. [lastro apenas sintético — requer validação humana] |
| R32 | Mapear a correspondência (e a não-equivalência) entre termos estrangeiros — freezing, seizure, restraint order, forfeiture, confiscation — e as categorias brasileiras de bloqueio, sequestro, arresto e perdimento. [lastro apenas sintético — requer validação humana] |
| R33 | Suportar consultas de cruzamento entre pessoas condenadas e quadros societários (empresas com sócios em comum com condenados). |
| R34 | Suportar consultas sobre aquisição de ativos de alto valor em espécie por parentes ou pessoas próximas a investigados. |
| R35 | Suportar o rastreamento do fluxo financeiro ("seguir o dinheiro") através de pessoas jurídicas interpostas. |
| R36 | Suportar a identificação de bens de alto valor agregado relacionados a condenados com perdimento de bens decretado. |
| R37 | Suportar a identificação de possíveis intermediários e interpostas pessoas a partir de vínculos de parentesco, amizade e proximidade funcional. |
| R38 | Prever integração ou consumo de dados da Receita Federal (pessoas físicas e jurídicas, declaração de renda e patrimônio) para avaliação de incompatibilidade patrimonial. |
| R39 | Prever integração com registros de imóveis (incluindo CNIB) e de tabelionatos/escrituras e procurações (CENSEC). |
| R40 | Prever integração com bases de veículos (RENAJUD/DENATRAN), embarcações (Capitania dos Portos/Marinha), aeronaves (ANAC/RAB) e propriedade intelectual (INPI). |
| R41 | Prever integração com dados bancários e de movimentação financeira (COAF/SIMBA) sob autorização judicial específica. |
| R42 | Prever consumo de registros estrangeiros de beneficiário final (p.ex. UK Companies House e registros de jurisdições de baixa tributação). |
| R43 | Prever consumo de informações de Unidades de Inteligência Financeira estrangeiras via rede Egmont e de troca automática de informações fiscais (CRS/FATCA). |
| R44 | Prever consumo de cadastros de sanções internacionais (OFAC, listas da ONU). |
| R45 | Prever consumo de dados KYC de exchanges de criptomoedas nacionais e internacionais. |
| R46 | Representar os instrumentos e redes do arcabouço transnacional: ENCLA, UNCAC, Convenção de Palermo, Convenção Interamericana contra a Corrupção (OEA), MLATs bilaterais e as redes CARIN, ARINSA e RRAG. |
| R47 | Entregar respostas no formato de rede de vínculos (grafo) como formato primário, com nós de pessoas, empresas e bens e arestas tipadas. |
| R48 | Suportar a ingestão de fontes não estruturadas (documentos de texto, imagens, tabelas) via NER e LLMs, com persistência das entidades, propriedades e vínculos extraídos em knowledge graph. |
| R49 | Associar a cada vínculo e a cada afirmação um atributo explícito de grau de confiança e de status probatório (alegação, indício, conclusão pericial, decisão transitada em julgado). [lastro apenas sintético — requer validação humana] |
| R50 | Registrar a procedência de toda informação entregue (base consultada, data da consulta, processo, peça), permitindo uso seguro em fundamentação. [lastro apenas sintético — requer validação humana] |
| R51 | Persistir cada resultado de consulta como "foto" datada e não sobrescrita, permitindo comparação entre consultas sucessivas. [lastro apenas sintético — requer validação humana] |
| R52 | Registrar de forma estruturada a negativa de consulta e a hipótese verificada e afastada, evitando retrabalho e impedindo que ausência de resultado seja lida como ausência de patrimônio. [lastro apenas sintético — requer validação humana] |
| R53 | Tratar entity resolution de pessoas, empresas e bens como problema de primeira classe, com grau de certeza da amarração de identidade (por documento, por nome + data de nascimento, por nome + município). [lastro apenas sintético — requer validação humana] |
| R54 | Registrar o "porquê" do vínculo (motivo/raciocínio que sustenta a atribuição entre pessoa e bem), hoje inexistente como campo estruturado. [lastro apenas sintético — requer validação humana] |
| R55 | Sinalizar automaticamente quando um mesmo nome, entidade ou bem já apareceu em casos ou processos anteriores, inclusive em varas, esferas ou jurisdições diferentes. [lastro apenas sintético — requer validação humana] |
| R56 | Suportar consultas gerenciais de carteira: casos parados há mais de X tempo, casos próximos de prazo prescricional, distribuição por fase do fluxo, tempo médio de resposta por país e taxa de sucesso por país/tratado. [lastro apenas sintético — requer validação humana] |
| R57 | Representar criticidade/priorização e sensibilidade institucional de um caso como atributos estruturados, hoje apenas tácitos. [lastro apenas sintético — requer validação humana] |
| R58 | Registrar o motivo pelo qual um caso está parado, em categoria estruturada. [lastro apenas sintético — requer validação humana] |
| R59 | Suportar entrega de resultados em múltiplos formatos conforme a pergunta: grafo, linha do tempo, tabela filtrável, ficha individual de ativo, painel agregado e alerta acionável. [lastro apenas sintético — requer validação humana] |
| R60 | Permitir navegação do agregado até o caso, processo ou ativo individual em qualquer visão gerencial. [lastro apenas sintético — requer validação humana] |
| R61 | Observar as restrições padrão de sigilo aplicáveis a dados de governo: LGPD, sigilo fiscal, bancário, telemático e processual. |
| R62 | Implementar segmentação de acesso por perfil e por processo, respeitando segredo de justiça e a autorização judicial específica de cada quebra de sigilo. [lastro apenas sintético — requer validação humana] |
| R63 | Observar o princípio da especialidade e as cláusulas de confidencialidade dos tratados de cooperação ao cruzar dados entre casos. [lastro apenas sintético — requer validação humana] |
| R64 | Aplicar cuidado reforçado com dados pessoais de terceiros não investigados (parentes, sócios, terceiros de boa-fé), com finalidade e proporcionalidade declaradas. [lastro apenas sintético — requer validação humana] |
| R65 | Manter rastro de auditoria de quem consultou o quê, quando, em qual base e vinculado a qual caso e título. [lastro apenas sintético — requer validação humana] |
| R66 | Vincular toda consulta a um título (sentença, acórdão, decisão de bloqueio) que lhe dê legitimidade. [lastro apenas sintético — requer validação humana] |
| R67 | Garantir que o modelo permita rastrear bens ocultados partindo do condenado e percorrendo os nós intermediários até o bem final — critério de sucesso declarado pelo respondente humano. |
| R68 | Mitigar o risco de erro de identificação de titularidade, tratado como principal preocupação do domínio. |
| R69 | Não promover a estruturação automática como substituta da análise humana: extração automática de cadeia de sub-rogação, status e fundamento legal exige validação por profissional do direito. [lastro apenas sintético — requer validação humana] |
| R70 | Sinalizar visivelmente ao revisor humano qualquer dado de baixa confiança utilizado na geração de minutas ou relatórios automatizados. [lastro apenas sintético — requer validação humana] |
| R71 | Suportar registro de indícios (p.ex. padrão de laranja, incompatibilidade patrimonial) como sinalização a investigar, nunca como conclusão automática de culpa, preservando presunção de inocência e contraditório. [lastro apenas sintético — requer validação humana] |
| R72 | Permitir correção e marcação de hipóteses afastadas, evitando a sobrevida de dado errado como fato permanente. [lastro apenas sintético — requer validação humana] |
| R73 | Registrar padronização de moeda e taxa de câmbio histórica vinculada à data do documento para valores em jurisdições distintas. [lastro apenas sintético — requer validação humana] |
| R74 | Registrar a data de recebimento de documentos de forma distinta da data de processamento interno, para não distorcer métricas de tempo de resposta. [lastro apenas sintético — requer validação humana] |

## Tabela de comportamentos do domínio

| Id | Descrição do comportamento |
|---|---|
| B1 | Aquisição de ativos em nome de terceiros (parentes, amigos, pessoas próximas, funcionários de confiança) para ocultar a real propriedade. |
| B2 | Uso de empresas de fachada que não operam de fato, mas emitem notas fiscais e simulam faturamento. |
| B3 | Celebração de contratos simulados, sem prestação real de serviço, mas com pagamento formal correspondente. |
| B4 | Constituição de múltiplas camadas societárias e encadeamento de várias pessoas interpostas em sequência para afastar o beneficiário final do ativo. |
| B5 | Constituição de holdings nacionais ou estrangeiras para deter e ocultar patrimônio. |
| B6 | Existência de sócio oculto em empresa proprietária do ativo, com aquisição societária usada como veículo de repasse dissimulado de vantagem indevida. |
| B7 | Aquisição de imóveis de alto valor sem registro formal (contrato de gaveta), mantendo posse e uso sem titularidade. |
| B8 | Superfaturamento ou subdeclaração em operação imobiliária para distorcer a expressão econômica do ativo. |
| B9 | Compra de bens de alto valor em dinheiro (espécie), reduzindo o rastro documental. |
| B10 | Conversão do proveito em ativos de difícil rastreamento: criptomoedas, joias, obras de arte e outros bens de alto valor agregado usados como reserva de valor. |
| B11 | Transferência de ativos e remessa de recursos para o exterior, inclusive por meio de trusts e offshores. |
| B12 | Pulverização do patrimônio em múltiplos bens menores e em múltiplas jurisdições. [lastro apenas sintético — requer validação humana] |
| B13 | Reinvestimento do proveito do crime em atividade econômica aparentemente lícita. [lastro apenas sintético — requer validação humana] |
| B14 | Conversão sucessiva do bem originário em outros bens (sub-rogação), mantendo o valor e alterando a forma. [lastro apenas sintético — requer validação humana] |
| B15 | Transferência de ativos com timing coincidente com marcos da investigação ou do processo (corrida na janela entre a decisão e a constrição efetivada). [lastro apenas sintético — requer validação humana] |
| B16 | Apresentação de contratos com data retroativa ou "de gaveta" após a constrição, com datação controvertida. [lastro apenas sintético — requer validação humana] |
| B17 | Fabricação de terceiro de boa-fé: transferência a pessoa de confiança após indício de investigação, seguida de alegação de desconhecimento da origem ilícita. [lastro apenas sintético — requer validação humana] |
| B18 | Retificação posterior de declarações de renda para criar lastro artificial de capacidade financeira. [lastro apenas sintético — requer validação humana] |
| B19 | Mudança de versão da defesa sobre a origem lícita do bem ao longo do processo, com versões mutuamente incompatíveis. [lastro apenas sintético — requer validação humana] |
| B20 | Apresentação de recibos e notas fiscais genéricas sem lastro bancário correspondente. [lastro apenas sintético — requer validação humana] |
| B21 | Oneração proposital do bem (alienação fiduciária, hipoteca, ônus averbado) para diluir a aparência de valor disponível. [lastro apenas sintético — requer validação humana] |
| B22 | Uso de ação judicial nova entre partes ligadas, ou acordo homologado, para transferir a titularidade do bem. [lastro apenas sintético — requer validação humana] |
| B23 | Separação conjugal suspeita em que o ex-cônjuge fica com o patrimônio de maior valor. [lastro apenas sintético — requer validação humana] |
| B24 | Reorganização societária realizada após a instauração do caso, alterando quadro societário e titularidade de ativos. [lastro apenas sintético — requer validação humana] |
| B25 | Titularidade de imóveis de alto valor por pessoa com renda declarada incompatível ou idade incompatível. [lastro apenas sintético — requer validação humana] |
| B26 | Repetição do mesmo endereço declarado entre alvo, interpostas pessoas e bens, funcionando como amarrador de vínculos. [lastro apenas sintético — requer validação humana] |
| B27 | Aquisição de bens fora do domicílio do alvo e concentração de bens de um mesmo titular em um mesmo entorno geográfico. [lastro apenas sintético — requer validação humana] |
| B28 | Recorrência do mesmo titular como interposta pessoa em casos e processos distintos. [lastro apenas sintético — requer validação humana] |
| B29 | Depuração progressiva da constrição ao longo do processo: medida assecuratória inicial ampla e genérica que vai sendo especificada até a consolidação do perdimento após o trânsito em julgado. [lastro apenas sintético — requer validação humana] |
| B30 | Ocorrência de gap temporal frequente entre o perdimento declarado e a destinação efetiva do bem. [lastro apenas sintético — requer validação humana] |
| B31 | Constrição do mesmo bem por juízos diferentes, em processos de esferas ou estados distintos, sem comunicação entre eles, descoberta por acaso. [lastro apenas sintético — requer validação humana] |
| B32 | Devolução de pedido de cooperação para saneamento por falta de tradução completa, ausência de apostilamento/legalização, individualização insuficiente do bem ou ausência de descrição fática da conduta. [lastro apenas sintético — requer validação humana] |
| B33 | Confusão, já na origem do pedido, entre auxílio direto e carta rogatória, com reclassificação da via processual no meio do trâmite. [lastro apenas sintético — requer validação humana] |
| B34 | Substituição do instrumento jurídico aplicável durante o trâmite (tratado bilateral genérico substituído por convenção multilateral específica), obrigando a reformulação do pedido. [lastro apenas sintético — requer validação humana] |
| B35 | Loops de complementação e reconciliação de versões de um mesmo pedido, com respostas que retornam meses depois e precisam ser religadas ao pedido original pelo número de referência. [lastro apenas sintético — requer validação humana] |
| B36 | Variação de exigências formais por país e por tradição jurídica (common law mais rigoroso com certificação e affidavits; civil law mais tolerante a cópia autenticada e tradução juramentada). [lastro apenas sintético — requer validação humana] |
| B37 | Casos com ativo pulverizado em múltiplas jurisdições apresentam maior complexidade, mais escalonamentos e ciclos mais longos; ativos financeiros têm ciclo de bloqueio mais rápido que ativos físicos ou societários. [lastro apenas sintético — requer validação humana] |
| B38 | Casos mudam subitamente de prioridade por pressão externa (cobrança de autoridade, repercussão midiática), sem que essa criticidade fique registrada em sistema. [lastro apenas sintético — requer validação humana] |
| B39 | Caso classificado como simples torna-se complexo ao se descobrir estrutura societária, terceiro de boa-fé ou transferência do ativo para outra jurisdição antes do bloqueio, exigindo recalibragem de prioridade e prazo. [lastro apenas sintético — requer validação humana] |
| B40 | Divergência de grafia de nomes entre idiomas e traduções, e variação de qualificação da pessoa entre jurisdições, produzindo registros duplicados e amarração de identidade frágil. [lastro apenas sintético — requer validação humana] |
| B41 | Valores que aparentam divergir entre documentos por serem conversões cambiais em datas diferentes, e ambiguidade de formato de data entre padrões nacionais. [lastro apenas sintético — requer validação humana] |
| B42 | Chegada do resultado da consulta como "foto" de um dia específico, cuja comparação entre fotos datadas é a única forma de perceber transferências posteriores do bem. [lastro apenas sintético — requer validação humana] |
| B43 | Cobertura registral desigual entre regiões e comarcas, de modo que a ausência de resultado não equivale à inexistência do bem. [lastro apenas sintético — requer validação humana] |
| B44 | Desfecho de pedidos e informações relevantes chegando por canal informal (e-mail, telefone) sem lançamento tempestivo no sistema formal, gerando desatualização de status. [lastro apenas sintético — requer validação humana] |
| B45 | Registro de conceitos-chave apenas em texto livre e disperso: cadeia de titularidade dissimulada, nexo entre ativo e condenação, e valor atualizado do bem ao longo do tempo. |
