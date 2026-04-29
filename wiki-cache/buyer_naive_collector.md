# A Naive Collector — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Naive_Collector
Fetched: 2026-04-28

ID: 324538
Location: The Bone Market
"He pays in Thirsty Bombazine. His rates are poor, but so is his eyesight: he is more easily fooled than most."
Unlocked with: redirect from Sell to a Naive Collector

## Option 1: Sell your Skeleton to a Naive Collector

Spoiler ID: 238646
Requirements: Skeleton in Progress 100
Challenge: Broad, Shadowy 75
Difficulty: 25 × Skeleton: Self-Evident Implausibility (zero guarantees success)

Success: Thirsty Bombazine Scrap gained = floor((Approximate Value + Zoological Mania Bonus) / 250)
Failure: Suspicion +2 CP

## Option 2: Sell the Femur of a Surface Deer

Requirements: 1 × Femur of a Surface Deer
Challenge: Broad, Persuasive 200
Success: Gain 1 × Thirsty Bombazine Scrap, lose 1 × Femur of a Surface Deer
Failure: Scandal +2 CP

## Formula (implemented)

AV-based: floor((AV + M) / 250) × Thirsty Bombazine Scrap (2.50ε each)
Total echo: floor((AV+M)/250) × 2.50
No fluctuation bonus.
Verified: AV=8500, mania=0 → floor(8500/250)×2.50 = 34×2.50 = 85.00ε ✓ (real sale)
