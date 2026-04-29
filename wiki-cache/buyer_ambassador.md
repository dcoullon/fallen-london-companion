# An Investment-Minded Ambassador — Wiki Cache
Source: https://fallenlondon.wiki/wiki/An_Investment-Minded_Ambassador
Fetched: 2026-04-28

ID: 324963
Location: The Bone Market
"She buys antiquities. She has many professional contacts who desire them."
Unlocked with: redirect from Sell to an Investment-Minded Ambassador

## Option 1: Sell your skeleton to the Ambassador

Requirements: Skeleton in Progress 100, Skeleton: Antiquity
Locked by: Bone Market Exhaustion 4
Challenge: Broad, Shadowy 225

Success Rewards:
- Shadowy increase
- Memory of Light: ceil(5 + (Approximate Value + Zoological Mania Bonus) / 50)
- Bone Market Exhaustion: floor(Antiquity² / 25)
- Tailfeather Brilliant as Flame:
  - If Bone Market Fluctuations = Antiquity: floor(0.8 × Antiquity^2.1)
  - Otherwise: floor(0.8 × Antiquity²)

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell her a Weasel of Social Discomfiture

Requirements: 1 × Weasel of Social Discomfiture
Challenge: Broad, Shadowy 200
Both success and failure: Shadowy increase, lose Weasel, gain 2 Moves in the Great Game
Failure adds: Suspicion +1 CP

## Option 3: Sell her an Epaulette Mate

Requirements: 1 × Epaulette Mate
Challenge: Broad, Shadowy 230
Success: 500 Fistful of Surface Currency + 1 Vital Intelligence + 1 Tailfeather Brilliant as Flame
Rare success: 1500 Surface Currency
Failure: 750 Surface Currency + Suspicion +2 CP

## Formula (implemented)

AV-based: ceil(5 + (AV+M)/50) × Memory of Light (0.50ε)
Secondary: floor(0.8 × Antiquity²) × Tailfeather Brilliant as Flame (2.50ε)
During Antiquity week (Bone Market Fluctuations=1): floor(0.8 × Antiquity^2.1) tailfeathers
Total echo: ceil(5+(AV+M)/50)×0.50 + floor(0.8×Antiquity^exp)×2.50
  where exp = 2.1 if Antiquity week, 2 otherwise
Verification: user confirmed formula (^2.1 during Antiquity week) ✓
