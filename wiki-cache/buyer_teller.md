# A Teller of Terrors — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Teller_of_Terrors
Fetched: 2026-04-28

ID: 324948
Location: The Bone Market
"Her artform is the portrayal of terrifying things. Her audience dwells in the Neath.
She needs inspiration, if she means to show them anything worse than they have already seen."
Unlocked with: redirect from Sell to a Teller of Terrors

## Option 1: Sell your skeleton to the Teller of Terrors

Requirements: Skeleton in Progress 100, Skeleton: Menace
Locked by: Bone Market Exhaustion 4
Challenge: Broad, Shadowy 225

Success Rewards:
- Shadowy increase
- Bottles of Morelways 1872: 25 + floor((Approximate Value + Zoological Mania Bonus) / 10)
- Bone Market Exhaustion: floor(Menace² / 25)
- Royal-Blue Feathers:
  - If Bone Market Fluctuations = Menace: floor(4 × Menace^2.1)
  - Otherwise: floor(4 × Menace²)

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell her a Possessed Goldfish

Requirements: 1 × Possessed Goldfish
Challenge: Broad, Shadowy 200
Success/Failure both: Preserved Surface Blooms +2, Royal-Blue Feather +1, lose Goldfish
Failure adds: Suspicion +1 CP

## Option 3: Contribute your insight to a future project

Challenge: Narrow, Monstrous Anatomy 5 (50% base)
Success: Preserved Surface Blooms +1
Failure: Suspicion +1 CP

## Formula (implemented)

AV-based: (25 + floor((AV+M)/10)) × Bottle of Morelways 1872 (0.10ε)
Secondary: floor(4 × Menace²) × Royal-Blue Feather (0.50ε)
During Menace week (Bone Market Fluctuations=3): floor(4 × Menace^2.1) feathers
Total echo: (25+floor((AV+M)/10))×0.10 + floor(4×Menace^exp)×0.50
  where exp = 2.1 if Menace week, 2 otherwise
Verification: wiki ✓
