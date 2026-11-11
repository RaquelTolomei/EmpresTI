---
name: imagens-equipamentos
description: "Prepare fotos de equipamentos para o sistema com a API do Pixabay. Use para pesquisar, escolher, recortar, validar, catalogar ou preparar imagens para o Supabase Storage, sempre com 800x600, uma foto exclusiva por equipamento, sem pessoas, marcas ou logos legíveis e com os créditos preservados."
argument-hint: "Informe os equipamentos e, se disponível, a pasta de saída."
---

# Fotos de equipamentos do Pixabay

## Objetivo

Preparar uma foto diferente para cada equipamento e manter um registro rastreável
da origem de cada imagem. A skill organiza os arquivos e o manifesto local e,
quando solicitado, envia os arquivos ao Supabase Storage do deploy.

## Regras obrigatórias

- Fazer a pesquisa pela API oficial do Pixabay
  (`https://pixabay.com/api/pt/` ou pelo endpoint documentado pela conta).
- Nunca expor a chave da API em código, arquivos gerados, logs, manifesto,
  prompts, commits ou no repositório. Ler a chave apenas de uma variável de
  ambiente ou segredo já configurado. Se ela não estiver disponível, parar e
  informar o bloqueio.
- Usar somente ferramentas, bibliotecas e comandos permitidos pelas rules e
  pelos ADRs do projeto. Não instalar dependências novas sem autorização.
- Escolher apenas fotos sem pessoas visíveis, marcas identificáveis, logos ou
  textos de marca legíveis. `safesearch` não substitui a inspeção visual;
  rejeitar a imagem sempre que houver dúvida.
- Gerar cada arquivo final com exatamente `800x600` pixels. Aplicar recorte
  central ou focal e redimensionar com uma ferramenta já permitida, sem
  deformar o equipamento.
- Usar uma foto única e diferente para cada equipamento. Conferir o `id` do
  Pixabay e, quando possível, comparar também o hash com todo o manifesto.
- Registrar os créditos de cada imagem: equipamento, nome do arquivo, `id` do
  Pixabay, página da imagem, autor, URL utilizada, data de coleta e
  transformações.
- Mostrar **“Fotos: Pixabay”** na interface que exibe as fotos, com link para
  `https://pixabay.com/pt/`, conforme as diretrizes da API.
- Tratar o bucket de destino no Supabase Storage como público. Upload,
  configuração do bucket e qualquer alteração no deploy exigem autorização
  explícita do responsável, além do registro da evidência.

## Fluxo de trabalho

1. Confirmar o escopo (frontend, backend ou ambos), listar os equipamentos e
   localizar a spec, o ADR e as rules relevantes antes de editar código.
2. Confirmar a pasta de saída e verificar se já existe um manifesto. Carregar
   os IDs e hashes já utilizados para evitar duplicidades.
3. Pesquisar no Pixabay com termos específicos para cada equipamento, usando
   `image_type=photo`, `safesearch=true` e orientação horizontal quando fizer
   sentido. Procurar novos candidatos se os primeiros forem rejeitados.
4. Abrir a página de cada candidato e inspecionar a imagem em tamanho
   suficiente. Rejeitar imagens com pessoas ou partes de pessoas, marcas,
   logos, embalagens ou textos de marca legíveis. Registrar o motivo da
   rejeição sem salvar conteúdo desnecessário.
5. Escolher um candidato ainda não usado, baixar a imagem sem expor a chave e
   gerar o arquivo final em `800x600`, preservando o enquadramento do
   equipamento.
6. Validar o formato aceito pelo projeto, as dimensões exatas, a leitura do
   arquivo e a ausência de repetição por ID ou hash. Se alguma verificação
   falhar, substituir o candidato.
7. Salvar o manifesto de créditos junto dos arquivos, sem incluir a chave da
   API. Usar o formato já adotado pelo projeto; se não houver um, preferir JSON
   com uma entrada para cada equipamento.
8. Enviar os arquivos ao bucket público somente com autorização do responsável
   e registrar os caminhos ou URLs resultantes. Sem autorização, entregar a
   pasta preparada e indicar claramente os caminhos esperados, sem afirmar que
   o upload foi feito (`public/equipment-images/`).
9. Se a tela ou o contrato mudar, seguir o fluxo SDD do projeto e garantir que
   a tela de fotos mostre **“Fotos: Pixabay”** como link.

## Campos do manifesto

Cada entrada deve conter:

```json
{
  "equipment": "nome-do-equipamento",
  "filename": "nome-do-equipamento.webp",
  "pixabayId": 123456,
  "pixabayPageUrl": "https://pixabay.com/pt/photos/...",
  "author": "autor informado pelo Pixabay",
  "sourceUrl": "URL de download usada",
  "collectedAt": "data ISO-8601",
  "width": 800,
  "height": 600,
  "sha256": "hash do arquivo final",
  "transformations": "recorte e redimensionamento aplicados"
}
```

## Conferência final

- Cada equipamento solicitado possui exatamente uma imagem.
- Todos os arquivos têm dimensões `800x600`.
- Os valores de `pixabayId` e `sha256` são únicos.
- A inspeção visual não encontrou pessoas, marcas ou logos legíveis.
- O manifesto de créditos está presente e não contém segredos.
- A tela exibe **“Fotos: Pixabay”** com link.
- A entrega diferencia arquivos preparados de arquivos enviados. Sem acesso ao
  deploy, o upload permanece pendente para o responsável.
