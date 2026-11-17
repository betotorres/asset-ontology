# Tempos das entrevistas ASD — recuperacao-ativos (banco `data/entrevistador.db`, 2026-10-06)

Fonte: tabelas `sessoes` × `convites` × `mensagens` (consulta em 2026-10-06). Duração = `criada_em`
da sessão → `concluido_em` do convite. Mensagens = turnos de entrevistador + respondente.

| Perfil | Origem | Início (UTC) | Duração | Mensagens |
|---|---|---|---|---|
| Analista de busca patrimonial | agente | 2026-09-11 19:35 | 22 min | 45 |
| Analista de cooperação jurídica internacional | agente | 19:58 | 7 min | 39 |
| Assessor jurídico em perdimento e destinação | agente | 20:06 | 7 min | 35 |
| Membro externo do sistema de justiça | agente | 20:13 | 7 min | 43 |
| Coordenador/gestor de área | agente | 20:20 | 6 min | 33 |
| Analista de TI/dados e automação | agente | 20:37 | 6 min | 33 |
| Analista de busca patrimonial | **humano** | 20:46 | **31 min** | 49 |

- Painel sintético completo (6 perfis): **68 min de relógio**, sequencial, na mesma tarde
  (19:35 → 20:43); 6–7 min por entrevista depois da primeira (a primeira, 22 min, inclui o
  aquecimento do painel).
- Entrevista humana do mesmo perfil: 31 min, 49 mensagens — o teto de turnos é 50.
- Todas as 7 fecharam com a trava B/C/D satisfeita (nenhuma estourou o teto).

Calendário do domínio (datas dos artefatos e commits):

| Marco | Data |
|---|---|
| Entrevista de escopo, questionário e perfis | 2026-09-11 |
| 7 entrevistas ASD + compilação ASD | 2026-09-11 |
| DCI, DKC (9 categorias × 2 arquivos) | 2026-09-11 → 09-12 |
| DKD (compilação + revisão item a item) | 2026-09-12 → 09-13 |
| ORR (9 ontologias; 144/40/9) | 2026-09-13 |
| EOA + OCO (primeira ontologia OWL gravada à mão) | 2026-09-13 → 09-14 |
| Alinhamento e Construção no painel; migração do legado | 2026-10-03 → 10-05 |
| Ajustes manuais (515) e visualização | 2026-10-05 → 10-06 |

Especificação completa (ASD → ORR) em **3 dias**; especificação + implementação (até OWL
validado e com ajustes) em **~5 semanas de calendário**, um único administrador em tempo
parcial, com desenvolvimento da ferramenta em paralelo — o número de calendário superestima o
esforço líquido de modelagem.
