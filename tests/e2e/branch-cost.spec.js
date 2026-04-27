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

  test('Tippy tooltip (real wrapper structure) gets echo value via quality-name span', async ({ page }) => {
    // Matches real Tippy DOM: data-tippy-root wrapper > .tippy-box[role=tooltip] > .tippy-content > ... span.quality-name
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

    await page.evaluate(() => {
      // Source element (the img Tippy attaches to)
      const source = document.createElement('img');
      source.setAttribute('aria-label', 'you need 1 x Piece of Rostygold');
      source.setAttribute('aria-describedby', 'tippy-test-1');
      document.body.appendChild(source);

      // Tippy wrapper structure matching what the game produces
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-tippy-root', '');
      wrapper.id = 'tippy-test-1';
      const box = document.createElement('div');
      box.className = 'tippy-box';
      box.setAttribute('role', 'tooltip');
      const content = document.createElement('div');
      content.className = 'tippy-content';
      const desc = document.createElement('div');
      desc.className = 'tooltip__desc';
      const p = document.createElement('p');
      const nameSpan = document.createElement('span');
      nameSpan.className = 'quality-name';
      nameSpan.textContent = 'Piece of Rostygold';
      p.appendChild(nameSpan);
      desc.appendChild(p);
      content.appendChild(desc);
      box.appendChild(content);
      wrapper.appendChild(box);
      document.body.appendChild(wrapper);
    });

    await page.waitForFunction(
      () => {
        const box = document.querySelector('#tippy-test-1 [role="tooltip"]');
        return box && box.textContent.includes('worth 0.01 E');
      },
      { timeout: 3000 }
    );
  });

  test('Tippy tooltip for data-quality-id icon injects unit price via PRICES', async ({ page }) => {
    // Fallback path: no quality-name span, but source has data-quality-id ancestor
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.setAttribute('data-quality-id', '375');
      const source = document.createElement('img');
      source.setAttribute('aria-label', 'Piece of Rostygold');
      source.setAttribute('aria-describedby', 'tippy-test-2');
      container.appendChild(source);
      document.body.appendChild(container);

      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-tippy-root', '');
      wrapper.id = 'tippy-test-2';
      const box = document.createElement('div');
      box.className = 'tippy-box';
      box.setAttribute('role', 'tooltip');
      const content = document.createElement('div');
      content.className = 'tippy-content';
      content.textContent = 'Piece of Rostygold';
      box.appendChild(content);
      wrapper.appendChild(box);
      document.body.appendChild(wrapper);
    });

    await page.waitForFunction(
      () => {
        const box = document.querySelector('#tippy-test-2 [role="tooltip"]');
        return box && box.textContent.includes('worth 0.01 E');
      },
      { timeout: 3000 }
    );
  });
});
