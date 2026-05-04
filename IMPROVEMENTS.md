# Fallen London Helper — Improvement Ideas

## Pending (highest ROI first)

### setInterval — performance / battery guard
Currently the 1 s polling interval runs all injection functions on every tick regardless of which
tab the player is on. Add a page-context check at the top of each injector so work is skipped
when the relevant UI isn't present (e.g. skip injectRenownBar / injectCrossConversionBar
unless document.querySelector('#main.possessions') is present; skip injectSkeletonTracker
unless on a Bone Market storylet).
Also worth retesting MutationObserver as a replacement — the previous conclusion (it fails due to
React timing) was reached during a period of extension-loading issues and may not be reliable.

### Destructive action warnings
For known costly or irreversible actions, show a warning icon before the player clicks and ideally a confirmation dialog when they do.
- Examples: selling the boat, the action that converts many Cellars of Wine (losing ~120 echoes), actions that consume Favours for poor reward when the relevant companion item is absent (e.g. using Favours: Urchins without a Lucky Weasel)
- Phase 1 (low complexity): static "danger" icon injected next to the branch name, driven by a hard-coded list of branch/storylet IDs
- Phase 2: intercept the click and show a modal "Are you sure?" before letting the request through
- Needs: a curated list of destructive branch IDs and the condition under which each is dangerous

### Browser notifications — action candle full
Push a browser notification when the action candle (action count) reaches its cap, so the player knows they're wasting regeneration.
- Requires tracking current action count and cap from API responses (intercepted from `/api/character` or quality-change messages)
- Use `browser.notifications` API (needs `"notifications"` permission in manifest)
- Fire once per fill; suppress until at least one action is spent after the cap is hit
- On Firefox for Android, browser notifications surface as system notifications — verify behaviour


### Weekly opportunities dashboard
Surface high-value periodic activities that the player hasn't done yet this week (or cycle), as a reminder panel.
- Candidates: Balmoral boots, unused Bone Market Exhaustion headroom, uncashed Board Debts, unspent Khanate Reports, unused Rat Market Saturation boost, Time the Healer proximity warning
- Display options: (a) a generated message injected at the top of the Messages tab once per week, or (b) a persistent banner/sidebar widget
- Each item needs a rule: what quality / value / timestamp indicates it's "available" vs "done"
- Time the Healer: warn when <X days remain until reset (requires tracking the last TtH date from API responses)
- State stored in `browser.storage.local`, refreshed when relevant quality-change messages are intercepted

### Bone Market — top recipes of the week
In the Bone Market, surface the two best skeleton recipes for the current week at the top of the UI:
- One recipe that maximises profit including one Exhaustion threshold
- One recipe with zero Exhaustion
- Requires knowing the current week's buffed buyer and a recipe database

### Map quick-links
On the map screen, surface shortcuts to recently used destinations:
- Link to the most recent train station departure
- Link to the most recent ship destination
- Link to the most frequently visited location
- Requires tracking travel history locally (chrome.storage)

### Bone Market — efficient skeleton suggestions
Suggest skeletons that are efficient to build in the current week, factoring in:
- The active week's buffed buyer (which changes weekly)
- Ideally, components the player already has available (from intercepted possession data)
- Show expected profit and key qualities for each suggestion
- Requires a skeleton recipe database and weekly buyer schedule (or detection of the current week's buff)


### Optimal loadout button — post-equip page refresh
After clicking "+" and equipping the optimal loadout, the page currently does a full `location.reload()` which triggers the Fallen London logo loading animation. Replace with a softer SPA-style navigation so the storylet view re-renders without re-initialising the whole app.

**Approaches ruled out:**
- `popstate` dispatch, `window.next?.router` — FL is not Next.js, these no-op
- `pushState('/possessions')` from a storylet page → game router guard fires synchronously, pushes back to `/` immediately with no XHR in between; no re-render results

**Current approach (partially working):**
After equip, fetch `/character/myself` ourselves using `_gameHeaders`, compute new success % from `challenge.targetNumber` and `possession.effectiveLevel`, patch `.challenge__description` DOM text directly. Falls back to `location.reload()` if `targetNumber` is 0 (field missing). Currently always falls back — `ch.targetNumber` appears to not be the correct field name.

**Next step:** check the browser console for `[FL] challenge targetNumber= ... name= ...` log after loading a storylet with a broad challenge, to see what the actual field value/name is. If it logs `undefined`, inspect `branch.challenges[0]` directly to find the correct field (may be `targetDifficulty`, `difficulty`, `chancePercentage`, etc.).

### Agent "redo" tickbox
When an agent finishes an assignment and the result screen appears, show a tickbox
"Send again" (or similar) that lets the player immediately re-assign the agent to the
same plot without having to navigate back manually.
- Needs understanding of the agent assignment UI flow and API

---

## Done

- **Optimal loadout "+" button** — "+" button injected next to each broad challenge quality icon on
  storylet branches when the player is below 100% success. Clicking calls `POST /api/outfit/equipHighest`
  with the relevant quality ID. Hidden when the access requirement is already met ("unlocked") or success
  is already 100%. Supports multi-challenge branches (one "+" per challenge). Quality name→ID map is a
  hardcoded static constant (`EQUIP_HIGHEST_BY_NAME`, 21 entries). Auth header captured via XHR
  `setRequestHeader` intercept. Post-equip: full page reload (soft-reload improvement tracked in Pending).

- **Landing page** — production-grade static landing page at `docs/index.html` deployed via GitHub Pages
  (`https://dcoullon.github.io/fallen-london-companion/`). Fifth City Gothic design (EB Garamond, brass/ink-blue/parchment).
  Sections: hero with CTAs, "What's included" feature grid, Bone Market featured section, bento feature cards,
  3-step install guide, FAQ, zero-botting pledge, GitHub CTA, footer. All assets self-contained in `docs/` so
  GitHub Pages from `/docs` folder works without `../` path issues. OG/Twitter meta tags with absolute URLs.
  Pending: user to enable GitHub Pages in repo settings; demo GIF to be recorded and wired into hero.

- **Echo value overlay** — after taking a storylet action, show the echo value of each item
  gained or lost inline next to the result text, with a net total line after the last item.
- **First-gain annotation** — when a player gains an item for the first time (API sends
  `QualityExplicitlySetMessage` with "You now have N x Item"), treat N as the full gain from zero
  and annotate it normally.
- **Rat Market Saturation hint** — after any action that changes Rat Market Saturation, show
  the current boost tier and distance to the next threshold inline next to the saturation line.
- **Storylet choice cost preview** — echo cost shown on quality requirement icons before clicking
  a choice. Reads branch requirement data and looks up item prices inline. Fixed on Firefox Android:
  game uses a ReactModal (`modal--tooltip-like__content`) instead of Tippy; annotateTooltip and
  click fallback updated to target both structures.
- **Possessions tab — faction renown bar** — faction item icons injected at the top of the
  Possessions tab with quantity badges, hover glow, click-to-scroll, and favours/7 · renown/55
  stats under each icon. Favours text shown as [7/7] in teal at max to signal they should be spent.
  Also a "↓ Jump to items" link below the heading.
- **Possessions tab — cross-conversion bar** — ordered T3 cross-conversion carousel below the
  renown bar, showing current quantities; Making Waves items marked with a dashed glow.
- **CP annotation on quality results** — shows `+N CP` / `−N CP` inline next to quality names in
  action result text. Handles same-level, level-up, and level-down. Uses an in-memory `_cpState`
  cache seeded from `/myself` (pyramid formula: cap=70 for BasicAbility stats, 50 for others).
- **Bone Market — skeleton quality tracker** — collapsible fixed panel showing current skeleton
  stats (Antiquity, Amalgamy, Menace, Implausibility, all limb counts, skeleton type) while
  building at the Bone Market.
- **Bone Market — buyer suggestion** — top 5 eligible buyers ranked by payout shown in the
  skeleton tracker panel, with echo values and Exhaustion filtering applied. Buyer eligibility
  based on skeleton attributes only (Respectable/Dreaded/Bizarre removed — player can swap gear).
  Quadratic secondary formulas use `Math.round` (not floor), confirmed against real sales.
  Mania week captured from `/api/storylet` storylets via "predilection for" text regex.
- **Bone Market — buyer payout labels on Seeking Buyers page** — each buyer card shows
  `~NN.Nε: qty Item` injected into `.media__body` within 1 s of page load, via setInterval
  `_tryAnnotateBuyersFromDOM`. Branch matched by `img[alt]` attribute (not text node — the game
  has no heading element inside `[data-branch-id]` containers). `branchName` field added to all
  `BONE_MARKET_BUYERS` entries with exact game branch text ("Sell to a Naive Collector" etc.).
  All 15 visible buyers labeled regardless of eligibility check. "Dumbwaiter" (bird-only, rarely
  shown) has `branchName: null` — name TBD. "Enterprising Boot Salesman" not yet in buyer list.
- **Firefox + Chrome extension** — MV3 extension with two manifests: `manifest.json` (Firefox,
  gecko_android) and `manifest.chrome.json` (Chrome). `npm run build` → Firefox zip for AMO;
  `npm run build:chrome` → Chrome zip for Web Store. `HOWTO.html` documents the full build,
  test and publish workflow for both browsers.
- **Bone Market — zoological mania conflict warning** — `[✗ amphibians]` (and equivalent for
  other mania types) now correctly appears on incompatible bone slots during mania weeks.
  Zoological Mania detected from quality 142799 (world quality, levels 1–7) found in the
  `storylet-begin` response when entering any Bone Market sub-storylet. Conflict gate relaxed
  to fire even without an active skeleton when mania type is known.
- **Bone Market — skeleton frame mania warnings** — on the frame-selection screen (before any
  skeleton is started), frames incompatible with the current zoological mania show `[✗ amphibians]`
  (or equivalent). Fixed three root causes: (1) "Supply a Skeleton of Your Own" added to
  `FRAME_COMPATIBLE_TYPES` (human-only); (2) `_detectManiaFromBeginData` moved before annotation
  calls in the `storylet-begin` handler so mania is available immediately; (3)
  `_tryAnnotateFramesFromDOM` switched from text-node walk to `img[alt]` primary matching (same
  pattern as buyer annotation — the game renders branch titles as images, not heading text nodes).
- **Bone Market — Assemble a Skeleton annotations** — three inline labels on each bone-adding branch:
  (1) bone type label (`[skull]`, `[leg]`, `[skull×2]`, `[0 skull]` for Stygian Ivory, etc.);
  (2) exhaustion warning (`⚠ +exh` amber / `⚠⚠ +exh→cap` red) when adding this bone would increase
  the exhaustion generated on sale with the best buyer;
  (3) skeleton-type conflict warning (`✗ Amphibian` in red) when the bone violates the current
  skeleton's slot requirements — skull overflow, limb overflow, forbidden slot type (e.g. arms on
  Amphibian), or Stygian Ivory when skulls are still needed. Per-slot limits from wiki in
  `SKEL_SLOT_LIMITS`. Labels injected both from `storylet-begin` event and from 1 s setInterval DOM
  scan so they survive page reloads.
- **EPA counter** — two persistent counters (lifetime + session) injected into the Myself tab
  below the player name/reputation. Session counter reset by Start/Stop link; lifetime never
  cleared. Both persist across page reloads via `browser.storage.local`, keyed per character ID
  (`epa_{charId}`) so multiple accounts on the same browser are tracked independently. Action
  cost read from `response.elapsed`; echo value summed from priced item changes per action.
- **Price list expansion** — added Queen Mate (25ε), Vienna Opening (2.5ε), Blood Oath (0.5ε),
  Ascended Ambergris (2.5ε), Roof-Chart (2.5ε), Memory of a Much Stranger Self (12.5ε),
  A Recipe for Zzoup (17.5ε). Added price audit tooling: `check-prices.js`,
  `match-shop-prices.js`, `fetch-missing-prices.py`. 432 remaining unpriced inventory items
  catalogued in `example-data/unpriced-items.txt`.
