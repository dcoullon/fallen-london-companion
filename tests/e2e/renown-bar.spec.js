const { test, expect } = require('@playwright/test');

// Minimal /myself payload with two faction items so the renown bar injects via API data.
// id=755 = Ornate Typewriter (Bohemians); id=748 = Antique Constable's Badge (Constables).
const MYSELF_PAYLOAD = {
  possessions: [
    {
      name: 'Goods',
      possessions: [
        { id: 755, name: 'Ornate Typewriter',          level: 3, image: 'typewriter' },
        { id: 748, name: "Antique Constable's Badge",  level: 1, image: 'copper'     },
        { id: 99901, name: 'Favours: Bohemians',       level: 4  },
        { id: 99902, name: 'Renown: Bohemians',        level: 10 },
        { id: 99903, name: 'Favours: Constables',      level: 2  },
        { id: 99904, name: 'Renown: Constables',       level: 5  },
      ],
    },
  ],
};

test.describe('renown bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/mock-page/possessions.html');
    await page.waitForFunction(() => window.FL_HELPER_LOADED === true);
  });

  test('injects below the search input after receiving myself data', async ({ page }) => {
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, MYSELF_PAYLOAD);

    await expect(page.locator('#fl-renown-bar')).toBeVisible({ timeout: 3000 });

    // Both Bohemians and Constables items should appear
    await expect(page.locator('#fl-renown-bar li.item')).toHaveCount(2);
  });

  test('shows correct favours/renown stats under each icon', async ({ page }) => {
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, MYSELF_PAYLOAD);

    await expect(page.locator('#fl-renown-bar')).toBeVisible({ timeout: 3000 });

    const stats = page.locator('#fl-renown-bar .fl-faction-stats');
    // Bohemians: 4/7 · 10/55
    await expect(stats.first()).toContainText('4/7 · 10/55');
  });

  test('injects via DOM fallback when no myself message is sent', async ({ page }) => {
    // The possessions.html has data-quality-id tiles for id=755 and id=748.
    // injectRenownBar falls back to reading those tiles when _cachedConversionItems is null.
    await expect(page.locator('#fl-renown-bar')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#fl-renown-bar li.item').first()).toBeVisible();
  });

  test('re-injects with fresh data when myself message updates counts', async ({ page }) => {
    // First injection from DOM fallback
    await expect(page.locator('#fl-renown-bar')).toBeVisible({ timeout: 3000 });

    // Now send myself with different qty for Bohemians
    const updated = JSON.parse(JSON.stringify(MYSELF_PAYLOAD));
    updated.possessions[0].possessions[0].level = 7; // Bohemians qty → 7
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, updated);

    // parseMyself removes the bar; setInterval re-injects it with fresh data
    const badge = page.locator('#fl-renown-bar .icon__value').first();
    await expect(badge).toHaveText('7', { timeout: 3000 });
  });
});
