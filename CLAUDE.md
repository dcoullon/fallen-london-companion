# Fallen London Companion — Claude Context

## Project
Firefox extension for Fallen London (www.fallenlondon.com) QoL improvements. The primary target is **Firefox for Android** — that is the platform the user plays on. Everything must work on mobile Firefox (Android). Desktop Firefox and Chrome are secondary.

Extension location: `extension/`
Version: 0.3 (MV3, Firefox-first)

**Policy:** Extensions that only affect the game locally are allowed. Never make requests to api.fallenlondon.com from outside the game's own front-end. Local DOM modification and intercepting (not initiating) API responses are fine.

## Architecture

| File | World | Role |
|------|-------|------|
| `extension/manifest.json` | — | MV3; runs on `*://www.fallenlondon.com/*` |
| `extension/content.js` | Isolated content script | Inlines the fetch/XHR interceptor as `script.textContent` (synchronous, see note); listens for messages; does DOM injection and price lookup |
| `extension/injected.js` | — | **Dead code.** Interceptor was moved inline into `content.js` to fix a timing race. File kept for reference only; not loaded. |
| `extension/diagnostic.css` | Injected CSS | Diagnostic/overlay styles |

## Key API facts
- Game is a React SPA; uses **fetch** (and XHR as fallback) for API calls — both are intercepted
- Endpoint: `POST https://api.fallenlondon.com/api/storylet/choosebranch`
- Response: `messages[]` array with item changes
- Filter tradeable items: `type === "StandardQualityChangeMessage"` AND `possession.nature === "Thing"`
- `changeType` is **inverted**: `"Decreased"` = gained, `"Increased"` = lost
- Quantity parsed from message text: `/([\d,]+) x /`
- First-gain: `QualityExplicitlySetMessage` → treat as full gain from zero

## DOM structure (live, v6.5.106)
- Possessions tab active: `<div id="main" class="... possessions">` (only has class `possessions` when active)
- Item tiles: `<li class="item"><div class="icon icon--inventory" data-quality-id="{id}">` — use **`data-quality-id`**, not image URL
- Images: `//images.fallenlondon.com/icons/{iconname}small.png` — icon names, not item IDs, in URL
- Echo value spans work by TreeWalker finding ` x ItemName` text nodes and appending a span to the parent element

## What's built
- **Echo value overlay** — inline echo value on each item gained/lost; net total after last priced item. Handles standard changes, first-gain (`QualityExplicitlySetMessage`), and quality-gone-to-zero (recovers qty from cached `/myself` data).
- **First-gain annotation** — `QualityExplicitlySetMessage` treated as full gain from zero
- **Rat Market Saturation hint** — boost tier and distance to next threshold inline
- **Branch cost preview** — echo cost shown on quality requirement icons before clicking a choice
- **Possessions tab — faction renown bar** — faction item icons at the top of the Possessions tab with quantity badges, hover glow, click-to-scroll. Favours/7 · renown/55 shown under each icon (parsed from `/myself`). "↓ Jump to items" link below the heading.
- **Possessions tab — cross-conversion bar** — ordered T3 cross-conversion carousel below the renown bar; quantities from `/myself`; Making Waves items marked with dashed glow; grayed out when qty=0.

## Firefox / Android
- **Primary target is Firefox for Android.** All features must work on mobile. Test on Android before considering anything done.
- `manifest.json` has `browser_specific_settings` with gecko ID `fallen-london-companion@ext` and `gecko_android` strict_min_version `109.0`.
- Built package: `dist/fallen_london_companion-0.1.zip`
- NOT yet tested on an actual Android device — pending step before AMO submission

## Testing
- `node run-tests.js` — 10 unit test fixtures, runs headlessly (Node.js), no browser needed
- `test.html` — browser-based visual test runner

## File sizes — what to read and when

`content.js` is now ~760 lines. `prices.js` holds the PRICES table and is rarely needed — only read it when specifically working on item prices.

**Heavy files — only read when the task explicitly requires them:**
| File | Size | When to read |
|------|------|--------------|
| `extension/prices.js` | 35KB | Only when adding/changing item prices |
| `wiki-cache/prices_complete.js` | 28KB | Only when reconciling full price data |
| `test.html` | 64KB | Never — browser-only test runner, not useful to read |
| `bookmarklet.html` / `bookmarklet.js` | 18KB each | Never — old prototype, superseded by extension |
| `prices-reference.html` | 23KB | Only when cross-referencing prices |
| `example-data/myself.json` | 511KB | Only when working on `/myself` API parsing |
| `example-data/fallen-london-html-example.html` | 477KB | Only when inspecting DOM structure |

**Never read speculatively.** If a task doesn't mention prices, don't open `prices.js`. If a task doesn't mention the DOM, don't open the HTML example.

## Wiki cache
`wiki-cache/` holds scraped price JSON by category (one file per category) **and cached wiki article text** (`.md` files for reference pages). **Always check wiki-cache before making a WebFetch to fallenlondon.wiki.** If the data you need is already cached, read from the file instead. When you fetch a wiki article for the first time, save it to `wiki-cache/<topic>.md` so it doesn't need to be re-fetched in future sessions.

## Python
Use `python` (not `python3`) — `python3` is not on PATH on this machine. `python` resolves to Python 3.15.

## Pending features (IMPROVEMENTS.md for full detail)
2. Agent "redo" tickbox
3. Map quick-links
5. Bone Market — skeleton quality tracker
6. Bone Market — buyer suggestion
7. Bone Market — efficient skeleton suggestions
8. EPA counter — action timer button
9. Optimal loadout button
10. Bone Market — top recipes of the week
11. Bone Market — incompatibility warnings
12. Bone Market — buyer suggestion + exhaustion preview
13. Bone Market — exhaustion threshold warning per bone

## Possessions tab injection
`setInterval` (1 s) polling is the confirmed working approach. The renown bar and CC bar both use this pattern: inject if not present, remove+re-inject when fresh API data arrives.

**Do not use MutationObserver** — fails even with an immediate pre-observe call, likely a timing issue with the game's React render cycle.

## Page-world script injection
**Always use `script.textContent`, never `script.src`.** The `script.src` approach is async — the game's bootstrap fires `/myself` before the external file loads, so the intercept is never registered. With `textContent` the code executes synchronously the moment the element is appended. This cost two sessions to diagnose.
