// https://reqres.in/

import { test, expect } from "@playwright/test";
import users from "./test_data/users.json";

test("test api call GET List of Users", async ({ page }) => {
  const response = await page.request.get("https://reqres.in/api/users?page=2");
  await expect(response).toBeOK();
  const responseBody = await response.json();
  console.log("Response Body:", responseBody);
});

// moxy API test 1
test("data assertion - GET", async ({ page }) => {
  const response = await page.request.get("https://reqres.in/api/users?page=2");
  const responseBody = await response.json();
  await expect(responseBody.total).toBe(12);
  await expect(responseBody.data[0].last_name).toBe("Lawson");
  await expect(responseBody.data[1].last_name).toBe("Ferguson");
  await expect(responseBody.data.length).toBe(6);
  // await expect(responseBody.total).toEqual(responseBody.data.length);

  await expect(responseBody).toMatchObject({
    page: expect.any(Number),
    per_page: expect.any(Number),
    total: expect.any(Number),
    total_pages: expect.any(Number),
    data: expect.any(Array),
    support: { url: expect.any(String), text: expect.any(String) },
  });

  for (const user of responseBody.data) {
    await expect(user).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      first_name: expect.any(String),
      last_name: expect.any(String),
      avatar: expect.any(String),
    });
  }
});

// moxy API test 2
// test("data assertion - POST", async ({ page }) => {
// const newUser = {
//   name: "Jozko Mrkvicka",
//   job: "QA Tester",
// };

for (const newUser of users) {
  test(`data assertion - POST for user: ${newUser.name}`, async ({ page }) => {
    const response = await page.request.post("https://reqres.in/api/users", {
      data: newUser,
    });
    const responseBody = await response.json();
    console.log("Response Body:", responseBody);
    await expect(response.status()).toBe(201);
    console.log("HTTP Code:", response.status());
    await expect(responseBody.id).toBeDefined();
    console.log("New User ID:", responseBody.id);
    await expect(responseBody.createdAt).toBeDefined();
    const createdAtDate = new Date(responseBody.createdAt);
    console.log("Created at:", createdAtDate.toLocaleString("en-GB", { timeZone: "CET" }));
    const responseTime = response.timing().responseEnd - response.timing().requestStart;
    await expect(responseTime).toBeLessThan(200);
    console.log("Response time:", responseTime, "ms");
    await expect(responseBody).toMatchObject({
      name: newUser.name,
      job: newUser.job,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });
}
