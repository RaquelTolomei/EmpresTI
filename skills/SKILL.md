---
name: skills
description: "Use when planning, implementing, testing, or reviewing EmpresTI features. Covers the project workflow, architecture constraints, business rules, UI conventions, and required validation."
---

# Fluxo de desenvolvimento do EmpresTI

Use este skill para mudanças no sistema de empréstimo de equipamentos internos. Ele orienta o trabalho; os documentos do repositório continuam sendo a fonte de verdade para requisitos e decisões.

## Antes de começar

1. Leia [`rules/restrictions.md`](../rules/restrictions.md) e as instruções aplicáveis em [`AGENTS.md`](../AGENTS.md).
2. Consulte [`docs/PRD.md`](../docs/PRD.md) para o objetivo, os atores e as regras de negócio.
3. Consulte [`docs/adr/001-stack.md`](../docs/adr/001-stack.md) e os demais ADRs pertinentes antes de escolher tecnologias ou padrões.
4. Para uma funcionalidade, localize a spec correspondente em `docs/specs/`. Leia `spec.md`, `plan.md` e `tasks.md`; a spec prevalece sobre o código quando houver divergência.
5. Para alterações de interface, siga [`layout.md`](../layout.md), o design system Nocturne e as regras de acessibilidade e responsividade já especificadas.
6. Leia os arquivos relevantes e verifique o estado do Git. Preserve mudanças preexistentes e não amplie o escopo.

## Planeje antes de implementar

- Não implemente funcionalidade do produto sem uma spec correspondente, um plano aprovado e uma tarefa atual identificada.
- Se a tarefa iniciar uma funcionalidade nova, siga [`rules/spec-flow.md`](../rules/spec-flow.md): identifique ambiguidades do PRD e aguarde respostas antes de escrever a spec.
- Se um comportamento necessário não estiver definido, pergunte em vez de inventar uma regra.
- Execute uma tarefa por vez. Ao concluí-la, rode os checks pertinentes, relate o resultado e pare antes da próxima tarefa.
- Não altere o PRD, não escreva ADRs e não escolha bibliotecas fora do ADR-001. Se uma decisão exigir mudar um ADR, apresente alternativas e aguarde.

## Restrições técnicas

- Mantenha o fluxo de domínio `Router tRPC → Service → Prisma`. Regras de negócio pertencem ao Service; entrada, contexto e permissões pertencem ao Router.
- Use Zod no `.input()` de todo procedimento tRPC. Derive `RouterInputs` e `RouterOutputs` do `AppRouter`; não declare manualmente tipos de retorno dos procedimentos.
- Acesse e altere dados de domínio exclusivamente por tRPC. Não consulte Prisma ou Supabase diretamente em componentes de servidor e não use Server Actions.
- Obtenha o tenant da sessão no servidor por `tenantProcedure`; nunca aceite tenant do cliente como fonte de autorização.
- Aplique `protectedProcedure`, `tenantProcedure` ou `adminProcedure` conforme o nível de acesso. RLS é defesa adicional, não autorização primária.
- Preserve TypeScript `strict`, sem `any` implícito.
- Prisma Migrate é o único dono do schema. Não rode comandos do Supabase CLI que alterem schema nem acesse o projeto Supabase remoto durante desenvolvimento ou testes.
- Consulte a documentação instalada em `node_modules/next/dist/docs/` antes de usar APIs ou convenções do Next.js; esta versão pode divergir de versões anteriores.

## Regras de domínio a preservar

- Cada colaborador pode ter no máximo três empréstimos abertos.
- O prazo padrão é de 14 dias a partir da retirada.
- Um atraso impede novas solicitações.
- Equipamentos em manutenção ou fora de uso não podem ser solicitados.
- Um empréstimo aberto é derivado; a situação persistida do equipamento não deve ser confundida com `BORROWED`.
- Solicitações concorrentes para o mesmo equipamento não podem criar mais de um empréstimo aberto.
- Colaboradores só devolvem empréstimos próprios; Operações pode devolver empréstimos do próprio tenant.
- Histórico de empréstimos não é apagado na devolução.
- Nunca exponha dados de outro tenant, mesmo em telas ou filtros administrativos.

## Interface

- Use português do Brasil e o tom operacional conciso definido em `layout.md`.
- Siga exclusivamente o tema escuro Nocturne, os tokens, a tipografia Open Sans e os padrões de espaçamento, estados, botões e foco.
- Não introduza modo claro, gradientes não especificados, emoji, biblioteca visual ou componente externo sem autorização arquitetural.
- Considere loading, erro, vazio, sucesso, permissão, teclado, redução de movimento e telas menores quando forem aplicáveis ao fluxo.
- Não apresente ações funcionais sem uma implementação de backend correspondente; dados de demonstração devem ser identificados como tais.

## Testes e checks

- Use Vitest para servidor e componentes e Playwright para E2E.
- Testes de integração usam PostgreSQL local/Testcontainers; não use o banco remoto e não faça mock do Prisma nos testes de integração.
- Teste procedimentos com `createCaller` e inclua isolamento de tenant em cada procedimento que acessa dados.
- Nomeie testes com o critério de aceite correspondente, por exemplo `test_ca_03_*`; endpoints devem validar status e corpo.
- Siga [`rules/tests.md`](../rules/tests.md) ao criar ou alterar testes.
- Execute os checks aplicáveis à tarefa, usando os scripts existentes:

```text
npm run lint
npm run typecheck
npm run format:check
npm test
npm run test:e2e
npm run build
```

- Prefira a menor verificação que cubra a mudança e expanda a suíte quando necessário. Informe qualquer check que não tenha passado; não declare sucesso completo enquanto houver falha.

## Encerramento

- Revise o diff e confirme que apenas arquivos do escopo foram alterados.
- Não faça push para a branch de produção, deploy ou alterações na configuração da Vercel.
- Ao terminar uma tarefa do plano, atualize `handoff.md` conforme [`rules/handoff.md`](../rules/handoff.md).
- Resuma o que foi alterado e os resultados reais dos checks executados.
