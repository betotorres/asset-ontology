# Levantamento de fontes — Movimentação financeira e capacidade econômica (recuperacao-ativos)
> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais.

## Atores considerados

**Critério de seleção.** Foram incluídos apenas atores que aparecem explicitamente nas respostas ASD (seções G1/G2 para papéis institucionais e F1/F2/F3 para sistemas e bases), e que exercem uma das seguintes funções em relação a dados de fluxo de recursos, lastro bancário ou compatibilidade renda × patrimônio: (a) **produzem/custodiam** o dado financeiro; (b) **requisitam/autorizam** o acesso (quebra de sigilo, cooperação); (c) **consomem** o dado para análise patrimonial ou fundamentação. Atores citados nas respostas mas cuja relação com esta categoria é apenas societária, registral ou de gestão física de bens foram deixados de fora (ver "Fronteiras" ao final desta seção).

Indicação de proveniência: **[H]** = respondente humano (analista de busca patrimonial do órgão central); **[S]** = respondente sintético (evidência de terceira classe, exige validação).

| Ator | Papel nesta categoria | Origem na ASD |
|---|---|---|
| **COAF / Unidade de Inteligência Financeira brasileira** | Produz relatórios de inteligência financeira; análise de movimentação suspeita | F3 [H]; G1 e F1 [S — MP]; G1 [S — assessor jurídico] |
| **Receita Federal do Brasil** | Custodia declarações de IR, dados de renda/patrimônio declarado, cadastros de PF/PJ | D2 e F1 [H]; F3 e G1 [S — MP]; F1/F3 [S — analista busca patrimonial] |
| **Instituições financeiras / custodiantes do bem** | Origem primária dos dados bancários; executam bloqueio de contas | G1 [S — analista TI]; G1 [S — cooperação internacional] |
| **Juízo criminal / autoridade judicial** | Autoriza quebra de sigilo bancário e fiscal; decreta bloqueio de contas | G1 [S — MP, cooperação, assessor jurídico]; H1 [S — MP] |
| **Ministério Público** | Requer medidas e quebras; consome relatório de inteligência financeira e dado de renda para testar alegação de origem lícita | A1/C2/D1 [S — MP] |
| **Polícia (investigação patrimonial)** | Rastreamento patrimonial e financeiro na fase investigativa | G1 [S — MP]; G1 [S — analista busca patrimonial] |
| **Órgão central (autoridade central brasileira)** | Instrui pedidos de cooperação que veiculam dados de conta/valor; consome resultado de checagem bancária | A1/B1 [H]; G1 [S — coordenador, cooperação, TI] |
| **Autoridade central / autoridade requerida estrangeira** | Executa checagem bancária e bloqueio no exterior; devolve informação sobre valores | G1/G2 [S — cooperação, coordenador, TI] |
| **FIUs estrangeiras (rede Egmont)** | Intercâmbio de inteligência financeira internacional | D2 e F3 [H]; F3 [S — MP] |
| **Administrações tributárias estrangeiras (CRS/FATCA)** | Troca automática de informações fiscais/financeiras | D2 [H] |
| **Exchanges de criptomoedas (nacionais e internacionais)** | Custodiam dados KYC e de movimentação de criptoativos | D2 e F3 [H] |
| **Órgão custodiante de vínculo de emprego e contribuição previdenciária** | Fonte de renda formal para teste de compatibilidade patrimonial — órgão não nomeado nas respostas: [requer pesquisa adicional] | F3 [S — analista busca patrimonial] |
| **Equipe de TI/automação e equipes operacionais do ministério** | Mantêm pipeline de extração, planilhas paralelas e campos de valor/moeda dos pedidos | F1/F2/F3 [S — analista TI]; F1 [S — coordenador] |

**Fronteiras registradas (não detalhadas neste levantamento):** registros de beneficiário final estrangeiros (ex.: UK Companies House) e cadastros de sanções internacionais (OFAC, listas da ONU), citados em D2 [H] no mesmo bloco de cruzamentos, mas cujo conteúdo é predominantemente societário/restritivo e não de movimentação financeira; juntas comerciais e cartórios; órgãos de gestão física de bens.

---

## Sistemas e bases por ator

### COAF / Unidade de Inteligência Financeira brasileira
- **Relatório de Inteligência Financeira (RIF)** — citado como "COAF" em F3 [H] e como "relatórios de inteligência financeira" em F1 [S — MP] e F1 [S — assessor jurídico].
  - Forma de acesso descrita: **não há consulta direta** pelo MP; o relatório chega **anexado aos autos**, já processado (F1 [S — MP]; F1 [S — assessor jurídico]).
  - Conteúdo descrito de forma qualitativa: vínculos societários e patrimoniais entre pessoas físicas e jurídicas aparecem **em prosa**, "sem formato de grafo" (B5 [S — MP]).
  - Estrutura de campos, periodicidade, identificadores e formato de entrega: [requer pesquisa adicional].
- **SIMBA** — citado nominalmente em F3 [H] como base de "dados bancários e movimentação financeira" desejada. Nenhuma descrição de campo, layout, órgão gestor ou nível de acesso foi fornecida: [requer pesquisa adicional].

### Receita Federal do Brasil
- **Declaração de Imposto de Renda / base de renda e patrimônio declarado**
  - Uso declarado: avaliar **incompatibilidade patrimonial** e testar alegação de origem lícita (F3 [S — MP]; D2 item 6 [S — MP]); "renda declarada baixa dentro desse grupo" (D1 [S — analista busca patrimonial]).
  - Propriedade concreta mencionada: existência de **declarações retificadas a posteriori** para criar lastro de capacidade financeira (C2 [S — MP]) — indica que há versionamento/data de retificação no dado de origem.
  - Classificação de sigilo percebida: base de **acesso mais restrito** entre as consultadas ("renda/declaração o mais fechado") (H1/F1 [S — analista busca patrimonial]).
  - Nomes de campo, exercício/ano-calendário, granularidade (bens e direitos, rendimentos, dívidas), formato de extração: [requer pesquisa adicional].
- **Cadastros de pessoa física e pessoa jurídica** — citados em D2 [H] como fonte a cruzar com IR; usados para amarração de identidade (CPF/CNPJ). Campos e nível de acesso nesta categoria: [requer pesquisa adicional].

### Instituições financeiras e dados bancários sob quebra de sigilo
- **Dados bancários obtidos mediante quebra de sigilo** — descritos como "consulta bancária mediante quebra de sigilo" e "bases de consulta patrimonial via ofício/sistema de interligação" (F1 [S — MP]); "checagem bancária" (C4 [S — coordenador]).
  - Atributos concretos citados como necessários para individualizar o alvo em pedido de cooperação: **número da conta, instituição financeira, titular, CPF/CNPJ** (C1 e C4 caso 1 [S — cooperação internacional]).
  - Fenômenos observáveis no dado: **depósito fracionado em conta empresarial**, movimentação em espécie, coincidência temporal entre movimentação e repasses (C4 caso 1 [S — assessor jurídico]); **ausência de rastro bancário** correspondente a recibos/notas fiscais (C2 [S — MP]); "lastro financeiro compatível" como teste (C4 caso 2 [S — assessor jurídico]).
  - Restrição estrutural: circulação limitada à **autorização judicial específica de cada quebra**, sem visão consolidada que a extrapole (H1 [S — MP]; LC 105).
  - Nome do sistema de interligação, layout de extrato, período coberto, formato de entrega: [requer pesquisa adicional].
- **Bloqueio de conta bancária no Brasil a pedido estrangeiro** — fluxo descrito em C4 [S — analista TI]: extração de "descrição da conta" e "titular" a partir de formulário estrangeiro, com ambiguidade de nome do titular. Campos do formulário: [requer pesquisa adicional].

### Vínculo de emprego e contribuição previdenciária
- Base citada apenas genericamente como desejável em F3 [S — analista busca patrimonial], no bloco de fontes para aferir renda formal.
- Órgão gestor, nome do sistema (ex.: cadastro previdenciário), campos, histórico e nível de acesso: [requer pesquisa adicional].

### Exchanges de criptomoedas (KYC)
- Citadas em D2 [H] ("dados KYC de exchanges de criptomoedas em outras jurisdições") e F3 [H] ("exchanges de criptomoedas nacionais e internacionais (KYC)").
- Contexto de uso: criptomoedas como **reserva de valor** e ativo de baixo rastro documental (C2 [H]; C1 [S — MP]; C1 [S — assessor jurídico]).
- Nenhum campo KYC, jurisdição, base legal de acesso ou mecanismo de requisição foi descrito: [requer pesquisa adicional].

### Troca automática de informações fiscais (CRS/FATCA)
- Citada em D2 [H] como fonte que exige cruzamento com dados domésticos.
- Nenhuma descrição de periodicidade, formato de arquivo, autoridade receptora no Brasil ou campos: [requer pesquisa adicional].

### FIUs estrangeiras / rede Egmont
- Citada em D2 e F3 [H]; também em F3 [S — MP] como "unidades de inteligência financeira de outros países".
- Observação de governança: uso submetido ao **princípio da especialidade** e à confidencialidade do instrumento de cooperação (H1 [S — cooperação internacional]; H1 [S — coordenador]).
- Canal técnico, formato de intercâmbio, metadados do pedido/resposta: [requer pesquisa adicional].

### Órgão central e pipeline de cooperação (dados de valor e movimentação em pedidos)
- **Sistema de tramitação de pedidos de cooperação** (nome não confirmado pelos respondentes — F1 [S — cooperação internacional]; F1 [S — coordenador]).
  - Campos relevantes a esta categoria, extraídos em B1 [S — analista TI]: **número do processo/referência** (chave de cruzamento), **país solicitante/solicitado**, **autoridade central/requerente**, **descrição do bem/ativo** (campo livre), **valor estimado** (nem sempre preenchido; ambiguidade entre valor de face e estimativa), **tipo de medida solicitada** (bloqueio, sequestro, confisco, repatriação — categórico ou texto livre), **dados de pessoa física/jurídica envolvida**, **prazo/urgência**, **status** (frequentemente inferido).
  - Problemas de qualidade registrados (F2 [S — analista TI]): **falta de padronização de moeda** (campo de valor às vezes sem indicação de moeda); **valores que variam por conversão de câmbio em datas diferentes** (C2); **ambiguidade de formato de data** (mês/dia vs. dia/mês); ausência de identificador único robusto de pessoa (duplicidade por grafia).
  - Dicionário de dados real do sistema: [requer pesquisa adicional].
- **Planilhas paralelas e controles internos** — F1 [S — coordenador]; F1 [S — cooperação]; F1 [H] ("bases próprias da equipe, planilhas"). Sem esquema conhecido: [requer pesquisa adicional].
- **E-mail institucional** — fonte "semi-oficial" onde parte do dado de desfecho e de valores chega e só depois é lançada manualmente (F1/F2 [S — cooperação]; F1 [S — analista TI]).
- **Base de taxas de câmbio históricas oficiais vinculada à data do documento** — base externa **desejada**, ainda inexistente no pipeline (F3 [S — analista TI]).

### Autos processuais como veículo indireto do dado financeiro
- **Processo eletrônico da Justiça Federal / sistema de tramitação processual** (F1 [S — MP]; F1 [S — assessor jurídico]; F1 [S — analista TI]).
  - Nesta categoria funcionam como **contêiner** do RIF, do laudo contábil e do resultado da quebra de sigilo.
  - Lacuna registrada: nexo causal, vínculos e avaliação de origem lícita alegada ficam em **texto livre**, sem campo estruturado (B5 [S — MP]; B5 [H]); documentação de origem lícita fica "solta em anexos", com cruzamento manual (B5 [S — MP]).

---

## Sistemas e propriedades identificados

| Sistema/base | Ator(es) | Propriedades conhecidas | Lacunas |
|---|---|---|---|
| Relatório de Inteligência Financeira (RIF) | COAF/UIF (produtor); MP, assessoria jurídica, polícia (consumidores) | Entregue como documento anexado aos autos, não por consulta direta; conteúdo em prosa/texto livre; descreve vínculos societários e patrimoniais entre PF e PJ; sujeito a sigilo bancário e fiscal | Estrutura de campos, formato (PDF/XML), identificador do relatório, data de referência do período analisado, granularidade das comunicações de operação suspeita, regras de acesso — [requer pesquisa adicional] |
| SIMBA | COAF/RFB/autoridade gestora (não identificada) | Citado nominalmente como base de "dados bancários e movimentação financeira"; classificado como base externa que agregaria valor, sem acesso atual detalhado | Órgão gestor, layout de arquivo, campos de extrato (data, valor, contraparte, agência/conta), período, forma de requisição e nível de acesso — [requer pesquisa adicional] |
| Dados bancários obtidos por quebra de sigilo (LC 105) | Instituições financeiras (origem); juízo (autoriza); MP, polícia, analistas (consomem) | Identificação do titular; CPF/CNPJ; número da conta; instituição financeira; evidência de depósitos fracionados, movimentação em espécie e ausência/presença de lastro para pagamentos alegados; acesso restrito ao escopo de cada autorização judicial | Layout do extrato, campos de lançamento (data, valor, histórico, contraparte, tipo de operação), moeda, período coberto, sistema de interligação usado para a consulta, forma de entrega — [requer pesquisa adicional] |
| Declaração de Imposto de Renda (renda e patrimônio declarados) | Receita Federal (custodiante); MP, analistas, assessoria jurídica (consumidores) | Usada para aferir incompatibilidade entre renda declarada e patrimônio; existência de declarações **retificadoras** posteriores (implica versão e data); base de acesso mais restrito entre as consultadas; sigilo fiscal | Nomes de campos (rendimentos, bens e direitos, dívidas), ano-calendário/exercício, chave (CPF/CNPJ), formato de extração, canal de acesso autorizado — [requer pesquisa adicional] |
| Cadastros de PF/PJ da Receita Federal (uso de capacidade econômica) | Receita Federal; analistas de busca patrimonial | Chaves CPF e CNPJ usadas para "puxar"/"bater" alvo e amarrar identidade; consulta produz resultado datado ("foto" de um dia), hoje sem registro estruturado da data de corte | Campos disponíveis nesta finalidade, distinção entre cadastro e dado de renda, sigilo aplicável, existência de histórico — [requer pesquisa adicional] |
| Base de vínculo de emprego e contribuição previdenciária | Órgão custodiante não nomeado — [requer pesquisa adicional] | Citada apenas como fonte desejada para aferir renda formal do alvo e do entorno (teste de renda incompatível de laranjas) | Nome do sistema, órgão gestor, campos (empregador, período, remuneração, competência), histórico, forma e nível de acesso — [requer pesquisa adicional] |
| KYC de exchanges de criptomoedas (nacionais e internacionais) | Exchanges (custodiantes); órgão central e autoridades estrangeiras (via cooperação) | Citado como base externa de alto valor; criptoativo tratado como reserva de valor e ativo de baixo rastro documental; para exchanges estrangeiras, acesso depende de cooperação internacional | Campos KYC (identificação, documento, endereço, contas vinculadas), dados de transação/carteira, jurisdição da exchange, base legal e canal de requisição, formato de resposta — [requer pesquisa adicional] |
| Troca automática de informações fiscais — CRS/FATCA | Administrações tributárias estrangeiras; Receita Federal (recepção presumida, não confirmada na ASD) | Citada como fonte que exige cruzamento com dados domésticos para responder a perguntas de capacidade econômica e patrimônio no exterior | Autoridade receptora no Brasil, periodicidade, formato do arquivo, campos (conta, saldo, rendimentos, jurisdição, titular/controlador), condições de uso e sigilo — [requer pesquisa adicional] |
| Canal de intercâmbio com FIUs estrangeiras (rede Egmont) | COAF/UIF brasileira; FIUs estrangeiras | Uso vinculado ao princípio da especialidade e à confidencialidade do instrumento de cooperação; citado como fonte para cruzamento internacional de movimentação | Protocolo/canal técnico, metadados de pedido e resposta (identificador, data, jurisdição, tipo de informação), restrições de uso probatório — [requer pesquisa adicional] |
| Sistema de tramitação de pedidos de cooperação (nome não confirmado) | Órgão central; autoridade central estrangeira; TI/automação do ministério | Campos: número do processo/referência; país solicitante/solicitado; autoridade central/requerente; descrição do bem/ativo (texto livre); **valor estimado** (opcional, ambíguo entre valor de face e estimativa); tipo de medida (bloqueio/sequestro/confisco/repatriação); dados de PF/PJ envolvida; prazo/urgência; status (muitas vezes inferido). Problemas conhecidos: campo de valor **sem indicação de moeda**; variação de valor por câmbio em datas distintas; **formato de data ambíguo** (mês/dia vs. dia/mês); ausência de identificador único de pessoa; ausência de campo para "motivo do vínculo" pessoa–bem | Nome oficial do sistema, dicionário de dados, tipos e domínios de cada campo, obrigatoriedade, logs de alteração de status — [requer pesquisa adicional] |
| Planilhas e controles paralelos das equipes | Órgão central (analistas, coordenação); equipe de busca patrimonial | Mantêm criticidade, prazos, valores e status que não existem no sistema formal; artesanais, sem padronização; fonte reconhecida de dado "provisório" | Esquema das planilhas, campos efetivamente preenchidos, guarda e versionamento — [requer pesquisa adicional] |
| E-mail institucional (dado financeiro e de desfecho em trânsito) | Órgão central; autoridades centrais estrangeiras | Canal onde chegam respostas com informação de valores/bloqueio, com lançamento manual posterior no sistema; documentos frequentemente sem data de recebimento clara, distorcendo métricas de tempo | Política de retenção, forma de vinculação ao caso, metadados extraíveis — [requer pesquisa adicional] |
| Base de taxas de câmbio históricas oficiais (inexistente no pipeline) | TI/automação do ministério (demandante) | Identificada como necessidade para vincular valor à data do documento e resolver divergências aparentes de valor | Fonte oficial a adotar, granularidade (diária), moedas cobertas, forma de integração — [requer pesquisa adicional] |
| Autos digitais / processo eletrônico (contêiner do dado financeiro) | Judiciário (custodiante); MP, assessoria jurídica, analistas | Veiculam RIF, laudos contábeis e resultado de quebra de sigilo como anexos; nexo causal, vínculos e avaliação de origem lícita alegada existem apenas em **texto livre**; documentação de lastro fica dispersa em anexos, com cruzamento manual; sujeitos a sigilo processual e segredo de justiça | Nome do sistema por tribunal, metadados de peça/anexo, existência de campos estruturados para valor e para status probatório, forma de extração automatizada — [requer pesquisa adicional] |

**Observações de qualidade a carregar para a etapa seguinte (registradas, não modeladas):**
- Requisito transversal levantado em H3 [S — MP]: cada informação desta categoria deveria carregar **status probatório/grau de certeza** (alegação, indício, conclusão pericial, decisão transitada em julgado).
- Requisito transversal levantado em D3/B5 [S — analista busca patrimonial] e H2 [S — analista TI]: cada consulta financeira deveria registrar **base consultada, data de corte, resultado (inclusive negativo) e nível de confiança**, hoje inexistentes.
- Restrições de sigilo aplicáveis a toda a categoria: sigilo bancário e fiscal (LC 105), sigilo processual, LGPD quanto a terceiros não investigados, e princípio da especialidade para dados obtidos por cooperação internacional.
