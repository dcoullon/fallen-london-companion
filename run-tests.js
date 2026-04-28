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
    respectable: 0, dreaded: 0, bizarre: 0,
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
    label: "No-attribute skeleton: Naive Collector is top buyer",
    check() {
      setSkelState({ approximateValue: 250 }); // 2.50ε, no attributes
      const buyers = evaluateBuyers(_skeletonState);
      if (buyers.length === 0) return "no eligible buyers";
      if (buyers[0].name !== "Naive Collector") return "top buyer: " + buyers[0].name;
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
    label: "_updateSkeletonFromChoosebranch updates approximateValue",
    check() {
      setSkelState({});
      _updateSkeletonFromChoosebranch({ messages: [
        { possession: { id: 140812, level: 375 } },
        { possession: { id: 140825, level: 3 } },
      ]});
      if (_skeletonState.approximateValue !== 375) return "approximateValue " + _skeletonState.approximateValue;
      if (_skeletonState.amalgamy !== 3) return "amalgamy " + _skeletonState.amalgamy;
    },
  },
  {
    label: "_updateSkeletonFromChoosebranch resets to 0 when level=0",
    check() {
      setSkelState({ approximateValue: 500, amalgamy: 4 });
      _updateSkeletonFromChoosebranch({ messages: [
        { possession: { id: 140812, level: 0 } },  // skeleton sold/reset
        { possession: { id: 140825, level: 0 } },
      ]});
      if (_skeletonState.approximateValue !== 0) return "approximateValue should be 0";
      if (_skeletonState.amalgamy !== 0) return "amalgamy should be 0";
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
