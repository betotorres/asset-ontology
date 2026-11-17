# Entrevista de escopo — recuperacao-ativos

> **Proveniência:** entrevista conduzida em 2026-09-11T19:29:21.511Z · entrevistador `claude-opus-5` via `anthropic`
**Administrador:** É o dominio do órgão central do ministerio do brasil. Eles analisam processos criminais, consultam bases variadas, para identificar imóveis, ocultados ou não, pertencentes a crimimosos condenadas, para recuperação e pedimento desses bens para a união (governo brasileiro). Essa ontologia também deve abarcar possíveis interações com entes internacionais em tratadas de recuperação de ativos ocultados em outros países.

**Entrevistador:** Perfeito, obrigado pelo enquadramento inicial. Vou fazer as perguntas uma a uma para delimitar bem o escopo antes de gerar o questionário.

**1.** Você mencionou que o fenômeno central é a identificação de imóveis — ocultados ou não — pertencentes a condenados, para fins de recuperação e destinação à União. Quando vocês falam de "recuperação de ativos" no órgão central, o recorte desta ontologia é **exclusivamente bens imóveis**, ou ela precisa acomodar também outras classes de ativos (veículos, participações societárias, valores em conta, criptoativos, obras de arte)? E o fenômeno começa a partir da condenação definitiva, ou também abrange fases anteriores (investigação, medidas assecuratórias, bloqueio cautelar)?

**Administrador:** Inicialmente eles pensaram em imóveis de alto custo, mas quero ja deixar envolvendo qualquer tipo de ativo.

**Entrevistador:** Entendido — modelagem aberta a qualquer classe de ativo, com o piloto/prioridade em imóveis de alto valor.

**2.** Sobre o ciclo de vida da informação: além do próprio órgão central, quais organizações e atores participam efetivamente desse fluxo — de um lado os que **produzem ou custodiam** a informação (Poder Judiciário, Ministério Público, Polícia Federal, Receita Federal, COAF, cartórios de registro de imóveis, juntas comerciais, DENATRAN, Banco Central), e de outro os que **recebem ou executam** a decisão (AGU/PGFN, SPU, autoridades centrais estrangeiras, entidades de destinação de bens)? Quais desses são de fato interlocutores do órgão central hoje e em que papel?

**Administrador:** O órgão central é quem vai operar esse domínio. Ele pode ate solicitar dados de bases de terceiros, mas não sabemos ainda em que nível de interação. Eles tb querem gerar documentos via RPA para fluxo de recuperar do ativo com entes internacionais

**Entrevistador:** Certo — órgão central como operador central, com interações externas ainda indefinidas em nível de acesso, e uma frente de geração automatizada (RPA) de documentos para o fluxo internacional.

**3.** Sobre os sistemas e bases que existem **hoje** no órgão central: que ferramentas eles usam atualmente para registrar e acompanhar esses casos? Existe algum sistema próprio de gestão de pedidos de cooperação jurídica internacional, planilhas, repositórios de processos, ou tudo é feito sobre os autos digitais do Judiciário e documentos soltos? E as consultas a bases externas hoje são feitas por convênio/sistema (tipo SIMBA, CNIB, INFOJUD, SNIPER) ou por ofício em papel/e-mail?

**Administrador:** Desconheço sistema próprio de gestão de pedidos de cooperação jurídica. Sei que eles trabalham em cima dos processos judiciais. Mas o que pode ajudar tb a definir os conceitos é a legislação brasileira e internacional sobre isso.

**Entrevistador:** Ótimo — a legislação (nacional e tratados) entra como fonte normativa para ancorar os conceitos.

**4.** Sobre isso: você consegue indicar quais instrumentos normativos devem ser tratados como fonte prioritária de terminologia? Estou pensando em coisas como o Código Penal (perdimento, art. 91/91-A), CPP (medidas assecuratórias), Lei 9.613/98 (lavagem), Lei 13.886/2019, Lei de Drogas (11.343 e o FUNAD), Lei 13.260, Decreto 9.662/2019 (estrutura do ministério), além de UNTOC/Palermo, UNCAC/Mérida, Convenção de Viena e acordos bilaterais de MLAT. Quais desses o órgão central efetivamente usa como base, e há alguma norma interna ou portaria do departamento que defina os fluxos?

**Administrador:** Tem a lei Raul Jungman. EU não tenho certeza de quais outras, mas pode utilizar as que achar que são relevantes para o domínio.

**Entrevistador:** Anotado — a Lei Raul Jungmann como referência citada, e as demais normas a serem confirmadas pelos respondentes (não vou afirmar nada que não tenha sido validado por eles).

**5.** Sobre os respondentes: quais **perfis profissionais** deveriam responder a este questionário para cobrir o domínio? Ou seja, quem no órgão central (ou próximo dele) tem o conhecimento prático — analistas que fazem a busca patrimonial e a leitura dos autos, o pessoal da cooperação jurídica internacional que redige os pedidos, a área jurídica que interpreta perdimento e destinação, o pessoal de TI/dados que conhece as bases, gestores? Há algum perfil externo (juiz, procurador, autoridade central estrangeira) que você considera essencial ouvir nesta fase?

**Administrador:** Quero que sugira possíveis perfis.

**Entrevistador:** Posso sugerir. Perfis que me parecem candidatos naturais para cobrir o domínio — e que vou propor na tabela final, se você concordar:

- **Analista de busca patrimonial / rastreamento de ativos (órgão central)** — lê os autos, cruza bases, identifica bens.
- **Analista de cooperação jurídica internacional (órgão central)** — redige e acompanha pedidos de auxílio direto e cartas rogatórias, conhece tratados e autoridades centrais.
- **Assessor jurídico / especialista em perdimento e destinação** — interpreta condenação, perdimento, alienação antecipada, destinação à União.
- **Gestor/coordenação do órgão central** — visão de fluxo, prioridades, indicadores, decisões de caso.
- **Analista de TI/dados ou automação (RPA)** — conhece integrações, formatos de documento, limites técnicos de acesso a bases.
- **Perfil externo eventual** — membro do MP ou magistrado com atuação em ações de perdimento, para validar a fronteira processual.

**6.** Dito isso: o que você quer deixar **explicitamente fora** do escopo nesta primeira iteração? Por exemplo — a fase de investigação criminal e produção de prova, a tipificação penal em si, a gestão física/administrativa dos bens após o perdimento (leilão, conservação, alienação), cooperação em matéria não patrimonial (extradição, transferência de presos), ou pessoas jurídicas/ativos sem vínculo com condenação. O que você já sabe que não deve ser modelado agora?

**Administrador:** Já temos contexto suficiente. Encerre agora e produza o bloco ESCOPO.
