---
description: O que precisa passar antes de declarar uma tarefa pronta
globs: []
alwaysApply: true
---

# Verificação de fim de tarefa

> leitor: agente

## Quando

Sempre que você for dizer "pronto", "implementado" ou "funcionando".

## Procedimento

1. Rode `npm test` e cole a linha de resumo da saída na resposta.
2. Se a tarefa tocou em schema ou migration, garanta que o banco local/testcontainers sobe do zero com todas as migrations.
3. Rode `npm run build` antes de qualquer entrega ou encerramento de tarefa.
4. Rode `git status --short`. Só podem aparecer arquivos do escopo estrito da tarefa.
5. Diga explicitamente qual critério de aceitação (CA-xx) esta tarefa atende.

## Verificação

Pronto = os comandos terminaram com código zero E o `git status` não trouxe arquivos fora de escopo.

## Não faça

- Não relate sucesso parcial. Teste falhando é tarefa incompleta, mesmo que o código pareça correto.
- Não tente consertar a mesma falha duas vezes seguidas sem mostrar a saída do erro.
- Não rode testes contra banco de dados remoto.
