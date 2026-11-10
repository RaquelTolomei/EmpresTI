---
description: Contrato de operacao entre mim e o agente neste projeto
globs: []
alwaysApply: true
---

# Contrato de operação

> leitor: agente + operador

## Git

- Commit: agente por tarefa concluída.
- Push: operador humano.
- A mensagem de commit cita a tarefa e o critério de aceitação (ex.: `feat: T3 schema inicial (CA-03)`).
- Um commit por tarefa. Nunca junte código e mudança de regra no mesmo commit.

## Autorização por tipo de ação

| Ação                                                               | Nível       |
| ------------------------------------------------------------------ | ----------- |
| Criar teste para CA existente                                      | livre       |
| Alterar código dentro do escopo da tarefa                          | livre       |
| Executar comandos de leitura e checagem (`npm test`, `lint`, etc.) | livre       |
| Propor nova migration ou alteração de schema                       | pedir antes |
| Adicionar dependência no `package.json`                            | pedir antes |
| Alterar arquivo de regra (`rules/`) ou ADR                         | pedir antes |
| Fazer push para repositório remoto                                 | proibido    |
| Acessar ou alterar banco de produção/remoto                        | proibido    |

Níveis:

- **livre:** execute e prossiga.
- **avisar depois:** execute e relate na resposta.
- **pedir antes:** descreva a intenção e PARE até receber aprovação expressa.
- **proibido:** não execute sob nenhuma circunstância.
