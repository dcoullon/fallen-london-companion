# Firefox Extension — How-To

## Clean install (temporary, survives until Firefox restarts)

1. Open `about:debugging` in the address bar
2. Click **This Firefox** in the left sidebar
3. If the extension is already listed, click **Remove** next to it
4. Click **Load Temporary Add-on…**
5. Navigate to `extension/` inside this project folder and select `manifest.json`

   **Important:** select the `manifest.json` file directly from the `extension/` folder — do NOT load from a zip file. Loading a zip gives you a frozen snapshot; changes to source files will have no effect.
6. Switch to the Fallen London tab and hard-reload: `Ctrl+Shift+R`

Temporary add-ons are wiped on every Firefox restart — repeat from step 4 each session.

## Reloading after a code change (no full reinstall needed)

1. `about:debugging` → This Firefox → find the extension → click **Reload**
2. Hard-reload the game tab: `Ctrl+Shift+R`

If changes don't appear after Reload, do a full clean install (above) — Firefox sometimes serves a cached content script.

## Permanent install (survives restarts)

Requires a signed XPI. Either:
- Submit to AMO ("On your own" / unlisted track) and install the signed XPI Firefox emails back, or
- Use `web-ext sign` with an AMO API key to sign locally

The current built package is `dist/fallen_london_companion-0.1.zip`.

## Checking the extension console

Content script logs appear in the regular Web Console (`F12`) for the game tab, mixed in with page logs.
Background script logs appear in `about:debugging` → This Firefox → the extension → **Inspect**.
