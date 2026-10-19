import { expect, test } from "@playwright/test";

test("test_ca_02_catalogo_exibe_equipamentos_e_estados", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Catálogo", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText("6 equipamentos · 3 disponíveis agora"),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(page.getByText("Regras de empréstimo")).toBeVisible();
  await expect(page.getByText("Manutenção", { exact: true })).toBeVisible();
});

test("test_ca_02_catalogo_filtra_por_categoria_e_disponibilidade", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Notebooks" }).click();
  await page.getByRole("button", { name: "Só disponíveis" }).click();

  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: 'MacBook Pro 14"' }),
  ).toBeVisible();
  await expect(page.getByText("PAT-1188")).not.toBeVisible();
});

test("test_ca_02_catalogo_busca_por_patrimonio", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("searchbox", { name: "Buscar no catálogo" })
    .fill("PAT-0233");

  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Sony A7 III" }),
  ).toBeVisible();
});
