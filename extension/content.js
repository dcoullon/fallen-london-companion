// Runs in the isolated content script world.
// PRICES is defined in prices.js, loaded before this file via manifest.json.

// ── Inject fetch/XHR interceptor into the page's main world ─────────────────
// Use textContent (not script.src) so the code executes synchronously before
// the game's bootstrap can fire its initial /myself request.
if (typeof FL_TEST_MODE === "undefined") {
  const s = document.createElement("script");
  s.textContent = `(function () {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";
    if (url.includes("choosebranch") || url.includes("storylet/begin") || url.includes("character/myself")) {
      const type = url.includes("choosebranch") ? "choosebranch"
                 : url.includes("storylet/begin") ? "storylet-begin"
                 : "myself";
      response.clone().json().then((data) => {
        window.postMessage({ source: "fl-helper", type, data }, "*");
      }).catch(() => {});
    }
    return response;
  };
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._flUrl = url;
    return originalOpen.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function (...args) {
    if (this._flUrl && (this._flUrl.includes("choosebranch") || this._flUrl.includes("storylet/begin") || this._flUrl.includes("character/myself"))) {
      const type = this._flUrl.includes("choosebranch") ? "choosebranch"
                 : this._flUrl.includes("storylet/begin") ? "storylet-begin"
                 : "myself";
      this.addEventListener("load", () => {
        try {
          const data = JSON.parse(this.responseText);
          window.postMessage({ source: "fl-helper", type, data }, "*");
        } catch (err) {}
      });
    }
    return originalSend.apply(this, args);
  };
})();`;
  document.documentElement.appendChild(s);
  s.remove();
}

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
      const match = msg.message.match(/([\d,]+) x /);
      if (match) {
        // First-time gain from zero — "You now have N x Item"
        qty = parseInt(match[1].replace(/,/g, ""), 10);
        gained = true;
      } else if (msg.changeType === "Lost" && _cachedFavoursQtys?.has(msg.possession.id)) {
        // "Quality has gone!" — level set to 0, qty not in text; recover from cached previous level
        qty = _cachedFavoursQtys.get(msg.possession.id);
        gained = false;
      } else {
        continue;
      }
    } else {
      continue;
    }

    const { id, name } = msg.possession;
    const unitPrice = PRICES[id] ?? null;
    const echoValue = unitPrice !== null ? qty * unitPrice * (gained ? 1 : -1) : null;
    const qualityGone = msg.type === "QualityExplicitlySetMessage" && msg.changeType === "Lost";

    changes.push({ name, qty, gained, echoValue, qualityGone });
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

      if (!targetEl && change.qualityGone) {
        // "Your 'Name' Quality has gone!" — search for that text node instead
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.includes(`'${change.name}' Quality has gone`)) {
            targetEl = node.parentElement;
            break;
          }
        }
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
    // qualityGone items use static text that's already in the DOM — don't retry for them.
    const allPresent = pricedChanges.every(c => {
      const s = document.querySelector(`.fl-echo-val[data-item="${CSS.escape(c.name)}"]`);
      return (s && s.isConnected) || c.qualityGone;
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
let _costByQuality = new Map();   // module-level; shared with tooltip annotator

function annotateBranchCosts(branchCosts) {
  if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; }
  if (branchCosts.length === 0) return;

  _costByQuality = new Map();
  for (const branch of branchCosts) {
    for (const cost of branch.costs) {
      _costByQuality.set(cost.name, cost.echoValue);
    }
  }
  const costByQuality = _costByQuality;

  function tryInject() {
    for (const container of document.querySelectorAll("div.icon.quality-requirement")) {
      const btn = container.querySelector("[role='button'][aria-label]");
      if (!btn) continue;

      const label = btn.getAttribute("aria-label") || "";
      if (label.includes(" worth ")) continue;              // already annotated
      if (!/you unlocked this with|you need\b/i.test(label)) continue;

      for (const [name, echoValue] of costByQuality) {
        if (!label.includes(name)) continue;
        btn.setAttribute("aria-label", label + ` (worth ${echoValue.toFixed(2)} E)`);
        break;
      }
    }
  }

  _branchCostObserver = new MutationObserver(tryInject);
  _branchCostObserver.observe(document.body, { childList: true, subtree: true });
  tryInject();                   // handle icons already in DOM when message arrives
  setTimeout(tryInject, 300);    // handle icons React renders asynchronously
  // Clean up after 5 minutes (one storylet session is plenty)
  setTimeout(() => { if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; } }, 300000);
}

// ── General icon aria-label annotation ───────────────────────────────────────

function annotateIconAriaLabels(root) {
  const containers = [];
  if (root && root.matches && root.matches("[data-quality-id]")) containers.push(root);
  if (root && root.querySelectorAll) {
    for (const el of root.querySelectorAll("[data-quality-id]")) containers.push(el);
  }
  for (const container of containers) {
    const id = parseInt(container.dataset.qualityId, 10);
    const unitPrice = PRICES[id] ?? null;
    if (unitPrice === null) continue;
    const btn = container.querySelector("[role='button'][aria-label]");
    if (!btn) continue;
    const label = btn.getAttribute("aria-label") || "";
    if (label.includes(" worth ")) continue;
    const qty = parseRequiredQty(label) ?? 1;
    btn.setAttribute("aria-label", label + ` (worth ${(qty * unitPrice).toFixed(2)} E)`);
  }
}

function annotateTooltip(root) {
  // The added node is the data-tippy-root wrapper; role="tooltip" is on the inner .tippy-box
  const tooltipBox = (root.getAttribute("role") === "tooltip")
    ? root
    : root.querySelector('[role="tooltip"]');
  if (!tooltipBox) return;
  if (tooltipBox.dataset.flPriceAdded) return;

  let echoValue = null;

  // Primary: match span.quality-name inside the tooltip against _costByQuality
  const qualityNameEl = tooltipBox.querySelector(".quality-name");
  if (qualityNameEl) {
    const name = qualityNameEl.textContent.trim();
    if (_costByQuality.has(name)) echoValue = _costByQuality.get(name);
  }

  // Fallback: data-quality-id ancestor of the source element → PRICES
  if (echoValue === null) {
    const rootId = root.hasAttribute("data-tippy-root") ? root.id
                 : (root.getAttribute("role") === "tooltip" ? root.id : null);
    const source = rootId ? document.querySelector(`[aria-describedby="${rootId}"]`) : null;
    if (source) {
      const container = source.closest("[data-quality-id]");
      if (container) {
        const id = parseInt(container.dataset.qualityId, 10);
        const unitPrice = PRICES[id] ?? null;
        if (unitPrice !== null) {
          const qty = parseRequiredQty(source.getAttribute("aria-label") || "") ?? 1;
          echoValue = qty * unitPrice;
        }
      }
    }
  }

  if (echoValue === null) return;

  tooltipBox.dataset.flPriceAdded = "1";
  const descEl = tooltipBox.querySelector(".tooltip__desc")
              || tooltipBox.querySelector(".tippy-content")
              || tooltipBox;
  const line = document.createElement("div");
  line.style.cssText = "color:#c9b25e;font-style:italic;margin-top:4px;font-size:0.9em";
  line.textContent = `worth ${echoValue.toFixed(2)} E`;
  descEl.appendChild(line);
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

// Maps id → API quality name suffix (exact string the game uses in Favours:/Renown: items)
const FACTION_API_NAMES = new Map([
  [755, "Bohemians"],
  [750, "The Church"],
  [748, "Constables"],
  [753, "Criminals"],
  [757, "The Docks"],
  [758, "The Great Game"],
  [749, "Hell"],
  [761, "Revolutionaries"],
  [754, "Rubbery Men"],
  [752, "Society"],
  [762, "Tomb-Colonies"],
  [751, "Urchins"],
]);
const FACTION_API_NAME_TO_ID = new Map([...FACTION_API_NAMES].map(([id, s]) => [s, id]));

let _cachedConversionItems = null; // null = not yet received; Map after first myself
let _cachedCCQtys = null;          // null = not yet received; Map<id,qty> after first myself
let _cachedFactionStats = null;    // null = not yet received; Map<id,{favours,renown}> after first myself
let _cachedFavoursQtys = null;     // Map<favoursQualityId, qty> — used to recover qty when quality goes to 0

function parseMyself(data) {
  if (!data || !Array.isArray(data.possessions)) return;
  const owned = new Map();
  const ccQtys = new Map();
  const factionStats = new Map();
  const favoursQtys = new Map();

  function scan(categories) {
    for (const cat of categories) {
      for (const p of (cat.possessions || [])) {
        if (CONVERSION_ITEMS.has(p.id)) {
          owned.set(p.id, { id: p.id, name: p.name, qty: p.level || 1, image: p.image || null });
        }
        if (CC_ITEM_IDS.has(p.id)) {
          ccQtys.set(p.id, p.level || 1);
        }
        if (p.name) {
          const favM = p.name.match(/^Favours: (.+)$/);
          const renM = p.name.match(/^Renown: (.+)$/);
          if (favM) {
            const fid = FACTION_API_NAME_TO_ID.get(favM[1]);
            if (fid != null) {
              const e = factionStats.get(fid) ?? { favours: 0, renown: 0 };
              e.favours = p.level || 0;
              factionStats.set(fid, e);
            }
            if (p.level > 0) favoursQtys.set(p.id, p.level);
          }
          if (renM) {
            const fid = FACTION_API_NAME_TO_ID.get(renM[1]);
            if (fid != null) {
              const e = factionStats.get(fid) ?? { favours: 0, renown: 0 };
              e.renown = p.level || 0;
              factionStats.set(fid, e);
            }
          }
        }
      }
      if (Array.isArray(cat.categories)) scan(cat.categories);
    }
  }

  scan(data.possessions);
  _cachedConversionItems = owned;
  _cachedCCQtys = ccQtys;
  _cachedFactionStats = factionStats;
  _cachedFavoursQtys = favoursQtys;
  // Remove stale bars so they re-inject with fresh data (qty and faction stats now known)
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

    const s = _cachedFactionStats?.get(id) ?? { favours: 0, renown: 0 };
    const statsDiv = document.createElement("div");
    statsDiv.className = "fl-faction-stats";
    statsDiv.textContent = `${s.favours}/7 · ${s.renown}/55`;
    li.appendChild(statsDiv);

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
    "#fl-renown-bar li.item{display:inline-flex;flex-direction:column;align-items:center;overflow:visible;height:auto;vertical-align:top}",
    "#fl-renown-bar .fl-faction-stats{font-size:10px;color:#282520;text-align:center;margin-top:2px;font-family:Georgia,serif;line-height:1.4}",
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

const _iconObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;
      annotateIconAriaLabels(node);
      annotateTooltip(node);
    }
  }
});

annotateIconAriaLabels(document);
_iconObserver.observe(document.documentElement, { childList: true, subtree: true });
window.FL_HELPER_LOADED = true;
