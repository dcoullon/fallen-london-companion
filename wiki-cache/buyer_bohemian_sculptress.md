# A Familiar Bohemian Sculptress — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Familiar_Bohemian_Sculptress
Fetched: 2026-04-28

Location: The Bone Market
"She is a student of the surprising and an artist in the unreal. She prefers skeletons devoid of Antiquity."

## Option 1: Sell Your Skeleton to the Sculptress

Requirements: Skeleton in Progress 100
Locked by: Skeleton: Antiquity (any level blocks this option), Bone Market Exhaustion 4
Challenge: Broad, Shadowy 150 (50 × Self-Evident Implausibility; zero guarantees success)

Success Rewards:
- Shadowy increase
- Preserved Surface Blooms: 4 + floor((Approximate Value + Zoological Mania Bonus) / 250)
- Rumour of the Upper River: Skeleton: Support for a Counter-church Theology × (amount)

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell Your Holy Relic to the Sculptress

Requirements: 1 × Holy Relic of the Thigh of Saint Fiacre
Success: lose Relic, gain 6 Preserved Surface Blooms

## Option 3: Inquire About a Forgery

Requirements: 1 × Parabolan Orange-apple
Challenge: Broad, Persuasive 210
Success: lose Orange-apple, gain 1 Ivory Humerus
Failure: Scandal +2 CP

## Option 4: Convince Her to Produce an Elaborate Forgery

Requirements: 3 × Parabolan Orange-apple, 750 × Bone Fragments
Challenge: Broad, Persuasive 220
Success: lose 3 Orange-apples + 750 Fragments, gain 1 Ivory Femur
Failure: Scandal +2 CP

## Option 5: Discover Her Beliefs

Requirements: A Crooked Cross
Challenge: Broad, Persuasive 200
Success: gain 1 Rumour of the Upper River
Failure: Scandal +2 CP

## Formula (implemented)

AV-based: (4 + floor((AV+M)/250)) × Preserved Surface Blooms (2.50ε)
No secondary attribute-based items; no fluctuation effects
Note: Locked if Skeleton: Antiquity > 0 (any antiquity disqualifies)
Note: May yield Rumour of the Upper River if skeleton has Counter-church Theology quality
Total echo: (4 + floor((AV+M)/250)) × 2.50
Verification: wiki ✓
