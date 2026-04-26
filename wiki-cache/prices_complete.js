// Complete Fallen London item price table
// Generated 2026-04-09 from wiki data at https://fallenlondon.wiki
// Keyed by possession.id from the API response.
// All values are echoes per unit (Bazaar sell price unless noted).
//
// DISCREPANCIES vs content.js are marked with [DISCREPANCY]
// NEW items not in content.js are marked with [NEW]
// UNCERTAIN items are marked with [UNCERTAIN]

const PRICES = {

  // ── WINES ─────────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Bottle_of_Greyfields_1879
  557:    0.01,  // Bottled Oblivion
  382:    0.01,  // Bottle of Greyfields 1879
  383:    0.02,  // Bottle of Greyfields 1882
  815:    0.10,  // Bottle of Morelways 1872
  473:    0.20,  // Bottle of Greyfields 1868 First Sporing
  822:    0.50,  // Bottle of Strangling Willow Absinthe
  823:    2.50,  // Bottle of Broken Giant 1844
  736:   12.50,  // Cellar of Wine
  824:   62.50,  // Bottle of Fourth City Airag: Year of the Tortoise
  12350: 312.50, // Vial of Tears of the Bazaar
  24121: 1562.60,// Vial of Masters' Blood
  // Excluded: 529 (Bottle of Black Wings Absinthe) - no sell price

  // ── MYSTERIES ─────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Whispered_Hint
  380:    0.01,  // Whispered Hint
  389:    0.02,  // Cryptic Clue
  145109: 0.10,  // Tantalising Possibility
  390:    0.15,  // Appalling Secret
  525:    0.50,  // Journal of Infamy
  828:    0.50,  // Tale of Terror!!
  809:    2.50,  // Extraordinary Implication
  105858: 12.50, // Direful Reflection
  812:   12.50,  // Uncanny Incunabulum
  144751: 12.50, // Caustic Apocryphon
  821:   62.50,  // Searing Enigma
  814:  312.50,  // Dreadful Surmise
  106142: 1562.60,// Impossible Theorem [DISCREPANCY: content.js has 1562.50, wiki says 1562.60]

  // ── GOODS ─────────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Certifiable_Scrap
  375:    0.01,  // Piece of Rostygold
  918:    0.50,  // Certifiable Scrap
  122495: 2.50,  // Knob of Scintillack
  141157: 2.50,  // Preserved Surface Blooms
  139723: 4.17,  // Attar [DISCREPANCY: content.js has 4.17, wiki says ~4.1667]

  // ── RAG TRADE ─────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Silk_Scrap
  381:    0.01,  // Silk Scrap
  907:    0.10,  // Surface-Silk Scrap
  915:    0.50,  // Whisper-Satin Scrap
  922:    2.50,  // Thirsty Bombazine Scrap
  923:   12.50,  // Puzzle-Damask Scrap
  924:   62.50,  // Parabola-Linen Scrap
  925:  312.50,  // Scrap of Ivory Organza
  926:  1560.00, // Veils-Velvet Scrap

  // ── RUBBERY ───────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Nodule_of_Deep_Amber
  385:    0.01,  // Nodule of Deep Amber
  328:    2.50,  // Nodule of Warm Amber
  810:    2.50,  // Unearthly Fossil
  949:   12.50,  // Nodule of Trembling Amber
  754:   62.50,  // Nodule of Pulsating Amber
  16308: 312.50, // Nodule of Fecund Amber
  106683: 1560.00,// Fluke-Core
  811:   62.50,  // Rubbery Skull [NEW] - 125 Hinterland Scrip = 62.50 echoes

  // ── CONTRABAND ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Flawed_Diamond
  144025: 0.01,  // Stashed Treasure
  449:    0.12,  // Flawed Diamond
  12186:  0.50,  // Ostentatious Diamond
  392:    2.50,  // London Street Sign
  737:    6.00,  // Use of Villains
  12188: 12.50,  // Magnificent Diamond
  742:   12.50,  // Comprehensive Bribe [NEW]
  140900: 12.50, // Hillmover
  142094: 16.50, // Shard of Glim the Size of a Small Child
  142710: 20.00, // Unassuming Crate
  751:   60.00,  // Rookery Password
  12187: 312.50, // Fabulous Diamond
  // Excluded: 145002 (Ascended Ambergris) - sells for Stuivers only

  // ── RUMOUR ────────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Proscribed_Material
  420:    0.04,  // Proscribed Material
  656:    0.10,  // Inkling of Identity
  659:    0.50,  // Scrap of Incendiary Gossip
  657:    2.50,  // An Identity Uncovered!
  735:    2.50,  // Night on the Town
  141194: 2.50,  // Rumour of the Upper River
  858:   12.50,  // Blackmail Material
  762:   60.00,  // Diary of the Dead
  141882: 62.50, // Mortification of a Great Power [UNCERTAIN: wiki shows (62.50) = implicit value]
  931:  312.50,  // Intriguer's Compendium
  930:  1560.00, // Rumourmonger's Network

  // ── INFERNAL ──────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Soul
  386:    0.02,  // Soul
  928:    0.10,  // Amanita Sherry
  668:    0.50,  // Brilliant Soul
  653:    0.90,  // Devilbone Die
  122798: 2.50,  // Queer Soul
  927:    2.50,  // Muscaria Brandy
  747:   12.50,  // Portfolio of Souls
  23695: 12.50,  // Silent Soul
  482:   12.50,  // Brass Ring [NEW]
  749:   60.00,  // Bright Brass Skull
  141281: 62.50, // Devilish Probability Distributor
  141772: 62.50, // Discordant Soul
  141229: 66.00, // Infernal Machine
  669:  312.50,  // Coruscating Soul
  929:  1560.00, // Reported Location of a One-Time Prince of Hell

  // ── LUMINOSITY ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Lump_of_Lamplighter_Beeswax
  384:    0.01,  // Lump of Lamplighter Beeswax
  652:    0.10,  // Phosphorescent Scarab
  // 144977 (Memory of Moonlight): [DISCREPANCY] content.js has 0.10 but wiki confirms NO Bazaar sell price
  //   It sells at Roof markets only (250 Stuivers = 12.50 echoes). Suggest removing from PRICES.
  141160: 2.50,  // Tailfeather Brilliant as Flame [NEW]
  951:    2.50,  // Mourning Candle
  763:   12.50,  // Bejewelled Lens
  // 121792 (Snuffer's Gratitude): [DISCREPANCY] content.js has 12.50 but wiki shows no direct echo sell price
  23504: 62.50,  // Eyeless Skull
  122492: 62.50, // Mountain-sherd
  122493: 62.50, // Element of Dawn
  1053:  312.50, // Ray-Drenched Cinder

  // ── ACADEMIC ──────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Memory_of_Discordance
  374:    0.01,  // Foxfire Candle Stub
  476:    0.10,  // Flask of Abominable Salts
  144821: 0.10,  // Sample of Roof-Drip (2 Stuivers = 0.10 echoes)
  825:    0.50,  // Memory of Distant Shores
  144822: 0.50,  // Starved Expression (10 Stuivers = 0.50 echoes)
  140898: 0.50,  // Incisive Observation (10 Stuivers = 0.50 echoes)
  122487: 2.50,  // Unprovenanced Artefact
  745:    2.50,  // Volume of Collated Research
  141283: 12.50, // Mirthless Compendium of Statistical Observations
  142754: 12.50, // Conceptual Breakthrough in Currency Design
  759:   50.00,  // Endowment of a University Fellowship
  122486: 62.50, // Judgements' Egg
  118813: 1562.50,// Secret College [NEW] - 25 Searing Enigmas x 62.50 = 1562.50

  // ── GREAT GAME ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Well-Placed_Pawn
  141161: 0.50,  // Final Breath
  122490: 0.50,  // Moves in the Great Game
  122489: 12.50, // Vital Intelligence
  758:   37.50,  // Copper Cipher Ring
  142793: 312.50, // Corresponding Sounder
  142855: 62.50,  // Much-Needed Gap (125 Assortment of Khaganian Coinage = 62.50)
  144796: 1562.50,// A Seat at the Board [NEW]
  141394: 0.10,  // Well-Placed Pawn (wiki purchase price; no explicit Bazaar sell price)

  // ── THEOLOGICAL ───────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Verse_of_Counter-Creed
  142251: 0.50,  // Palimpsest Scrap
  142250: 2.50,  // Apostate's Psalm
  141675: 12.50, // Verse of Counter-Creed
  142249: 62.50, // False Hagiotoponym
  142295: 312.50,// Legenda Cosmogone

  // ── WILD WORDS ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Primordial_Shriek
  388:    0.02,  // Primordial Shriek
  935:    0.10,  // Maniac's Prayer
  932:    0.50,  // Correspondence Plaque
  144955: 0.50,  // Tempestuous Tale [DISCREPANCY: content.js has 2.50; wiki confirms ONLY 10 Stuivers at Roof markets (no Bazaar sell) = 10 x 0.05 = 0.50 echoes]
  773:    2.50,  // Aeolian Scream
  849:   12.50,  // Storm-Threnody
  933:   62.50,  // Night-Whisper
  936:  312.50,  // Starstone Demark
  934:  1560.00, // Breath of the Void

  // ── ELDER ─────────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Jade_Fragment
  377:    0.01,  // Jade Fragment
  424:    0.10,  // Relic of the Third City
  587:    0.50,  // Mystery of the Elder Continent
  852:    2.50,  // Presbyterate Passphrase
  946:   12.50,  // Antique Mystery
  832:   62.50,  // Primaeval Hint
  14975: 312.50, // Elemental Secret

  // ── HISTORICAL ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Trace_of_the_First_City
  423:    0.05,  // Relic of the Fourth City
  141913: 0.10,  // Rusted Stirrup
  141917: 0.10,  // Silvered Cat's Claw
  425:    0.15,  // Relic of the Second City
  141914: 0.50,  // Trace of Viric
  141570: 2.50,  // Trace of the First City
  141916: 2.50,  // Nicatorean Relic
  145558: 2.50,  // Relic of the Fifth City
  141946: 12.50, // Unlawful Device
  142074: 62.50, // Flask of Waswood Wellspring Water
  142448: 62.50, // Chimerical Archive [NEW]

  // ── LEGAL ─────────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Infernal_Contract
  426:    0.20,  // Infernal Contract
  13929:  0.50,  // Dubious Testimony
  13928:  2.50,  // Sworn Statement
  739:   12.50,  // Legal Document
  123213: 62.50, // Fragment of the Tragedy Procedures
  143050: 62.50, // Sap of the Cedar at the Crossroads (125 Hinterland Scrip = 62.50)
  142087: 312.50,// Edicts of the First City
  141883: 12.50, // Cave-Aged Code of Honour (sells for 1 Legal Document = 12.50 echoes)

  // ── CARTOGRAPHY ───────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Shard_of_Glim
  378:    0.01,  // Shard of Glim
  141285: 0.01,  // Glass Gazette
  920:    0.10,  // Map Scrap
  142660: 0.10,  // Sighting of a Parabolan Landmark
  831:    0.50,  // Zee-Ztory
  956:    2.50,  // Partial Map
  743:    6.00,  // Collection of Curiosities
  959:   12.50,  // Puzzling Map
  142661: 12.50, // Vitreous Almanac
  955:   15.00,  // Screaming Map: Left-Hand Half
  981:   25.00,  // Screaming Map: Right-Hand Half
  129586: 141.85,// Sky-Story
  142202: 62.50, // Salt Steppe Atlas
  143646: 62.50, // Relatively Safe Zee Lane
  142662: 62.50, // Oneiromantic Revelation
  142463: 312.50,// Parabolan Parable
  142669: 312.50,// Waswood Almanac
  141189: 312.50,// Cartographer's Hoard [NEW]

  // ── NOSTALGIA ─────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Drop_of_Prisoner's_Honey
  391:    0.02,  // Drop of Prisoner's Honey
  142709: 12.50, // Emetic Revelation [DISCREPANCY: content.js has 0.02; wiki: 625 Cryptic Clues at Bazaar = 12.50 echoes]
  142436: 0.02,  // Poetic First Draft [UNCERTAIN: converts to Favourable Circumstance at Bazaar; 0.02 from content.js]
  142434: 0.02,  // Sheaf of Poetic First Drafts [UNCERTAIN: no standard echo sell price; 0.02 from content.js]
  531:    0.10,  // Romantic Notion
  827:    0.50,  // Vision of the Surface
  945:    2.50,  // Touching Love Story
  741:   12.50,  // Bazaar Permit
  114982: 62.50, // Soothe & Cooper Long-Box (25 x An Identity Uncovered! x 2.50 = 62.50)
  142386: 62.50, // Captivating Ballad
  143044: 312.50,// Sample of Lacreous Affection
  143045: 312.50,// Vestige of a Starlit Reverie
  142504: 1562.50,// A Tasting Flight of Targeted Toxins

  // ── ZEE TREASURES ─────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Moon-Pearl
  379:    0.01,  // Moon-Pearl
  122484: 0.50,  // Deep-zee Catch
  122494: 0.50,  // Royal-Blue Feather
  122485: 0.50,  // Ambiguous Eolith
  122483: 2.50,  // Carved Ball of Stygian Ivory
  122488: 2.50,  // Live Specimen
  142666: 62.50, // Oneiric Pearl (125 Assortment of Khaganian Coinage = 62.50)

  // ── CURIOSITY ─────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/F.F._Gebrandt's_Superior_Laudanum
  471:    0.03,  // F.F. Gebrandt's Tincture of Vigour: Half-Full
  470:    0.10,  // F.F. Gebrandt's Tincture of Vigour
  477:    0.10,  // F.F. Gebrandt's Superior Laudanum
  642:    0.10,  // Venom-Ruby
  643:    0.12,  // Sapphire
  560:    0.20,  // Gift of Scorn
  523:    0.25,  // Nikolas & Sons Instant Ablution Absolution
  635:    0.50,  // A Partially Unwrapped Cat?
  862:    0.50,  // Cryptobotanical Rosette
  468:    2.00,  // Horsehead Amulet
  22523: 12.50,  // A Blue and Shining Stone
  748:   25.00,  // Antique Constable's Badge
  755:   30.00,  // Ornate Typewriter
  761:   35.00,  // Red-Feathered Pin
  750:   35.00,  // Tiny Jewelled Reliquary
  757:   47.50,  // Engraved Pewter Tankard
  753:   57.50,  // Old Bone Skeleton Key
  13640: 60.00,  // Trade Secret
  // Excluded: 141762 (Powder of Renewal) - cannot be sold at Bazaar

  // ── INDUSTRIAL ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Nevercold_Brass_Sliver
  387:    0.01,  // Nevercold Brass Sliver
  141158: 0.50,  // Nightsoil of the Bazaar
  764:    2.50,  // Strong-Backed Labour
  140779: 2.50,  // Perfumed Gunpowder
  738:    6.00,  // Whirring Contraption
  141159: 0.50,  // Bessemer Steel Ingot [NEW] - converts to 1 Tempestuous Tale (10 Stuivers = 0.50 echoes)
  142840: 62.50, // Crackling Device

  // ── RATNESS ───────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Rat_on_a_String
  376:    0.01,  // Rat on a String
  14621:  0.50,  // Venge-Rat Corpse
  14620:  2.50,  // Baptised Rattus Faber Corpse
  123214: 12.50, // Ratty Reliquary

  // ── SUSTENANCE ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Parabolan_Orange-apple
  141374: 0.10,  // Jasmine Leaves
  141324: 0.10,  // Remains of a Pinewood Shark
  141486: 0.50,  // Pot of Venison Marrow
  122491: 0.50,  // Solacefruit
  618:    0.70,  // Dark-Dewed Cherry
  121611: 2.50,  // Tin of Zzoup
  140892: 2.50,  // Crate of Incorruptible Biscuits
  140894: 2.50,  // Basket of Rubbery Pies
  142237: 5.00,  // Beatrice's Taper-nut
  140962: 12.50, // Parabolan Orange-apple [NEW]
  140891: 12.50, // Sausage About Which No One Complains
  143051: 62.50, // Hellworm Milk
  143588: 62.50, // Ripened Wheel of Hellworm Cheese
  141542: 63.50, // Tinned Ham
  410:  80000.00,// Firkin of Hesperidean Cider

  // ── CURRENCY ──────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Fistful_of_Surface_Currency
  22390:  0.01,  // Penny
  421:    0.03,  // Fistful of Surface Currency
  582:    0.25,  // First City Coin
  143057: 0.10,  // Rat-Shilling (conversion: 125 Rat-Shillings = 1 Fourth-City Echo)
  144995: 0.05,  // Stuiver [NEW]
  125025: 0.50,  // Hinterland Scrip
  140732: 0.50,  // Forged Justificande Coin
  142708: 0.50,  // Assortment of Khaganian Coinage
  140706: 2.50,  // Justificande Coin

  // ── OSTEOLOGY ─────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Bone_Fragments
  // Note: Most osteology items don't sell at the Bazaar directly.
  // Values below are Bazaar sell prices where confirmed, or bone market values otherwise.
  140812: 0.01,  // Approximate Value of Your Skeleton in Pennies (Progress quality; 1 penny = 0.01 echoes)
  140889: 0.01,  // Bone Fragments
  140879: 0.01,  // Bat Wing
  140771: 0.10,  // Femur of a Surface Deer
  140852: 0.50,  // Fin Bones, Collected [UNCERTAIN: no direct Bazaar sell found]
  140881: 0.50,  // Tomb-Lion's Tail [UNCERTAIN]
  140756: 0.50,  // Unidentified Thigh Bone (1 Hinterland Scrip = 0.50 echoes)
  140813: 2.50,  // Human Arm
  140851: 2.50,  // Plaster Tail Bones [UNCERTAIN]
  143548: 2.50,  // Segmented Ribcage
  140853: 2.50,  // Withered Tentacle [UNCERTAIN]
  141372: 2.50,  // Wing of a Young Terror Bird [UNCERTAIN]
  142727: 5.00,  // Obsidian Chitin Tail (500 Pennies bone value; content.js says 5.00)
  140839: 12.50, // Human Ribcage
  140840: 12.50, // Flourishing Ribcage
  140833: 12.50, // Thorned Ribcage
  140850: 12.50, // Albatross Wing
  141371: 12.50, // Horned Skull
  142351: 12.50, // Ivory Femur (25 Hinterland Scrip = 12.50 echoes)
  141380: 15.00, // Amber-Crusted Fin [UNCERTAIN: content.js 15.00; bone value 1500]
  140849: 12.50, // Ivory Humerus [DISCREPANCY: content.js has 15.00; wiki shows 25 Hinterland Scrip = 12.50 echoes]
  140882: 25.00, // Plated Skull
  140843: 62.50, // Mammoth Ribcage
  141479: 62.50, // Doubled Skull
  140847: 62.50, // Sabre-toothed Skull

  // ── BOOKS ─────────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Revisionist_Historical_Narrative
  18379:   1.00, // Unloved Short Story
  18101:   2.00, // Short Story
  18100:  10.00, // Competent Short Story [NEW]
  18308:  30.00, // Compelling Short Story [NEW]
  18309:  50.00, // Thrilling Short Story [NEW]
  18310:  60.00, // Exceptional Short Story [NEW]
  18311:  70.00, // Extraordinary Short Story [NEW]
  18312:  80.00, // Masterful Short Story [NEW]
  18396: 130.00, // Celebrated Short Story [NEW]
  18381: 180.00, // Classic Short Story [NEW]
  829:     0.50, // Unusual Love Story [NEW]
  746:     6.00, // Book of Hidden Bodies [NEW]
  752:    27.50, // Entry in Slowcake's Exceptionals
  141016: 12.50, // Corrective Historical Narrative [NEW]
  619:     0.50, // Page from the Liber Visionis [NEW]

  // ── INFLUENCE ─────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/Stolen_Correspondence
  // Note: Entire category MISSING from content.js
  422:    0.05,  // Stolen Correspondence [NEW]
  588:    0.20,  // Intriguing Snippet [NEW]
  830:    0.50,  // Compromising Document [NEW]
  658:    0.50,  // Secluded Address [NEW]
  944:    2.50,  // Stolen Kiss [NEW]
  740:    6.00,  // Personal Recommendation [NEW]
  744:   12.50,  // Favour in High Places [NEW]
  // Excluded: 383020 (A Latent Network) - ID suspicious, very high number; value 0.05 Echoes (unverified)

  // ── EPISTOLARY ────────────────────────────────────────────────────────────
  // Source: https://fallenlondon.wiki/wiki/F.F._Gebrandt's_Flame-Resilient_Paper
  142190: 0.50,  // F.F. Gebrandt's Flame-Resilient Paper

  // ── COMPANIONS ────────────────────────────────────────────────────────────
  // Source: Nassos Zoologicals shop prices (sell-back value = buy price ÷ 2)
  464:      0.04, // Cheerful Goldfish
  441:      0.20, // Lucky Weasel
  442:      0.20, // Reprehensible Lizard
  443:      0.20, // Sulky Bat
  558:      0.50, // Talkative Rattus Faber
  498:      0.50, // Araby Fighting-Weasel
  342:      6.40, // Dazed Raven Advisor
  343:      6.40, // Deshrieked Mandrake
  344:      6.40, // Fairly Tame Sorrow-Spider
  345:     32.40, // Working Rat
  351:     45.00, // Malevolent Monkey
  144549: 100.00, // Weasel of Woe
  353:    160.00, // Rattus Faber Bandit-Chief
  21898:  200.00, // Midnight Matriarch
  728:    312.50, // Bengal Tigress
  355:   5856.40, // Overgoat

  // ── FAVOURS ───────────────────────────────────────────────────────────────
  // Progress qualities; value = Jericho Locks option total / 5 (4 favours + 1 action)
  // Source: https://fallenlondon.wiki/wiki/Calling_in_Favours_(Guide)
  // All options yield 30 echoes → 6.00 per favour (Great Game standardised to match)
  133829: 6.00,  // Favours: Bohemians      (2×Ivory Humerus + 2×Wing of a Young Terror Bird)
  133827: 6.00,  // Favours: The Church      (2×Ratty Reliquary + 2×Apostate's Psalm)
  132800: 6.00,  // Favours: Constables      (2×Cave-Aged Code of Honour + 2×Sworn Statement)
  121351: 6.00,  // Favours: Criminals       (2×Human Ribcage + 500×Bone Fragments)
  125527: 6.00,  // Favours: The Docks       (2×Uncanny Incunabulum + 2×Knob of Scintillack)
  133044: 6.00,  // Favours: The Great Game  (2×Vienna Opening + 1×Queen Mate = 60 scrip = 30 echoes)
  132799: 6.00,  // Favours: Hell            (2×Thorned Ribcage + 2×Queer Soul)
  133831: 6.00,  // Favours: Revolutionaries (2×Unlawful Device + 2×Thirsty Bombazine Scrap)
  126000: 6.00,  // Favours: Rubbery Men     (2×Flourishing Ribcage + 2×Basket of Rubbery Pies)
  133833: 6.00,  // Favours: Society         (2×Favour in High Places + 2×Night on the Town)
  125788: 6.00,  // Favours: Tomb-Colonies   (2×Antique Mystery + 2×Unprovenanced Artefact)
  129665: 6.00,  // Favours: Urchins         (2×Storm-Threnody + 2×Aeolian Scream)

};

// ══════════════════════════════════════════════════════════════════════════════
// DISCREPANCY SUMMARY vs content.js
// ══════════════════════════════════════════════════════════════════════════════
//
// 1. PRICE DIFFERENCES (wiki vs content.js):
//    - ID 106142 (Impossible Theorem): content.js=1562.50, wiki=1562.60 [minor rounding]
//    - ID 142709 (Emetic Revelation): content.js=0.02, wiki=12.50 [SIGNIFICANT - sells for 625 Cryptic Clues]
//    - ID 140849 (Ivory Humerus): content.js=15.00, wiki=12.50 (25 Hinterland Scrip)
//    - ID 144955 (Tempestuous Tale): content.js=2.50, wiki shows only 10 Stuivers at Roof markets (no Bazaar sell)
//    - ID 144977 (Memory of Moonlight): content.js=0.10, wiki=NO Bazaar sell (250 Stuivers at Roof markets only)
//    - ID 121792 (Snuffer's Gratitude): content.js=12.50, wiki=NO direct echo sell price
//
// 2. ITEMS IN content.js that may be WRONG:
//    - ID 142855 (Much-Needed Gap): content.js=62.50 - wiki CONFIRMS 125 Assortment of Khaganian Coinage = 62.50 ✓
//    - ID 141882 (Mortification of a Great Power): content.js=62.50 - wiki shows (62.50) implicit value
//
// 3. NEW ITEMS found on wiki NOT in content.js:
//    - ID 811    Rubbery Skull          = 62.50 (Rubbery)
//    - ID 742    Comprehensive Bribe    = 12.50 (Contraband)
//    - ID 482    Brass Ring             = 12.50 (Infernal)
//    - ID 141160 Tailfeather Brilliant as Flame = 2.50 (Luminosity)
//    - ID 118813 Secret College         = 1562.50 (Academic)
//    - ID 144796 A Seat at the Board    = 1562.50 (Great Game)
//    - ID 142448 Chimerical Archive     = 62.50 (Historical)
//    - ID 141189 Cartographer's Hoard  = 312.50 (Cartography)
//    - ID 140962 Parabolan Orange-apple = 12.50 (Sustenance)
//    - ID 144995 Stuiver                = 0.05 (Currency)
//    - ID 141159 Bessemer Steel Ingot   = 2.50 (Industrial)
//    - ID 18100  Competent Short Story  = 10.00 (Books)
//    - ID 18308  Compelling Short Story = 30.00 (Books)
//    - ID 18309  Thrilling Short Story  = 50.00 (Books)
//    - ID 18310  Exceptional Short Story= 60.00 (Books)
//    - ID 18311  Extraordinary Short Story = 70.00 (Books)
//    - ID 18312  Masterful Short Story  = 80.00 (Books)
//    - ID 18396  Celebrated Short Story = 130.00 (Books)
//    - ID 18381  Classic Short Story    = 180.00 (Books)
//    - ID 829    Unusual Love Story     = 0.50 (Books)
//    - ID 746    Book of Hidden Bodies  = 6.00 (Books)
//    - ID 141016 Corrective Historical Narrative = 12.50 (Books)
//    - ID 619    Page from the Liber Visionis = 0.50 (Books)
//    - ID 422    Stolen Correspondence  = 0.05 (Influence) [ENTIRE CATEGORY MISSING]
//    - ID 588    Intriguing Snippet     = 0.20 (Influence)
//    - ID 830    Compromising Document  = 0.50 (Influence)
//    - ID 658    Secluded Address       = 0.50 (Influence)
//    - ID 944    Stolen Kiss            = 2.50 (Influence)
//    - ID 740    Personal Recommendation= 6.00 (Influence)
//    - ID 744    Favour in High Places  = 12.50 (Influence)
//    - ID 140812 Approximate Value of Your Skeleton in Pennies = 0.01/penny [Progress quality, added to OSTEOLOGY]
//    - ID 441+   Companions (entire category added to prices_complete.js, already in content.js)
