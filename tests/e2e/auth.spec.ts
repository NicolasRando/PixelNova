import { test, expect } from "@playwright/test";

test.describe("Authentification", () => {
  test("redirige vers /login si non connecte", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("affiche le formulaire de login", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("affiche le formulaire de register", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("lien vers register depuis login", async ({ page }) => {
    await page.goto("/login");
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/\/register/);
  });

  test("lien vers login depuis register", async ({ page }) => {
    await page.goto("/register");
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/\/login/);
  });

  test("affiche une erreur avec des identifiants invalides", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "fake@fake.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Email ou mot de passe incorrect")).toBeVisible({ timeout: 5000 });
  });
});
