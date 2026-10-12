// https://reqres.in/

import { test, expect } from "@playwright/test";

test("test api call GET List of Users", async ({ page }) => {
  const response = await page.request.get("https://reqres.in/api/users?page=2");
  expect(response.ok()).toBeTruthy();
  const responseBody = await response.json();
  expect(responseBody.page).toBe(2);
  expect(responseBody.data.length).toBeGreaterThan(0);
});
