const { test, expect } = require('@playwright/test');

// Sends a choosebranch postMessage from within the page context.
async function postChoosebranch(page, messages) {
  await page.evaluate((msgs) => {
    window.postMessage({ source: 'fl-helper', type: 'choosebranch', data: { messages: msgs } }, '*');
  }, messages);
}

test.describe('echo overlay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/mock-page/choosebranch.html');
    await page.waitForFunction(() => window.FL_HELPER_LOADED === true);
  });

  test('single priced gain annotates with echo value span', async ({ page }) => {
    // Piece of Rostygold id=375, PRICES[375]=0.01; 1 gained = +0.01 echoes
    await postChoosebranch(page, [
      {
        type: 'StandardQualityChangeMessage',
        changeType: 'Decreased',          // inverted: Decreased = gained
        possession: { id: 375, name: 'Piece of Rostygold', nature: 'Thing' },
        message: 'You\'ve gained 1 x Piece of Rostygold (new total 10). ',
      },
    ]);

    const span = page.locator('.fl-echo-val[data-item="Piece of Rostygold"]');
    await expect(span).toBeVisible({ timeout: 3000 });
    await expect(span).toContainText('+0.01 echoes');
  });

  test('single priced loss annotates with negative echo value', async ({ page }) => {
    // 10 lost = −0.10 echoes
    await postChoosebranch(page, [
      {
        type: 'StandardQualityChangeMessage',
        changeType: 'Increased',          // inverted: Increased = lost
        possession: { id: 375, name: 'Piece of Rostygold', nature: 'Thing' },
        message: 'You\'ve lost 10 x Piece of Rostygold (new total 0). ',
      },
    ]);

    const span = page.locator('.fl-echo-val[data-item="Piece of Rostygold"]');
    await expect(span).toBeVisible({ timeout: 3000 });
    await expect(span).toContainText('−0.10 echoes');
  });

  test('multi-item result shows net-total inline element', async ({ page }) => {
    // Reveal the multi-result div so annotateResults can find the text nodes
    await page.evaluate(() => {
      document.getElementById('multi-result').style.display = '';
    });

    // Nodule of Deep Amber id=385 (price 0.005 each) × 2000 = +10.00
    // Bottle of Greyfields 1882 id=383 (price 0.02 each) × 375 = −7.50  => net +2.50
    await postChoosebranch(page, [
      {
        type: 'StandardQualityChangeMessage',
        changeType: 'Decreased',
        possession: { id: 385, name: 'Nodule of Deep Amber', nature: 'Thing' },
        message: 'You\'ve gained 2,000 x Nodule of Deep Amber. ',
      },
      {
        type: 'StandardQualityChangeMessage',
        changeType: 'Increased',
        possession: { id: 383, name: 'Bottle of Greyfields 1882', nature: 'Thing' },
        message: 'You\'ve lost 375 x Bottle of Greyfields 1882. ',
      },
    ]);

    await expect(page.locator('.fl-echo-val')).toHaveCount(2, { timeout: 3000 });
    const netEl = page.locator('#fl-net-inline');
    await expect(netEl).toBeVisible({ timeout: 3000 });
    await expect(netEl).toContainText('Net total');
  });

  test('unpriced item is ignored', async ({ page }) => {
    await postChoosebranch(page, [
      {
        type: 'StandardQualityChangeMessage',
        changeType: 'Decreased',
        possession: { id: 99999, name: 'Unknown Rarity', nature: 'Thing' },
        message: 'You\'ve gained 1 x Unknown Rarity. ',
      },
    ]);

    // Wait a moment to confirm nothing appears
    await page.waitForTimeout(600);
    await expect(page.locator('.fl-echo-val')).toHaveCount(0);
  });
});
