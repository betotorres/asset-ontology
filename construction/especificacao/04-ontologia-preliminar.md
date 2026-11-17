# Ontologia preliminar — recuperacao-ativos
> Consolidada a partir da DKC. 81 classes e 165 relações mantidas (290 descartadas na revisão, 108 adicionadas manualmente).

## Classes

### Aeronave
Especialização de ativo para aeronaves.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens.
Justificativa: Classe recorrente nas categorias de ativos e registros.

**Atributos:**
- marcaDeNacionalidadeEMatricula — identificação registral da aeronave [requer pesquisa adicional]

### AlegacaoDeTerceiroDeBoaFe
Alegação de terceiro que sustenta boa-fé em relação ao ativo ou à medida.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Classe recorrente em constrição, gestão e processo.

**Atributos:**
- dataDaAlegacao — data da alegação
- efeitoSobreDestinacao — efeito sobre pendência ou destinação
- status — pendente, resolvida ou julgada

### AlienacaoAntecipada
Alienação do ativo antes da conclusão definitiva do fluxo ordinário.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias de constrição e valoração.

**Atributos:**
- dataDaAlienacao — data da alienação
- motivacao — deterioração, desvalorização ou custo de manutenção
- valorApurado — valor apurado [requer pesquisa adicional]

### AnaliseDeCompatibilidadeEconomica
Avaliação da compatibilidade entre renda, patrimônio, movimentação e lastro alegado.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de TesteDeCompatibilidadePatrimonial e AnáliseDeCompatibilidadeEconômica.

**Atributos:**
- dataBase — data-base da análise
- rendaConsiderada — renda considerada na análise
- resultado — compatível ou incompatível

### AreaDeExecucaoOperacional
Área responsável por materializar a destinação decidida para o ativo.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos.
Justificativa: Classe explicitamente modelada na categoria de constrição e destinação.

**Atributos:**
- atribuicao — execução material da destinação

### AssercaoDeTitularidade
Afirmação reificada de titularidade de pessoa sobre ativo.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens.
Justificativa: Fusão de TitularidadeDeBem e AsserçãoDeTitularidade.

**Atributos:**
- dataDaTransmissao — data da transmissão
- tipoDeTitularidade — formal, indireta ou outra forma capturada
- valorDeclarado — valor declarado na transmissão

### Ativo
Bem ou ativo patrimonial sujeito a identificação, titularidade, valoração, constrição, perdimento ou destinação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de Ativo, Bem, AtivoPatrimonial, AtivoOuBem e BemSujeitoAMedida por equivalência conceitual.

**Atributos:**
- descricaoDoAtivo — descrição ou individualização do ativo
- identificadorDoAtivo — identificador único e persistente, inexistente hoje [requer pesquisa adicional]
- jurisdicaoOuLocalizacao — localização ou jurisdição do ativo
- nexoCausal — nexo entre o ativo e fato investigado, hoje predominantemente textual
- situacaoJuridica — situação de constrição, perdimento ou destinação
- tipoDeAtivo — Tipo do bem ou ativo — usar apenas quando não houver uma subclasse específica já associada (ex.: Aeronave, Veículo, BemImóvel, AtivoFinanceiro, AtivoDePropriedadeIntelectual, Criptoativo).

### AtivoDePropriedadeIntelectual
Especialização de ativo para direitos de propriedade intelectual.
Consolidada a partir de: registro-e-titularidade-de-bens.
Justificativa: Classe explicitamente modelada na categoria registral.

**Atributos:**
- identificadorDoRegistro — identificador do processo ou registro [requer pesquisa adicional]
- tipoDeAtivo — marca, patente ou desenho [requer pesquisa adicional]

### AtivoFinanceiro
Especialização de ativo para recursos ou instrumentos financeiros.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos.
Justificativa: Classe explicitamente modelada na DKC.

### AtoNotarial
Ato notarial relacionado a pessoas, representação, titularidade ou transmissão de bens.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias societária, registral e de valoração.

**Atributos:**
- dataDoAto — data do ato
- retornoDaConsulta — teor ou apenas indicação de existência [requer pesquisa adicional]
- tipoDeAto — escritura, procuração ou outro ato

### AtoRegistral
Ato de registro, transmissão ou averbação relacionado a bem.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias registral e de valoração.

**Atributos:**
- dataDoAto — data do ato
- naturezaDoAto — natureza do ato
- valorDeclarado — valor declarado no ato

### AtorInstitucional
Órgão, organização ou unidade que atua na produção, custódia, decisão ou consumo de informação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das superclasses AutoridadeCompetente, OrganizaçãoParticipante, OrganizaçãoInstitucional e ÓrgãoOuAtorProcessual.

**Atributos:**
- denominacao — denominação do órgão ou unidade
- jurisdicao — jurisdição ou esfera de atuação
- papelNoFluxo — papel desempenhado no fluxo
- tipoDeAtor — tipo institucional

### AutoridadeCentral
Autoridade central nacional ou estrangeira responsável pela tramitação ou intermediação da cooperação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das denominações equivalentes de autoridade central.

**Atributos:**
- canalDeComunicacao — canal de comunicação utilizado
- competencia — competência de tramitação e cooperação
- papelNoPedido — requerente, requerida ou intermediadora
- tipoDeInstituicao — natureza institucional

### AutoridadeDecisoriaSobreDestinacao
Instância administrativa ou colegiada responsável por decidir destinação de ativos.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho.
Justificativa: Classe recorrente nas categorias de constrição e gestão.

**Atributos:**
- naturezaDaInstancia — natureza da instância decisória

### AvaliacaoPatrimonial
Avaliação que atribui valor a ativo em determinada data, moeda, tipo e fonte.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias patrimonial, gerencial e de valoração.

**Atributos:**
- controleDeReavaliacao — controle de reavaliação inexistente nas fontes atuais

### BemImovel
Especialização de ativo para bens imóveis e seus elementos cadastrais e registrais.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias patrimonial, registral e de valoração.

**Atributos:**
- numeroDaMatricula — identificação da matrícula imobiliária
- valorCadastral — valor cadastral ou venal disponível

### BemMovel
Bem físico móvel e registrável (em contraste com BemImovel) — categoria consolidada na revisão a partir da recorrência do mesmo padrão em Veículo, Aeronave e Embarcação: todos têm registro público e histórico de transferência de titularidade. Distinção de bens móveis/imóveis é conhecimento jurídico comum (Código Civil), usada aqui para evitar repetir a mesma relação em cada subclasse.
*(adicionado manualmente na revisão)*

### CodigoPostal
[adicionado na revisão humana, sem lastro em DKC] Código postal associado a um endereço. Nenhuma categoria da DKC do domínio recuperacao-ativos capturou código postal, CEP, ZIP ou UF — a classe existe por decisão do revisor, não por evidência de captura. Estrutura livre por país (CEP no Brasil, ZIP nos EUA, postcode no Reino Unido etc.), portanto sem formato fixo.
*(adicionado manualmente na revisão)*

**Atributos:**
- codigo — [sem lastro em DKC] Valor do código postal em texto livre — formato varia por país, não decomposto. *(adicionado manualmente na revisão)*
- estado — [sem lastro em DKC] Estado/UF em texto livre. Nenhuma captura no domínio corresponde a unidade federativa — os únicos achados com "estado" no nome (PessoaFísica.estadoCivil, EventoDeTramitacao.estadoResultante) são estado civil e estado de tramitação, sem relação com UF. *(adicionado manualmente na revisão)*
- municipio — Município. Diferente de código/país/estado, este campo TEM lastro real: capturado independentemente em BemImovel.municipio e MatriculaImobiliaria.municipio. A colocação dele dentro de CodigoPostal (em vez de direto em Endereco) é escolha estrutural do revisor, feita a pedido do usuário — o dado em si não é inventado, só o contêiner que o abriga aqui. *(adicionado manualmente na revisão)*
- pais — [sem lastro em DKC] País a que o código postal se refere, em texto livre. Não vinculado à classe Jurisdição existente porque ela modela jurisdição de cooperação jurídica (solicitante/solicitada), um conceito distinto de país de um endereço postal. *(adicionado manualmente na revisão)*

### ContaBancaria
Conta financeira associada a titular e instituição custodiante.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica.
Justificativa: Classe explicitamente modelada na categoria financeira.

**Atributos:**
- agencia — agência [requer pesquisa adicional]
- numeroDaConta — número da conta

### Contrato
[adicionado no EOA — iteração à DKD a partir de lacuna externa mantida no ORR] Acordo voluntário e juridicamente vinculante entre partes competentes, com contraprestação, objeto, datas e jurisdição aplicável; contratos simulados são veículo típico de ocultação. Origem: FIBO contract (has contract party, has beneficiary, has execution date, has effective date, has governing jurisdiction, is evidenced by) e FollowTheMoney Contract (title; amount e currency herdados de Asset) — o Contract do FTM é contrato de licitação pública, caso particular deste conceito.
*(adicionado manualmente na revisão)*

**Atributos:**
- dataDeExecucao — Data de assinatura por todas as partes (FIBO has execution date). *(adicionado manualmente na revisão)*
- dataDeVigencia — Data em que entra em vigor (FIBO has effective date). *(adicionado manualmente na revisão)*
- identificadorDoContrato — Identificador do contrato (FTM Contract.contractId). *(adicionado manualmente na revisão)*
- objeto — Objeto ou título do contrato (FTM Contract.title). *(adicionado manualmente na revisão)*

### Correspondencia
Comunicação do fluxo, como e-mail, ofício ou nota verbal.
Consolidada a partir de: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Fusão de Correspondência, CorrespondênciaInternacional e ComunicaçãoOficial.

**Atributos:**
- conteudo — conteúdo textual da comunicação
- dataDeEnvio — data de envio
- dataDeRecebimento — data de recebimento, frequentemente pouco clara
- tipo — tipo de correspondência

### Criptoativo
Ativo virtual observado como reserva de valor e objeto de investigação patrimonial.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica.
Justificativa: Classe explicitamente modelada na categoria financeira.

**Atributos:**
- blockchain — Rede/blockchain em que o ativo está registrado [requer pesquisa adicional]. Desmembrado de carteiraBlockchainSaldo. *(adicionado manualmente na revisão)*
- carteira — Endereço da carteira, que funciona como identificador do ativo cripto [requer pesquisa adicional]. Desmembrado de carteiraBlockchainSaldo. *(adicionado manualmente na revisão)*
- funcaoObservada — reserva de valor e ativo de baixo rastro documental
- saldo — Quantidade do ativo na unidade própria da criptomoeda (ex.: BTC) — diferente do valor monetário convertido, que fica em AvaliacaoPatrimonial [requer pesquisa adicional]. Desmembrado de carteiraBlockchainSaldo. *(adicionado manualmente na revisão)*

### DecisaoJudicial
Pronunciamento judicial que determina, confirma ou fundamenta efeitos sobre pessoas e ativos.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das denominações gerais e de origem para decisão judicial.

**Atributos:**
- dataDaDecisao — data da decisão
- dispositivo — dispositivo da decisão
- fundamentacao — fundamentação, frequentemente em texto livre
- tipoDeDecisao — tipo de pronunciamento ou decisão
- transitoEmJulgado — indicador e data de trânsito

### DeclaracaoFiscalDeRendaEPatrimonio
Declaração fiscal que registra renda, patrimônio, exercício e eventuais retificações.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das denominações equivalentes usadas nas categorias de pessoas, finanças e valoração.

**Atributos:**
- exercicioOuPeriodo — exercício ou período
- indicadorDeRetificadora — indicação de declaração retificadora
- patrimonioDeclarado — patrimônio declarado
- rendaDeclarada — renda declarada
- versao — versão da declaração

### DecretoDePerdimento
Perdimento decretado sobre ativo, incluindo seus marcos temporais e fundamento.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de DecretoDePerdimento, PerdimentoDeBem e DecisãoDePerdimento.

**Atributos:**
- dataDoDecreto — data do decreto
- dependenciaDeAvaliacaoOuLeilao — dependência de avaliação ou leilão
- modalidade — perdimento ordinário ou antecipado
- status — decretado, destinação pendente ou concluída

### Destinacao
Processo de destinação de ativo após consolidação do perdimento.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de Destinação e DestinaçãoDeAtivo.

**Atributos:**
- dataDaDecisao — data da decisão de destinação
- dataDeEfetivacao — data de efetivação [requer pesquisa adicional]
- modalidade — fundo, vítimas, erário, partilha, leilão ou outra modalidade capturada
- status — pendente, em curso ou concluída

### DispositivoNormativo
Dispositivo de norma ou instrumento jurídico que regula ou fundamenta medida.
Consolidada a partir de: marco-normativo-e-instrumentos-juridicos-aplicaveis.
Justificativa: Classe explicitamente modelada na categoria normativa.

**Atributos:**
- objetoRegulado — bloqueio, sequestro, confisco, perdimento, repatriação ou repartição
- referencia — artigo ou parágrafo
- textoOuEmenta — texto ou ementa [requer pesquisa adicional]
- vigencia — vigência [requer pesquisa adicional]

### Divida
[adicionado no EOA — iteração à DKD a partir de lacuna externa mantida no ORR] Obrigação financeira de um devedor perante um credor, com montante, moeda, taxa de juros e período; o crédito que fundamenta a recuperação de ativos. Origem: FollowTheMoney Debt (debtor, creditor, amount, currency, interestRate, startDate, endDate).
*(adicionado manualmente na revisão)*

**Atributos:**
- dataDeFim — Término ou quitação (FTM Debt.endDate). *(adicionado manualmente na revisão)*
- dataDeInicio — Início da obrigação (FTM Debt.startDate). *(adicionado manualmente na revisão)*
- taxaDeJuros — Taxa de juros da dívida (FTM Debt.interestRate). *(adicionado manualmente na revisão)*

### DocumentoDoPedido
Documento que instrui ou integra pedido de cooperação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Fusão de DocumentoDoPedido, DocumentoDoFluxoInternacional e DocumentoInstrutório.

**Atributos:**
- apostilamentoOuLegalizacao — situação de apostilamento ou legalização
- citacaoDeBaseLegal — presença de citação de tratado ou base legal
- dataDoDocumento — data do documento
- formatoDeData — formato de data exigido
- idioma — idioma original
- possuiTraducao — indicação de tradução
- tipoDeDocumento — formulário, certidão, tradução, relatório, PDF ou outro anexo
- versao — versão do documento

### DossieDeBuscaPatrimonial
Dossiê que consolida alvo, consultas, ativos localizados, confiança, proveniência e pendências.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de DossiêPatrimonial e DossiêDeBuscaPatrimonial.

**Atributos:**
- dataDeCorte — data de corte do resultado
- grauDeConfianca — confirmado, provável ou hipótese
- pendencias — pendências em aberto
- tituloQueFundamentaABusca — título ou fundamento da busca

### Embarcação
Especialização de ativo para embarcações.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens.
Justificativa: Classe recorrente nas categorias de ativos e registros.

**Atributos:**
- inscricao — inscrição da embarcação [requer pesquisa adicional]
- nomeDaEmbarcacao — nome da embarcação [requer pesquisa adicional]

### Endereco
Endereço físico associado a um bem, pessoa física ou pessoa jurídica. Promovido a classe própria por decisão da revisão humana: a DKC capturou endereço como campo de texto livre duplicado independentemente em BemImovel, PessoaFísica e PessoaJurídica — mesma estrutura de dado repetida em três classes sem relação entre si.
*(adicionado manualmente na revisão)*

**Atributos:**
- enderecoCompleto — Endereço em texto livre, sem decomposição em logradouro/número — replica o formato já capturado nas três classes de origem (BemImovel.endereco, PessoaFísica.enderecoDeclarado, PessoaJurídica.endereco). Nenhuma fonte decompôs o endereço em partes, então nenhuma foi inventada aqui. *(adicionado manualmente na revisão)*

### EnteDestinatario
Pessoa, fundo, ente público ou estrangeiro beneficiário da destinação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos.
Justificativa: Classe explicitamente modelada na categoria de destinação.

**Atributos:**
- tipoDeDestinatario — fundo, vítimas, erário ou ente estrangeiro

### Exequatur
Ato ou autorização judicial que habilita cumprimento de carta rogatória.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis.
Justificativa: Fusão de Exequatur e AtoDeExequatur.

**Atributos:**
- data — data de submissão ou concessão [requer pesquisa adicional]
- objeto — objeto da medida
- sentidoDoFluxo — pedido ativo ou passivo

### ExtratoDeMovimentacaoFinanceira
Conjunto de lançamentos de movimentação financeira obtido sob condições específicas de acesso.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica.
Justificativa: Classe explicitamente modelada na categoria financeira.

**Atributos:**
- escopoDeCirculacao — escopo delimitado pela autorização que originou o dado
- formatoDeEntrega — formato de entrega [requer pesquisa adicional]
- moeda — moeda dos lançamentos [requer pesquisa adicional]
- periodoCoberto — período coberto [requer pesquisa adicional]

### FundamentoLegal
Referência normativa usada para fundamentar medida, perdimento ou decisão.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis.
Justificativa: Fusão de FundamentoLegal e FundamentoLegalDoPerdimento.

**Atributos:**
- aplicacaoPorBem — aplicação por bem, hoje frequentemente textual
- referenciaNormativa — referência normativa
- tipoDeOrigemDoBem — origem do bem associada ao fundamento de perdimento

### IdentificadorDePessoa
Identificador utilizado para distinguir ou relacionar pessoas entre fontes e jurisdições.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias.
Justificativa: Classe explicitamente modelada na identificação de pessoas.

**Atributos:**
- indicadorDeDuplicidadeDocumental — sinalização de duplicidade documental
- jurisdicaoDeEmissao — jurisdição de emissão
- organizacaoEmissora — organização emissora
- regrasDeValidacao — estrutura e regras de validação [requer pesquisa adicional]
- tipoDeIdentificador — tipo do identificador
- valor — valor do identificador

### IncidenteDeRestituicao
Incidente em que terceiro ou interessado questiona a constrição ou reivindica ativo.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Classe recorrente nas categorias de constrição e tramitação processual.

**Atributos:**
- dataDeInstauracao — data de dedução ou instauração
- resultado — resultado ou decisão do incidente
- status — pendente ou resolvido, sem marcador estruturado em parte das fontes

### IndicacaoDeBeneficiarioFinal
Indicação de pessoa considerada beneficiário final ou titular de fato de pessoa jurídica.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias.
Justificativa: Classe explicitamente modelada na identificação societária.

**Atributos:**
- dataDaIndicacao — data da indicação
- grauDeConfianca — confirmado, provável ou hipótese
- naturezaDaTitularidade — formal, de fato, oculto ou efetivo; campo estruturado inexistente
- origemDaIndicacao — cadastro, registro estrangeiro ou investigação
- regrasDoRegistro — regras e campos do registro [requer pesquisa adicional]

### IndicioFinanceiro
Fenômeno ou padrão observado em dados de movimentação financeira.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica.
Justificativa: Classe explicitamente modelada na categoria financeira.

**Atributos:**
- descricao — descrição, hoje frequentemente textual
- periodoDeReferencia — data ou período de referência
- tipo — tipo do indício financeiro

### InstituicaoFinanceira
Instituição custodiante de conta ou ativo financeiro e potencial executora de medida.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Consolida instituições financeiras e custodiantes financeiros equivalentes.

**Atributos:**
- demaisCamposCadastrais — campos cadastrais [requer pesquisa adicional]
- jurisdicao — jurisdição de funcionamento
- papel — custódia, produção de dados ou execução de bloqueio

### InstrumentoJuridicoDeCooperacao
Instrumento normativo de cooperação, incluindo convenções, tratados e reciprocidade.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Fusão de InstrumentoInternacional, InstrumentoDeCooperação, MarcoNormativoDeCooperação e denominações equivalentes.

**Atributos:**
- denominacao — denominação do instrumento
- identificadorEstavel — identificador oficial [requer pesquisa adicional]
- prazoDeResposta — prazo de resposta previsto
- reservasEDeclaracoes — reservas e declarações [requer pesquisa adicional]
- tipoDeInstrumento — multilateral, bilateral ou reciprocidade
- vigencia — vigência [requer pesquisa adicional]

### Jurisdição
País ou ordenamento envolvido no ativo, na pessoa, na fonte ou na cooperação.
Consolidada a partir de: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Classe recorrente nas categorias de gestão, pessoas, marco normativo e cooperação.

**Atributos:**
- nomeOuCodigo — nome ou código da jurisdição
- taxaDeSucesso — taxa de sucesso da cooperação
- tempoMedioDeResposta — tempo médio de resposta observado

### LancamentoFinanceiro
Unidade de movimentação observada em extrato financeiro.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica.
Justificativa: Classe explicitamente modelada na categoria financeira.

**Atributos:**
- data — data do lançamento
- modalidade — modalidade observada
- moeda — moeda do lançamento
- valor — valor do lançamento

### ListaRestritiva
Lista de sanções ou restrições emitida por organização nacional ou internacional.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias, marco-normativo-e-instrumentos-juridicos-aplicaveis.
Justificativa: Consolida ListaRestritiva e ListaDeSançõesInternacionais.

**Atributos:**
- organizacaoEmissora — organização emissora
- periodicidadeEFormato — periodicidade e formato [requer pesquisa adicional]
- regimeDeSancao — regime ou programa de sanção [requer pesquisa adicional]
- tipoDeLista — tipo da lista de sanções

### MatriculaImobiliaria
Registro matricial que descreve imóvel, titularidade, atos, ônus e averbações.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias de constrição, registros e valoração.

**Atributos:**
- dataDoUltimoAto — data do último ato
- historicoVersionado — existência de histórico versionado [requer pesquisa adicional]
- regrasDeAcesso — via e regras de acesso [requer pesquisa adicional]

### MedidaDeConstricao
Medida assecuratória ou constritiva que limita disponibilidade, transferência ou posse de ativo.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de MedidaDeConstrição, MedidaSobreBem, MedidaConstritiva e MedidaDeConstriçãoPatrimonial.

**Atributos:**
- ambitoTerritorial — nacional ou exterior
- dataDaMedida — data da determinação ou início
- indicadorDeSobreposicao — indicação de constrição concorrente
- statusAtual — status frequentemente inferido do histórico
- termoLiteral — termo literal utilizado na decisão
- tipoDeMedida — sequestro, arresto, bloqueio, indisponibilidade ou outra medida

### NomeEVarianteDeGrafia
Forma nominal ou variante de grafia associada a uma pessoa.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias.
Justificativa: Classe necessária para representar divergências de grafia explicitamente modeladas.

**Atributos:**
- formaDeGrafia — forma textual do nome
- idiomaOuOrigem — idioma ou origem da tradução
- indicadorDeAmbiguidade — sinalização de ambiguidade
- tipoDeVariante — grafia divergente, homônimo, alias, transliteração ou tradução

### OrgaoDeAcusacao
Órgão responsável por requerer ou acompanhar medidas no fluxo de recuperação de ativos.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Classe recorrente nas categorias jurídica, financeira e processual.

**Atributos:**
- atribuicaoPatrimonial — atribuição relacionada à recuperação patrimonial
- esferaDeAtuacao — esfera de atuação

### OrgaoDeGestaoPatrimonial
Órgão responsável pela administração de ativos submetidos à gestão patrimonial.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias de constrição, gestão e valoração.

**Atributos:**
- interfaceDeIdentificacao — forma de identificação do bem sob gestão
- nomeDoSistemaDeControle — nome do sistema [requer pesquisa adicional]

### OrgaoDeRegistroPublico
Organização custodiante de registros públicos relacionados a bens e atos registrais.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens.
Justificativa: Consolida ÓrgãoDeRegistroPúblico e OrganizaçãoCustodianteDeRegistro.

**Atributos:**
- abrangenciaTerritorial — abrangência territorial
- nivelDeAcesso — nível de acesso disponível [requer pesquisa adicional]
- tipoDeOrgao — tipo de órgão ou serventia

### OrgaoJudicial
Órgão judicial que conduz processo, profere decisão ou atua em cumprimento e exequatur.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das denominações funcionais equivalentes de autoridade ou órgão judicial.

**Atributos:**
- comarcaOuSecao — comarca ou seção judiciária
- esferaECompetencia — esfera e competência
- instancia — instância judicial

### ParticipacaoSocietaria
Participação ou vínculo societário reificado entre pessoa e sociedade.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, identificacao-de-pessoas-e-estruturas-societarias, registro-e-titularidade-de-bens.
Justificativa: Consolida ParticipaçãoSocietária e VínculoSocietário.

**Atributos:**
- dataDeEntrada — data de entrada na sociedade
- dataDeSaida — data de saída
- percentualDeParticipacao — percentual de participação
- qualificacaoDoSocio — sócio, administrador ou representante

### PedidoDeCooperacaoJuridicaInternacional
Pedido entre jurisdições para informação ou execução de medida relacionada à recuperação de ativos.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Conceito central recorrente e consolidado entre oito categorias DKC.

**Atributos:**
- criticidade — criticidade ou priorização, pouco estruturada
- dataDeEnvio — data de envio
- dataDeRecebimento — data de recebimento, frequentemente ausente ou ambígua
- dataDeResposta — data de resposta
- direcao — ativo ou passivo
- faseDoFluxo — fase do fluxo de tramitação
- numeroDeReferenciaEstrangeiro — referência da contraparte estrangeira
- numeroOuReferencia — identificador ou referência do pedido
- status — status frequentemente inferido do histórico

### Pessoa
Pessoa física ou jurídica envolvida em titularidades, vínculos, processos, pedidos ou buscas patrimoniais.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Fusão de Pessoa, PessoaOuEntidadeDeInteresse e PessoaEnvolvida.

**Atributos:**
- grauDeCertezaDaIdentidade — certeza da amarração de identidade, hoje pouco estruturada
- nomePrincipal — nome ou razão social adotado como principal
- papelNoCaso — papel exercido no caso ou procedimento
- recorrenciaEmCasos — indicação de pessoa já vista em casos anteriores, mecanismo desejado

### PessoaFísica
Especialização de pessoa para pessoa natural.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, registro-e-titularidade-de-bens.
Justificativa: Fusão de PessoaNatural e PessoaFísica.

**Atributos:**
- dataDeNascimento — data de nascimento para resolução de identidade
- estadoCivil — estado civil
- indicadorDePessoaExpostaPoliticamente — sinalizador de atenção [requer pesquisa adicional]
- municipioDeReferencia — município usado como critério auxiliar de identidade

### PessoaJurídica
Especialização de pessoa para organizações com personalidade jurídica.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, registro-e-titularidade-de-bens.
Justificativa: Classe recorrente nas categorias de pessoas, finanças e registros.

**Atributos:**
- dataDeConstituicao — data de constituição
- jurisdicaoDeConstituicao — jurisdição em que foi constituída
- naturezaDaEstrutura — sociedade, holding, offshore ou trust conforme registrado
- nomeFantasia — [adicionado na revisão humana, sem lastro em DKC] Nome fantasia/comercial da empresa, distinto da razão social — pode divergir do nome legal registrado. Não capturado na DKC deste domínio, adicionado por conhecimento comum do usuário na revisão. *(adicionado manualmente na revisão)*
- razaoSocial — razão social ou denominação

### PrazoDeResposta
Prazo associado ao atendimento, resposta ou andamento de pedido.
Consolidada a partir de: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Fusão de PrazoDeResposta, PrazoDeRespostaPrevisto e PrazoOuControleDeAndamento.

**Atributos:**
- campoNoSistemaFormal — existência de campo próprio [requer pesquisa adicional]
- dataDeInicio — início da contagem
- dataLimite — data-limite
- origemDoPrazo — tratado, regra interna ou acordo
- situacao — em curso, vencido ou sem resposta
- tempoDecorrido — tempo decorrido

### ProcessoJudicial
Processo em que se registram partes, decisões, medidas, incidentes e referências a ativos.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Conceito recorrente consolidado entre categorias DKC.

**Atributos:**
- classeEAssunto — classe e assunto [requer pesquisa adicional]
- esferaENatureza — esfera e natureza processual
- faseProcessual — fase processual
- identificadorNacionalDeReuOuBem — identificador transversal ausente
- juizoOuVara — juízo ou vara de tramitação
- numeroDoProcesso — número ou identificador do processo
- transitoEmJulgado — situação e data de trânsito em julgado

### RedeDeCooperacaoInternacional
Rede internacional ou interinstitucional usada como canal complementar de cooperação.
Consolidada a partir de: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Fusão de RedeInternacionalDeCooperação, RedeDeCooperaçãoInternacional e RedeDeCooperaçãoInterinstitucional.

**Atributos:**
- denominacao — denominação da rede
- naturezaDoCanal — informal ou complementar ao trâmite formal
- regrasDeUso — regras de uso e reuso [requer pesquisa adicional]
- tipoDeAcesso — ponto de contato ou outro acesso [requer pesquisa adicional]

### RegistroPublicoDeBem
Registro público que identifica ou referencia bem e seus elementos registrais.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens.
Justificativa: Fusão de RegistroPúblicoDeBem e RegistroPúblicoDeBens.

**Atributos:**
- identificadorDoBemNoRegistro — identificador do bem [requer pesquisa adicional]
- restricaoJudicialAnotada — restrição judicial anotada [requer pesquisa adicional]
- tipoDeRegistro — tipo do registro

### Repatriacao
Retorno de ativo ou valor de outra jurisdição como resultado do fluxo de recuperação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos.
Justificativa: Classe explicitamente modelada na categoria de constrição e destinação.

**Atributos:**
- condicaoDePartilha — condição de partilha
- dataDeRetorno — data de retorno do ativo
- paisDeOrigem — país de origem do ativo

### RequisitoFormal
Exigência formal imposta por jurisdição ou instrumento de cooperação.
Consolidada a partir de: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Fusão de RequisitoFormal e ExigênciaFormalDeJurisdição.

**Atributos:**
- caraterBloqueante — indicação de efeito bloqueante
- materializacaoEmDado — campo, anexo ou selo [requer pesquisa adicional]
- obrigatoriedade — indicação de obrigatoriedade
- origemDaExigencia — instrumento ou norma da jurisdição
- tipoDeRequisito — tradução, apostilamento, autenticação, formato ou detalhamento

### RespostaDeCooperacao
Resposta recebida de autoridade ou jurisdição em decorrência de pedido de cooperação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, pedidos-de-cooperacao-entre-jurisdicoes, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de RespostaDeAutoridadeEstrangeira, RespostaDeCooperação e RetornoDePedidoDeCooperação.

**Atributos:**
- conteudoSubstantivo — conteúdo substantivo da resposta
- dataDeRecebimento — data de recebimento, por vezes pouco clara
- jurisdicaoRespondente — jurisdição respondente
- referenciaEstrangeira — referência usada para religação ao pedido
- terminologiaDeOrigem — terminologia jurídica usada no país de origem

### RestricaoOuOnusSobreBem
Restrição, ônus ou gravame que incide sobre ativo.
Consolidada a partir de: registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe genérica modelada na categoria registral.

**Atributos:**
- dataDeInicio — data inicial da restrição
- situacao — situação da restrição
- tipoDeRestricao — ônus, indisponibilidade, constrição ou restrição administrativa

### SancaoIndividual
[adicionado no EOA — iteração à DKD a partir de lacuna externa mantida no ORR] Registro de sanção ou restrição imposta a uma pessoa por uma autoridade, sob um programa, com motivo, datas e status; é a entrada individual de uma ListaRestritiva, que até aqui só existia como lista. Origem: FollowTheMoney Sanction (entity, authority, program, reason, startDate, endDate, status).
*(adicionado manualmente na revisão)*

**Atributos:**
- dataDeFim — Fim da vigência (FTM Sanction.endDate). *(adicionado manualmente na revisão)*
- dataDeInicio — Início da vigência (FTM Sanction.startDate). *(adicionado manualmente na revisão)*
- motivo — Razão declarada da sanção (FTM Sanction.reason). *(adicionado manualmente na revisão)*
- programa — Programa ou regime de sanção (FTM Sanction.program). *(adicionado manualmente na revisão)*
- status — Status da sanção (FTM Sanction.status). *(adicionado manualmente na revisão)*

### SistemaDeInformacao
Sistema, base ou fonte que armazena, organiza ou fornece dados do domínio.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de SistemaDeInformação, SistemaOuBaseDeDados e fontes genéricas equivalentes.

**Atributos:**
- camposEstruturadosDisponiveis — campos e dicionário de dados [requer pesquisa adicional]
- existenciaDeApi — existência de integração ou API [requer pesquisa adicional]
- grauDeEstruturacao — grau de estruturação dos dados
- nivelDeAcesso — forma ou nível de acesso
- nomeOficial — nome oficial [requer pesquisa adicional]
- periodicidadeDeAtualizacao — periodicidade de atualização [requer pesquisa adicional]
- tipoDeArtefato — sistema, base, planilha, correio ou repositório

### StatusProbatorio
Qualificação do estágio ou força probatória atribuída a informação, indício ou resultado.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica.
Justificativa: Classe transversal recorrente nas categorias patrimonial e financeira.

**Atributos:**
- dataDeCorte — data de corte
- hipoteseDescartada — hipótese descartada, pouco estruturada atualmente
- justificativa — fundamento da qualificação
- valor — confirmado, provável, hipótese ou estágio probatório equivalente

### SucessaoDeEntidade
[adicionado no EOA — iteração à DKD a partir de lacuna externa mantida no ORR] Evento de fusão, cisão, incorporação ou reestruturação que liga uma ou mais pessoas jurídicas originais às resultantes; permite seguir a cadeia de empresas sucessoras. Origem: FollowTheMoney Succession (predecessor, successor, startDate, endDate) e W3C ORG ChangeEvent (originalOrganization, resultingOrganization).
*(adicionado manualmente na revisão)*

**Atributos:**
- dataDoEvento — Data do evento (FTM Succession.startDate). *(adicionado manualmente na revisão)*
- tipoDeEvento — Fusão, cisão, incorporação ou reestruturação (ORG ChangeEvent; FTM Succession). *(adicionado manualmente na revisão)*

### TabelionatoDeNotas
Serventia extrajudicial responsavel por lavrar atos notariais (escrituras, procuracoes e afins).
*(adicionado manualmente na revisão)*

### TaxaDeCambioHistorica
Taxa de câmbio aplicável à conversão de valores em determinada data.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Classe recorrente nas categorias financeira e de valoração.

**Atributos:**
- dataDaCotacao — data da cotação
- fonteOficial — fonte oficial a adotar [requer pesquisa adicional]
- moedaDeDestino — moeda de destino
- moedaDeOrigem — moeda de origem

### UnidadeDeAssessoriaJuridica
Unidade especializada em análise jurídica de perdimento, destinação ou cooperação.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das unidades e áreas jurídicas equivalentes modeladas nas categorias.

**Atributos:**
- atribuicao — análise de enquadramento jurídico e alcance do perdimento ou pedido

### UnidadeDeBuscaPatrimonial
Unidade responsável pela localização, individualização e consolidação de informações patrimoniais.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão de órgão/unidade de busca patrimonial e unidade operacional equivalente.

**Atributos:**
- atribuicao — localização e individualização de bens e pessoas

### UnidadeDeGestaoDeCarteira
Unidade ou instância responsável pela gestão, priorização e escalonamento da carteira.
Consolidada a partir de: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das denominações de coordenação, direção e unidade de gestão de carteira.

**Atributos:**
- atribuicoes — priorização, cobrança, escalonamento e acompanhamento da carteira

### UnidadeDeInteligenciaFinanceira
Unidade responsável pela produção ou intercâmbio de inteligência financeira.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens.
Justificativa: Classe recorrente em várias categorias DKC.

**Atributos:**
- formaDeEntrega — forma de entrega do produto
- papel — produção e intercâmbio de inteligência financeira

### UnidadeDeTecnologiaEAutomacao
Unidade responsável por integração, parsing, automação, validação e geração de minutas.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Fusão das denominações equivalentes de tecnologia, dados e automação.

**Atributos:**
- atribuicao — parsing, extração, validação, integração e geração de minutas

### ValorEconomicoDeAtivo
Expressão monetária associada a ativo, medida, dano, bloqueio ou avaliação.
Consolidada a partir de: movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos.
Justificativa: Consolida o conceito geral de valor monetário e econômico das categorias financeiras e de valoração.

**Atributos:**
- dataDeReferencia — data de referência do valor
- grauDeConfianca — confiança da expressão econômica
- moeda — moeda, frequentemente ausente ou não padronizada
- origemDoValor — fonte ou origem da afirmação de valor
- quantia — montante
- tipoDeValor — venal, declarado, estimado, avaliação, dano, bloqueado ou mercado
- valorConvertido — valor após conversão cambial quando aplicável

### ValorMobiliario
[adicionado no EOA — iteração à DKD a partir de lacuna externa mantida no ORR] Ativo financeiro na forma de instrumento negociável emitido por um emissor (ações, títulos), identificado por ISIN e ticker. Origem: FollowTheMoney Security (issuer, type, isin, ticker, currency) e FIBO security (financial instrument that can be bought or sold).
*(adicionado manualmente na revisão)*

**Atributos:**
- isin — Código ISIN (FTM Security.isin). *(adicionado manualmente na revisão)*
- ticker — Código de negociação (FTM Security.ticker). *(adicionado manualmente na revisão)*
- tipo — Tipo do valor mobiliário (FTM Security.type). *(adicionado manualmente na revisão)*

### Veículo
Especialização de ativo para veículos automotores.
Consolidada a partir de: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens.
Justificativa: Fusão de VeículoAutomotor e Veículo.

**Atributos:**
- chassi — chassi [requer pesquisa adicional]
- placa — placa [requer pesquisa adicional]
- renavam — RENAVAM [requer pesquisa adicional]

### ViaProcessual
Via jurídica ou administrativa utilizada para tramitar a cooperação.
Consolidada a partir de: marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Classe recorrente nas categorias normativa e de cooperação.

**Atributos:**
- criterioDeCabimento — critério de cabimento
- registroDeReclassificacao — reclassificação de via não registrada como evento próprio
- tipoDeVia — auxílio direto, carta rogatória, via diplomática ou rede

### VinculoEntrePessoas
Relação reificada entre pessoas com natureza, temporalidade, proveniência e confiança.
Consolidada a partir de: identificacao-de-pessoas-e-estruturas-societarias, pedidos-de-cooperacao-entre-jurisdicoes.
Justificativa: Classe recorrente nas categorias societária e de cooperação.

**Atributos:**
- dataDeFim — fim de vigência
- dataDeInicio — início de vigência
- grauDeConfianca — confirmado, provável ou hipótese
- motivoDoVinculo — motivo do vínculo, hoje frequentemente textual
- proveniencia — documento ou base de origem
- regimeDeBens — Regime de bens do casal, aplicável especificamente a vínculos de parentesco conjugal (cônjuge/ex-cônjuge). Lastro: DKC (identificacao-de-pessoas-e-estruturas-societarias.md) cita registros de cartório civil com "vínculo de parentesco (grau...); regime de bens". Campo condicional — só relevante quando tipoDeVinculo indica relação conjugal. *(adicionado manualmente na revisão)*
- tipoDeVinculo — societário, controle, representação, parentesco ou interposição

## Relações

| Origem | Relação | Destino | Observação |
|---|---|---|---|
| Aeronave | OPERADA_POR | Pessoa | *(adicionado manualmente na revisão)* |
| Aeronave | É_SUBCLASSE_DE | BemMovel | *(adicionado manualmente na revisão)* |
| AlegacaoDeTerceiroDeBoaFe | AVALIADA_POR | AvaliacaoPatrimonial | *(adicionado manualmente na revisão)* |
| AlegacaoDeTerceiroDeBoaFe | INCIDE_SOBRE | Ativo | *(adicionado manualmente na revisão)* |
| AlegacaoDeTerceiroDeBoaFe | INSTRUI | IncidenteDeRestituicao |  |
| AlegacaoDeTerceiroDeBoaFe | REQUERIDA_POR | Pessoa | *(adicionado manualmente na revisão)* |
| AlienacaoAntecipada | AUTORIZADA_POR | DecisaoJudicial |  |
| AlienacaoAntecipada | FUNDAMENTA_SE_EM | FundamentoLegal | *(adicionado manualmente na revisão)* |
| AlienacaoAntecipada | INCIDE_SOBRE | Ativo |  |
| AnaliseDeCompatibilidadeEconomica | IDENTIFICA | Ativo | *(adicionado manualmente na revisão)* |
| AnaliseDeCompatibilidadeEconomica | QUALIFICADO_POR | StatusProbatorio |  |
| AnaliseDeCompatibilidadeEconomica | UTILIZA | DeclaracaoFiscalDeRendaEPatrimonio |  |
| AnaliseDeCompatibilidadeEconomica | UTILIZA | ExtratoDeMovimentacaoFinanceira |  |
| AreaDeExecucaoOperacional | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| AssercaoDeTitularidade | COMPROVADA_POR | RegistroPublicoDeBem |  |
| AssercaoDeTitularidade | LIGA | Pessoa |  |
| AssercaoDeTitularidade | LIGA | Ativo |  |
| AssercaoDeTitularidade | TITULAR_ANTERIOR | Pessoa | *(adicionado manualmente na revisão)* |
| Ativo | POSSUI | AvaliacaoPatrimonial |  |
| Ativo | QUALIFICADO_POR | StatusProbatorio | *(adicionado manualmente na revisão)* |
| Ativo | REGISTRADO_EM | RegistroPublicoDeBem |  |
| Ativo | SOB_GESTÃO_DE | OrgaoDeGestaoPatrimonial |  |
| AtivoDePropriedadeIntelectual | É_SUBCLASSE_DE | Ativo |  |
| AtivoFinanceiro | CUSTODIADO_POR | InstituicaoFinanceira | *(adicionado manualmente na revisão)* |
| AtivoFinanceiro | É_SUBCLASSE_DE | Ativo |  |
| AtoNotarial | LAVRADO_POR | TabelionatoDeNotas | *(adicionado manualmente na revisão)* |
| AtoNotarial | TEM_PARTE | Pessoa | *(adicionado manualmente na revisão)* |
| AtoRegistral | INSTRUMENTALIZADO_POR | AtoNotarial |  |
| AtoRegistral | TEM_PARTE | Pessoa |  |
| AutoridadeCentral | PERTENCE_A | Jurisdição |  |
| AutoridadeCentral | TRAMITA | PedidoDeCooperacaoJuridicaInternacional |  |
| AutoridadeDecisoriaSobreDestinacao | REGISTRADO_EM | SistemaDeInformacao | *(adicionado manualmente na revisão)* |
| AutoridadeDecisoriaSobreDestinacao | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| AvaliacaoPatrimonial | AVALIA | Ativo |  |
| AvaliacaoPatrimonial | PRODUZ | ValorEconomicoDeAtivo |  |
| AvaliacaoPatrimonial | SUBSIDIA | Destinacao |  |
| AvaliacaoPatrimonial | SUBSIDIA | AlienacaoAntecipada |  |
| BemImovel | DESCRITO_EM | MatriculaImobiliaria |  |
| BemImovel | TEM_ENDERECO | Endereco | *(adicionado manualmente na revisão)* |
| BemImovel | É_SUBCLASSE_DE | Ativo |  |
| BemMovel | TITULAR_ANTERIOR | Pessoa | *(adicionado manualmente na revisão)* |
| BemMovel | É_SUBCLASSE_DE | Ativo | *(adicionado manualmente na revisão)* |
| ContaBancaria | É_SUBCLASSE_DE | AtivoFinanceiro | *(adicionado manualmente na revisão)* |
| Contrato | BENEFICIA | Pessoa | *(adicionado manualmente na revisão)* |
| Contrato | REFERE_SE_A | Ativo | *(adicionado manualmente na revisão)* |
| Contrato | REGIDO_POR | Jurisdição | *(adicionado manualmente na revisão)* |
| Contrato | TEM_PARTE | Pessoa | *(adicionado manualmente na revisão)* |
| Contrato | TEM_VALOR | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| Correspondencia | DIRIGIDA_A | AutoridadeCentral | *(adicionado manualmente na revisão)* |
| Correspondencia | ENVIADA_POR | AutoridadeCentral | *(adicionado manualmente na revisão)* |
| Criptoativo | É_SUBCLASSE_DE | Ativo | *(adicionado manualmente na revisão)* |
| DecisaoJudicial | AUTORIZA | AlienacaoAntecipada |  |
| DecisaoJudicial | DETERMINA | MedidaDeConstricao |  |
| DecisaoJudicial | DETERMINA | DecretoDePerdimento |  |
| DecisaoJudicial | DETERMINA | Destinacao |  |
| DecisaoJudicial | DETERMINA | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| DeclaracaoFiscalDeRendaEPatrimonio | DECLARADA_POR | PessoaFísica |  |
| DecretoDePerdimento | DECORRE_DE | DecisaoJudicial |  |
| DecretoDePerdimento | FUNDAMENTA_SE_EM | FundamentoLegal | *(adicionado manualmente na revisão)* |
| DecretoDePerdimento | HABILITA | Destinacao |  |
| DecretoDePerdimento | RECAI_SOBRE | Ativo |  |
| Destinacao | BENEFICIA | EnteDestinatario |  |
| Destinacao | DECIDIDA_POR | AutoridadeDecisoriaSobreDestinacao |  |
| Destinacao | DESTINA | Ativo |  |
| Destinacao | EXECUTADA_POR | AreaDeExecucaoOperacional |  |
| Destinacao | EXIGE | AvaliacaoPatrimonial |  |
| Destinacao | MATERIALIZA_SE_EM | Repatriacao |  |
| Divida | TEM_CREDOR | Pessoa | *(adicionado manualmente na revisão)* |
| Divida | TEM_DEVEDOR | Pessoa | *(adicionado manualmente na revisão)* |
| Divida | TEM_VALOR | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| DossieDeBuscaPatrimonial | DESCREVE | Ativo |  |
| DossieDeBuscaPatrimonial | TEM_ALVO | Pessoa |  |
| Embarcação | É_SUBCLASSE_DE | BemMovel | *(adicionado manualmente na revisão)* |
| Endereco | TEM_CODIGO_POSTAL | CodigoPostal | *(adicionado manualmente na revisão)* |
| Exequatur | CONCEDIDO_POR | OrgaoJudicial |  |
| ExtratoDeMovimentacaoFinanceira | COMPOSTO_POR | LancamentoFinanceiro |  |
| ExtratoDeMovimentacaoFinanceira | REFERE_SE_A | ContaBancaria |  |
| IncidenteDeRestituicao | AFETA | Ativo |  |
| IncidenteDeRestituicao | QUESTIONA | MedidaDeConstricao |  |
| IndicacaoDeBeneficiarioFinal | APONTA | Pessoa |  |
| IndicacaoDeBeneficiarioFinal | REFERE_SE_A | PessoaJurídica |  |
| IndicacaoDeBeneficiarioFinal | É_SUBCLASSE_DE | VinculoEntrePessoas | *(adicionado manualmente na revisão)* |
| IndicioFinanceiro | EXTRAÍDO_DE | ExtratoDeMovimentacaoFinanceira |  |
| IndicioFinanceiro | QUALIFICADO_POR | StatusProbatorio |  |
| InstituicaoFinanceira | PRODUZ | ExtratoDeMovimentacaoFinanceira |  |
| InstituicaoFinanceira | É_SUBCLASSE_DE | PessoaJurídica | *(adicionado manualmente na revisão)* |
| InstrumentoJuridicoDeCooperacao | DEFINE | RequisitoFormal |  |
| InstrumentoJuridicoDeCooperacao | DETERMINA | ViaProcessual |  |
| InstrumentoJuridicoDeCooperacao | VINCULA | Jurisdição |  |
| InstrumentoJuridicoDeCooperacao | É_COMPOSTO_POR | DispositivoNormativo |  |
| Jurisdição | IMPÕE | RequisitoFormal |  |
| LancamentoFinanceiro | EVIDENCIA | IndicioFinanceiro |  |
| LancamentoFinanceiro | TEM_CONTRAPARTE | Pessoa | *(adicionado manualmente na revisão)* |
| MatriculaImobiliaria | CONTÉM | AtoRegistral |  |
| MatriculaImobiliaria | DESCREVE | BemImovel |  |
| MatriculaImobiliaria | TITULAR_ANTERIOR | Pessoa | *(adicionado manualmente na revisão)* |
| MatriculaImobiliaria | É_SUBCLASSE_DE | RegistroPublicoDeBem | *(adicionado manualmente na revisão)* |
| MedidaDeConstricao | DETERMINA | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| MedidaDeConstricao | DETERMINADA_POR | DecisaoJudicial |  |
| MedidaDeConstricao | FUNDAMENTA_SE_EM | FundamentoLegal |  |
| MedidaDeConstricao | RECAI_SOBRE | Ativo |  |
| MedidaDeConstricao | REQUERIDA_POR | OrgaoDeAcusacao |  |
| OrgaoDeAcusacao | REQUER | MedidaDeConstricao |  |
| OrgaoDeGestaoPatrimonial | ADMINISTRA | Ativo |  |
| OrgaoDeRegistroPublico | CUSTODIA | RegistroPublicoDeBem |  |
| OrgaoJudicial | PERTENCE_A | Jurisdição | *(adicionado manualmente na revisão)* |
| OrgaoJudicial | PROFERE | DecisaoJudicial |  |
| ParticipacaoSocietaria | TEM_SOCIEDADE | PessoaJurídica |  |
| ParticipacaoSocietaria | TEM_SÓCIO | Pessoa |  |
| ParticipacaoSocietaria | É_SUBCLASSE_DE | VinculoEntrePessoas | *(adicionado manualmente na revisão)* |
| PedidoDeCooperacaoJuridicaInternacional | ENVOLVE | Jurisdição |  |
| PedidoDeCooperacaoJuridicaInternacional | FUNDAMENTA_SE_EM | InstrumentoJuridicoDeCooperacao |  |
| PedidoDeCooperacaoJuridicaInternacional | INDICA | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| PedidoDeCooperacaoJuridicaInternacional | INSTRUÍDO_POR | DocumentoDoPedido |  |
| PedidoDeCooperacaoJuridicaInternacional | MENCIONA | Pessoa |  |
| PedidoDeCooperacaoJuridicaInternacional | POSSUI | Correspondencia |  |
| PedidoDeCooperacaoJuridicaInternacional | RECEBE | RespostaDeCooperacao |  |
| PedidoDeCooperacaoJuridicaInternacional | REFERE_SE_A | Ativo |  |
| PedidoDeCooperacaoJuridicaInternacional | SOLICITA | MedidaDeConstricao |  |
| PedidoDeCooperacaoJuridicaInternacional | SUJEITO_A | PrazoDeResposta |  |
| PedidoDeCooperacaoJuridicaInternacional | UTILIZA | ViaProcessual | *(adicionado manualmente na revisão)* |
| PedidoDeCooperacaoJuridicaInternacional | VINCULA_SE_A | ProcessoJudicial |  |
| Pessoa | DESIGNADA_POR | NomeEVarianteDeGrafia |  |
| Pessoa | IDENTIFICADA_POR | IdentificadorDePessoa |  |
| Pessoa | QUALIFICADO_POR | ListaRestritiva | *(adicionado manualmente na revisão)* |
| Pessoa | TITULAR_DE | Ativo |  |
| PessoaFísica | TEM_ENDERECO | Endereco | *(adicionado manualmente na revisão)* |
| PessoaFísica | É_SUBCLASSE_DE | Pessoa |  |
| PessoaJurídica | TEM_ENDERECO | Endereco | *(adicionado manualmente na revisão)* |
| PessoaJurídica | É_SUBCLASSE_DE | Pessoa |  |
| ProcessoJudicial | CONTÉM | DecisaoJudicial |  |
| ProcessoJudicial | REFERENCIA | Ativo |  |
| ProcessoJudicial | TEM_PARTE | Pessoa |  |
| ProcessoJudicial | É_CONDUZIDO_POR | OrgaoJudicial |  |
| RedeDeCooperacaoInternacional | CONGREGA | AutoridadeCentral |  |
| RedeDeCooperacaoInternacional | CONGREGA | UnidadeDeInteligenciaFinanceira |  |
| RegistroPublicoDeBem | REFERE_SE_A | Ativo |  |
| Repatriacao | PRODUZ | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| Repatriacao | RESULTA_DE | DecretoDePerdimento |  |
| Repatriacao | TRANSFERE | Ativo |  |
| RespostaDeCooperacao | PRODUZ | ValorEconomicoDeAtivo | *(adicionado manualmente na revisão)* |
| RestricaoOuOnusSobreBem | BENEFICIA | Pessoa | *(adicionado manualmente na revisão)* |
| RestricaoOuOnusSobreBem | DECORRE_DE | ProcessoJudicial | *(adicionado manualmente na revisão)* |
| RestricaoOuOnusSobreBem | INCIDE_SOBRE | Ativo |  |
| SancaoIndividual | CONSTA_EM | ListaRestritiva | *(adicionado manualmente na revisão)* |
| SancaoIndividual | SANCIONA | Pessoa | *(adicionado manualmente na revisão)* |
| SistemaDeInformacao | OPERADO_POR | AtorInstitucional | *(adicionado manualmente na revisão)* |
| SucessaoDeEntidade | TEM_DESTINO | PessoaJurídica | *(adicionado manualmente na revisão)* |
| SucessaoDeEntidade | TEM_ORIGEM | PessoaJurídica | *(adicionado manualmente na revisão)* |
| TabelionatoDeNotas | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| UnidadeDeAssessoriaJuridica | ANALISA | DecretoDePerdimento |  |
| UnidadeDeAssessoriaJuridica | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| UnidadeDeBuscaPatrimonial | PRODUZ | DossieDeBuscaPatrimonial |  |
| UnidadeDeBuscaPatrimonial | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| UnidadeDeGestaoDeCarteira | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| UnidadeDeInteligenciaFinanceira | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| UnidadeDeTecnologiaEAutomacao | É_SUBCLASSE_DE | AtorInstitucional | *(adicionado manualmente na revisão)* |
| ValorEconomicoDeAtivo | CONVERTIDO_POR | TaxaDeCambioHistorica |  |
| ValorMobiliario | EMITIDO_POR | PessoaJurídica | *(adicionado manualmente na revisão)* |
| ValorMobiliario | É_SUBCLASSE_DE | AtivoFinanceiro | *(adicionado manualmente na revisão)* |
| Veículo | TEM_ENDERECO | Endereco | *(adicionado manualmente na revisão)* |
| Veículo | É_SUBCLASSE_DE | BemMovel | *(adicionado manualmente na revisão)* |
| ViaProcessual | EXIGE | Exequatur |  |
| VinculoEntrePessoas | TEM_DESTINO | Pessoa |  |
| VinculoEntrePessoas | TEM_ORIGEM | Pessoa |  |

## Diagrama

```mermaid
classDiagram
  Aeronave --> Pessoa : OPERADA_POR
  Aeronave --> BemMovel : É_SUBCLASSE_DE
  AlegacaoDeTerceiroDeBoaFe --> AvaliacaoPatrimonial : AVALIADA_POR
  AlegacaoDeTerceiroDeBoaFe --> Ativo : INCIDE_SOBRE
  AlegacaoDeTerceiroDeBoaFe --> IncidenteDeRestituicao : INSTRUI
  AlegacaoDeTerceiroDeBoaFe --> Pessoa : REQUERIDA_POR
  AlienacaoAntecipada --> DecisaoJudicial : AUTORIZADA_POR
  AlienacaoAntecipada --> FundamentoLegal : FUNDAMENTA_SE_EM
  AlienacaoAntecipada --> Ativo : INCIDE_SOBRE
  AnaliseDeCompatibilidadeEconomica --> Ativo : IDENTIFICA
  AnaliseDeCompatibilidadeEconomica --> StatusProbatorio : QUALIFICADO_POR
  AnaliseDeCompatibilidadeEconomica --> DeclaracaoFiscalDeRendaEPatrimonio : UTILIZA
  AnaliseDeCompatibilidadeEconomica --> ExtratoDeMovimentacaoFinanceira : UTILIZA
  AreaDeExecucaoOperacional --> AtorInstitucional : É_SUBCLASSE_DE
  AssercaoDeTitularidade --> RegistroPublicoDeBem : COMPROVADA_POR
  AssercaoDeTitularidade --> Pessoa : LIGA
  AssercaoDeTitularidade --> Ativo : LIGA
  AssercaoDeTitularidade --> Pessoa : TITULAR_ANTERIOR
  Ativo --> AvaliacaoPatrimonial : POSSUI
  Ativo --> StatusProbatorio : QUALIFICADO_POR
  Ativo --> RegistroPublicoDeBem : REGISTRADO_EM
  Ativo --> OrgaoDeGestaoPatrimonial : SOB_GESTÃO_DE
  AtivoDePropriedadeIntelectual --> Ativo : É_SUBCLASSE_DE
  AtivoFinanceiro --> InstituicaoFinanceira : CUSTODIADO_POR
  AtivoFinanceiro --> Ativo : É_SUBCLASSE_DE
  AtoNotarial --> TabelionatoDeNotas : LAVRADO_POR
  AtoNotarial --> Pessoa : TEM_PARTE
  AtoRegistral --> AtoNotarial : INSTRUMENTALIZADO_POR
  AtoRegistral --> Pessoa : TEM_PARTE
  AutoridadeCentral --> Jurisdição : PERTENCE_A
  AutoridadeCentral --> PedidoDeCooperacaoJuridicaInternacional : TRAMITA
  AutoridadeDecisoriaSobreDestinacao --> SistemaDeInformacao : REGISTRADO_EM
  AutoridadeDecisoriaSobreDestinacao --> AtorInstitucional : É_SUBCLASSE_DE
  AvaliacaoPatrimonial --> Ativo : AVALIA
  AvaliacaoPatrimonial --> ValorEconomicoDeAtivo : PRODUZ
  AvaliacaoPatrimonial --> Destinacao : SUBSIDIA
  AvaliacaoPatrimonial --> AlienacaoAntecipada : SUBSIDIA
  BemImovel --> MatriculaImobiliaria : DESCRITO_EM
  BemImovel --> Endereco : TEM_ENDERECO
  BemImovel --> Ativo : É_SUBCLASSE_DE
  BemMovel --> Pessoa : TITULAR_ANTERIOR
  BemMovel --> Ativo : É_SUBCLASSE_DE
  ContaBancaria --> AtivoFinanceiro : É_SUBCLASSE_DE
  Contrato --> Pessoa : BENEFICIA
  Contrato --> Ativo : REFERE_SE_A
  Contrato --> Jurisdição : REGIDO_POR
  Contrato --> Pessoa : TEM_PARTE
  Contrato --> ValorEconomicoDeAtivo : TEM_VALOR
  Correspondencia --> AutoridadeCentral : DIRIGIDA_A
  Correspondencia --> AutoridadeCentral : ENVIADA_POR
  Criptoativo --> Ativo : É_SUBCLASSE_DE
  DecisaoJudicial --> AlienacaoAntecipada : AUTORIZA
  DecisaoJudicial --> MedidaDeConstricao : DETERMINA
  DecisaoJudicial --> DecretoDePerdimento : DETERMINA
  DecisaoJudicial --> Destinacao : DETERMINA
  DecisaoJudicial --> ValorEconomicoDeAtivo : DETERMINA
  DeclaracaoFiscalDeRendaEPatrimonio --> PessoaFísica : DECLARADA_POR
  DecretoDePerdimento --> DecisaoJudicial : DECORRE_DE
  DecretoDePerdimento --> FundamentoLegal : FUNDAMENTA_SE_EM
  DecretoDePerdimento --> Destinacao : HABILITA
  DecretoDePerdimento --> Ativo : RECAI_SOBRE
  Destinacao --> EnteDestinatario : BENEFICIA
  Destinacao --> AutoridadeDecisoriaSobreDestinacao : DECIDIDA_POR
  Destinacao --> Ativo : DESTINA
  Destinacao --> AreaDeExecucaoOperacional : EXECUTADA_POR
  Destinacao --> AvaliacaoPatrimonial : EXIGE
  Destinacao --> Repatriacao : MATERIALIZA_SE_EM
  Divida --> Pessoa : TEM_CREDOR
  Divida --> Pessoa : TEM_DEVEDOR
  Divida --> ValorEconomicoDeAtivo : TEM_VALOR
  DossieDeBuscaPatrimonial --> Ativo : DESCREVE
  DossieDeBuscaPatrimonial --> Pessoa : TEM_ALVO
  Embarcação --> BemMovel : É_SUBCLASSE_DE
  Endereco --> CodigoPostal : TEM_CODIGO_POSTAL
  Exequatur --> OrgaoJudicial : CONCEDIDO_POR
  ExtratoDeMovimentacaoFinanceira --> LancamentoFinanceiro : COMPOSTO_POR
  ExtratoDeMovimentacaoFinanceira --> ContaBancaria : REFERE_SE_A
  IncidenteDeRestituicao --> Ativo : AFETA
  IncidenteDeRestituicao --> MedidaDeConstricao : QUESTIONA
  IndicacaoDeBeneficiarioFinal --> Pessoa : APONTA
  IndicacaoDeBeneficiarioFinal --> PessoaJurídica : REFERE_SE_A
  IndicacaoDeBeneficiarioFinal --> VinculoEntrePessoas : É_SUBCLASSE_DE
  IndicioFinanceiro --> ExtratoDeMovimentacaoFinanceira : EXTRAÍDO_DE
  IndicioFinanceiro --> StatusProbatorio : QUALIFICADO_POR
  InstituicaoFinanceira --> ExtratoDeMovimentacaoFinanceira : PRODUZ
  InstituicaoFinanceira --> PessoaJurídica : É_SUBCLASSE_DE
  InstrumentoJuridicoDeCooperacao --> RequisitoFormal : DEFINE
  InstrumentoJuridicoDeCooperacao --> ViaProcessual : DETERMINA
  InstrumentoJuridicoDeCooperacao --> Jurisdição : VINCULA
  InstrumentoJuridicoDeCooperacao --> DispositivoNormativo : É_COMPOSTO_POR
  Jurisdição --> RequisitoFormal : IMPÕE
  LancamentoFinanceiro --> IndicioFinanceiro : EVIDENCIA
  LancamentoFinanceiro --> Pessoa : TEM_CONTRAPARTE
  MatriculaImobiliaria --> AtoRegistral : CONTÉM
  MatriculaImobiliaria --> BemImovel : DESCREVE
  MatriculaImobiliaria --> Pessoa : TITULAR_ANTERIOR
  MatriculaImobiliaria --> RegistroPublicoDeBem : É_SUBCLASSE_DE
  MedidaDeConstricao --> ValorEconomicoDeAtivo : DETERMINA
  MedidaDeConstricao --> DecisaoJudicial : DETERMINADA_POR
  MedidaDeConstricao --> FundamentoLegal : FUNDAMENTA_SE_EM
  MedidaDeConstricao --> Ativo : RECAI_SOBRE
  MedidaDeConstricao --> OrgaoDeAcusacao : REQUERIDA_POR
  OrgaoDeAcusacao --> MedidaDeConstricao : REQUER
  OrgaoDeGestaoPatrimonial --> Ativo : ADMINISTRA
  OrgaoDeRegistroPublico --> RegistroPublicoDeBem : CUSTODIA
  OrgaoJudicial --> Jurisdição : PERTENCE_A
  OrgaoJudicial --> DecisaoJudicial : PROFERE
  ParticipacaoSocietaria --> PessoaJurídica : TEM_SOCIEDADE
  ParticipacaoSocietaria --> Pessoa : TEM_SÓCIO
  ParticipacaoSocietaria --> VinculoEntrePessoas : É_SUBCLASSE_DE
  PedidoDeCooperacaoJuridicaInternacional --> Jurisdição : ENVOLVE
  PedidoDeCooperacaoJuridicaInternacional --> InstrumentoJuridicoDeCooperacao : FUNDAMENTA_SE_EM
  PedidoDeCooperacaoJuridicaInternacional --> ValorEconomicoDeAtivo : INDICA
  PedidoDeCooperacaoJuridicaInternacional --> DocumentoDoPedido : INSTRUÍDO_POR
  PedidoDeCooperacaoJuridicaInternacional --> Pessoa : MENCIONA
  PedidoDeCooperacaoJuridicaInternacional --> Correspondencia : POSSUI
  PedidoDeCooperacaoJuridicaInternacional --> RespostaDeCooperacao : RECEBE
  PedidoDeCooperacaoJuridicaInternacional --> Ativo : REFERE_SE_A
  PedidoDeCooperacaoJuridicaInternacional --> MedidaDeConstricao : SOLICITA
  PedidoDeCooperacaoJuridicaInternacional --> PrazoDeResposta : SUJEITO_A
  PedidoDeCooperacaoJuridicaInternacional --> ViaProcessual : UTILIZA
  PedidoDeCooperacaoJuridicaInternacional --> ProcessoJudicial : VINCULA_SE_A
  Pessoa --> NomeEVarianteDeGrafia : DESIGNADA_POR
  Pessoa --> IdentificadorDePessoa : IDENTIFICADA_POR
  Pessoa --> ListaRestritiva : QUALIFICADO_POR
  Pessoa --> Ativo : TITULAR_DE
  PessoaFísica --> Endereco : TEM_ENDERECO
  PessoaFísica --> Pessoa : É_SUBCLASSE_DE
  PessoaJurídica --> Endereco : TEM_ENDERECO
  PessoaJurídica --> Pessoa : É_SUBCLASSE_DE
  ProcessoJudicial --> DecisaoJudicial : CONTÉM
  ProcessoJudicial --> Ativo : REFERENCIA
  ProcessoJudicial --> Pessoa : TEM_PARTE
  ProcessoJudicial --> OrgaoJudicial : É_CONDUZIDO_POR
  RedeDeCooperacaoInternacional --> AutoridadeCentral : CONGREGA
  RedeDeCooperacaoInternacional --> UnidadeDeInteligenciaFinanceira : CONGREGA
  RegistroPublicoDeBem --> Ativo : REFERE_SE_A
  Repatriacao --> ValorEconomicoDeAtivo : PRODUZ
  Repatriacao --> DecretoDePerdimento : RESULTA_DE
  Repatriacao --> Ativo : TRANSFERE
  RespostaDeCooperacao --> ValorEconomicoDeAtivo : PRODUZ
  RestricaoOuOnusSobreBem --> Pessoa : BENEFICIA
  RestricaoOuOnusSobreBem --> ProcessoJudicial : DECORRE_DE
  RestricaoOuOnusSobreBem --> Ativo : INCIDE_SOBRE
  SancaoIndividual --> ListaRestritiva : CONSTA_EM
  SancaoIndividual --> Pessoa : SANCIONA
  SistemaDeInformacao --> AtorInstitucional : OPERADO_POR
  SucessaoDeEntidade --> PessoaJurídica : TEM_DESTINO
  SucessaoDeEntidade --> PessoaJurídica : TEM_ORIGEM
  TabelionatoDeNotas --> AtorInstitucional : É_SUBCLASSE_DE
  UnidadeDeAssessoriaJuridica --> DecretoDePerdimento : ANALISA
  UnidadeDeAssessoriaJuridica --> AtorInstitucional : É_SUBCLASSE_DE
  UnidadeDeBuscaPatrimonial --> DossieDeBuscaPatrimonial : PRODUZ
  UnidadeDeBuscaPatrimonial --> AtorInstitucional : É_SUBCLASSE_DE
  UnidadeDeGestaoDeCarteira --> AtorInstitucional : É_SUBCLASSE_DE
  UnidadeDeInteligenciaFinanceira --> AtorInstitucional : É_SUBCLASSE_DE
  UnidadeDeTecnologiaEAutomacao --> AtorInstitucional : É_SUBCLASSE_DE
  ValorEconomicoDeAtivo --> TaxaDeCambioHistorica : CONVERTIDO_POR
  ValorMobiliario --> PessoaJurídica : EMITIDO_POR
  ValorMobiliario --> AtivoFinanceiro : É_SUBCLASSE_DE
  Veículo --> Endereco : TEM_ENDERECO
  Veículo --> BemMovel : É_SUBCLASSE_DE
  ViaProcessual --> Exequatur : EXIGE
  VinculoEntrePessoas --> Pessoa : TEM_DESTINO
  VinculoEntrePessoas --> Pessoa : TEM_ORIGEM
```

## Registro de fusões
- **Aeronave**: unificada a partir de 2 categorias — Classe recorrente nas categorias de ativos e registros..
- **AlegacaoDeTerceiroDeBoaFe**: unificada a partir de 3 categorias — Classe recorrente em constrição, gestão e processo..
- **AlienacaoAntecipada**: unificada a partir de 2 categorias — Classe recorrente nas categorias de constrição e valoração..
- **AnaliseDeCompatibilidadeEconomica**: unificada a partir de 2 categorias — Fusão de TesteDeCompatibilidadePatrimonial e AnáliseDeCompatibilidadeEconômica..
- **AssercaoDeTitularidade**: unificada a partir de 2 categorias — Fusão de TitularidadeDeBem e AsserçãoDeTitularidade..
- **Ativo**: unificada a partir de 7 categorias — Fusão de Ativo, Bem, AtivoPatrimonial, AtivoOuBem e BemSujeitoAMedida por equivalência conceitual..
- **AtoNotarial**: unificada a partir de 3 categorias — Classe recorrente nas categorias societária, registral e de valoração..
- **AtoRegistral**: unificada a partir de 3 categorias — Classe recorrente nas categorias registral e de valoração..
- **AtorInstitucional**: unificada a partir de 5 categorias — Fusão das superclasses AutoridadeCompetente, OrganizaçãoParticipante, OrganizaçãoInstitucional e ÓrgãoOuAtorProcessual..
- **AutoridadeCentral**: unificada a partir de 8 categorias — Fusão das denominações equivalentes de autoridade central..
- **AutoridadeDecisoriaSobreDestinacao**: unificada a partir de 2 categorias — Classe recorrente nas categorias de constrição e gestão..
- **AvaliacaoPatrimonial**: unificada a partir de 3 categorias — Classe recorrente nas categorias patrimonial, gerencial e de valoração..
- **BemImovel**: unificada a partir de 3 categorias — Classe recorrente nas categorias patrimonial, registral e de valoração..
- **Correspondencia**: unificada a partir de 3 categorias — Fusão de Correspondência, CorrespondênciaInternacional e ComunicaçãoOficial..
- **DecisaoJudicial**: unificada a partir de 6 categorias — Fusão das denominações gerais e de origem para decisão judicial..
- **DeclaracaoFiscalDeRendaEPatrimonio**: unificada a partir de 3 categorias — Fusão das denominações equivalentes usadas nas categorias de pessoas, finanças e valoração..
- **DecretoDePerdimento**: unificada a partir de 3 categorias — Fusão de DecretoDePerdimento, PerdimentoDeBem e DecisãoDePerdimento..
- **Destinacao**: unificada a partir de 2 categorias — Fusão de Destinação e DestinaçãoDeAtivo..
- **DocumentoDoPedido**: unificada a partir de 3 categorias — Fusão de DocumentoDoPedido, DocumentoDoFluxoInternacional e DocumentoInstrutório..
- **DossieDeBuscaPatrimonial**: unificada a partir de 6 categorias — Fusão de DossiêPatrimonial e DossiêDeBuscaPatrimonial..
- **Embarcação**: unificada a partir de 2 categorias — Classe recorrente nas categorias de ativos e registros..
- **Exequatur**: unificada a partir de 2 categorias — Fusão de Exequatur e AtoDeExequatur..
- **FundamentoLegal**: unificada a partir de 2 categorias — Fusão de FundamentoLegal e FundamentoLegalDoPerdimento..
- **IncidenteDeRestituicao**: unificada a partir de 2 categorias — Classe recorrente nas categorias de constrição e tramitação processual..
- **InstituicaoFinanceira**: unificada a partir de 3 categorias — Consolida instituições financeiras e custodiantes financeiros equivalentes..
- **InstrumentoJuridicoDeCooperacao**: unificada a partir de 6 categorias — Fusão de InstrumentoInternacional, InstrumentoDeCooperação, MarcoNormativoDeCooperação e denominações equivalentes..
- **Jurisdição**: unificada a partir de 4 categorias — Classe recorrente nas categorias de gestão, pessoas, marco normativo e cooperação..
- **ListaRestritiva**: unificada a partir de 2 categorias — Consolida ListaRestritiva e ListaDeSançõesInternacionais..
- **MatriculaImobiliaria**: unificada a partir de 3 categorias — Classe recorrente nas categorias de constrição, registros e valoração..
- **MedidaDeConstricao**: unificada a partir de 4 categorias — Fusão de MedidaDeConstrição, MedidaSobreBem, MedidaConstritiva e MedidaDeConstriçãoPatrimonial..
- **OrgaoDeAcusacao**: unificada a partir de 3 categorias — Classe recorrente nas categorias jurídica, financeira e processual..
- **OrgaoDeGestaoPatrimonial**: unificada a partir de 3 categorias — Classe recorrente nas categorias de constrição, gestão e valoração..
- **OrgaoDeRegistroPublico**: unificada a partir de 2 categorias — Consolida ÓrgãoDeRegistroPúblico e OrganizaçãoCustodianteDeRegistro..
- **OrgaoJudicial**: unificada a partir de 7 categorias — Fusão das denominações funcionais equivalentes de autoridade ou órgão judicial..
- **ParticipacaoSocietaria**: unificada a partir de 3 categorias — Consolida ParticipaçãoSocietária e VínculoSocietário..
- **PedidoDeCooperacaoJuridicaInternacional**: unificada a partir de 8 categorias — Conceito central recorrente e consolidado entre oito categorias DKC..
- **Pessoa**: unificada a partir de 6 categorias — Fusão de Pessoa, PessoaOuEntidadeDeInteresse e PessoaEnvolvida..
- **PessoaFísica**: unificada a partir de 3 categorias — Fusão de PessoaNatural e PessoaFísica..
- **PessoaJurídica**: unificada a partir de 3 categorias — Classe recorrente nas categorias de pessoas, finanças e registros..
- **PrazoDeResposta**: unificada a partir de 3 categorias — Fusão de PrazoDeResposta, PrazoDeRespostaPrevisto e PrazoOuControleDeAndamento..
- **ProcessoJudicial**: unificada a partir de 4 categorias — Conceito recorrente consolidado entre categorias DKC..
- **RedeDeCooperacaoInternacional**: unificada a partir de 3 categorias — Fusão de RedeInternacionalDeCooperação, RedeDeCooperaçãoInternacional e RedeDeCooperaçãoInterinstitucional..
- **RegistroPublicoDeBem**: unificada a partir de 2 categorias — Fusão de RegistroPúblicoDeBem e RegistroPúblicoDeBens..
- **RequisitoFormal**: unificada a partir de 3 categorias — Fusão de RequisitoFormal e ExigênciaFormalDeJurisdição..
- **RespostaDeCooperacao**: unificada a partir de 3 categorias — Fusão de RespostaDeAutoridadeEstrangeira, RespostaDeCooperação e RetornoDePedidoDeCooperação..
- **RestricaoOuOnusSobreBem**: unificada a partir de 2 categorias — Classe genérica modelada na categoria registral..
- **SistemaDeInformacao**: unificada a partir de 7 categorias — Fusão de SistemaDeInformação, SistemaOuBaseDeDados e fontes genéricas equivalentes..
- **StatusProbatorio**: unificada a partir de 2 categorias — Classe transversal recorrente nas categorias patrimonial e financeira..
- **TaxaDeCambioHistorica**: unificada a partir de 2 categorias — Classe recorrente nas categorias financeira e de valoração..
- **UnidadeDeAssessoriaJuridica**: unificada a partir de 5 categorias — Fusão das unidades e áreas jurídicas equivalentes modeladas nas categorias..
- **UnidadeDeBuscaPatrimonial**: unificada a partir de 5 categorias — Fusão de órgão/unidade de busca patrimonial e unidade operacional equivalente..
- **UnidadeDeGestaoDeCarteira**: unificada a partir de 5 categorias — Fusão das denominações de coordenação, direção e unidade de gestão de carteira..
- **UnidadeDeInteligenciaFinanceira**: unificada a partir de 6 categorias — Classe recorrente em várias categorias DKC..
- **UnidadeDeTecnologiaEAutomacao**: unificada a partir de 5 categorias — Fusão das denominações equivalentes de tecnologia, dados e automação..
- **ValorEconomicoDeAtivo**: unificada a partir de 2 categorias — Consolida o conceito geral de valor monetário e econômico das categorias financeiras e de valoração..
- **Veículo**: unificada a partir de 2 categorias — Fusão de VeículoAutomotor e Veículo..
- **ViaProcessual**: unificada a partir de 2 categorias — Classe recorrente nas categorias normativa e de cooperação..
- **VinculoEntrePessoas**: unificada a partir de 2 categorias — Classe recorrente nas categorias societária e de cooperação..
