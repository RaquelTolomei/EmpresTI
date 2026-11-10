---
name: imagens-equipamentos
description: "Prepare imagens de equipamentos para o sistema usando a API do Pixabay. Use quando for buscar, selecionar, recortar, validar, catalogar ou preparar fotos para o Supabase Storage, exigindo 800x600, uma foto única por equipamento, sem pessoas, marcas ou logos legíveis, com créditos preservados."
argument-hint: "Informe os equipamentos e, se disponível, a pasta de saída."
---

# Imagens de equipamentos do Pixabay

## Objetivo

Preparar fotos distintas para os equipamentos e manter um registro auditável da
origem de cada imagem. A skill pode organizar os arquivos e o manifesto local
e, quando houver solicitação, enviar os arquivos ao Supabase Storage do deploy.

## Regras obrigatórias

- Pesquisar imagens pela API oficial do Pixabay
  (`https://pixabay.com/api/pt/` ou pelo endpoint documentado pela conta).
- Manter a chave da API fora de código, arquivos gerados, logs, manifesto,
  prompts, commits e repositório. Lê-la somente de uma variável de ambiente ou
  segredo já configurado. Se não estiver disponível, parar e informar o
  bloqueio.
- Usar apenas ferramentas, bibliotecas e comandos permitidos pelas rules e pelos
  ADRs do projeto. Não instalar dependências novas sem autorização.
- Selecionar somente fotos sem pessoas visíveis, marcas identificáveis ou logos
  e textos de marca legíveis. `safesearch` não substitui a inspeção visual;
  rejeitar qualquer imagem em caso de dúvida.
- Entregar cada arquivo final com exatamente `800x600` pixels. Aplicar recorte
  central ou focal e redimensionamento com uma ferramenta já permitida, sem
  distorcer o equipamento.
- Usar uma única foto, diferente, para cada equipamento. Conferir o `id` do
  Pixabay e, quando possível, comparar também o hash com o manifesto inteiro.
- Registrar os créditos de cada imagem: equipamento, nome do arquivo, `id` do
  Pixabay, página da imagem, autor, URL usada, data de coleta e transformações.
- Exibir **“Fotos: Pixabay”** na interface que mostra as fotos, com link para
  `https://pixabay.com/pt/`, conforme as diretrizes da API.
- Considerar público o bucket de destino no Supabase Storage. Upload,
  configuração do bucket e qualquer alteração no deploy exigem autorização
  explícita do responsável e registro da evidência.

## Fluxo de trabalho

1. Confirmar o escopo (frontend, backend ou ambos), listar os equipamentos e
   localizar a spec, o ADR e as rules relevantes antes de editar código.
2. Confirmar a pasta de saída e verificar se já existe um manifesto. Carregar
   os IDs e hashes usados para evitar repetições.
3. Pesquisar no Pixabay com termos específicos para cada equipamento, usando
   `image_type=photo`, `safesearch=true` e orientação horizontal quando útil.
   Buscar outros candidatos se os primeiros forem rejeitados.
4. Abrir a página de cada candidato e inspecionar a imagem em tamanho
   suficiente. Rejeitar imagens com pessoas ou partes de pessoas, marcas,
   logos, embalagens ou texto de marca legível. Registrar o motivo da rejeição
   sem salvar conteúdo desnecessário.
5. Escolher um candidato ainda não utilizado, baixar a imagem sem expor a chave
   e gerar o arquivo final em `800x600`, preservando o enquadramento do
   equipamento.
6. Validar formato aceito pelo projeto, dimensões exatas, leitura do arquivo e
   ausência de repetição por ID ou hash. Se qualquer verificação falhar,
   substituir o candidato.
7. Salvar o manifesto de créditos junto dos arquivos, sem incluir a chave da
   API. Usar o formato já adotado pelo projeto; se não houver um, preferir JSON
   com uma entrada por equipamento.
8. Enviar os arquivos ao bucket público somente com autorização do responsável
   e registrar os caminhos ou URLs resultantes. Sem autorização, entregar a
   pasta preparada e indicar claramente os caminhos esperados, sem afirmar que
   houve upload (`public/equipment-images/`).
9. Se a tela ou o contrato for alterado, seguir o fluxo SDD do projeto e
   garantir que a tela de fotos mostre **“Fotos: Pixabay”** como link.

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

- Cada equipamento solicitado tem exatamente uma imagem.
- Todos os arquivos têm dimensões `800x600`.
- Os valores de `pixabayId` e `sha256` não se repetem.
- A inspeção visual não encontrou pessoas, marcas ou logos legíveis.
- O manifesto de créditos está presente e não contém segredos.
- A tela exibe **“Fotos: Pixabay”** com link.
- A entrega diferencia arquivos preparados de arquivos enviados. Sem acesso ao
  deploy, o upload fica pendente para o responsável.
