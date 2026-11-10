# Handoff

1. Onde parei: T2 preparada com validação Zod, singleton Prisma, clientes Supabase SSR/browser e base tRPC. A autenticação e o catálogo ainda não foram implementados.
2. Commit e branch: `818970a` na branch `main`; alterações atuais não commitadas.
3. Banco local: nenhum PostgreSQL local disponível; migrations e seed não foram executados. O `.env` atual aponta para um banco remoto; não conectar nem executar seed com ele.
4. Publicação: nada foi publicado; nenhum acesso ou alteração remota foi feito.
5. Não fazer: não usar o banco Supabase remoto; os valores Supabase adicionados ao `.env` são placeholders e precisam ser configurados antes de testar autenticação.
6. Checks T2: `npm test`, `npm run typecheck`, `npm run lint` e `npm run build` passaram; formatação focada passou. `npm run format:check` falha somente em `tests/prova-subagente.test.ts`, arquivo preexistente fora do escopo.
7. Próximo passo: configure PostgreSQL local, valide/aplique as migrations existentes e continue as tarefas pendentes de sessão/autorização antes do login e catálogo.
