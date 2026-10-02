# ADR-002 — Design system Nocturne para o EmpresTI

## Status

Aceito.

## Contexto

O EmpresTI é uma aplicação interna de gestão de empréstimo de equipamentos com dois perfis principais: colaborador e operações. A interface precisa ser funcional, enxuta e altamente legível em um ambiente de uso diário, com foco em rastreio de disponibilidade, prazo de devolução, manutenção e bloqueio de novos empréstimos.

A experiência também precisa ser consistente entre as seis telas principais do produto: login, catálogo, detalhe do item, meus empréstimos, operações e cadastro. O layout proposto define uma linguagem visual clara para o sistema, mas exige uma decisão explícita sobre a base visual e os padrões de UI que devem ser aplicados em toda a aplicação.

O contexto da decisão inclui:

- interface somente em modo escuro;
- design system com identidade própria, adaptado ao Azul #001449;
- necessidade de diferenciação entre ações primárias e secundárias sem perder legibilidade;
- exigência de densidade e alinhamento à esquerda para fluxos operacionais;
- forte uso de chips, pills, tabelas, cards e barras para indicar estados;
- necessidade de manter uma estrutura visual consistente em todas as telas sem criar sobrecarga de tokens ou estilos arbitrários.

## Decisão

Adotaremos o design system Nocturne como base visual da interface do EmpresTI, com a seguinte regra operacional:

1. Interface em modo escuro exclusivamente.
2. Base visual adaptada à marca primária #001449, com cor de ação #5B7FE0.
3. Ações principais com contorno visual e fundo transparente, nunca preenchimento sólido.
4. Uso de tokens de cor e superfície definindo fundo, cards, bordas, divisores, texto e estados semânticos.
5. Tipografia única em Open Sans, com pesos e tamanhos definidos por papel da interface.
6. Escala de espaçamento densa e orientada para layout em grid/flex com gap, sem margens manuais.
7. Estrutura de app com sidebar fixa, header, conteúdo principal e grid de telas com proporções consistentes.
8. Estados de equipamento e empréstimo representados por pills, bordas e indicadores visuais explícitos.
9. Interação discreta: hover, foco, abertura de diálogo e transições curtas e funcionais.
10. Sem suporte a modo claro, sem gradientes agressivos, sem emojis e sem excesso de sombras.

Essa decisão se materializa em um conjunto de tokens e padrões que serão usados em componentes, telas e fluxos do produto. A interface se torna visualmente coerente e previsível, sem depender de estilos ad hoc por tela.

## Padrões adotados

### Visual

- Fundo principal em azul-escuro quase preto: #080C1A.
- Superfícies elevadas por borda + escurecimento ambiente, não por sombras pesadas.
- Primária #001449 usada como fundo profundo, nunca como texto ou botão em fundo escuro.
- Cor de ação visível: #5B7FE0.
- Tons de superfície, borda e texto em azulados discretos para manter contraste sem flamboyance visual.

### Componentes

- Botões primários com borda de ação e fundo transparente.
- Botões de confirmação com preenchimento leve e borda azul.
- Ícones Phosphor como sistema visual de apoio.
- Cards, pills, filtros e linhas de tabela com padronização de raio, borda e acentos.
- Diálogos centrados com backdrop semitransparente e caixa de conteúdo consistente.

### Tipografia

- Open Sans como família única.
- Pesos 400 e 600, sem uso de 700 em títulos.
- Títulos e rótulos com letter-spacing cuidadoso; corpo em texto legível e operacional.
- Escala de texto adaptada para leitura de dados, metadados e ações.

### Layout e densidade

- Sidebar fixa de 236px em todas as telas internas.
- Header com altura fixa de 64px, busca e ação principal.
- Conteúdo em blocos com padding e gap consistentes.
- Grid interno por tela: catálogo, detalhe, operações, cadastro e listas de empréstimos.

### Estados

- Disponível: verde.
- Emprestado: cinza azulado.
- Manutenção: âmbar.
- Atraso: vermelho suave.

Esses estados são expressos em badges, bordas, linhas de tabela e indicadores de progresso, permitindo que o usuário entenda rapidamente pendências e regras do sistema.

## Justificativa

O sistema interno de empréstimo depende de legibilidade imediata e operação repetitiva. O design visual não deve competir com a informação; ele precisa acelerar a leitura do estado dos equipamentos e das regras de negócio. O Nocturne atende a esse requisito com:

- contraste funcional em fundo escuro;
- hierarquia visual clara para ações e avisos;
- linguagem consistente entre telas e componentes;
- adaptação à identidade corporativa em azul profundo;
- pouca dependência de movimento ornamental.

Além disso, a decisão de manter um design system único reduz retrabalho no front-end, facilita manutenção e evita variações visuais entre telas, que seriam especialmente prejudiciais em um sistema de gestão interna com regras operacionais delicadas.

## Alternativas descartadas

### 1. Design em tema claro

A alternativa de tema claro foi descartada porque o produto tem natureza operacional e o layout proposto define uma base escura como padrão. O modo claro não é necessário no v1 e adicionaria custo de manutenção e inconsistência visual.

### 2. Design system genérico e neutro

A opção de usar um sistema visual genérico sem identidade própria não representa o contexto da marca nem a intenção de uso do produto. O sistema de empréstimo interno precisa transmitir organização, confiança e vigilância; o azul profundo reforça isso sem tornar a interface pesada.

### 3. Componentes de UI baseados em biblioteca externa sem customização

Uma biblioteca de componentes fechada faria o sistema parecer genérico e entraria em conflito com a estética definida no layout. A experiência do produto exige controle de tokens, contrastes e detalhes de spacing que são específicos da operação do EmpresTI.

### 4. Layout com excesso de elementos decorativos

Gradientes fortes, luzes excessivas, sombras tridimensionais e uso muito agressivo de cor seriam incompatíveis com a proposta de uso funcional e enxuto do sistema. O layout definido elimina esse ruído visual.

## Consequências

### Fica mais fácil

- construir uma interface consistente em todas as telas;
- manter regras de negócio visíveis na própria UI;
- diferenciar ações, alertas e estados sem ambiguidades;
- reproduzir o layout do Figma com baixa variação entre componentes;
- manter uma linguagem visual fiel ao produto e à marca.

### Fica mais difícil

- ajustar o sistema para um tema claro ou uma identidade visual totalmente diferente;
- incorporar estilos totalmente genéricos ou muito “off-the-shelf”;
- adaptar o projeto a uma paleta mais vibrante ou a um visual mais comercializado.

### Impede

- criação de um design alternativo no mesmo produto sem necessidade de nova decisão de arquitetura visual;
- uso de modo claro sem revisão explícita da identidade visual;
- componente visual que desrespeite a paleta e as regras de contraste definidas pelo layout.

## O que esta decisão não cobre

- arquitetura de backend e persistência;
- definição de rotas e navegação de fluxo funcional;
- estrutura de dados, schema de domínio e regras de negócio executadas no servidor;
- implementação específica de cada tela em código.

## Resumo executivo

A decisão foi adotar o design system Nocturne adaptado à identidade azul profunda do EmpresTI como padrão visual oficial da interface. Isso posiciona o produto como ferramenta operacional, legível e coerente, com contraste adequado, densidade apropriada e regras visíveis de negócio em cada tela.
