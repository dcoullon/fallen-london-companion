# An Author of Gothic Tales — Wiki Cache
Source: https://fallenlondon.wiki/wiki/An_Author_of_Gothic_Tales
Fetched: 2026-04-28
Note: Wiki page is "An Author of Gothic Tales", NOT "A Gothic Author" (which 404s).

ID: (not captured)
Location: The Bone Market
"She likes her shadows dark, portraits sinister, servants secretive, and crypts deep in unspeakable ancestry."

## Option 1: Sell to an Author of Gothic Tales (Skeleton)

Requirements: Skeleton in Progress 100, Skeleton: Antiquity, Skeleton: Menace
Locked by: Bone Market Exhaustion 4
Challenge: Broad, Shadowy 225

Success Rewards:
- Shadowy increase
- Hinterland Scrip: 5 + floor((Approximate Value + Zoological Mania Bonus) / 50)
- Bone Market Exhaustion: floor(Antiquity × Menace / 20)
- Carved Ball of Stygian Ivory:
  - If Bone Market Fluctuations = Antiquity: floor(Antiquity × (Menace + 0.5))
  - If Bone Market Fluctuations = Menace: floor((Antiquity + 0.5) × Menace)
  - Otherwise: Antiquity × Menace

Failure: Shadowy increase, Suspicion +2 CP

## Other Options

- Sell her a Viric Frock: 10 First City Coins + 450 Hinterland Scrip (no challenge)
- Contribute some expertise to her next novel: Kataleptic Toxicology challenge (50% base),
  success = 1 First City Coin + 4 Hinterland Scrip; failure = Suspicion +1
- Sell her a Percipient Egg (Untreated): 10 Hinterland Scrip (no challenge)

## Formula (implemented)

AV-based: (5 + floor((AV+M)/50)) × Hinterland Scrip (0.50ε)
Secondary: Antiquity × Menace × Carved Ball of Stygian Ivory (2.50ε)
Fluctuation effects:
  - Antiquity week (1): floor(Antiquity × (Menace + 0.5)) ivory
  - Menace week (3): floor((Antiquity + 0.5) × Menace) ivory
  - Otherwise: Antiquity × Menace ivory
Total echo: (5+floor((AV+M)/50))×0.50 + floor(Antiquity×(Menace+f_m))×2.50
  where f_m = 0.5 if Menace week, 0 otherwise; Antiquity += 0.5 if Antiquity week
Verification: real sale ✓ (AV=3500, M=355, Antiq=4, Menace=3, Antiquity week → 14 ivory, 76ε total)
