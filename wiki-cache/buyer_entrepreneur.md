# A Tentacled Entrepreneur — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Tentacled_Entrepreneur
Fetched: 2026-04-28

ID: 324978
Location: The Bone Market
"He pays exceptionally well for anything that sheds light on Rubbery affairs."
Unlocked with: redirect from Sell to the Tentacled Entrepreneur

## Option 1: Sell to the Tentacled Entrepreneur (Skeleton)

Requirements: Skeleton in Progress 100, Skeleton: Amalgamy
Locked by: Bone Market Exhaustion 4
Challenge: Broad, Shadowy 225

Success Rewards:
- Shadowy increase
- Memory of Distant Shores: 5 + floor((Approximate Value + Zoological Mania Bonus) / 50)
- Bone Market Exhaustion: floor(Amalgamy² / 25)
- Final Breath:
  - If Bone Market Fluctuations = Amalgamy: floor(4 × Amalgamy^2.1)
  - Otherwise: floor(4 × Amalgamy²)

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell him a Viric Lizard

Requirements: 1 × Viric Lizard
Challenge: Broad, Shadowy 200
Both success and failure: Shadowy increase, lose Lizard, gain 1 Rumour of the Upper River
Failure adds: Suspicion +2 CP

## Formula (implemented)

AV-based: (5 + floor((AV+M)/50)) × Memory of Distant Shores (0.50ε)
Secondary: floor(4 × Amalgamy²) × Final Breath (0.50ε)
During Amalgamy week (Bone Market Fluctuations=2): floor(4 × Amalgamy^2.1) breaths
Total echo: (5+floor((AV+M)/50))×0.50 + floor(4×Amalgamy^exp)×0.50
  where exp = 2.1 if Amalgamy week, 2 otherwise
Verification: wiki ✓
