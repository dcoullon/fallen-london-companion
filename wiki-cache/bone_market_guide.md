# Bone Market Guide — Key Facts

Source: https://fallenlondon.wiki/wiki/Assembling_a_Skeleton_(Guide) + /Buyers subpage

## Known Skeleton Quality IDs

| Quality | ID |
|---|---|
| Approximate Value of Your Skeleton in Pennies | 140812 |
| Skeleton: Amalgamy | 140825 |
| Skeleton: Menace | 140834 |
| Skeleton: Antiquity | 140835 |
| Bone Market Exhaustion (player quality) | 141648 |

**Unknown (to discover via API capture):** limb-count IDs (skulls, arms, legs, wings, fins, tails), Self-Evident Implausibility, skeleton type/in-progress quality

## Skeleton Attributes

- **Amalgamy** (ID 140825): rubbery/weird. Associated with Bizarre. Levels 0–15+.
- **Antiquity** (ID 140835): ancient. Associated with Respectable. Levels 0–4+.
- **Menace** (ID 140834): scary. Associated with Dreaded. Levels 0–9+.
- **Approximate Value in Pennies** (ID 140812): base skeleton value; divide by 100 for echoes.
- **Bone Market Exhaustion** (ID 141648): single player quality; ≥4 gates premium buyers.

## Always-Available Buyers

| Buyer | Requirements | Secondary Formula |
|---|---|---|
| Naive Collector | Suspicion < 4 | Face value only |
| Bohemian Sculptress | Respectable=0, Antiquity=0 | Face value only |
| Grandmother | Dreaded=0, Menace=0 | Face value only |
| Theologian | Bizarre=0, Amalgamy=0 | Face value only |
| Ancient Enthusiast | Respectable≥3, Antiquity≥1 | +Antiquity linear |
| Mrs Plenty | Dreaded≥3, Menace≥1 | +Menace linear |
| Tentacled Servant | Bizarre≥3, Amalgamy≥1 | +5×Amalgamy Ambiguous Eoliths (0.50ε each) |
| Ambassador | Respectable≥15, Exhaust<4, Antiquity≥1 | +floor(0.8×Antiquity²) Tailfeathers (2.50ε each) |
| Teller of Terrors | Dreaded≥15, Exhaust<4, Menace≥1 | +floor(4×Menace²) Royal-Blue Feathers (0.50ε each) |
| Entrepreneur | Bizarre≥15, Exhaust<4, Amalgamy≥1 | +floor(4×Amalgamy²) Final Breaths (0.50ε each) |
| Gothic Author | Resp≥7, Dread≥7, Exhaust<4, Antiquity≥1, Menace≥1 | +(Antiquity×Menace) Stygian Ivory (2.50ε each) |
| Zailor | Resp≥7, Biz≥7, Exhaust<4, Antiquity≥1, Amalgamy≥1 | +(Antiquity×Amalgamy) Scintillack (2.50ε each) |
| Rubbery Collector | Dread≥7, Biz≥7, Exhaust<4, Menace≥1, Amalgamy≥1 | +(Menace×Amalgamy) Rubbery Pies (2.50ε each) |

Type-specific buyers (Constable: humanoid 110-119, Dumbwaiter: bird 180-189) excluded from v1.

## Secondary Item Prices (from prices.js)

| Item | Echo Value |
|---|---|
| Tailfeather Brilliant as Flame (141160) | 2.50ε |
| Royal-Blue Feather (122494) | 0.50ε |
| Final Breath (141161) | 0.50ε |
| Carved Ball of Stygian Ivory (122483) | 2.50ε |
| Knob of Scintillack (122495) | 2.50ε |
| Basket of Rubbery Pies (140894) | 2.50ε |
| Ambiguous Eolith (122485) | 0.50ε |

## Weekly Mania

World Qualities change every Tuesday at 11AM UTC. One skeleton type gets a 10-15% value bonus (15% for fish, insect, spider). The active weekly bonus is in the bone market storylet API.

## Bone Market Flow

1. Navigate → `/api/map` + `/api/storylet` (first-level options)
2. "Assemble a skeleton" → `/api/storylet/begin` → bone choices
3. Choose frame (sets limb slots) → choose skulls → other bones available
4. "Add four more joints" → adds Limbs Needed slots for increasing cost
5. "Declare your [creature] as completed [type]" → skeleton sold to buyer
6. "Break down for parts" → reclaims frame only, resets build
