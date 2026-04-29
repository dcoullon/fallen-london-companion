# A Rubbery Collector — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Rubbery_Collector
Fetched: 2026-04-28

ID: 324689
Location: The Bone Market
"This Rubbery Enthusiast admires evidence of a sinister rubbery past."

## Option 1: Sell to an Enthusiast of a Rubbery Menace (Skeleton)

Requirements: Skeleton in Progress 100, Skeleton: Amalgamy, Skeleton: Menace
Locked by: Bone Market Exhaustion 4
Challenge: Broad, Shadowy 225 (75 × Self-Evident Implausibility; zero guarantees success)

Success Rewards:
- Shadowy increase
- Nightsoil of the Bazaar: 5 + floor((Approximate Value + Zoological Mania Bonus) / 50)
- Bone Market Exhaustion: floor(Amalgamy × Menace / 20)
- Basket of Rubbery Pies:
  - If Bone Market Fluctuations = Amalgamy: floor(Amalgamy × (Menace + 0.5))
  - If Bone Market Fluctuations = Menace: floor((Amalgamy + 0.5) × Menace)
  - Otherwise: Amalgamy × Menace

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell Him a Viric Suit

Requirements: 1 × Viric Suit
Success: lose Viric Suit, gain 460 Nightsoil of the Bazaar

## Option 3: Sell Him a Scarlet Egg

Requirements: 1 × Scarlet Egg, Untreated
Success: lose Egg, gain 10 Nightsoil of the Bazaar

## Formula (implemented)

AV-based: (5 + floor((AV+M)/50)) × Nightsoil of the Bazaar (0.50ε)
Secondary: Amalgamy × Menace × Basket of Rubbery Pies (2.50ε)
Fluctuation effects:
  - Amalgamy week (2): floor(Amalgamy × (Menace + 0.5)) pies
  - Menace week (3): floor((Amalgamy + 0.5) × Menace) pies
  - Otherwise: Amalgamy × Menace pies
Total echo: (5+floor((AV+M)/50))×0.50 + floor(Amalgamy[±0.5]×Menace[±0.5])×2.50
Verification: wiki ✓
