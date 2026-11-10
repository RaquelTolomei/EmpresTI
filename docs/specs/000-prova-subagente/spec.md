# Spec de Teste Controlado — Prova do Subagente Verificador

## Objetivo

Demonstrar de forma controlada e auditável que o subagente `verificador-spec` atende ao Requisito 6: capacidade comprovada de aprovar implementações corretas, reprovar implementações defeituosas e identificar situações inconclusivas.

## Critérios de Aceitação de Prova

- CA-01: Operação de cálculo de prazo de devolução (14 dias a partir da retirada). Implementado e com teste automatizado dedicado.
- CA-02: Bloqueio estrito de usuário com pendência anterior. Implementação defeituosa proposital ou teste falhando para demonstrar reprovação.
- CA-03: Notificação por SMS para o colaborador. Critério planejado porém sem teste implementado para demonstrar detecção de ausência de evidência.
