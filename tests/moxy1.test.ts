// https://www.saucedemo.com/

import { test, expect } from "@playwright/test";

test("login with valid credentials", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // Check the login logo value - Swag Labs
  await expect(page.locator(".login_logo")).toHaveText("Swag Labs");

  // Make sure the username and password fields are visible and enabled
  await expect(page.locator("#user-name")).toBeVisible();
  await expect(page.locator("#user-name")).toBeEnabled();
  await expect(page.locator("#password")).toBeVisible();
  await expect(page.locator("#password")).toBeEnabled();

  // Fill in the username and password fields with standard user credentials
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");

  // Click the login button
  await expect(page.locator("#login-button")).toBeVisible();
  await expect(page.locator("#login-button")).toBeEnabled();
  await page.click("#login-button");

  // Expect to be redirected to the inventory page
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  // Assert that the inventory page contains the expected elements
  await expect(page.locator(".title")).toHaveText("Products");
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
  await expect(page.locator(".inventory_list")).toBeVisible();
  await expect(page.locator(".inventory_item")).toHaveCount(6);
});

// test("login with invalid credentials", async ({ page }) => {
