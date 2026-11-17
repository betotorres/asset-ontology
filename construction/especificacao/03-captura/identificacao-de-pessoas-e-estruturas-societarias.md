# Levantamento de fontes — Identificação de pessoas e estruturas societárias (recuperacao-ativos)
> Rascunho gerado a partir das respostas ASD — requer validação e complementação com pesquisa de metadados reais.

## Atores considerados

**Critério de seleção:** foram incluídos apenas os atores citados nas respostas ASD (sobretudo G1 e G2, complementados por F1/F3 e por menções em B/C/D) que (a) produzem, custodiam ou consomem dados de **identificação de pessoa física/jurídica**, **qualificação** da pessoa, **vínculos societários, de controle, de parentesco ou de representação**, ou (b) mantêm **listas que qualificam a pessoa** (sanções, restrições). Atores cujo papel, nas respostas, se limita a bens, medidas processuais, destinação ou gestão física foram deixados fora desta categoria, ainda que apareçam no domínio.

Observação de proveniência: apenas uma resposta é de respondente humano (Analista de busca patrimonial — órgão central); as demais são agentes sintéticos (evidência de terceira classe). Os itens abaixo herdam essa gradação e todos precisam de validação.

### Custodiantes/produtores de dado cadastral e societário
- **Receita Federal do Brasil** — cadastro de pessoas físicas (CPF), cadastro de pessoas jurídicas (CNPJ), dados de renda/declaração. Citada em G1 (humano e sintético), F1, F3 e D2.
- **Juntas comerciais** — documentos societários arquivados, quadro societário. Citadas em G1, F1 (via ofício, não integradas), F3 (documentos arquivados de junta comercial; "juntas comerciais/CNPJ integrados").
- **Registro civil (cartórios de registro civil)** — parentesco e **regime de bens**. Citado em G1 e F3 (humano).
- **Tabelionatos de notas / CENSEC** — escrituras e **procurações** (vínculo de representação). Citados em G1 e F3.
- **Cartórios de registro de imóveis** — citados aqui apenas como fonte secundária de qualificação da pessoa nos atos registrais (partes do ato, titular anterior); o dado do bem em si pertence a outra categoria.

### Órgãos do ciclo de recuperação de ativos que consomem/produzem vínculos
- **Órgão central** — autoridade central brasileira; área de busca patrimonial (dossiês, bases próprias, planilhas) e área de cooperação jurídica internacional (sistema de tramitação).
- **Área de TI/dados e automação (RPA) do ministério** — pipeline de parsing/extração de dados de pessoa física e jurídica de documentos de cooperação; entity resolution.
- **Ministério Público e Judiciário (varas criminais federais/estaduais, juízos de execução)** — autos digitais contendo relatórios com vínculos societários e familiares em texto livre.
- **Polícia (investigação patrimonial)** — rastreamento patrimonial e identificação de interpostas pessoas.
- **Unidade de inteligência financeira brasileira (COAF)** — relatórios de inteligência financeira com vínculos societários/patrimoniais em prosa; SIMBA citado em F3.
- **Órgãos de controle externo/auditoria** — consumo indireto (revisão de consistência).
- **Defesa técnica/terceiros interessados** — produzem alegações sobre titularidade e parentesco no processo (qualificação contestada).

### Atores estrangeiros e transnacionais (G2)
- **Registros estrangeiros de beneficiário final** — ex.: **UK Companies House** (citado nominalmente em D2), registros de jurisdições de paraíso fiscal.
- **Autoridades centrais estrangeiras** — respostas a pedidos de cooperação (MLAT/auxílio direto) com dados societários e de titularidade.
- **FIUs estrangeiras via rede Egmont Group**.
- **Emissores de listas restritivas** — **OFAC** e **listas de sanções da ONU** (D2).
- **Exchanges de criptomoedas nacionais e internacionais** — dados KYC de identificação de titular (F3/D2).
- **Redes de cooperação** (CARIN, ARINSA, RRAG) e marcos normativos (UNCAC, Convenção de Palermo, Convenção Interamericana contra a Corrupção, MLATs bilaterais, CRS/FATCA) — não são bases de dados de identificação, mas condicionam acesso e uso; registrados como contexto.

## Sistemas e bases por ator

### Receita Federal do Brasil
- **Cadastro de pessoas físicas (CPF)** — usado como chave primária de consulta ("puxar/bater CPF"). Atributos mencionados nas respostas: número do CPF; nome; indícios de uso de **data de nascimento** e **município** como critérios auxiliares de amarração de identidade quando não há documento. Problemas relatados: homônimos, grafia divergente de nomes, duplicidade documental, endereço declarado desatualizado/sujo. Nome oficial do sistema de consulta, estrutura de campos e níveis de acesso: [requer pesquisa adicional].
- **Cadastro de pessoas jurídicas (CNPJ)** — usado como chave de consulta societária ("bater CNPJ", "subir a cadeia"). Atributos mencionados: quadro de sócios, **percentual de participação**, **período de entrada/saída** de sócio, **data de constituição** da empresa (usada para janela temporal: "empresas abertas nesse período com esse grupo de pessoas dentro"), endereço da empresa. Campo de **beneficiário efetivo declarado** citado em B2 (humano) como existente no sentido cadastral, porém "pouco confiável". Layout real dos campos e disponibilidade histórica: [requer pesquisa adicional].
- **Base de renda/declaração (Imposto de Renda / declaração de patrimônio)** — citada em D2 e F3 como insumo para avaliar **incompatibilidade entre renda declarada e patrimônio**. Acesso descrito como "o mais fechado" dos regimes de sigilo. Campos concretos: [requer pesquisa adicional].

### Juntas comerciais
- **Documentos societários arquivados** (contrato social e alterações) — citados em F3 (humano) e F1/F3 (sintéticos), hoje acessados **via ofício, não integrados**. Atributos mencionados: composição societária, percentual, período de entrada/saída, capital integralizado (inclusive **capital integralizado em imóveis**, no caso de holding familiar). Identificador da empresa na junta (NIRE) e demais metadados: [requer pesquisa adicional].

### Registro civil
- **Registros de nascimento/casamento** — citados em F3 (humano) como base desejada, com menção explícita ao **regime de bens** e à necessidade de vincular pessoas a parentes (D1). Atributos: vínculo de parentesco (mencionado "parente de primeiro grau", "diferentes graus de parentesco", cônjuge/ex-cônjuge), regime de bens. Estrutura, cobertura nacional e via de acesso: [requer pesquisa adicional].

### Tabelionatos de notas / CENSEC
- **CENSEC (Central Notarial de Serviços Eletrônicos Compartilhados)** — citada em F3 (humano) como base externa que agregaria valor, abrangendo **tabelionatos, escrituras e procurações**. Relevância para esta categoria: **procuração** como instrumento de representação/controle (caso ASD menciona "empresa controlada por procuração"). Campos, abrangência temporal e nível de acesso: [requer pesquisa adicional].

### Órgão central — área de busca patrimonial
- **Bases próprias da equipe / planilhas / pastas de dossiê** (descritas como "artesanal") — armazenam alvo, título que fundamenta a busca, resultado, **grau de confiança** (classificação: confirmado/provável/hipótese), pendências. Registro de vínculos e do "porquê" do vínculo existe apenas em texto livre. Sem esquema formal conhecido: [requer pesquisa adicional].
- **Knowledge graph da equipe de pesquisa/inteligência** (D3, respondente humano) — armazena entidades, propriedades e vínculos extraídos de documentos por NER e LLMs. Esquema, ontologia atual e critérios de extração: [requer pesquisa adicional].

### Órgão central — área de cooperação jurídica internacional
- **Sistema interno de tramitação de pedidos de cooperação** (nome não confirmado pelos respondentes) — contém, entre os campos de parsing citados em B1 (TI): **dados de pessoa física/jurídica envolvida** (marcados como sensíveis), autoridade requerente/central, país, número do processo/referência. Problemas relatados: duplicidade de registro de pessoa por grafias variantes, ausência de identificador único robusto, falta de padronização de nome de pessoa/empresa entre casos. Esquema real de campos: [requer pesquisa adicional].
- **Caixa de e-mail institucional, controles paralelos em planilha** — fonte "semi-oficial" onde ficam dados de identificação e vínculos não lançados no sistema formal.

### Ministério — TI/dados e automação (RPA)
- **Pipeline de extração/parsing de documentos** — vínculos reconstruídos citados em C3: pessoa ↔ pessoa (ex.: **representante legal de empresa**), ativo/bem ↔ pessoa (motivo do vínculo em texto livre, "ponto mais difícil do parsing"). Anexos societários chegam junto a pedidos envolvendo pessoa jurídica ("mais anexos — documentos societários"). Flags de **baixa confiança** por ambiguidade de nome. Implementação técnica, formatos e taxas de acerto: [requer pesquisa adicional].

### Judiciário / Ministério Público
- **Sistema de processo eletrônico da Justiça Federal (autos digitais)** e **sistemas internos do MP** — contêm qualificação das partes e vínculos societários/familiares descritos em prosa (B5: "vínculos societários e patrimoniais entre pessoas físicas/jurídicas só em prosa de relatórios, sem formato de grafo"). Campos estruturados de qualificação da parte: [requer pesquisa adicional].

### COAF / unidade de inteligência financeira
- **Relatórios de inteligência financeira** — recebidos já processados, anexados aos autos; contêm vínculos societários e patrimoniais em texto livre. **SIMBA** citado em F3 como base desejada (dados bancários e movimentação financeira) — pertinente a esta categoria apenas na medida em que identifica titulares. Metadados: [requer pesquisa adicional].

### Registros estrangeiros de beneficiário final
- **UK Companies House** — citada nominalmente em D2 (respondente humano) como registro de beneficiário final estrangeiro a ser cruzado. Campos, API, cobertura: [requer pesquisa adicional].
- **Registros de beneficiário final de jurisdições de paraíso fiscal** — citados genericamente. Identificação das jurisdições e bases específicas: [requer pesquisa adicional].

### Listas restritivas / sanções
- **Cadastros de sanções OFAC** e **listas da ONU** — citados em D2 como fontes a cruzar. Nenhum campo concreto foi mencionado pelos respondentes. Estrutura dos registros (nome, aliases, data de nascimento, documento, programa de sanção, data de inclusão): [requer pesquisa adicional].
- **PEP (pessoa exposta politicamente)** — citada em B3 (humano) como "sinalizador de atenção, não categoria própria"; não foi apontada base específica: [requer pesquisa adicional].

### Redes e canais de cooperação
- **Rede Egmont Group (FIUs estrangeiras)**, **CARIN, ARINSA, RRAG**, **respostas de autoridades centrais estrangeiras (MLAT/auxílio direto)**, **troca automática de informações fiscais (CRS/FATCA)** — não descritos como bases consultáveis; funcionam como canais que devolvem dados de identificação/titularidade em documentos. Um respondente registra que não existe interoperabilidade ou portal comum de status. Conteúdo, formato e condições de uso (princípio da especialidade): [requer pesquisa adicional].

### Exchanges de criptomoedas (nacionais e internacionais)
- **Dados KYC** — citados em D2/F3 como fonte de identificação de titular em outras jurisdições. Campos KYC e via de obtenção: [requer pesquisa adicional].

## Sistemas e propriedades identificados

| Sistema/base | Ator(es) | Propriedades conhecidas | Lacunas |
|---|---|---|---|
| Cadastro de pessoas físicas (CPF) | Receita Federal | Número do CPF (chave de consulta, "puxar/bater CPF"); nome; data de nascimento e município citados como critérios auxiliares de amarração de identidade; endereço declarado; renda declarada associada (base restrita) | Nome oficial do sistema de consulta, layout de campos, tipos e formatos, disponibilidade de histórico, níveis de acesso e base legal de acesso [requer pesquisa adicional]; tratamento de homônimos e duplicidade documental não documentado |
| Cadastro de pessoas jurídicas (CNPJ) | Receita Federal | Número do CNPJ (chave de consulta); quadro de sócios; percentual de participação; período de entrada/saída de sócio; data de constituição; endereço da empresa; campo de beneficiário efetivo declarado (citado como existente mas "pouco confiável") | Layout real dos campos, tipagem, existência de série histórica de alterações societárias, profundidade de encadeamento (cadeia em níveis), regras do campo de beneficiário final [requer pesquisa adicional] |
| Base de renda/declaração (IR, patrimônio declarado) | Receita Federal | Renda declarada (usada para teste de incompatibilidade renda × patrimônio); patrimônio declarado; existência de declarações retificadoras citada como padrão de manipulação | Campos concretos, granularidade, janela temporal, regime de sigilo fiscal aplicável (LC 105) e condições de acesso [requer pesquisa adicional] |
| Documentos societários arquivados (contrato social e alterações) | Juntas comerciais | Composição societária; percentual; período de entrada/saída; capital social e forma de integralização (inclusive integralização em imóveis); acesso atual por ofício, não integrado | Identificador da empresa na junta (NIRE) e demais metadados, formato de entrega (imagem/PDF vs. estruturado), cobertura por UF, ausência de integração nacional [requer pesquisa adicional] |
| Registros de registro civil (nascimento/casamento) | Cartórios de registro civil | Vínculo de parentesco (grau; primeiro grau, cônjuge, ex-cônjuge citados); regime de bens | Estrutura de campos, existência de base nacional consultável, cobertura, via e nível de acesso [requer pesquisa adicional] |
| CENSEC (tabelionatos, escrituras, procurações) | Tabelionatos de notas | Existência de escrituras e **procurações** vinculadas a pessoa (representação/controle, inclusive "empresa controlada por procuração") | Campos disponíveis, se retorna apenas indicação de existência ou conteúdo do ato, abrangência temporal, nível de acesso [requer pesquisa adicional] |
| Bases próprias / planilhas / dossiês da busca patrimonial | Órgão central (busca patrimonial) | Alvo (PF ou PJ); título que fundamenta a busca; grau de confiança (confirmado/provável/hipótese); data de corte da consulta; base consultada; pendências; registro do vínculo e do "porquê" (hoje só em texto livre) | Sem esquema formal; negativa de consulta, hipótese descartada e grau de certeza da amarração de identidade não são estruturados; nada retroalimenta sistema pesquisável [requer pesquisa adicional] |
| Knowledge graph de entidades e vínculos (extração por NER/LLM) | Órgão central (pesquisa/inteligência, projeto com universidade) | Entidades (pessoas, empresas), propriedades e vínculos extraídos de documentos de texto, imagem e tabelas | Esquema/ontologia atual, vocabulário de tipos de vínculo, proveniência e confiança por aresta, volume e cobertura [requer pesquisa adicional] |
| Sistema interno de tramitação de pedidos de cooperação | Órgão central (cooperação internacional) | Dados de pessoa física/jurídica envolvida (campo citado como sensível); número do processo/referência; país; autoridade requerente/central | Nome oficial do sistema não confirmado pelos respondentes; esquema de campos de qualificação da pessoa; ausência de identificador único robusto; grafias variantes gerando duplicidade [requer pesquisa adicional] |
| Pipeline de parsing/RPA de documentos de cooperação | Ministério — TI/dados e automação | Extração de pessoa/empresa a partir de texto livre; vínculo pessoa ↔ pessoa (ex.: representante legal); anexos societários em pedidos com PJ; flag de baixa confiança por ambiguidade de nome; ambiguidade de formato de data tratada como flag | Tecnologia, regras de extração, taxa de acerto, ausência de campo estruturado para "motivo do vínculo", ausência de entity resolution robusta [requer pesquisa adicional] |
| Processo eletrônico (Justiça Federal) e sistemas internos do MP | Judiciário, Ministério Público | Qualificação das partes no processo; vínculos societários e familiares descritos em prosa nos relatórios anexados | Campos estruturados de qualificação; ausência de identificador único e persistente de pessoa entre processos/varas; segredo de justiça e segmentação de acesso [requer pesquisa adicional] |
| Relatórios de inteligência financeira / SIMBA | COAF / unidade de inteligência financeira | Vínculos societários e patrimoniais descritos em texto livre; identificação de titulares de movimentação | Formato de entrega, campos estruturados, nível de acesso (sigilo bancário), relação entre relatório e base SIMBA [requer pesquisa adicional] |
| UK Companies House | Registro societário do Reino Unido | Citado como registro de **beneficiário final** estrangeiro a ser cruzado | Nenhum campo mencionado pelos respondentes: estrutura de registro, identificador de empresa, campos de PSC/beneficiário final, API e licença de uso [requer pesquisa adicional] |
| Registros de beneficiário final de jurisdições estrangeiras / paraísos fiscais | Autoridades estrangeiras | Citados genericamente como fonte de beneficiário final e de estruturas offshore/trusts | Jurisdições específicas, bases nomeadas, campos, publicidade vs. acesso por cooperação [requer pesquisa adicional] |
| Cadastro de sanções OFAC | OFAC (EUA) | Citado como cadastro de sanções a cruzar para qualificar a pessoa | Nenhuma propriedade mencionada: nome, aliases, documentos, data de nascimento, programa, data de inclusão, formato de distribuição [requer pesquisa adicional] |
| Listas de sanções da ONU | Organização das Nações Unidas | Citadas como listas restritivas a cruzar | Nenhuma propriedade mencionada: comitês/regimes, campos do registro, formato e periodicidade [requer pesquisa adicional] |
| Canais de cooperação (Egmont, CARIN, ARINSA, RRAG, MLAT/auxílio direto, CRS/FATCA) | FIUs estrangeiras, autoridades centrais estrangeiras, redes de recuperação de ativos | Devolvem dados de identificação/titularidade em documentos; não há interoperabilidade nem portal comum de status; uso limitado pelo princípio da especialidade | Não são bases consultáveis descritas; conteúdo, formato, latência, condições de uso e confidencialidade por tratado [requer pesquisa adicional] |
| Dados KYC de exchanges de criptomoedas (nacionais e internacionais) | Exchanges / provedores de ativos virtuais | Citados como fonte de identificação de titular em outras jurisdições | Campos KYC, forma de obtenção (ofício, cooperação), jurisdição aplicável [requer pesquisa adicional] |

**Lacunas transversais desta categoria (registradas nas respostas, não resolvidas):** ausência de identificador único e persistente de pessoa/empresa entre sistemas, processos e jurisdições (citada por múltiplos respondentes, inclusive como "de-para" internacional utópico); falta de padronização de grafia de nomes entre casos e entre idiomas/traduções; inexistência de campo estruturado para **titular formal × titular de fato / sócio oculto / beneficiário efetivo apurado** (distinto do declarado); ausência de estrutura para **cadeias de interposição com múltiplos elos** (hoje só vínculos binários ou prosa); ausência de registro estruturado do **grau de confiança/status probatório** de cada vínculo; ausência de registro de **negativa de consulta**, **data de corte** e **hipótese descartada**; parentesco por afinidade não declarado nas bases. Metadados reais (nomes oficiais de sistema, dicionários de dados, formatos, chaves, níveis de acesso) de praticamente todas as bases acima: [requer pesquisa adicional].
