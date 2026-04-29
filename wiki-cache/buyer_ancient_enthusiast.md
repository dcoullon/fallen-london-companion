# Sell your skeleton to an Enthusiast of the Ancient World — Wiki Cache
Source: https://fallenlondon.wiki/wiki/Sell_your_skeleton_to_an_Enthusiast_of_the_Ancient_World
Fetched: 2026-04-28

ID: 238780
"Genuine antique skeletons only, please."
"The more Ancient parts your skeleton can offer, the better the Enthusiast will pay."

Unlock Requirements:
- Skeleton in Progress 100
- Skeleton: Antiquity (required)

Challenge: Broad difficulty, Shadowy 135
Difficulty formula: 45 × Skeleton: Self-Evident Implausibility (zero guarantees success)

## Success Outcome: "Greatly pleased"

"He rewards you for the antiquity of the object with a few items from his own collection,
and some materials from his furnace."

Rewards:
- Bessemer Steel Ingot: floor((Approximate Value + Zoological Mania Bonus) / 50)

Conditional (if Bone Market Fluctuations = Antiquity):
- Unprovenanced Artefact: (Skeleton: Antiquity + 1) × Unprovenanced Artefact

Otherwise:
- Unprovenanced Artefact: Skeleton: Antiquity × Unprovenanced Artefact

Failure: Suspicion +3 CP

## Formula (implemented)

AV-based: floor((AV+M)/50) × Bessemer Steel Ingot (0.50ε)
Secondary: Antiquity × Unprovenanced Artefact (2.50ε), +1 if Bone Market Fluctuations = Antiquity (1)
Total echo: floor((AV+M)/50)×0.50 + Antiquity×2.50 [+ 2.50 during Antiquity week]
Verification: wiki ✓
