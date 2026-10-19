// https://www.saucedemo.com/

import { test, expect } from "@playwright/test";

test("login with valid credentials & check assertions", async ({ page }) => {
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

test("login fail cases", async ({ page }) => {
  const login_cases = [
    { user: "standard_user", pass: "wrong_password", error: "Epic sadface: Username and password do not match any user in this service" },
    { user: "wrong_user", pass: "secret_sauce", error: "Epic sadface: Username and password do not match any user in this service" },
    { user: "", pass: "secret_sauce", error: "Epic sadface: Username is required" },
    { user: "wrong_user", pass: "", error: "Epic sadface: Password is required" },
    { user: "locked_out_user", pass: "secret_sauce", error: "Epic sadface: Sorry, this user has been locked out." },
  ];
  for (const lc of login_cases) {
    await page.goto("https://www.saucedemo.com/");
    await page.fill("#user-name", lc.user);
    await page.fill("#password", lc.pass);
    await page.click("#login-button");
    await expect(page.locator('[data-test="error"]')).toHaveText(lc.error);
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  }
});

test("shopping cart functionality", async ({ page }) => {
  await expect(page.goto("https://www.saucedemo.com/"));

  // Login with standard user
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");

  // Add 3 items to Shopping Cart
  await page.click("#add-to-cart-sauce-labs-backpack");
  await expect(page.locator("#remove-sauce-labs-backpack")).toBeVisible();
  await page.click("#add-to-cart-sauce-labs-bolt-t-shirt");
  await expect(page.locator("#remove-sauce-labs-bolt-t-shirt")).toBeVisible();
  await page.click("#add-to-cart-sauce-labs-fleece-jacket");
  await expect(page.locator("#remove-sauce-labs-fleece-jacket")).toBeVisible();

  // Verify that 3 items were added & then go to the Shopping Cart
  await expect(page.locator(".shopping_cart_link")).toHaveAttribute("aria-label", "Cart, 3 items");
  await page.click("#shopping_cart_container");
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  // Remove the Fleece Jacket item from the Shopping Cart, then continue shopping and verify that the item was removed and the cart count is updated
  await page.click("#remove-sauce-labs-fleece-jacket");
  await page.click("#continue-shopping");
  await expect(page.locator(".shopping_cart_link")).toHaveAttribute("aria-label", "Cart, 2 items");
  await expect(page.locator("#add-to-cart-sauce-labs-fleece-jacket")).toHaveText("Add to cart");

  // Checkout the 2 items in the Shopping Cart, fill in the required information, and verify that the order was completed successfully
  await page.click("#shopping_cart_container");
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  await page.click("#checkout");
  await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
  await expect(page.locator(".title")).toHaveText("Checkout: Your Information");
  await page.fill("#first-name", "Jozko");
  await page.fill("#last-name", "Mrkvicka");
  await page.fill("#postal-code", "04001");
  await page.click("#continue");
  await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
  await expect(page.locator(".title")).toHaveText("Checkout: Overview");
  await expect(page.locator(".summary_info_label")).toHaveText(["Payment Information:", "Shipping Information:", "Price Total"]);
  await page.click("#finish");
  await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
  await expect(page.locator(".title")).toHaveText("Checkout: Complete!");
  await expect(page.locator("#back-to-products")).toBeVisible();
  await expect(page.locator("#generate-pdf-order")).toBeVisible();
});

//
