import { expect, test } from "@playwright/test";

test("test_ca_01_tela_login_apresenta_campos_da_interface", async ({
  page,
}) => {
  await page.goto("/login");

  await expect(page.locator('[data-screen-label="01 Login"]')).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Entrar", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "E-mail" })).toBeVisible();
  await expect(page.getByLabel("Senha")).toHaveAttribute("type", "password");
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("test_ca_01_tela_login_se_adapta_a_telas_estreitas", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: "Entrar", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "E-mail" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});
