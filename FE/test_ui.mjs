import { test, expect, chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  
  await page.goto('http://localhost:5173/reading');
  await page.waitForTimeout(2000);
  console.log('Reading page text:');
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 1000));
  
  await page.goto('http://localhost:5173/mock-test');
  await page.waitForTimeout(2000);
  console.log('Mock page text:');
  const mockText = await page.evaluate(() => document.body.innerText);
  console.log(mockText.substring(0, 1000));
  
  await browser.close();
})();
