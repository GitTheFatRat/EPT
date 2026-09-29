import { test, expect, chromium } from '@playwright/test';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/register');
  await page.fill('input[name="fullName"]', 'TestAccount02');
  await page.fill('input[name="email"]', 'testaccount02@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  await page.click('button[type="submit"]'); // Complete setup
  
  await page.waitForTimeout(2000);
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 500));
  
  await browser.close();
})();
