# Fallen London Helper — Improvement Ideas

## Pending (highest ROI first)

### Destructive action warnings
For known costly or irreversible actions, show a warning icon before the player clicks and ideally a confirmation dialog when they do.
- Examples: selling the boat, the action that converts many Cellars of Wine (losing ~120 echoes), actions that consume Favours for poor reward when the relevant companion item is absent (e.g. using Favours: Criminals without a Lucky Weasel)
- Phase 1 (low complexity): static "danger" icon injected next to the branch name, driven by a hard-coded list of branch/storylet IDs
- Phase 2: intercept the click and show a modal "Are you sure?" before letting the request through
- Needs: a curated list of destructive branch IDs and the condition under which each is dangerous

### Browser notifications — action candle full
Push a browser notification when the action candle (action count) reaches its cap, so the player knows they're wasting regeneration.
- Requires tracking current action count and cap from API responses (intercepted from `/api/character` or quality-change messages)
- Use `browser.notifications` API (needs `"notifications"` permission in manifest)
- Fire once per fill; suppress until at least one action is spent after the cap is hit
- On Firefox for Android, browser notifications surface as system notifications — verify behaviour

### Bone Market — incompatibility warnings
Show a "don't do that" icon next to bones that would be incompatible with the current week's mania (wrong qualities) or would push the skeleton into Chimera territory.
- Skeleton state is already tracked in the quality tracker — this can leverage existing state
- Requires knowing which bones break each constraint

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

### Bone Market — Exhaustion threshold warning per bone
Show a warning "adding Exhaustion" on any bone that would push the skeleton past an Exhaustion threshold with the likely target buyer.
- Exhaustion level is already tracked and displayed in the skeleton panel — needs per-bone injection
- Threshold logic: each buyer has specific Exhaustion breakpoints that reduce payout

### Optimal loadout button
When a branch shows less than 100% success rate, add a button "Move to optimal loadout" that automatically selects the equipment combination that reaches the maximum achievable success rate for the relevant quality.
- Needs to know which stat the check is on and the player's possessions + their stat bonuses
- May require intercepting the possessions/character data from the API
- UX: button appears inline near the success % indicator

### Agent "redo" tickbox
When an agent finishes an assignment and the result screen appears, show a tickbox
"Send again" (or similar) that lets the player immediately re-assign the agent to the
same plot without having to navigate back manually.
- Needs understanding of the agent assignment UI flow and API

---

## Done

- **Echo value overlay** — after taking a storylet action, show the echo value of each item
  gained or lost inline next to the result text, with a net total line after the last item.
- **First-gain annotation** — when a player gains an item for the first time (API sends
  `QualityExplicitlySetMessage` with "You now have N x Item"), treat N as the full gain from zero
  and annotate it normally.
- **Rat Market Saturation hint** — after any action that changes Rat Market Saturation, show
  the current boost tier and distance to the next threshold inline next to the saturation line.
- **Storylet choice cost preview** — echo cost shown on quality requirement icons before clicking
  a choice. Reads branch requirement data and looks up item prices inline.
- **Possessions tab — faction renown bar** — faction item icons injected at the top of the
  Possessions tab with quantity badges, hover glow, click-to-scroll, and favours/7 · renown/55
  stats under each icon. Favours text bolds at 7/7 to signal they should be spent.
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
- **Firefox extension** — MV3 Firefox-first extension with gecko_android support; packaged and
  ready for AMO submission.
- **EPA counter** — two persistent counters (lifetime + session) injected into the Myself tab
  below the player name/reputation. Session counter reset by Start/Stop link; lifetime never
  cleared. Both persist across page reloads via `browser.storage.local`. Action cost read from
  `response.elapsed`; echo value summed from priced item changes per action.
