# Bone Market Buyers — Wiki-Confirmed Formulas
Updated: 2026-04-28

All 16 buyer formulas verified against individual wiki pages (cached in wiki-cache/buyer_*.md).
`AV` = approximateValue (pennies), `M` = zoologicalMania (pennies)

## Item Prices

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

## Correct Wiki Page Names

| Buyer (in-game) | Wiki page title |
|---|---|
| Naive Collector | A_Naive_Collector |
| Bohemian Sculptress | A_Familiar_Bohemian_Sculptress (NOT A_Bohemian_Sculptress — that 404s) |
| Grandmother | A_Pedagogically_Inclined_Grandmother (NOT A_Grandmother) |
| Theologian | (not cached; no fluctuation effects) |
| Palaeontologist | A_Palaeontologist_with_Hoarding_Propensities |
| Ancient Enthusiast | Sell_your_skeleton_to_an_Enthusiast_of_the_Ancient_World |
| Mrs Plenty | Sell_a_complete_skeleton_to_Mrs_Plenty |
| Tentacled Servant | A_Tentacled_Servant |
| Ambassador | An_Investment-Minded_Ambassador |
| Teller of Terrors | A_Teller_of_Terrors |
| Tentacled Entrepreneur | A_Tentacled_Entrepreneur |
| Gothic Author | An_Author_of_Gothic_Tales (NOT A_Gothic_Author — that 404s) |
| Zailor | A_Zailor_with_Particular_Interests |
| Rubbery Collector | A_Rubbery_Collector |
| Constable | Sell_to_a_Constable_(Skeleton) |
| Dumbwaiter | The_Dumbwaiter_of_Balmoral |

---

## Complete Formula Table

Bone Market Fluctuations: 1=Antiquity, 2=Amalgamy, 3=Menace

| Buyer | Requirements | AV-based items | Secondary (normal) | Secondary (fluctuation week) | Verification |
|---|---|---|---|---|---|
| Naive Collector | — | floor((AV+M)/250) × Bombazine (2.50ε) | — | — | real sale ✓ |
| Bohemian Sculptress | Antiquity=0 | (4+floor((AV+M)/250)) × Blooms (2.50ε) | — | — | wiki ✓ |
| Grandmother | Menace=0 | (20+floor((AV+M)/50)) × Observation (0.50ε) | — | — | wiki ✓ |
| Theologian | Amalgamy=0 | (4+floor((AV+M)/250)) × Biscuits (2.50ε) | — | — | formula ✓ |
| Palaeontologist | — | (AV+M+5) × Fragment (0.01ε) + 2×Fossil (2.50ε) | — | — | wiki ✓ |
| Ancient Enthusiast | Resp≥3, Antiq≥1 | floor((AV+M)/50) × Ingot (0.50ε) | Antiquity × Artefact (2.50ε) | Antiquity+1 during Antiquity week | wiki ✓ |
| Mrs Plenty | Dread≥3, Menace≥1 | floor((AV+M)/50) × Scrip (0.50ε) | Menace × Pies (2.50ε) | Menace+1 during Menace week | wiki ✓ |
| Tentacled Servant | Biz≥3, Amalgamy≥1 | (5+floor((AV+M)/50)) × Nightsoil (0.50ε) | Amalgamy×5 × Eolith (0.50ε) | (Amalgamy+1)×5 during Amalgamy week | wiki ✓ |
| Ambassador | Resp≥15, Exh<4, Antiq≥1 | ceil(5+(AV+M)/50) × Memory of Light (0.50ε) | floor(0.8×Antiq²) × Tailfeather (2.50ε) | floor(0.8×Antiq^2.1) during Antiquity week | user+wiki ✓ |
| Teller of Terrors | Dread≥15, Exh<4, Menace≥1 | (25+floor((AV+M)/10)) × Morelways (0.10ε) | floor(4×Menace²) × R-B Feather (0.50ε) | floor(4×Menace^2.1) during Menace week | wiki ✓ |
| Tentacled Entrepreneur | Biz≥15, Exh<4, Amalgamy≥1 | (5+floor((AV+M)/50)) × Shores (0.50ε) | floor(4×Amalgamy²) × Breath (0.50ε) | floor(4×Amalgamy^2.1) during Amalgamy week | wiki ✓ |
| Gothic Author | Resp≥7, Dread≥7, Exh<4, Antiq≥1, Menace≥1 | (5+floor((AV+M)/50)) × Scrip (0.50ε) | Antiq×Menace × Ivory (2.50ε) | floor(Antiq×(Menace+0.5)) Antiq week; floor((Antiq+0.5)×Menace) Menace week | real sale ✓ |
| Zailor | Resp≥7, Biz≥7, Exh<4, Antiq≥1, Amalgamy≥1 | (25+floor((AV+M)/10)) × Warm Amber (2.50ε) | Amalgamy×Antiq × Scintillack (2.50ε) | floor((Amalgamy+0.5)×Antiq) Antiq week; floor(Amalgamy×(Antiq+0.5)) Amalgamy week | wiki ✓ |
| Rubbery Collector | Dread≥7, Biz≥7, Exh<4, Menace≥1, Amalgamy≥1 | (5+floor((AV+M)/50)) × Nightsoil (0.50ε) | Amalgamy×Menace × Pies (2.50ε) | floor(Amalgamy×(Menace+0.5)) Amalgamy week; floor((Amalgamy+0.5)×Menace) Menace week | wiki ✓ |
| Constable | Humanoid (SiP 110–119) | (20+floor((AV+M)/50)) × Scrip (0.50ε) | — | — | real sale ✓ |
| Dumbwaiter | Bird (SiP 180–189) | floor((AV+M)/250) × Identity (2.50ε) | — | — | unverified ⚠ |

---

## Fluctuation Pattern Summary

Three distinct patterns across buyers with attribute requirements:

**Linear (+1 attribute):** Ancient Enthusiast, Mrs Plenty, Tentacled Servant
- Normal week: attribute × item
- Bonus week: (attribute + 1) × item

**Quadratic (^2.1 exponent):** Ambassador, Teller of Terrors, Tentacled Entrepreneur
- Normal week: floor(k × attribute^2.0)
- Bonus week: floor(k × attribute^2.1)

**Product-of-two (+0.5 to cross-attribute):** Gothic Author, Zailor, Rubbery Collector
- Normal week: A × B items (integer product, no floor needed)
- Bonus week for attribute X: floor((A ± 0.5) × B) where the +0.5 goes to the OTHER attribute

---

## Verification Notes

- Naive Collector: AV=8500, mania=0 → 34×2.50 = 85ε ✓ (real sale)
- Constable: AV=4450, mania=0 → (20+89)×0.50 = 54.5ε ✓ (real sale)
- Gothic Author: AV=3500, M=355, Antiq=4, Menace=3, Antiquity week → floor(4×3.5)=14 ivory → 76ε ✓ (real sale)
- Ambassador ^2.1: confirmed by user from wiki page ✓
- Dumbwaiter: formula unverified with real bird skeleton sale ⚠
