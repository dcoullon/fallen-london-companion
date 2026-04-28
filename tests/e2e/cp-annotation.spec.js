const { test, expect } = require('@playwright/test');

async function postChoosebranch(page, messages) {
  await page.evaluate((msgs) => {
    window.postMessage({ source: 'fl-helper', type: 'choosebranch', data: { messages: msgs } }, '*');
  }, messages);
}

// Seeds _cpState via parseMyself using the pyramid CP formula.
// possession: { id, level, progressAsPercentage, category }
async function seedCpCache(page, possession) {
  await page.evaluate((p) => {
    window.postMessage({
      source: 'fl-helper', type: 'myself',
      data: { possessions: [{ possessions: [p] }] },
    }, '*');
  }, possession);
  // Brief wait so parseMyself runs before the next choosebranch
  await page.waitForTimeout(50);
}

const shadowy = {
  type: 'PyramidQualityChangeMessage',
  changeType: 'Unaltered',
  possession: { id: 210, name: 'Shadowy', nature: 'Status' },
  progressBar: { type: 'Pyramid', leftScore: 195, rightScore: 196, startPercentage: 96.0, endPercentage: 97.0 },
  message: "<span class='quality-name'>Shadowy</span> is increasing...",
  tooltip: '68 change points, 2 more needed to reach level 196.',
};

test.describe('CP annotation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/mock-page/cp-annotation.html');
    await page.waitForFunction(() => window.FL_HELPER_LOADED === true);
  });

  test('stat gain annotates with +1 CP span', async ({ page }) => {
    await postChoosebranch(page, [shadowy]);
    const span = page.locator('.fl-cp-val[data-item="Shadowy"]');
    await expect(span).toBeVisible({ timeout: 3000 });
    await expect(span).toContainText('+1 CP');
  });

  test('CP span inherits text color', async ({ page }) => {
    await postChoosebranch(page, [shadowy]);
    const span = page.locator('.fl-cp-val[data-item="Shadowy"]');
    await expect(span).toBeVisible({ timeout: 3000 });
    // color:inherit — span color should match parent, not a hardcoded green
    const spanColor = await span.evaluate(el => getComputedStyle(el).color);
    const parentColor = await span.evaluate(el => getComputedStyle(el.parentElement).color);
    expect(spanColor).toBe(parentColor);
  });

  test('zero-delta message produces no annotation', async ({ page }) => {
    await postChoosebranch(page, [{
      ...shadowy,
      progressBar: { ...shadowy.progressBar, startPercentage: 97.0, endPercentage: 97.0 },
    }]);
    await page.waitForTimeout(500);
    await expect(page.locator('.fl-cp-val')).toHaveCount(0);
  });

  test('level-up without cache produces no annotation', async ({ page }) => {
    await postChoosebranch(page, [{
      type: 'PyramidQualityChangeMessage',
      changeType: 'Gained',
      possession: { id: 999, name: 'Shadowy', nature: 'Status', level: 15 },
      progressBar: { type: 'Pyramid', leftScore: 14, rightScore: 15, startPercentage: 0.0, endPercentage: 100.0 },
      message: "<span class='quality-name'>Shadowy</span> is increasing...",
      tooltip: '2 change points, 13 more needed to reach level 16.',
    }]);
    await page.waitForTimeout(500);
    await expect(page.locator('.fl-cp-val')).toHaveCount(0);
  });

  test('level-up with cache shows correct delta', async ({ page }) => {
    // Seed via /myself: level 14 at 80% of 15-CP bar → cp=12
    // BasicAbility cap=70, totalCP=min(15,70)=15, cp=round(0.80*15)=12
    await seedCpCache(page, { id: 999, level: 14, progressAsPercentage: 80, category: 'BasicAbility' });

    // Level-up to 15 with 2 CP carry-over → delta = (15-12) + 2 = 5
    await postChoosebranch(page, [{
      type: 'PyramidQualityChangeMessage',
      changeType: 'Gained',
      possession: { id: 999, name: 'Shadowy', nature: 'Status', level: 15 },
      progressBar: { type: 'Pyramid', leftScore: 15, rightScore: 16, startPercentage: 0.0, endPercentage: 100.0 },
      message: "<span class='quality-name'>Shadowy</span> is increasing...",
      tooltip: '2 change points, 14 more needed to reach level 16.',
    }]);
    const span = page.locator('.fl-cp-val[data-item="Shadowy"]');
    await expect(span).toBeVisible({ timeout: 3000 });
    await expect(span).toContainText('+5 CP');
  });

  test('same-level with cache uses exact absolute delta', async ({ page }) => {
    // Seed via /myself: level 14 at 66.7% of 15-CP bar → cp=round(10.005)=10
    await seedCpCache(page, { id: 999, level: 14, progressAsPercentage: 66.7, category: 'BasicAbility' });

    // Same level, now at 13 CP → delta = 13 - 10 = 3
    await postChoosebranch(page, [{
      type: 'PyramidQualityChangeMessage',
      changeType: 'Unaltered',
      possession: { id: 999, name: 'Shadowy', nature: 'Status', level: 14 },
      progressBar: { type: 'Pyramid', leftScore: 14, rightScore: 15, startPercentage: 66.7, endPercentage: 86.7 },
      message: "<span class='quality-name'>Shadowy</span> is increasing...",
      tooltip: '13 change points, 2 more needed to reach level 15.',
    }]);
    const span = page.locator('.fl-cp-val[data-item="Shadowy"]');
    await expect(span).toBeVisible({ timeout: 3000 });
    await expect(span).toContainText('+3 CP');
  });
});
