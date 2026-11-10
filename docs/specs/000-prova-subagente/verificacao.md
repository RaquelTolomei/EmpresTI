# Relatório de Verificação de Spec — Prova Controlada

- Spec: docs/specs/000-prova-subagente/spec.md
- Commit/Referência: tests/prova-subagente.test.ts
- Data da Verificação: 2026-11-09 18:58:30

| CA    | Evidência (arquivo:linha)        | Status    | Observação                                                                     |
| ----- | -------------------------------- | --------- | ------------------------------------------------------------------------------ |
| CA-01 | tests/prova-subagente.test.ts:5  | ATENDIDO  | Teste cobre cálculo de prazo de devolução de 14 dias                           |
| CA-02 | tests/prova-subagente.test.ts:15 | REPROVADO | Implementação com defeito proposital permite empréstimo com pendência anterior |
| CA-03 | -                                | SEM TESTE | Nenhum teste automatizado com CA-03 encontrado                                 |

Legenda de Status:

- ATENDIDO: Teste dedicado com nome citando o CA, passando e exercitando o código real.
- REPROVADO: Teste falha ou implementação contraria explicitamente o critério.
- SEM TESTE: Não há teste automatizado referenciando o ID do critério.
- AMBÍGUO: Critério ambíguo ou contraditório com outra regra; requer decisão humana.
- OUTRO REPOSITÓRIO: Critério cuja prova reside exclusivamente em outro repositório do projeto.

Checks:

- npm run lint → passou
- npm run typecheck → passou
- npm test → passou
- npm run build → passou

Fora de Escopo: nenhuma adição não autorizada encontrada

Veredito: NÃO PRONTA — Critério CA-02 reprovado por implementação defeituosa e critério CA-03 sem teste implementado.
