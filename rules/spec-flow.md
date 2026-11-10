---
description: Procedimento para iniciar e verificar qualquer funcionalidade nova do PRD
globs: ["docs/specs/**"]
alwaysApply: false
---

# Fluxo de spec

> leitor: agente

## Quando

Ao iniciar qualquer funcionalidade nova do PRD ou ao finalizar a implementação de uma spec.

## Procedimento

1. Crie `docs/specs/<NNN-nome-curto>/` com `spec.md`.
2. Antes de escrever a spec, liste as perguntas que o PRD não responde. Espere as respostas.
3. `plan.md` sai da spec e cita os ADRs que o restringem.
4. `tasks.md` sai do plano. Cada tarefa cita um CA-xx e cabe num commit.
5. Uma tarefa por vez. Ao terminar, siga `rules/checks.md`.

## Não faça

- Não escreva código antes do plano aprovado.
- Não crie pasta de spec fora do padrão `NNN-nome-curto`.

## Antes de declarar uma spec pronta (Obrigatório)

1. Delegue a verificação ao subagente `verificador-spec` (`agents/verificador-spec.md`), informando:
   - Caminho da spec: `docs/specs/<NNN-nome-curto>/spec.md`
   - O que mudou: intervalo de commits (`git diff main --stat` ou commit inicial..final).
2. O subagente opera em contexto limpo, sem permissões de escrita/deploy e sem realizar correções.
3. A spec só é considerada pronta quando o relatório trouxer exclusivamente **`Veredito: PRONTA`**.
4. Qualquer status `REPROVADO`, `SEM TESTE` ou `AMBÍGUO` **bloqueia automaticamente** a conclusão. As tarefas reprovadas voltam para o agente implementador corrigir; o verificador nunca corrige.
5. O resultado estruturado deve ser salvo ou atualizado em `docs/specs/<NNN-nome-curto>/verificacao.md` para histórico e comparação entre versões.
