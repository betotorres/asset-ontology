# Reuso de ontologias — recuperacao-ativos

## Proveniência

- Proposta de alinhamento gerada por: claude-fable-5-1 (Claude Code, escrita diretamente pelo modelo na sessão, sem chamada à API do .env), em 2026-09-13T22:43:44.815Z
- Revisão humana: 144 item(ns) mantido(s), 40 descartado(s), 9 adicionado(s) manualmente

## Ontologias avaliadas

| Ontologia | Referência | Domínio coberto | Mantidos | Descartados | Decisão |
|---|---|---|---|---|---|
| Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | JoseAlbertoSousaTorres_TESE.pdf, Figures 6.2/6.3 (pp.109-110), Tables 6.9-6.11 (pp.107-112) | Ocultacao patrimonial (asset concealment) — exemplo integral do proprio processo TORRES et al. (2024) aplicado pelo autor a um dominio irmao de recuperacao de ativos; ontologia em producao como knowledge graph na AGU sobre 15 bases governamentais brasileiras. | 17 | 3 | Reusar (conceitos selecionados) |
| FIBO | https://spec.edmcouncil.org/fibo/ (Data Dictionary: https://spec.edmcouncil.org/fibo/datadictionary/master/2026Q1/datadictionary-prod.csv) | Financial Industry Business Ontology (EDM Council/OMG) — vocabulario financeiro de referencia da industria. Modulos importados: Addresses, Business Registries, Clients and Accounts, Contracts, Currency Amount, Executives, Financial Instruments, Financial Products and Services, Financial Services Entities, Government Entities, Legal Capacity, People, Relations. | 26 | 10 | Reusar (conceitos selecionados) |
| FOAF (Friend of a Friend) | http://xmlns.com/foaf/spec/ | Vocabulario RDF para pessoas, agentes, organizacoes e suas relacoes sociais/documentais (knows, member, homepage, contas online). Ja referenciado indiretamente pelo W3C ORG (foaf:Agent/foaf:Person) e pela Asset Concealment Ontology da tese (foaf:knows). | 5 | 0 | Reusar (conceitos selecionados) |
| FollowTheMoney | https://followthemoney.tech/explorer/schemata/ — versão de referência: followthemoney v4.11.0 (namespace RDF https://schema.followthemoney.tech/#, não dereferenciável; Control/Risk/Territory só existem na série 4.x) | Modelagem de entidades, ativos, pessoas, organizações e relacionamentos (propriedade, controle, parentesco, cargos, contratos, sanções) usada por OpenSanctions/Aleph para investigação financeira e due diligence. | 40 | 3 | Reusar (conceitos selecionados) |
| MNI (Modelo Nacional de Interoperabilidade) — CNJ | Res. Conjunta CNJ/CNMP no 3/2013; manual tecnico https://www.cnj.jus.br/wp-content/uploads/2015/03/interoperabilidade_2.1.1.pdf; anotacoes do XSD (v2.2.2) via https://eproc1g.tjsc.jus.br/eproc/ajuda/tipos_intercomunicacao-2.2.2.html | Padrao nacional brasileiro de troca de dados processuais entre sistemas de tribunais (PJe, Projudi, Eproc) — processo judicial, partes/polos, advogados/representacao, movimentacao processual, comunicacoes (citacao/intimacao/notificacao), vinculacao entre processos. Contexto juridico-processual brasileiro real e maduro, complementar as ontologias genericas ja catalogadas. | 0 | 16 | Descartar (nenhum conceito mantido) |
| PROV-O | https://www.w3.org/TR/prov-o/ | Recomendação W3C de proveniência — modela origem, responsabilidade e confiança sobre entidades/afirmações. Relevante porque grauDeConfianca/proveniencia/statusProbatorio se repetem em dezenas de classes da nossa DKD. | 4 | 1 | Reusar (conceitos selecionados) |
| SUMO / SUMO-F (Suggested Upper Merged Ontology) | https://github.com/ontologyportal/sumo (Merge.kif, FinancialOntology.kif, Mid-level-ontology.kif, Media.kif) | Ontologia de alto nivel (upper ontology) formal em SUO-KIF, com extensao de dominio financeiro (SUMO-F). Ja usada pela propria tese TORRES et al. (2024) no alinhamento EOA da Asset Concealment Ontology (Table 6.9) — cobre bem eventos/transacoes financeiras (Deposit, WithDrawal, Investing, Payment, Liquidation, StockMarketTransaction) que a FIBO nao modela como classes de evento equivalentes. | 7 | 2 | Reusar (conceitos selecionados) |
| W3C Organization Ontology (ORG) | https://www.w3.org/TR/vocab-org/ | Vocabulario W3C para estruturas organizacionais: hierarquia de subsidiarias/unidades, membros, papeis, cargos, sites e eventos de mudanca (fusao/reestruturacao). Relevante para modelar grupos economicos e cadeias de controle societario em recuperacao de ativos. | 12 | 1 | Reusar (conceitos selecionados) |
| W3C Registered Organization Vocabulary (REGORG) | https://www.w3.org/TR/vocab-regorg/ | Perfil do W3C ORG especifico para organizacoes registradas em registros empresariais nacionais/regionais: nome legal, nome fantasia, tipo societario, status (ex.: insolvencia, recuperacao judicial), atividade economica e numero de registro. Relevante para modelar empresas de fachada e status societario em recuperacao de ativos. | 1 | 2 | Reusar (conceitos selecionados) |
| schema.org | https://schema.org | Vocabulário genérico de pessoas, organizações, endereços e valores monetários, amplamente adotado (usado por buscadores e web semântica) — base de interoperabilidade ampla, não específico do domínio. | 4 | 2 | Reusar (conceitos selecionados) |

## Conceitos reusados

| Conceito nosso | Ontologia | Conceito externo | Justificativa |
|---|---|---|---|
| Aeronave | FollowTheMoney | Airplane | Mesmo conceito; FTM traz registrationNumber e icaoCode equivalentes à marca de nacionalidade e matrícula. |
| Aeronave | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | Aircraft | Subtipo de Vehicle na ACO, mesmo recorte de bem de alto valor rastreável. |
| AlegacaoDeTerceiroDeBoaFe | FIBO | claim | Generalização: a alegação de terceiro é uma pretensão juridicamente exigível sobre o bem; FIBO não distingue boa-fé nem efeito sobre destinação. |
| AreaDeExecucaoOperacional | W3C Organization Ontology (ORG) | OrganizationalUnit | Unidade interna sem personalidade jurídica própria, parte de organização maior. |
| AssercaoDeTitularidade | FollowTheMoney | Ownership | Relação de posse/controle sobre ativo com papel, percentual e período — cobre tipo de titularidade e data de transmissão. |
| AssercaoDeTitularidade | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | own | Object property de posse de Asset na ACO, sem os atributos de valor declarado e tipo de titularidade. |
| Ativo | FollowTheMoney | Asset | Base comum de qualquer bem que pode ser objeto de Ownership; mesma função de superclasse. |
| Ativo | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | Asset | Raiz da taxonomia de bens da ACO (PhysicalAsset/IntangibleAsset). |
| Ativo | SUMO / SUMO-F (Suggested Upper Merged Ontology) | FinancialAsset | Definição SUMO cobre qualquer item de valor econômico possuído por pessoa ou empresa (casa, carro, dinheiro, títulos). |
| AtivoDePropriedadeIntelectual | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | IntelectualProperty | Mesma classe com subtipos Copyright/Trademark/Patent. |
| AtivoDePropriedadeIntelectual | SUMO / SUMO-F (Suggested Upper Merged Ontology) | Patent | SUMO cobre apenas patente (Certificate); nossa classe é mais ampla. |
| AtivoFinanceiro | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | FinancialAsset | Mesma classe na ACO, com subtipos Stock/Investment/Cash/Bond/CryptoWallet. |
| AtivoFinanceiro | FIBO | financial instrument | Visão contratual do ativo financeiro (gera ativo de uma parte e passivo de outra); FIBO detalha subtipos que não temos. |
| BemImovel | FollowTheMoney | RealEstate | Mesmo conceito; landRegistryNumber equivale a numeroDaMatricula. |
| BemImovel | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | RealEstate | Mesma classe, com subtipos Apartment/Land/House/Building/Farm. |
| BemImovel | SUMO / SUMO-F (Suggested Upper Merged Ontology) | RealEstate | Definição SUMO idêntica à usada na Table 6.9 da tese. |
| CodigoPostal | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | PostalCode | Mesma classe, subtipo de PhysicalAddress. |
| CodigoPostal | FIBO | postcode | Sequência para roteamento postal; FIBO post code area cobre a área geográfica associada. |
| ContaBancaria | FollowTheMoney | BankAccount | Mesmo conceito; iban/accountNumber/bic cobrem agência e número. |
| ContaBancaria | FIBO | account | Contêiner de registros de transações; FIBO detalha deposit/investment/loan account e identificadores bancários. |
| Correspondencia | FollowTheMoney | Message | Mensagem com remetente, destinatário, corpo e data; sem data de recebimento explícita. |
| Criptoativo | FollowTheMoney | CryptoWallet | Mesmo conceito; publicKey/currency/balance equivalem a carteira, blockchain e saldo. |
| Criptoativo | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | CryptoWallet | Subtipo de FinancialAsset na ACO, previsto justamente para ocultação via cripto. |
| DeclaracaoFiscalDeRendaEPatrimonio | FollowTheMoney | TaxRoll | Declaração tributária de pessoa com income e wealth por período. |
| DispositivoNormativo | FIBO | regulation | Regra para execução de lei; FIBO company law e policy são vizinhos, sem vigência/ementa como campos. |
| DocumentoDoPedido | FollowTheMoney | Document | Generalização: documento com language e date; apostilamento e tradução são nossos. |
| Embarcação | FollowTheMoney | Vessel | Mesmo conceito; imoNumber/mmsi/flag ampliam a inscrição. |
| Embarcação | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | Watercraft | Subtipo de Vehicle na ACO. |
| Endereco | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | PhysicalAddress | Endereço físico, base da análise de 'mesmo endereço' na tese. |
| Endereco | FIBO | physical address | Endereço onde comunicações são entregues ou representantes localizados; FIBO decompõe em street address, secondary unit etc. |
| Endereco | schema.org | PostalAddress | Decomposição streetAddress/addressLocality/addressRegion/postalCode/addressCountry. |
| ExtratoDeMovimentacaoFinanceira | FIBO | account statement | Resumo periódico de atividade da conta com saldo inicial/final e transações registradas. |
| IdentificadorDePessoa | FollowTheMoney | Identification | Registro formal de identificação com holder, type, number, country e authority. |
| IdentificadorDePessoa | FIBO | identity document | Documento legal de verificação de identidade; FIBO traz national identification number e passport como subtipos. |
| IndicacaoDeBeneficiarioFinal | FollowTheMoney | Control | Controle sem propriedade formal — o caso do beneficiário oculto. |
| IndicioFinanceiro | FollowTheMoney | Risk | Indicador de risco associado a entidade com descrição, topics e data; sem período de referência. |
| InstituicaoFinanceira | FIBO | financial institution | Provedor de serviços financeiros que capta e investe fundos; FIBO detalha bank, trust company, money services business etc. |
| Jurisdição | FIBO | polity | Pessoa jurídica de direito público (estado, subdivisão) com soberania sobre território. |
| Jurisdição | FollowTheMoney | Territory | Unidade territorial não necessariamente soberana; taxa de sucesso e tempo de resposta são nossos. |
| LancamentoFinanceiro | FIBO | individual transaction | Evento com impacto monetário documentado na conta, com data, categoria e subcategoria (depósito, saque, pagamento). |
| LancamentoFinanceiro | FollowTheMoney | Payment | Transferência entre partes com amount, currency, contas de origem/destino e data. |
| LancamentoFinanceiro | SUMO / SUMO-F (Suggested Upper Merged Ontology) | FinancialTransaction | Superclasse SUMO de Deposit/Withdrawal/Payment/Investing — cobre a modalidade como subtipo de evento. |
| NomeEVarianteDeGrafia | FIBO | person name | Designação pela qual alguém é conhecido em contexto; has alias e was formerly known as cobrem variantes. |
| NomeEVarianteDeGrafia | FollowTheMoney | alias | alias/previousName/weakAlias em Thing/LegalEntity cobrem variantes, mas como atributos, sem idioma nem indicador de ambiguidade. |
| OrgaoDeRegistroPublico | FIBO | business registration authority | Cobre só registros empresariais; registros de imóveis e veículos ficam fora. |
| OrgaoJudicial | FIBO | judiciary | Ramo do governo que compõe o sistema de cortes. |
| ParticipacaoSocietaria | FollowTheMoney | Ownership | percentage/sharesCount/startDate/endDate cobrem percentual, entrada e saída. |
| ParticipacaoSocietaria | FIBO | has shareholder | Relação emissor–acionista (com holds shares in inversa); sem percentual nem datas. |
| Pessoa | FollowTheMoney | LegalEntity | Base comum de Person/Organization/Company — mesma função de superclasse. |
| Pessoa | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | Party | Superclasse de Person e Organization na ACO. |
| Pessoa | FOAF (Friend of a Friend) | Agent | Superclasse de Person/Organization/Group no FOAF. |
| Pessoa | PROV-O | prov:Agent | Agente que assume responsabilidade; superclasse de prov:Person e prov:Organization. |
| PessoaFísica | FollowTheMoney | Person | birthDate, nationality, fatherName/motherName e political cobrem nascimento e exposição política. |
| PessoaFísica | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | Person | Mesma classe, sujeito de toda a hierarquia de parentesco da ACO. |
| PessoaFísica | FOAF (Friend of a Friend) | Person | foaf:Person, base do vocabulário de pessoas mais adotado na web. |
| PessoaFísica | schema.org | Person | birthDate, nationality, spouse/parent/sibling e netWorth ampliam nossos atributos. |
| PessoaFísica | FIBO | person | FIBO traz has date of birth, has citizenship, has residence e person name. |
| PessoaFísica | PROV-O | prov:Person | Agente pessoa física para atribuição de responsabilidade. |
| PessoaFísica | SUMO / SUMO-F (Suggested Upper Merged Ontology) | Human | Definição SUMO usada literalmente na Table 6.9 da tese. |
| PessoaJurídica | FollowTheMoney | Company | incorporationDate/dissolutionDate/jurisdiction/leiCode cobrem constituição e jurisdição. |
| PessoaJurídica | W3C Registered Organization Vocabulary (REGORG) | RegisteredOrganization | Organização com personalidade jurídica por registro; legalName/altLabel = razaoSocial/nomeFantasia. |
| PessoaJurídica | W3C Organization Ontology (ORG) | FormalOrganization | Organização legalmente reconhecida, superclasse de RegisteredOrganization. |
| PessoaJurídica | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | Organization | Subtipo de Party na ACO. |
| PessoaJurídica | schema.org | Organization | legalName/foundingDate/dissolutionDate/parentOrganization; não distingue entidade possuível de não possuível. |
| PessoaJurídica | FOAF (Friend of a Friend) | Organization | foaf:Organization, instituição social como empresa ou sociedade. |
| PessoaJurídica | PROV-O | prov:Organization | Agente organização para atribuição de responsabilidade. |
| PessoaJurídica | SUMO / SUMO-F (Suggested Upper Merged Ontology) | Organization | Instituição corporativa ou similar, incluindo divisões e departamentos. |
| ProcessoJudicial | FollowTheMoney | CourtCase | caseNumber, court, status, filingDate/closingDate. |
| ProcessoJudicial | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | LawSuit | Subtipo de Event na ACO, alvo de isPlaintiffOf/isDefendantOf/isLawyerOf. |
| RedeDeCooperacaoInternacional | W3C Organization Ontology (ORG) | OrganizationalCollaboration | Colaboração entre organizações sem ser entidade legal formal — exatamente uma rede (CARIN, Egmont). |
| TaxaDeCambioHistorica | FIBO | exchange rate | has base currency/has dealt currency/has rate value cobrem moedas e cotação; data e fonte oficial são nossas. |
| UnidadeDeAssessoriaJuridica | W3C Organization Ontology (ORG) | OrganizationalUnit | Unidade interna de organização maior. |
| UnidadeDeBuscaPatrimonial | W3C Organization Ontology (ORG) | OrganizationalUnit | Unidade interna de organização maior. |
| UnidadeDeGestaoDeCarteira | W3C Organization Ontology (ORG) | OrganizationalUnit | Unidade interna de organização maior. |
| UnidadeDeInteligenciaFinanceira | FollowTheMoney | PublicBody | Órgão público, classification para o tipo. |
| UnidadeDeTecnologiaEAutomacao | W3C Organization Ontology (ORG) | OrganizationalUnit | Unidade interna de organização maior. |
| ValorEconomicoDeAtivo | schema.org | MonetaryAmount | value/currency/validFrom cobrem quantia, moeda e data; tipo de valor e proveniência são nossos. |
| ValorEconomicoDeAtivo | FIBO | monetary amount | Medida em unidades monetárias; FIBO price/calculated price cobrem o tipo de valor parcialmente. |
| Veículo | FollowTheMoney | Vehicle | registrationNumber equivale a placa; chassi e renavam não têm campo próprio. |
| Veículo | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | MotorVehicle | Subtipo de Vehicle na ACO. |
| VinculoEntrePessoas | FollowTheMoney | Family | Parentesco com relationship, startDate/endDate; regime de bens é nosso. |
| VinculoEntrePessoas | FollowTheMoney | Associate | Associação não familiar entre pessoas — cobre o tipo de vínculo social. |
| VinculoEntrePessoas | FOAF (Friend of a Friend) | knows | Vínculo social genérico com interação recíproca; reusado pela ACO. |
| AtorInstitucional | W3C Organization Ontology (ORG) | Organization | Única âncora ORG compatível com as subclasses Unidade* (≡ OrganizationalUnit, que no ORG é organização sem reconhecimento legal próprio); FormalOrganization contradizia essa hierarquia. Ajuste do EOA (01-alinhamento-classes.md, item 5.2). *(adicionado manualmente na revisão)* |
| Divida | FollowTheMoney | Debt | Classe criada no EOA a partir desta lacuna externa (01-alinhamento-classes.md, seção 4). *(adicionado manualmente na revisão)* |
| Contrato | FIBO | contract | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |
| Contrato | FollowTheMoney | Contract | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |
| SucessaoDeEntidade | FollowTheMoney | Succession | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |
| SucessaoDeEntidade | W3C Organization Ontology (ORG) | ChangeEvent | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |
| ValorMobiliario | FollowTheMoney | Security | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |
| ValorMobiliario | FIBO | security | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |
| SancaoIndividual | FollowTheMoney | Sanction | Classe criada no EOA a partir desta lacuna externa. *(adicionado manualmente na revisão)* |

## Lacunas externas identificadas

| Ontologia | Conceito externo | Consideração |
|---|---|---|
| FollowTheMoney | Sanction | Registro individual de sanção contra entidade (autoridade, programa, razão, datas) — só temos a lista, não a entrada por pessoa. |
| FollowTheMoney | Directorship | Vínculo de administração/diretoria com cargo e período — administrador sem quota não é sócio. |
| FollowTheMoney | Representation | Representação legal/procuração (agent→client) — procuradores e mandatários não são modelados. |
| FIBO | legal agent | Parte legalmente habilitada a agir por outra — mesma lacuna de procuração. |
| FIBO | controlling nominee | Titular formal que detém o bem em nome do beneficiário real — o 'laranja' como classe própria. |
| FollowTheMoney | Succession | Sucessão entre entidades (fusão, reorganização) — cadeia de empresas sucessoras não é modelada. |
| W3C Organization Ontology (ORG) | ChangeEvent | Evento de fusão/cisão/reestruturação com organizações originais e resultantes. |
| W3C Organization Ontology (ORG) | subOrganizationOf | Hierarquia matriz/subsidiária/grupo econômico independente de percentual acionário. |
| W3C Organization Ontology (ORG) | Membership | Vínculo n-ário agente–organização–papel com período — cobre cargos e funções além da quota. |
| FollowTheMoney | Debt | Dívida com credor, devedor, montante e juros — credor/devedor é central em recuperação e não temos classe. |
| FIBO | contract | Contrato entre partes com jurisdição, datas e beneficiário — contratos simulados são veículo típico de ocultação. |
| FollowTheMoney | Contract | Contrato com parties, amount e período — mesma lacuna, versão FTM. |
| FollowTheMoney | Security | Valor mobiliário com issuer, isin e ticker — AtivoFinanceiro não tem subtipos nem emissor. |
| FIBO | security | Instrumento financeiro negociável, com equity/debt instrument como subtipos. |
| FollowTheMoney | Position | Cargo público ocupado via Occupancy com período — só temos indicador booleano de PEP. |
| FIBO | government official | Pessoa eleita ou nomeada para administrar aspecto do governo — base para PEP como papel, não flag. |
| FIBO | trust company | Fiduciário/trustee — estruturas fiduciárias (trusts) não aparecem em nenhuma classe nossa. |
| SUMO / SUMO-F (Suggested Upper Merged Ontology) | Liquidation | Liquidação de empresa (venda de ativos, pagamento de dívidas, encerramento) — dissipação via liquidação não é modelada. |
| FollowTheMoney | CourtCaseParty | Parte em processo com role (autor/réu) e período — relação reificada pessoa–processo. |
| Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | isInvolvedIn | isPlaintiffOf/isDefendantOf/isLawyerOf/isJudgeOf como propriedades explícitas — mesma lacuna, versão ACO. |
| Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | VirtualAddress | E-mail e telefone como endereços virtuais — nosso Endereco é só físico. |
| FollowTheMoney | UserAccount | Conta em plataforma digital (login, provider) — presença online como vetor de identificação e vínculo. |
| FOAF (Friend of a Friend) | OnlineAccount | Conta online de um agente — mesma lacuna, versão FOAF. |
| PROV-O | prov:Activity | Atividade que gera/usa entidades (wasGeneratedBy/used) — cadeia de proveniência das diligências que compõem o dossiê. |

## Classes sem correspondência externa (específicas do domínio)

- AlienacaoAntecipada
- AnaliseDeCompatibilidadeEconomica
- AtoNotarial
- AtoRegistral
- AutoridadeDecisoriaSobreDestinacao
- AvaliacaoPatrimonial
- BemMovel
- DecretoDePerdimento
- Destinacao
- DossieDeBuscaPatrimonial
- EnteDestinatario
- Exequatur
- FundamentoLegal
- IncidenteDeRestituicao
- InstrumentoJuridicoDeCooperacao
- ListaRestritiva
- MatriculaImobiliaria
- MedidaDeConstricao
- OrgaoDeGestaoPatrimonial
- PedidoDeCooperacaoJuridicaInternacional
- PrazoDeResposta
- RegistroPublicoDeBem
- Repatriacao
- RequisitoFormal
- RespostaDeCooperacao
- RestricaoOuOnusSobreBem
- SistemaDeInformacao
- TabelionatoDeNotas
