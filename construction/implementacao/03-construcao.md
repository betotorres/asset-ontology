# Construção da ontologia (OCO) — recuperacao-ativos

> Gerado pelo painel do entrevistador-asd em 2026-10-06 a partir da DKD e das decisões registradas no banco. Hash da geração: `3a6b06df2cfa5a51f2c1dbecefa490137509855e786ce6915d1435840f1a2948`.

## 1. Resumo

| Elemento | Quantidade |
|---|---|
| Classes | 125 |
| Subclasses declaradas (É_SUBCLASSE_DE) | 93 |
| Data properties | 262 |
| Object properties (por verbo) | 133 |
| Especializações por par | 51 |
| Pares de relação | 221 |
| Mapeamentos de classe | 90 |
| Classes tipadas em PROV-O | 58 |
| Mapeamentos de propriedade | 126 |

Namespace: `https://www.latitude.unb.br/ontologia/recuperacao-ativos#` (prefixo `rec`), versão 0.2.0-oco.

Ajustes manuais estruturais aplicados: 499 — registro em `04-ajustes-manuais.md`.

## 2. Regras fixas do gerador

1. Nenhuma IRI externa é emitida sem status "confirmada" no catálogo de IRIs, com evidência registrada.
2. O núcleo (ontologia.ttl) só contém classes, propriedades e hierarquia próprias; todo reuso fica no módulo de alinhamento (ontologia-alinhamentos.ttl), que importa o núcleo.
3. Ontologias em modo "skos" (namespace instável ou não dereferenciável, como a FollowTheMoney) entram só por mapeamentos SKOS; em modo "desenho" (sem IRI OWL utilizável) só como anotação origemDeDesenho.
4. Mapeamento ≡ de classe vira owl:equivalentClass; ⊑ vira rdfs:subClassOf; ⊒ vira skos:narrowMatch; ≈ vira skos:closeMatch.
5. Propriedade nunca usa owl:equivalentProperty com propriedade externa (o domínio/alcance nosso passaria a valer para todo uso externo): ≡ vira rdfs:subPropertyOf + skos:exactMatch.
6. Verbo da DKD usado em pares de semântica distinta ganha uma subpropriedade por par (<verbo>_<Origem>) quando o par tem mapeamento próprio; o mapeamento comum a todos os pares fica na propriedade genérica.
7. O verbo LIGA da reificação de titularidade é dividido pelo destino: ligaTitular (Pessoa) e ligaAtivo (Ativo).
8. Só datatypes do OWL 2 (xsd:date e xsd:duration fazem reasoners DL recusarem a ontologia); atributo sem decisão de tipo fica xsd:string.
9. Propriedade definida por cadeia (owl:propertyChainAxiom) não pode ser subpropriedade de propriedade externa — viraria não-simples e colidiria com restrições de cardinalidade externas.
10. Duas classes nossas não podem colapsar (subsunção mútua) nem ganhar subclasse que a DKD não declara, por efeito dos mapeamentos.

## 3. Decisões de construção

### 3.1 Tipos de dados

| Atributo | Alcance | Justificativa |
|---|---|---|
| agencia | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Código de agência bancária, pode ter zeros à esquerda ou formatação própria. |
| atribuicao | xsd:string | AJ-62 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: O atributo atribuicao, repetido nas subclasses de UnidadeOrganizacional, passa a ser declarado uma vez na superclasse. |
| caraterBloqueante | xsd:boolean | — |
| carteira | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Endereço de carteira cripto é um identificador alfanumérico, não um valor numérico. |
| categoriaDoMotivo | xsd:string | AJ-376 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC em duas categorias: "MotivoDeDevoluçãoOuSaneamento: motivo (falta de tradução, ausência de apostilamento, dupla incriminação, formulário incompleto, individualização insuficiente do bem) — sem lista fechada e sem registro estruturado" (pedidos) e "MotivoDeSaneamentoOuDevolução … EventoDeTramitação TEM_CAUSA Motivo; RequisitoFormal QUANDO_DESCUMPRIDO_GERA Motivo" (marco normativo). ASD R28 pede exatamente a lista categorizada. |
| chassi | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Número de chassi (VIN) é alfanumérico, tratado como identificador. |
| chaveDeConsulta | xsd:string | AJ-452 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC: ConsultaAFonte / ConsultaAFonteDeDados / RegistroDeConsultaAFonte aparece em cinco categorias (identificação de pessoas, constrição, movimentação financeira, registro e titularidade, valoração) com os mesmos campos — base consultada, data da consulta, data de corte, chave utilizada, resultado (inclusive negativo), via de obtenção — e as relações "ConsultaAFonte —DIRIGIDA_A→ SistemaOuBaseDeDados", "—REALIZADA_POR→ ÓrgãoDeBuscaPatrimonial", "—TEM_ALVO→ Pessoa", "—PRODUZ→ AsserçãoDeTitularidade / ValorEconômicoDeAtivo / DocumentoFonte", "—ATRIBUI→ StatusProbatório" e "DossiêPatrimonial —COMPOSTO_POR→ ConsultaAFonte". A DKD descartou a classe, e com isso SistemaDeInformacao ficou sem uso analítico: nada dizia de que base, em que data e com que chave veio uma informação. É o que o ASD pede em R50 (procedência: base consultada, data da consulta), R51 (resultado como "foto" datada, não sobrescrita) e R52 (negativa de consulta registrada, para que ausência de resultado não seja lida como ausência de patrimônio) [R50–R52: lastro apenas sintético — requer validação humana]; a DKC marca a negativa e a data de corte como "inexistente hoje". O ORR já previa prov:Activity para "a cadeia de proveniência das diligências que compõem o dossiê". |
| citacaoDeBaseLegal | xsd:boolean | — |
| classeEAssunto | xsd:string | AJ-511 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação com metadado real: o campo estava "[requer pesquisa adicional]". No DataJud (CNJ) todo processo traz classe (código e nome) e assuntos (lista de código e nome), ambos das Tabelas Processuais Unificadas do CNJ. A lacuna de estrutura está resolvida; o atributo continua um texto único — separar classe de assuntos é decisão para o DSMI, com a amostra. |
| classificacaoDeRisco | xsd:string | AJ-334 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC identificação: "classificaçãoDeRisco — ex.: jurisdição de paraíso fiscal (citada genericamente) [requer pesquisa adicional]". ASD R42 (lastro humano) prevê consumo de registros de "jurisdições de baixa tributação". A fonte e a escala da classificação seguem [requer pesquisa adicional]. |
| cnpj | xsd:string | AJ-497 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação. cpf e cnpj coexistem com IdentificadorDePessoa (tipoDeIdentificador = cadastro fiscal) e pareciam duplicata. Decisão: ficam, como atalho do identificador fiscal nacional — a DKC os descreve como "chave primária de consulta" das bases, e é por essa coluna que os dados reais chegam e que a resolução de identidade é feita (ASD R53). IdentificadorDePessoa fica para todos os demais (estrangeiro, registro mercantil, passaporte) e para o que precisa de emissor ou de sinalização de duplicidade. A descrição passa a dizer isso. |
| coberturaTerritorial | xsd:string | AJ-463 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC em quatro categorias: "coberturaTemporalEGeográfica" (identificação), "abrangência (nacional, estadual, por comarca/município)" (registro), "cobertura territorial (desigual entre regiões/municípios)" (valoração), "coberturaTerritorial" (constrição). Sem ela a negativa de consulta não é interpretável: não achar um imóvel numa base que cobre um estado não diz nada sobre os demais. |
| codigo | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Código postal em texto livre, formato varia por país, não é número puro. |
| conclusao | xsd:string | AJ-252 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura ParecerJurídico (objetoDoParecer, dataDeEmissao, conclusao) emitido pela assessoria jurídica, que analisa o decreto de perdimento e em que a autoridade decisória se baseia (constricao-perdimento-e-destinacao-de-ativos-entidades.md). O ASD confirma, com lastro humano, a assessoria jurídica em perdimento e destinação como usuária que "subsidia decisões sobre destinação" — o parecer é esse subsídio. A classe não entrou na DKD; aqui entra como Documento. |
| cotacao | xsd:decimal | AJ-231 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A classe tinha moedas, data e fonte, mas não a própria taxa — sem ela valorConvertido não é reproduzível. Par FIBO ≡ exchange rate mantido no ORR (a taxa de câmbio do FIBO tem o valor da taxa como propriedade). |
| cpf | xsd:string | AJ-495 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação. cpf e cnpj coexistem com IdentificadorDePessoa (tipoDeIdentificador = cadastro fiscal) e pareciam duplicata. Decisão: ficam, como atalho do identificador fiscal nacional — a DKC os descreve como "chave primária de consulta" das bases, e é por essa coluna que os dados reais chegam e que a resolução de identidade é feita (ASD R53). IdentificadorDePessoa fica para todos os demais (estrangeiro, registro mercantil, passaporte) e para o que precisa de emissor ou de sinalização de duplicidade. A descrição passa a dizer isso. |
| data | xsd:dateTime | — |
| dataBase | xsd:dateTime | — |
| dataDaAlegacao | xsd:dateTime | — |
| dataDaAlienacao | xsd:dateTime | — |
| dataDaApuracao | xsd:dateTime | AJ-326 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: IndícioPatrimonial com descricao, origemDaInformacao e dataDaApuracao; "ÓrgãoDeInvestigação —PRODUZ→ IndícioPatrimonial", "IndícioPatrimonial —FUNDAMENTA→ MedidaDeConstrição" e "—REFERE_SE_A→ Ativo" (constricao-perdimento-e-destinacao-de-ativos-entidades.md). Não há classe de órgão de investigação na ontologia (é tipoDeAtor de AtorInstitucional); quem produz o indício, pelo ASD (lastro humano), é a unidade de busca patrimonial. |
| dataDaAverbacao | xsd:dateTime | AJ-308 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: "AverbaçãoDeÔnus —SUBCLASSE_DE→ RestriçãoOuÔnusSobreBem" (tipoDeÔnus, beneficiárioDoÔnus, dataDaAverbação) e "AlienaçãoFiduciária —SUBCLASSE_DE→ RestriçãoOuÔnusSobreBem" (credorFiduciário, dataDoRegistro) (registro-e-titularidade-de-bens-entidades.md); a DKD manteve só o gênero. ASD B21: oneração proposital do bem (alienação fiduciária, hipoteca, ônus averbado) para diluir a aparência de valor disponível. O beneficiário e o credor fiduciário são o BENEFICIA Pessoa herdado. |
| dataDaConsulta | xsd:dateTime | AJ-450 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC: ConsultaAFonte / ConsultaAFonteDeDados / RegistroDeConsultaAFonte aparece em cinco categorias (identificação de pessoas, constrição, movimentação financeira, registro e titularidade, valoração) com os mesmos campos — base consultada, data da consulta, data de corte, chave utilizada, resultado (inclusive negativo), via de obtenção — e as relações "ConsultaAFonte —DIRIGIDA_A→ SistemaOuBaseDeDados", "—REALIZADA_POR→ ÓrgãoDeBuscaPatrimonial", "—TEM_ALVO→ Pessoa", "—PRODUZ→ AsserçãoDeTitularidade / ValorEconômicoDeAtivo / DocumentoFonte", "—ATRIBUI→ StatusProbatório" e "DossiêPatrimonial —COMPOSTO_POR→ ConsultaAFonte". A DKD descartou a classe, e com isso SistemaDeInformacao ficou sem uso analítico: nada dizia de que base, em que data e com que chave veio uma informação. É o que o ASD pede em R50 (procedência: base consultada, data da consulta), R51 (resultado como "foto" datada, não sobrescrita) e R52 (negativa de consulta registrada, para que ausência de resultado não seja lida como ausência de patrimônio) [R50–R52: lastro apenas sintético — requer validação humana]; a DKC marca a negativa e a data de corte como "inexistente hoje". O ORR já previa prov:Activity para "a cadeia de proveniência das diligências que compõem o dossiê". |
| dataDaConversao | xsd:dateTime | AJ-162 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação: "posição na cadeia de sub-rogação (bem originário → conversões → bem atual)" e relação Bem SUB_ROGA Bem; DKC constrição registra "cadeia de sub-rogação" como campo ausente nos controles; ASD R17/R18 pedem a cadeia com data e valor de cada conversão. Reificada para carregar data e valor. |
| dataDaCotacao | xsd:dateTime | — |
| dataDaDecisao | xsd:dateTime | — |
| dataDaIndicacao | xsd:dateTime | — |
| dataDaMedida | xsd:dateTime | — |
| dataDaTransmissao | xsd:dateTime | — |
| dataDeAjuizamento | xsd:dateTime | AJ-509 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Metadado real: a base nacional de processos do CNJ (DataJud, API pública) expõe, para todo processo, o campo dataAjuizamento. A DKC não o listava e eu não o havia incluído por só ter o FollowTheMoney (fileDate) como apoio. Com a data de ajuizamento, o tempo de tramitação e a proximidade da prescrição (ASD R56; dataDePrescricao) passam a ser calculáveis. Data de encerramento não entra: no DataJud o encerramento é um movimento (baixa), não um campo do processo. |
| dataDeAtribuicao | xsd:dateTime | AJ-470 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC movimentação: "data de atribuição"; a DKC de constrição a chama de dataDeCorte. Desde AJ-451 dataDeCorte tem sentido preciso — a data de referência do resultado de uma consulta (ConsultaAFonte, DossieDeBuscaPatrimonial). No status, o que se registra é quando a qualificação foi atribuída; com nome próprio os dois não se confundem. |
| dataDeConstituicao | xsd:dateTime | — |
| dataDeCorte | xsd:dateTime | AJ-451 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC: ConsultaAFonte / ConsultaAFonteDeDados / RegistroDeConsultaAFonte aparece em cinco categorias (identificação de pessoas, constrição, movimentação financeira, registro e titularidade, valoração) com os mesmos campos — base consultada, data da consulta, data de corte, chave utilizada, resultado (inclusive negativo), via de obtenção — e as relações "ConsultaAFonte —DIRIGIDA_A→ SistemaOuBaseDeDados", "—REALIZADA_POR→ ÓrgãoDeBuscaPatrimonial", "—TEM_ALVO→ Pessoa", "—PRODUZ→ AsserçãoDeTitularidade / ValorEconômicoDeAtivo / DocumentoFonte", "—ATRIBUI→ StatusProbatório" e "DossiêPatrimonial —COMPOSTO_POR→ ConsultaAFonte". A DKD descartou a classe, e com isso SistemaDeInformacao ficou sem uso analítico: nada dizia de que base, em que data e com que chave veio uma informação. É o que o ASD pede em R50 (procedência: base consultada, data da consulta), R51 (resultado como "foto" datada, não sobrescrita) e R52 (negativa de consulta registrada, para que ausência de resultado não seja lida como ausência de patrimônio) [R50–R52: lastro apenas sintético — requer validação humana]; a DKC marca a negativa e a data de corte como "inexistente hoje". O ORR já previa prov:Activity para "a cadeia de proveniência das diligências que compõem o dossiê". |
| dataDeEfetivacao | xsd:dateTime | — |
| dataDeElaboracao | xsd:dateTime | AJ-134 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação captura PeçaProcessual (tipo, data de elaboração, data de juntada, autor, nível de sigilo) com DecisãoJudicial como sua especialização e relações com processo, incidente e documentos anexos; nada disso chegou à DKD. ASD R20 e R50 pedem o vínculo da decisão e da procedência à "peça". |
| dataDeEmissao | xsd:dateTime | AJ-251 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura ParecerJurídico (objetoDoParecer, dataDeEmissao, conclusao) emitido pela assessoria jurídica, que analisa o decreto de perdimento e em que a autoridade decisória se baseia (constricao-perdimento-e-destinacao-de-ativos-entidades.md). O ASD confirma, com lastro humano, a assessoria jurídica em perdimento e destinação como usuária que "subsidia decisões sobre destinação" — o parecer é esse subsídio. A classe não entrou na DKD; aqui entra como Documento. |
| dataDeEnvio | xsd:dateTime | — |
| dataDeExecucao | xsd:dateTime | — |
| dataDeFim | xsd:dateTime | AJ-411 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A definição do gênero (AJ-258) diz "com identidade própria, datas e qualificação probatória", mas as datas estavam repetidas nas filhas com o mesmo nome e tipo — dataDeInicio/dataDeFim em Divida, ParticipacaoEmProcesso, SancaoIndividual e VinculoEntrePessoas (DKC: "dataDeInícioVigência / dataDeFimVigência", identificacao-de-pessoas-e-estruturas-societarias-entidades.md) — e com outro nome em ParticipacaoSocietaria (dataDeEntrada/dataDeSaida, "período de entrada/saída"). Sobem para o gênero; FTM Ownership, Debt, Sanction, Succession e CourtCaseParty são todos Interval com startDate/endDate. |
| dataDeInicio | xsd:dateTime | AJ-410 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A definição do gênero (AJ-258) diz "com identidade própria, datas e qualificação probatória", mas as datas estavam repetidas nas filhas com o mesmo nome e tipo — dataDeInicio/dataDeFim em Divida, ParticipacaoEmProcesso, SancaoIndividual e VinculoEntrePessoas (DKC: "dataDeInícioVigência / dataDeFimVigência", identificacao-de-pessoas-e-estruturas-societarias-entidades.md) — e com outro nome em ParticipacaoSocietaria (dataDeEntrada/dataDeSaida, "período de entrada/saída"). Sobem para o gênero; FTM Ownership, Debt, Sanction, Succession e CourtCaseParty são todos Interval com startDate/endDate. |
| dataDeInstauracao | xsd:dateTime | — |
| dataDeJuntada | xsd:dateTime | AJ-145 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação captura DocumentoComprobatório (certidões e documentos juntados: registro de imóveis, trânsito, societários, contratos, declarações retificadas, recibos, notas fiscais) com emissor, data de juntada, bem comprovado e alegação que sustenta; a DKD ficou só com Documento genérico. |
| dataDeNascimento | xsd:dateTime | — |
| dataDePrescricao | xsd:dateTime | AJ-405 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: ASD R56: "casos próximos de prazo prescricional"; DKC pedidos: CritérioDeCriticidade inclui "prazo de prescrição". É prazo do processo/crime, não do pedido (PrazoDeResposta), e não estava em lugar nenhum. |
| dataDeRecebimento | xsd:dateTime | — |
| dataDeReferencia | xsd:dateTime | — |
| dataDeResposta | xsd:dateTime | — |
| dataDeVigencia | xsd:dateTime | — |
| dataDoAto | xsd:dateTime | AJ-199 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: dataDoAto e TEM_PARTE → Pessoa existiam, idênticos, em AtoNotarial e AtoRegistral — foi essa repetição que justificou criar o gênero (AJ-45); sobem para AtoNotarialOuRegistral com o mesmo alinhamento. |
| dataDoDecreto | xsd:dateTime | — |
| dataDoDocumento | xsd:dateTime | AJ-272 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC usa o confronto "data do documento vs. data de juntada" na análise de boa-fé e de contrato retroativo (tramitacao-processual-e-decisoes-sobre-bens.md), mas DocumentoComprobatorio só tinha dataDeJuntada. Mesmo nome e tipo já usados em DocumentoDoPedido. |
| dataDoEvento | xsd:dateTime | AJ-369 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura o evento de tramitação em quatro categorias — "EventoDeAndamento: estado do pedido no momento; data/hora; sequência de estados ao longo do tempo (histórico, não valor único)" (pedidos), "EventoDeTramitação: tipoDeEvento (envio, saneamento, reclassificação de via, resposta), dataDoEvento" (marco normativo), "EventoDeTramitação (marco/mudança de estado) … OCORRE_EM Pedido, É_PRATICADO_POR órgão, É_REGISTRADO_EM SistemaDeInformação" (tramitação) e EventoDeReclassificaçãoDeVia/EventoDeRetrabalho (gestão) — e a DKD manteve só faseDoFluxo e status como valor único no pedido. ASD R27 pede os marcos visíveis (pedido formulado, saneamento, complementação, resposta, bloqueio confirmado, repatriação) e R59 a linha do tempo. Evento concreto, com dado por trás — não o gênero abstrato Evento, que ficou descartado. |
| dataDoRegistro | xsd:dateTime | AJ-310 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: "AverbaçãoDeÔnus —SUBCLASSE_DE→ RestriçãoOuÔnusSobreBem" (tipoDeÔnus, beneficiárioDoÔnus, dataDaAverbação) e "AlienaçãoFiduciária —SUBCLASSE_DE→ RestriçãoOuÔnusSobreBem" (credorFiduciário, dataDoRegistro) (registro-e-titularidade-de-bens-entidades.md); a DKD manteve só o gênero. ASD B21: oneração proposital do bem (alienação fiduciária, hipoteca, ônus averbado) para diluir a aparência de valor disponível. O beneficiário e o credor fiduciário são o BENEFICIA Pessoa herdado. |
| dataDoTransitoEmJulgado | xsd:dateTime | AJ-507 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DecisaoJudicial.transitoEmJulgado era um texto para duas coisas ("indicador e data de trânsito"). Separa-se em booleano e data, para que a consulta gerencial que a DKC de gestão de carteira descreve (casos por estágio; "trânsito em julgado"; "gap temporal entre perdimento declarado e destinação") seja possível, e para sustentar StatusProbatorio.estagioProbatorio = "decisão transitada em julgado" (AJ-467). |
| dataDoUltimoAto | xsd:dateTime | — |
| dataLimite | xsd:dateTime | — |
| denominacao | xsd:string | AJ-380 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC marco normativo: "RequisitoDeAdmissibilidade: denominação (ex.: dupla incriminação), definição (conduta deve ser crime em ambos os Estados), efeitoDoNãoAtendimento (travamento, devolução/saneamento); CONDICIONA Pedido; Instrumento DEFINE RequisitoDeAdmissibilidade". ASD R31: dupla incriminação e demais pressupostos de admissibilidade como condição avaliável do pedido. Distinto de RequisitoFormal (tradução, apostilamento): é pressuposto de mérito. Gênero comum com RequisitoFormal fica para a revisão deste. |
| denominacaoPopular | xsd:string | AJ-285 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura NormaNacional ("legislação interna de um Estado": númeroEAnoDaLei, denominaçãoPopular, jurisdiçãoDeOrigem, temaNormativo, vigência) com "É_COMPOSTA_POR DispositivoNormativo", "FUNDAMENTA MedidaDeConstriçãoOuPerdimento" e "VIGE_EM Jurisdição" (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). A DKD não a manteve: hoje um dispositivo de lei interna (CPP art. 125, Lei 8.429 art. 16, Lei 9.613) não tem norma a que pertencer — só o tratado tem (É_COMPOSTO_POR). Os próprios ajustes desta revisão citam essas leis como fonte "norma". Lacuna reconhecida pela DKC: "tipificação penal como domínio conexo × interno [requer validação]". |
| dependenciaDeAvaliacaoOuLeilao | xsd:boolean | — |
| descricao | xsd:string | AJ-321 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Sobe para o gênero Indicio: vale igualmente para o indício patrimonial (DKC) e herda para o financeiro. |
| descricaoDoNexo | xsd:string | AJ-305 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC: FatoDelituoso.descricaoDoNexoCausalComOBem "em texto livre, sem campo estruturado" (constricao-perdimento-e-destinacao-de-ativos-entidades.md) — a DKD a pôs em Ativo.nexoCausal. O texto é do vínculo, não do ativo: muda para NexoCausal, como recuo quando a natureza não estiver estruturada. |
| descricaoFaticaDaConduta | xsd:string | AJ-387 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC marco normativo: Pedido.descriçãoFáticaDaConduta, exigida por instrumentos que pedem "descrição fática além da citação de dispositivos" (InstrumentoJurídicoDeCooperação.exigeDescriçãoFáticaDaConduta). É o insumo da avaliação de dupla incriminação (ASD R31). |
| desfecho | xsd:string | AJ-389 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC pedidos: "DesfechoDoPedido: classificação (cumprido, recusado, sem resposta, prazo estourado sem comunicação); fundamento da recusa". Entra como dois atributos do pedido, não como classe: um desfecho por pedido, sem relação própria além de classificar o pedido. Distinto de status (estado corrente) e faseDoFluxo. |
| efeitoDoNaoAtendimento | xsd:string | AJ-381 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC marco normativo: "RequisitoDeAdmissibilidade: denominação (ex.: dupla incriminação), definição (conduta deve ser crime em ambos os Estados), efeitoDoNãoAtendimento (travamento, devolução/saneamento); CONDICIONA Pedido; Instrumento DEFINE RequisitoDeAdmissibilidade". ASD R31: dupla incriminação e demais pressupostos de admissibilidade como condição avaliável do pedido. Distinto de RequisitoFormal (tradução, apostilamento): é pressuposto de mérito. Gênero comum com RequisitoFormal fica para a revisão deste. |
| estado | xsd:string | AJ-235 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação. A descrição afirmava "nenhuma captura no domínio corresponde a unidade federativa", mas a DKC registra "município / UF" em BemImóvel e "município / UF / jurisdição" em OrganizaçãoCustodianteDeRegistro (registro-e-titularidade-de-bens-entidades.md) — o campo tem lastro em metadado e a marca [sem lastro em DKC] estava errada. |
| estadoResultante | xsd:string | AJ-370 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura o evento de tramitação em quatro categorias — "EventoDeAndamento: estado do pedido no momento; data/hora; sequência de estados ao longo do tempo (histórico, não valor único)" (pedidos), "EventoDeTramitação: tipoDeEvento (envio, saneamento, reclassificação de via, resposta), dataDoEvento" (marco normativo), "EventoDeTramitação (marco/mudança de estado) … OCORRE_EM Pedido, É_PRATICADO_POR órgão, É_REGISTRADO_EM SistemaDeInformação" (tramitação) e EventoDeReclassificaçãoDeVia/EventoDeRetrabalho (gestão) — e a DKD manteve só faseDoFluxo e status como valor único no pedido. ASD R27 pede os marcos visíveis (pedido formulado, saneamento, complementação, resposta, bloqueio confirmado, repatriação) e R59 a linha do tempo. Evento concreto, com dado por trás — não o gênero abstrato Evento, que ficou descartado. |
| estagioProbatorio | xsd:string | AJ-467 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura duas escalas diferentes sob o mesmo nome, e a DKD as fundiu num atributo só ("confirmado, provável, hipótese ou estágio probatório equivalente"). Constrição: "valor — confirmado / provável / hipótese" — o quanto o analista confia na afirmação. Movimentação financeira: "grau de certeza (alegação, indício, conclusão pericial, decisão transitada em julgado)" — em que ponto do processo a afirmação está. O ASD R49 pede as duas como coisas distintas: "grau de confiança e de status probatório (alegação, indício, conclusão pericial, decisão transitada em julgado)" [lastro apenas sintético — requer validação humana]. Uma titularidade pode ser "confirmada" pelo analista e ainda ser só "alegação" nos autos. grauDeCerteza fica com a primeira escala e estagioProbatorio recebe a segunda. |
| exigeExequatur | xsd:boolean | AJ-482 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: ViaProcessual é um catálogo de tipos de via (auxílio direto, carta rogatória, via diplomática, rede), e Exequatur é uma decisão concreta (⊂ DecisaoJudicial, com data, objeto e órgão concedente). "ViaProcessual EXIGE Exequatur" ligava um tipo a uma decisão específica — não há qual exequatur apontar a partir de "carta rogatória" em geral. A DKC do marco normativo registra a informação nos dois níveis: como atributo do tipo, "exigênciaDeExequatur (booleano)", e como relação; a DKD ficou só com a relação. Passa a valer o atributo, que é o que o tipo de via pode dizer; o exequatur concreto liga-se ao pedido (ajuste seguinte). ASD R25: distinguir auxílio direto e carta rogatória [lastro apenas sintético — requer validação humana]. |
| existenciaDeApi | xsd:boolean | — |
| existenciaDeRastroBancario | xsd:boolean | AJ-125 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC movimentação: "existência de rastro bancário correspondente (presença/ausência)" como elemento da alegação de origem lícita. |
| formato | xsd:string | AJ-154 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura "formato" em três documentos distintos — PeçaProcessual e DocumentoComprobatório (PDF, formulário escaneado; tramitação) e DocumentoFonte (texto livre/prosa, imagem, tabela; identificação de pessoas). Mesmo dado em três classes → sobe para Documento. Relevante para a ingestão por NER/LLM (ASD R48). |
| fundamentoDaRecusa | xsd:string | AJ-390 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC pedidos: "DesfechoDoPedido: classificação (cumprido, recusado, sem resposta, prazo estourado sem comunicação); fundamento da recusa". Entra como dois atributos do pedido, não como classe: um desfecho por pedido, sem relação própria além de classificar o pedido. Distinto de status (estado corrente) e faseDoFluxo. |
| grauDeCerteza | xsd:string | AJ-466 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura duas escalas diferentes sob o mesmo nome, e a DKD as fundiu num atributo só ("confirmado, provável, hipótese ou estágio probatório equivalente"). Constrição: "valor — confirmado / provável / hipótese" — o quanto o analista confia na afirmação. Movimentação financeira: "grau de certeza (alegação, indício, conclusão pericial, decisão transitada em julgado)" — em que ponto do processo a afirmação está. O ASD R49 pede as duas como coisas distintas: "grau de confiança e de status probatório (alegação, indício, conclusão pericial, decisão transitada em julgado)" [lastro apenas sintético — requer validação humana]. Uma titularidade pode ser "confirmada" pelo analista e ainda ser só "alegação" nos autos. grauDeCerteza fica com a primeira escala e estagioProbatorio recebe a segunda. |
| grauDeCertezaDaIdentidade | xsd:decimal | AJ-93 (ajuste manual): EM NUMERO DE 0 A 100 |
| grauDeParentesco | xsd:string | AJ-431 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: "VínculoDeParentesco (especialização de VínculoEntrePessoas): tipoDeParentesco — cônjuge, ex-cônjuge, parente em diferentes graus; grauDeParentesco — ex.: primeiro grau; parentescoPorAfinidade — não declarado nas bases" (identificacao-de-pessoas-e-estruturas-societarias-entidades.md). A DKD manteve só o gênero, com regimeDeBens ("aplicável a vínculos de parentesco") pendurado nele. Das quatro espécies de tipoDeVinculo, parentesco era a única sem classe — e é a do núcleo da tese (isMotherOf, isFatherOf, isSpouseOf) e do ASD R37 (interpostas pessoas por parentesco), R34 e B26. FTM Family (person, relative, relationship) é o par exato; o narrowMatch que VinculoEntrePessoas tinha com Family passa a esta classe. |
| historicoVersionado | xsd:boolean | — |
| iban | xsd:string | AJ-168 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Par FTM ≡ BankAccount mantido no ORR (iban); contas estrangeiras em pedidos de cooperação (ASD R41, R43) são identificadas por IBAN, não por agência e número. |
| identificadorDoAtivo | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Identificador único e persistente do ativo, tratado como código. |
| identificadorDoBemNoRegistro | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Identificador de registro do bem, é um código/referência. |
| identificadorDoRegistro | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Identificador de processo ou registro de propriedade intelectual é um código. |
| identificadorEstavel | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Identificador oficial do instrumento jurídico é um código, não numérico puro. |
| indicadorDeAmbiguidade | xsd:boolean | — |
| indicadorDeControleDeFato | xsd:boolean | AJ-216 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC identificação de pessoas: "VínculoDeRepresentação (especialização de VínculoEntrePessoas): tipoDeRepresentação (representante legal, procurador), indicadorDeControleDeFato (ex.: empresa controlada por procuração), INSTRUMENTADO_POR AtoNotarial". Lacuna externa FTM Representation mantida no ORR, IRI confirmada. |
| indicadorDeDuplicidadeDocumental | xsd:boolean | — |
| indicadorDePessoaExpostaPoliticamente | xsd:boolean | — |
| indicadorDeRetificadora | xsd:boolean | — |
| indicadorDeSobreposicao | xsd:boolean | — |
| indicioDeSubdeclaracaoDeValor | xsd:boolean | AJ-210 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC registro-e-titularidade, literal: "EscrituraPública (subclasse de AtoNotarial): valorDeclarado, indícioDeSubdeclaraçãoDeValor"; resposta humana do ASD (C2) aponta a "subdeclaração de valor na escritura" como distorção típica. |
| inscricao | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Número de inscrição da embarcação é um código de registro, não contagem. |
| inscricaoCadastralMunicipal | xsd:string | AJ-170 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Atributos capturados na DKC registro-e-titularidade para BemImóvel e não levados à DKD: inscrição cadastral municipal (confronto com o cadastro tributário, "fonte reconhecida de inconsistência"), natureza urbana ou rural e indicador de integralização em capital social (imóvel colocado em holding). |
| instanciaDeJulgamento | xsd:string | AJ-124 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC carteira: "instância de julgamento" da alegação; ASD R19 lista "instância" entre os estados. |
| integralizadoEmCapitalSocial | xsd:boolean | AJ-172 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Atributos capturados na DKC registro-e-titularidade para BemImóvel e não levados à DKD: inscrição cadastral municipal (confronto com o cadastro tributário, "fonte reconhecida de inconsistência"), natureza urbana ou rural e indicador de integralização em capital social (imóvel colocado em holding). |
| isin | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Código ISIN é um identificador alfanumérico padronizado. |
| legibilidade | xsd:string | AJ-155 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação: "legibilidade/qualidade" do documento comprobatório juntado (formulário escaneado), condição para extração automática (ASD R48). |
| marcaDeNacionalidadeEMatricula | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Identificação registral da aeronave é um código alfanumérico. |
| modalidade | xsd:string | AJ-248 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação. A lista "fundo, vítimas, erário, partilha, leilão" mistura o tipo do destinatário (fundo, vítimas, erário — já em EnteDestinatario.tipoDeDestinatario, via BENEFICIA) com a modalidade (partilha, leilão); e "partilha internacional" é agora a subclasse Repatriacao. |
| moeda | xsd:string | AJ-175 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Par FTM ≡ CryptoWallet mantido no ORR (currency); a própria descrição de saldo ("na unidade própria da criptomoeda, ex.: BTC") pressupõe a unidade. |
| municipio | xsd:string | AJ-233 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação. A descrição ainda dizia que o campo ficava "dentro de CodigoPostal", o que deixou de valer com o AJ-63. Lastro DKC: BemImóvel "município / UF" e MatrículaImobiliária "município" (registro-e-titularidade-de-bens-entidades.md). |
| naturezaDoAto | xsd:string | AJ-205 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: tipoDeAto (AtoNotarial: escritura, procuração) e naturezaDoAto (AtoRegistral: transmissão, registro, averbação) são o mesmo dado com dois nomes; a DKC usa "naturezaDoAto" nas duas fichas. Unificado no gênero, com a regra de Ativo.tipoDeAtivo: usar só quando não houver subclasse específica. |
| naturezaDoLancamento | xsd:string | AJ-508 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: O lançamento não dizia se o valor entrou ou saiu da conta: TEM_CONTRAPARTE Pessoa não tem direção, e a DKC só registrava "tipo de operação [requer pesquisa adicional]". O leiaute oficial em que as instituições financeiras entregam extratos nas quebras de sigilo — Carta-Circular BCB nº 3.454, de 14/6/2010 (arquivo EXTRATO) — tem o campo NATUREZA_LANCAMENTO, de um caractere: "C" crédito, "D" débito, "*" outros (bloqueios, provisões, lançamentos futuros). Sem ele não se distingue depósito fracionado de saque fracionado (ASD: indícios de fracionamento, movimentação em espécie). O FollowTheMoney separa payer de beneficiary; aqui a direção fica no atributo, como na fonte. |
| naturezaDoNexo | xsd:string | AJ-302 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: ASD R11 (lastro humano): "representar o vínculo entre ativo específico e a condenação/fato criminoso (nexo causal), hoje disperso em texto livre". A relação direta Ativo TEM_NEXO_COM FatoCriminoso (AJ-86) diz que há nexo, não qual: o Código Penal, art. 91, II, distingue instrumentos do crime (alínea a), produto e proveito (alínea b) e, no § 1º, bens ou valores equivalentes — e a DKC já separa "GERA_PRODUTO_OU_PROVEITO_EM" de "CadeiaDeSubRogação" (constricao-perdimento-e-destinacao-de-ativos-entidades.md), e qualifica o vínculo com StatusProbatório (confirmado / provável / hipótese). FundamentoLegal.tipoDeOrigemDoBem depende dessa natureza. Vira relação reificada, no padrão de RelacaoReificada (herda QUALIFICADO_POR StatusProbatorio); TEM_NEXO_COM fica como atalho direto. |
| naturezaUrbanaOuRural | xsd:string | AJ-171 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Atributos capturados na DKC registro-e-titularidade para BemImóvel e não levados à DKD: inscrição cadastral municipal (confronto com o cadastro tributário, "fonte reconhecida de inconsistência"), natureza urbana ou rural e indicador de integralização em capital social (imóvel colocado em holding). |
| nivelDeSigilo | xsd:string | AJ-404 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação: "nível de sigilo / segredo de justiça" como atributo do processo; ASD R62 pede segmentação de acesso por processo respeitando segredo de justiça. Mesmo nome e tipo de PecaProcessual.nivelDeSigilo. |
| nomeOuCodigo | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Nome ou código da jurisdição, tratado como identificador textual. |
| numeroDaConta | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Número de conta bancária pode ter zeros à esquerda e dígitos verificadores, não é inteiro puro. |
| numeroDaMatricula | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Número de matrícula imobiliária é um identificador registral, não contagem. |
| numeroDeReferenciaEstrangeiro | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Referência de contraparte estrangeira é um código/identificador. |
| numeroDoProcesso | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Número de processo judicial segue formatação padronizada com pontuação, não é inteiro. |
| numeroEAnoDaLei | xsd:string | AJ-287 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura NormaNacional ("legislação interna de um Estado": númeroEAnoDaLei, denominaçãoPopular, jurisdiçãoDeOrigem, temaNormativo, vigência) com "É_COMPOSTA_POR DispositivoNormativo", "FUNDAMENTA MedidaDeConstriçãoOuPerdimento" e "VIGE_EM Jurisdição" (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). A DKD não a manteve: hoje um dispositivo de lei interna (CPP art. 125, Lei 8.429 art. 16, Lei 9.613) não tem norma a que pertencer — só o tratado tem (É_COMPOSTO_POR). Os próprios ajustes desta revisão citam essas leis como fonte "norma". Lacuna reconhecida pela DKC: "tipificação penal como domínio conexo × interno [requer validação]". |
| numeroOuReferencia | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Identificador ou referência do pedido, tratado como código. |
| objetoDoParecer | xsd:string | AJ-250 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura ParecerJurídico (objetoDoParecer, dataDeEmissao, conclusao) emitido pela assessoria jurídica, que analisa o decreto de perdimento e em que a autoridade decisória se baseia (constricao-perdimento-e-destinacao-de-ativos-entidades.md). O ASD confirma, com lastro humano, a assessoria jurídica em perdimento e destinação como usuária que "subsidia decisões sobre destinação" — o parecer é esse subsídio. A classe não entrou na DKD; aqui entra como Documento. |
| obrigatoriedade | xsd:boolean | — |
| origemDaInformacao | xsd:string | AJ-325 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: IndícioPatrimonial com descricao, origemDaInformacao e dataDaApuracao; "ÓrgãoDeInvestigação —PRODUZ→ IndícioPatrimonial", "IndícioPatrimonial —FUNDAMENTA→ MedidaDeConstrição" e "—REFERE_SE_A→ Ativo" (constricao-perdimento-e-destinacao-de-ativos-entidades.md). Não há classe de órgão de investigação na ontologia (é tipoDeAtor de AtorInstitucional); quem produz o indício, pelo ASD (lastro humano), é a unidade de busca patrimonial. |
| origemDoPrazo | xsd:string | AJ-399 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: origemDoPrazo ("tratado, regra interna ou acordo") nomeia em texto o elemento normativo que fixa o prazo. DKC: "InstrumentoJurídicoInternacional —ESTABELECE→ PrazoDeRespostaPrevisto" (pedidos-de-cooperacao-entre-jurisdicoes-entidades.md); regra interna é NormaNacional. A relação vai ao gênero ElementoNormativo, com o alinhamento já usado em FUNDAMENTA_SE_EM; o texto fica como recuo para acordo informal ou origem não identificada. |
| papel | xsd:string | AJ-77 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: O ORR mantém a lacuna externa FTM CourtCaseParty ("parte em processo com role (autor/réu) e período — relação reificada pessoa–processo"). ASD R33 e R36 (lastro humano) consultam "condenados", mas TEM_PARTE não tem papel e Pessoa.papelNoCaso é global. |
| patrimonioConsiderado | xsd:decimal | AJ-224 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC movimentação: o teste de compatibilidade considera "renda declarada considerada" e "patrimônio/ativos identificados"; a DKD levou só a renda. Sem o montante do patrimônio o resultado não é reproduzível. |
| patrimonioDeclarado | xsd:decimal | — |
| percentualDeParticipacao | xsd:decimal | — |
| placa | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Placa de veículo é alfanumérica, não numérica pura. |
| possuiTraducao | xsd:boolean | — |
| prazoPrevistoEmDias | xsd:decimal | AJ-396 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC: "prazo/SLA por pedido; prazo de resposta previsto em tratado" e "PrazoDeRespostaPrevisto: prazo definido por instrumento aplicável; unidade; marco inicial de contagem" (pedidos-de-cooperacao-entre-jurisdicoes-entidades.md). A classe tinha o marco inicial (dataDeInicio) e a data-limite, mas não a duração prevista, que é o SLA em si; a unidade fica fixa em dias. |
| preveReparticaoDeAtivos | xsd:boolean | AJ-299 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC: InstrumentoJurídicoDeCooperação.prevêRepartiçãoDeAtivos (asset sharing), sem marca de pesquisa adicional (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md); é o que permite a partilha internacional que Repatriacao.condicaoDePartilha descreve e que ASD R22 inclui como destinação. Os demais booleanos da DKC (exige descrição fática, exige dados de conta) são requisitos formais e já cabem em DEFINE RequisitoFormal. |
| quantia | xsd:decimal | — |
| recorrenciaEmCasos | xsd:boolean | sugestão da IA (claude-sonnet-5 (anthropic)): Indica se a pessoa já foi vista em casos anteriores, um indicador sim/não. |
| referenciaDoArtigoOuParagrafo | xsd:string | AJ-513 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: O atributo DispositivoNormativo.referencia e a relação ProcessoJudicial REFERENCIA Ativo geravam o mesmo IRI (rec:referencia), declarado como DatatypeProperty e como ObjectProperty — punning ilegal no OWL 2 DL, apontado pelo Protégé ao carregar a ontologia ("Illegal redeclarations of entities"), que descarta uma das duas. O atributo volta ao nome que a DKC lhe dá: "referênciaDoArtigoOuParágrafo" (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). O validador passa a recusar a colisão (regra E12). |
| referenciaEstrangeira | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Referência usada para religação ao pedido é um código identificador. |
| referenciaNormativa | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Referência normativa é um código/citação textual. |
| renavam | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): RENAVAM é um código de registro de veículo, pode ter zeros à esquerda. |
| rendaConsiderada | xsd:decimal | — |
| rendaDeclarada | xsd:decimal | — |
| resultadoDaConsulta | xsd:string | AJ-454 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC: ConsultaAFonte / ConsultaAFonteDeDados / RegistroDeConsultaAFonte aparece em cinco categorias (identificação de pessoas, constrição, movimentação financeira, registro e titularidade, valoração) com os mesmos campos — base consultada, data da consulta, data de corte, chave utilizada, resultado (inclusive negativo), via de obtenção — e as relações "ConsultaAFonte —DIRIGIDA_A→ SistemaOuBaseDeDados", "—REALIZADA_POR→ ÓrgãoDeBuscaPatrimonial", "—TEM_ALVO→ Pessoa", "—PRODUZ→ AsserçãoDeTitularidade / ValorEconômicoDeAtivo / DocumentoFonte", "—ATRIBUI→ StatusProbatório" e "DossiêPatrimonial —COMPOSTO_POR→ ConsultaAFonte". A DKD descartou a classe, e com isso SistemaDeInformacao ficou sem uso analítico: nada dizia de que base, em que data e com que chave veio uma informação. É o que o ASD pede em R50 (procedência: base consultada, data da consulta), R51 (resultado como "foto" datada, não sobrescrita) e R52 (negativa de consulta registrada, para que ausência de resultado não seja lida como ausência de patrimônio) [R50–R52: lastro apenas sintético — requer validação humana]; a DKC marca a negativa e a data de corte como "inexistente hoje". O ORR já previa prov:Activity para "a cadeia de proveniência das diligências que compõem o dossiê". |
| saldo | xsd:decimal | — |
| taxaDeSucesso | xsd:decimal | — |
| temaDaConvencao | xsd:string | AJ-293 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC: ConvençãoMultilateral.temaDaConvenção ("corrupção, crime organizado transnacional, legalização de documentos") (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). Organismo depositário fica [requer pesquisa adicional]. |
| temaNormativo | xsd:string | AJ-286 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura NormaNacional ("legislação interna de um Estado": númeroEAnoDaLei, denominaçãoPopular, jurisdiçãoDeOrigem, temaNormativo, vigência) com "É_COMPOSTA_POR DispositivoNormativo", "FUNDAMENTA MedidaDeConstriçãoOuPerdimento" e "VIGE_EM Jurisdição" (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). A DKD não a manteve: hoje um dispositivo de lei interna (CPP art. 125, Lei 8.429 art. 16, Lei 9.613) não tem norma a que pertencer — só o tratado tem (É_COMPOSTO_POR). Os próprios ajustes desta revisão citam essas leis como fonte "norma". Lacuna reconhecida pela DKC: "tipificação penal como domínio conexo × interno [requer validação]". |
| tempoDecorrido | xsd:decimal | AJ-395 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: tempoDecorrido era string, inútil para "casos parados há mais de X tempo" (ASD R56); passa a decimal em dias, como Jurisdição.tempoMedioDeResposta. DKC: "tempo parado por caso" (pedidos-de-cooperacao-entre-jurisdicoes-entidades.md). |
| tempoMedioDeResposta | xsd:decimal | AJ-336 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC gestão de carteira, atributos literais da Jurisdição: "volume de pedidos em aberto; tempo médio entre envio e resposta; taxa de sucesso". ASD R56: "tempo médio de resposta por país e taxa de sucesso por país/tratado". tempoMedioDeResposta era string, inútil para a consulta gerencial; passa a decimal em dias (unidade é decisão de modelagem — a DKC não a informa). São métricas derivadas dos pedidos, mantidas como atributos porque a DKC as captura assim e o histórico consolidado "inexistente" é exatamente a lacuna que o ASD quer suprir. |
| teor | xsd:string | AJ-123 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação: "teor da alegação (registrada apenas como capítulo textual)"; DKC movimentação: "descrição da alegação (hoje em texto livre nos autos)". |
| ticker | xsd:string | sugestão da IA (claude-sonnet-5 (anthropic)): Código de negociação de valor mobiliário é alfanumérico. |
| tipo | xsd:string | AJ-319 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Sobe para o gênero Indicio: vale igualmente para o indício patrimonial (DKC) e herda para o financeiro. |
| tipoDeAtor | xsd:string | AJ-106 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Recriado só para documentar: o atributo compete com a taxonomia de subclasses e passa a valer apenas quando não houver subclasse específica — mesma regra dada a Ativo.tipoDeAtivo na DKD. |
| tipoDeDocumento | xsd:string | AJ-144 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação captura DocumentoComprobatório (certidões e documentos juntados: registro de imóveis, trânsito, societários, contratos, declarações retificadas, recibos, notas fiscais) com emissor, data de juntada, bem comprovado e alegação que sustenta; a DKD ficou só com Documento genérico. |
| tipoDeEvento | xsd:string | AJ-368 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura o evento de tramitação em quatro categorias — "EventoDeAndamento: estado do pedido no momento; data/hora; sequência de estados ao longo do tempo (histórico, não valor único)" (pedidos), "EventoDeTramitação: tipoDeEvento (envio, saneamento, reclassificação de via, resposta), dataDoEvento" (marco normativo), "EventoDeTramitação (marco/mudança de estado) … OCORRE_EM Pedido, É_PRATICADO_POR órgão, É_REGISTRADO_EM SistemaDeInformação" (tramitação) e EventoDeReclassificaçãoDeVia/EventoDeRetrabalho (gestão) — e a DKD manteve só faseDoFluxo e status como valor único no pedido. ASD R27 pede os marcos visíveis (pedido formulado, saneamento, complementação, resposta, bloqueio confirmado, repatriação) e R59 a linha do tempo. Evento concreto, com dado por trás — não o gênero abstrato Evento, que ficou descartado. |
| tipoDeInstrumento | xsd:string | AJ-298 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: "InstrumentoJurídicoDeCooperação —ESPECIALIZA_SE_EM→ ConvençãoMultilateral / TratadoBilateralDeAssistênciaJurídicaMútua / BaseDeCooperaçãoPorReciprocidade", cada uma com atributos próprios (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). ASD R46 nomeia UNCAC, Palermo, OEA e MLATs; R25 põe o instrumento como determinante da via. O atributo tipoDeInstrumento passa a valer só quando não houver subclasse específica — mesma regra de Ativo.tipoDeAtivo e AtorInstitucional.tipoDeAtor. |
| tipoDeMedida | xsd:string | AJ-366 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação: MedidaDeConstricao tem cinco espécies (AJ-66 a AJ-70), então tipoDeMedida vale só quando não houver subclasse específica — mesma regra de Ativo.tipoDeAtivo, AtorInstitucional.tipoDeAtor e InstrumentoJuridicoDeCooperacao.tipoDeInstrumento. |
| tipoDeMedidaSolicitada | xsd:string | AJ-388 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC em duas categorias: "tipoDeMedidaSolicitada — bloqueio, sequestro, confisco, repatriação (categórico ou texto livre; sem tipificação estruturada)". A forma estruturada é SOLICITA MedidaDeConstricao / Repatriacao; o texto fica como recuo quando a fonte não tipifica — mesmo padrão de FundamentoLegal.referenciaNormativa e NexoCausal.descricaoDoNexo. |
| tipoDeOnus | xsd:string | AJ-307 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: "AverbaçãoDeÔnus —SUBCLASSE_DE→ RestriçãoOuÔnusSobreBem" (tipoDeÔnus, beneficiárioDoÔnus, dataDaAverbação) e "AlienaçãoFiduciária —SUBCLASSE_DE→ RestriçãoOuÔnusSobreBem" (credorFiduciário, dataDoRegistro) (registro-e-titularidade-de-bens-entidades.md); a DKD manteve só o gênero. ASD B21: oneração proposital do bem (alienação fiduciária, hipoteca, ônus averbado) para diluir a aparência de valor disponível. O beneficiário e o credor fiduciário são o BENEFICIA Pessoa herdado. |
| tipoDeParentesco | xsd:string | AJ-430 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC literal: "VínculoDeParentesco (especialização de VínculoEntrePessoas): tipoDeParentesco — cônjuge, ex-cônjuge, parente em diferentes graus; grauDeParentesco — ex.: primeiro grau; parentescoPorAfinidade — não declarado nas bases" (identificacao-de-pessoas-e-estruturas-societarias-entidades.md). A DKD manteve só o gênero, com regimeDeBens ("aplicável a vínculos de parentesco") pendurado nele. Das quatro espécies de tipoDeVinculo, parentesco era a única sem classe — e é a do núcleo da tese (isMotherOf, isFatherOf, isSpouseOf) e do ASD R37 (interpostas pessoas por parentesco), R34 e B26. FTM Family (person, relative, relationship) é o par exato; o narrowMatch que VinculoEntrePessoas tinha com Family passa a esta classe. |
| tipoDePeca | xsd:string | AJ-133 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC tramitação captura PeçaProcessual (tipo, data de elaboração, data de juntada, autor, nível de sigilo) com DecisãoJudicial como sua especialização e relações com processo, incidente e documentos anexos; nada disso chegou à DKD. ASD R20 e R50 pedem o vínculo da decisão e da procedência à "peça". |
| tipoDeRepresentacao | xsd:string | AJ-215 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC identificação de pessoas: "VínculoDeRepresentação (especialização de VínculoEntrePessoas): tipoDeRepresentação (representante legal, procurador), indicadorDeControleDeFato (ex.: empresa controlada por procuração), INSTRUMENTADO_POR AtoNotarial". Lacuna externa FTM Representation mantida no ORR, IRI confirmada. |
| tipoDeRestricao | xsd:string | AJ-313 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação. A lista da DKC ("ônus, indisponibilidade, constrição judicial, restrição administrativa") foi capturada antes de existir MedidaDeConstricao com suas espécies (AJ-66 a AJ-70, AJ-185): indisponibilidade e constrição judicial são medidas, não ônus — o que fica aqui é o ônus real e a restrição administrativa, e o atributo vale só quando não houver subclasse específica. |
| tipoDeValor | xsd:string | AJ-480 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação: a lista de tipoDeValor estava menor que a da DKC e que o uso atual da classe. DKC valoração: "venal/cadastral, declarado, estimado, de avaliação, do dano/a recuperar, bloqueado, de alienação"; DKC constrição: "atualizado, valor de face"; e Repatriacao PRODUZ ValorEconomicoDeAtivo (repatriado). A DKC também as lista como sete subclasses, mas todas com os mesmos campos (montante, data) — sem conteúdo próprio, ficam como valores do atributo. |
| tipoDeVinculo | xsd:string | AJ-434 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Redocumentação: com ParticipacaoSocietaria, IndicacaoDeBeneficiarioFinal, VinculoDeRepresentacao, InterposicaoDePessoa e VinculoDeParentesco, tipoDeVinculo vale só quando não houver subclasse específica — mesma regra de tipoDeAtivo, tipoDeAtor, tipoDeInstrumento e tipoDeMedida. |
| tradicaoJuridica | xsd:string | AJ-333 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC em duas categorias: "tradição jurídica predominante (common law, civil law) como condicionante de exigências formais" (pedidos) e "tradiçãoJurídica (common law × civil law)" (marco normativo). ASD B36: common law mais rigoroso com certificação e affidavits, civil law mais tolerante a cópia autenticada e tradução juramentada. |
| transitouEmJulgado | xsd:boolean | AJ-506 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DecisaoJudicial.transitoEmJulgado era um texto para duas coisas ("indicador e data de trânsito"). Separa-se em booleano e data, para que a consulta gerencial que a DKC de gestão de carteira descreve (casos por estágio; "trânsito em julgado"; "gap temporal entre perdimento declarado e destinação") seja possível, e para sustentar StatusProbatorio.estagioProbatorio = "decisão transitada em julgado" (AJ-467). |
| usoDeNotaVerbal | xsd:boolean | AJ-296 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC: BaseDeCooperaçãoPorReciprocidade.usoDeNotaVerbal (booleano) (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md); forma de formalização e jurisdições sob o regime ficam [requer pesquisa adicional]. |
| valorConvertido | xsd:decimal | — |
| valorDoIdentificador | xsd:string | AJ-229 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: O atributo valor de IdentificadorDePessoa (o número do CPF, passaporte etc.) tinha alcance xsd:decimal herdado do nome compartilhado com LancamentoFinanceiro.valor; identificador é código, não quantia (mesma regra aplicada a numeroDaConta, renavam, isin). Renomeado e tipado como texto. |
| versao | xsd:string | AJ-385 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC constricao: "versaoDoPedido (vínculo versão N ↔ N-1)" e "Pedido —VERSIONA→ Pedido". A DKD não manteve nem o atributo nem a relação; sem eles, pedido complementado ou reenviado vira registro duplicado (DKC gestão: "efeito de duplicidade"). |
| viaDeObtencao | xsd:string | AJ-453 (ajuste manual): sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: DKC: ConsultaAFonte / ConsultaAFonteDeDados / RegistroDeConsultaAFonte aparece em cinco categorias (identificação de pessoas, constrição, movimentação financeira, registro e titularidade, valoração) com os mesmos campos — base consultada, data da consulta, data de corte, chave utilizada, resultado (inclusive negativo), via de obtenção — e as relações "ConsultaAFonte —DIRIGIDA_A→ SistemaOuBaseDeDados", "—REALIZADA_POR→ ÓrgãoDeBuscaPatrimonial", "—TEM_ALVO→ Pessoa", "—PRODUZ→ AsserçãoDeTitularidade / ValorEconômicoDeAtivo / DocumentoFonte", "—ATRIBUI→ StatusProbatório" e "DossiêPatrimonial —COMPOSTO_POR→ ConsultaAFonte". A DKD descartou a classe, e com isso SistemaDeInformacao ficou sem uso analítico: nada dizia de que base, em que data e com que chave veio uma informação. É o que o ASD pede em R50 (procedência: base consultada, data da consulta), R51 (resultado como "foto" datada, não sobrescrita) e R52 (negativa de consulta registrada, para que ausência de resultado não seja lida como ausência de patrimônio) [R50–R52: lastro apenas sintético — requer validação humana]; a DKC marca a negativa e a data de corte como "inexistente hoje". O ORR já previa prov:Activity para "a cadeia de proveniência das diligências que compõem o dossiê". |
| vigencia | xsd:string | AJ-288 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: A DKC captura NormaNacional ("legislação interna de um Estado": númeroEAnoDaLei, denominaçãoPopular, jurisdiçãoDeOrigem, temaNormativo, vigência) com "É_COMPOSTA_POR DispositivoNormativo", "FUNDAMENTA MedidaDeConstriçãoOuPerdimento" e "VIGE_EM Jurisdição" (marco-normativo-e-instrumentos-juridicos-aplicaveis-entidades.md). A DKD não a manteve: hoje um dispositivo de lei interna (CPP art. 125, Lei 8.429 art. 16, Lei 9.613) não tem norma a que pertencer — só o tratado tem (É_COMPOSTO_POR). Os próprios ajustes desta revisão citam essas leis como fonte "norma". Lacuna reconhecida pela DKC: "tipificação penal como domínio conexo × interno [requer validação]". |
| volumeDePedidosEmAberto | xsd:integer | AJ-337 (ajuste manual): sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: DKC gestão de carteira, atributos literais da Jurisdição: "volume de pedidos em aberto; tempo médio entre envio e resposta; taxa de sucesso". ASD R56: "tempo médio de resposta por país e taxa de sucesso por país/tratado". tempoMedioDeResposta era string, inútil para a consulta gerencial; passa a decimal em dias (unidade é decisão de modelagem — a DKC não a informa). São métricas derivadas dos pedidos, mantidas como atributos porque a DKC as captura assim e o histórico consolidado "inexistente" é exatamente a lacuna que o ASD quer suprir. |

100 atributo(s) sem decisão ficam com alcance `xsd:string`.

### 3.2 Tipagem PROV-O

| Classe | Tipo PROV | Justificativa |
|---|---|---|
| Agente | prov:Agent | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Fechamento da revisão: a classe estava sem tipagem PROV, própria ou herdada. Gênero de Pessoa, AtorInstitucional e EnteDestinatario — quem responde por atos e é parte em relações; as espécies sem tipagem própria herdam. |
| Alegacao | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Pretensão deduzida (FIBO Claim), coisa sobre a qual se afirma proveniência; as filhas herdam. |
| AlienacaoAntecipada | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Retipada de Activity para Entity: o PROV-O declara prov:Activity disjunta de prov:Entity, e a classe passa a herdar Entity do gênero MedidaJudicialSobreAtivo. Como as irmãs, representa a medida (a ordem de alienar e seu resultado); o evento da venda está em GERA SubRogacaoDeAtivo. |
| AnaliseDeCompatibilidadeEconomica | prov:Activity | — |
| Ativo | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Fechamento da revisão: a classe estava sem tipagem PROV, própria ou herdada. Bem ou direito sobre o qual se afirma titularidade, valor e proveniência; toda a subárvore (imóvel, veículo, conta, criptoativo…) herda. |
| AtoNotarial | prov:Entity | — |
| AtoNotarialOuRegistral | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Fechamento da revisão: a classe estava sem tipagem PROV, própria ou herdada. Gênero de AtoNotarial e AtoRegistral, ambas já prov:Entity (o ato lavrado ou registrado, coisa escrita). |
| AtoRegistral | prov:Entity | — |
| AtorInstitucional | prov:Agent | — |
| Avaliacao | prov:Activity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Gênero de AvaliacaoPatrimonial e AnaliseDeCompatibilidadeEconomica, ambas já prov:Activity; a definição é a de uma atividade ("examina … para atribuir valor ou verificar compatibilidade, produzindo um resultado"). |
| AvaliacaoPatrimonial | prov:Activity | — |
| CodigoPostal | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Fechamento da revisão: a classe estava sem tipagem PROV, própria ou herdada. Código registrado (FIBO Postcode), como Endereco. |
| ConsultaAFonte | prov:Activity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Diligência que ocorre no tempo e usa uma fonte para gerar informação (prov:used / wasAssociatedWith); o ORR já selecionava prov:Activity para as diligências do dossiê. |
| Contrato | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Contrato é acordo (FIBO Contract ⊂ Agreement), coisa sobre a qual se afirma proveniência — como ValorEconomicoDeAtivo, Divida não tipada à parte. Não é atividade nem agente. |
| Correspondencia | prov:Entity | — |
| DecisaoJudicial | prov:Entity | — |
| DeclaracaoFiscalDeRendaEPatrimonio | prov:Entity | — |
| DecretoDePerdimento | prov:Entity | — |
| Destinacao | prov:Activity | — |
| Divida | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Obrigação financeira entre partes (FTM Debt), coisa sobre a qual se afirma proveniência — como Contrato e ValorEconomicoDeAtivo. Não é atividade nem agente. |
| Documento | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Gênero das classes documentais; todas as filhas tipadas são prov:Entity e a própria definição (AJ-28) já o diz. As filhas criadas por ajuste (DocumentoComprobatorio, PecaProcessual, RegistroDeIdentificacaoDeCliente, RelatorioDeInteligenciaFinanceira, ParecerJuridico) herdam. |
| DocumentoDoPedido | prov:Entity | — |
| DossieDeBuscaPatrimonial | prov:Entity | — |
| ElementoDeIdentificacaoDePessoa | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Dado associado a uma pessoa (identificador, nome ou variante de grafia): coisa sobre a qual se afirma proveniência, como Documento. As filhas herdam. |
| ElementoNormativo | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Norma, dispositivo, instrumento ou tipo penal são coisas sobre as quais se afirma proveniência (prov:Entity; o PROV trata plano e norma como entidade). As filhas herdam. |
| Endereco | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Fechamento da revisão: a classe estava sem tipagem PROV, própria ou herdada. Endereço registrado (FIBO PhysicalAddress); prov:Location não está entre os termos selecionados no ORR. |
| EventoDeTramitacao | prov:Activity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Marco que ocorre no tempo e muda o estado do pedido — atividade, como o próprio pedido. |
| Exequatur | prov:Entity | — |
| ExtratoDeMovimentacaoFinanceira | prov:Entity | — |
| FatoCriminoso | prov:Activity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Fato que ocorre no tempo e produz efeitos sobre bens e pessoas — evento, não coisa nem agente. |
| IncidenteDeRestituicao | prov:Activity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Incidente processual: ocorre no tempo, é instaurado, instruído e decidido — atividade, como PedidoDeCooperacaoJuridicaInternacional. |
| Indicio | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Sinal registrado sobre dados — coisa sobre a qual se afirma proveniência (IndicioFinanceiro já era Entity); as espécies herdam. |
| IndicioFinanceiro | prov:Entity | — |
| Jurisdição | prov:Agent | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Estado ou ordenamento que impõe requisitos, é parte de instrumentos e responde a pedidos — pessoa jurídica de direito público (FIBO Polity, par mantido no ORR). O uso como localização (LOCALIZADO_EM) não contradiz: o PROV não impede que um agente seja também lugar. |
| LancamentoFinanceiro | prov:Activity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Evento de movimentação com impacto monetário (FIBO individual transaction: "evento com impacto monetário documentado na conta"; SUMO FinancialTransaction é processo) — ocorre no tempo, não é coisa nem agente. |
| ListaRestritiva | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Lista publicada por uma autoridade — coisa registrada, usada pela consulta (prov:used). Deixou de herdar a tipagem de SistemaDeInformacao. |
| MatriculaImobiliaria | prov:Entity | — |
| MedidaDeConstricao | prov:Entity | — |
| MedidaJudicialSobreAtivo | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Efeito jurídico que recai sobre o ativo — a ordem e seu estado, não o evento de executá-la. MedidaDeConstricao e DecretoDePerdimento já eram Entity. |
| MotivoDeSaneamentoOuDevolucao | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Motivo registrado — coisa sobre a qual se afirma proveniência. |
| NexoCausal | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Relação reificada, como as demais filhas de RelacaoReificada. |
| ParecerJuridico | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Documento emitido pela assessoria jurídica; Documento e suas demais subclasses tipadas são prov:Entity. |
| PedidoDeCooperacaoJuridicaInternacional | prov:Activity | — |
| PrazoDeResposta | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Prazo reificado com origem, data-limite e situação; estava sem tipagem. |
| ProcessoJudicial | prov:Activity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Processo que tramita no tempo, com eventos, decisões e partes; na ACO (par de desenho mantido) LawSuit é subtipo de Event. |
| RegistroPublicoDeBem | prov:Entity | — |
| RelacaoReificada | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Gênero das relações reificadas (vínculo, titularidade, sucessão, sub-rogação, participação, dívida, nexo, sanção): afirmação registrada, coisa sobre a qual se afirma proveniência. As filhas sem tipagem própria herdam. |
| Repatriacao | prov:Activity | — |
| RequisitoDeAdmissibilidade | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Pressuposto normativo registrado, como RequisitoFormal. |
| RequisitoDeCooperacao | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Exigência registrada; as duas espécies já eram Entity. |
| RequisitoFormal | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Exigência registrada, imposta por jurisdição ou instrumento; estava sem tipagem. |
| RespostaDeCooperacao | prov:Entity | — |
| RestricaoOuOnusSobreBem | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Ônus ou restrição registrada sobre o bem — coisa sobre a qual se afirma proveniência, como MedidaDeConstricao. As espécies herdam. |
| SistemaDeInformacao | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Retipada de SoftwareAgent para Entity: a classe é o catálogo de fontes de dados (base, cadastro, lista restritiva, planilha, caixa de correio), e prov:SoftwareAgent é "software em execução" que assume responsabilidade — não serve a lista nem a planilha. Como Entity, é o que a consulta usa (prov:used) e é atribuída a quem a mantém (prov:wasAttributedTo). |
| StatusProbatorio | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Qualificação registrada sobre uma afirmação — coisa com data e fundamento, derivada de um documento (prov:wasDerivedFrom). A classe estava sem tipagem. |
| TaxaDeCambioHistorica | prov:Entity | sugestão da IA (claude-opus-5-5 (anthropic), via Claude Code), autorizada pelo administrador: Cotação registrada (FIBO exchange rate), coisa sobre a qual se afirma proveniência — como ValorEconomicoDeAtivo, que ela converte. A classe estava sem tipagem. |
| ValorEconomicoDeAtivo | prov:Entity | — |
| ViaProcessual | prov:Entity | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: Via jurídica escolhida para o pedido — qualificador registrado, não atividade; estava sem tipagem. |

### 3.3 Superpropriedades

| Propriedade | Rótulo | Alcance | Verbos membros | Justificativa |
|---|---|---|---|---|
| rec:incideSobreAtivo | incide sobre ativo | Ativo | AFETA, DESTINA, INCIDE_SOBRE, RECAI_SOBRE, REFERENCIA | Superpropriedade que reúne tudo o que pesa sobre um ativo (constrição, perdimento, destinação, restituição, alienação, repatriação, referência processual). Consolidação decidida no OCO (02, seção 4). |

### 3.4 Cadeias de propriedades

| Propriedade | Cadeia | Justificativa |
|---|---|---|
| rec:temParte | ^temProcesso ∘ temParticipante | sugestão da IA (claude-fable-5-1 (anthropic), via Claude Code), autorizada pelo administrador: TEM_PARTE Pessoa (DKC, FTM CourtCaseParty.party, ACO isInvolvedIn) é o atalho direto da relação reificada ParticipacaoEmProcesso (AJ-76), que carrega papel e período; a cadeia torna o atalho derivável, no mesmo desenho de titularDe sobre AssercaoDeTitularidade. |
| rec:titularDe | ^ligaTitular ∘ ligaAtivo | Pessoa TITULAR_DE Ativo ≡ inverse(AssercaoDeTitularidade ligaTitular Pessoa) ∘ (AssercaoDeTitularidade ligaAtivo Ativo). Atalho da reificação (02, 3.2). |

## 4. Taxonomia

- Agente
  - AtorInstitucional
    - AutoridadeCentral
    - AutoridadeDecisoriaSobreDestinacao
    - OrgaoDeAcusacao
    - OrgaoDeGestaoPatrimonial
    - OrgaoDeRegistroPublico
    - OrgaoJudicial
    - RedeDeCooperacaoInternacional
    - TabelionatoDeNotas
    - UnidadeDeInteligenciaFinanceira
    - UnidadeOrganizacional
      - AreaDeExecucaoOperacional
      - UnidadeDeAssessoriaJuridica
      - UnidadeDeBuscaPatrimonial
  - EnteDestinatario
  - Pessoa
    - PessoaFísica
    - PessoaJurídica
      - InstituicaoFinanceira
      - PrestadorDeServicosDeAtivosVirtuais
- Alegacao
  - AlegacaoDeOrigemLicita
  - AlegacaoDeTerceiroDeBoaFe
- Ativo
  - AtivoDePropriedadeIntelectual
  - AtivoFinanceiro
    - ContaBancaria
    - ValorMobiliario
  - BemDeAltoValorAgregado
  - BemImovel
  - BemMovel
    - Aeronave
    - Embarcação
    - Veículo
  - Criptoativo
  - ParticipacaoSocietaria
- AtoNotarialOuRegistral
  - AtoNotarial
    - EscrituraPublica
    - ProcuracaoPublica
  - AtoRegistral
- Avaliacao
  - AnaliseDeCompatibilidadeEconomica
  - AvaliacaoPatrimonial
- CodigoPostal
- ConsultaAFonte
- Contrato
- Destinacao
  - Repatriacao
- Documento
  - Correspondencia
    - RespostaDeCooperacao
  - DeclaracaoFiscalDeRendaEPatrimonio
  - DocumentoComprobatorio
  - DocumentoDoPedido
  - DossieDeBuscaPatrimonial
  - ExtratoDeMovimentacaoFinanceira
  - ParecerJuridico
  - PecaProcessual
    - DecisaoJudicial
      - Exequatur
  - RegistroDeIdentificacaoDeCliente
  - RegistroPublicoDeBem
    - MatriculaImobiliaria
  - RelatorioDeInteligenciaFinanceira
- ElementoDeIdentificacaoDePessoa
  - IdentificadorDePessoa
  - NomeEVarianteDeGrafia
- ElementoNormativo
  - DispositivoNormativo
  - FundamentoLegal
  - InstrumentoJuridicoDeCooperacao
    - BaseDeCooperacaoPorReciprocidade
    - ConvencaoMultilateral
    - TratadoBilateralDeAssistenciaJuridicaMutua
  - NormaNacional
  - TipoPenal
- Endereco
- EventoDeTramitacao
- FatoCriminoso
- IncidenteDeRestituicao
- Indicio
  - IndicioFinanceiro
  - IndicioPatrimonial
- Jurisdição
- LancamentoFinanceiro
- ListaRestritiva
- MedidaJudicialSobreAtivo
  - AlienacaoAntecipada
  - DecretoDePerdimento
  - MedidaDeConstricao
    - ArrestoDeBens
    - BloqueioDeAtivos
    - HipotecaLegal
    - IndisponibilidadeDeBens
    - SequestroDeBens
- MotivoDeSaneamentoOuDevolucao
- PedidoDeCooperacaoJuridicaInternacional
- PrazoDeResposta
- ProcessoJudicial
- RelacaoReificada
  - AssercaoDeTitularidade
  - Divida
  - NexoCausal
  - ParticipacaoEmProcesso
  - SancaoIndividual
  - SubRogacaoDeAtivo
  - SucessaoDeEntidade
  - VinculoEntrePessoas
    - IndicacaoDeBeneficiarioFinal
    - InterposicaoDePessoa
    - ParticipacaoSocietaria
    - VinculoDeParentesco
    - VinculoDeRepresentacao
- RequisitoDeCooperacao
  - RequisitoDeAdmissibilidade
  - RequisitoFormal
- RestricaoOuOnusSobreBem
  - AlienacaoFiduciaria
  - AverbacaoDeOnus
- SistemaDeInformacao
- StatusProbatorio
- TaxaDeCambioHistorica
- ValorEconomicoDeAtivo
- ViaProcessual

## 5. Classes

| Classe | Superclasses | Proveniência | PROV | Mapeamentos |
|---|---|---|---|---|
| Aeronave | BemMovel | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens | — | ACO desenho Aircraft; FTM ≡ Airplane |
| Agente | — | criada pelo ajuste manual estrutural AJ-12 (04-ajustes-manuais.md) | prov:Agent | — |
| Alegacao | — | criada pelo ajuste manual estrutural AJ-120 (04-ajustes-manuais.md) | prov:Entity | FIBO ⊑ claim |
| AlegacaoDeOrigemLicita | Alegacao | criada pelo ajuste manual estrutural AJ-122 (04-ajustes-manuais.md) | — | — |
| AlegacaoDeTerceiroDeBoaFe | Alegacao | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, tramitacao-processual-e-decisoes-sobre-bens | — | FIBO ⊑ claim |
| AlienacaoAntecipada | MedidaJudicialSobreAtivo | DKC: constricao-perdimento-e-destinacao-de-ativos, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| AlienacaoFiduciaria | RestricaoOuOnusSobreBem | criada pelo ajuste manual estrutural AJ-309 (04-ajustes-manuais.md) | — | — |
| AnaliseDeCompatibilidadeEconomica | Avaliacao | DKC: movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos | prov:Activity | — |
| AreaDeExecucaoOperacional | UnidadeOrganizacional | DKC: constricao-perdimento-e-destinacao-de-ativos | — | ORG ⊑ OrganizationalUnit |
| ArrestoDeBens | MedidaDeConstricao | criada pelo ajuste manual estrutural AJ-68 (04-ajustes-manuais.md) | — | — |
| AssercaoDeTitularidade | RelacaoReificada | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens | — | FTM ⊑ Ownership |
| Ativo | — | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | ACO desenho Asset; FTM ⊑ Asset; SUMO desenho FinancialAsset |
| AtivoDePropriedadeIntelectual | Ativo | DKC: registro-e-titularidade-de-bens | — | ACO desenho IntelectualProperty; SUMO desenho Patent |
| AtivoFinanceiro | Ativo | DKC: constricao-perdimento-e-destinacao-de-ativos | — | ACO desenho FinancialAsset; FIBO ⊒ financial instrument |
| AtoNotarial | AtoNotarialOuRegistral | DKC: identificacao-de-pessoas-e-estruturas-societarias, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| AtoNotarialOuRegistral | — | criada pelo ajuste manual estrutural AJ-45 (04-ajustes-manuais.md) | prov:Entity | — |
| AtoRegistral | AtoNotarialOuRegistral | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| AtorInstitucional | Agente | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | prov:Agent | ORG ⊑ Organization |
| AutoridadeCentral | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | — | — |
| AutoridadeDecisoriaSobreDestinacao | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho | — | — |
| Avaliacao | — | criada pelo ajuste manual estrutural AJ-16 (04-ajustes-manuais.md) | prov:Activity | — |
| AvaliacaoPatrimonial | Avaliacao | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, valoracao-e-expressao-economica-dos-ativos | prov:Activity | — |
| AverbacaoDeOnus | RestricaoOuOnusSobreBem | criada pelo ajuste manual estrutural AJ-306 (04-ajustes-manuais.md) | — | — |
| BaseDeCooperacaoPorReciprocidade | InstrumentoJuridicoDeCooperacao | criada pelo ajuste manual estrutural AJ-295 (04-ajustes-manuais.md) | — | — |
| BemDeAltoValorAgregado | Ativo | criada pelo ajuste manual estrutural AJ-83 (04-ajustes-manuais.md) | — | — |
| BemImovel | Ativo | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos | — | ACO desenho RealEstate; FTM ≡ RealEstate; SUMO desenho RealEstate |
| BemMovel | Ativo | adicionado manualmente na revisão humana da DKD | — | — |
| BloqueioDeAtivos | MedidaDeConstricao | criada pelo ajuste manual estrutural AJ-69 (04-ajustes-manuais.md) | — | — |
| CodigoPostal | — | adicionado manualmente na revisão humana da DKD | prov:Entity | ACO desenho PostalCode; FIBO ≡ postcode |
| ConsultaAFonte | — | criada pelo ajuste manual estrutural AJ-449 (04-ajustes-manuais.md) | prov:Activity | — |
| ContaBancaria | AtivoFinanceiro | DKC: movimentacao-financeira-e-capacidade-economica | — | FIBO ⊑ account; FTM ≡ BankAccount |
| Contrato | — | adicionado manualmente na revisão humana da DKD | prov:Entity | FIBO ≡ contract; FTM ⊒ Contract |
| ConvencaoMultilateral | InstrumentoJuridicoDeCooperacao | criada pelo ajuste manual estrutural AJ-292 (04-ajustes-manuais.md) | — | — |
| Correspondencia | Documento | DKC: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens | prov:Entity | FTM ⊑ Message |
| Criptoativo | Ativo | DKC: movimentacao-financeira-e-capacidade-economica | — | ACO desenho CryptoWallet; FTM ≡ CryptoWallet |
| DecisaoJudicial | PecaProcessual | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| DeclaracaoFiscalDeRendaEPatrimonio | Documento | DKC: identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos | prov:Entity | FTM ≡ TaxRoll |
| DecretoDePerdimento | MedidaJudicialSobreAtivo | DKC: constricao-perdimento-e-destinacao-de-ativos, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| Destinacao | — | DKC: constricao-perdimento-e-destinacao-de-ativos, valoracao-e-expressao-economica-dos-ativos | prov:Activity | — |
| DispositivoNormativo | ElementoNormativo | DKC: marco-normativo-e-instrumentos-juridicos-aplicaveis | — | FIBO ≈ regulation |
| Divida | RelacaoReificada | adicionado manualmente na revisão humana da DKD; criada pelo ajuste manual estrutural AJ-263 (04-ajustes-manuais.md) | prov:Entity | FTM ≡ Debt |
| Documento | — | criada pelo ajuste manual estrutural AJ-28 (04-ajustes-manuais.md) | prov:Entity | — |
| DocumentoComprobatorio | Documento | criada pelo ajuste manual estrutural AJ-143 (04-ajustes-manuais.md) | — | — |
| DocumentoDoPedido | Documento | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, pedidos-de-cooperacao-entre-jurisdicoes | prov:Entity | FTM ⊑ Document |
| DossieDeBuscaPatrimonial | Documento | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| ElementoDeIdentificacaoDePessoa | — | criada pelo ajuste manual estrutural AJ-42 (04-ajustes-manuais.md) | prov:Entity | — |
| ElementoNormativo | — | criada pelo ajuste manual estrutural AJ-38 (04-ajustes-manuais.md) | prov:Entity | — |
| Embarcação | BemMovel | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens | — | ACO desenho Watercraft; FTM ≡ Vessel |
| Endereco | — | adicionado manualmente na revisão humana da DKD | prov:Entity | ACO desenho PhysicalAddress; FIBO ≡ physical address; schema ≈ PostalAddress |
| EnteDestinatario | Agente | DKC: constricao-perdimento-e-destinacao-de-ativos | — | — |
| EscrituraPublica | AtoNotarial | criada pelo ajuste manual estrutural AJ-208 (04-ajustes-manuais.md) | — | — |
| EventoDeTramitacao | — | criada pelo ajuste manual estrutural AJ-409 (04-ajustes-manuais.md) | prov:Activity | — |
| Exequatur | DecisaoJudicial | DKC: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis | prov:Entity | — |
| ExtratoDeMovimentacaoFinanceira | Documento | DKC: movimentacao-financeira-e-capacidade-economica | prov:Entity | FIBO ⊑ account statement |
| FatoCriminoso | — | criada pelo ajuste manual estrutural AJ-84 (04-ajustes-manuais.md) | prov:Activity | — |
| FundamentoLegal | ElementoNormativo | DKC: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis | — | — |
| HipotecaLegal | MedidaDeConstricao | criada pelo ajuste manual estrutural AJ-67 (04-ajustes-manuais.md) | — | — |
| IdentificadorDePessoa | ElementoDeIdentificacaoDePessoa | DKC: identificacao-de-pessoas-e-estruturas-societarias | — | FIBO ≈ identity document; FTM ⊑ Identification |
| IncidenteDeRestituicao | — | DKC: constricao-perdimento-e-destinacao-de-ativos, tramitacao-processual-e-decisoes-sobre-bens | prov:Activity | — |
| IndicacaoDeBeneficiarioFinal | VinculoEntrePessoas | DKC: identificacao-de-pessoas-e-estruturas-societarias | — | FTM ⊑ Control |
| Indicio | — | criada pelo ajuste manual estrutural AJ-316 (04-ajustes-manuais.md) | prov:Entity | FTM ⊑ Risk |
| IndicioFinanceiro | Indicio | DKC: movimentacao-financeira-e-capacidade-economica | prov:Entity | — |
| IndicioPatrimonial | Indicio | criada pelo ajuste manual estrutural AJ-324 (04-ajustes-manuais.md) | — | — |
| IndisponibilidadeDeBens | MedidaDeConstricao | criada pelo ajuste manual estrutural AJ-70 (04-ajustes-manuais.md) | — | — |
| InstituicaoFinanceira | PessoaJurídica | DKC: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes | — | FIBO ≡ financial institution |
| InstrumentoJuridicoDeCooperacao | ElementoNormativo | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens | — | — |
| InterposicaoDePessoa | VinculoEntrePessoas | criada pelo ajuste manual estrutural AJ-74 (04-ajustes-manuais.md) | — | — |
| Jurisdição | — | DKC: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes | prov:Agent | FIBO ⊑ polity; FTM ≈ Territory |
| LancamentoFinanceiro | — | DKC: movimentacao-financeira-e-capacidade-economica | prov:Activity | FIBO ≡ individual transaction; FTM ≈ Payment; SUMO desenho FinancialTransaction |
| ListaRestritiva | — | DKC: identificacao-de-pessoas-e-estruturas-societarias, marco-normativo-e-instrumentos-juridicos-aplicaveis | prov:Entity | — |
| MatriculaImobiliaria | RegistroPublicoDeBem | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| MedidaDeConstricao | MedidaJudicialSobreAtivo | DKC: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| MedidaJudicialSobreAtivo | — | criada pelo ajuste manual estrutural AJ-184 (04-ajustes-manuais.md) | prov:Entity | — |
| MotivoDeSaneamentoOuDevolucao | — | criada pelo ajuste manual estrutural AJ-375 (04-ajustes-manuais.md) | prov:Entity | — |
| NexoCausal | RelacaoReificada | criada pelo ajuste manual estrutural AJ-301 (04-ajustes-manuais.md) | prov:Entity | — |
| NomeEVarianteDeGrafia | ElementoDeIdentificacaoDePessoa | DKC: identificacao-de-pessoas-e-estruturas-societarias | — | FIBO ⊑ person name |
| NormaNacional | ElementoNormativo | criada pelo ajuste manual estrutural AJ-284 (04-ajustes-manuais.md) | — | — |
| OrgaoDeAcusacao | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, tramitacao-processual-e-decisoes-sobre-bens | — | — |
| OrgaoDeGestaoPatrimonial | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, valoracao-e-expressao-economica-dos-ativos | — | — |
| OrgaoDeRegistroPublico | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens | — | FIBO ⊒ business registration authority |
| OrgaoJudicial | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | — | FIBO ≈ judiciary |
| ParecerJuridico | Documento | criada pelo ajuste manual estrutural AJ-249 (04-ajustes-manuais.md) | prov:Entity | — |
| ParticipacaoEmProcesso | RelacaoReificada | criada pelo ajuste manual estrutural AJ-76 (04-ajustes-manuais.md) | — | FTM ≡ CourtCaseParty |
| ParticipacaoSocietaria | VinculoEntrePessoas, Ativo | DKC: constricao-perdimento-e-destinacao-de-ativos, identificacao-de-pessoas-e-estruturas-societarias, registro-e-titularidade-de-bens | — | FTM ⊑ Ownership |
| PecaProcessual | Documento | criada pelo ajuste manual estrutural AJ-132 (04-ajustes-manuais.md) | — | — |
| PedidoDeCooperacaoJuridicaInternacional | — | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | prov:Activity | — |
| Pessoa | Agente | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, pedidos-de-cooperacao-entre-jurisdicoes, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens | — | ACO desenho Party; FOAF ⊑ Agent; FTM ⊑ LegalEntity; PROV-O ⊑ Agent |
| PessoaFísica | Pessoa | DKC: identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, registro-e-titularidade-de-bens | — | ACO desenho Person; FIBO ≡ person; FOAF ≡ Person; FTM ⊑ Person; PROV-O ⊑ Person; SUMO desenho Human; schema ≡ Person |
| PessoaJurídica | Pessoa | DKC: identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, registro-e-titularidade-de-bens | — | ACO desenho Organization; FOAF ⊑ Organization; FTM ⊒ Company; ORG ⊑ FormalOrganization; PROV-O ⊑ Organization; REGORG ≡ RegisteredOrganization; SUMO desenho Organization; schema ⊑ Organization |
| PrazoDeResposta | — | DKC: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens | prov:Entity | — |
| PrestadorDeServicosDeAtivosVirtuais | PessoaJurídica | criada pelo ajuste manual estrutural AJ-177 (04-ajustes-manuais.md) | — | — |
| ProcessoJudicial | — | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens | prov:Activity | ACO desenho LawSuit; FTM ≡ CourtCase |
| ProcuracaoPublica | AtoNotarial | criada pelo ajuste manual estrutural AJ-211 (04-ajustes-manuais.md) | — | — |
| RedeDeCooperacaoInternacional | AtorInstitucional | DKC: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes | — | ORG ≡ OrganizationalCollaboration |
| RegistroDeIdentificacaoDeCliente | Documento | criada pelo ajuste manual estrutural AJ-179 (04-ajustes-manuais.md) | — | — |
| RegistroPublicoDeBem | Documento | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens | prov:Entity | — |
| RelacaoReificada | — | criada pelo ajuste manual estrutural AJ-258 (04-ajustes-manuais.md) | prov:Entity | — |
| RelatorioDeInteligenciaFinanceira | Documento | criada pelo ajuste manual estrutural AJ-109 (04-ajustes-manuais.md) | — | — |
| Repatriacao | Destinacao | DKC: constricao-perdimento-e-destinacao-de-ativos | prov:Activity | — |
| RequisitoDeAdmissibilidade | RequisitoDeCooperacao | criada pelo ajuste manual estrutural AJ-379 (04-ajustes-manuais.md) | prov:Entity | — |
| RequisitoDeCooperacao | — | criada pelo ajuste manual estrutural AJ-435 (04-ajustes-manuais.md) | prov:Entity | — |
| RequisitoFormal | RequisitoDeCooperacao | DKC: gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes | prov:Entity | — |
| RespostaDeCooperacao | Correspondencia | DKC: constricao-perdimento-e-destinacao-de-ativos, pedidos-de-cooperacao-entre-jurisdicoes, valoracao-e-expressao-economica-dos-ativos | prov:Entity | — |
| RestricaoOuOnusSobreBem | — | DKC: registro-e-titularidade-de-bens, valoracao-e-expressao-economica-dos-ativos; criada pelo ajuste manual estrutural AJ-446 (04-ajustes-manuais.md) | prov:Entity | — |
| SancaoIndividual | RelacaoReificada | adicionado manualmente na revisão humana da DKD | — | FTM ≡ Sanction |
| SequestroDeBens | MedidaDeConstricao | criada pelo ajuste manual estrutural AJ-66 (04-ajustes-manuais.md) | — | — |
| SistemaDeInformacao | — | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, identificacao-de-pessoas-e-estruturas-societarias, movimentacao-financeira-e-capacidade-economica, registro-e-titularidade-de-bens, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos; criada pelo ajuste manual estrutural AJ-515 (04-ajustes-manuais.md) | prov:Entity | — |
| StatusProbatorio | — | DKC: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica; criada pelo ajuste manual estrutural AJ-472 (04-ajustes-manuais.md) | prov:Entity | — |
| SubRogacaoDeAtivo | RelacaoReificada | criada pelo ajuste manual estrutural AJ-161 (04-ajustes-manuais.md) | — | — |
| SucessaoDeEntidade | RelacaoReificada | adicionado manualmente na revisão humana da DKD | — | FTM ≡ Succession; ORG ≡ ChangeEvent |
| TabelionatoDeNotas | AtorInstitucional | adicionado manualmente na revisão humana da DKD | — | — |
| TaxaDeCambioHistorica | — | DKC: movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos | prov:Entity | FIBO ≡ exchange rate |
| TipoPenal | ElementoNormativo | criada pelo ajuste manual estrutural AJ-85 (04-ajustes-manuais.md) | — | — |
| TratadoBilateralDeAssistenciaJuridicaMutua | InstrumentoJuridicoDeCooperacao | criada pelo ajuste manual estrutural AJ-294 (04-ajustes-manuais.md) | — | — |
| UnidadeDeAssessoriaJuridica | UnidadeOrganizacional | DKC: constricao-perdimento-e-destinacao-de-ativos, marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | — | ORG ⊑ OrganizationalUnit |
| UnidadeDeBuscaPatrimonial | UnidadeOrganizacional | DKC: constricao-perdimento-e-destinacao-de-ativos, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens, valoracao-e-expressao-economica-dos-ativos | — | ORG ⊑ OrganizationalUnit |
| UnidadeDeInteligenciaFinanceira | AtorInstitucional | DKC: constricao-perdimento-e-destinacao-de-ativos, gestao-de-carteira-e-desempenho-do-fluxo-de-trabalho, marco-normativo-e-instrumentos-juridicos-aplicaveis, movimentacao-financeira-e-capacidade-economica, pedidos-de-cooperacao-entre-jurisdicoes, tramitacao-processual-e-decisoes-sobre-bens | — | FTM ⊑ PublicBody |
| UnidadeOrganizacional | AtorInstitucional | criada pelo ajuste manual estrutural AJ-52 (04-ajustes-manuais.md) | — | ORG ⊑ OrganizationalUnit |
| ValorEconomicoDeAtivo | — | DKC: movimentacao-financeira-e-capacidade-economica, valoracao-e-expressao-economica-dos-ativos; criada pelo ajuste manual estrutural AJ-481 (04-ajustes-manuais.md) | prov:Entity | FIBO ⊑ monetary amount; schema ⊑ MonetaryAmount |
| ValorMobiliario | AtivoFinanceiro | adicionado manualmente na revisão humana da DKD | — | FIBO ≡ security; FTM ≡ Security |
| Veículo | BemMovel | DKC: constricao-perdimento-e-destinacao-de-ativos, registro-e-titularidade-de-bens | — | ACO desenho MotorVehicle; FTM ≡ Vehicle |
| ViaProcessual | — | DKC: marco-normativo-e-instrumentos-juridicos-aplicaveis, pedidos-de-cooperacao-entre-jurisdicoes; criada pelo ajuste manual estrutural AJ-486 (04-ajustes-manuais.md) | prov:Entity | — |
| VinculoDeParentesco | VinculoEntrePessoas | criada pelo ajuste manual estrutural AJ-429 (04-ajustes-manuais.md) | — | FTM ≡ Family |
| VinculoDeRepresentacao | VinculoEntrePessoas | criada pelo ajuste manual estrutural AJ-214 (04-ajustes-manuais.md) | — | FTM ≡ Representation |
| VinculoEntrePessoas | RelacaoReificada | DKC: identificacao-de-pessoas-e-estruturas-societarias, pedidos-de-cooperacao-entre-jurisdicoes | — | FTM ⊒ Associate |

## 6. Object properties

| Propriedade | Domínio | Alcance | Superpropriedade | Mapeamentos | Especializações |
|---|---|---|---|---|---|
| rec:administra | OrgaoDeGestaoPatrimonial | Ativo | — | FIBO ⊑ holds | — |
| rec:afeta | IncidenteDeRestituicao | Ativo | incideSobreAtivo | FIBO ≈ involves | — |
| rec:analisa | ParecerJuridico ∪ UnidadeDeAssessoriaJuridica | DecretoDePerdimento | — | — | analisa_UnidadeDeAssessoriaJuridica (FIBO ⊑ evaluates) |
| rec:anexa | PecaProcessual | DocumentoComprobatorio | — | — | — |
| rec:anotadaEm | MedidaDeConstricao ∪ RestricaoOuOnusSobreBem | AtoRegistral | — | — | — |
| rec:aplicaSeA | RequisitoFormal | DocumentoDoPedido | — | — | — |
| rec:aponta | IndicacaoDeBeneficiarioFinal | Pessoa | — | FTM ⊑ Control.controller | — |
| rec:apuradoEm | FatoCriminoso | ProcessoJudicial | — | — | — |
| rec:associa | RegistroDeIdentificacaoDeCliente | Criptoativo | — | — | — |
| rec:avalia | AnaliseDeCompatibilidadeEconomica ∪ AvaliacaoPatrimonial | Pessoa ∪ Ativo | — | FIBO ≡ evaluates | — |
| rec:avaliadaPor | Alegacao | AnaliseDeCompatibilidadeEconomica | — | FIBO ≡ is evaluated by | — |
| rec:beneficia | Contrato ∪ Destinacao ∪ RestricaoOuOnusSobreBem | Pessoa ∪ EnteDestinatario | — | — | beneficia_Contrato (FIBO ≡ has beneficiary); beneficia_Destinacao (FIBO ≡ has beneficiary); beneficia_RestricaoOuOnusSobreBem (FIBO ⊑ is conferred on) |
| rec:compostoPor | DossieDeBuscaPatrimonial ∪ ExtratoDeMovimentacaoFinanceira | ConsultaAFonte ∪ LancamentoFinanceiro | — | — | compostoPor_ExtratoDeMovimentacaoFinanceira (FIBO ≡ records transaction) |
| rec:comprova | DocumentoComprobatorio | Ativo | — | — | — |
| rec:comprovadaPor | RelacaoReificada | Documento | — | PROV-O ≈ hadPrimarySource | — |
| rec:concedidoPor | Exequatur | OrgaoJudicial | — | FIBO ⊑ is issued by | — |
| rec:condiciona | RequisitoDeAdmissibilidade | PedidoDeCooperacaoJuridicaInternacional | — | — | — |
| rec:conflitaCom | NomeEVarianteDeGrafia | NomeEVarianteDeGrafia | — | — | — |
| rec:congrega | RedeDeCooperacaoInternacional | AtorInstitucional | — | ORG ≡ hasMember | — |
| rec:constaEm | SancaoIndividual | ListaRestritiva | — | — | — |
| rec:contem | MatriculaImobiliaria ∪ ProcessoJudicial | AtoRegistral ∪ PecaProcessual ∪ IncidenteDeRestituicao | — | PROV-O ≈ hadMember | — |
| rec:convertidoPor | ValorEconomicoDeAtivo | TaxaDeCambioHistorica | — | — | — |
| rec:custodia | OrgaoDeRegistroPublico ∪ PrestadorDeServicosDeAtivosVirtuais | RegistroPublicoDeBem ∪ RegistroDeIdentificacaoDeCliente | — | — | — |
| rec:custodiadoPor | AtivoFinanceiro ∪ Criptoativo | InstituicaoFinanceira ∪ PrestadorDeServicosDeAtivosVirtuais | — | FIBO ⊑ is held by | custodiadoPor_AtivoFinanceiro (FTM ≈ BankAccount.bank) |
| rec:decide | DecisaoJudicial | IncidenteDeRestituicao | — | — | — |
| rec:decididaPor | Destinacao | AutoridadeDecisoriaSobreDestinacao | — | PROV-O ⊑ wasAssociatedWith | — |
| rec:declara | DeclaracaoFiscalDeRendaEPatrimonio | Divida ∪ Ativo | — | — | — |
| rec:declaradaPor | DeclaracaoFiscalDeRendaEPatrimonio | PessoaFísica | — | FTM ≡ TaxRoll.taxee; PROV-O ⊑ wasAttributedTo | — |
| rec:decorreDe | Divida ∪ RestricaoOuOnusSobreBem | Contrato ∪ ProcessoJudicial | — | — | decorreDe_RestricaoOuOnusSobreBem (FIBO ⊑ is conferred by) |
| rec:deduzidaPor | Alegacao | Pessoa | — | PROV-O ⊑ wasAttributedTo | — |
| rec:deduzidoPor | IncidenteDeRestituicao | Pessoa | — | PROV-O ⊑ wasAttributedTo | — |
| rec:define | InstrumentoJuridicoDeCooperacao | RequisitoDeCooperacao | — | FIBO ≈ mandates | — |
| rec:descreve | DossieDeBuscaPatrimonial ∪ MatriculaImobiliaria | Ativo ∪ BemImovel | — | — | descreve_DossieDeBuscaPatrimonial (FOAF ⊑ topic); descreve_MatriculaImobiliaria (FOAF ⊑ primaryTopic) |
| rec:designadaPor | Pessoa | NomeEVarianteDeGrafia | — | FIBO ≈ has person name | — |
| rec:destina | Destinacao | Ativo | incideSobreAtivo | — | — |
| rec:determina | DecisaoJudicial ∪ InstrumentoJuridicoDeCooperacao ∪ MedidaDeConstricao | Destinacao ∪ ValorEconomicoDeAtivo ∪ MedidaJudicialSobreAtivo ∪ ViaProcessual | — | — | determina_DecisaoJudicial_Destinacao (FIBO ⊑ mandates); determina_DecisaoJudicial_ValorEconomicoDeAtivo (FIBO ≈ has monetary amount); determina_DecisaoJudicial_MedidaJudicialSobreAtivo (FIBO ⊑ mandates); determina_InstrumentoJuridicoDeCooperacao (FIBO ≈ mandates); determina_MedidaDeConstricao (FIBO ≈ has monetary amount) |
| rec:dirigidaA | Correspondencia | AutoridadeCentral | — | FTM ≡ Message.recipients | — |
| rec:eCompostoPor | InstrumentoJuridicoDeCooperacao ∪ NormaNacional | DispositivoNormativo | — | — | eCompostoPor_InstrumentoJuridicoDeCooperacao (PROV-O ≈ hadMember) |
| rec:eConduzidoPor | ProcessoJudicial | OrgaoJudicial | — | FTM ≡ CourtCase.court | — |
| rec:emitidoPor | Documento ∪ IdentificadorDePessoa ∪ ListaRestritiva ∪ ValorMobiliario | Agente ∪ AtorInstitucional ∪ PessoaJurídica | — | FIBO ⊑ is issued by | emitidoPor_Documento (PROV-O ⊑ wasAttributedTo); emitidoPor_ValorMobiliario (FTM ≡ Security.issuer) |
| rec:enquadradoEm | FatoCriminoso | TipoPenal | — | — | — |
| rec:enviadaPor | Correspondencia | AutoridadeCentral | — | FTM ≡ Message.sender; PROV-O ⊑ wasAttributedTo | — |
| rec:evidencia | LancamentoFinanceiro ∪ RestricaoOuOnusSobreBem | IndicioFinanceiro ∪ IndicioPatrimonial | — | — | evidencia_LancamentoFinanceiro (FIBO ⊑ is evidence for) |
| rec:evidenciadoPor | Contrato | DocumentoComprobatorio | — | FIBO ⊑ is evidenced by | — |
| rec:executadaPor | Destinacao | AreaDeExecucaoOperacional | — | PROV-O ⊑ wasAssociatedWith | — |
| rec:exige | AlienacaoAntecipada ∪ Destinacao | AvaliacaoPatrimonial | — | FIBO ⊑ is predicated on; PROV-O ⊑ used | — |
| rec:extraidoDe | Indicio | Documento | — | PROV-O ≡ wasDerivedFrom | — |
| rec:fornecidaPor | TaxaDeCambioHistorica | SistemaDeInformacao | — | — | — |
| rec:fundamenta | DecisaoJudicial ∪ IndicioPatrimonial ∪ PecaProcessual | PedidoDeCooperacaoJuridicaInternacional ∪ MedidaDeConstricao ∪ DecisaoJudicial | — | — | fundamenta_IndicioPatrimonial (FIBO ⊑ is evidence for) |
| rec:fundamentaSeEm | Destinacao ∪ MedidaJudicialSobreAtivo ∪ PedidoDeCooperacaoJuridicaInternacional ∪ PrazoDeResposta ∪ Repatriacao | ParecerJuridico ∪ FundamentoLegal ∪ InstrumentoJuridicoDeCooperacao ∪ ElementoNormativo | — | — | fundamentaSeEm_MedidaJudicialSobreAtivo (FIBO ⊑ is predicated on); fundamentaSeEm_PedidoDeCooperacaoJuridicaInternacional (FIBO ⊑ is predicated on); fundamentaSeEm_PrazoDeResposta (FIBO ⊑ is predicated on); fundamentaSeEm_Repatriacao (FIBO ⊑ is predicated on) |
| rec:fundamentadoEm | StatusProbatorio | Documento | — | PROV-O ≈ wasDerivedFrom | — |
| rec:garante | AlienacaoFiduciaria | Divida | — | — | — |
| rec:gera | AlienacaoAntecipada ∪ RequisitoDeCooperacao | SubRogacaoDeAtivo ∪ MotivoDeSaneamentoOuDevolucao | — | — | — |
| rec:habilita | DecretoDePerdimento ∪ Exequatur ∪ RespostaDeCooperacao | Destinacao ∪ PedidoDeCooperacaoJuridicaInternacional ∪ Repatriacao | — | — | habilita_DecretoDePerdimento (FIBO ⊑ causes) |
| rec:identifica | AnaliseDeCompatibilidadeEconomica ∪ RegistroDeIdentificacaoDeCliente | Ativo ∪ Pessoa | — | — | — |
| rec:identificadaPor | Pessoa | IdentificadorDePessoa | — | FTM ≈ Identification.holder; REGORG ≈ registration | — |
| rec:impoe | Jurisdição | RequisitoFormal | — | FIBO ≈ mandates | — |
| rec:incideSobre | Alegacao ∪ RestricaoOuOnusSobreBem | Ativo | incideSobreAtivo | — | incideSobre_Alegacao (FIBO ≈ involves) |
| rec:indica | PedidoDeCooperacaoJuridicaInternacional | ValorEconomicoDeAtivo | — | FIBO ≈ has monetary amount | — |
| rec:instaura | PecaProcessual | IncidenteDeRestituicao | — | — | — |
| rec:instrui | AlegacaoDeTerceiroDeBoaFe | IncidenteDeRestituicao | — | FIBO ≈ is evidence for | — |
| rec:instruidoPor | PedidoDeCooperacaoJuridicaInternacional | DocumentoDoPedido | — | FIBO ⊑ is evidenced by | — |
| rec:instrumentadoPor | VinculoDeRepresentacao | ProcuracaoPublica | — | — | — |
| rec:instrumentalizadoPor | AtoRegistral ∪ Contrato | AtoNotarial ∪ EscrituraPublica | — | — | instrumentalizadoPor_AtoRegistral (FIBO ≈ is evidenced by); instrumentalizadoPor_Contrato (FIBO ⊑ is evidenced by) |
| rec:integra | UnidadeOrganizacional | AtorInstitucional | — | ORG ≡ unitOf | — |
| rec:invoca | FundamentoLegal ∪ PedidoDeCooperacaoJuridicaInternacional | DispositivoNormativo | — | — | — |
| rec:julgadoPor | IncidenteDeRestituicao | OrgaoJudicial | — | — | — |
| rec:lavradoPor | AtoNotarial | TabelionatoDeNotas | — | PROV-O ⊑ wasAttributedTo | — |
| rec:ligaAtivo | AssercaoDeTitularidade | Ativo | — | FTM ⊑ Ownership.asset | — |
| rec:ligaTitular | AssercaoDeTitularidade | Pessoa | — | FTM ⊑ Ownership.owner | — |
| rec:localizadoEm | Ativo ∪ Endereco | Jurisdição | — | — | — |
| rec:menciona | PedidoDeCooperacaoJuridicaInternacional | Pessoa | — | — | — |
| rec:operadaPor | Aeronave | Pessoa | — | — | — |
| rec:operadoPor | SistemaDeInformacao | AtorInstitucional | — | PROV-O ⊑ wasAttributedTo | — |
| rec:pertenceA | AtorInstitucional | Jurisdição | — | FIBO ⊑ is an instrument of | — |
| rec:possui | PedidoDeCooperacaoJuridicaInternacional ∪ ProcessoJudicial | Correspondencia ∪ EventoDeTramitacao | — | — | — |
| rec:praticadoPor | AtoRegistral ∪ EventoDeTramitacao | OrgaoDeRegistroPublico ∪ Agente | — | PROV-O ⊑ wasAttributedTo | — |
| rec:previstoEm | TipoPenal | DispositivoNormativo | — | — | — |
| rec:produz | AlienacaoAntecipada ∪ AtoRegistral ∪ AvaliacaoPatrimonial ∪ ConsultaAFonte ∪ InstituicaoFinanceira ∪ Repatriacao ∪ RespostaDeCooperacao ∪ UnidadeDeBuscaPatrimonial ∪ UnidadeDeInteligenciaFinanceira | ValorEconomicoDeAtivo ∪ AssercaoDeTitularidade ∪ Documento ∪ ExtratoDeMovimentacaoFinanceira ∪ DossieDeBuscaPatrimonial ∪ IndicioPatrimonial ∪ RelatorioDeInteligenciaFinanceira | — | — | produz_AtoRegistral (FIBO ⊑ produces); produz_AvaliacaoPatrimonial (FIBO ⊑ has monetary amount); produz_InstituicaoFinanceira (FIBO ⊑ issues); produz_Repatriacao (FIBO ≈ has monetary amount); produz_RespostaDeCooperacao (FIBO ≈ has monetary amount); produz_UnidadeDeBuscaPatrimonial (FIBO ⊑ produces); produz_UnidadeDeInteligenciaFinanceira (FIBO ⊑ produces) |
| rec:profere | OrgaoJudicial | DecisaoJudicial | — | FIBO ⊑ issues | — |
| rec:promulgadoPor | InstrumentoJuridicoDeCooperacao | NormaNacional | — | — | — |
| rec:provenienteDe | Repatriacao ∪ RespostaDeCooperacao | Jurisdição | — | — | — |
| rec:qualificadoPor | Ativo ∪ Avaliacao ∪ ConsultaAFonte ∪ Indicio ∪ RelacaoReificada ∪ ValorEconomicoDeAtivo | StatusProbatorio | — | — | — |
| rec:questiona | IncidenteDeRestituicao | MedidaDeConstricao | — | — | — |
| rec:realizadaPor | Avaliacao ∪ ConsultaAFonte | Agente | — | PROV-O ⊑ wasAssociatedWith | — |
| rec:realizadaSobre | ConsultaAFonte | SistemaDeInformacao ∪ ListaRestritiva | — | PROV-O ⊑ used | — |
| rec:recaiSobre | MedidaJudicialSobreAtivo | Ativo | incideSobreAtivo | FIBO ≈ involves | — |
| rec:recebe | PedidoDeCooperacaoJuridicaInternacional | RespostaDeCooperacao | — | — | — |
| rec:refereSeA | Contrato ∪ ExtratoDeMovimentacaoFinanceira ∪ IndicioPatrimonial ∪ InterposicaoDePessoa ∪ PedidoDeCooperacaoJuridicaInternacional | Ativo ∪ ContaBancaria | — | — | refereSeA_Contrato (FIBO ⊑ defines terms for); refereSeA_ExtratoDeMovimentacaoFinanceira (FIBO ≡ applies to account); refereSeA_PedidoDeCooperacaoJuridicaInternacional (FIBO ≈ involves) |
| rec:referencia | ProcessoJudicial | Ativo | incideSobreAtivo | FIBO ≈ involves | — |
| rec:regidoPor | Contrato | Jurisdição | — | FIBO ≡ has governing jurisdiction | — |
| rec:registradoEm | Ativo ∪ AtoNotarial ∪ Avaliacao ∪ Destinacao ∪ EventoDeTramitacao ∪ PedidoDeCooperacaoJuridicaInternacional ∪ ProcessoJudicial | RegistroPublicoDeBem ∪ SistemaDeInformacao | — | — | — |
| rec:relacionaSeCom | ProcessoJudicial | ProcessoJudicial | — | — | — |
| rec:requeridaPor | MedidaJudicialSobreAtivo | OrgaoDeAcusacao | — | — | — |
| rec:retifica | DeclaracaoFiscalDeRendaEPatrimonio | DeclaracaoFiscalDeRendaEPatrimonio | — | — | — |
| rec:sanciona | SancaoIndividual | Pessoa | — | FTM ⊑ Sanction.entity | — |
| rec:solicita | PedidoDeCooperacaoJuridicaInternacional | MedidaDeConstricao ∪ Repatriacao | — | — | — |
| rec:sujeitoA | PedidoDeCooperacaoJuridicaInternacional | PrazoDeResposta | — | FIBO ≈ has term | — |
| rec:sustenta | IndicioFinanceiro | AnaliseDeCompatibilidadeEconomica | — | FIBO ⊑ is evidence for | — |
| rec:sustentadaPor | Alegacao | DocumentoComprobatorio | — | FIBO ⊑ is evidenced by | — |
| rec:temAlvo | ConsultaAFonte ∪ DossieDeBuscaPatrimonial | Pessoa | — | — | temAlvo_DossieDeBuscaPatrimonial (FOAF ≡ primaryTopic) |
| rec:temAutoridadeRequerente | PedidoDeCooperacaoJuridicaInternacional | AutoridadeCentral | — | — | — |
| rec:temAutoridadeRequerida | PedidoDeCooperacaoJuridicaInternacional | AutoridadeCentral | — | — | — |
| rec:temCausa | EventoDeTramitacao | MotivoDeSaneamentoOuDevolucao | — | — | — |
| rec:temCodigoPostal | Endereco | CodigoPostal | — | FIBO ≡ has individual postcode | — |
| rec:temContraparte | LancamentoFinanceiro | Pessoa | — | FTM ≈ Payment.beneficiary; FTM ≈ Payment.payer | — |
| rec:temCredor | Divida | Pessoa | — | FTM ⊑ Debt.creditor | — |
| rec:temDestino | SubRogacaoDeAtivo ∪ SucessaoDeEntidade ∪ VinculoEntrePessoas | Ativo ∪ PessoaJurídica ∪ Pessoa | — | — | temDestino_SucessaoDeEntidade (FTM ≈ Succession.successor; ORG ⊑ resultingOrganization); temDestino_VinculoEntrePessoas (FTM ⊑ Associate.associate; FTM ⊑ Family.relative) |
| rec:temDevedor | Divida | Pessoa | — | FTM ⊑ Debt.debtor | — |
| rec:temEndereco | BemImovel ∪ PessoaFísica ∪ PessoaJurídica ∪ RegistroDeIdentificacaoDeCliente | Endereco | — | — | temEndereco_BemImovel (FIBO ⊑ has address; FTM ≡ RealEstate.address); temEndereco_PessoaFisica (FIBO ≡ has address; schema ≈ address); temEndereco_PessoaJuridica (FIBO ≡ has address; schema ≈ address); temEndereco_RegistroDeIdentificacaoDeCliente (FIBO ⊑ has address) |
| rec:temJurisdicaoRequerente | PedidoDeCooperacaoJuridicaInternacional | Jurisdição | — | — | — |
| rec:temJurisdicaoRequerida | PedidoDeCooperacaoJuridicaInternacional | Jurisdição | — | — | — |
| rec:temNexoCom | Ativo | FatoCriminoso | — | — | — |
| rec:temOrigem | SubRogacaoDeAtivo ∪ SucessaoDeEntidade ∪ VinculoEntrePessoas | Ativo ∪ PessoaJurídica ∪ Pessoa | — | — | temOrigem_SucessaoDeEntidade (FTM ≈ Succession.predecessor; ORG ⊑ originalOrganization); temOrigem_VinculoEntrePessoas (FTM ⊑ Associate.person; FTM ⊑ Family.person) |
| rec:temOutorgado | ProcuracaoPublica | Pessoa | — | — | — |
| rec:temOutorgante | ProcuracaoPublica | Pessoa | — | — | — |
| rec:temParte | AtoNotarialOuRegistral ∪ Contrato ∪ ProcessoJudicial | Pessoa | — | — | temParte_AtoNotarialOuRegistral (FIBO ≈ has contract party); temParte_Contrato (FIBO ≡ has contract party); temParte_ProcessoJudicial (ACO desenho isInvolvedIn; FTM ≈ CourtCaseParty.party) |
| rec:temParticipante | ParticipacaoEmProcesso | Pessoa | — | FTM ⊑ CourtCaseParty.party | — |
| rec:temProcesso | ParticipacaoEmProcesso | ProcessoJudicial | — | FTM ≡ CourtCaseParty.case | — |
| rec:temSociedade | ParticipacaoSocietaria | PessoaJurídica | — | FTM ⊑ Ownership.asset; ORG ≈ organization | — |
| rec:temSocio | ParticipacaoSocietaria | Pessoa | — | FTM ⊑ Ownership.owner; ORG ≈ member | — |
| rec:temValor | AssercaoDeTitularidade ∪ Ativo ∪ AtoNotarialOuRegistral ∪ Contrato ∪ Divida ∪ LancamentoFinanceiro ∪ SubRogacaoDeAtivo | ValorEconomicoDeAtivo | — | FIBO ≡ has monetary amount | — |
| rec:titularAnterior | AssercaoDeTitularidade | Pessoa | — | — | — |
| rec:titularDe | Pessoa | Ativo | — | ACO desenho own; FIBO ≈ holds | — |
| rec:utiliza | AnaliseDeCompatibilidadeEconomica ∪ PedidoDeCooperacaoJuridicaInternacional | DeclaracaoFiscalDeRendaEPatrimonio ∪ ExtratoDeMovimentacaoFinanceira ∪ ViaProcessual | — | — | utiliza_AnaliseDeCompatibilidadeEconomica_DeclaracaoFiscalDeRendaEPatrimonio (PROV-O ≡ used); utiliza_AnaliseDeCompatibilidadeEconomica_ExtratoDeMovimentacaoFinanceira (PROV-O ≡ used) |
| rec:validoEm | IdentificadorDePessoa | Jurisdição | — | — | — |
| rec:veiculadaEm | Alegacao | PecaProcessual | — | — | — |
| rec:versiona | PedidoDeCooperacaoJuridicaInternacional | PedidoDeCooperacaoJuridicaInternacional | — | — | — |
| rec:vigeEm | NormaNacional | Jurisdição | — | — | — |
| rec:vincula | InstrumentoJuridicoDeCooperacao | Jurisdição | — | FIBO ≈ has contract party | — |
| rec:vinculaAtivo | NexoCausal | Ativo | — | — | — |
| rec:vinculaFato | NexoCausal | FatoCriminoso | — | — | — |
| rec:vinculaSeA | PedidoDeCooperacaoJuridicaInternacional | ProcessoJudicial | — | FIBO ≈ relates to | — |

## 7. Data properties

| Alcance | Quantidade |
|---|---|
| xsd:boolean | 21 |
| xsd:dateTime | 40 |
| xsd:decimal | 14 |
| xsd:integer | 1 |
| xsd:string | 186 |

Atributos compartilhados por mais de uma classe (domínio = união): data, dataDaDecisao, dataDeCorte, dataDeEnvio, dataDeInicio, dataDeJuntada, dataDeRecebimento, dataDoDocumento, dataDoEvento, dataDoTransitoEmJulgado, denominacao, modalidade, moeda, nivelDeSigilo, objeto, papel, resultado, situacao, status, tipo, tipoDeDocumento, tipoDeEvento, versao, vigencia.

## 8. Validação

Estrutural: 0 erro(s), 3 aviso(s).

- A2: 100 atributo(s) com alcance xsd:string por falta de decisão de tipo.
- A4: Cadeias com inversa (fora do perfil OWL 2 RL): temParte, titularDe.
- A5: Validação DL não executada para esta geração.

DL (HermiT): não executada para esta geração.

## 9. Fontes das ontologias reusadas

| Sigla | Ontologia | Modo | Versão | Fonte | Importada no alinhamento |
|---|---|---|---|---|---|
| ACO | Asset Concealment Ontology (ACO) — TORRES et al., 2024 (Cap. 6 da tese) | desenho | — | — | não |
| FIBO | FIBO | owl | master/latest (2026Q1) | https://spec.edmcouncil.org/fibo/ontology/master/latest/prod.fibo-quickstart.ttl | não |
| FOAF | FOAF (Friend of a Friend) | owl | 0.99 | http://xmlns.com/foaf/spec/index.rdf | sim (http://xmlns.com/foaf/0.1/) |
| FTM | FollowTheMoney | skos | v4.11.0 | — | não |
| ORG | W3C Organization Ontology (ORG) | owl | W3C Recommendation 2014-01-16 | https://www.w3.org/ns/org.ttl | sim (http://www.w3.org/ns/org#) |
| PROV-O | PROV-O | owl | W3C Recommendation 2013-04-30 | https://www.w3.org/ns/prov.ttl | sim (http://www.w3.org/ns/prov#) |
| REGORG | W3C Registered Organization Vocabulary (REGORG) | owl | W3C Working Group Note 2013-08-01 | https://www.w3.org/ns/regorg.ttl | sim (http://www.w3.org/ns/regorg#) |
| schema | schema.org | owl | latest | https://schema.org/version/latest/schemaorg-current-https.ttl | não |
| SUMO | SUMO / SUMO-F (Suggested Upper Merged Ontology) | desenho | — | — | não |

## 10. Critérios de saída do estágio (OCO)

- [x] Ontologia integra alinhamentos + DKD sem conceito órfão (Gerar recusa órfãos).
- [x] Arquivo OWL/RDF válido — validação estrutural sem erros.
- [ ] Consistência verificada com reasoner (HermiT) para esta geração.
