import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("page 404 affiche le bon contenu", async ({ page }) => {
    await page.goto("/page-qui-existe-pas");
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=Page introuvable")).toBeVisible();
  });

  test("la navbar affiche le logo PixelNova", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: "PixelNova" })).toBeVisible();
  });

  test("le toggle theme est visible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTitle("Mode clair").first()).toBeVisible();
  });
});
