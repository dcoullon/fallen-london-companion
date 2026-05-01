# A Zailor with Particular Interests — Wiki Cache
Source: https://fallenlondon.wiki/wiki/A_Zailor_with_Particular_Interests
Fetched: 2026-04-28

Location: The Bone Market
"He looks human, mostly, save for the strangely elongated limbs. He seeks something both ancient and Rubbery."

## Option 1: Sell Your Skeleton to a Zailor

Requirements: Skeleton in Progress 100, Skeleton: Antiquity, Skeleton: Amalgamy
Locked by: Bone Market Exhaustion 4
Challenge: Broad, Shadowy 225 (75 × Self-Evident Implausibility; zero guarantees success)

Success Rewards:
- Shadowy increase
- Nodule of Warm Amber: 25 + floor((Approximate Value + Zoological Mania Bonus) / 10)
- Bone Market Exhaustion: floor(Amalgamy × Antiquity / 20)
- Knob of Scintillack:
  - If Bone Market Fluctuations = Antiquity: floor((Amalgamy + 0.5) × Antiquity)
  - If Bone Market Fluctuations = Amalgamy: floor(Amalgamy × (Antiquity + 0.5))
  - Otherwise: Amalgamy × Antiquity

Failure: Shadowy increase, Suspicion +2 CP

## Option 2: Sell Him a Forty-Nine-Voiced Warbler

Requirements: 1 × Forty-Nine-Voiced Warbler
Challenge: Broad, Shadowy 200
Success/Failure both: lose Warbler, gain 1 Knob of Scintillack + 100 Nodule of Warm Amber
Failure adds: Suspicion +1 CP

## Option 3: Sell Him a Pelagic Egg

Requirements: 1 × Pelagic Egg, Untreated
Success: lose Egg, gain 50 Nodule of Warm Amber

## Formula (implemented)

AV-based: (25 + floor((AV+M)/10)) × Nodule of Warm Amber (0.05ε — 1 stuiver)
Secondary: Amalgamy × Antiquity × Knob of Scintillack (2.50ε)
Fluctuation effects:
  - Antiquity week (1): floor((Amalgamy + 0.5) × Antiquity) scintillack
  - Amalgamy week (2): floor(Amalgamy × (Antiquity + 0.5)) scintillack
  - Otherwise: Amalgamy × Antiquity scintillack
Total echo: (25+floor((AV+M)/10))×0.05 + floor(Amalgamy×Antiquity [±0.5])×2.50
Note: Warm Amber is bought at 1 stuiver (0.05ε) in the Bone Market stuiver shop.
The Scintillack secondary dominates payout for high Antiquity×Amalgamy skeletons.
Verification: wiki formula ✓; Warm Amber price confirmed by user 2026-05-01
