# A Tentacled Servant — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Tentacled_Servant
Fetched: 2026-04-28

Location: The Bone Market
"He drifts from one stall to the next, turning over bones in search of the ones that look most inhuman."
Pays in Ambiguous Eoliths and Nightsoil of the Bazaar.

## Option 1: Sell Him Your Amalgamous Skeleton

Requirements: Skeleton in Progress 100, Skeleton: Amalgamy
Challenge: Broad, Shadowy 135 (45 × Self-Evident Implausibility; zero guarantees success)

Success Rewards:
- Shadowy increase
- Nightsoil of the Bazaar: 5 + floor((Approximate Value + Zoological Mania Bonus) / 50)
- Ambiguous Eoliths:
  - If Bone Market Fluctuations = Amalgamy: (Skeleton: Amalgamy + 1) × 5
  - Otherwise: Skeleton: Amalgamy × 5

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell Him a Rubbery Skull

Requirements: 1 × Rubbery Skull
Success: lose Skull, gain 125 Nightsoil of the Bazaar

## Option 3: Sell Him a Nodule of Pulsating Amber

Requirements: 1 × Nodule of Pulsating Amber
Success: gain 130 Nightsoil of the Bazaar, lose Amber

## Option 4: Persuade Him for Free Eoliths

Challenge: Broad, Persuasive 200
Success: gain 2 Ambiguous Eolith
Failure: Scandal +2 CP

## Option 5: Sell Him Some Bazaarine Verse

Requirements: 1 × Slim Volume of Bazaarine Poetry
Success: gain 7 Nightsoil of the Bazaar, lose volume

## Formula (implemented)

AV-based: (5 + floor((AV+M)/50)) × Nightsoil of the Bazaar (0.50ε)
Secondary: Amalgamy × 5 × Ambiguous Eolith (0.50ε each)
Fluctuation effect:
  - Amalgamy week (2): (Amalgamy + 1) × 5 eoliths = +5 eoliths = +2.50ε bonus
  - Otherwise: Amalgamy × 5 eoliths
Total echo: (5+floor((AV+M)/50))×0.50 + Amalgamy×5×0.50 [+ 2.50 during Amalgamy week]
Verification: wiki ✓ (pattern confirmed; previously marked ⚠)
