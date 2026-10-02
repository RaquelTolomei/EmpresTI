# Plano técnico — Empréstimos de equipamentos v1

## Base e restrições

Este plano deriva de `spec.md` e é restrito por:

- `docs/PRD.md`: escopo e regras de negócio.
- `docs/adr/001-stack.md`: Next.js App Router, TypeScript strict, tRPC, Prisma, Supabase Auth/SSR, TanStack Query, Tailwind, shadcn/ui, Vitest, Testing Library e Playwright.
- `layout.md`: seis telas, rotas, componentes, tokens visuais e fluxos.
- `rules/restrictions.md`, `rules/spec-flow.md` e `rules/tests.md`: nenhuma decisão fora dos documentos, uma tarefa por vez, banco local nos testes e isolamento obrigatório.

Não serão usadas Server Actions, acesso direto ao Prisma pelas telas, cliente Supabase para leitura/mutação de domínio, REST, bibliotecas de estado adicionais ou alterações no Supabase remoto.

## Arquitetura

### Camadas

1. **Interface** — rotas do App Router, Client Components para telas com dados e componentes de UI.
2. **tRPC** — validação Zod de entrada, contexto, autorização, serialização superjson e formato de erro.
3. **Services** — regras de negócio, transações e consultas por tenant.
4. **Prisma** — persistência, constraints, migrations, seed e SQL de RLS/auditoria.
5. **Supabase Auth** — autenticação e sessão por cookies `httpOnly` integrados via `@supabase/ssr`.

O `AppRouter` será a fonte dos tipos consumidos pelo cliente. Entradas e saídas de procedimentos serão inferidas por `RouterInputs` e `RouterOutputs`.

### Estrutura planejada

```text
src/
  app/
    login/page.tsx
    catalogo/page.tsx
    catalogo/[patrimonio]/page.tsx
    meus-emprestimos/page.tsx
    operacoes/emprestimos/page.tsx
    operacoes/equipamentos/novo/page.tsx
    api/trpc/[trpc]/route.ts
  components/
    layout/
    equipment/
    loans/
    operations/
    ui/
  server/
    api/
      root.ts
      trpc.ts
      routers/equipment.ts
      routers/loan.ts
      routers/operations.ts
    auth/
    db/
    services/equipment-service.ts
    services/loan-service.ts
    services/operations-service.ts
  lib/

prisma/
  schema.prisma
  migrations/
  seed.ts

tests/
  services/
  procedures/
  components/
  e2e/
```

A estrutura só será criada no scaffold após a conclusão e aprovação deste plano e de `tasks.md`.

## Persistência

### Entidades mínimas

- `Tenant`: identificador e slug.
- `Membership`: vínculo usuário–tenant, com papel `COLLABORATOR` ou `OPERATIONS`.
- `Equipment`: unidade física, dados cadastrais, situação persistida e tenant.
- `Loan`: equipamento, usuário, tenant, retirada, prazo, devolução e responsável pela devolução.
- `AuditEvent`: evento append-only com ator, tenant, ação e recurso, conforme ADR.

Rate limit e demais tabelas de infraestrutura previstas no ADR serão adicionados somente se necessários para os procedimentos da v1 e sempre no banco local/migrations Prisma.

### Integridade

- Chaves estrangeiras entre tenant, membership, equipamento e empréstimo.
- Patrimônio único dentro do tenant.
- Número de série único quando informado, dentro do tenant.
- Índices por tenant, situação, patrimônio, usuário, devolução e prazo.
- No máximo um empréstimo aberto por equipamento, garantido por índice/constraint apropriado no PostgreSQL.
- Datas de devolução somente após retirada e prazo calculado a partir da retirada.
- Toda tabela de domínio terá `tenant_id`.

A solicitação será uma transação que valida tenant, situação, ausência de empréstimo aberto, limite de três itens e atraso antes de inserir o empréstimo. A constraint do banco será a última barreira contra corrida concorrente.

A devolução será uma transação que valida titularidade ou papel de Operações, grava data e responsável, fecha o empréstimo, grava auditoria e libera a disponibilidade derivada do equipamento.

## Contexto e autorização

- Middleware do Next renova a sessão Supabase em toda rota.
- `createContext` monta sessão, usuário, membership, `tenant_id`, papel, Prisma e `request_id`.
- `protectedProcedure` exige sessão.
- `tenantProcedure` exige membership e injeta o tenant no service.
- `adminProcedure` exige papel Operações.
- Nenhum procedimento recebe tenant como parâmetro de autorização.
- O filtro por tenant deve existir em toda consulta e mutação de domínio.
- RLS será habilitado nas tabelas por migration Prisma como defesa adicional; autorização primária continua nos middlewares e services.

## Contrato tRPC

### Equipment router

- `list`: catálogo paginado por cursor, com filtro de categoria e disponibilidade.
- `getByPatrimony`: detalhe, situação derivada e histórico.
- `create`: cadastro exclusivo de Operações.

### Loan router

- `create`: solicitação de equipamento disponível.
- `mine`: empréstimos atuais e histórico do usuário.
- `returnMine`: devolução de empréstimo próprio.

### Operations router

- `openLoans`: empréstimos abertos paginados por cursor, com filtros e estatísticas.
- `returnLoan`: devolução administrativa de empréstimo aberto.
- `recentEquipment`: últimos cadastros para a tela de cadastro.

Cada procedimento terá schema Zod, erro `TRPCError` com código semântico e teste de isolamento de tenant quando acessar dados persistidos.

## Interface

### Rotas

- `/login`
- `/catalogo`
- `/catalogo/[patrimonio]`
- `/meus-emprestimos`
- `/operacoes/emprestimos`
- `/operacoes/equipamentos/novo`

O shell autenticado conterá sidebar, header, contador de itens e navegação condicional por papel. A interface usará TanStack Query via `@trpc/react-query`, invalidação após mutações e paginação cursor com `useInfiniteQuery` onde aplicável.

### Fluxos de tela

- Login redireciona usuário autenticado para o catálogo.
- Catálogo exibe equipamentos disponíveis, emprestados, em manutenção e fora de uso, com ação somente quando permitida.
- Detalhe calcula prazo de 14 dias e exibe diálogo de confirmação.
- Meus empréstimos permite devolução própria e exibe histórico.
- Operações mostra estatísticas, filtros, paginação e devolução administrativa.
- Cadastro valida formulário com React Hook Form + `zodResolver`, mostra prévia e últimos cadastros.

Estados de loading, erro, vazio, conflito, permissão insuficiente e sucesso serão previstos nos componentes. O visual seguirá os tokens e regras de `layout.md`, sem implementar funcionalidades fora do escopo.

## Testes e verificação

- Service tests para CA-03, CA-04, CA-05, CA-06 e CA-07.
- Testes de procedimentos via `createCaller`, incluindo CA-01, CA-02 e CA-08.
- Integração com PostgreSQL local/Testcontainers para constraints, transações e seed, cobrindo CA-04 e CA-10.
- Testes de componentes para CA-01, CA-02, CA-04, CA-05, CA-06, CA-07 e CA-09.
- E2E Playwright para os fluxos completos de CA-01, CA-03, CA-05, CA-06 e CA-07.
- Todos os testes de acesso citam o critério e comprovam que tenant A não acessa tenant B.
- Checks por tarefa: formatação, ESLint, TypeScript strict e teste focado; checks finais: Vitest, Playwright, build e migration/seed local.

## Ordem de implementação

1. Derivar `tasks.md` e aprovar a sequência.
2. Apresentar o scaffold e inicializar a fundação do projeto.
3. Configurar ambiente, Prisma singleton, contexto e autenticação.
4. Criar schema, migration, constraints e seed local.
5. Implementar services e testes das regras de negócio.
6. Implementar routers tRPC e testes de procedimentos.
7. Implementar shell, login e catálogo.
8. Implementar detalhe, solicitação e Meus empréstimos.
9. Implementar Operações e cadastro de equipamento.
10. Executar testes de integração/E2E, revisão visual e checks finais.

Cada item será executado como uma tarefa separada, com validação focada e atualização do `handoff.md` antes de avançar.
