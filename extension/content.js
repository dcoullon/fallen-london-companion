// Runs in the isolated content script world.

// ── Inject fetch interceptor into the page's main world ──────────────────────
const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
script.onload = () => script.remove();
document.documentElement.appendChild(script);

// ── Price table (echoes per unit, Bazaar sell price) ──────────────────────────
// Keyed by possession.id from the API response.
const PRICES = {
  // WINES
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

  // MYSTERIES
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
  106142: 1562.60,// Impossible Theorem

  // GOODS
  375:    0.01,  // Piece of Rostygold
  918:    0.50,  // Certifiable Scrap
  122495: 2.50,  // Knob of Scintillack
  141157: 2.50,  // Preserved Surface Blooms
  139723: 4.17,  // Attar

  // RAG TRADE
  381:    0.01,  // Silk Scrap
  907:    0.10,  // Surface-Silk Scrap
  915:    0.50,  // Whisper-Satin Scrap
  922:    2.50,  // Thirsty Bombazine Scrap
  923:   12.50,  // Puzzle-Damask Scrap
  924:   62.50,  // Parabola-Linen Scrap
  925:  312.50,  // Scrap of Ivory Organza
  926:  1560.00, // Veils-Velvet Scrap

  // RUBBERY
  385:    0.01,  // Nodule of Deep Amber
  328:    2.50,  // Nodule of Warm Amber
  810:    2.50,  // Unearthly Fossil
  949:   12.50,  // Nodule of Trembling Amber
  754:   62.50,  // Nodule of Pulsating Amber
  16308: 312.50, // Nodule of Fecund Amber
  106683: 1560.00,// Fluke-Core
  811:   62.50,  // Rubbery Skull

  // CONTRABAND
  144025: 0.01,  // Stashed Treasure
  449:    0.12,  // Flawed Diamond
  12186:  0.50,  // Ostentatious Diamond
  392:    2.50,  // London Street Sign
  737:    6.00,  // Use of Villains
  12188: 12.50,  // Magnificent Diamond
  742:   12.50,  // Comprehensive Bribe
  140900: 12.50, // Hillmover
  142094: 16.50, // Shard of Glim the Size of a Small Child
  142710: 20.00, // Unassuming Crate
  751:   60.00,  // Rookery Password
  12187: 312.50, // Fabulous Diamond

  // RUMOUR
  420:    0.04,  // Proscribed Material
  656:    0.10,  // Inkling of Identity
  659:    0.50,  // Scrap of Incendiary Gossip
  657:    2.50,  // An Identity Uncovered!
  735:    2.50,  // Night on the Town
  141194: 2.50,  // Rumour of the Upper River
  858:   12.50,  // Blackmail Material
  762:   60.00,  // Diary of the Dead
  141882: 62.50, // Mortification of a Great Power
  931:  312.50,  // Intriguer's Compendium
  930:  1560.00, // Rumourmonger's Network

  // INFERNAL
  386:    0.02,  // Soul
  928:    0.10,  // Amanita Sherry
  668:    0.50,  // Brilliant Soul
  653:    0.90,  // Devilbone Die
  122798: 2.50,  // Queer Soul
  927:    2.50,  // Muscaria Brandy
  747:   12.50,  // Portfolio of Souls
  23695: 12.50,  // Silent Soul
  482:   12.50,  // Brass Ring
  749:   60.00,  // Bright Brass Skull
  141281: 62.50, // Devilish Probability Distributor
  141772: 62.50, // Discordant Soul
  141229: 66.00, // Infernal Machine
  669:  312.50,  // Coruscating Soul
  929:  1560.00, // Reported Location of a One-Time Prince of Hell

  // LUMINOSITY
  384:    0.01,  // Lump of Lamplighter Beeswax
  652:    0.10,  // Phosphorescent Scarab
  144977: 12.50, // Memory of Moonlight
  141160: 2.50,  // Tailfeather Brilliant as Flame
  951:    2.50,  // Mourning Candle
  763:   12.50,  // Bejewelled Lens
  121792: 12.50, // Snuffer's Gratitude
  23504: 62.50,  // Eyeless Skull
  122492: 62.50, // Mountain-sherd
  122493: 62.50, // Element of Dawn
  1053:  312.50, // Ray-Drenched Cinder

  // ACADEMIC
  374:    0.01,  // Foxfire Candle Stub
  476:    0.10,  // Flask of Abominable Salts
  144821: 0.10,  // Sample of Roof-Drip
  825:    0.50,  // Memory of Distant Shores
  144822: 0.50,  // Starved Expression
  140898: 0.50,  // Incisive Observation
  122487: 2.50,  // Unprovenanced Artefact
  745:    2.50,  // Volume of Collated Research
  141283: 12.50, // Mirthless Compendium of Statistical Observations
  142754: 12.50, // Conceptual Breakthrough in Currency Design
  759:   50.00,  // Endowment of a University Fellowship
  122486: 62.50, // Judgements' Egg
  118813: 1562.50,// Secret College

  // GREAT GAME
  141394: 0.10,  // Well-Placed Pawn (wiki purchase price; no explicit Bazaar sell)
  141161: 0.50,  // Final Breath
  122490: 0.50,  // Moves in the Great Game
  122489: 12.50, // Vital Intelligence
  140971: 25.00, // Epaulette Mate (50 Hinterland Scrip)
  758:   37.50,  // Copper Cipher Ring
  140980: 62.50, // Stalemate (125 Hinterland Scrip)
  142855: 62.50,  // Much-Needed Gap
  142793: 312.50, // Corresponding Sounder
  144796: 1562.50,// A Seat at the Board

  // THEOLOGICAL
  142251: 0.50,  // Palimpsest Scrap
  142250: 2.50,  // Apostate's Psalm
  141675: 12.50, // Verse of Counter-Creed
  142249: 62.50, // False Hagiotoponym
  142295: 312.50,// Legenda Cosmogone

  // WILD WORDS
  388:    0.02,  // Primordial Shriek
  935:    0.10,  // Maniac's Prayer
  932:    0.50,  // Correspondence Plaque
  144955: 0.50,  // Tempestuous Tale
  773:    2.50,  // Aeolian Scream
  849:   12.50,  // Storm-Threnody
  933:   62.50,  // Night-Whisper
  936:  312.50,  // Starstone Demark
  934:  1560.00, // Breath of the Void

  // ELDER
  377:    0.01,  // Jade Fragment
  424:    0.10,  // Relic of the Third City
  587:    0.50,  // Mystery of the Elder Continent
  852:    2.50,  // Presbyterate Passphrase
  946:   12.50,  // Antique Mystery
  832:   62.50,  // Primaeval Hint
  14975: 312.50, // Elemental Secret

  // HISTORICAL
  423:    0.05,  // Relic of the Fourth City
  141913: 0.10,  // Rusted Stirrup
  141917: 0.10,  // Silvered Cat's Claw
  425:    0.15,  // Relic of the Second City
  141914: 0.50,  // Trace of Viric
  141570: 2.50,  // Trace of the First City
  141916: 2.50,  // Nicatorean Relic
  145558: 2.50,  // Relic of the Fifth City
  141946: 12.50, // Unlawful Device
  142659: 12.50, // Memory of a Shadow in Varchas (25 Hinterland Scrip)
  142074: 62.50, // Flask of Waswood Wellspring Water
  142448: 62.50, // Chimerical Archive

  // LEGAL
  426:    0.20,  // Infernal Contract
  13929:  0.50,  // Dubious Testimony
  13928:  2.50,  // Sworn Statement
  141883: 12.50, // Cave-Aged Code of Honour
  739:   12.50,  // Legal Document
  123213: 62.50, // Fragment of the Tragedy Procedures
  143050: 62.50, // Sap of the Cedar at the Crossroads
  142087: 312.50,// Edicts of the First City

  // CARTOGRAPHY
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
  141189: 312.50,// Cartographer's Hoard

  // NOSTALGIA
  391:    0.02,  // Drop of Prisoner's Honey
  531:    0.10,  // Romantic Notion
  827:    0.50,  // Vision of the Surface
  945:    2.50,  // Touching Love Story
  741:   12.50,  // Bazaar Permit
  142709: 12.50, // Emetic Revelation
  114982: 62.50, // Soothe & Cooper Long-Box
  142386: 62.50, // Captivating Ballad
  143044: 312.50,// Sample of Lacreous Affection
  143045: 312.50,// Vestige of a Starlit Reverie
  142504: 1562.50,// A Tasting Flight of Targeted Toxins

  // ZEE TREASURES
  379:    0.01,  // Moon-Pearl
  122484: 0.50,  // Deep-zee Catch
  122494: 0.50,  // Royal-Blue Feather
  122485: 0.50,  // Ambiguous Eolith
  122483: 2.50,  // Carved Ball of Stygian Ivory
  122488: 2.50,  // Live Specimen
  142666: 62.50, // Oneiric Pearl

  // CURIOSITY
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
  413:   12.50,  // Counterfeit Head of John the Baptist

  // INDUSTRIAL
  387:    0.01,  // Nevercold Brass Sliver
  141158: 0.50,  // Nightsoil of the Bazaar
  141159: 0.50,  // Bessemer Steel Ingot
  764:    2.50,  // Strong-Backed Labour
  140779: 2.50,  // Perfumed Gunpowder
  738:    6.00,  // Whirring Contraption
  141162: 9.50,  // Railway Steel (19 Hinterland Scrip)
  142840: 62.50, // Crackling Device

  // RATNESS
  376:    0.01,  // Rat on a String
  14621:  0.50,  // Venge-Rat Corpse
  14620:  2.50,  // Baptised Rattus Faber Corpse
  123214: 12.50, // Ratty Reliquary

  // SUSTENANCE
  141374: 0.10,  // Jasmine Leaves
  141324: 0.10,  // Remains of a Pinewood Shark
  141541: 0.50,  // Hand-picked Peppercaps (1 Hinterland Scrip)
  141486: 0.50,  // Pot of Venison Marrow
  122491: 0.50,  // Solacefruit
  141574: 0.50,  // Magisterial Lager (1 Hinterland Scrip)
  618:    0.70,  // Dark-Dewed Cherry
  121611: 2.50,  // Tin of Zzoup
  140892: 2.50,  // Crate of Incorruptible Biscuits
  140894: 2.50,  // Basket of Rubbery Pies
  142237: 5.00,  // Beatrice's Taper-nut
  141548: 6.00,  // Lithification Liquid (12 Hinterland Scrip)
  140962: 12.50, // Parabolan Orange-apple
  140891: 12.50, // Sausage About Which No One Complains
  143051: 62.50, // Hellworm Milk
  143588: 62.50, // Ripened Wheel of Hellworm Cheese
  141542: 63.50, // Tinned Ham
  410:  80000.00,// Firkin of Hesperidean Cider

  // CURRENCY
  22390:  0.01,  // Penny
  144605: 0.01,  // Hinterland Prosperity
  421:    0.03,  // Fistful of Surface Currency
  143057: 0.10,  // Rat-Shilling
  144995: 0.05,  // Stuiver
  582:    0.25,  // First City Coin
  125025: 0.50,  // Hinterland Scrip
  140732: 0.50,  // Forged Justificande Coin
  142708: 0.50,  // Assortment of Khaganian Coinage
  140706: 2.50,  // Justificande Coin

  // OSTEOLOGY (values from skeleton penny table: pennies ÷ 100 = echoes)
  140812: 0.01,  // Approximate Value of Your Skeleton in Pennies (1 penny = 0.01 echoes)
  140889: 0.01,  // Bone Fragments
  141170: 0.50,  // Survey of the Neath's Bones (1 Hinterland Scrip)
  141543: 6.00,  // Patent Osteological Sand and Wax (12 Hinterland Scrip)
  141546: 31.00, // Annings' Complete and Reliable Kit for the Preservation and Display of Skeletons (62 Hinterland Scrip)
  140879: 0.01,  // Bat Wing
  140771: 0.10,  // Femur of a Surface Deer
  140852: 0.50,  // Fin Bones, Collected
  140756: 1.00,  // Unidentified Thigh Bone
  140813: 2.50,  // Human Arm
  140814: 2.50,  // Headless Skeleton
  140851: 2.50,  // Plaster Tail Bones
  143548: 2.50,  // Segmented Ribcage
  140881: 2.50,  // Tomb-Lion's Tail
  140853: 2.50,  // Withered Tentacle
  141372: 2.50,  // Wing of a Young Terror Bird
  140773: 3.00,  // Femur of a Jurassic Beast
  141480: 3.00,  // Helical Thighbone
  140772: 3.00,  // Knotted Humerus
  142727: 5.00,  // Obsidian Chitin Tail
  140839: 12.50, // Human Ribcage
  140840: 12.50, // Flourishing Ribcage
  140833: 12.50, // Thorned Ribcage
  140850: 12.50, // Albatross Wing
  141371: 12.50, // Horned Skull
  142298: 12.50, // Pentagrammic Skull
  140774: 12.50, // Holy Relic of the Thigh of Saint Fiacre
  141380: 15.00, // Amber-Crusted Fin
  140849: 15.00, // Ivory Humerus
  141774: 17.50, // Skull in Coral
  140882: 25.00, // Plated Skull
  141540: 27.50, // Fossilised Forelimb
  145642: 35.00, // Panoptical Skull
  145008: 60.00, // Glim-Encrusted Carapace
  140843: 62.50, // Mammoth Ribcage
  141479: 62.50, // Doubled Skull
  140847: 62.50, // Sabre-toothed Skull
  140838: 62.50, // Skeleton with Seven Necks
  142351: 65.00, // Ivory Femur
  140845: 312.50,// Leviathan Frame
  140857: 312.50,// Prismatic Frame
  140844: 312.50,// Ribcage with a Bouquet of Eight Spines
  141640: 312.50,// Five-Pointed Ribcage

  // BOOKS
  756:    27.50, // O'Boyle's Practical Primer (Various Languages of Nippon, Tartary, Cathay and the Princedoms of the Raj)
  18379:   1.00, // Unloved Short Story
  18101:   2.00, // Short Story
  18100:  10.00, // Competent Short Story
  18308:  30.00, // Compelling Short Story
  18309:  50.00, // Thrilling Short Story
  18310:  60.00, // Exceptional Short Story
  18311:  70.00, // Extraordinary Short Story
  18312:  80.00, // Masterful Short Story
  18396: 130.00, // Celebrated Short Story
  18381: 180.00, // Classic Short Story
  829:     0.50, // Unusual Love Story
  746:     6.00, // Book of Hidden Bodies
  141016: 12.50, // Corrective Historical Narrative
  141569: 20.00, // Fungal Dangers and Poisons: A Guide for New Growers (40 Hinterland Scrip)
  619:     0.50, // Page from the Liber Visionis
  752:    27.50, // Entry in Slowcake's Exceptionals

  // INFLUENCE
  422:    0.05,  // Stolen Correspondence
  588:    0.20,  // Intriguing Snippet
  830:    0.50,  // Compromising Document
  658:    0.50,  // Secluded Address
  944:    2.50,  // Stolen Kiss
  740:    6.00,  // Personal Recommendation
  744:   12.50,  // Favour in High Places

  // EPISTOLARY
  142190: 0.50,  // F.F. Gebrandt's Flame-Resilient Paper

  // ACCESSORIES (Trompowsky et Fils sell prices)
  306:    2.50, // Pair of Neathglass Goggles
  145125: 6.25, // Venom-Ruby Lure
  145126: 6.25, // Light-Drinking Cravat
  145128: 6.25, // Rostygold Ring
  307:    6.40, // Pair of Luminous Neathglass Goggles
  145127: 75.00,// Carnelian Sapphire Pendant
  145129: 75.00,// Unjustifiable Necktie
  730:   225.00,// Twelve-Carat Diamond Ring
  142589: 875.00, // Misplaced Ring (1750 Hinterland Scrip)
  727:   312.50,// Semiotic Monocle

  // MEN'S CLOTHING (Dauncey's sell prices)
  718:    6.40, // Gentleman's Athletic Support
  320:   12.50, // Dignified Tailcoat
  719:   14.40, // Morning Suit
  322:   62.50, // Distinguished Gentleman's Outfit
  323:   90.00, // Night-Trimmed Frock Coat
  325:  230.00, // Sumptuous Dandy's Outfit
  21891: 230.00,// Parabola-Linen Suit
  141681: 250.00, // Infernally Well-cut Suit (500 Hinterland Scrip)

  // WOMEN'S CLOTHING (Fadgett & Daughters sell prices)
  717:   12.50, // Corsetted Dress
  720:   12.50, // Formidable Gown
  319:   14.40, // Respectable Grey Gown
  321:   62.50, // Elegant Emerald Gown
  324:   90.00, // Magnificent Midnight-Blue Evening Gown
  21893: 230.00,// Parabola-Linen Frock
  326:  230.40, // Exquisite Ivory Gown
  141680: 250.00, // Devilishly Slinky Evening Gown (500 Hinterland Scrip)

  // HATS (Maywell's Hattery sell prices)
  556:     0.01, // Ridiculous Hat
  303:     0.04, // Prisoner's Mask
  555:     0.10, // Mask of the Rose
  465:     0.50, // Modish Bonnet
  466:     0.50, // Pirate Hat
  544:     1.50, // Sporing Bonnet
  308:     2.50, // Gay Bonnet
  305:     2.50, // Gentleman's Hat
  304:     6.40, // Iron Hat
  309:    10.00, // Sneak-Thief's Mask
  310:    62.50, // Beguiling Mask
  311:    62.50, // Exceptional Hat
  21847: 200.00, // Devilish Fedora
  21845: 200.00, // Fecund Amber Tiara
  21894: 200.00, // Snuffer's Face
  21897: 200.00, // Tub of Gloam-Foam
  312:   312.50, // Extraordinary Hat
  141539:  62.50, // Tracklayer's Helmet (125 Hinterland Scrip)

  // WEAPONS (Carrow's Steel sell prices)
  1004:   0.20, // Emergency Blunderbuss
  333:    2.50, // Tasselled Walking-Stick
  327:    3.20, // Skyglass Knife
  339:    6.40, // Patent Scrutinizer
  329:   12.50, // Ancient Hunting Rifle
  334:   14.40, // Tasselled Sword-Cane
  338:   25.60, // Irresistible Drum
  335:   32.40, // Amber-Topped Walking-Stick
  336:   32.40, // Set of Kifers
  330:   51.20, // Ravenglass Knife
  340:  160.00, // Patent Scrutinizer Deluxe!
  21896: 210.00, // Infernal Sharpshooter's Rifle
  729:  225.00, // Poison-Tipped Umbrella
  655:  230.00, // Ratwork Watch
  332:  250.00, // Ratwork Derringer
  337:  312.50, // Set of Intricate Kifers

  // GLOVES (Dark & Savage sell prices)
  290:    0.40, // Pair of Iron Manacles
  292:    1.60, // Pair of Cutpurse's Mittens
  291:    2.50, // Pair of Magician's Gloves
  293:    2.50, // Eager Glove
  295:    2.50, // Pair of Knife-and-Candler's Gloves
  294:    6.40, // Avid Glove
  296:    6.40, // Pair of Cracksman's Mittens
  298:    6.40, // Pair of Dancemaster's Dabs
  299:    6.40, // Pair of Lady's Lace Gloves
  297:    6.40, // Pair of Spiderchitin Gauntlets
  300:   57.60, // Voracious Glove
  301:   62.50, // Insatiable Glove
  302:  160.00, // Pair of Master Thief's Hands
  21848: 200.00, // Pair of Lenguals
  141628: 200.00, // Tentacle Mitts (400 Hinterland Scrip)

  // BOOTS (MERCURY sell prices)
  765:    0.10, // Pair of Scuffed Boots
  356:    0.40, // Pair of Leg Irons
  467:    0.40, // Pair of Scarlet Stockings of Dubious Origin
  358:    2.50, // Pair of Squeakless Boots
  357:    2.50, // Pair of Stylish Riding Boots
  361:    6.40, // Pair of Savage Hob-Nailed Boots
  359:    6.40, // Pair of Spidersilk Slippers
  360:   32.40, // Pair of Masterwork Dancing Slippers
  362:   62.50, // Pair of Ratskin Boots
  363:  160.00, // Pair of Hushed Spidersilk Slippers
  364:  160.00, // Pair of Vakeskin Boots
  21846: 230.00, // Pair of Kingscale Boots
  141538:  62.50, // Pair of Balmoral Boots (125 Hinterland Scrip)

  // CONTACTS (Redemptions sell prices)
  1005:    10.00, // Scuttering Squad
  348:     12.50, // Devious Henchman
  140648:  14.00, // Starry-Eyed Scoundrel
  346:     14.40, // Grubby Urchin
  347:     32.40, // Winsome Dispossessed Orphan
  350:     62.50, // Alluring Accomplice
  349:     62.50, // Ruthless Henchman

  // CLOTHING (Gottery the Outfitter sell prices)
  313:     0.01, // Bundle of Ragged Clothing
  436:     0.10, // Set of Workman's Clothes
  435:     0.10, // Sober Dress
  722:     0.20, // Bloodstained Suit
  723:     0.20, // Bundle of Glad Rags
  726:     0.20, // Faded Morning Suit
  725:     0.20, // Maidservant's Uniform
  721:     0.20, // Rough Gown
  724:     0.20, // Shabby Opera Cloak
  317:     2.88, // Outfit of Black Felt Garments
  315:     6.40, // Battered Grey Overcoat
  316:     6.40, // Stained Red Velvet Gown
  318:    62.50, // Ratskin Suit
  21892: 200.00, // Far Khanate Lacquered Armour
  21895: 210.00, // Smock of Four Thousand Three Hundred and Eight Pockets
  141627: 200.00, // Highwayman's Cloak (400 Hinterland Scrip)
  142588: 875.00, // Anning's Patent Ribcage Breastplate (1750 Hinterland Scrip)

  // COMPANIONS (Nassos Zoologicals sell prices)
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

  // FAVOURS (Progress qualities; value = Jericho Locks option / 5: 4 favours + 1 action)
  // All options below yield 30 echoes → 6.00 per favour
  // Source: https://fallenlondon.wiki/wiki/Calling_in_Favours_(Guide)
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

// ── Parse choosebranch response ───────────────────────────────────────────────
function parseChanges(data) {
  if (!data || !Array.isArray(data.messages)) return [];

  const changes = [];
  for (const msg of data.messages) {
    if (!msg.possession) continue;
    // Allow non-Thing items (Progress, Status, etc.) only if explicitly priced
    if (msg.possession.nature !== "Thing" && PRICES[msg.possession.id] == null) continue;

    let gained, qty;

    if (msg.type === "StandardQualityChangeMessage") {
      const ct = msg.changeType;
      if (ct !== "Decreased" && ct !== "Increased" && ct !== "Gained" && ct !== "Lost") continue;
      // "Decreased"/"Increased" are inverted (game bug/quirk); "Gained"/"Lost" are direct
      gained = ct === "Decreased" || ct === "Gained";
      const match = msg.message.match(/([\d,]+) x /);
      if (!match) continue;
      qty = parseInt(match[1].replace(/,/g, ""), 10);
    } else if (msg.type === "QualityExplicitlySetMessage") {
      // First-time gain from zero — "You now have N x Item", N equals the amount gained.
      const match = msg.message.match(/([\d,]+) x /);
      if (!match) continue;
      qty = parseInt(match[1].replace(/,/g, ""), 10);
      gained = true;
    } else {
      continue;
    }

    const { id, name } = msg.possession;
    const unitPrice = PRICES[id] ?? null;
    const echoValue = unitPrice !== null ? qty * unitPrice * (gained ? 1 : -1) : null;

    changes.push({ name, qty, gained, echoValue });
  }
  return changes;
}

// ── DOM annotation ────────────────────────────────────────────────────────────
function annotateResults(changes) {
  if (changes.length === 0) return;

  const pricedChanges = changes.filter((c) => c.echoValue !== null);
  const annotated = new Set();
  const annotatedParents = []; // ordered list of parents we injected into
  let attempts = 0;

  const tryAnnotate = () => {
    for (const change of pricedChanges) {
      if (annotated.has(change.name)) continue;

      const searchText = ` x ${change.name}`;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.includes(searchText)) continue;

        const parent = node.parentElement;
        if (!parent) continue;
        if (parent.querySelector(`.fl-echo-val[data-item="${CSS.escape(change.name)}"]`)) continue;

        const sign = change.gained ? "+" : "−";
        const color = change.gained ? "#4a7c59" : "#b03030";
        const span = document.createElement("span");
        span.className = "fl-echo-val";
        span.dataset.item = change.name;
        span.style.cssText = `color:${color};font-size:0.9em;margin-left:6px`;
        span.textContent = `(${sign}${Math.abs(change.echoValue).toFixed(2)} echoes)`;
        parent.appendChild(span);
        annotated.add(change.name);
        annotatedParents.push(parent);
        break;
      }
    }

    attempts++;
    if (annotated.size < pricedChanges.length && attempts < 20) {
      setTimeout(tryAnnotate, 150);
      return;
    }

    const net = pricedChanges.reduce((sum, c) => sum + c.echoValue, 0);
    const unknownCount = changes.length - pricedChanges.length;

    // Inline net total after the last annotated item — only when multiple priced items
    if (annotatedParents.length > 1) {
      const existing = document.getElementById("fl-net-inline");
      if (existing) existing.remove();

      const lastParent = annotatedParents[annotatedParents.length - 1];
      const netColor = net >= 0 ? "#4a7c59" : "#b03030";
      const netSign = net >= 0 ? "+" : "";

      const netEl = document.createElement("div");
      netEl.id = "fl-net-inline";
      netEl.style.cssText = `color:${netColor};font-size:0.9em;margin-top:6px;font-style:italic;border-top:1px solid #3a2e1e;padding-top:4px`;
      netEl.textContent = `Net total: ${netSign}${net.toFixed(2)} echoes`;
      lastParent.insertAdjacentElement("afterend", netEl);
    }

  };

  setTimeout(tryAnnotate, 300);
}

// ── Net total badge ───────────────────────────────────────────────────────────
function showNetBadge(net, unknownCount) {
  const existing = document.getElementById("fl-net-badge");
  if (existing) existing.remove();

  const badge = document.createElement("div");
  badge.id = "fl-net-badge";

  const netColor = net !== null ? (net >= 0 ? "#4a7c59" : "#b03030") : "#6b5a3e";
  const netText = net !== null
    ? `Net: <span style="color:${netColor};font-weight:bold">${net >= 0 ? "+" : ""}${net.toFixed(2)} echoes</span>`
    : `<span style="color:${netColor}">Items gained (prices not yet known)</span>`;
  const unknownNote = unknownCount > 0 && net !== null
    ? ` <span style="color:#6b5a3e;font-size:0.85em">(+${unknownCount} unpriced)</span>`
    : "";

  badge.style.cssText = [
    "position:fixed",
    "bottom:16px",
    "right:16px",
    "background:rgba(18,14,9,0.95)",
    "border:1px solid #6b5a3e",
    "color:#cdbf99",
    "font-family:Georgia,serif",
    "font-size:13px",
    "padding:7px 12px",
    "border-radius:3px",
    "z-index:99999",
    "box-shadow:0 2px 8px rgba(0,0,0,0.5)",
    "cursor:pointer",
  ].join(";");

  if (net !== null) {
    const netSpan = document.createElement("span");
    netSpan.style.cssText = `color:${netColor};font-weight:bold`;
    netSpan.textContent = `${net >= 0 ? "+" : ""}${net.toFixed(2)} echoes`;
    badge.append("Net: ", netSpan);
    if (unknownCount > 0) {
      const unknownSpan = document.createElement("span");
      unknownSpan.style.cssText = "color:#6b5a3e;font-size:0.85em";
      unknownSpan.textContent = ` (+${unknownCount} unpriced)`;
      badge.appendChild(unknownSpan);
    }
  } else {
    const span = document.createElement("span");
    span.style.cssText = `color:${netColor}`;
    span.textContent = "Items gained (prices not yet known)";
    badge.appendChild(span);
  }
  badge.addEventListener("click", () => badge.remove());

  document.body.appendChild(badge);

  setTimeout(() => {
    badge.style.transition = "opacity 0.5s";
    badge.style.opacity = "0";
    setTimeout(() => badge.remove(), 500);
  }, 10000);
}

// ── Rat Market Saturation hint ────────────────────────────────────────────────
function parseSaturation(data) {
  if (!data || !Array.isArray(data.messages)) return null;
  for (const msg of data.messages) {
    if (msg.possession && msg.possession.name === "Rat Market Saturation") {
      return msg.possession.level ?? null;
    }
  }
  return null;
}

function annotateSaturation(level) {
  let label, detail;
  if (level <= 65000) {
    label = "32% boost";
    detail = `${(65000 - level).toLocaleString()} to 12% tier`;
  } else if (level <= 180000) {
    label = "12% boost";
    detail = `${(180000 - level).toLocaleString()} to no boost`;
  } else {
    label = "no boost";
    detail = "above 180k";
  }

  let attempts = 0;
  const tryAnnotate = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.includes(" x Rat Market Saturation")) continue;
      const parent = node.parentElement;
      if (!parent || parent.querySelector(".fl-saturation-hint")) break;
      const span = document.createElement("span");
      span.className = "fl-saturation-hint";
      span.style.cssText = "color:#c9a84c;font-size:0.9em;margin-left:6px";
      span.textContent = `(${label} · ${detail})`;
      parent.appendChild(span);
      return;
    }
    if (++attempts < 20) setTimeout(tryAnnotate, 150);
  };
  setTimeout(tryAnnotate, 300);
}

// ── Branch cost preview ───────────────────────────────────────────────────────
function parseRequiredQty(tooltip) {
  if (!tooltip) return null;
  if (/at most/i.test(tooltip)) return null;                         // upper cap — skip
  const m = tooltip.match(/you need(?:ed)? ([\d,]+)/i);
  if (m) return parseInt(m[1].replace(/,/g, ""), 10);
  if (/you unlocked this with an?\s/i.test(tooltip)) return 1;      // "with a Sulky Bat" — singular
  return null;                                                        // unknown pattern — skip
}

function parseBranchCosts(data) {
  if (!data || !data.storylet || !Array.isArray(data.storylet.childBranches)) return [];

  const results = [];
  for (const branch of data.storylet.childBranches) {
    if (!Array.isArray(branch.qualityRequirements) || branch.qualityRequirements.length === 0) continue;

    const costs = [];
    for (const req of branch.qualityRequirements) {
      if (req.category === "Companion") continue;          // companions aren't consumed
      const unitPrice = PRICES[req.qualityId] ?? null;
      if (unitPrice === null) continue;                    // not in price table
      const qty = parseRequiredQty(req.tooltip);
      if (qty === null) continue;                          // "at most" cap
      costs.push({ name: req.qualityName, qty, echoValue: qty * unitPrice });
    }

    if (costs.length === 0) continue;
    const total = costs.reduce((s, c) => s + c.echoValue, 0);
    results.push({ branchName: branch.name, costs, total });
  }
  return results;
}

let _branchCostObserver = null;

function annotateBranchCosts(branchCosts) {
  if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; }
  if (branchCosts.length === 0) return;

  // Map quality name → individual echo cost (shown per tooltip)
  const costByQuality = new Map();
  for (const branch of branchCosts) {
    for (const cost of branch.costs) {
      costByQuality.set(cost.name, cost.echoValue);
    }
  }

  function tryInject() {
    for (const container of document.querySelectorAll("div.icon.quality-requirement")) {
      const btn = container.querySelector("[role='button'][aria-label]");
      if (!btn || btn.dataset.flCostDone) continue;

      const label = btn.getAttribute("aria-label") || "";
      if (!/you unlocked this with|you need\b/i.test(label)) continue;

      for (const [name, echoValue] of costByQuality) {
        if (!label.includes(name)) continue;

        btn.dataset.flCostDone = "1";

        const badge = document.createElement("div");
        badge.className = "fl-cost-hint";
        badge.style.cssText = "color:#b03030;font-size:0.7em;text-align:center;font-family:Georgia,serif;font-style:italic;pointer-events:none;line-height:1.3";
        badge.textContent = `−${echoValue.toFixed(2)}E`;
        container.appendChild(badge);
        break;
      }
    }
  }

  _branchCostObserver = new MutationObserver(tryInject);
  _branchCostObserver.observe(document.body, { childList: true, subtree: true });
  // Clean up after 5 minutes (one storylet session is plenty)
  setTimeout(() => { if (_branchCostObserver) { _branchCostObserver.disconnect(); _branchCostObserver = null; } }, 300000);
}

// ── Possessions tab — conversion items bar + jump link ────────────────────────

// Map: item id → faction label
const CONVERSION_ITEMS = new Map([
  [755, "Bohemians"],
  [750, "Church"],
  [748, "Constables"],
  [753, "Criminals"],
  [757, "Docks"],
  [758, "Great Game"],
  [749, "Hell"],
  [761, "Revolutionaries"],
  [754, "Rubbery Men"],
  [752, "Society"],
  [762, "Tomb-Colonies"],
  [751, "Urchins"],
]);

// Map: item id → item name (for scroll-to lookup)
const CONVERSION_ITEM_NAMES = new Map([
  [755, "Ornate Typewriter"],
  [750, "Tiny Jewelled Reliquary"],
  [748, "Antique Constable's Badge"],
  [753, "Old Bone Skeleton Key"],
  [757, "Engraved Pewter Tankard"],
  [758, "Copper Cipher Ring"],
  [749, "Bright Brass Skull"],
  [761, "Red-Feathered Pin"],
  [754, "Nodule of Pulsating Amber"],
  [752, "Entry in Slowcake's Exceptionals"],
  [762, "Diary of the Dead"],
  [751, "Rookery Password"],
]);

let _cachedConversionItems = null; // null = not yet received; Map after first myself
let _possessionsObserver = null;

function parseMyself(data) {
  console.log("[fl] parseMyself called, data keys:", data ? Object.keys(data) : "null");
  if (!data || !Array.isArray(data.possessions)) {
    console.log("[fl] parseMyself: possessions is not an array:", typeof data?.possessions);
    return;
  }
  const owned = new Map();

  function scan(categories) {
    for (const cat of categories) {
      for (const p of (cat.possessions || [])) {
        if (CONVERSION_ITEMS.has(p.id)) {
          owned.set(p.id, { id: p.id, name: p.name, qty: p.level || 1 });
        }
      }
      if (Array.isArray(cat.categories)) scan(cat.categories);
    }
  }

  scan(data.possessions);
  console.log("[fl] parseMyself: found", owned.size, "conversion items:", [...owned.values()].map(v => v.name));
  _cachedConversionItems = owned;
  // Remove any stale bar so it gets re-injected with fresh data
  document.querySelectorAll(".fl-renown-bar,.fl-jump-items").forEach(el => el.remove());
}

function scrollToConversionItem(itemName) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!el || el.closest(".fl-renown-bar")) continue;
    if (node.textContent.trim() === itemName) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.style.outline = "2px solid #c9a84c";
      setTimeout(() => { el.style.outline = ""; }, 2000);
      return;
    }
  }
}

function injectPossessionsUI() {
  const searchBox = document.querySelector("input.form__control.input--item-search");
  console.log("[fl] injectPossessionsUI: searchBox=", !!searchBox, "cached=", _cachedConversionItems);
  if (!searchBox) return;
  if (_cachedConversionItems === null) return;

  const searchWrapper = searchBox.closest("div") || searchBox.parentElement;
  if (searchWrapper.nextElementSibling?.classList.contains("fl-renown-bar")) return;

  // Jump link — prepended to nearest scrollable ancestor
  let scrollParent = searchBox.parentElement;
  while (scrollParent && scrollParent !== document.body) {
    const ov = window.getComputedStyle(scrollParent).overflowY;
    if (ov === "auto" || ov === "scroll") break;
    scrollParent = scrollParent.parentElement;
  }
  if (scrollParent && scrollParent !== document.body && !scrollParent.querySelector(".fl-jump-items")) {
    const link = document.createElement("div");
    link.className = "fl-jump-items";
    link.style.cssText = "padding:3px 8px;font-size:0.75em;font-family:Georgia,serif;text-align:right;cursor:pointer;color:#c9a84c;border-bottom:1px solid #2a2a2a;";
    link.textContent = "↓ Items";
    link.addEventListener("click", () => searchBox.scrollIntoView({ behavior: "smooth", block: "start" }));
    scrollParent.prepend(link);
  }

  // Conversion items bar (right after the search box)
  const bar = document.createElement("div");
  bar.className = "fl-renown-bar";
  bar.style.cssText = "padding:4px 8px 6px;font-size:0.8em;font-family:Georgia,serif;border-bottom:1px solid #444;";

  const heading = document.createElement("div");
  heading.style.cssText = "color:#888;font-style:italic;margin-bottom:4px;";
  heading.textContent = "Favour → Renown";
  bar.appendChild(heading);

  const pills = document.createElement("div");
  pills.style.cssText = "display:flex;flex-wrap:wrap;gap:3px 6px;";
  bar.appendChild(pills);

  for (const [id, faction] of CONVERSION_ITEMS) {
    const owned = _cachedConversionItems.get(id);
    const pill = document.createElement("span");
    if (owned) {
      pill.style.cssText = "color:#c9a84c;cursor:pointer;padding:1px 5px;border:1px solid #6b5a3e;border-radius:3px;";
      pill.textContent = `${faction} ${owned.qty}`;
      pill.title = owned.name;
      pill.addEventListener("click", () => scrollToConversionItem(CONVERSION_ITEM_NAMES.get(id)));
    } else {
      pill.style.cssText = "color:#555;padding:1px 5px;border:1px solid #333;border-radius:3px;";
      pill.textContent = `${faction} —`;
      pill.title = CONVERSION_ITEM_NAMES.get(id);
    }
    pills.appendChild(pill);
  }

  searchWrapper.after(bar);
}

function startPossessionsObserver() {
  if (_possessionsObserver) return;
  _possessionsObserver = new MutationObserver(injectPossessionsUI);
  _possessionsObserver.observe(document.body, { childList: true, subtree: true });
}

// Start observer immediately so we catch the possessions tab opening regardless of message order
startPossessionsObserver();

// ── Wire up ───────────────────────────────────────────────────────────────────

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== "fl-helper") return;
  console.log("[fl] message received:", event.data.type);

  if (event.data.type === "choosebranch") {
    const data = event.data.data;
    annotateResults(parseChanges(data));
    const satLevel = parseSaturation(data);
    if (satLevel !== null) annotateSaturation(satLevel);
  } else if (event.data.type === "storylet-begin") {
    annotateBranchCosts(parseBranchCosts(event.data.data));
  } else if (event.data.type === "myself") {
    parseMyself(event.data.data);
    startPossessionsObserver();
    injectPossessionsUI();
  }
});
