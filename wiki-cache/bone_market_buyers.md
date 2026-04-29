# Bone Market Buyers — Verbatim Wiki Formulas

Fetched from individual wiki pages. Prices from extension/prices.js.

## Item Prices Used

| Item | ID | Price |
|---|---|---|
| Bombazine Scrap (Thirsty) | unknown | 2.50ε |
| Preserved Surface Blooms | 141157 | 2.50ε |
| Incisive Observation | 140898 | 0.50ε |
| Crate of Incorruptible Biscuits | 140892 | 2.50ε |
| Bone Fragments | 140889 | 0.01ε |
| Unearthly Fossil | 810 | 2.50ε |
| Bessemer Steel Ingot | 141159 | 0.50ε |
| Unprovenanced Artefact | 122487 | 2.50ε |
| Hinterland Scrip | 125025 | 0.50ε |
| Basket of Rubbery Pies | 140894 | 2.50ε |
| Nightsoil of the Bazaar | 141158 | 0.50ε |
| Ambiguous Eolith | 122485 | 0.50ε |
| Memory of Light | 589 | 0.50ε |
| Tailfeather Brilliant as Flame | 141160 | 2.50ε |
| Morelways 1872 | 815 | 0.10ε |
| Royal-Blue Feather | 122494 | 0.50ε |
| Memory of Distant Shores | 825 | 0.50ε |
| Final Breath | 141161 | 0.50ε |
| Carved Ball of Stygian Ivory | 122483 | 2.50ε |
| Knob of Scintillack | 122495 | 2.50ε |
| Nodule of Warm Amber | 328 | 2.50ε |
| An Identity Uncovered! | 657 | 2.50ε |

---

## Always-Available Buyers

### A Naive Collector
**Page:** /wiki/A_Naive_Collector (fetched prev session)
**Success items:** `floor((AV + mania) / 250)` × Thirsty Bombazine Scrap (2.50ε)
**Echo formula:** `floor((AV + mania) / 250) × 2.50`
**Verified:** AV=8500, mania=0 → 34 scraps × 2.50 = 85ε ✓ (real sale)

### A Bohemian Sculptress
**Page:** /wiki/A_Bohemian_Sculptress (fetched prev session)
**Requirements:** Respectable=0, Antiquity=0
**Success items:** `(4 + floor((AV + mania) / 250))` × Preserved Surface Blooms (2.50ε)
**Echo formula:** `(4 + floor((AV + mania) / 250)) × 2.50`

### A Grandmother
**Page:** /wiki/A_Grandmother (fetched prev session)
**Requirements:** Dreaded=0, Menace=0
**Success items:** `(20 + floor((AV + mania) / 50))` × Incisive Observations (0.50ε)
**Echo formula:** `(20 + floor((AV + mania) / 50)) × 0.50`

### A Theologian
**Page:** /wiki/A_Theologian (fetched prev session)
**Requirements:** Bizarre=0, Amalgamy=0
**Success items:** `(4 + floor((AV + mania) / 250))` × Crate of Incorruptible Biscuits (2.50ε)
**Echo formula:** `(4 + floor((AV + mania) / 250)) × 2.50`

### A Palaeontologist with Hoarding Propensities
**Page:** /wiki/A_Palaeontologist_with_Hoarding_Propensities (fetched prev session)
**Requirements:** none
**Success items:**
- `(AV + mania + 5)` × Bone Fragments (0.01ε)
- `2` × Unearthly Fossil (2.50ε)
**Echo formula:** `(AV + mania + 5) × 0.01 + 5.00`

---

## Basic Attribute Buyers

### An Enthusiast of the Ancient World
**Page:** /wiki/Sell_your_skeleton_to_an_Enthusiast_of_the_Ancient_World
**Requirements:** Respectable≥3, Antiquity≥1
**Success items:**
- `floor((AV + mania) / 50)` × Bessemer Steel Ingot (0.50ε)
- `Antiquity` × Unprovenanced Artefact (2.50ε) [+1 if mania=Antiquity fluctuation]
**Echo formula:** `floor((AV + mania) / 50) × 0.50 + Antiquity × 2.50`

### Mrs Plenty's Bone Market Representative
**Page:** /wiki/Sell_a_complete_skeleton_to_Mrs_Plenty
**Requirements:** Dreaded≥3, Menace≥1
**Success items:**
- `floor((AV + mania) / 50)` × Hinterland Scrip (0.50ε)
- `Menace` × Basket of Rubbery Pies (2.50ε) [+1 if mania=Menace fluctuation]
**Echo formula:** `floor((AV + mania) / 50) × 0.50 + Menace × 2.50`

### A Tentacled Servant
**Page:** /wiki/A_Tentacled_Servant
**Requirements:** Bizarre≥3, Amalgamy≥1
**Success items:**
- `(5 + floor((AV + mania) / 50))` × Nightsoil of the Bazaar (0.50ε)
- `Amalgamy × 5` × Ambiguous Eolith (0.50ε) [or `(Amalgamy+1)×5` if mania=Amalgamy fluctuation]
**Echo formula:** `(5 + floor((AV + mania) / 50)) × 0.50 + Amalgamy × 2.50`

---

## Premium Attribute Buyers (Exhaustion<4 required)

### An Ambassador from the Khanate
**Page:** (fetched prev session)
**Requirements:** Respectable≥15, Exhaustion<4, Antiquity≥1
**Success items:**
- `ceil(5 + (AV + mania) / 50)` × Memory of Light (0.50ε)
- `floor(0.8 × Antiquity²)` × Tailfeather Brilliant as Flame (2.50ε)
**Exhaustion gain:** `floor(Antiquity² / 25)`
**Echo formula:** `ceil(5 + (AV + mania) / 50) × 0.50 + floor(0.8 × Antiquity²) × 2.50`

### A Teller of Terrors
**Page:** /wiki/A_Teller_of_Terrors
**Requirements:** Dreaded≥15, Exhaustion<4, Menace≥1
**Success items:**
- `(25 + floor((AV + mania) / 10))` × Bottles of Morelways 1872 (0.10ε)
- `floor(4 × Menace²)` × Royal-Blue Feather (0.50ε) [or `4×Menace^2.1` if mania=Menace]
**Exhaustion gain:** `floor(Menace² / 25)`
**Echo formula:** `(25 + floor((AV + mania) / 10)) × 0.10 + floor(4 × Menace²) × 0.50`

### A Tentacled Entrepreneur
**Page:** (fetched prev session)
**Requirements:** Bizarre≥15, Exhaustion<4, Amalgamy≥1
**Success items:**
- `(5 + floor((AV + mania) / 50))` × Memory of Distant Shores (0.50ε)
- `floor(4 × Amalgamy²)` × Final Breath (0.50ε)
**Exhaustion gain:** `floor(Amalgamy² / 25)`
**Echo formula:** `(5 + floor((AV + mania) / 50)) × 0.50 + floor(4 × Amalgamy²) × 0.50`

### A Gothic Author
**Page:** (fetched prev session)
**Requirements:** Respectable≥7, Dreaded≥7, Exhaustion<4, Antiquity≥1, Menace≥1
**Success items:**
- `(5 + floor((AV + mania) / 50))` × Hinterland Scrip (0.50ε)
- `Antiquity × Menace` × Stygian Ivory (2.50ε)
**Exhaustion gain:** `floor(Antiquity × Menace / 20)`
**Echo formula:** `(5 + floor((AV + mania) / 50)) × 0.50 + Antiquity × Menace × 2.50`

### A Zailor with Particular Interests
**Page:** /wiki/A_Zailor_with_Particular_Interests
**Requirements:** Respectable≥7, Bizarre≥7, Exhaustion<4, Antiquity≥1, Amalgamy≥1
**Success items:**
- `(25 + floor((AV + mania) / 10))` × Nodule of Warm Amber (2.50ε)
- `Amalgamy × Antiquity` × Scintillack (2.50ε) [±0.5 multiplier per mania fluctuation]
**Exhaustion gain:** `floor(Amalgamy × Antiquity / 20)`
**Echo formula:** `(25 + floor((AV + mania) / 10)) × 2.50 + Amalgamy × Antiquity × 2.50`
**Note:** Warm Amber uses /10 divisor (same as Teller of Terrors) but item is 25× more valuable.

### A Rubbery Collector
**Page:** /wiki/A_Rubbery_Collector
**Requirements:** Dreaded≥7, Bizarre≥7, Exhaustion<4, Menace≥1, Amalgamy≥1
**Success items:**
- `(5 + floor((AV + mania) / 50))` × Nightsoil of the Bazaar (0.50ε)
- `Amalgamy × Menace` × Basket of Rubbery Pies (2.50ε) [±0.5 per mania fluctuation]
**Exhaustion gain:** `floor(Amalgamy × Menace / 20)`
**Echo formula:** `(5 + floor((AV + mania) / 50)) × 0.50 + Menace × Amalgamy × 2.50`

---

## Type-Specific Buyers

### A Constable
**Page:** /wiki/Sell_to_a_Constable_(Skeleton)
**Requirements:** skeletonInProgress 110–119 (humanoid)
**Success items:** `(20 + floor((AV + mania) / 50))` × Hinterland Scrip (0.50ε)
**Echo formula:** `(20 + floor((AV + mania) / 50)) × 0.50`
**Verified:** AV=4450, mania=0 → (20+89)×0.50 = 54.5ε ✓ (real sale)

### The Dumbwaiter of Balmoral
**Page:** /wiki/The_Dumbwaiter_of_Balmoral
**Requirements:** skeletonInProgress 180–189 (bird)
**Success items (Export the Skeleton of a Neathy Bird):** `floor(AV / 250)` × An Identity Uncovered! (2.50ε)
**Echo formula:** `floor((AV + mania) / 250) × 2.50` (mania unclear from wiki text; treating same as Naive Collector)
**Note:** Needs verification with a real bird skeleton sale.
