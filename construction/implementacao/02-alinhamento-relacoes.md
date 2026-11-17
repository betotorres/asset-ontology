# Alinhamento de relacionamentos (EOA) — recuperacao-ativos

> Subfase EOA, passo 2 (TORRES et al., 2024, seção 4.1.2.1; formato da Table 4.3).
> Insumos: `especificacao/04-ontologia-preliminar.md` (165 relações mantidas na DKD: 24 `É_SUBCLASSE_DE` + 141 de domínio), `implementacao/01-alinhamento-classes.md` e os resumos de conceitos das 9 ontologia(s) elegível(is) no catálogo ORR.
> Proposta do modelo: não registrada (alinhamento importado do repositório ou decidido manualmente).
> Revisão humana no painel: 131 mapeamento(s) mantido(s), 1 descartado(s), 1 adicionado(s) manualmente; 0 relação(ões) própria(s). Gravado em 2026-10-06.

## 1. Relações taxonômicas (`É_SUBCLASSE_DE`)

Todas mapeiam para `rdfs:subClassOf`.

| Subclasse | Superclasse |
|---|---|
| Aeronave | BemMovel |
| AreaDeExecucaoOperacional | AtorInstitucional |
| AtivoDePropriedadeIntelectual | Ativo |
| AtivoFinanceiro | Ativo |
| AutoridadeDecisoriaSobreDestinacao | AtorInstitucional |
| BemImovel | Ativo |
| BemMovel | Ativo |
| ContaBancaria | AtivoFinanceiro |
| Criptoativo | Ativo |
| Embarcação | BemMovel |
| IndicacaoDeBeneficiarioFinal | VinculoEntrePessoas |
| InstituicaoFinanceira | PessoaJurídica |
| MatriculaImobiliaria | RegistroPublicoDeBem |
| ParticipacaoSocietaria | VinculoEntrePessoas |
| PessoaFísica | Pessoa |
| PessoaJurídica | Pessoa |
| TabelionatoDeNotas | AtorInstitucional |
| UnidadeDeAssessoriaJuridica | AtorInstitucional |
| UnidadeDeBuscaPatrimonial | AtorInstitucional |
| UnidadeDeGestaoDeCarteira | AtorInstitucional |
| UnidadeDeInteligenciaFinanceira | AtorInstitucional |
| UnidadeDeTecnologiaEAutomacao | AtorInstitucional |
| ValorMobiliario | AtivoFinanceiro |
| Veículo | BemMovel |

## 2. Tabela de alinhamento de relacionamentos (Table 4.3)

Tipos: ≡ equivalente · ⊑ o nosso é mais específico · ⊒ o nosso é mais amplo · ≈ correspondência próxima · desenho = só inspiração de desenho, sem IRI. `-` = sem correspondência mantida. Só entram propriedades que constam no resumo de conceitos da ontologia no catálogo ORR. Na Construção, ≡ de propriedade é emitido como `rdfs:subPropertyOf` + `skos:exactMatch` — nunca `owl:equivalentProperty` com propriedade externa.

| Origem | Relação | Destino | ACO | FIBO | FOAF | FTM | ORG | PROV-O | REGORG | schema | Tipo |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Aeronave | OPERADA_POR | Pessoa | - | - | - | - | - | - | - | - | - |
| AlegacaoDeTerceiroDeBoaFe | AVALIADA_POR | AvaliacaoPatrimonial | - | is evaluated by (≡) | - | - | - | - | - | - | ≡ |
| AlegacaoDeTerceiroDeBoaFe | INCIDE_SOBRE | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| AlegacaoDeTerceiroDeBoaFe | INSTRUI | IncidenteDeRestituicao | - | is evidence for (≈) | - | - | - | - | - | - | ≈ |
| AlegacaoDeTerceiroDeBoaFe | REQUERIDA_POR | Pessoa | - | - | - | - | - | wasAttributedTo (⊑) | - | - | ⊑ |
| AlienacaoAntecipada | AUTORIZADA_POR | DecisaoJudicial | - | isAuthorizedBy (≡) | - | - | - | - | - | - | ≡ |
| AlienacaoAntecipada | FUNDAMENTA_SE_EM | FundamentoLegal | - | is predicated on (⊑) | - | - | - | - | - | - | ⊑ |
| AlienacaoAntecipada | INCIDE_SOBRE | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| AnaliseDeCompatibilidadeEconomica | IDENTIFICA | Ativo | - | - | - | - | - | - | - | - | - |
| AnaliseDeCompatibilidadeEconomica | QUALIFICADO_POR | StatusProbatorio | - | - | - | - | - | - | - | - | - |
| AnaliseDeCompatibilidadeEconomica | UTILIZA | DeclaracaoFiscalDeRendaEPatrimonio | - | - | - | - | - | used (≡) | - | - | ≡ |
| AnaliseDeCompatibilidadeEconomica | UTILIZA | ExtratoDeMovimentacaoFinanceira | - | - | - | - | - | used (≡) | - | - | ≡ |
| AssercaoDeTitularidade | COMPROVADA_POR | RegistroPublicoDeBem | - | is evidenced by (⊑) | - | - | - | hadPrimarySource (≈) | - | - | ⊑, ≈ |
| AssercaoDeTitularidade | LIGA | Ativo | - | - | - | Ownership.asset (⊑) | - | - | - | - | ⊑ |
| AssercaoDeTitularidade | LIGA | Pessoa | - | - | - | Ownership.owner (⊑) | - | - | - | - | ⊑ |
| AssercaoDeTitularidade | TITULAR_ANTERIOR | Pessoa | - | - | - | - | - | - | - | - | - |
| Ativo | POSSUI | AvaliacaoPatrimonial | - | is evaluated by (≡) | - | - | - | - | - | - | ≡ |
| Ativo | QUALIFICADO_POR | StatusProbatorio | - | - | - | - | - | - | - | - | - |
| Ativo | REGISTRADO_EM | RegistroPublicoDeBem | - | - | - | - | - | - | - | - | - |
| Ativo | SOB_GESTÃO_DE | OrgaoDeGestaoPatrimonial | - | is held by (⊑) | - | - | - | - | - | - | ⊑ |
| AtivoFinanceiro | CUSTODIADO_POR | InstituicaoFinanceira | - | is held by (⊑) | - | BankAccount.bank (≈) | - | - | - | - | ⊑, ≈ |
| AtoNotarial | LAVRADO_POR | TabelionatoDeNotas | - | - | - | - | - | wasAttributedTo (⊑) | - | - | ⊑ |
| AtoNotarial | TEM_PARTE | Pessoa | - | has contract party (≈) | - | - | - | - | - | - | ≈ |
| AtoRegistral | INSTRUMENTALIZADO_POR | AtoNotarial | - | is evidenced by (≈) | - | - | - | - | - | - | ≈ |
| AtoRegistral | TEM_PARTE | Pessoa | - | has contract party (≈) | - | - | - | - | - | - | ≈ |
| AutoridadeCentral | PERTENCE_A | Jurisdição | - | is an instrument of (⊑) | - | - | - | - | - | - | ⊑ |
| AutoridadeCentral | TRAMITA | PedidoDeCooperacaoJuridicaInternacional | - | facilitates (⊑) | - | - | - | - | - | - | ⊑ |
| AutoridadeDecisoriaSobreDestinacao | REGISTRADO_EM | SistemaDeInformacao | - | - | - | - | - | - | - | - | - |
| AvaliacaoPatrimonial | AVALIA | Ativo | - | evaluates (≡) | - | - | - | - | - | - | ≡ |
| AvaliacaoPatrimonial | PRODUZ | ValorEconomicoDeAtivo | - | has monetary amount (⊑) | - | - | - | - | - | - | ⊑ |
| AvaliacaoPatrimonial | SUBSIDIA | AlienacaoAntecipada | - | - | - | - | - | used (≈) | - | - | ≈ |
| AvaliacaoPatrimonial | SUBSIDIA | Destinacao | - | - | - | - | - | used (≈) | - | - | ≈ |
| BemImovel | DESCRITO_EM | MatriculaImobiliaria | - | - | isPrimaryTopicOf (⊑) | - | - | - | - | - | ⊑ |
| BemImovel | TEM_ENDERECO | Endereco | - | has address (⊑) | - | RealEstate.address (≡) | - | - | - | - | ⊑, ≡ |
| BemMovel | TITULAR_ANTERIOR | Pessoa | - | - | - | - | - | - | - | - | - |
| Contrato | BENEFICIA | Pessoa | - | has beneficiary (≡) | - | - | - | - | - | - | ≡ |
| Contrato | REFERE_SE_A | Ativo | - | defines terms for (⊑) | - | - | - | - | - | - | ⊑ |
| Contrato | REGIDO_POR | Jurisdição | - | has governing jurisdiction (≡) | - | - | - | - | - | - | ≡ |
| Contrato | TEM_PARTE | Pessoa | - | has contract party (≡) | - | - | - | - | - | - | ≡ |
| Contrato | TEM_VALOR | ValorEconomicoDeAtivo | - | has monetary amount (≡) | - | - | - | - | - | - | ≡ |
| Correspondencia | DIRIGIDA_A | AutoridadeCentral | - | - | - | Message.recipients (≡) | - | - | - | - | ≡ |
| Correspondencia | ENVIADA_POR | AutoridadeCentral | - | - | - | Message.sender (≡) | - | wasAttributedTo (⊑) | - | - | ≡, ⊑ |
| DecisaoJudicial | AUTORIZA | AlienacaoAntecipada | - | authorizes (≡) | - | - | - | - | - | - | ≡ |
| DecisaoJudicial | DETERMINA | DecretoDePerdimento | - | mandates (⊑) | - | - | - | - | - | - | ⊑ |
| DecisaoJudicial | DETERMINA | Destinacao | - | mandates (⊑) | - | - | - | - | - | - | ⊑ |
| DecisaoJudicial | DETERMINA | MedidaDeConstricao | - | mandates (⊑) | - | - | - | - | - | - | ⊑ |
| DecisaoJudicial | DETERMINA | ValorEconomicoDeAtivo | - | has monetary amount (≈) | - | - | - | - | - | - | ≈ |
| DeclaracaoFiscalDeRendaEPatrimonio | DECLARADA_POR | PessoaFísica | - | - | - | TaxRoll.taxee (≡) | - | wasAttributedTo (⊑) | - | - | ≡, ⊑ |
| DecretoDePerdimento | DECORRE_DE | DecisaoJudicial | - | is caused by (⊑) | - | - | - | - | - | - | ⊑ |
| DecretoDePerdimento | FUNDAMENTA_SE_EM | FundamentoLegal | - | is predicated on (⊑) | - | - | - | - | - | - | ⊑ |
| DecretoDePerdimento | HABILITA | Destinacao | - | causes (⊑) | - | - | - | - | - | - | ⊑ |
| DecretoDePerdimento | RECAI_SOBRE | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| Destinacao | BENEFICIA | EnteDestinatario | - | has beneficiary (≡) | - | - | - | - | - | - | ≡ |
| Destinacao | DECIDIDA_POR | AutoridadeDecisoriaSobreDestinacao | - | - | - | - | - | wasAssociatedWith (⊑) | - | - | ⊑ |
| Destinacao | DESTINA | Ativo | - | - | - | - | - | - | - | - | - |
| Destinacao | EXECUTADA_POR | AreaDeExecucaoOperacional | - | - | - | - | - | wasAssociatedWith (⊑) | - | - | ⊑ |
| Destinacao | EXIGE | AvaliacaoPatrimonial | - | is predicated on (⊑) | - | - | - | used (⊑) | - | - | ⊑ |
| Destinacao | MATERIALIZA_SE_EM | Repatriacao | - | - | - | - | - | - | - | - | - |
| Divida | TEM_CREDOR | Pessoa | - | - | - | Debt.creditor (⊑) | - | - | - | - | ⊑ |
| Divida | TEM_DEVEDOR | Pessoa | - | - | - | Debt.debtor (⊑) | - | - | - | - | ⊑ |
| Divida | TEM_VALOR | ValorEconomicoDeAtivo | - | has monetary amount (≡) | - | - | - | - | - | - | ≡ |
| DossieDeBuscaPatrimonial | DESCREVE | Ativo | - | - | topic (⊑) | - | - | - | - | - | ⊑ |
| DossieDeBuscaPatrimonial | TEM_ALVO | Pessoa | - | - | primaryTopic (≡) | - | - | - | - | - | ≡ |
| Endereco | TEM_CODIGO_POSTAL | CodigoPostal | - | has individual postcode (≡) | - | - | - | - | - | - | ≡ |
| Exequatur | CONCEDIDO_POR | OrgaoJudicial | - | is issued by (⊑) | - | - | - | - | - | - | ⊑ |
| ExtratoDeMovimentacaoFinanceira | COMPOSTO_POR | LancamentoFinanceiro | - | records transaction (≡) | - | - | - | - | - | - | ≡ |
| ExtratoDeMovimentacaoFinanceira | REFERE_SE_A | ContaBancaria | - | applies to account (≡) | - | - | - | - | - | - | ≡ |
| IncidenteDeRestituicao | AFETA | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| IncidenteDeRestituicao | QUESTIONA | MedidaDeConstricao | - | - | - | - | - | - | - | - | - |
| IndicacaoDeBeneficiarioFinal | APONTA | Pessoa | - | - | - | Control.controller (⊑) | - | - | - | - | ⊑ |
| IndicacaoDeBeneficiarioFinal | REFERE_SE_A | PessoaJurídica | - | - | - | Control.controlled (⊑) | - | - | - | - | ⊑ |
| IndicioFinanceiro | EXTRAÍDO_DE | ExtratoDeMovimentacaoFinanceira | - | - | - | - | - | wasDerivedFrom (≡) | - | - | ≡ |
| IndicioFinanceiro | QUALIFICADO_POR | StatusProbatorio | - | - | - | - | - | - | - | - | - |
| InstituicaoFinanceira | PRODUZ | ExtratoDeMovimentacaoFinanceira | - | issues (⊑) | - | - | - | - | - | - | ⊑ |
| InstrumentoJuridicoDeCooperacao | DEFINE | RequisitoFormal | - | mandates (≈) | - | - | - | - | - | - | ≈ |
| InstrumentoJuridicoDeCooperacao | DETERMINA | ViaProcessual | - | mandates (≈) | - | - | - | - | - | - | ≈ |
| InstrumentoJuridicoDeCooperacao | É_COMPOSTO_POR | DispositivoNormativo | - | - | - | - | - | hadMember (≈) | - | - | ≈ |
| InstrumentoJuridicoDeCooperacao | VINCULA | Jurisdição | - | has contract party (≈) | - | - | - | - | - | - | ≈ |
| Jurisdição | IMPÕE | RequisitoFormal | - | mandates (≈) | - | - | - | - | - | - | ≈ |
| LancamentoFinanceiro | EVIDENCIA | IndicioFinanceiro | - | is evidence for (⊑) | - | - | - | - | - | - | ⊑ |
| LancamentoFinanceiro | TEM_CONTRAPARTE | Pessoa | - | - | - | Payment.beneficiary (≈); Payment.payer (≈) | - | - | - | - | ≈ |
| MatriculaImobiliaria | CONTÉM | AtoRegistral | - | - | - | - | - | hadMember (≈) | - | - | ≈ |
| MatriculaImobiliaria | DESCREVE | BemImovel | - | - | primaryTopic (⊑) | - | - | - | - | - | ⊑ |
| MatriculaImobiliaria | TITULAR_ANTERIOR | Pessoa | - | - | - | - | - | - | - | - | - |
| MedidaDeConstricao | DETERMINA | ValorEconomicoDeAtivo | - | has monetary amount (≈) | - | - | - | - | - | - | ≈ |
| MedidaDeConstricao | DETERMINADA_POR | DecisaoJudicial | - | is mandated by (⊑) | - | - | - | - | - | - | ⊑ |
| MedidaDeConstricao | FUNDAMENTA_SE_EM | FundamentoLegal | - | is predicated on (⊑) | - | - | - | - | - | - | ⊑ |
| MedidaDeConstricao | RECAI_SOBRE | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| MedidaDeConstricao | REQUERIDA_POR | OrgaoDeAcusacao | - | - | - | - | - | - | - | - | - |
| OrgaoDeAcusacao | REQUER | MedidaDeConstricao | - | - | - | - | - | - | - | - | - |
| OrgaoDeGestaoPatrimonial | ADMINISTRA | Ativo | - | holds (⊑) | - | - | - | - | - | - | ⊑ |
| OrgaoDeRegistroPublico | CUSTODIA | RegistroPublicoDeBem | - | - | - | - | - | - | - | - | - |
| OrgaoJudicial | PERTENCE_A | Jurisdição | - | is an instrument of (⊑) | - | - | - | - | - | - | ⊑ |
| OrgaoJudicial | PROFERE | DecisaoJudicial | - | issues (⊑) | - | - | - | - | - | - | ⊑ |
| ParticipacaoSocietaria | TEM_SOCIEDADE | PessoaJurídica | - | - | - | Ownership.asset (⊑) | organization (≈) | - | - | - | ⊑, ≈ |
| ParticipacaoSocietaria | TEM_SÓCIO | Pessoa | - | - | - | Ownership.owner (⊑) | member (≈) | - | - | - | ⊑, ≈ |
| PedidoDeCooperacaoJuridicaInternacional | ENVOLVE | Jurisdição | - | - | - | - | - | - | - | - | - |
| PedidoDeCooperacaoJuridicaInternacional | FUNDAMENTA_SE_EM | InstrumentoJuridicoDeCooperacao | - | is predicated on (⊑) | - | - | - | - | - | - | ⊑ |
| PedidoDeCooperacaoJuridicaInternacional | INDICA | ValorEconomicoDeAtivo | - | has monetary amount (≈) | - | - | - | - | - | - | ≈ |
| PedidoDeCooperacaoJuridicaInternacional | INSTRUÍDO_POR | DocumentoDoPedido | - | is evidenced by (⊑) | - | - | - | - | - | - | ⊑ |
| PedidoDeCooperacaoJuridicaInternacional | MENCIONA | Pessoa | - | - | - | - | - | - | - | - | - |
| PedidoDeCooperacaoJuridicaInternacional | POSSUI | Correspondencia | - | - | - | - | - | - | - | - | - |
| PedidoDeCooperacaoJuridicaInternacional | RECEBE | RespostaDeCooperacao | - | - | - | - | - | - | - | - | - |
| PedidoDeCooperacaoJuridicaInternacional | REFERE_SE_A | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| PedidoDeCooperacaoJuridicaInternacional | SOLICITA | MedidaDeConstricao | - | - | - | - | - | - | - | - | - |
| PedidoDeCooperacaoJuridicaInternacional | SUJEITO_A | PrazoDeResposta | - | has term (≈) | - | - | - | - | - | - | ≈ |
| PedidoDeCooperacaoJuridicaInternacional | UTILIZA | ViaProcessual | - | - | - | - | - | - | - | - | - |
| PedidoDeCooperacaoJuridicaInternacional | VINCULA_SE_A | ProcessoJudicial | - | relates to (≈) | - | - | - | - | - | - | ≈ |
| Pessoa | DESIGNADA_POR | NomeEVarianteDeGrafia | - | has person name (≈) | - | - | - | - | - | - | ≈ |
| Pessoa | IDENTIFICADA_POR | IdentificadorDePessoa | - | - | - | Identification.holder (≈) | - | - | registration (≈) | - | ≈ |
| Pessoa | QUALIFICADO_POR | ListaRestritiva | - | - | - | - | - | - | - | - | - |
| Pessoa | TITULAR_DE | Ativo | own (desenho) | holds (≈) | - | - | - | - | - | - | desenho, ≈ |
| PessoaFísica | TEM_ENDERECO | Endereco | - | has address (≡) | - | - | - | - | - | address (≈) | ≡, ≈ |
| PessoaJurídica | TEM_ENDERECO | Endereco | - | has address (≡) | - | - | - | - | - | address (≈) | ≡, ≈ |
| ProcessoJudicial | CONTÉM | DecisaoJudicial | - | - | - | - | - | hadMember (≈) | - | - | ≈ |
| ProcessoJudicial | É_CONDUZIDO_POR | OrgaoJudicial | - | - | - | CourtCase.court (≡) | - | - | - | - | ≡ |
| ProcessoJudicial | REFERENCIA | Ativo | - | involves (≈) | - | - | - | - | - | - | ≈ |
| ProcessoJudicial | TEM_PARTE | Pessoa | isInvolvedIn (desenho) | - | - | CourtCaseParty.party (≈) | - | - | - | - | desenho, ≈ |
| RedeDeCooperacaoInternacional | CONGREGA | AutoridadeCentral | - | - | - | - | hasMember (≡) | - | - | - | ≡ |
| RedeDeCooperacaoInternacional | CONGREGA | UnidadeDeInteligenciaFinanceira | - | - | - | - | hasMember (≡) | - | - | - | ≡ |
| RegistroPublicoDeBem | REFERE_SE_A | Ativo | - | - | - | - | - | - | - | - | - |
| Repatriacao | PRODUZ | ValorEconomicoDeAtivo | - | has monetary amount (≈) | - | - | - | - | - | - | ≈ |
| Repatriacao | RESULTA_DE | DecretoDePerdimento | - | is caused by (⊑) | - | - | - | - | - | - | ⊑ |
| Repatriacao | TRANSFERE | Ativo | - | - | - | - | - | - | - | - | - |
| RespostaDeCooperacao | PRODUZ | ValorEconomicoDeAtivo | - | has monetary amount (≈) | - | - | - | - | - | - | ≈ |
| RestricaoOuOnusSobreBem | BENEFICIA | Pessoa | - | is conferred on (⊑) | - | - | - | - | - | - | ⊑ |
| RestricaoOuOnusSobreBem | DECORRE_DE | ProcessoJudicial | - | is conferred by (⊑) | - | - | - | - | - | - | ⊑ |
| RestricaoOuOnusSobreBem | INCIDE_SOBRE | Ativo | - | - | - | - | - | - | - | - | - |
| SancaoIndividual | CONSTA_EM | ListaRestritiva | - | - | - | - | - | - | - | - | - |
| SancaoIndividual | SANCIONA | Pessoa | - | - | - | Sanction.entity (⊑) | - | - | - | - | ⊑ |
| SistemaDeInformacao | OPERADO_POR | AtorInstitucional | - | - | - | - | - | wasAttributedTo (⊑) | - | - | ⊑ |
| SucessaoDeEntidade | TEM_DESTINO | PessoaJurídica | - | - | - | Succession.successor (≈) | resultingOrganization (⊑) | - | - | - | ≈, ⊑ |
| SucessaoDeEntidade | TEM_ORIGEM | PessoaJurídica | - | - | - | Succession.predecessor (≈) | originalOrganization (⊑) | - | - | - | ≈, ⊑ |
| UnidadeDeAssessoriaJuridica | ANALISA | DecretoDePerdimento | - | evaluates (⊑) | - | - | - | - | - | - | ⊑ |
| UnidadeDeBuscaPatrimonial | PRODUZ | DossieDeBuscaPatrimonial | - | produces (⊑) | - | - | - | - | - | - | ⊑ |
| ValorEconomicoDeAtivo | CONVERTIDO_POR | TaxaDeCambioHistorica | - | - | - | - | - | - | - | - | - |
| ValorMobiliario | EMITIDO_POR | PessoaJurídica | - | is issued by (⊑) | - | Security.issuer (≡) | - | - | - | - | ⊑, ≡ |
| Veículo | TEM_ENDERECO | Endereco | - | has address (⊑) | - | - | - | - | - | - | ⊑ |
| ViaProcessual | EXIGE | Exequatur | - | - | - | - | - | - | - | - | - |
| VinculoEntrePessoas | TEM_DESTINO | Pessoa | - | - | - | Associate.associate (⊑); Family.relative (⊑) | - | - | - | - | ⊑ |
| VinculoEntrePessoas | TEM_ORIGEM | Pessoa | - | - | - | Associate.person (⊑); Family.person (⊑) | - | - | - | - | ⊑ |

## 3. Relações sem correspondente externo (próprias do domínio)

Nenhuma.

Relações sem decisão registrada (29) — nem mapeamento mantido, nem "próprio": Aeronave OPERADA_POR Pessoa; AnaliseDeCompatibilidadeEconomica IDENTIFICA Ativo; AnaliseDeCompatibilidadeEconomica QUALIFICADO_POR StatusProbatorio; AssercaoDeTitularidade TITULAR_ANTERIOR Pessoa; Ativo QUALIFICADO_POR StatusProbatorio; Ativo REGISTRADO_EM RegistroPublicoDeBem; AutoridadeDecisoriaSobreDestinacao REGISTRADO_EM SistemaDeInformacao; BemMovel TITULAR_ANTERIOR Pessoa; Destinacao DESTINA Ativo; Destinacao MATERIALIZA_SE_EM Repatriacao; IncidenteDeRestituicao QUESTIONA MedidaDeConstricao; IndicioFinanceiro QUALIFICADO_POR StatusProbatorio; MatriculaImobiliaria TITULAR_ANTERIOR Pessoa; MedidaDeConstricao REQUERIDA_POR OrgaoDeAcusacao; OrgaoDeAcusacao REQUER MedidaDeConstricao; OrgaoDeRegistroPublico CUSTODIA RegistroPublicoDeBem; PedidoDeCooperacaoJuridicaInternacional ENVOLVE Jurisdição; PedidoDeCooperacaoJuridicaInternacional MENCIONA Pessoa; PedidoDeCooperacaoJuridicaInternacional POSSUI Correspondencia; PedidoDeCooperacaoJuridicaInternacional RECEBE RespostaDeCooperacao; PedidoDeCooperacaoJuridicaInternacional SOLICITA MedidaDeConstricao; PedidoDeCooperacaoJuridicaInternacional UTILIZA ViaProcessual; Pessoa QUALIFICADO_POR ListaRestritiva; RegistroPublicoDeBem REFERE_SE_A Ativo; Repatriacao TRANSFERE Ativo; RestricaoOuOnusSobreBem INCIDE_SOBRE Ativo; SancaoIndividual CONSTA_EM ListaRestritiva; ValorEconomicoDeAtivo CONVERTIDO_POR TaxaDeCambioHistorica; ViaProcessual EXIGE Exequatur.

## 4. Mapeamentos descartados

| Origem | Relação | Destino | Ontologia | Termo externo | Tipo proposto | Justificativa |
|---|---|---|---|---|---|---|
| SistemaDeInformacao | OPERADO_POR | AtorInstitucional | PROV-O | actedOnBehalfOf | ⊑ | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Com SistemaDeInformacao retipada para prov:Entity, actedOnBehalfOf (Agent → Agent) deixa de caber; a relação da fonte com quem a mantém é prov:wasAttributedTo (Entity → Agent). |
