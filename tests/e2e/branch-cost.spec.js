const { test, expect } = require('@playwright/test');

test.describe('branch cost hover annotation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/mock-page/storylet.html');
    await page.waitForFunction(() => window.FL_HELPER_LOADED === true);
  });

  test('quality requirement aria-label updated with echo value', async ({ page }) => {
    // Piece of Rostygold id=375, PRICES[375]=0.01; need 1 → worth 0.01 E
    await page.evaluate(() => {
      window.postMessage({
        source: 'fl-helper', type: 'storylet-begin',
        data: {
          storylet: {
            childBranches: [{
              name: 'Take the Risk',
              qualityRequirements: [{
                qualityId: 375,
                qualityName: 'Piece of Rostygold',
                tooltip: 'you need 1 x Piece of Rostygold',
                category: 'Thing',
              }],
            }],
          },
        },
      }, '*');
    });

    // Inject the quality-requirement div as the game would render it
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'icon quality-requirement';
      const btn = document.createElement('div');
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', 'you need 1 x Piece of Rostygold');
      container.appendChild(btn);
      document.getElementById('test-branch').appendChild(container);
    });

    await page.waitForFunction(
      () => !!document.querySelector('[role="button"][aria-label*="worth 0.01 E"]'),
      { timeout: 3000 }
    );
  });

  test('quantity multiplied: you need 25 × price shows total', async ({ page }) => {
    // Piece of Rostygold id=375, PRICES[375]=0.01; need 25 → worth 0.25 E
    await page.evaluate(() => {
      window.postMessage({
        source: 'fl-helper', type: 'storylet-begin',
        data: {
          storylet: {
            childBranches: [{
              name: 'Take the Risk',
              qualityRequirements: [{
                qualityId: 375,
                qualityName: 'Piece of Rostygold',
                tooltip: 'you need 25 x Piece of Rostygold',
                category: 'Thing',
              }],
            }],
          },
        },
      }, '*');
    });

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'icon quality-requirement';
      const btn = document.createElement('div');
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', 'you need 25 x Piece of Rostygold');
      container.appendChild(btn);
      document.getElementById('test-branch').appendChild(container);
    });

    await page.waitForFunction(
      () => !!document.querySelector('[role="button"][aria-label*="worth 0.25 E"]'),
      { timeout: 3000 }
    );
  });

  test('data-quality-id icon gets unit price annotation', async ({ page }) => {
    // Inject a generic icon with data-quality-id — no "you need" text, shows unit price
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.setAttribute('data-quality-id', '375');
      const btn = document.createElement('div');
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', 'Piece of Rostygold');
      container.appendChild(btn);
      document.body.appendChild(container);
    });

    await page.waitForFunction(
      () => !!document.querySelector('[role="button"][aria-label*="worth 0.01 E"]'),
      { timeout: 3000 }
    );
  });

  test('Tippy tooltip gets echo value injected via costByQuality', async ({ page }) => {
    // Simulate receiving storylet-begin data, then a Tippy tooltip appearing
    // Piece of Rostygold id=375, PRICES[375]=0.01; need 1 → worth 0.01 E
    await page.evaluate(() => {
      window.postMessage({
        source: 'fl-helper', type: 'storylet-begin',
        data: {
          storylet: {
            childBranches: [{
              name: 'Take the Risk',
              qualityRequirements: [{
                qualityId: 375,
                qualityName: 'Piece of Rostygold',
                tooltip: 'you need 1 x Piece of Rostygold',
                category: 'Thing',
              }],
            }],
          },
        },
      }, '*');
    });

    // Inject a Tippy-style tooltip element referencing the quality name
    await page.evaluate(() => {
      const source = document.createElement('img');
      source.setAttribute('aria-label', 'you need 1 x Piece of Rostygold');
      source.setAttribute('aria-describedby', 'tippy-test-1');
      document.body.appendChild(source);

      const tooltip = document.createElement('div');
      tooltip.id = 'tippy-test-1';
      tooltip.setAttribute('role', 'tooltip');
      const content = document.createElement('div');
      content.className = 'tippy-content';
      content.textContent = 'you need 1 x Piece of Rostygold';
      tooltip.appendChild(content);
      document.body.appendChild(tooltip);
    });

    await page.waitForFunction(
      () => {
        const el = document.getElementById('tippy-test-1');
        return el && el.textContent.includes('worth 0.01 E');
      },
      { timeout: 3000 }
    );
  });

  test('Tippy tooltip for data-quality-id icon injects unit price', async ({ page }) => {
    // Tooltip attached to an element with data-quality-id ancestor
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.setAttribute('data-quality-id', '375');
      const source = document.createElement('img');
      source.setAttribute('aria-label', 'Piece of Rostygold');
      source.setAttribute('aria-describedby', 'tippy-test-2');
      container.appendChild(source);
      document.body.appendChild(container);

      const tooltip = document.createElement('div');
      tooltip.id = 'tippy-test-2';
      tooltip.setAttribute('role', 'tooltip');
      const content = document.createElement('div');
      content.className = 'tippy-content';
      content.textContent = 'Piece of Rostygold';
      tooltip.appendChild(content);
      document.body.appendChild(tooltip);
    });

    await page.waitForFunction(
      () => {
        const el = document.getElementById('tippy-test-2');
        return el && el.textContent.includes('worth 0.01 E');
      },
      { timeout: 3000 }
    );
  });
});
