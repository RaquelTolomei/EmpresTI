# Tarefas — Empréstimos de equipamentos v1

Cada tarefa abaixo deve ser executada isoladamente, caber em um commit e terminar com seu check focado. Não iniciar uma tarefa seguinte antes de validar a atual e atualizar `handoff.md`.

## T1 — Scaffold e ferramentas

- **Escopo:** apresentar e criar a estrutura Next.js/TypeScript strict prevista no plano; configurar ESLint, Prettier, Vitest, Playwright, Husky/lint-staged e scripts básicos.
- **CA:** CA-09, CA-10.
- **Dependências:** spec e plano aprovados.
- **Check:** instalação limpa, `lint`, `typecheck` e teste mínimo de configuração.

## T2 — Configuração de ambiente e clientes

- **Escopo:** validar variáveis de ambiente com Zod; criar singleton Prisma, clientes Supabase SSR/browser e configuração superjson/tRPC.
- **CA:** CA-01, CA-10.
- **Dependências:** T1.
- **Check:** typecheck e teste de inicialização rejeitando configuração inválida.

## T3 — Schema inicial e migration

- **Escopo:** criar `Tenant`, `Membership`, `Equipment`, `Loan` e `AuditEvent`; adicionar enums, relações, `tenant_id`, índices, unicidades e constraint de empréstimo aberto.
- **CA:** CA-02, CA-03, CA-04, CA-05, CA-07, CA-08, CA-10.
- **Dependências:** T2.
- **Check:** migration aplicada em PostgreSQL local recém-resetado e schema Prisma formatado/validado.

## T4 — Contexto de sessão e autorização

- **Escopo:** implementar middleware de renovação, `createContext`, `protectedProcedure`, `tenantProcedure` e `adminProcedure`, incluindo membership e papel.
- **CA:** CA-01, CA-08.
- **Dependências:** T2, T3.
- **Check:** testes de contexto para sessão ausente, tenant ausente, colaborador e Operações.

## T5 — Seed local idempotente

- **Escopo:** criar `prisma/seed.ts` com tenant `suporte_ti`, memberships e dados de demonstração para disponível, emprestado, manutenção, fora de uso e atraso.
- **CA:** CA-02, CA-07, CA-10.
- **Dependências:** T3, T4.
- **Check:** executar seed duas vezes e confirmar ausência de duplicação no banco local.

## T6 — Service de catálogo e equipamentos

- **Escopo:** implementar listagem paginada, detalhe/histórico e cadastro de equipamento; aplicar filtro de tenant e situação derivada `BORROWED`.
- **CA:** CA-02, CA-07, CA-08.
- **Dependências:** T3, T4, T5.
- **Check:** testes de service para estados, paginação, cadastro e isolamento entre tenants.

## T7 — Services de solicitação

- **Escopo:** implementar solicitação transacional com prazo de 14 dias, limite de 3 itens, bloqueio por atraso, disponibilidade, manutenção/fora de uso e corrida concorrente.
- **CA:** CA-03, CA-04, CA-08.
- **Dependências:** T3, T4, T6.
- **Check:** testes de service nomeados `test_ca_03_*` e `test_ca_04_*`, incluindo concorrência contra PostgreSQL local.

## T8 — Services de devolução

- **Escopo:** implementar devolução própria e administrativa, validação de titularidade/papel, data e responsável, encerramento, liberação e auditoria.
- **CA:** CA-05, CA-06, CA-08.
- **Dependências:** T3, T4, T7.
- **Check:** testes para devolução própria, tentativa de item alheio, Operações e histórico preservado.

## T9 — Routers tRPC de equipamentos e empréstimos

- **Escopo:** expor `equipment.list`, `equipment.getByPatrimony`, `equipment.create`, `loan.create`, `loan.mine` e `loan.returnMine`, todos com Zod e erros tipados.
- **CA:** CA-01, CA-02, CA-03, CA-04, CA-05, CA-08.
- **Dependências:** T4, T6, T7, T8.
- **Check:** testes via `createCaller` verificando entrada, retorno/erro, papel e isolamento de tenant.

## T10 — Router tRPC de Operações

- **Escopo:** expor `operations.openLoans`, `operations.returnLoan` e `operations.recentEquipment`, com cursor, filtros, estatísticas e proteção administrativa.
- **CA:** CA-06, CA-07, CA-08.
- **Dependências:** T8, T9.
- **Check:** testes via `createCaller` para acesso de Operações, bloqueio de colaborador, paginação e isolamento.

## T11 — Shell autenticado e login

- **Escopo:** criar endpoint tRPC, middleware de rota, `/login`, sessão por cookie, redirecionamentos, shell, sidebar, header e navegação por papel.
- **CA:** CA-01, CA-09.
- **Dependências:** T1, T2, T4, T9.
- **Check:** teste de componente para estados de login e E2E de autenticação/rota protegida.

## T12 — Catálogo e detalhe do equipamento

- **Escopo:** implementar `/catalogo` e `/catalogo/[patrimonio]`, filtros, cards, estados, ficha técnica, histórico, prazo, limite e diálogo de confirmação.
- **CA:** CA-02, CA-03, CA-04, CA-09.
- **Dependências:** T9, T11.
- **Check:** teste de componente para ações desabilitadas e E2E catálogo → detalhe → solicitação.

## T13 — Meus empréstimos

- **Escopo:** implementar `/meus-emprestimos`, itens atuais, segmentos 3/3, barras de prazo, devolução própria, histórico e invalidação de queries.
- **CA:** CA-05, CA-09.
- **Dependências:** T9, T11, T12.
- **Check:** teste de componente e E2E de devolução própria com atualização da lista.

## T14 — Tela de Operações

- **Escopo:** implementar `/operacoes/emprestimos`, estatísticas, filtros, tabela, atraso, paginação cursor e devolução administrativa.
- **CA:** CA-06, CA-08, CA-09.
- **Dependências:** T10, T11.
- **Check:** teste de componente e E2E de acesso administrativo, filtro e devolução.

## T15 — Cadastro de equipamento

- **Escopo:** implementar `/operacoes/equipamentos/novo`, formulário RHF + Zod, situações, observações, preview e últimos cadastros.
- **CA:** CA-07, CA-08, CA-09.
- **Dependências:** T6, T10, T11.
- **Check:** teste de componente e E2E de cadastro, validação e reflexo no catálogo.

## T16 — Tratamento de estados e acessibilidade

- **Escopo:** revisar loading, vazio, erro, conflito, sucesso e permissão nas seis telas; foco de teclado, `prefers-reduced-motion`, responsividade e `data-screen-label`.
- **CA:** CA-04, CA-08, CA-09.
- **Dependências:** T12, T13, T14, T15.
- **Check:** testes de componentes dos estados críticos e revisão manual desktop/mobile conforme `layout.md`.

## T17 — Integração, segurança e auditoria

- **Escopo:** consolidar testes de integração com Postgres/Testcontainers para transações, constraints, auditoria, seed e isolamento; revisar logs estruturados e rate limit previsto no ADR.
- **CA:** CA-04, CA-05, CA-06, CA-08, CA-10.
- **Dependências:** T5, T7, T8, T9, T10.
- **Check:** suíte de integração com banco local recém-resetado e um caso de isolamento por procedimento de acesso.

## T18 — E2E e aceite final

- **Escopo:** executar fluxos Playwright completos e checks finais de lint, formatação, typecheck, build, Vitest, migrations e seed; registrar comandos reais em `AGENTS.md`.
- **CA:** CA-01 a CA-10.
- **Dependências:** T11 a T17.
- **Check:** todos os comandos passam localmente; revisar ausência de reserva, e-mail e importação.

## Controle de execução

- T1 exige aprovação do scaffold antes de gerar a estrutura do projeto.
- Cada tarefa deve atualizar `handoff.md` com tarefa, CA, checks e próximo passo.
- Testes usam somente banco local/Testcontainers, nunca o Supabase remoto.
- Nenhuma tarefa pode alterar `docs/PRD.md` ou contrariar `docs/adr/001-stack.md`.
