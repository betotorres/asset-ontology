# Levantamento de fontes — Marco normativo e instrumentos jurídicos aplicáveis (recuperacao-ativos)

> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais.

## Atores considerados

Critério de seleção: foram incluídos os atores que, segundo as respostas ASD (seções G1 e G2, complementadas por B/C/F), **produzem, custodiam, invocam ou verificam** normas, tratados, convenções e requisitos formais aplicáveis à medida ou ao pedido de recuperação de ativos. Foram excluídos atores cuja relação com o domínio é exclusivamente patrimonial-cadastral (serventias de imóveis, Detran, juntas comerciais, prefeituras) ou de gestão física do bem, por não custodiarem o marco normativo em si.

**Atores nacionais**

- **Órgão central — Autoridade Central brasileira.** Citado por todos os perfis. Centraliza a tramitação de pedidos e é quem, na prática, identifica o tratado/instrumento aplicável, os requisitos formais do Estado requerido e os prazos previstos em tratado (analista de cooperação, B1, B5, F1; coordenador, C3).
- **Área jurídica do órgão central / área de análise jurídica substantiva.** Mencionada como instância a quem se recorre quando o enquadramento normativo é controverso (ex.: substituição de tratado bilateral por convenção multilateral; confisco sem condenação — analista de cooperação, C4 caso 2; analista humano, E1 e G2, que recomenda confirmação do rol de instrumentos com essa área).
- **Assessoria jurídica especializada em perdimento e destinação.** Produz parecer que identifica o **enquadramento legal do perdimento** e o fundamento normativo aplicável a cada bem (A3, B1, B5, D1.4).
- **Ministério Público (federal/estadual).** Autoridade requisitante e produtora de peças que invocam a base legal da medida (G1 do membro do sistema de justiça, do analista de cooperação e do coordenador).
- **Magistratura / juízo de origem (varas criminais federais e estaduais; juízo de execução).** Produz a decisão que veicula o fundamento legal da medida e do perdimento (G1 — membro do sistema de justiça; assessor jurídico; analista de cooperação).
- **STJ.** Concessão de exequatur em cartas rogatórias, em ambos os sentidos (analista de cooperação, G1).
- **Ministério das Relações Exteriores (Itamaraty).** Via diplomática, nota verbal, casos sem tratado ou sem canal direto; normas próprias de classificação de informação diplomática (analista de cooperação, G1, H1).
- **Polícia e Unidade de Inteligência Financeira (UIF/COAF).** Atores do ciclo cujo produto entra nos autos; relevantes aqui apenas como partícipes de regimes normativos de sigilo e de troca de informação (G1 do membro do sistema de justiça e do analista de busca patrimonial).
- **Equipe de TI/dados e automação (RPA) do ministério.** Opera o parsing e a validação formal do campo "base legal/tratado aplicável" e do checklist de requisitos formais (tradução, formato de data, apostilamento) — B1 item 6, G2.
- **Coordenação/direção do órgão central.** Usa o instrumento de cooperação aplicável como variável de gestão ("solidez da base de cooperação") e conduz escalonamento diplomático (coordenador, B1, C3, E1, G2).
- **Órgãos de controle externo/auditoria.** Revisão de consistência dos pareceres de enquadramento (assessor jurídico, E1, G1).

**Atores estrangeiros e multilaterais**

- **Autoridades centrais estrangeiras** (podem ser ministério, Ministério Público ou agência de recuperação de ativos — papel não padronizado internacionalmente; analista de cooperação, B2, G1).
- **Autoridade requerida no país estrangeiro** (MP local, agência de recuperação de ativos, UIF), nem sempre coincidente com a autoridade central (analista de cooperação, G1).
- **Organismo internacional de cooperação como intermediário** — papel citado sem detalhamento (TI/RPA, G1; coordenador, G1).
- **Redes de cooperação: CARIN, ARINSA, RRAG, Egmont Group** (analista humano, D2 e G2; analista de cooperação, F1/F3 — "canais de redes específicas de cooperação", uso limitado).
- **ENCLA — Estratégia Nacional de Combate à Corrupção e à Lavagem de Dinheiro** (analista humano, G2).

**Nota de proveniência:** apenas a resposta do analista de busca patrimonial (órgão central) é de respondente humano; as demais são agentes sintéticos (evidência de terceira classe), exigindo validação humana antes de virar lastro. O rol de instrumentos da G2 humana foi sugerido pelo entrevistador e apenas validado pelo respondente, que recomendou confirmação com a área jurídica do órgão central.

## Sistemas e bases por ator

### Órgão central — Autoridade Central

**1. Base/repositório de acordos e tratados**
- Citado em F1 (analista de cooperação) como fonte consultada; **não confirmado se é plataforma unificada ou pasta de referência individual** do analista.
- Conteúdo desejado (F3): base consolidada e atualizada de tratados/instrumentos internacionais com **vigência**, **reservas** e **signatários**.
- Nível de acesso hoje incerto — "publicação oficial vs. integração sistêmica" (F3).
- Nome oficial, custódia, formato e URL: [requer pesquisa adicional].

**2. Sistema interno de controle de tramitação de processos de cooperação**
- Nome técnico não confirmado pelo respondente (F1, analista de cooperação); o coordenador também refere "sistema de tramitação (não identificado com precisão)" (F1); o analista de TI evitou nomear sistemas por incerteza (B3, D2, F1).
- Campos relevantes a esta categoria, mencionados explicitamente:
  - **Instrumento jurídico exato aplicável** (tratado/artigo específico ou reciprocidade) — "nem sempre registrado de forma explícita e padronizada" (B5, analista de cooperação).
  - **Base legal/tratado aplicável** — tratado no parsing como **string de referência**; o sistema **verifica apenas presença do campo, não a correção jurídica do conteúdo** (TI, B1 item 6 e G2).
  - **Tipo de medida solicitada** (bloqueio, sequestro, confisco, repatriação) — "categórico ou texto livre" (TI, B1 item 7); sem tipificação estruturada da espécie de medida assecuratória (analista de cooperação, B5).
  - **País solicitante/solicitado**; **autoridade central/requerente**; **número do processo/referência** (chave primária de cruzamento) — TI, B1 itens 1–3.
  - **Via processual** (auxílio direto × carta rogatória) — reclassificação no meio do trâmite **não é registrada como evento próprio**, gerando registro novo em vez de atualização (analista de cooperação, D2 P9, F2).
  - **Motivo de devolução/saneamento** (falta de tradução, apostilamento, dupla incriminação, formulário incompleto) — **sem lista fechada estruturada**; hoje só em ofícios/e-mails (B5, analista de cooperação).
  - **Prazos de resposta previstos em tratado** — controle manual em planilha/memória, sem alerta automático (B5).
- Modelo de dados, tabelas, tipos e domínios de valores: [requer pesquisa adicional].

**3. Formulários próprios de cada instrumento**
- Chamados pelo nome do próprio instrumento: "formulário da Convenção de Palermo", "modelo do MLAT com os EUA" — sem apelido genérico unificado (analista de cooperação, B3).
- Formulários de bens no exterior são "mais padronizados/rígidos", facilitando extração comparada a documentos nacionais mais textuais (TI, C1).
- Requisitos formais associados verificados pelo pipeline: **tradução (às vezes juramentada)** com checklist bloqueante; **formato de data específico exigido por tratado/formulário (ex.: ISO 8601)**; **legalização/apostilamento** — existência conhecida, sem clareza de como se materializa em dado (campo, anexo, selo digital); **campo obrigatório de citação de tratado/base legal** (TI, G2).
- Catálogo real de formulários por instrumento, versões e campos: [requer pesquisa adicional].

**4. E-mail institucional e planilhas paralelas**
- E-mail: canal central de comunicação com autoridades centrais estrangeiras, sem espelho automático no sistema; é onde de fato residem os motivos de saneamento e as exigências formais do país requerido (analista de cooperação, F1, F2; TI, F1; coordenador, F1).
- Planilhas paralelas: controle de prazos de tratado, criticidade e SLA (analista de cooperação, B5; coordenador, B5, F1; TI, D2).

### Judiciário / sistema de justiça

**5. Sistema de processo eletrônico (autos digitais da Justiça Federal e estadual)**
- Fonte primária da decisão que fundamenta o pedido e do **fundamento legal do perdimento**.
- Propriedades mencionadas: o fundamento legal específico por bem (**artigo/dispositivo, tipo de origem do bem, com/sem antecipação**) está "diluído na fundamentação da sentença, não estruturado" (assessor jurídico, B5 e D1.4).
- A decisão de mérito deve figurar como referência externa com **metadados básicos: data, juízo de origem, tipo de medida determinada** (analista de cooperação, B4).
- Membro do sistema de justiça (F1) cita o processo eletrônico da Justiça Federal e sistemas internos do MP (controle de prazo/distribuição, não análise patrimonial).
- Nome do sistema, campos de classe/assunto, taxonomia de fundamento legal: [requer pesquisa adicional].

### Legislação e tipologia criminal brasileira

**6. Legislação brasileira de tipologia criminal**
- Indicada como necessária ao escopo pelo respondente humano: "analisar a tipologia criminal das leis relacionadas à recuperação de ativos na legislação brasileira (**ex.: Lei Raul Jungmann**) e legislações de outros países" (B4).
- Ressalva: outros perfis (membro do sistema de justiça, B4; TI, B4) sugerem manter a **tipificação penal em si** fora do escopo, tratando-a como domínio conexo usado como insumo — divergência a resolver na validação.
- Número/ano da lei, dispositivos, vigência e repositório oficial (ex.: Planalto/LexML): [requer pesquisa adicional].
- Legislação estrangeira correspondente: [requer pesquisa adicional].

**7. Normas de sigilo e proteção de dados aplicáveis**
- **LC 105 e correlatas** (sigilo bancário e fiscal — circulação restrita à autorização judicial específica de cada quebra) — membro do sistema de justiça, H1.
- **LGPD** (dados pessoais de terceiros não investigados: parentes, sócios, terceiros de boa-fé) — citada por praticamente todos os perfis (H1).
- **Sigilo processual / segredo de justiça**; sigilo fiscal, bancário, telemático (analista humano, H1).
- **Princípio da especialidade** — informação/bem obtido por um pedido só pode ser usado para a finalidade original; restrição a cruzamento entre casos (analista de cooperação, H1; coordenador, H1).
- **Classificação de informação diplomática** (notas verbais, normas do Itamaraty) — respondente não domina detalhes (analista de cooperação, H1).
- **Regras de confidencialidade dos próprios tratados de cooperação** — mesmo marcos "visíveis" precisam respeitar o que o país estrangeiro autorizou divulgar (membro do sistema de justiça, H1).
- Referências normativas completas (números, artigos, vigência): [requer pesquisa adicional].

### Instrumentos internacionais nominados nas respostas

**8. Convenções multilaterais**
- **UNCAC — Convenção das Nações Unidas contra a Corrupção** (analista humano, G2).
- **Convenção de Palermo — crime organizado transnacional** (analista humano, G2; formulário próprio citado em B3 do analista de cooperação).
- **Convenção Interamericana contra a Corrupção (OEA)** (analista humano, G2).
- **Convenção da Apostila de Haia** — referida pelo jargão "apostila"/apostilamento (analista de cooperação, B3, C1).
- Requisito destacado em caso concreto: convenção multilateral específica sobre corrupção exigiu indicação sobre possibilidade de **confisco sem condenação (*non-conviction based*)**, tema que obrigou reformulação do pedido (analista de cooperação, C4 caso 2).
- Vigência para o Brasil, decretos promulgadores, reservas, artigos aplicáveis a bloqueio/confisco/repartição: [requer pesquisa adicional].

**9. Tratados bilaterais de assistência jurídica mútua (MLATs)**
- Citados: **EUA, Portugal, países do Mercosul, entre outros** (analista humano, G2); "modelo do MLAT com os EUA" como formulário próprio (analista de cooperação, B3); "MLA/Mutual Legal Assistance" como jargão usado mesmo em comunicação em português (TI, B3).
- Propriedades mencionadas de forma genérica: cada tratado **define prazo, formato e requisitos** (analista de cooperação, B1 item 6); exige em alguns casos **descrição fática da conduta**, não apenas dispositivos legais, e **dados específicos da conta/titular** (C4 caso 1); alguns preveem **repartição de ativos (asset sharing)** (G2).
- Lista completa, decretos, vigência, artigos e formulários por país: [requer pesquisa adicional].

**10. Base de cooperação por reciprocidade (sem tratado)**
- Citada como alternativa ao tratado: "instrumento jurídico exato aplicável (tratado/artigo específico **ou reciprocidade**)" (analista de cooperação, B5); casos com países "sem tratado específico" tendem a travar mais (coordenador, C1); via diplomática/nota verbal quando não há canal técnico direto (analista de cooperação, B3, G1).
- Forma de registro e formalização da reciprocidade: [requer pesquisa adicional].

**11. Requisitos formais divergentes por tradição jurídica e por norma interna do país de destino**
- Common law mais rigoroso com certificação/**affidavits**; civil law aceita mais facilmente cópia autenticada e tradução juramentada — "generalização sem dados quantitativos de sustentação" (analista de cooperação, C1).
- Exigências de tradução/legalização **não são uniformes**: variam por norma interna de cada país de destino, além do que o tratado formalmente prevê (analista de cooperação, G2).
- Diferença de exigência formal entre países (tradução juramentada, nível de detalhamento da fundamentação, prazos distintos) apontada como gargalo prático (coordenador, G2).
- Fonte documental dessas exigências por país: [requer pesquisa adicional].

**12. Correspondência entre categorias jurídicas de países diferentes**
- Termos sem equivalente exato: **"perdimento" não tem tradução direta em outro país**, gerando idas e vindas de esclarecimento com autoridade central estrangeira (coordenador, B2).
- **"seizure", "freezing", "forfeiture", "confiscation"** (common law) × "sequestro", "bloqueio", "confisco", "perdimento" — usados como sinônimos por quem preenche/traduz, apesar de nuances distintas; tratamento atual é flag de baixa confiança + revisão humana, sem regra automática (TI, B2).
- **"freezing order", "seizure", "restraint order"** não são equivalentes entre si nem sempre correspondem a "bloqueio"; efeitos práticos diferem (impedir transferência × apreensão física) — analista de cooperação, B2.
- **Confisco × perdimento** com diferenças de regime jurídico entre países (consequência penal acessória × autônoma; efeitos sobre terceiro de boa-fé) — analista de cooperação, B2; assessor jurídico, B2; analista de busca patrimonial, B2 ("processo-contra-pessoa × contra-bem", distinção não dominada).
- **Auxílio direto × carta rogatória** — confusão frequente inclusive no Judiciário brasileiro sobre qual via cabe, "dependendo do tratado aplicável e da natureza do ato" (analista de cooperação, B2, C1).
- **Autoridade central não é papel padronizado internacionalmente** — pode ser ministério, MP ou agência específica, variando por tratado e país (analista de cooperação, B2).
- **Dupla incriminação** — requisito de que a conduta seja crime em ambos os países; "pode travar pedidos de bloqueio" e figura entre os motivos de devolução (analista de cooperação, B1 item 4, B5, C1).
- Tabela de-para oficial entre categorias jurídicas: **não existe nas respostas** — [requer pesquisa adicional].

### Redes e instrumentos de troca de informação citados

**13. Redes de cooperação e canais de pontos de contato**
- **CARIN, ARINSA, RRAG, Egmont Group** (analista humano, D2 e G2); "redes informais de cooperação como canal alternativo/complementar ao trâmite formal", cujo funcionamento interno o respondente não domina (analista de cooperação, G2, F3 — "acesso pontual/informal, não como base consultável").
- Coordenador (F3) reconhece a existência de redes internacionais, mas "não domina nome/funcionamento técnico".
- Natureza jurídica, instrumento constitutivo, regras de uso do dado obtido: [requer pesquisa adicional].

**14. Instrumentos de troca automática de informações fiscais e listas de sanções**
- **CRS/FATCA** e **cadastros de sanções internacionais (OFAC, listas da ONU)** — citados pelo respondente humano em D2 como fontes a cruzar. Têm componente normativo (acordos e regimes de sanção), mas as respostas não descrevem o marco jurídico de acesso.
- Base legal de acesso pelo Brasil, condições de uso e nível de acesso do órgão central: [requer pesquisa adicional].

**15. ENCLA**
- Citada como instância de articulação nacional (analista humano, G2). Natureza (estratégia/plano de ação), periodicidade, metas e caráter vinculante: [requer pesquisa adicional].

### Lacunas transversais declaradas (relevantes a esta categoria)

- Não existe interoperabilidade/portal comum de status entre sistemas de tramitação de cooperação de diferentes países; comunicação é por ofício, e-mail ou nota verbal (analista de cooperação, F3).
- Não há **repositório estruturado de histórico de cooperação internacional já realizada** (membro do sistema de justiça, F3) nem **histórico consolidado de cooperação por país** (volume, tempo médio de resposta, taxa de sucesso) — coordenador, F3.
- O fluxo de cooperação internacional é descrito como "caixa preta"; o modelo deveria capturar ao menos marcos visíveis externamente: **pedido formulado, resposta recebida, bloqueio confirmado** (membro do sistema de justiça, G2).
- "Perdimento" não deve ser tratado como conceito único: precisa estar sempre vinculado a um **"índice" implícito de marco normativo** (penal, improbidade, lavagem, cooperação internacional), sob risco de falsa uniformidade (assessor jurídico, B1).

## Sistemas e propriedades identificados

| Sistema/base | Ator(es) | Propriedades conhecidas | Lacunas |
|---|---|---|---|
| Base/repositório de acordos e tratados | Órgão central (analista de cooperação, F1/F3) | Consultado como fonte de referência do instrumento aplicável; conteúdo desejado inclui vigência, reservas e signatários | Nome oficial, custódia, formato (plataforma unificada × pasta de referência individual), URL, nível de acesso ("publicação oficial vs. integração sistêmica"), periodicidade de atualização — [requer pesquisa adicional] |
| Sistema interno de controle de tramitação de processos de cooperação | Órgão central; coordenação; TI/RPA (F1 de três respondentes) | Campos citados: número do processo/referência (chave primária); país solicitante/solicitado; autoridade central/requerente; base legal/tratado aplicável (string de referência, validada apenas quanto à presença, não à correção jurídica); tipo de medida solicitada (bloqueio/sequestro/confisco/repatriação — categórico ou texto livre); via processual (auxílio direto × carta rogatória); status/andamento como histórico de estados; prazo/urgência | Nome oficial e sigla não confirmados por nenhum respondente; modelo de dados, tipos, domínios de valores, vocabulário controlado de tratados; motivo de saneamento sem lista fechada; reclassificação de via não registrada como evento; ausência de alerta de prazo de tratado — [requer pesquisa adicional] |
| Formulários próprios de cada instrumento (ex.: formulário da Convenção de Palermo, modelo do MLAT com os EUA) | Órgão central; autoridades centrais estrangeiras; TI/RPA (B3; G2) | Nomeados pelo próprio instrumento, sem apelido genérico; formulários de bens no exterior são mais padronizados/rígidos que documentos nacionais; requisitos verificados no pipeline: tradução (às vezes juramentada, com checklist bloqueante), formato de data exigido por tratado (ex.: ISO 8601), campo obrigatório de citação de tratado/base legal, legalização/apostilamento | Catálogo de formulários por instrumento, versões, lista de campos, obrigatoriedade por campo; como apostilamento/legalização se materializa em dado (campo, anexo, selo digital) — [requer pesquisa adicional] |
| Convenções multilaterais (UNCAC; Convenção de Palermo; Convenção Interamericana contra a Corrupção/OEA; Convenção da Apostila de Haia) | ONU/UNODC; OEA; Conferência da Haia; órgão central como aplicador (G2 humano; B3 e C4 do analista de cooperação) | Citadas nominalmente; Palermo possui formulário próprio; convenção multilateral sobre corrupção exigiu, em caso concreto, indicação sobre possibilidade de confisco sem condenação (*non-conviction based*); Apostila referida pelo jargão "apostila"/apostilamento | Decretos promulgadores, datas de vigência para o Brasil, reservas e declarações, artigos específicos sobre bloqueio/confisco/repatriação/repartição, identificador estável do instrumento — [requer pesquisa adicional]. Rol foi sugerido pelo entrevistador e apenas validado pelo respondente humano, que pediu confirmação com a área jurídica do órgão central |
| Tratados bilaterais de assistência jurídica mútua (MLATs) — EUA, Portugal, países do Mercosul, entre outros | Órgão central (autoridade central); autoridades centrais estrangeiras (G2 humano; B1/B3/C4 do analista de cooperação) | Cada tratado define prazo, formato e requisitos do pedido; alguns exigem descrição fática da conduta (não só dispositivos legais) e dados específicos da conta/titular; alguns preveem repartição de ativos (*asset sharing*); jargão "MLA"/"MLAT" usado em comunicações em português | Lista completa de países e instrumentos, decretos, vigência, artigos aplicáveis, existência ou não de canal direto entre autoridades centrais, prazos nominais por tratado — [requer pesquisa adicional] |
| Cooperação por reciprocidade / via diplomática (nota verbal) | MRE/Itamaraty; órgão central; autoridades centrais estrangeiras (B3, B5, G1 e H1 do analista de cooperação; C1 do coordenador) | Registrada como alternativa ao tratado no campo de instrumento aplicável; usada quando não há tratado ou canal técnico direto; comunicações por nota verbal podem ter grau de sigilo próprio, regido por normas do Itamaraty | Forma de formalização e registro da reciprocidade; normas de classificação de informação diplomática; quais países hoje operam sob esse regime — [requer pesquisa adicional] |
| Requisitos formais por país de destino (tradução juramentada, apostilamento/legalização consular, affidavits, autenticação de cópias) | Autoridades centrais/requeridas estrangeiras; órgão central (C1, G2 do analista de cooperação; G2 do coordenador) | Variam por norma interna do país de destino, além do que o tratado prevê; percepção (sem dado quantitativo) de que common law é mais rigoroso com certificação/affidavits e civil law aceita cópia autenticada + tradução juramentada; diferenças também em nível de detalhamento da fundamentação e prazos | Fonte documental oficial por país; lista estruturada de requisitos por instrumento/país; critério de quando a tradução deve ser juramentada — [requer pesquisa adicional] |
| Tabela de correspondência entre categorias jurídicas (seizure/freezing/forfeiture/confiscation × sequestro/bloqueio/arresto/indisponibilidade/perdimento/confisco) | Órgão central; TI/RPA; assessoria jurídica; membro do sistema de justiça (B2 de cinco respondentes) | Termos tratados como sinônimos por quem preenche/traduz, apesar de efeitos distintos (impedir transferência × apreensão física); "perdimento" sem tradução direta em outros países; confisco × perdimento diferem em regime (acessório × autônomo) e em efeitos sobre terceiro de boa-fé; distinção processo-contra-pessoa × contra-bem citada sem domínio técnico; tratamento atual é flag de baixa confiança + revisão humana, sem regra automática | **Não existe base de-para nas respostas**; fonte autoritativa, granularidade (por país, por instrumento, por efeito jurídico) e responsável pela manutenção — [requer pesquisa adicional] |
| Requisito de dupla incriminação | Órgão central; autoridade requerida estrangeira (B1, B5, C1 do analista de cooperação) | Definido como exigência de que a conduta seja crime em ambos os países; pode travar pedidos de bloqueio; ausência de menção expressa ou descrição inadequada da conduta figura entre as causas de devolução/saneamento | Não há campo estruturado que registre a verificação; lista fechada de motivos de saneamento inexistente (hoje só em ofícios/e-mails); em quais instrumentos o requisito é exigido ou dispensado — [requer pesquisa adicional] |
| Sistema de processo eletrônico / autos digitais (Justiça Federal e estadual) | Judiciário; MP; assessoria jurídica; analista de busca patrimonial (F1 de vários respondentes) | Fonte primária do fundamento legal da medida e do perdimento; metadados básicos da decisão citados como necessários: data, juízo de origem, tipo de medida determinada; fundamento legal específico por bem (artigo/dispositivo, tipo de origem do bem, com/sem antecipação) existe apenas diluído na fundamentação textual | Nome do sistema não informado; ausência de campo estruturado para fundamento legal por bem; taxonomia de classe/assunto; ausência de identificador único e persistente do bem e do caso — [requer pesquisa adicional] |
| Legislação brasileira de tipologia criminal (ex.: Lei Raul Jungmann) e legislação estrangeira correspondente | Legislador nacional; analista humano (B4) | Indicada como necessária ao escopo pelo respondente humano, para análise da tipologia criminal das leis relacionadas à recuperação de ativos no Brasil e em outros países | Número/ano da lei e dispositivos não informados; repositório oficial (Planalto/LexML) não citado; legislação estrangeira não especificada; **divergência de escopo** — outros perfis (membro do sistema de justiça, B4; TI, B4) sugerem manter a tipificação penal fora do escopo, como domínio conexo — [requer pesquisa adicional / validação] |
| Normas de sigilo e proteção de dados (LC 105 e correlatas; LGPD; sigilo processual/segredo de justiça; princípio da especialidade; confidencialidade prevista em tratado; classificação de informação diplomática) | Membro do sistema de justiça; analistas do órgão central; assessor jurídico; TI (H1 de todos os respondentes) | LC 105 nominalmente citada (sigilo bancário e fiscal, circulação restrita à autorização judicial específica); LGPD citada com foco em dados de terceiros não investigados; princípio da especialidade restringe uso do dado à finalidade do instrumento de cooperação e limita cruzamento entre casos; tratados impõem limites do que o país estrangeiro autoriza divulgar; presunção de inocência citada como restrição interpretativa | Números, artigos e vigência não detalhados por nenhum respondente; política de retenção desconhecida (TI presume exigência de LGPD/normas de arquivo público); normas do Itamaraty sobre classificação; regras formais recomendadas para validação com área de compliance/proteção de dados — [requer pesquisa adicional] |
| Redes de cooperação e canais de pontos de contato (CARIN, ARINSA, RRAG, Egmont Group) | Redes internacionais; órgão central; UIFs estrangeiras (G2 e D2 humano; F1/F3 e G2 do analista de cooperação; F3 do coordenador) | Citadas nominalmente; descritas como canal alternativo/complementar ao trâmite formal, de acesso pontual/informal e não consultável como base | Instrumento constitutivo e natureza jurídica; regras de uso e reuso do dado obtido; forma de acesso do órgão central; funcionamento técnico não dominado por nenhum respondente — [requer pesquisa adicional] |
| Instrumentos de troca automática de informação fiscal e listas de sanções (CRS/FATCA; OFAC; listas da ONU) | Receita Federal; organismos internacionais; analista humano (D2) | Citados como fontes a cruzar em perguntas de busca patrimonial | Base legal de acesso pelo Brasil, condições de uso, nível de acesso do órgão central, formato e periodicidade — [requer pesquisa adicional] |
| ENCLA — Estratégia Nacional de Combate à Corrupção e à Lavagem de Dinheiro | Articulação nacional interinstitucional (G2 humano) | Citada nominalmente como instância/arranjo relevante ao domínio | Natureza (estratégia/plano de ação), ato instituidor, participantes, metas, caráter vinculante e relação com o marco normativo — [requer pesquisa adicional] |
| Planilhas paralelas e e-mail institucional (controle de prazos de tratado e de exigências formais) | Órgão central (analistas e coordenação); TI (B5, F1, F2) | Guardam: prazos de resposta previstos em tratado (controle manual, sem alerta); motivo real de saneamento e exigências formais do país requerido; criticidade de gestão; desfecho recebido por canal informal | Sem estrutura, sem padronização, sem espelho automático no sistema; dado desatualizado por lançamento manual tardio; duplicidade de registro em reclassificações; inventário real dessas planilhas — [requer pesquisa adicional] |
| Base consolidada de tratados/instrumentos internacionais (desejada, inexistente) | Órgão central (F3 do analista de cooperação); membro do sistema de justiça (F3, "repositório estruturado de histórico de cooperação internacional já realizada"); coordenador (F3, "histórico consolidado de cooperação por país") | Conteúdo desejado: vigência, reservas, signatários; por país — volume de pedidos, tempo médio de resposta, taxa de sucesso; sinalização automática de nome/entidade já citado em casos anteriores | Não existe hoje, até onde os respondentes sabem; responsável, viabilidade, fonte de dados e forma de integração — [requer pesquisa adicional] |
