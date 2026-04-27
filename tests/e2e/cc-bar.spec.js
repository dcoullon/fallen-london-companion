const { test, expect } = require('@playwright/test');

// /myself payload that includes two CC items so we can verify quantities.
// id=668 = Brilliant Soul, id=828 = Tale of Terror!! (mw:true)
const MYSELF_PAYLOAD = {
  possessions: [
    {
      name: 'Goods',
      possessions: [
        // A conversion item is required so injectRenownBar runs first (CC bar depends on it)
        { id: 755, name: 'Ornate Typewriter', level: 3, image: 'typewriter' },
        // CC items
        { id: 668,  name: 'Brilliant Soul',    level: 5  },
        { id: 828,  name: 'Tale of Terror!!',  level: 12 },
      ],
    },
  ],
};

test.describe('cross-conversion bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/mock-page/possessions.html');
    await page.waitForFunction(() => window.FL_HELPER_LOADED === true);
  });

  test('injects below the renown bar after receiving myself data', async ({ page }) => {
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, MYSELF_PAYLOAD);

    await expect(page.locator('#fl-renown-bar')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#fl-cc-bar')).toBeVisible({ timeout: 3000 });

    // CC bar must appear after (below) the renown bar in DOM order
    const order = await page.evaluate(() => {
      const renown = document.getElementById('fl-renown-bar');
      const cc     = document.getElementById('fl-cc-bar');
      return renown.compareDocumentPosition(cc) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    expect(order).toBeTruthy();
  });

  test('renders all 13 CC items', async ({ page }) => {
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, MYSELF_PAYLOAD);

    await expect(page.locator('#fl-cc-bar')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#fl-cc-bar li.item')).toHaveCount(13);
  });

  test('shows correct quantity badges from myself data', async ({ page }) => {
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, MYSELF_PAYLOAD);

    await expect(page.locator('#fl-cc-bar')).toBeVisible({ timeout: 3000 });

    // Brilliant Soul (first item in CC_ITEMS) should show qty 5
    const firstBadge = page.locator('#fl-cc-bar .icon__value').first();
    await expect(firstBadge).toHaveText('5');
  });

  test('grays out items with qty=0', async ({ page }) => {
    await page.evaluate((payload) => {
      window.postMessage({ source: 'fl-helper', type: 'myself', data: payload }, '*');
    }, MYSELF_PAYLOAD);

    await expect(page.locator('#fl-cc-bar')).toBeVisible({ timeout: 3000 });

    // Items not in the payload should be rendered with opacity 0.35
    const zeroItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#fl-cc-bar .icon'))
        .filter(el => el.style.opacity === '0.35').length;
    });
    // 13 total − 2 with qty > 0 = 11 grayed out
    expect(zeroItems).toBe(11);
  });
});
