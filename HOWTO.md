# Fallen London Companion — How-To

## Developer workflow (rapid iteration)

### One-time setup
```
npm install
npx playwright install chromium
```

### Auto-reload dev loop (Firefox)
```
npm run dev
```
Opens Firefox with the extension loaded from `extension/`. Any file change auto-reloads the extension — no manual remove/reinstall needed. The first run will open Fallen London; log in and the session is saved in `profiles/fl-dev/`.

### Automated tests (no browser needed, no login)
```
npm test           # 10 unit tests (pure functions, instant)
npm run test:e2e   # Playwright DOM tests (Chromium, headless)
npm run test:all   # both in sequence
```
The Playwright tests load the extension scripts directly into a mock page and post simulated API messages to verify DOM output. They cover: echo value overlay, renown bar injection, cross-conversion bar injection, and branch cost annotations.

### Other scripts
```
npm run lint   # web-ext lint
npm run build  # web-ext build → dist/
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
