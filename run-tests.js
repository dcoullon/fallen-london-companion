const fs = require("fs");
const prices = fs.readFileSync("extension/prices.js", "utf8");
const src = fs.readFileSync("extension/content.js", "utf8");
const start = src.indexOf("// ── Parse choosebranch response");
const end = src.indexOf("// ── Wire up");
const fn = new Function(prices + src.slice(start, end) + "; return { parseChanges, parseSaturation, evaluateBuyers, _updateSkeletonFromChoosebranch, _skeletonState };");
const { parseChanges, parseSaturation, evaluateBuyers, _updateSkeletonFromChoosebranch, _skeletonState } = fn();

// Helper: reset skeleton state and set specific fields
function setSkelState(fields) {
  Object.assign(_skeletonState, {
    approximateValue: 0, amalgamy: 0, antiquity: 0, menace: 0, exhaustion: 0,
    respectable: 0, dreaded: 0, bizarre: 0, zoologicalMania: 0,
    skeletonInProgress: 0, skullsNeeded: 0, limbsNeeded: 0,
    skulls: 0, arms: 0, legs: 0, wings: 0, fins: 0, tails: 0, tentacles: 0,
    implausibility: 0, torsoStyle: 0,
  }, fields);
}

const fixtures = [
  {
    label: "Rostygold loss + Favour gain (−0.10 + 6.00)",
    check(changes) {
      if (changes.length !== 2) return "expected 2 changes, got " + changes.length;
      const rg = changes.find(c => c.name === "Piece of Rostygold");
      const fav = changes.find(c => c.name === "Favours: Constables");
      if (!rg) return "Rostygold missing";
      if (!fav) return "Favour missing";
      if (rg.gained !== false) return "Rostygold should be loss";
      if (fav.gained !== true) return "Favour should be gain";
      if (rg.qty !== 10) return "Rostygold qty " + rg.qty;
      if (fav.qty !== 1) return "Favour qty " + fav.qty;
      if (Math.abs(rg.echoValue - (-0.10)) > 0.001) return "Rostygold echo " + rg.echoValue;
      if (Math.abs(fav.echoValue - 6.00) > 0.001) return "Favour echo " + fav.echoValue;
    },
    data: { messages: [
      { possession: { name: "Piece of Rostygold", nature: "Thing", id: 375 }, changeType: "Increased", type: "StandardQualityChangeMessage", message: "You've lost 10 x Piece of Rostygold (new total 97,877). " },
      { possession: { name: "Favours: Constables", nature: "Status", id: 132800 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 1 x Favours: Constables (new total 5). " },
    ]},
  },
  {
    label: "Certifiable Scrap + Penny (net 4.00)",
    check(changes) {
      if (changes.length !== 2) return "expected 2, got " + changes.length;
      const net = changes.reduce((s, c) => s + c.echoValue, 0);
      if (Math.abs(net - 4.00) > 0.001) return "net " + net;
    },
    data: { messages: [
      { possession: { name: "Certifiable Scrap", nature: "Thing", id: 918 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 4 x Certifiable Scrap (new total 1,892). " },
      { possession: { name: "Penny", nature: "Thing", id: 22390 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 200 x Penny (new total 242,050). " },
      { possession: { name: "Persuasive", nature: "Status", id: 212 }, changeType: "Unaltered", type: "QualityCapMessage", message: "cap" },
    ]},
  },
  {
    label: "Nodule gained + Greyfields lost (net 12.50)",
    check(changes) {
      if (changes.length !== 2) return "expected 2, got " + changes.length;
      const nodule = changes.find(c => c.name === "Nodule of Deep Amber");
      const wine   = changes.find(c => c.name === "Bottle of Greyfields 1882");
      if (!nodule) return "nodule missing";
      if (!wine)   return "wine missing";
      if (!nodule.gained) return "nodule should be gained";
      if (wine.gained)    return "wine should be lost";
      const net = changes.reduce((s, c) => s + c.echoValue, 0);
      if (Math.abs(net - 12.50) > 0.001) return "net " + net;
    },
    data: { messages: [
      { possession: { name: "Nodule of Deep Amber", nature: "Thing", id: 385 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 2,000 x Nodule of Deep Amber (new total 54,805). " },
      { possession: { name: "Bottle of Greyfields 1882", nature: "Thing", id: 383 }, changeType: "Increased", type: "StandardQualityChangeMessage", message: "You've lost 375 x Bottle of Greyfields 1882 (new total 624). " },
      { possession: { name: "Status only", nature: "Status", id: 99999 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "Something happened" },
    ]},
  },
  {
    label: "Board dividend 3 items (net 68.00)",
    check(changes) {
      if (changes.length !== 3) return "expected 3, got " + changes.length;
      const net = changes.reduce((s, c) => s + c.echoValue, 0);
      if (Math.abs(net - 68.00) > 0.001) return "net " + net.toFixed(2) + " != 68.00";
    },
    data: { messages: [
      { possession: { name: "In Corporate Debt", nature: "Status", id: 141228 }, changeType: "Gained", type: "PyramidQualityChangeMessage", message: "twist" },
      { possession: { name: "Moon-Pearl", nature: "Thing", id: 379 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 3,800 x Moon-Pearl (new total 17,800). " },
      { possession: { name: "Magnificent Diamond", nature: "Thing", id: 12188 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 2 x Magnificent Diamond (new total 11). " },
      { possession: { name: "Bottle of Broken Giant 1844", nature: "Thing", id: 823 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 2 x Bottle of Broken Giant 1844 (new total 21). " },
    ]},
  },
  {
    label: "Hinterland Prosperity non-Thing but priced (520 × 0.01 = 5.20)",
    check(changes) {
      if (changes.length !== 1) return "expected 1, got " + changes.length;
      const c = changes[0];
      if (c.name !== "Hinterland Prosperity") return "wrong item: " + c.name;
      if (!c.gained) return "should be gained";
      if (c.qty !== 520) return "qty " + c.qty;
      if (Math.abs(c.echoValue - 5.20) > 0.001) return "echo " + c.echoValue;
    },
    data: { messages: [
      { possession: { id: 144605, name: "Hinterland Prosperity", nature: "Progress", category: "Progress", level: 77103 }, changeType: "Decreased", type: "StandardQualityChangeMessage", message: "You've gained 520 x Hinterland Prosperity (new total 77,103)." },
      { possession: { id: 212, name: "Watchful", nature: "Status" }, changeType: "Unaltered", type: "QualityCapMessage", message: "cap" },
    ]},
  },
  {
    label: "First-time gain QualityExplicitlySetMessage (1 × 12.50)",
    check(changes) {
      if (changes.length !== 1) return "expected 1, got " + changes.length;
      const c = changes[0];
      if (c.name !== "Vital Intelligence") return "wrong item: " + c.name;
      if (!c.gained) return "should be gained";
      if (c.qty !== 1) return "qty " + c.qty;
      if (Math.abs(c.echoValue - 12.50) > 0.001) return "echo " + c.echoValue;
    },
    data: { messages: [
      { possession: { id: 122489, name: "Vital Intelligence", nature: "Thing", category: "GreatGame", level: 1 }, type: "QualityExplicitlySetMessage", message: "You now have 1 x Vital Intelligence" },
      { possession: { id: 9070, name: "The Airs of London", nature: "Status" }, type: "QualityExplicitlySetMessage", message: "Airs 55" },
    ]},
  },
];

const satFixtures = [
  { label: "Saturation 32,500 → 32500", expected: 32500,
    data: { messages: [{ possession: { name: "Rat Market Saturation", level: 32500 }, type: "StandardQualityChangeMessage", message: "x" }] } },
  { label: "Saturation 100,000 → 100000", expected: 100000,
    data: { messages: [{ possession: { name: "Rat Market Saturation", level: 100000 }, type: "StandardQualityChangeMessage", message: "x" }] } },
  { label: "Saturation 200,000 → 200000", expected: 200000,
    data: { messages: [{ possession: { name: "Rat Market Saturation", level: 200000 }, type: "StandardQualityChangeMessage", message: "x" }] } },
  { label: "No saturation → null", expected: null,
    data: { messages: [{ possession: { name: "Certifiable Scrap", nature: "Thing", level: 100, id: 918 }, type: "StandardQualityChangeMessage", message: "You've gained 4 x Certifiable Scrap (new total 100)." }] } },
];

let pass = 0, fail = 0;

for (const f of fixtures) {
  const reason = f.check(parseChanges(f.data));
  const ok = !reason;
  console.log((ok ? "PASS" : "FAIL") + "  " + f.label + (ok ? "" : "\n      => " + reason));
  ok ? pass++ : fail++;
}

for (const f of satFixtures) {
  const level = parseSaturation(f.data);
  const ok = level === f.expected;
  console.log((ok ? "PASS" : "FAIL") + "  " + f.label + (ok ? "" : "\n      => got " + level + ", expected " + f.expected));
  ok ? pass++ : fail++;
}

// ── Bone Market buyer evaluation tests ───────────────────────────────────────

const bmFixtures = [
  {
    label: "No-attribute skeleton: Grandmother beats Naive Collector",
    check() {
      setSkelState({ approximateValue: 8500 }); // 85ε face value, no attributes
      const buyers = evaluateBuyers(_skeletonState);
      const nc = buyers.find(b => b.name === "Naive Collector");
      const gm = buyers.find(b => b.name === "Grandmother");
      if (!nc) return "Naive Collector missing";
      if (!gm) return "Grandmother missing";
      // Naive Collector: floor(8500/250)*2.50 = 34*2.50 = 85ε (verified real sale)
      if (Math.abs(nc.echoes - 85.00) > 0.01) return `Naive Collector echoes ${nc.echoes.toFixed(2)} != 85.00`;
      // Grandmother: (20+floor(8500/50))*0.50 = (20+170)*0.50 = 95ε
      if (Math.abs(gm.echoes - 95.00) > 0.01) return `Grandmother echoes ${gm.echoes.toFixed(2)} != 95.00`;
      if (gm.echoes <= nc.echoes) return `Grandmother (${gm.echoes}) should beat Naive Collector (${nc.echoes})`;
    },
  },
  {
    label: "Naive Collector formula verified (AV=8500, mania=0 → 85.00ε)",
    check() {
      setSkelState({ approximateValue: 8500 });
      const buyers = evaluateBuyers(_skeletonState);
      const nc = buyers.find(b => b.name === "Naive Collector");
      if (!nc) return "Naive Collector missing";
      if (Math.abs(nc.echoes - 85.00) > 0.01) return `got ${nc.echoes.toFixed(2)}, expected 85.00`;
    },
  },
  {
    label: "Palaeontologist: always eligible, beats Naive Collector for same AV",
    check() {
      setSkelState({ approximateValue: 8500 });
      const buyers = evaluateBuyers(_skeletonState);
      const palaeo = buyers.find(b => b.name === "Palaeontologist");
      const nc = buyers.find(b => b.name === "Naive Collector");
      if (!palaeo) return "Palaeontologist missing";
      if (!nc) return "Naive Collector missing";
      // Palaeontologist: (8500+5)*0.01 + 5.00 = 85.05 + 5.00 = 90.05ε
      if (Math.abs(palaeo.echoes - 90.05) > 0.01) return `Palaeontologist echoes ${palaeo.echoes.toFixed(2)} != 90.05`;
      if (palaeo.echoes <= nc.echoes) return `Palaeontologist (${palaeo.echoes.toFixed(1)}) should beat Naive Collector (${nc.echoes.toFixed(1)})`;
    },
  },
  {
    label: "Constable formula verified (AV=4450, mania=0 → 54.50ε)",
    check() {
      setSkelState({ approximateValue: 4450, skeletonInProgress: 111 });
      const buyers = evaluateBuyers(_skeletonState);
      const constable = buyers.find(b => b.name === "Constable");
      if (!constable) return "Constable not eligible for humanoid";
      if (Math.abs(constable.echoes - 54.50) > 0.01) return `got ${constable.echoes.toFixed(2)}, expected 54.50`;
    },
  },
  {
    label: "Constable: excluded for non-humanoid (skeletonInProgress=10)",
    check() {
      setSkelState({ approximateValue: 4450, skeletonInProgress: 10 });
      const buyers = evaluateBuyers(_skeletonState);
      const constable = buyers.find(b => b.name === "Constable");
      if (constable) return "Constable should not be eligible when skeletonInProgress=10";
    },
  },
  {
    label: "Dumbwaiter: eligible for bird (180–189), not humanoid (110–119)",
    check() {
      setSkelState({ approximateValue: 5000, skeletonInProgress: 183 });
      const buyers1 = evaluateBuyers(_skeletonState);
      const dw1 = buyers1.find(b => b.name === "Dumbwaiter");
      if (!dw1) return "Dumbwaiter should be eligible for skeletonInProgress=183";
      setSkelState({ approximateValue: 5000, skeletonInProgress: 111 });
      const buyers2 = evaluateBuyers(_skeletonState);
      const dw2 = buyers2.find(b => b.name === "Dumbwaiter");
      if (dw2) return "Dumbwaiter should NOT be eligible for skeletonInProgress=111";
    },
  },
  {
    label: "Zoological mania shifts Naive Collector up (AV=8500, mania=250 → 87.50ε)",
    check() {
      setSkelState({ approximateValue: 8500, zoologicalMania: 250 });
      const buyers = evaluateBuyers(_skeletonState);
      const nc = buyers.find(b => b.name === "Naive Collector");
      if (!nc) return "Naive Collector missing";
      // floor((8500+250)/250)*2.50 = 35*2.50 = 87.50
      if (Math.abs(nc.echoes - 87.50) > 0.01) return `got ${nc.echoes.toFixed(2)}, expected 87.50`;
    },
  },
  {
    label: "High-Antiquity skeleton: Ambassador beats Ancient Enthusiast",
    check() {
      setSkelState({ approximateValue: 500, antiquity: 5, respectable: 20 });
      const buyers = evaluateBuyers(_skeletonState);
      const ambassador = buyers.find(b => b.name === "Ambassador");
      const enthusiast = buyers.find(b => b.name === "Ancient Enthusiast");
      if (!ambassador) return "Ambassador not eligible";
      if (!enthusiast) return "Ancient Enthusiast not eligible";
      if (ambassador.echoes <= enthusiast.echoes) return `Ambassador (${ambassador.echoes.toFixed(1)}) should beat Enthusiast (${enthusiast.echoes.toFixed(1)})`;
    },
  },
  {
    label: "Mixed Antiquity×Menace: Gothic Author beats Ambassador",
    check() {
      setSkelState({ approximateValue: 500, antiquity: 5, menace: 5, respectable: 20, dreaded: 20 });
      const buyers = evaluateBuyers(_skeletonState);
      const author = buyers.find(b => b.name === "Gothic Author");
      const ambassador = buyers.find(b => b.name === "Ambassador");
      if (!author) return "Gothic Author not eligible";
      if (!ambassador) return "Ambassador not eligible";
      if (author.echoes <= ambassador.echoes) return `Gothic Author (${author.echoes.toFixed(1)}) should beat Ambassador (${ambassador.echoes.toFixed(1)})`;
    },
  },
  {
    label: "Exhaustion = 4: Ambassador excluded, Ancient Enthusiast still eligible",
    check() {
      setSkelState({ approximateValue: 500, antiquity: 5, exhaustion: 4, respectable: 20 });
      const buyers = evaluateBuyers(_skeletonState);
      const ambassador = buyers.find(b => b.name === "Ambassador");
      const enthusiast = buyers.find(b => b.name === "Ancient Enthusiast");
      if (ambassador) return "Ambassador should be excluded at Exhaustion 4";
      if (!enthusiast) return "Ancient Enthusiast should still be eligible";
    },
  },
  {
    label: "_updateSkeletonFromChoosebranch updates approximateValue + limb fields",
    check() {
      setSkelState({});
      _updateSkeletonFromChoosebranch({ messages: [
        { possession: { id: 140812, level: 375 } },
        { possession: { id: 140825, level: 3 } },
        { possession: { id: 140819, level: 2 } },  // arms
        { possession: { id: 140820, level: 4 } },  // legs
      ]});
      if (_skeletonState.approximateValue !== 375) return "approximateValue " + _skeletonState.approximateValue;
      if (_skeletonState.amalgamy !== 3) return "amalgamy " + _skeletonState.amalgamy;
      if (_skeletonState.arms !== 2) return "arms " + _skeletonState.arms;
      if (_skeletonState.legs !== 4) return "legs " + _skeletonState.legs;
    },
  },
  {
    label: "_updateSkeletonFromChoosebranch resets to 0 when level=0",
    check() {
      setSkelState({ approximateValue: 500, amalgamy: 4 });
      _updateSkeletonFromChoosebranch({ messages: [
        { possession: { id: 140812, level: 0 } },
        { possession: { id: 140825, level: 0 } },
      ]});
      if (_skeletonState.approximateValue !== 0) return "approximateValue should be 0";
      if (_skeletonState.amalgamy !== 0) return "amalgamy should be 0";
    },
  },
  {
    label: "Implausibility tracked in state but not in any payout formula",
    check() {
      setSkelState({ approximateValue: 8500, implausibility: 5 });
      const buyers = evaluateBuyers(_skeletonState);
      const nc = buyers.find(b => b.name === "Naive Collector");
      if (!nc) return "Naive Collector missing";
      // Implausibility should NOT affect payout — same as no implausibility
      if (Math.abs(nc.echoes - 85.00) > 0.01) return `Naive Collector echoes ${nc.echoes.toFixed(2)} != 85.00 (implausibility leaked into formula)`;
    },
  },
  {
    label: "Bone Market Fluctuations=1 (Antiquity week): Ancient Enthusiast +2.50ε",
    check() {
      // Without fluctuations: floor(5000/50)*0.50 + 3*2.50 = 50 + 7.50 = 57.50
      setSkelState({ approximateValue: 5000, antiquity: 3, respectable: 5 });
      const base = evaluateBuyers(_skeletonState).find(b => b.name === "Ancient Enthusiast");
      if (!base) return "Ancient Enthusiast missing (no fluctuation)";
      if (Math.abs(base.echoes - 57.50) > 0.01) return `base echoes ${base.echoes.toFixed(2)} != 57.50`;
      // With fluctuations=1: +1 Artefact → antiquity+1 = 4*2.50 = +2.50
      setSkelState({ approximateValue: 5000, antiquity: 3, respectable: 5, boneMarketFluctuations: 1 });
      const fluct = evaluateBuyers(_skeletonState).find(b => b.name === "Ancient Enthusiast");
      if (!fluct) return "Ancient Enthusiast missing (fluctuation=1)";
      if (Math.abs(fluct.echoes - 60.00) > 0.01) return `fluctuation echoes ${fluct.echoes.toFixed(2)} != 60.00`;
    },
  },
  {
    label: "Bone Market Fluctuations=2 (Amalgamy week): Tentacled Servant +2.50ε",
    check() {
      // Without fluctuations: (5 + floor(5000/50))*0.50 + 2*2.50 = 105*0.50 + 5 = 52.50 + 5 = 57.50
      setSkelState({ approximateValue: 5000, amalgamy: 2, bizarre: 5 });
      const base = evaluateBuyers(_skeletonState).find(b => b.name === "Tentacled Servant");
      if (!base) return "Tentacled Servant missing (no fluctuation)";
      if (Math.abs(base.echoes - 57.50) > 0.01) return `base echoes ${base.echoes.toFixed(2)} != 57.50`;
      // With fluctuations=2: amalgamy+1 = 3*2.50 = 7.50 → total 60.00
      setSkelState({ approximateValue: 5000, amalgamy: 2, bizarre: 5, boneMarketFluctuations: 2 });
      const fluct = evaluateBuyers(_skeletonState).find(b => b.name === "Tentacled Servant");
      if (!fluct) return "Tentacled Servant missing (fluctuation=2)";
      if (Math.abs(fluct.echoes - 60.00) > 0.01) return `fluctuation echoes ${fluct.echoes.toFixed(2)} != 60.00`;
    },
  },
  {
    label: "Bone Market Fluctuations=1 (Antiquity week): Gothic Author — verified sale Antiq=4 Menace=3 → 14 ivory",
    check() {
      // Real sale: AV=3500, mania=355, Antiq=4, Menace=3, fluctuations=1 → 14 Stygian Ivory × 2.50 + 82 Scrip × 0.50 = 76ε
      setSkelState({ approximateValue: 3500, zoologicalMania: 355, antiquity: 4, menace: 3,
                     respectable: 20, dreaded: 20, boneMarketFluctuations: 1 });
      const ga = evaluateBuyers(_skeletonState).find(b => b.name === "Gothic Author");
      if (!ga) return "Gothic Author missing";
      // (5 + floor(3855/50)) * 0.50 + floor(4 * 3.5) * 2.50 = 82*0.50 + 14*2.50 = 41 + 35 = 76
      if (Math.abs(ga.echoes - 76.00) > 0.01) return `echoes ${ga.echoes.toFixed(2)} != 76.00`;
    },
  },
  {
    label: "Bone Market Fluctuations=3 (Menace week): Mrs Plenty +2.50ε",
    check() {
      // Without fluctuations: floor(5000/50)*0.50 + 2*2.50 = 50 + 5 = 55.00
      setSkelState({ approximateValue: 5000, menace: 2, dreaded: 5 });
      const base = evaluateBuyers(_skeletonState).find(b => b.name === "Mrs Plenty");
      if (!base) return "Mrs Plenty missing (no fluctuation)";
      if (Math.abs(base.echoes - 55.00) > 0.01) return `base echoes ${base.echoes.toFixed(2)} != 55.00`;
      // With fluctuations=3: menace+1 = 3*2.50 = +2.50
      setSkelState({ approximateValue: 5000, menace: 2, dreaded: 5, boneMarketFluctuations: 3 });
      const fluct = evaluateBuyers(_skeletonState).find(b => b.name === "Mrs Plenty");
      if (!fluct) return "Mrs Plenty missing (fluctuation=3)";
      if (Math.abs(fluct.echoes - 57.50) > 0.01) return `fluctuation echoes ${fluct.echoes.toFixed(2)} != 57.50`;
    },
  },
];

for (const f of bmFixtures) {
  const reason = f.check();
  const ok = !reason;
  console.log((ok ? "PASS" : "FAIL") + "  " + f.label + (ok ? "" : "\n      => " + reason));
  ok ? pass++ : fail++;
}

console.log("\n" + pass + "/" + (pass + fail) + " passed" + (fail ? "  —  " + fail + " FAILED" : ""));
process.exit(fail > 0 ? 1 : 0);
