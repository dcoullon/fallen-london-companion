# Sell a complete skeleton to Mrs Plenty — Wiki Cache
Source: https://fallenlondon.wiki/wiki/Sell_a_complete_skeleton_to_Mrs_Plenty
Fetched: 2026-04-28

Location: Mrs Plenty's Most Distracting Carnival
Requirements:
- Skeleton in Progress 100
- Skeleton: Menace (required)

Challenge: Broad, Shadowy 135
Difficulty formula: 45 × Skeleton: Self-Evident Implausibility (zero guarantees success)

## Success Outcome

Rewards:
- Shadowy increase
- Hinterland Scrip: floor((Approximate Value + Zoological Mania Bonus) / 50)
- Baskets of Rubbery Pies:
  - If Bone Market Fluctuations = Menace: (Skeleton: Menace + 1)
  - Otherwise: Skeleton: Menace

Failure: Shadowy increase, Suspicion +2 CP

## Formula (implemented)

AV-based: floor((AV+M)/50) × Hinterland Scrip (0.50ε)
Secondary: Menace × Basket of Rubbery Pies (2.50ε), +1 if Bone Market Fluctuations = Menace (3)
Total echo: floor((AV+M)/50)×0.50 + Menace×2.50 [+ 2.50 during Menace week]
Verification: wiki ✓
