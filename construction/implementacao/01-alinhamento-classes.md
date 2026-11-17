# Alinhamento de classes (EOA) — recuperacao-ativos

> Subfase EOA, passo 1 (TORRES et al., 2024, seção 4.1.2.1; formato da Table 4.2).
> Insumos: `especificacao/04-ontologia-preliminar.md` (81 classes mantidas na DKD) e `especificacao/05-reuso-ontologias.md` (92 correspondências mantidas na revisão ORR).
> Proposta gerada por: claude-sonnet-5 (anthropic), em 2026-10-05T15:44:08.288Z.
> Revisão humana no painel: 86 linha(s) mantida(s), 10 descartada(s), 8 adicionada(s) manualmente. Gravado em 2026-10-06.

## 1. Ontologias alinhadas

| Sigla | Ontologia | Modo de reuso | Pares mantidos |
|---|---|---|---|
| ACO | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | desenho | 14 |
| FIBO | FIBO | owl | 19 |
| FOAF | FOAF (Friend of a Friend) | owl | 3 |
| FTM | FollowTheMoney | skos | 27 |
| ORG | W3C Organization Ontology (ORG) | owl | 9 |
| PROV-O | PROV-O | owl | 3 |
| REGORG | W3C Registered Organization Vocabulary (REGORG) | owl | 1 |
| schema | schema.org | owl | 4 |
| SUMO | SUMO / SUMO-F (Suggested Upper Merged Ontology) | desenho | 6 |

## 2. Tabela de alinhamento de classes (Table 4.2)

Tipos: ≡ equivalente · ⊑ o nosso é mais específico · ⊒ o nosso é mais amplo · ≈ correspondência próxima · desenho = só inspiração de desenho, sem IRI. `-` = sem correspondência mantida. `⊂ X` = `É_SUBCLASSE_DE X` na DKD; a tabela segue essa hierarquia.

| Conceito (DKD) | Definição formal | ACO | FIBO | FOAF | FTM | ORG | PROV-O | REGORG | schema | SUMO |
|---|---|---|---|---|---|---|---|---|---|---|
| **AlegacaoDeTerceiroDeBoaFe** | Alegação de terceiro que sustenta boa-fé em relação a um ativo ou medida, requerida por uma pessoa, com data, efeito sobre a destinação e status de pendente, resolvida ou julgada. | - | claim (⊑) | - | - | - | - | - | - | - |
| **AlienacaoAntecipada** | Alienação de um ativo realizada antes da conclusão definitiva do fluxo ordinário, autorizada por decisão judicial, fundamentada em fundamento legal e motivada por deterioração, desvalorização ou custo de manutenção. | - | - | - | - | - | - | - | - | - |
| **AnaliseDeCompatibilidadeEconomica** | Avaliação que verifica a compatibilidade entre renda considerada, patrimônio, movimentação financeira e lastro alegado, utilizando declaração fiscal e extrato de movimentação financeira, com resultado compatível ou incompatível. | - | - | - | - | - | - | - | - | - |
| **AssercaoDeTitularidade** | Afirmação reificada de titularidade de uma pessoa sobre um ativo, comprovada por registro público de bem, com tipo de titularidade, valor declarado e data de transmissão. | - | - | - | Ownership (⊑) | - | - | - | - | - |
| **Ativo** | Bem ou ativo patrimonial sujeito a identificação, titularidade, valoração, constrição, perdimento ou destinação, descrito, localizado em jurisdição e qualificado por situação jurídica. | Asset (desenho) | - | - | Asset (⊑) | - | - | - | - | FinancialAsset (desenho) |
| **AtivoDePropriedadeIntelectual** ⊂ Ativo | Ativo especializado para direitos de propriedade intelectual, identificado por registro de processo e tipo. | IntelectualProperty (desenho) | - | - | - | - | - | - | - | Patent (desenho) |
| **AtivoFinanceiro** ⊂ Ativo | Ativo especializado para recursos ou instrumentos financeiros, custodiado por uma instituição financeira. | FinancialAsset (desenho) | financial instrument (⊒) | - | - | - | - | - | - | - |
| **ContaBancaria** ⊂ AtivoFinanceiro | Ativo financeiro especializado associado a titular e instituição custodiante, identificado por agência e número da conta. | - | account (⊑) | - | BankAccount (≡) | - | - | - | - | - |
| **ValorMobiliario** ⊂ AtivoFinanceiro | Ativo financeiro especializado na forma de instrumento negociável emitido por uma pessoa jurídica, identificado por ISIN, ticker e tipo. | - | security (≡) | - | Security (≡) | - | - | - | - | - |
| **BemImovel** ⊂ Ativo | Ativo especializado para bens imóveis, descrito em matrícula imobiliária, com endereço, número de matrícula e valor cadastral. | RealEstate (desenho) | - | - | RealEstate (≡) | - | - | - | - | RealEstate (desenho) |
| **BemMovel** ⊂ Ativo | Ativo especializado para bens físicos móveis e registráveis, com histórico de titular anterior, em contraste com bens imóveis. | - | - | - | - | - | - | - | - | - |
| **Aeronave** ⊂ BemMovel | Aeronave é um bem móvel especializado por ser operada por uma pessoa e identificada por marca de nacionalidade e matrícula. | Aircraft (desenho) | - | - | Airplane (≡) | - | - | - | - | - |
| **Embarcação** ⊂ BemMovel | Bem móvel especializado para embarcações, identificado por inscrição e nome da embarcação. | Watercraft (desenho) | - | - | Vessel (≡) | - | - | - | - | - |
| **Veículo** ⊂ BemMovel | Bem móvel especializado para veículos automotores com endereço associado, identificado por chassi, placa e RENAVAM. | MotorVehicle (desenho) | - | - | Vehicle (≡) | - | - | - | - | - |
| **Criptoativo** ⊂ Ativo | Ativo especializado para ativo virtual observado como reserva de valor e objeto de investigação patrimonial, caracterizado por blockchain, carteira e saldo. | CryptoWallet (desenho) | - | - | CryptoWallet (≡) | - | - | - | - | - |
| **AtoNotarial** | Ato lavrado por um tabelionato de notas relacionado a pessoas, representação, titularidade ou transmissão de bens, com data e tipo de ato. | - | - | - | - | - | - | - | - | - |
| **AtoRegistral** | Ato de registro, transmissão ou averbação relacionado a um bem, instrumentalizado por um ato notarial, com data, natureza e valor declarado. | - | - | - | - | - | - | - | - | - |
| **AtorInstitucional** | Órgão, organização ou unidade que atua na produção, custódia, decisão ou consumo de informação, caracterizado por denominação, jurisdição, papel no fluxo e tipo institucional. | - | - | - | - | Organization (⊑) | - | - | - | - |
| **AreaDeExecucaoOperacional** ⊂ AtorInstitucional | Ator institucional especializado por ser responsável por materializar a destinação decidida para o ativo. | - | - | - | - | OrganizationalUnit (⊑) | - | - | - | - |
| **AutoridadeDecisoriaSobreDestinacao** ⊂ AtorInstitucional | Ator institucional especializado por ser a instância administrativa ou colegiada responsável por decidir a destinação de ativos, registrada em um sistema de informação. | - | - | - | - | - | - | - | - | - |
| **TabelionatoDeNotas** ⊂ AtorInstitucional | Ator institucional especializado por ser a serventia extrajudicial responsável por lavrar atos notariais, como escrituras, procurações e afins. | - | - | - | - | - | - | - | - | - |
| **UnidadeDeAssessoriaJuridica** ⊂ AtorInstitucional | Ator institucional especializado em análise jurídica de perdimento, destinação ou cooperação, que analisa decretos de perdimento. | - | - | - | - | OrganizationalUnit (⊑) | - | - | - | - |
| **UnidadeDeBuscaPatrimonial** ⊂ AtorInstitucional | Ator institucional especializado responsável pela localização e individualização de bens e pessoas, que produz dossiês de busca patrimonial. | - | - | - | - | OrganizationalUnit (⊑) | - | - | - | - |
| **UnidadeDeGestaoDeCarteira** ⊂ AtorInstitucional | Ator institucional especializado responsável pela gestão, priorização, cobrança e escalonamento da carteira. | - | - | - | - | OrganizationalUnit (⊑) | - | - | - | - |
| **UnidadeDeInteligenciaFinanceira** ⊂ AtorInstitucional | Ator institucional especializado responsável pela produção e intercâmbio de inteligência financeira, caracterizado por forma de entrega do produto e papel desempenhado. | - | - | - | PublicBody (⊑) | - | - | - | - | - |
| **UnidadeDeTecnologiaEAutomacao** ⊂ AtorInstitucional | Ator institucional especializado responsável por parsing, extração, validação, integração e geração de minutas. | - | - | - | - | OrganizationalUnit (⊑) | - | - | - | - |
| **AutoridadeCentral** | Autoridade central, nacional ou estrangeira, pertencente a uma jurisdição, responsável pela tramitação ou intermediação da cooperação, atuando como requerente, requerida ou intermediadora. | - | - | - | - | - | - | - | - | - |
| **AvaliacaoPatrimonial** | Avaliação que atribui valor a um ativo em determinada data, moeda, tipo e fonte, subsidiando a destinação ou a alienação antecipada e produzindo um valor econômico de ativo. | - | - | - | - | - | - | - | - | - |
| **CodigoPostal** | Código associado a um endereço que identifica, em texto livre e sem formato fixo por país, código, município, estado e país. | PostalCode (desenho) | postcode (≡) | - | - | - | - | - | - | - |
| **Contrato** | Acordo voluntário e juridicamente vinculante entre partes competentes, com contraprestação, objeto, datas de execução e vigência e jurisdição que o rege, podendo ser veículo de ocultação quando simulado. | - | contract (≡) | - | Contract (⊒) | - | - | - | - | - |
| **Correspondencia** | Comunicação do fluxo, como e-mail, ofício ou nota verbal, enviada por e dirigida a autoridades centrais, com conteúdo, tipo, data de envio e data de recebimento. | - | - | - | Message (⊑) | - | - | - | - | - |
| **DecisaoJudicial** | Pronunciamento judicial que determina, confirma ou fundamenta efeitos sobre pessoas e ativos, com data, dispositivo, fundamentação, tipo e indicação de trânsito em julgado. | - | - | - | - | - | - | - | - | - |
| **DeclaracaoFiscalDeRendaEPatrimonio** | Declaração fiscal, declarada por pessoa física, que registra renda, patrimônio, exercício e eventuais retificações. | - | - | - | TaxRoll (≡) | - | - | - | - | - |
| **DecretoDePerdimento** | Perdimento decretado sobre um ativo, decorrente de decisão judicial e fundamentado em fundamento legal, com data, modalidade ordinária ou antecipada e status de decretado, destinação pendente ou concluída. | - | - | - | - | - | - | - | - | - |
| **Destinacao** | Processo de destinação de um ativo após a consolidação do perdimento, decidido por autoridade decisória, executado por área de execução operacional e que beneficia um ente destinatário. | - | - | - | - | - | - | - | - | - |
| **DispositivoNormativo** | Dispositivo de norma ou instrumento jurídico que regula ou fundamenta uma medida, identificado por referência de artigo ou parágrafo e pelo objeto regulado (bloqueio, sequestro, confisco, perdimento, repatriação ou repartição). | - | regulation (≈) | - | - | - | - | - | - | - |
| **Divida** | Obrigação financeira de um devedor perante um credor, com data de início, data de fim e taxa de juros, que fundamenta a recuperação de ativos. | - | - | - | Debt (≡) | - | - | - | - | - |
| **DocumentoDoPedido** | Documento que instrui ou integra um pedido de cooperação, caracterizado por tipo, data, idioma, situação de apostilamento ou legalização e indicação de tradução. | - | - | - | Document (⊑) | - | - | - | - | - |
| **DossieDeBuscaPatrimonial** | Dossiê que descreve ativos e tem como alvo uma pessoa, consolidando data de corte, grau de confiança, pendências e título que fundamenta a busca. | - | - | - | - | - | - | - | - | - |
| **Endereco** | Endereço físico associado a um bem, pessoa física ou pessoa jurídica, representado em texto livre e associado a um código postal. | PhysicalAddress (desenho) | physical address (≡) | - | - | - | - | - | PostalAddress (≈) | - |
| **EnteDestinatario** | Pessoa, fundo, ente público ou estrangeiro beneficiário de uma destinação, caracterizado pelo tipo de destinatário (fundo, vítimas, erário ou ente estrangeiro). | - | - | - | - | - | - | - | - | - |
| **Exequatur** | Ato ou autorização judicial, concedido por um órgão judicial, que habilita o cumprimento de uma carta rogatória, com objeto e sentido de fluxo ativo ou passivo. | - | - | - | - | - | - | - | - | - |
| **ExtratoDeMovimentacaoFinanceira** | Conjunto de lançamentos de movimentação financeira, referente a uma conta bancária e composto por lançamentos financeiros, obtido sob condições específicas de acesso. | - | account statement (⊑) | - | - | - | - | - | - | - |
| **FundamentoLegal** | Referência normativa usada para fundamentar uma medida, perdimento ou decisão, caracterizada por aplicação por bem, referência normativa e tipo de origem do bem. | - | - | - | - | - | - | - | - | - |
| **IdentificadorDePessoa** | Identificador utilizado para distinguir ou relacionar pessoas entre fontes e jurisdições, caracterizado por tipo, valor, jurisdição de emissão e organização emissora. | - | identity document (≈) | - | Identification (⊑) | - | - | - | - | - |
| **IncidenteDeRestituicao** | Incidente em que um terceiro ou interessado questiona uma medida de constrição ou afeta um ativo, com data de instauração, resultado e status. | - | - | - | - | - | - | - | - | - |
| **IndicioFinanceiro** | Fenômeno ou padrão observado em dados de movimentação financeira, extraído de um extrato de movimentação financeira e qualificado por status probatório, com tipo, descrição e período de referência. | - | - | - | - | - | - | - | - | - |
| **InstrumentoJuridicoDeCooperacao** | Instrumento normativo de cooperação, incluindo convenções, tratados e reciprocidade, que define requisitos formais, determina vias processuais e vincula jurisdições. | - | - | - | - | - | - | - | - | - |
| **Jurisdição** | País ou ordenamento envolvido no ativo, na pessoa, na fonte ou na cooperação, caracterizado por nome ou código, taxa de sucesso e tempo médio de resposta. | - | polity (⊑) | - | Territory (≈) | - | - | - | - | - |
| **LancamentoFinanceiro** | Unidade de movimentação observada em um extrato financeiro, com data, modalidade, moeda e valor, que evidencia um indício financeiro e tem uma pessoa como contraparte. | - | individual transaction (≡) | - | Payment (≈) | - | - | - | - | FinancialTransaction (desenho) |
| **ListaRestritiva** | Lista de sanções ou restrições emitida por uma organização nacional ou internacional, caracterizada por organização emissora, tipo de lista e regime de sanção. | - | - | - | - | - | - | - | - | - |
| **MedidaDeConstricao** | Medida assecuratória ou constritiva que limita disponibilidade, transferência ou posse de um ativo, determinada por decisão judicial, fundamentada em fundamento legal e requerida por órgão de acusação. | - | - | - | - | - | - | - | - | - |
| **NomeEVarianteDeGrafia** | Forma nominal associada a uma pessoa, caracterizada por forma de grafia, idioma ou origem, indicador de ambiguidade e tipo de variante (grafia divergente, homônimo, alias, transliteração ou tradução). | - | person name (⊑) | - | - | - | - | - | - | - |
| **OrgaoDeAcusacao** | Órgão responsável por requerer medidas de constrição no fluxo de recuperação de ativos, caracterizado por atribuição patrimonial e esfera de atuação. | - | - | - | - | - | - | - | - | - |
| **OrgaoDeGestaoPatrimonial** | Órgão responsável pela administração de ativos submetidos à gestão patrimonial, caracterizado por interface de identificação do bem sob gestão. | - | - | - | - | - | - | - | - | - |
| **OrgaoDeRegistroPublico** | Organização custodiante de registros públicos de bem, caracterizada por abrangência territorial e tipo de órgão ou serventia. | - | business registration authority (⊒) | - | - | - | - | - | - | - |
| **OrgaoJudicial** | Órgão pertencente a uma jurisdição que conduz processo, profere decisão e concede exequatur, caracterizado por comarca ou seção, esfera e competência e instância. | - | judiciary (≈) | - | - | - | - | - | - | - |
| **PedidoDeCooperacaoJuridicaInternacional** | Pedido que envolve jurisdições para informação ou execução de medida relacionada à recuperação de ativos, caracterizado por direção ativa ou passiva, fase do fluxo, status e datas de envio, recebimento e resposta. | - | - | - | - | - | - | - | - | - |
| **Pessoa** | Pessoa física ou jurídica envolvida em titularidades, vínculos, processos, pedidos ou buscas patrimoniais, caracterizada por nome principal, papel no caso e grau de certeza da identidade. | Party (desenho) | - | Agent (⊑) | LegalEntity (⊑) | - | Agent (⊑) | - | - | - |
| **PessoaFísica** ⊂ Pessoa | Pessoa especializada para pessoa natural, caracterizada por data de nascimento, estado civil, indicador de pessoa exposta politicamente, município de referência, dentre outras informações. | Person (desenho) | person (≡) | Person (≡) | Person (⊑) | - | Person (⊑) | - | Person (≡) | Human (desenho) |
| **PessoaJurídica** ⊂ Pessoa | Pessoa especializada para organizações com personalidade jurídica, caracterizada por razão social, nome fantasia, data de constituição, jurisdição de constituição e natureza da estrutura (sociedade, holding, offshore ou trust). | Organization (desenho) | - | Organization (⊑) | Company (⊒) | FormalOrganization (⊑) | Organization (⊑) | RegisteredOrganization (≡) | Organization (⊑) | Organization (desenho) |
| **InstituicaoFinanceira** ⊂ PessoaJurídica | Pessoa jurídica especializada custodiante de conta ou ativo financeiro e potencial executora de medida, caracterizada por jurisdição de funcionamento e papel de custódia, produção de dados ou execução de bloqueio. | - | financial institution (≡) | - | - | - | - | - | - | - |
| **PrazoDeResposta** | Prazo associado ao atendimento, resposta ou andamento de um pedido, caracterizado por data de início, data-limite, origem do prazo e situação em curso, vencido ou sem resposta. | - | - | - | - | - | - | - | - | - |
| **ProcessoJudicial** | Processo conduzido por um órgão judicial em que se registram partes, decisões e referências a ativos, caracterizado por número do processo, juízo ou vara, fase processual e trânsito em julgado. | LawSuit (desenho) | - | - | CourtCase (≡) | - | - | - | - | - |
| **RedeDeCooperacaoInternacional** | Rede que congrega autoridades centrais e unidades de inteligência financeira como canal complementar de cooperação, caracterizada por denominação e natureza informal ou complementar do canal. | - | - | - | - | OrganizationalCollaboration (≡) | - | - | - | - |
| **RegistroPublicoDeBem** | Registro público que se refere a um ativo, identificando o bem e seus elementos registrais, caracterizado por identificador do bem no registro, restrição judicial anotada e tipo de registro. | - | - | - | - | - | - | - | - | - |
| **MatriculaImobiliaria** ⊂ RegistroPublicoDeBem | Registro público de bem especializado que descreve um imóvel e seu titular anterior, contendo atos registrais, com data do último ato. | - | - | - | - | - | - | - | - | - |
| **Repatriacao** | Retorno de um ativo de outra jurisdição, resultante de um decreto de perdimento, que transfere o ativo e produz um valor econômico, caracterizado por data de retorno, país de origem e condição de partilha. | - | - | - | - | - | - | - | - | - |
| **RequisitoFormal** | Exigência formal imposta por uma jurisdição ou instrumento de cooperação, caracterizada por tipo de requisito (tradução, apostilamento, autenticação, formato ou detalhamento), obrigatoriedade e caráter bloqueante. | - | - | - | - | - | - | - | - | - |
| **RespostaDeCooperacao** | Resposta recebida de uma autoridade ou jurisdição em decorrência de um pedido de cooperação, que produz um valor econômico de ativo, caracterizada por conteúdo substantivo, data de recebimento e jurisdição respondente. | - | - | - | - | - | - | - | - | - |
| **RestricaoOuOnusSobreBem** | Restrição ou ônus que incide sobre um ativo, decorrente de processo judicial e que beneficia uma pessoa, caracterizado por data de início, situação e tipo de restrição. | - | - | - | - | - | - | - | - | - |
| **SancaoIndividual** | Registro de sanção imposta a uma pessoa por uma autoridade sob um programa, constando em uma lista restritiva, com motivo, datas de início e fim e status. | - | - | - | Sanction (≡) | - | - | - | - | - |
| **SistemaDeInformacao** | Sistema, base ou fonte operado por um ator institucional que armazena, organiza ou fornece dados do domínio, caracterizado por grau de estruturação, nível de acesso e tipo de artefato. | - | - | - | - | - | - | - | - | - |
| **StatusProbatorio** | Qualificação do estágio ou força probatória atribuída a uma informação, indício ou resultado, caracterizada por valor (confirmado, provável, hipótese ou estágio equivalente), data de corte e justificativa. | - | - | - | - | - | - | - | - | - |
| **SucessaoDeEntidade** | Evento de fusão, cisão, incorporação ou reestruturação que liga uma ou mais pessoas jurídicas de origem às pessoas jurídicas de destino, caracterizado por data do evento e tipo de evento. | - | - | - | Succession (≡) | ChangeEvent (≡) | - | - | - | - |
| **TaxaDeCambioHistorica** | Taxa aplicável à conversão de valores em determinada data, caracterizada por moeda de origem, moeda de destino, data da cotação e fonte oficial. | - | exchange rate (≡) | - | - | - | - | - | - | - |
| **ValorEconomicoDeAtivo** | Expressão monetária associada a um ativo, medida, dano, bloqueio ou avaliação, convertida por taxa de câmbio histórica, caracterizada por quantia, moeda, tipo de valor, data de referência, grau de confiança e origem do valor. | - | monetary amount (⊑) | - | - | - | - | - | MonetaryAmount (⊑) | - |
| **ViaProcessual** | Via jurídica ou administrativa que exige exequatur para tramitar a cooperação, caracterizada por critério de cabimento e tipo (auxílio direto, carta rogatória, via diplomática ou rede). | - | - | - | - | - | - | - | - | - |
| **VinculoEntrePessoas** | Relação reificada entre pessoas, caracterizada por tipo de vínculo (societário, controle, representação, parentesco ou interposição), datas de início e fim, grau de confiança, proveniência e, quando conjugal, regime de bens. | - | - | - | Associate (⊒) | - | - | - | - | - |
| **IndicacaoDeBeneficiarioFinal** ⊂ VinculoEntrePessoas | Vínculo entre pessoas especializado que aponta uma pessoa como beneficiário final ou titular de fato de uma pessoa jurídica, com grau de confiança, origem da indicação e natureza da titularidade. | - | - | - | Control (⊑) | - | - | - | - | - |
| **ParticipacaoSocietaria** ⊂ VinculoEntrePessoas | Vínculo entre pessoas especializado que liga uma pessoa a uma pessoa jurídica como sociedade, caracterizado por data de entrada, data de saída, percentual de participação e qualificação do sócio. | - | - | - | Ownership (⊑) | - | - | - | - | - |

## 3. Referência e tipo por conceito

A referência principal de um conceito é a ontologia com correspondência ≡; deriva dos tipos decididos, não é campo próprio.

| Conceito | Referência principal | Mapeamentos mantidos |
|---|---|---|
| AlegacaoDeTerceiroDeBoaFe | — (nenhuma correspondência ≡) | FIBO ⊑ claim |
| AssercaoDeTitularidade | — (nenhuma correspondência ≡) | FTM ⊑ Ownership |
| Ativo | — (nenhuma correspondência ≡) | ACO desenho Asset; FTM ⊑ Asset; SUMO desenho FinancialAsset |
| AtivoDePropriedadeIntelectual | — (nenhuma correspondência ≡) | ACO desenho IntelectualProperty; SUMO desenho Patent |
| AtivoFinanceiro | — (nenhuma correspondência ≡) | ACO desenho FinancialAsset; FIBO ⊒ financial instrument |
| ContaBancaria | FTM | FIBO ⊑ account; FTM ≡ BankAccount |
| ValorMobiliario | FIBO, FTM | FIBO ≡ security; FTM ≡ Security |
| BemImovel | FTM | ACO desenho RealEstate; FTM ≡ RealEstate; SUMO desenho RealEstate |
| Aeronave | FTM | ACO desenho Aircraft; FTM ≡ Airplane |
| Embarcação | FTM | ACO desenho Watercraft; FTM ≡ Vessel |
| Veículo | FTM | ACO desenho MotorVehicle; FTM ≡ Vehicle |
| Criptoativo | FTM | ACO desenho CryptoWallet; FTM ≡ CryptoWallet |
| AtorInstitucional | — (nenhuma correspondência ≡) | ORG ⊑ Organization |
| AreaDeExecucaoOperacional | — (nenhuma correspondência ≡) | ORG ⊑ OrganizationalUnit |
| UnidadeDeAssessoriaJuridica | — (nenhuma correspondência ≡) | ORG ⊑ OrganizationalUnit |
| UnidadeDeBuscaPatrimonial | — (nenhuma correspondência ≡) | ORG ⊑ OrganizationalUnit |
| UnidadeDeGestaoDeCarteira | — (nenhuma correspondência ≡) | ORG ⊑ OrganizationalUnit |
| UnidadeDeInteligenciaFinanceira | — (nenhuma correspondência ≡) | FTM ⊑ PublicBody |
| UnidadeDeTecnologiaEAutomacao | — (nenhuma correspondência ≡) | ORG ⊑ OrganizationalUnit |
| CodigoPostal | FIBO | ACO desenho PostalCode; FIBO ≡ postcode |
| Contrato | FIBO | FIBO ≡ contract; FTM ⊒ Contract |
| Correspondencia | — (nenhuma correspondência ≡) | FTM ⊑ Message |
| DeclaracaoFiscalDeRendaEPatrimonio | FTM | FTM ≡ TaxRoll |
| DispositivoNormativo | — (nenhuma correspondência ≡) | FIBO ≈ regulation |
| Divida | FTM | FTM ≡ Debt |
| DocumentoDoPedido | — (nenhuma correspondência ≡) | FTM ⊑ Document |
| Endereco | FIBO | ACO desenho PhysicalAddress; FIBO ≡ physical address; schema ≈ PostalAddress |
| ExtratoDeMovimentacaoFinanceira | — (nenhuma correspondência ≡) | FIBO ⊑ account statement |
| IdentificadorDePessoa | — (nenhuma correspondência ≡) | FIBO ≈ identity document; FTM ⊑ Identification |
| Jurisdição | — (nenhuma correspondência ≡) | FIBO ⊑ polity; FTM ≈ Territory |
| LancamentoFinanceiro | FIBO | FIBO ≡ individual transaction; FTM ≈ Payment; SUMO desenho FinancialTransaction |
| NomeEVarianteDeGrafia | — (nenhuma correspondência ≡) | FIBO ⊑ person name |
| OrgaoDeRegistroPublico | — (nenhuma correspondência ≡) | FIBO ⊒ business registration authority |
| OrgaoJudicial | — (nenhuma correspondência ≡) | FIBO ≈ judiciary |
| Pessoa | — (nenhuma correspondência ≡) | ACO desenho Party; FOAF ⊑ Agent; FTM ⊑ LegalEntity; PROV-O ⊑ Agent |
| PessoaFísica | FIBO, FOAF, schema | ACO desenho Person; FIBO ≡ person; FOAF ≡ Person; FTM ⊑ Person; PROV-O ⊑ Person; SUMO desenho Human; schema ≡ Person |
| PessoaJurídica | REGORG | ACO desenho Organization; FOAF ⊑ Organization; FTM ⊒ Company; PROV-O ⊑ Organization; SUMO desenho Organization; ORG ⊑ FormalOrganization; REGORG ≡ RegisteredOrganization; schema ⊑ Organization |
| InstituicaoFinanceira | FIBO | FIBO ≡ financial institution |
| ProcessoJudicial | FTM | ACO desenho LawSuit; FTM ≡ CourtCase |
| RedeDeCooperacaoInternacional | ORG | ORG ≡ OrganizationalCollaboration |
| SancaoIndividual | FTM | FTM ≡ Sanction |
| SucessaoDeEntidade | FTM, ORG | FTM ≡ Succession; ORG ≡ ChangeEvent |
| TaxaDeCambioHistorica | FIBO | FIBO ≡ exchange rate |
| ValorEconomicoDeAtivo | — (nenhuma correspondência ≡) | FIBO ⊑ monetary amount; schema ⊑ MonetaryAmount |
| VinculoEntrePessoas | — (nenhuma correspondência ≡) | FTM ⊒ Associate |
| IndicacaoDeBeneficiarioFinal | — (nenhuma correspondência ≡) | FTM ⊑ Control |
| ParticipacaoSocietaria | — (nenhuma correspondência ≡) | FTM ⊑ Ownership |

Classes sem correspondência externa mantida (34): AlienacaoAntecipada, AnaliseDeCompatibilidadeEconomica, AtoNotarial, AtoRegistral, AutoridadeCentral, AutoridadeDecisoriaSobreDestinacao, AvaliacaoPatrimonial, BemMovel, DecisaoJudicial, DecretoDePerdimento, Destinacao, DossieDeBuscaPatrimonial, EnteDestinatario, Exequatur, FundamentoLegal, IncidenteDeRestituicao, IndicioFinanceiro, InstrumentoJuridicoDeCooperacao, ListaRestritiva, MatriculaImobiliaria, MedidaDeConstricao, OrgaoDeAcusacao, OrgaoDeGestaoPatrimonial, PedidoDeCooperacaoJuridicaInternacional, PrazoDeResposta, RegistroPublicoDeBem, Repatriacao, RequisitoFormal, RespostaDeCooperacao, RestricaoOuOnusSobreBem, SistemaDeInformacao, StatusProbatorio, TabelionatoDeNotas, ViaProcessual.

## 4. Correspondências descartadas

| Conceito | Ontologia | Termo externo | Tipo proposto | Justificativa |
|---|---|---|---|---|
| AssercaoDeTitularidade | ACO | own | desenho | Object property de posse de Asset na ACO, sem os atributos de valor declarado e tipo de titularidade. |
| CodigoPostal | schema | PostalAddress | ≈ | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: schema:PostalAddress é o endereço inteiro (streetAddress, addressLocality, addressRegion, postalCode, addressCountry), não o código postal. O par foi posto em CodigoPostal quando município, estado e país ficavam nessa classe; com os AJ-63/64/65 esses campos voltaram a Endereco, e a correspondência próxima passa a ser de Endereco (FIBO PhysicalAddress ≡ Endereco já cobre o mesmo recorte). O código postal corresponde à propriedade schema:postalCode, não a uma classe. |
| IndicioFinanceiro | FTM | Risk | ⊑ | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: O par FTM Risk ("indicador de risco associado a entidade com descrição, topics e data") passou ao gênero Indicio (AJ de criação), de que IndicioFinanceiro é espécie; manter os dois duplicaria o alinhamento. |
| NomeEVarianteDeGrafia | FTM | alias | ≡ | alias/previousName/weakAlias em Thing/LegalEntity cobrem variantes, mas como atributos, sem idioma nem indicador de ambiguidade. |
| ParticipacaoSocietaria | FIBO | has shareholder | ≡ | Relação emissor–acionista (com holds shares in inversa); sem percentual nem datas. |
| Pessoa | PROV-O | prov:Agent | ≡ | Agente que assume responsabilidade; superclasse de prov:Person e prov:Organization. |
| PessoaFísica | PROV-O | prov:Person | ≡ | Agente pessoa física para atribuição de responsabilidade. |
| PessoaJurídica | PROV-O | prov:Organization | ≡ | Agente organização para atribuição de responsabilidade. |
| VinculoEntrePessoas | FOAF | knows | ≡ | Vínculo social genérico com interação recíproca; reusado pela ACO. |
| VinculoEntrePessoas | FTM | Family | ⊒ | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: O par FTM Family passou a VinculoDeParentesco (≡), espécie criada por ajuste; mantê-lo como narrowMatch no gênero duplicaria o alinhamento. Associate continua no gênero. |
