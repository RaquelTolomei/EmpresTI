# Spec — Empréstimos de equipamentos v1

## Referências

- Requisitos de negócio: `docs/PRD.md`
- Restrições técnicas: `docs/adr/001-stack.md`
- Interface e fluxos visuais: `layout.md`
- Processo de execução: `rules/spec-flow.md`, `rules/tests.md` e `rules/restrictions.md`

## Objetivo

Substituir a planilha de empréstimos internos por um fluxo único para que colaboradores consultem equipamentos, solicitem empréstimos e registrem devoluções, enquanto Operações acompanha os empréstimos em aberto e cadastra equipamentos.

## Escopo da v1

### Incluído

- Login de usuários pré-criados.
- Catálogo de equipamentos com situação e disponibilidade.
- Solicitação de equipamento disponível.
- Devolução de item pelo colaborador.
- Devolução de qualquer empréstimo por Operações.
- Tela de Operações com empréstimos em aberto.
- Cadastro de equipamento por Operações.
- Histórico de empréstimos e devoluções.

### Excluído

- Cadastro ou convite de usuários dentro da aplicação.
- Reserva com data futura.
- Notificação por e-mail.
- Importação da planilha atual.
- Tempo real, consumidor externo, aplicativo mobile e relatórios.
- Edição ou baixa avançada de equipamentos.

## Atores e permissões

### Colaborador

- Pode acessar o próprio tenant após autenticação.
- Pode consultar o catálogo e o detalhe dos equipamentos.
- Pode solicitar equipamento disponível, desde que não tenha atingido o limite e não possua atraso.
- Pode listar seus empréstimos atuais e seu histórico.
- Pode devolver somente empréstimos próprios.
- Não pode acessar operações, cadastrar equipamentos ou devolver empréstimos de terceiros.

### Operações

- Possui as permissões do colaborador, salvo decisão posterior em contrário.
- Pode consultar todos os empréstimos em aberto do próprio tenant.
- Pode filtrar e paginar a lista de empréstimos.
- Pode registrar a devolução de qualquer empréstimo do próprio tenant.
- Pode cadastrar equipamentos.
- Não pode consultar dados de outro tenant.

Usuários são pré-criados/provisionados. A aplicação não implementa cadastro, convite ou recuperação de conta nesta versão.

## Conceitos e estados

### Equipamento

Cada registro representa uma unidade física e contém, no mínimo:

- Nome
- Categoria
- Patrimônio
- Número de série
- Local de retirada
- Situação inicial
- Observações

Situações persistidas:

- `AVAILABLE`: disponível para solicitação.
- `MAINTENANCE`: em manutenção e não solicitável.
- `RETIRED`: fora de uso e não solicitável.

`BORROWED` não é uma situação persistida: é derivada quando existe empréstimo aberto para o equipamento.

### Empréstimo

Um empréstimo contém equipamento, usuário, tenant, data de retirada, prazo calculado, data de devolução e responsável pela devolução quando encerrado.

Um empréstimo está em atraso quando a data atual ultrapassa o prazo e ele ainda não possui devolução. O prazo padrão é de 14 dias a partir da retirada.

## Regras de negócio

1. Um colaborador pode manter no máximo 3 empréstimos abertos.
2. Um colaborador com qualquer empréstimo em atraso não pode solicitar outro equipamento.
3. Equipamento em manutenção ou fora de uso não pode ser solicitado.
4. Somente equipamento disponível, sem outro empréstimo aberto, pode ser solicitado.
5. Uma solicitação bem-sucedida cria um empréstimo com prazo de 14 dias.
6. Solicitações concorrentes para o mesmo equipamento resultam em no máximo um empréstimo aberto; a outra solicitação recebe erro de conflito/indisponibilidade.
7. O colaborador só pode devolver empréstimos próprios.
8. Operações pode devolver qualquer empréstimo aberto do próprio tenant.
9. A devolução registra data e responsável, encerra o empréstimo e libera o equipamento para o catálogo se sua situação persistida for `AVAILABLE`.
10. Histórico de empréstimos e devoluções não é apagado ao devolver um item.
11. Tenant é derivado da sessão/membership no servidor e nunca é recebido do cliente como fonte de autorização.
12. Toda operação de domínio deve respeitar autorização por sessão, tenant e papel.

## Fluxos principais

### Login

1. Usuário informa e-mail e senha de uma conta pré-criada.
2. Supabase Auth valida as credenciais.
3. A aplicação cria/renova a sessão por cookie seguro.
4. Usuário autenticado é direcionado ao catálogo.
5. Usuário não autenticado não acessa rotas protegidas.

### Solicitação

1. Colaborador abre o catálogo.
2. Seleciona equipamento disponível.
3. Consulta detalhe, prazo calculado e seu limite atual.
4. Confirma a solicitação.
5. Servidor valida disponibilidade, limite, atraso e tenant dentro de transação.
6. Sistema cria o empréstimo ou retorna erro tipado.
7. Catálogo e lista de empréstimos são atualizados.

### Devolução pelo colaborador

1. Colaborador abre Meus empréstimos.
2. Seleciona um item próprio.
3. Confirma a devolução.
4. Servidor valida a titularidade e encerra o empréstimo.
5. Sistema registra data e responsável, libera o equipamento e atualiza o histórico.

### Operações

1. Usuário de Operações acessa Empréstimos em aberto.
2. Consulta estatísticas, filtros e paginação por cursor.
3. Pode registrar a devolução de uma linha.
4. Pode acessar Cadastrar equipamento.
5. Preenche os dados e escolhe a situação inicial.
6. Sistema valida e grava o equipamento no tenant atual.
7. O equipamento aparece no catálogo conforme sua situação.

## Telas e rotas

- `/login` — autenticação.
- `/catalogo` — catálogo, filtros e regras visíveis.
- `/catalogo/:patrimonio` — detalhe, histórico e solicitação.
- `/meus-emprestimos` — itens atuais, devolução e histórico.
- `/operacoes/emprestimos` — empréstimos em aberto, filtros, paginação e devolução administrativa.
- `/operacoes/equipamentos/novo` — cadastro de equipamento e prévia.

As telas devem seguir a especificação visual de `layout.md`, incluindo somente modo escuro, tokens Nocturne, tipografia Open Sans, ícones Phosphor, estados de carregamento/erro/vazio, foco de teclado e redução de movimento.

## Critérios de aceite

- **CA-01 — Autenticação:** usuário pré-criado consegue entrar; usuário não autenticado é impedido de acessar rotas protegidas.
- **CA-02 — Catálogo:** colaborador vê equipamentos do próprio tenant, com disponibilidade, empréstimo, manutenção ou fora de uso corretamente representados.
- **CA-03 — Solicitação:** colaborador solicita equipamento disponível e recebe empréstimo com retirada e prazo de 14 dias.
- **CA-04 — Bloqueios:** solicitação é recusada ao atingir 3 itens, possuir atraso, escolher item indisponível ou perder uma corrida concorrente.
- **CA-05 — Devolução própria:** colaborador devolve apenas item próprio; sistema registra data/responsável, encerra empréstimo e libera o equipamento.
- **CA-06 — Operações:** usuário autorizado consulta, filtra, pagina e devolve qualquer empréstimo aberto do próprio tenant.
- **CA-07 — Cadastro:** Operações cadastra equipamento nos três estados persistidos e o catálogo reflete a situação.
- **CA-08 — Isolamento:** nenhum procedimento retorna ou altera dados de outro tenant; colaborador não acessa operações.
- **CA-09 — Interface:** as seis telas e fluxos seguem `layout.md` e contemplam sucesso, erro, carregamento, vazio e permissões.
- **CA-10 — Repetibilidade:** migrations aplicam em banco local recém-resetado e seed pode ser executado repetidamente sem duplicar dados.

## Erros esperados

A API deve expor erros tipados para:

- Sessão ausente ou inválida.
- Papel insuficiente.
- Tenant não encontrado ou acesso não autorizado.
- Equipamento inexistente.
- Equipamento indisponível, em manutenção ou fora de uso.
- Limite de 3 itens atingido.
- Colaborador com empréstimo em atraso.
- Empréstimo inexistente, encerrado ou pertencente a outro usuário.
- Conflito de solicitação concorrente.
- Dados inválidos de cadastro.

## Dados de demonstração

O seed local deve ser idempotente e criar o tenant `suporte_ti`, memberships de colaborador e Operações, além de equipamentos e empréstimos que permitam visualizar os estados disponível, emprestado, manutenção e atraso. O seed não pode depender do Supabase remoto nem importar a planilha.

## Testes obrigatórios

- Services: regras de limite, atraso, prazo, disponibilidade, devolução e concorrência.
- Procedimentos tRPC via `createCaller`: entrada, retorno/erro, autorização e isolamento de tenant.
- Integração com Postgres local/Testcontainers: constraints e transações.
- Componentes: estados e ações críticas com Testing Library.
- E2E Playwright: login, solicitar, devolver, fluxo de Operações e cadastro.

Nomes de testes devem citar o critério, por exemplo `test_ca_04_bloqueia_solicitacao_com_atraso`. Testes nunca devem usar o banco Supabase remoto.

## Decisões não pertencentes a esta spec

- Provisionamento operacional das contas pré-criadas.
- Estratégia de backup, retenção e LGPD.
- Configuração de ambientes e branches.
- SLO, custos, métricas e tracing além do log estruturado e Sentry previstos no ADR.
