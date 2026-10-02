import { expect, test } from "@playwright/test";

test("carrega a página inicial do scaffold", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Hello world!")).toBeVisible();
});
