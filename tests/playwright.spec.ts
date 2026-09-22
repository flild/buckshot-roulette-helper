import { test, expect } from '@playwright/test';

test('language switcher works', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // wait for it to load
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'screenshots/app_default.png' });

  // click lang switcher if it exists
  const switcher = page.locator('button', { hasText: 'EN / RU' });
  if (await switcher.isVisible()) {
    await switcher.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/app_switched.png' });
  } else {
     const switcher2 = page.locator('button', { hasText: 'RU / EN' });
     if (await switcher2.isVisible()) {
         await switcher2.click();
         await page.waitForTimeout(1000);
         await page.screenshot({ path: 'screenshots/app_switched.png' });
     }
  }
});
