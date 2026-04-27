# Fallen London Companion — How-To

## Developer workflow (rapid iteration)

### One-time setup (first clone only)
```
npm install
npx playwright install chromium
```

### Starting a dev session
Open a PowerShell window, `cd` to the project, then:
```
cmd /c "npm run dev"
```
A separate Firefox window opens on Fallen London with the extension loaded. Log in with the test account (credentials in Claude memory). Keep this window open while working — any file save in `extension/` auto-reloads the extension. No manual remove/reinstall ever needed.

> **Note:** npm scripts must be run via `cmd /c "npm run ..."` in PowerShell due to execution policy. Alternatively open a plain `cmd` window and run npm commands directly.

### Verifying a change after editing code
```
cmd /c "npm run test:all"
```
Runs 10 unit tests + 12 Playwright DOM tests headlessly. Green = logic is correct. Takes ~35 seconds.

To run just the Playwright tests:
```
cmd /c "npm run test:e2e"
```

For a specific test file:
```
cmd /c "npx playwright test tests/e2e/echo-overlay.spec.js"
```

### Visual check in Firefox
After `npm run dev` is running, changes you save are picked up automatically. Switch to the Firefox dev window to see the result — no reload needed.

To confirm the extension is loaded in that window: go to `about:debugging#/runtime/this-firefox` and look for "Fallen London Companion" under Temporary Extensions.

### Other scripts
```
cmd /c "npm run lint"    # web-ext lint
cmd /c "npm run build"   # web-ext build → dist/
```

---

## Links

- **GitHub**: https://github.com/dcoullon/fallen-london-companion
- **Mozilla Add-ons (AMO) developer dashboard**: https://addons.mozilla.org/en-US/developers/addons

---

## Testing the extension in Firefox (temporary install)

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click **"Load Temporary Add-on…"**
3. Navigate to the `extension/` folder and select `manifest.json`
4. Open https://www.fallenlondon.com — the extension is now active

### Updating after a code change

**Do not use the Reload button** — it does not reliably pick up all changes (manifest, new files, etc.).

Instead, do a full remove + reinstall every time:
1. Click **Remove** next to the extension in `about:debugging`
2. Click **"Load Temporary Add-on…"** again and re-select `manifest.json`

> Temporary installs are cleared when Firefox closes. Repeat from step 2 each session.

---

## Deploying a signed build (Firefox for Android / AMO)

1. Zip the `extension/` folder contents (not the folder itself):
   ```
   cd extension && zip -r ../dist/fallen_london_companion.zip .
   ```
2. Go to the AMO developer dashboard (link above)
3. Submit the zip — choose **"On your own"** track for self-distribution (no AMO review wait)
4. Download the signed `.xpi`
5. On Firefox Android: open the `.xpi` URL directly to install
