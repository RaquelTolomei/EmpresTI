---
description: Onde cada variável de ambiente vive e qual chave usar
globs: ["**/.env*", "src/lib/**", "src/server/**"]
alwaysApply: false
---

# Variáveis de ambiente e chaves

> leitor: agente

## Quando

Ao criar ou usar qualquer variável de ambiente, ao instanciar clientes de banco ou ao escrever código que lê configurações.

## Procedimento

1. Chave pública (`anon`): só ela pode aparecer em código que roda no navegador. A proteção vem das políticas de autorização e endpoints autenticados.
2. Chave de serviço (`service_role`): restrita a código que roda no servidor; nunca em componente de cliente, nunca com prefixo público (`NEXT_PUBLIC_`).
3. Toda variável nova deve existir simultaneamente no ambiente local (`.env`) e no `.env.example` (versionado, sem valores reais).
4. Ao criar uma variável, informe na resposta onde ela foi configurada.

## Verificação

Buscas por chaves de serviço ou segredos em código cliente não retornam nada. `.env.example` contém todas as variáveis usadas, sem valores reais.

## Não faça

- Não escreva valores reais de chaves em respostas, commits, logs ou comentários.
- Não crie variável de ambiente sem documentá-la no `.env.example`.
