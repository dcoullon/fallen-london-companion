(function () {
  if (window.__flCompanion) { alert("FL Companion is already active!"); return; }
  window.__flCompanion = true;

  const PRICES = {
    557:    0.01,  382:    0.01,  383:    0.02,  815:    0.10,  473:    0.20,
    822:    0.50,  823:    2.50,  736:   12.50,  824:   62.50,  12350: 312.50,
    24121: 1562.60,
    380:    0.01,  389:    0.02,  145109: 0.10,  390:    0.15,  525:    0.50,
    828:    0.50,  809:    2.50,  105858: 12.50, 812:   12.50,  144751: 12.50,
    821:   62.50,  814:  312.50,  106142: 1562.60,
    375:    0.01,  918:    0.50,  122495: 2.50,  141157: 2.50,  139723: 4.17,
    381:    0.01,  907:    0.10,  915:    0.50,  922:    2.50,  923:   12.50,
    924:   62.50,  925:  312.50,  926:  1560.00,
    385:    0.01,  328:    2.50,  810:    2.50,  949:   12.50,  754:   62.50,
    16308: 312.50, 106683: 1560.00, 811:  62.50,
    144025: 0.01,  449:    0.12,  12186:  0.50,  392:    2.50,  737:    6.00,
    12188: 12.50,  742:   12.50,  140900: 12.50, 142094: 16.50, 142710: 20.00,
    751:   60.00,  12187: 312.50,
    420:    0.04,  656:    0.10,  659:    0.50,  657:    2.50,  735:    2.50,
    141194: 2.50,  858:   12.50,  762:   60.00,  141882: 62.50, 931:  312.50,
    930:  1560.00,
    386:    0.02,  928:    0.10,  668:    0.50,  653:    0.90,  122798: 2.50,
    927:    2.50,  747:   12.50,  23695: 12.50,  482:   12.50,  749:   60.00,
    141281: 62.50, 141772: 62.50, 141229: 66.00, 669:  312.50,  929:  1560.00,
    384:    0.01,  652:    0.10,  144977: 12.50, 141160: 2.50,  951:    2.50,
    763:   12.50,  121792: 12.50, 23504: 62.50,  122492: 62.50, 122493: 62.50,
    1053:  312.50,
    374:    0.01,  476:    0.10,  144821: 0.10,  825:    0.50,  144822: 0.50,
    140898: 0.50,  122487: 2.50,  745:    2.50,  141283: 12.50, 142754: 12.50,
    759:   50.00,  122486: 62.50, 118813: 1562.50,
    141161: 0.50,  122490: 0.50,  122489: 12.50, 758:   37.50,  142855: 62.50,
    142793: 312.50, 144796: 1562.50,
    142251: 0.50,  142250: 2.50,  141675: 12.50, 142249: 62.50, 142295: 312.50,
    388:    0.02,  935:    0.10,  932:    0.50,  144955: 0.50,  773:    2.50,
    849:   12.50,  933:   62.50,  936:  312.50,  934:  1560.00,
    377:    0.01,  424:    0.10,  587:    0.50,  852:    2.50,  946:   12.50,
    832:   62.50,  14975: 312.50,
    423:    0.05,  141913: 0.10,  141917: 0.10,  425:    0.15,  141914: 0.50,
    141570: 2.50,  141916: 2.50,  145558: 2.50,  141946: 12.50, 142074: 62.50,
    142448: 62.50,
    426:    0.20,  13929:  0.50,  13928:  2.50,  141883: 12.50, 739:   12.50,
    123213: 62.50, 143050: 62.50, 142087: 312.50,
    378:    0.01,  141285: 0.01,  920:    0.10,  142660: 0.10,  831:    0.50,
    956:    2.50,  743:    6.00,  959:   12.50,  142661: 12.50, 955:   15.00,
    981:   25.00,  129586: 141.85, 142202: 62.50, 143646: 62.50, 142662: 62.50,
    142463: 312.50, 142669: 312.50, 141189: 312.50,
    391:    0.02,  531:    0.10,  827:    0.50,  945:    2.50,  741:   12.50,
    142709: 12.50, 114982: 62.50, 142386: 62.50, 143044: 312.50, 143045: 312.50,
    142504: 1562.50,
    379:    0.01,  122484: 0.50,  122494: 0.50,  122485: 0.50,  122483: 2.50,
    122488: 2.50,  142666: 62.50,
    471:    0.03,  470:    0.10,  477:    0.10,  642:    0.10,  643:    0.12,
    560:    0.20,  523:    0.25,  635:    0.50,  862:    0.50,  468:    2.00,
    413:   12.50,  22523: 12.50,  748:   25.00,  755:   30.00,  761:   35.00,  750:   35.00,
    757:   47.50,  753:   57.50,  13640: 60.00,
    387:    0.01,  141158: 0.50,  141159: 0.50,  764:    2.50,  140779: 2.50,
    738:    6.00,  142840: 62.50,
    376:    0.01,  14621:  0.50,  14620:  2.50,  123214: 12.50,
    141374: 0.10,  141324: 0.10,  141486: 0.50,  122491: 0.50,  618:    0.70,
    121611: 2.50,  140892: 2.50,  140894: 2.50,  142237: 5.00,  140962: 12.50,
    140891: 12.50, 143051: 62.50, 143588: 62.50, 141542: 63.50, 410:  80000.00,
    22390:  0.01,  144605: 0.01,  421:    0.03,  143057: 0.10,  144995: 0.05,
    582:    0.25,  125025: 0.50,  140732: 0.50,  142708: 0.50,  140706: 2.50,
    140889: 0.01,  140879: 0.01,  140771: 0.10,  140852: 0.50,  140756: 1.00,
    140813: 2.50,  140814: 2.50,  140851: 2.50,  143548: 2.50,  140881: 2.50,
    140853: 2.50,  141372: 2.50,  140773: 3.00,  141480: 3.00,  140772: 3.00,
    142727: 5.00,  140839: 12.50, 140833: 12.50, 140850: 12.50, 141371: 12.50,
    142298: 12.50, 140774: 12.50, 141380: 15.00, 140849: 15.00, 141774: 17.50,
    140882: 25.00, 141540: 27.50, 145642: 35.00, 145008: 60.00, 140843: 62.50,
    141479: 62.50, 140847: 62.50, 140838: 62.50, 142351: 65.00, 140845: 312.50,
    140857: 312.50, 140844: 312.50, 141640: 312.50,
    756:   27.50,  18045:  1.00,  18379:  1.00,  18101:  2.00,  18100: 10.00,
    18308: 30.00,  18309: 50.00,  18310: 60.00,  18311: 70.00,  18312: 80.00,
    18396: 130.00, 18381: 180.00, 829:    0.50,  746:    6.00,  141016: 12.50,
    619:    0.50,  752:   27.50,
    422:    0.05,  588:    0.20,  830:    0.50,  658:    0.50,  944:    2.50,
    740:    6.00,  744:   12.50,
    142190: 0.50,
    306:    2.50,  145125: 6.25,  145126: 6.25,  145128: 6.25,  307:    6.40,
    145127: 75.00, 145129: 75.00, 730:  225.00,  727:  312.50,
    718:    6.40,  320:   12.50,  719:   14.40,  322:   62.50,  323:   90.00,
    325:  230.00,  21891: 230.00,
    717:   12.50,  720:   12.50,  319:   14.40,  321:   62.50,  324:   90.00,
    21893: 230.00, 326:  230.40,
    556:    0.01,  303:    0.04,  555:    0.10,  465:    0.50,  466:    0.50,
    544:    1.50,  308:    2.50,  305:    2.50,  304:    6.40,  309:    6.40,
    310:   62.50,  311:   62.50,  21847: 200.00, 21845: 200.00, 21894: 200.00,
    21897: 200.00, 312:  312.50,
    1004:   0.20,  333:    2.50,  327:    3.20,  339:    6.40,  329:   12.50,
    334:   14.40,  338:   25.60,  335:   32.40,  336:   32.40,  330:   51.20,
    340:  160.00,  21896: 210.00, 729:  225.00,  655:  230.00,  332:  250.00,
    337:  312.50,
    290:    0.40,  292:    1.60,  291:    2.50,  293:    2.50,  295:    2.50,
    294:    6.40,  296:    6.40,  298:    6.40,  299:    6.40,  297:    6.40,
    300:   57.60,  301:   62.50,  302:  160.00,  21848: 200.00,
    765:    0.10,  356:    0.40,  467:    0.40,  358:    2.50,  357:    2.50,
    361:    6.40,  359:    6.40,  360:   32.40,  362:   62.50,  363:  160.00,
    364:  160.00,  21846: 230.00,
    1005:  10.00,  348:   12.50,  140648: 14.00, 346:   14.40,  347:   32.40,
    350:   62.50,  349:   62.50,
    313:    0.01,  436:    0.10,  435:    0.10,  722:    0.20,  723:    0.20,
    726:    0.20,  725:    0.20,  721:    0.20,  724:    0.20,  317:    2.88,
    315:    6.40,  316:    6.40,  318:   62.50,  21892: 200.00, 21895: 210.00,
    464:    0.04,  441:    0.20,  442:    0.20,  443:    0.20,  558:    0.50,
    498:    0.50,  342:    6.40,  343:    6.40,  344:    6.40,  345:   32.40,
    351:   45.00,  144549: 100.00, 353:  160.00, 21898: 200.00, 728:  312.50,
    355:  5856.40,
  };

  function parseChanges(data) {
    if (!data || !Array.isArray(data.messages)) return [];
    const changes = [];
    for (const msg of data.messages) {
      if (!msg.possession) continue;
      if (msg.possession.nature !== "Thing" && PRICES[msg.possession.id] == null) continue;
      let gained, qty;
      if (msg.type === "StandardQualityChangeMessage") {
        if (msg.changeType !== "Decreased" && msg.changeType !== "Increased") continue;
        gained = msg.changeType === "Decreased";
        const match = msg.message.match(/([\d,]+) x /);
        if (!match) continue;
        qty = parseInt(match[1].replace(/,/g, ""), 10);
      } else if (msg.type === "QualityExplicitlySetMessage") {
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

  function annotateResults(changes) {
    if (changes.length === 0) return;
    const pricedChanges = changes.filter(c => c.echoValue !== null);
    const annotated = new Set();
    const annotatedParents = [];
    let attempts = 0;
    const tryAnnotate = () => {
      for (const change of pricedChanges) {
        if (annotated.has(change.name)) continue;
        const searchText = " x " + change.name;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.includes(searchText)) continue;
          const parent = node.parentElement;
          if (!parent) continue;
          if (parent.querySelector(".fl-echo-val[data-item=\"" + CSS.escape(change.name) + "\"]")) continue;
          const sign = change.gained ? "+" : "−";
          const color = change.gained ? "#4a7c59" : "#b03030";
          const span = document.createElement("span");
          span.className = "fl-echo-val";
          span.dataset.item = change.name;
          span.style.cssText = "color:" + color + ";font-size:0.9em;margin-left:6px";
          span.textContent = "(" + sign + Math.abs(change.echoValue).toFixed(2) + " echoes)";
          parent.appendChild(span);
          annotated.add(change.name);
          annotatedParents.push(parent);
          break;
        }
      }
      attempts++;
      if (annotated.size < pricedChanges.length && attempts < 20) { setTimeout(tryAnnotate, 150); return; }
      const net = pricedChanges.reduce((s, c) => s + c.echoValue, 0);
      if (annotatedParents.length > 1) {
        const ex = document.getElementById("fl-net-inline");
        if (ex) ex.remove();
        const netColor = net >= 0 ? "#4a7c59" : "#b03030";
        const netSign = net >= 0 ? "+" : "";
        const netEl = document.createElement("div");
        netEl.id = "fl-net-inline";
        netEl.style.cssText = "color:" + netColor + ";font-size:0.9em;margin-top:6px;font-style:italic;border-top:1px solid #3a2e1e;padding-top:4px";
        netEl.textContent = "Net total: " + netSign + net.toFixed(2) + " echoes";
        annotatedParents[annotatedParents.length - 1].insertAdjacentElement("afterend", netEl);
      }
    };
    setTimeout(tryAnnotate, 300);
  }

  function parseSaturation(data) {
    if (!data || !Array.isArray(data.messages)) return null;
    for (const msg of data.messages) {
      if (msg.possession && msg.possession.name === "Rat Market Saturation") return msg.possession.level ?? null;
    }
    return null;
  }

  function annotateSaturation(level) {
    let label, detail;
    if (level <= 65000) { label = "32% boost"; detail = (65000 - level).toLocaleString() + " to 12% tier"; }
    else if (level <= 180000) { label = "12% boost"; detail = (180000 - level).toLocaleString() + " to no boost"; }
    else { label = "no boost"; detail = "above 180k"; }
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
        span.textContent = "(" + label + " · " + detail + ")";
        parent.appendChild(span);
        return;
      }
      if (++attempts < 20) setTimeout(tryAnnotate, 150);
    };
    setTimeout(tryAnnotate, 300);
  }

  function parseRequiredQty(tooltip) {
    if (!tooltip) return null;
    if (/at most/i.test(tooltip)) return null;
    const m = tooltip.match(/you need(?:ed)? ([\d,]+)/i);
    if (m) return parseInt(m[1].replace(/,/g, ""), 10);
    if (/you unlocked this with an?\s/i.test(tooltip)) return 1;
    return null;
  }

  function parseBranchCosts(data) {
    if (!data || !data.storylet || !Array.isArray(data.storylet.childBranches)) return [];
    const results = [];
    for (const branch of data.storylet.childBranches) {
      if (!Array.isArray(branch.qualityRequirements) || branch.qualityRequirements.length === 0) continue;
      const costs = [];
      for (const req of branch.qualityRequirements) {
        if (req.category === "Companion") continue;
        const unitPrice = PRICES[req.qualityId] ?? null;
        if (unitPrice === null) continue;
        const qty = parseRequiredQty(req.tooltip);
        if (qty === null) continue;
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
    const costByQuality = new Map();
    for (const branch of branchCosts) {
      for (const cost of branch.costs) costByQuality.set(cost.name, cost.echoValue);
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
          badge.textContent = "−" + echoValue.toFixed(2) + "E";
          container.appendChild(badge);
          break;
        }
      }
    }
    _branchCostObserver = new MutationObserver(tryInject);
    _branchCostObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; } }, 300000);
  }

  // Patch fetch
  let _cnt = 0;
  function _bump(label) {
    _cnt++;
    let el = document.getElementById("fl-debug");
    if (!el) {
      el = document.createElement("div");
      el.id = "fl-debug";
      el.style.cssText = "position:fixed;bottom:4px;left:4px;background:#191408;border:1px solid #3a2e1e;color:#c9a84c;font-family:monospace;font-size:11px;padding:3px 7px;border-radius:2px;z-index:99999";
      document.body.appendChild(el);
    }
    el.textContent = "FL intercepted: " + _cnt + " (" + label + ")";
  }

  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await _origFetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";
    if (url.includes("choosebranch") || url.includes("storylet/begin")) {
      _bump(url.includes("choosebranch") ? "action" : "branch");
      response.clone().json().then(data => {
        if (url.includes("choosebranch")) {
          annotateResults(parseChanges(data));
          const sat = parseSaturation(data);
          if (sat !== null) annotateSaturation(sat);
        } else {
          annotateBranchCosts(parseBranchCosts(data));
        }
      }).catch(() => {});
    }
    return response;
  };

  // Activation banner
  const banner = document.createElement("div");
  banner.style.cssText = "position:fixed;top:0;left:50%;transform:translateX(-50%);background:#191408;border:1px solid #c9a84c;color:#e8d5a0;font-family:Georgia,serif;font-size:13px;padding:6px 14px;border-radius:0 0 4px 4px;z-index:99999;cursor:pointer";
  banner.textContent = "FL Companion active";
  banner.onclick = () => banner.remove();
  document.body.appendChild(banner);
  setTimeout(() => { banner.style.transition = "opacity 0.5s"; banner.style.opacity = "0"; setTimeout(() => banner.remove(), 500); }, 4000);
})();
