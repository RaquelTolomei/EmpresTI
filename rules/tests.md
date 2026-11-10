---
description: Como escrever e rodar testes neste projeto
globs: ["tests/**"]
alwaysApply: false
---

# Como escrever testes neste projeto

> leitor: agente

## Quando

Ao escrever, alterar ou remover qualquer teste.

## Procedimento

1. Testes rodam contra o banco local ou Testcontainers. Nunca contra o remoto.
2. O nome do teste cita o critério que ele prova: `test_ca_03_...`
3. Teste de endpoint verifica status E corpo.
4. Tabela com política de acesso tem um teste que prova o bloqueio: o mesmo dado, com outro usuário/tenant, não retorna.

## Verificação

`npm test` passa com o banco local / testcontainers recém-inicializado.
