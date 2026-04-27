// Runs in the isolated content script world.
// PRICES is defined in prices.js, loaded before this file via manifest.json.

// ── Inject fetch interceptor into the page's main world ──────────────────────
const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
script.onload = () => script.remove();
document.documentElement.appendChild(script);

// ── Parse choosebranch response ───────────────────────────────────────────────
function parseChanges(data) {
  if (!data || !Array.isArray(data.messages)) return [];

  const changes = [];
  for (const msg of data.messages) {
    if (!msg.possession) continue;
    // Allow non-Thing items (Progress, Status, etc.) only if explicitly priced
    if (msg.possession.nature !== "Thing" && PRICES[msg.possession.id] == null) continue;

    let gained, qty;

    if (msg.type === "StandardQualityChangeMessage") {
      const ct = msg.changeType;
      if (ct !== "Decreased" && ct !== "Increased" && ct !== "Gained" && ct !== "Lost") continue;
      // "Decreased"/"Increased" are inverted (game bug/quirk); "Gained"/"Lost" are direct
      gained = ct === "Decreased" || ct === "Gained";
      const match = msg.message.match(/([\d,]+) x /);
      if (!match) continue;
      qty = parseInt(match[1].replace(/,/g, ""), 10);
    } else if (msg.type === "QualityExplicitlySetMessage") {
      // First-time gain from zero — "You now have N x Item", N equals the amount gained.
      const match = msg.message.match(/([\d,]+) x /);
      if (!match) continue;
      qty = parseInt(match[1].replace(/,/g, ""), 10);
      gained = true;
    } else {
      continue;
    }

    const { id, name } = msg.possession;
    const unitPrice = PRICES[id] ?? null;
    const echoValue = unitPrice !== null ? qty * unitPrice * (gained ? 1 : -1) : null;

    changes.push({ name, qty, gained, echoValue });
  }
  return changes;
}

// ── DOM annotation ────────────────────────────────────────────────────────────
function annotateResults(changes) {
  if (changes.length === 0) return;

  const pricedChanges = changes.filter((c) => c.echoValue !== null);
  const annotated = new Set();
  const annotatedParents = []; // ordered list of parents we injected into
  let attempts = 0;

  const tryAnnotate = () => {
    const lastParents = [];

    for (const change of pricedChanges) {
      const escaped = CSS.escape(change.name);

      // Check if span is already present and still connected in the live DOM.
      // Don't rely on the annotated set alone — React can reconcile and remove
      // our span between retries, in which case we must re-inject.
      const existing = document.querySelector(`.fl-echo-val[data-item="${escaped}"]`);
      if (existing && existing.isConnected) {
        annotated.add(change.name);
        lastParents.push(existing.parentElement);
        continue;
      }

      const searchText = ` x ${change.name}`;

      // Find the smallest element whose textContent contains the search string.
      let targetEl = null;
      let bestLen = Infinity;
      for (const el of document.body.querySelectorAll('*')) {
        const tc = el.textContent;
        if (!tc.includes(searchText)) continue;
        if (tc.length >= bestLen) continue;
        bestLen = tc.length;
        targetEl = el;
      }

      if (!targetEl) continue;

      const sign = change.gained ? "+" : "−";
      const color = change.gained ? "#4a7c59" : "#b03030";
      const span = document.createElement("span");
      span.className = "fl-echo-val";
      span.dataset.item = change.name;
      span.style.cssText = `color:${color};font-size:0.9em;margin-left:6px`;
      span.textContent = `(${sign}${Math.abs(change.echoValue).toFixed(2)} echoes)`;
      targetEl.appendChild(span);
      // If the span has no visible height the container's CSS is hiding it
      // (overflow:hidden, fixed height, etc.). Fall back to inserting after
      // the element so it sits outside those constraints.
      if (span.getBoundingClientRect().height === 0) {
        span.remove();
        targetEl.insertAdjacentElement("afterend", span);
      }
      annotated.add(change.name);
      lastParents.push(targetEl);
    }

    attempts++;
    // Retry if any span is missing from the live DOM (React may have removed it).
    const allPresent = pricedChanges.every(c => {
      const s = document.querySelector(`.fl-echo-val[data-item="${CSS.escape(c.name)}"]`);
      return s && s.isConnected;
    });
    if (!allPresent && attempts < 20) {
      setTimeout(tryAnnotate, 150);
      return;
    }

    const net = pricedChanges.reduce((sum, c) => sum + c.echoValue, 0);

    if (lastParents.length >= 1 && pricedChanges.length > 1) {
      const existing = document.getElementById("fl-net-inline");
      if (existing) existing.remove();

      const lastParent = lastParents[lastParents.length - 1];
      const netColor = net >= 0 ? "#4a7c59" : "#b03030";
      const netSign = net >= 0 ? "+" : "";

      const netEl = document.createElement("div");
      netEl.id = "fl-net-inline";
      netEl.style.cssText = `color:${netColor};font-size:0.9em;margin-top:6px;font-style:italic;border-top:1px solid #3a2e1e;padding-top:4px`;
      netEl.textContent = `Net total: ${netSign}${net.toFixed(2)} echoes`;
      lastParent.insertAdjacentElement("afterend", netEl);
    }
  };

  setTimeout(tryAnnotate, 300);
}

// ── Net total badge ───────────────────────────────────────────────────────────
function showNetBadge(net, unknownCount) {
  const existing = document.getElementById("fl-net-badge");
  if (existing) existing.remove();

  const badge = document.createElement("div");
  badge.id = "fl-net-badge";

  const netColor = net !== null ? (net >= 0 ? "#4a7c59" : "#b03030") : "#6b5a3e";
  const netText = net !== null
    ? `Net: <span style="color:${netColor};font-weight:bold">${net >= 0 ? "+" : ""}${net.toFixed(2)} echoes</span>`
    : `<span style="color:${netColor}">Items gained (prices not yet known)</span>`;
  const unknownNote = unknownCount > 0 && net !== null
    ? ` <span style="color:#6b5a3e;font-size:0.85em">(+${unknownCount} unpriced)</span>`
    : "";

  badge.style.cssText = [
    "position:fixed",
    "bottom:16px",
    "right:16px",
    "background:rgba(18,14,9,0.95)",
    "border:1px solid #6b5a3e",
    "color:#cdbf99",
    "font-family:Georgia,serif",
    "font-size:13px",
    "padding:7px 12px",
    "border-radius:3px",
    "z-index:99999",
    "box-shadow:0 2px 8px rgba(0,0,0,0.5)",
    "cursor:pointer",
  ].join(";");

  if (net !== null) {
    const netSpan = document.createElement("span");
    netSpan.style.cssText = `color:${netColor};font-weight:bold`;
    netSpan.textContent = `${net >= 0 ? "+" : ""}${net.toFixed(2)} echoes`;
    badge.append("Net: ", netSpan);
    if (unknownCount > 0) {
      const unknownSpan = document.createElement("span");
      unknownSpan.style.cssText = "color:#6b5a3e;font-size:0.85em";
      unknownSpan.textContent = ` (+${unknownCount} unpriced)`;
      badge.appendChild(unknownSpan);
    }
  } else {
    const span = document.createElement("span");
    span.style.cssText = `color:${netColor}`;
    span.textContent = "Items gained (prices not yet known)";
    badge.appendChild(span);
  }
  badge.addEventListener("click", () => badge.remove());

  document.body.appendChild(badge);

  setTimeout(() => {
    badge.style.transition = "opacity 0.5s";
    badge.style.opacity = "0";
    setTimeout(() => badge.remove(), 500);
  }, 10000);
}

// ── Rat Market Saturation hint ────────────────────────────────────────────────
function parseSaturation(data) {
  if (!data || !Array.isArray(data.messages)) return null;
  for (const msg of data.messages) {
    if (msg.possession && msg.possession.name === "Rat Market Saturation") {
      return msg.possession.level ?? null;
    }
  }
  return null;
}

function annotateSaturation(level) {
  let label, detail;
  if (level <= 65000) {
    label = "32% boost";
    detail = `${(65000 - level).toLocaleString()} to 12% tier`;
  } else if (level <= 180000) {
    label = "12% boost";
    detail = `${(180000 - level).toLocaleString()} to no boost`;
  } else {
    label = "no boost";
    detail = "above 180k";
  }

  let attempts = 0;
  const tryAnnotate = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.includes(" x Rat Market Saturation")) continue;
      const parent = node.parentElement;
      if (!parent || parent.querySelector(".fl-saturation-hint")) break;
      const span = document.createElement("span");
      span.className = "fl-saturation-hint";
      span.style.cssText = "color:#c9a84c;font-size:0.9em;margin-left:6px";
      span.textContent = `(${label} · ${detail})`;
      parent.appendChild(span);
      return;
    }
    if (++attempts < 20) setTimeout(tryAnnotate, 150);
  };
  setTimeout(tryAnnotate, 300);
}

// ── Branch cost preview ───────────────────────────────────────────────────────
function parseRequiredQty(tooltip) {
  if (!tooltip) return null;
  if (/at most/i.test(tooltip)) return null;                         // upper cap — skip
  const m = tooltip.match(/you need(?:ed)? ([\d,]+)/i);
  if (m) return parseInt(m[1].replace(/,/g, ""), 10);
  if (/you unlocked this with an?\s/i.test(tooltip)) return 1;      // "with a Sulky Bat" — singular
  return null;                                                        // unknown pattern — skip
}

function parseBranchCosts(data) {
  if (!data || !data.storylet || !Array.isArray(data.storylet.childBranches)) return [];

  const results = [];
  for (const branch of data.storylet.childBranches) {
    if (!Array.isArray(branch.qualityRequirements) || branch.qualityRequirements.length === 0) continue;

    const costs = [];
    for (const req of branch.qualityRequirements) {
      if (req.category === "Companion") continue;          // companions aren't consumed
      const unitPrice = PRICES[req.qualityId] ?? null;
      if (unitPrice === null) continue;                    // not in price table
      const qty = parseRequiredQty(req.tooltip);
      if (qty === null) continue;                          // "at most" cap
      costs.push({ name: req.qualityName, qty, echoValue: qty * unitPrice });
    }

    if (costs.length === 0) continue;
    const total = costs.reduce((s, c) => s + c.echoValue, 0);
    results.push({ branchName: branch.name, costs, total });
  }
  return results;
}

let _branchCostObserver = null;

function annotateBranchCosts(branchCosts) {
  if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; }
  if (branchCosts.length === 0) return;

  // Map quality name → individual echo cost (shown per tooltip)
  const costByQuality = new Map();
  for (const branch of branchCosts) {
    for (const cost of branch.costs) {
      costByQuality.set(cost.name, cost.echoValue);
    }
  }

  function tryInject() {
    for (const container of document.querySelectorAll("div.icon.quality-requirement")) {
      const btn = container.querySelector("[role='button'][aria-label]");
      if (!btn || btn.dataset.flCostDone) continue;

      const label = btn.getAttribute("aria-label") || "";
      if (!/you unlocked this with|you need\b/i.test(label)) continue;

      for (const [name, echoValue] of costByQuality) {
        if (!label.includes(name)) continue;

        btn.dataset.flCostDone = "1";

        const badge = document.createElement("div");
        badge.className = "fl-cost-hint";
        badge.style.cssText = "color:#b03030;font-size:0.7em;text-align:center;font-family:Georgia,serif;font-style:italic;pointer-events:none;line-height:1.3";
        badge.textContent = `−${echoValue.toFixed(2)}E`;
        container.appendChild(badge);
        break;
      }
    }
  }

  _branchCostObserver = new MutationObserver(tryInject);
  _branchCostObserver.observe(document.body, { childList: true, subtree: true });
  // Clean up after 5 minutes (one storylet session is plenty)
  setTimeout(() => { if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; } }, 300000);
}

// ── Possessions tab — renown bar + cross-conversion bar + jump link ──────────

// Map: item id → faction label
const CONVERSION_ITEMS = new Map([
  [755, "Bohemians"],
  [750, "Church"],
  [748, "Constables"],
  [753, "Criminals"],
  [757, "Docks"],
  [758, "Great Game"],
  [749, "Hell"],
  [761, "Revolutionaries"],
  [754, "Rubbery Men"],
  [752, "Society"],
  [762, "Tomb-Colonies"],
  [751, "Urchins"],
]);

// Map: item id → item name (for scroll-to lookup)
const CONVERSION_ITEM_NAMES = new Map([
  [755, "Ornate Typewriter"],
  [750, "Tiny Jewelled Reliquary"],
  [748, "Antique Constable's Badge"],
  [753, "Old Bone Skeleton Key"],
  [757, "Engraved Pewter Tankard"],
  [758, "Copper Cipher Ring"],
  [749, "Bright Brass Skull"],
  [761, "Red-Feathered Pin"],
  [754, "Nodule of Pulsating Amber"],
  [752, "Entry in Slowcake's Exceptionals"],
  [762, "Diary of the Dead"],
  [751, "Rookery Password"],
]);

// Map: item id → icon image name (from /myself API; 751 unknown, read from DOM)
const CONVERSION_ITEM_IMAGES = new Map([
  [755, "typewriter"],
  [750, "paintingfragment"],
  [748, "copper"],
  [753, "keystone"],
  [757, "tankard"],
  [758, "ring"],
  [749, "skullbrass"],
  [761, "flag"],
  [754, "amber_red"],
  [752, "bookbrown"],
  [762, "bookdead"],
  [751, "scarydoor"],
]);

// Ordered T3 cross-conversion carousel. mw:true = converting this item yields 1-10 CP Making Waves.
const CC_ITEMS = [
  { id: 668,  name: "Brilliant Soul",                       icon: "bottledsoulblue", mw: false },
  { id: 828,  name: "Tale of Terror!!",                     icon: "scaryeye",        mw: true  },
  { id: 830,  name: "Compromising Document",                icon: "papers3",         mw: false },
  { id: 589,  name: "Memory of Light",                      icon: "mirror",          mw: false },
  { id: 831,  name: "Zee-Ztory",                            icon: "waves3",          mw: true  },
  { id: 822,  name: "Bottle of Strangling Willow Absinthe", icon: "bottlewillow",    mw: false },
  { id: 915,  name: "Whisper-Satin Scrap",                  icon: "scrap2",          mw: false },
  { id: 525,  name: "Journal of Infamy",                    icon: "bookpurple",      mw: false },
  { id: 932,  name: "Correspondence Plaque",                icon: "scrawl1",         mw: false },
  { id: 827,  name: "Vision of the Surface",                icon: "sunset",          mw: true  },
  { id: 587,  name: "Mystery of the Elder Continent",       icon: "mountainglow",    mw: false },
  { id: 659,  name: "Scrap of Incendiary Gossip",           icon: "conversation",    mw: true  },
  { id: 825,  name: "Memory of Distant Shores",             icon: "wake",            mw: false },
];
const CC_ITEM_IDS = new Set(CC_ITEMS.map(i => i.id));

let _cachedConversionItems = null; // null = not yet received; Map after first myself
let _cachedCCQtys = null;          // null = not yet received; Map<id,qty> after first myself

function parseMyself(data) {
  if (!data || !Array.isArray(data.possessions)) return;
  const owned = new Map();
  const ccQtys = new Map();

  function scan(categories) {
    for (const cat of categories) {
      for (const p of (cat.possessions || [])) {
        if (CONVERSION_ITEMS.has(p.id)) {
          owned.set(p.id, { id: p.id, name: p.name, qty: p.level || 1, image: p.image || null });
        }
        if (CC_ITEM_IDS.has(p.id)) {
          ccQtys.set(p.id, p.level || 1);
        }
      }
      if (Array.isArray(cat.categories)) scan(cat.categories);
    }
  }

  scan(data.possessions);
  _cachedConversionItems = owned;
  _cachedCCQtys = ccQtys;
  // Remove stale bars so they re-inject with fresh data (qty now known)
  document.getElementById("fl-renown-bar")?.remove();
  document.getElementById("fl-cc-bar")?.remove();
}

function scrollToConversionItem(itemName) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!el || el.closest(".fl-renown-bar")) continue;
    if (node.textContent.trim() === itemName) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.style.outline = "2px solid #c9a84c";
      setTimeout(() => { el.style.outline = ""; }, 2000);
      return;
    }
  }
}

// ── Possessions renown bar ────────────────────────────────────────────────────

function injectRenownBar() {
  if (document.getElementById("fl-renown-bar")?.isConnected) return;

  const possDiv = document.querySelector("div.possessions");
  if (!possDiv) return;

  const searchInput = Array.from(possDiv.querySelectorAll("input.input--item-search"))
    .find(el => !el.classList.contains("outfit-controls__search-field"));
  if (!searchInput) return;

  // Prefer API data; fall back to reading from rendered item tiles.
  let items = _cachedConversionItems;
  if (!items || items.size === 0) {
    items = new Map();
    for (const [id, name] of CONVERSION_ITEM_NAMES) {
      const tile = possDiv.querySelector(`[data-quality-id="${id}"]`);
      if (!tile) continue;
      const qtyEl = tile.querySelector(".icon__value");
      const qty = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;
      const imgMatch = tile.querySelector("img")?.src?.match(/icons\/(.+?)small\.png/);
      const image = imgMatch ? imgMatch[1] : (CONVERSION_ITEM_IMAGES.get(id) || null);
      items.set(id, { id, name, qty, image });
    }
  }
  if (items.size === 0) return;

  const bar = document.createElement("div");
  bar.id = "fl-renown-bar";
  bar.style.cssText = "margin:6px 0 4px;font-family:Georgia,serif";

  const label = document.createElement("h2");
  label.className = "heading heading--2 quality-group__name";
  label.append("Faction renown ");
  const renownWikiLink = document.createElement("a");
  renownWikiLink.href = "https://fallenlondon.wiki/wiki/Factions_(Guide)#Renown_Items";
  renownWikiLink.textContent = "(wiki)";
  renownWikiLink.target = "_blank";
  renownWikiLink.rel = "noopener noreferrer";
  renownWikiLink.style.cssText = "font-size:0.7em;font-style:normal;font-weight:normal;color:#3f7277;text-decoration:underline;vertical-align:middle;margin-left:4px";
  label.appendChild(renownWikiLink);
  bar.appendChild(label);

  const list = document.createElement("ul");
  list.className = "items items--inline quality-group__items";

  for (const [id, item] of items) {
    const faction = CONVERSION_ITEMS.get(id);
    const image = item.image || CONVERSION_ITEM_IMAGES.get(id);

    const li = document.createElement("li");
    li.className = "item";

    const iconDiv = document.createElement("div");
    iconDiv.className = "icon icon--inventory icon--emphasize icon--usable";
    iconDiv.title = `${faction} — ${item.name}`;

    const inner = document.createElement("div");
    inner.setAttribute("role", "button");
    inner.tabIndex = 0;
    inner.style.cssText = "outline:0;cursor:pointer";

    if (image) {
      const img = document.createElement("img");
      img.src = `//images.fallenlondon.com/icons/${image}small.png`;
      img.alt = item.name;
      inner.appendChild(img);
    }

    iconDiv.appendChild(inner);

    const badge = document.createElement("span");
    badge.className = "js-item-value icon__value";
    badge.textContent = item.qty;
    iconDiv.appendChild(badge);

    iconDiv.addEventListener("click", () => {
      const realBtn = document.querySelector(`div.possessions [data-quality-id="${id}"] [role="button"]`);
      if (realBtn) realBtn.click();
    });

    li.appendChild(iconDiv);
    list.appendChild(li);
  }

  bar.appendChild(list);
  searchInput.insertAdjacentElement("afterend", bar);
}

// ── Possessions cross-conversion bar ─────────────────────────────────────────

function injectCrossConversionBar() {
  if (document.getElementById("fl-cc-bar")?.isConnected) return;

  const renownBar = document.getElementById("fl-renown-bar");
  if (!renownBar?.isConnected) return;

  const possDiv = document.querySelector("div.possessions");
  if (!possDiv) return;

  // Build qty map: prefer API data, fall back to DOM tile scanning.
  // Items absent from the API response are kept with qty=0 (show grayed out).
  let qtys = _cachedCCQtys ? new Map(_cachedCCQtys) : null;
  if (!qtys) {
    qtys = new Map();
    for (const item of CC_ITEMS) {
      const tile = possDiv.querySelector(`[data-quality-id="${item.id}"]`);
      if (!tile) continue;
      const qtyEl = tile.querySelector(".icon__value");
      qtys.set(item.id, qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1);
    }
    if (qtys.size === 0) return; // no API data and nothing visible in DOM yet
  }

  const bar = document.createElement("div");
  bar.id = "fl-cc-bar";
  bar.style.cssText = "margin:6px 0 4px;font-family:Georgia,serif";

  const label = document.createElement("h2");
  label.className = "heading heading--2 quality-group__name";
  label.append("Cross-conversion ");
  const ccWikiLink = document.createElement("a");
  ccWikiLink.href = "https://fallenlondon.wiki/wiki/Making_Waves_(Guide)#Cross-Conversion_Carousel";
  ccWikiLink.textContent = "(wiki)";
  ccWikiLink.target = "_blank";
  ccWikiLink.rel = "noopener noreferrer";
  ccWikiLink.style.cssText = "font-size:0.7em;font-style:normal;font-weight:normal;color:#3f7277;text-decoration:underline;vertical-align:middle;margin-left:4px";
  label.appendChild(ccWikiLink);
  bar.appendChild(label);

  const list = document.createElement("ul");
  list.className = "items items--inline quality-group__items";

  for (const item of CC_ITEMS) {
    const qty = qtys.get(item.id) ?? 0;

    const li = document.createElement("li");
    li.className = "item";

    const iconDiv = document.createElement("div");
    iconDiv.className = "icon icon--inventory icon--emphasize" + (qty > 0 ? " icon--usable" : "") + (item.mw ? " fl-cc-mw" : "");
    iconDiv.title = item.mw
      ? `${item.name} — converts to next · gives 1–10 CP Making Waves`
      : item.name;
    if (qty === 0) iconDiv.style.opacity = "0.35";

    const inner = document.createElement("div");
    inner.setAttribute("role", "button");
    inner.tabIndex = qty > 0 ? 0 : -1;
    inner.style.cssText = "outline:0;" + (qty > 0 ? "cursor:pointer" : "cursor:default");

    const img = document.createElement("img");
    img.src = `//images.fallenlondon.com/icons/${item.icon}small.png`;
    img.alt = item.name;
    inner.appendChild(img);
    iconDiv.appendChild(inner);

    const badge = document.createElement("span");
    badge.className = "js-item-value icon__value";
    badge.textContent = qty;
    iconDiv.appendChild(badge);

    if (qty > 0) {
      iconDiv.addEventListener("click", () => {
        const realBtn = possDiv.querySelector(`[data-quality-id="${item.id}"] [role="button"]`);
        if (realBtn) realBtn.click();
      });
    }

    li.appendChild(iconDiv);
    list.appendChild(li);
  }

  bar.appendChild(list);
  renownBar.insertAdjacentElement("afterend", bar);
}

// ── Possessions jump link ────────────────────────────────────────────────────

function injectPossessionsJumpLink() {
  if (document.getElementById("fl-jump-link")?.isConnected) return;

  const possDiv = document.querySelector("div.possessions");
  if (!possDiv) return;

  const h1 = possDiv.querySelector("h1");
  if (!h1 || !h1.textContent.includes("My Possessions")) return;

  const link = document.createElement("div");
  link.id = "fl-jump-link";
  link.style.cssText = "font-size:0.85em;margin:0;padding:0;color:#3f7277;cursor:pointer;font-family:Georgia,serif;text-decoration:underline;display:block";
  link.textContent = "↓ Jump to items";
  link.addEventListener("click", () => {
    const second = Array.from(possDiv.querySelectorAll("input.input--item-search"))
      .find(el => !el.classList.contains("outfit-controls__search-field"));
    if (second) second.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  h1.parentElement?.insertAdjacentElement("afterend", link);
}

function injectPossessionsStyles() {
  if (document.getElementById("fl-poss-styles")) return;
  const style = document.createElement("style");
  style.id = "fl-poss-styles";
  style.textContent = [
    "#fl-renown-bar .icon--usable:hover img,#fl-cc-bar .icon--usable:not(.fl-cc-mw):hover img{box-shadow:0 0 5px 5px #92d1d5;transform:scale(1.05) translateZ(0);transition:box-shadow .1s,transform .1s}",
    "#fl-cc-bar .fl-cc-mw.icon--usable:hover img{outline:2px dashed #92d1d5;outline-offset:3px;transform:scale(1.05) translateZ(0);transition:outline .1s,transform .1s}",
  ].join("");
  document.head.appendChild(style);
}

function startPossessionsObserver() {
  setInterval(() => { injectPossessionsStyles(); injectPossessionsJumpLink(); injectRenownBar(); injectCrossConversionBar(); }, 1000);
}

// ── Wire up ───────────────────────────────────────────────────────────────────

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== "fl-helper") return;

  if (event.data.type === "choosebranch") {
    const data = event.data.data;
    annotateResults(parseChanges(data));
    const satLevel = parseSaturation(data);
    if (satLevel !== null) annotateSaturation(satLevel);
  } else if (event.data.type === "storylet-begin") {
    annotateBranchCosts(parseBranchCosts(event.data.data));
  } else if (event.data.type === "myself") {
    parseMyself(event.data.data);
  }
});

startPossessionsObserver();
