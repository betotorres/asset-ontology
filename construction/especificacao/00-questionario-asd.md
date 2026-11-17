# Questionário ASD — recuperacao-ativos

Instrumento de coleta da subfase Application Field and Scope Definition (ASD) do domínio **recuperação de ativos de origem ilícita e cooperação jurídica internacional (órgão central)**.

Salvar este questionário em `trabalho/ontologia/recuperacao-ativos/especificacao/00-questionario-asd.md` e cada resposta em `trabalho/ontologia/recuperacao-ativos/especificacao/respostas-asd/<respondente-ou-perfil>.md`.

---

## Texto de apresentação (copiar no corpo do e-mail ou no topo do formulário)

> Estamos construindo um **modelo semântico (ontologia) de recuperação de ativos** — um mapa formal dos conceitos, termos e relações desse campo: ativos passíveis de constrição e perdimento, pessoas condenadas e seus interpostos, decisões judiciais, bases consultadas, pedidos de cooperação jurídica internacional e destinação de bens à União. Esse mapa será a base para que sistemas entendam e integrem os dados do domínio com precisão e consistência, inclusive para apoiar a geração automatizada (RPA) de documentos do fluxo internacional.
>
> Sua experiência prática é o insumo mais importante desta etapa. Não existem respostas certas ou erradas; queremos capturar como o domínio funciona **na realidade do seu trabalho**.
>
> **Instruções:**
> - Tempo estimado: 30–40 minutos.
> - Responda em texto livre, na frente de cada pergunta, mantendo o código da pergunta (ex.: B1, C2).
> - Pode pular perguntas fora da sua área ("não se aplica") ou responder "não sei".
> - **Se tiver pouco tempo, priorize as seções B, C e D** — são o núcleo.
> - **Não inclua dados reais identificados** (nomes de investigados ou condenados, números de processo, CPF/CNPJ, matrículas de imóveis, números de conta). Exemplos devem ser descaracterizados.
> - Prazo para devolução: ___/___/______.

## Seção A — Perfil do respondente

- **A1.** Unidade/organização de lotação e função atual.
- **A2.** Há quanto tempo trabalha com recuperação de ativos e/ou cooperação jurídica internacional em matéria patrimonial?
- **A3.** Qual a sua relação principal com esses dados? (produção/registro, análise, planejamento, gestão, tecnologia)

## Seção B — Domínio, conceitos e terminologia (núcleo)

- **B1.** Na sua rotina, quais são os **conceitos centrais** de recuperação de ativos? Liste os 5 a 10 mais importantes e defina cada um **com suas palavras, em uma frase**. (ex.: ativo, bem imóvel, titularidade, beneficiário final, medida assecuratória, perdimento, repatriação, destinação, pedido de cooperação, autoridade central)
- **B2.** Que termos do dia a dia têm **mais de um significado** ou são usados de forma diferente entre unidades, órgãos ou jurisdições? (ex.: "bloqueio", "sequestro", "arresto", "indisponibilidade", "confisco" vs. "perdimento", "congelamento" vs. "freezing")
- **B3.** Que **sinônimos ou jargões** são comuns para os mesmos conceitos? (ajuda o sistema a entender perguntas em linguagem natural; ex.: "laranja"/"interposta pessoa", "MLAT"/"acordo de assistência", "auxílio direto"/"rogatória", "busca patrimonial"/"rastreamento de ativos")
- **B4.** O que, na sua opinião, **não deveria entrar** no escopo deste modelo nesta fase? (ex.: tipificação penal, produção de prova na investigação, gestão física e leilão do bem após o perdimento, cooperação não patrimonial como extradição e transferência de presos)
- **B5.** Existe algum conceito importante que **os sistemas atuais não registram bem** ou que só existe em texto livre dos autos, ofícios e despachos? (ex.: cadeia de titularidade dissimulada, valor atualizado do bem, vínculo entre ativo e condenação específica)

## Seção C — Comportamentos e padrões do fenômeno (núcleo)

Objetivo: montar a tabela de comportamentos que a ontologia precisa representar.

- **C1.** Descreva os **padrões recorrentes** que você observa na ocultação e na recuperação de ativos. Liste quantos quiser, um por linha. (ex.: aquisição em nome de terceiros, uso de empresas de fachada, imóvel não registrado/contrato de gaveta, transferência para o exterior, superfaturamento de operação imobiliária)
- **C2.** Existem tentativas de **ocultar, dissimular ou distorcer** informação no domínio? Como acontecem? (ex.: interpostas pessoas e familiares, trusts e estruturas offshore, doações simuladas, fracionamento de valores, blindagem patrimonial, alienação a terceiro de "boa-fé" após a condenação)
- **C3.** Quais **vínculos** entre as entidades do domínio são mais relevantes para a análise? (ex.: condenado ↔ ativo, condenado ↔ interposta pessoa, ativo ↔ matrícula/registro, ativo ↔ jurisdição estrangeira, processo ↔ decisão ↔ medida, pedido de cooperação ↔ Estado requerido)
- **C4.** Descreva 1 ou 2 **casos reais descaracterizados** que um bom sistema deveria conseguir representar do início ao fim — da leitura da condenação à identificação do ativo, ao pedido de cooperação (se houver) e à destinação à União.

## Seção D — Perguntas que você gostaria de fazer aos dados (núcleo)

Estas perguntas serão a régua de aceitação do modelo (perguntas de competência).

- **D1.** Liste **5 a 10 perguntas, em linguagem corrente**, que você faria aos dados se a resposta fosse imediata. Inclua perguntas hoje demoradas ou impossíveis. (ex.: "quais condenados com perdimento decretado possuem imóveis acima de X sem constrição registrada?"; "quais ativos identificados estão em país com tratado vigente?")
- **D2.** Quais dessas perguntas exigem **cruzar informações** (entidades distintas, fontes distintas, jurisdições distintas, períodos distintos)?
- **D3.** Para cada pergunta do item D1, que **forma de resposta** você espera? (número, tabela, série temporal, mapa, rede de vínculos, lista, minuta de documento)

## Seção E — Usuários e uso

- **E1.** Além de você, **quem** deveria usar essas respostas e **em que situação**? (ex.: coordenação do órgão central, área de cooperação internacional, órgãos parceiros, autoridade central estrangeira)
- **E2.** Que **decisão concreta** a resposta apoia no seu caso? (ex.: priorizar um caso, pedir medida assecuratória, instruir pedido de auxílio direto, propor destinação) Qual a urgência típica (minutos, horas, dias)?

## Seção F — Dados, sistemas e lacunas

- **F1.** Que **sistemas ou bases** você consulta hoje para responder às perguntas da Seção D? (internos e externos; ex.: autos digitais do Judiciário, sistemas de registro de imóveis, cadastros de pessoas e empresas, bases patrimoniais, planilhas e controles próprios do departamento, ofícios e e-mails)
- **F2.** Onde estão as principais **lacunas ou problemas de qualidade**? (campos não preenchidos, informação só em texto livre, valores desatualizados, unidades inconsistentes, duplicidade de pessoas e de bens, ausência de identificador único do ativo)
- **F3.** Que **bases externas** (outros órgãos, estados, países) agregariam mais valor se integradas no futuro? Quem é o "dono" de cada uma, e qual o nível de acesso hoje (convênio, consulta direta, ofício, inexistente)?

## Seção G — Atores e jurisdições

- **G1.** Quais **organizações e atores** participam do ciclo de vida da informação no domínio — de quem **produz ou custodia** o dado a quem **recebe ou executa** a decisão? Indique o papel de cada um.
- **G2.** Há aspectos **interorganizacionais, interestaduais ou transnacionais** que o modelo precisa representar? (ex.: tratados e acordos bilaterais, autoridades centrais, redes de cooperação, repartição de ativos entre Estados, requisitos formais do Estado requerido, tradução e legalização de documentos)

## Seção H — Restrições e critério de sucesso

- **H1.** Que **restrições legais e de sigilo** a modelagem deve respeitar na sua visão? (ex.: LGPD, sigilo fiscal, bancário e telemático, sigilo processual, restrições de uso previstas em tratado e princípio da especialidade, classificação de informação)
- **H2.** Complete: *"Para mim, esse modelo terá funcionado quando ________."*
- **H3.** Que **riscos ou preocupações** você enxerga nesta iniciativa? (ex.: erro de identificação de titularidade, uso indevido de dado sigiloso, dependência de automação na produção de documentos oficiais, desatualização das bases)
