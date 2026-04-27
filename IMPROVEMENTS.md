# Fallen London Helper — Improvement Ideas

## Done
- **Echo value overlay** — after taking a storylet action, show the echo value of each item
  gained or lost inline next to the result text, with a net total line after the last item.
- **First-gain annotation** — when a player gains an item for the first time (API sends
  `QualityExplicitlySetMessage` with "You now have N x Item"), treat N as the full gain from zero
  and annotate it normally.
- **Rat Market Saturation hint** — after any action that changes Rat Market Saturation, show
  the current boost tier and distance to the next threshold inline next to the saturation line.
- **Possessions tab — faction renown bar** — faction item icons injected at the top of the
  Possessions tab with quantity badges, hover glow, click-to-scroll, and favours/7 · renown/55
  stats under each icon. Also a "↓ Jump to items" link below the heading.
- **Possessions tab — cross-conversion bar** — ordered T3 cross-conversion carousel below the
  renown bar, showing current quantities; Making Waves items marked with a dashed glow.

---

## Pending

### 2. Storylet choice cost preview
Show the echo cost of items required to play a choice, before the player clicks it.
- Different UX from the post-action overlay (needs to appear on the choice itself, not the result)
- Likely a different API endpoint (not `choosebranch` — probably reading the storylet/branch data)
- Need to investigate the API shape for branch requirements

### 2. Agent "redo" tickbox
When an agent finishes an assignment and the result screen appears, show a tickbox
"Send again" (or similar) that lets the player immediately re-assign the agent to the
same plot without having to navigate back manually.
- Needs understanding of the agent assignment UI flow and API

### 3. Map quick-links
On the map screen, surface shortcuts to recently used destinations:
- Link to the most recent train station departure
- Link to the most recent ship destination
- Link to the most frequently visited location
- Requires tracking travel history locally (chrome.storage)

### 5. Bone Market — skeleton quality tracker
While building a skeleton at the Bone Market, track and display the current qualities of
the skeleton in progress (e.g. Skeleton: Human, Skeleton: Antiquity, Skeleton: Amalgamy,
Skeleton: Menace, completed limb/torso/head counts, etc.) so the player doesn't need to
scroll through their possessions mid-build.
- Intercept quality-change responses and maintain local state across actions in the same area
- Display as a compact overlay panel visible during Bone Market storylets

### 6. Bone Market — buyer suggestion
After (or during) a skeleton build, suggest the best buyer given the current skeleton's
qualities, and flag potential Exhaustion with each buyer so the player can make an
informed choice.
- Requires a table of buyer requirements (what qualities they value and at what ratios)
- Factor in current Exhaustion level per buyer (tracked from API responses or possession tab)
- Could be shown alongside the skeleton quality tracker (item 5 above)

### 7. Bone Market — efficient skeleton suggestions
Suggest skeletons that are efficient to build in the current week, factoring in:
- The active week's buffed buyer (which changes weekly)
- Ideally, components the player already has available (from intercepted possession data)
- Show expected profit and key qualities for each suggestion
- Requires a skeleton recipe database and weekly buyer schedule (or detection of the current week's buff)

### 8. EPA counter — action timer button
Add a button to start and stop an action-counting session. While active, count every
`choosebranch` response and accumulate the echo value of all gains/losses. When stopped,
display the total echoes earned and actions taken, giving an estimated Echoes Per Action (EPA).
- Button could live in a small persistent HUD element
- Should also show running EPA during the session (not just at the end)

### 10. Optimal loadout button
When a branch shows less than 100% success rate, add a button "Move to optimal loadout" that automatically selects the equipment combination that reaches the maximum achievable success rate for the relevant quality.
- Needs to know which stat the check is on and the player's possessions + their stat bonuses
- May require intercepting the possessions/character data from the API
- UX: button appears inline near the success % indicator

### 11. Bone Market — top recipes of the week
In the Bone Market, surface the two best skeleton recipes for the current week at the top of the UI:
- One recipe that maximises profit including one Exhaustion threshold
- One recipe with zero Exhaustion
- Requires knowing the current week's buffed buyer and a recipe database

### 12. Bone Market — incompatibility warnings
Show a "don't do that" icon next to bones that would be incompatible with the current week's mania (wrong qualities) or would push the skeleton into Chimera territory.
- Requires tracking current skeleton state and knowing which bones break each constraint

### 13. Bone Market — buyer suggestion + Exhaustion preview
Surface the best buyer for your current skeleton at the top of the Bone Market screen, with expected sale value and current Exhaustion level with that buyer.
- Pairs with #12 and #14
- Requires a buyer requirements table and tracking per-buyer Exhaustion from API responses

### 14. Bone Market — Exhaustion threshold warning
Show a warning "adding Exhaustion" on any bone that would push the skeleton past an Exhaustion threshold with the likely target buyer.
- Pairs with #13 (needs the identified likely buyer)
- Threshold logic: each buyer has specific Exhaustion breakpoints that reduce payout

### 9. Firefox extension
Package the extension for Firefox (Manifest V3 with Firefox-specific adjustments if needed)
so it works on desktop Firefox and, ideally, Firefox for Android (mobile).
- See also item 1 (Mobile support — bookmarklet debugging) which has partially explored this path
- Main concern: MV3 browser_action / content script support differences between Chrome and Firefox
- Firefox for Android has limited extension support — verify which APIs are available

### 15. Destructive action warnings
For known costly or irreversible actions, show a warning icon before the player clicks and ideally a confirmation dialog when they do.
- Examples: selling the boat, the action that converts many Cellars of Wine (losing ~120 echoes), actions that consume Favours for poor reward when the relevant companion item is absent (e.g. using Favours: Criminals without a Lucky Weasel)
- Phase 1: static "danger" icon injected next to the branch name, driven by a hard-coded list of branch/storylet IDs
- Phase 2: intercept the click and show a modal "Are you sure?" before letting the request through
- Needs: a curated list of destructive branch IDs and the condition under which each is dangerous (unconditionally, or only when a quality is missing)

### 16. Weekly opportunities dashboard
Surface high-value periodic activities that the player hasn't done yet this week (or cycle), as a reminder panel.
- Candidates: Balmoral boots, unused Bone Market Exhaustion headroom, uncashed Board Debts, unspent Khanate Reports, unused Rat Market Saturation boost, Time the Healer proximity warning
- Display options: (a) a generated message injected at the top of the Messages tab once per week, or (b) a persistent banner/sidebar widget
- Each item needs a rule: what quality / value / timestamp indicates it's "available" vs "done"
- Time the Healer: warn when <X days remain until reset (requires tracking the last TtH date from API responses)
- State stored in `browser.storage.local`, refreshed when relevant quality-change messages are intercepted

### 17. Browser notifications — action candle full
Push a browser notification when the action candle (action count) reaches its cap, so the player knows they're wasting regeneration.
- Requires tracking current action count and cap from API responses (intercepted from `/api/character` or quality-change messages)
- Use `browser.notifications` API (needs `"notifications"` permission in manifest)
- Fire once per fill; suppress until at least one action is spent after the cap is hit
- On Firefox for Android, browser notifications surface as system notifications — verify behaviour

