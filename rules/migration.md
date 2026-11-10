---
description: Procedimento para qualquer mudança de schema e dados
globs: ["prisma/schema.prisma", "prisma/migrations/**"]
alwaysApply: false
---

# Mudança de schema

> leitor: agente

## Quando

Qualquer tarefa que precise criar, alterar ou remover tabela, coluna, índice, constraint ou política de acesso — inclusive quando a mudança parecer trivial.

## Procedimento

1. Antes de gerar qualquer migration: descreva as alterações de modelo no `prisma/schema.prisma` na resposta e PARE. Aguarde aprovação.
2. Toda tabela nova nasce com suporte a isolamento por tenant e integridade referencial.
3. Se a tabela já contiver dados, defina valores padrão ou estratégias de preenchimento para novas colunas obrigatórias.
4. Aplique a migração localmente e execute a suíte de testes (`npm test`).

## Verificação

As migrações aplicam do zero em banco local/testcontainers sem erro e sem intervenção manual.

## Não faça

- Não altere o banco via interface remota do Supabase nem via SQL avulso. O que não estiver em migração versionada não existe.
- Não edite migrations que já foram commitadas. Crie a próxima migração incremental.
- Não toque no projeto Supabase remoto. Tudo acontece no banco local.
