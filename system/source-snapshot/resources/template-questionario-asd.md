# Template — Questionário ASD (adapte ao domínio)

Instrumento de coleta da subfase Application Field and Scope Definition (ASD). Gere o questionário do domínio substituindo `<domínio>`/`<fenômeno>` e adaptando os exemplos entre parênteses à realidade do pedido — os exemplos abaixo são ilustrativos e devem ser trocados por termos do domínio em estudo. Mantenha os códigos das perguntas (A1, B2…): eles permitem consolidar respostas de vários participantes.

Salve o questionário gerado em `trabalho/ontologia/<dominio>/especificacao/00-questionario-asd.md` e cada resposta em `trabalho/ontologia/<dominio>/especificacao/respostas-asd/<respondente-ou-perfil>.md`.

---

## Texto de apresentação (copiar no corpo do e-mail ou no topo do formulário)

> Estamos construindo um **modelo semântico (ontologia) de <domínio>** — um mapa formal dos conceitos, termos e relações desse campo. Esse mapa será a base para que sistemas entendam e integrem os dados do domínio com precisão e consistência.
>
> Sua experiência prática é o insumo mais importante desta etapa. Não existem respostas certas ou erradas; queremos capturar como o domínio funciona **na realidade do seu trabalho**.
>
> **Instruções:**
> - Tempo estimado: 30–40 minutos.
> - Responda em texto livre, na frente de cada pergunta, mantendo o código da pergunta (ex.: B1, C2).
> - Pode pular perguntas fora da sua área ("não se aplica") ou responder "não sei".
> - **Se tiver pouco tempo, priorize as seções B, C e D** — são o núcleo.
> - **Não inclua dados reais identificados** (nomes, documentos, identificadores). Exemplos devem ser descaracterizados.
> - Prazo para devolução: ___/___/______.

## Seção A — Perfil do respondente

- **A1.** Unidade/organização de lotação e função atual.
- **A2.** Há quanto tempo trabalha com <domínio>?
- **A3.** Qual a sua relação principal com esses dados? (produção/registro, análise, planejamento, gestão, tecnologia)

## Seção B — Domínio, conceitos e terminologia (núcleo)

- **B1.** Na sua rotina, quais são os **conceitos centrais** de <domínio>? Liste os 5 a 10 mais importantes e defina cada um **com suas palavras, em uma frase**.
- **B2.** Que termos do dia a dia têm **mais de um significado** ou são usados de forma diferente entre unidades/regiões/organizações?
- **B3.** Que **sinônimos ou jargões** são comuns para os mesmos conceitos? (ajuda o sistema a entender perguntas em linguagem natural)
- **B4.** O que, na sua opinião, **não deveria entrar** no escopo deste modelo nesta fase?
- **B5.** Existe algum conceito importante que **os sistemas atuais não registram bem** ou que só existe em texto livre?

## Seção C — Comportamentos e padrões do fenômeno (núcleo)

Objetivo: montar a tabela de comportamentos que a ontologia precisa representar (padrão da Table 6.1 da tese).

- **C1.** Descreva os **padrões recorrentes** que você observa em <fenômeno>. Liste quantos quiser, um por linha.
- **C2.** Existem tentativas de **ocultar, dissimular ou distorcer** informação no domínio? Como acontecem?
- **C3.** Quais **vínculos** entre as entidades do domínio (pessoas, organizações, objetos, locais, eventos) são mais relevantes para a análise?
- **C4.** Descreva 1 ou 2 **casos reais descaracterizados** que um bom sistema deveria conseguir representar do início ao fim.

## Seção D — Perguntas que você gostaria de fazer aos dados (núcleo)

Estas perguntas serão a régua de aceitação do modelo (perguntas de competência).

- **D1.** Liste **5 a 10 perguntas, em linguagem corrente**, que você faria aos dados se a resposta fosse imediata. Inclua perguntas hoje demoradas ou impossíveis.
- **D2.** Quais dessas perguntas exigem **cruzar informações** (entidades distintas, fontes distintas, períodos distintos)?
- **D3.** Para cada pergunta do item D1, que **forma de resposta** você espera? (número, tabela, série temporal, mapa, rede de vínculos, lista)

## Seção E — Usuários e uso

- **E1.** Além de você, **quem** deveria usar essas respostas e **em que situação**?
- **E2.** Que **decisão concreta** a resposta apoia no seu caso? Qual a urgência típica (minutos, horas, dias)?

## Seção F — Dados, sistemas e lacunas

- **F1.** Que **sistemas ou bases** você consulta hoje para responder às perguntas da Seção D? (internos e externos)
- **F2.** Onde estão as principais **lacunas ou problemas de qualidade**? (campos não preenchidos, informação só em texto livre, unidades inconsistentes, duplicidades)
- **F3.** Que **bases externas** (outras organizações, estados, países) agregariam mais valor se integradas no futuro? Quem é o "dono" de cada uma?

## Seção G — Atores e jurisdições

- **G1.** Quais **organizações e atores** participam do ciclo de vida da informação no domínio?
- **G2.** Há aspectos **interorganizacionais, interestaduais ou transnacionais** que o modelo precisa representar?

## Seção H — Restrições e critério de sucesso

- **H1.** Que **restrições legais e de sigilo** a modelagem deve respeitar na sua visão? (ex.: LGPD, sigilos setoriais)
- **H2.** Complete: *"Para mim, esse modelo terá funcionado quando ________."*
- **H3.** Que **riscos ou preocupações** você enxerga nesta iniciativa?

---

## Após a coleta (uso interno — não enviar)

1. Salvar cada resposta em `respostas-asd/`, mantendo os códigos das perguntas.
2. Compilar em `01-escopo-e-requisitos.md`: respostas B geram glossário e escopo; C gera a tabela de comportamentos; D gera os requisitos verificáveis/perguntas de competência; E consolida usuários-alvo; F e G semeiam as subfases DCI e DKC; H entra como restrições e critérios de aceitação.
3. Documentos de negócio pré-existentes (demanda analítica, requisitos, normativos) também são insumo do ASD — anexar cópia em `respostas-asd/` para entrar na compilação.
