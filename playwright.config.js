const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 10000,
  use: {
    baseURL: 'http://localhost:8099',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node tests/serve.js',
    url: 'http://localhost:8099/tests/mock-page/choosebranch.html',
    reuseExistingServer: !process.env.CI,
  },
});
