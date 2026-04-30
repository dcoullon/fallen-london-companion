// Cross-references Bazaar shop sell prices against the inventory dump to produce
// prices.js entries (we get IDs from inventory, prices from the wiki scrape).
const fs = require('fs');

const SHOP_SELL_PRICES = {
  // Carrow's Steel - Weapons
  "Emergency Blunderbuss": 0.2,
  "Tasselled Walking-Stick": 2.5,
  "Skyglass Knife": 3.2,
  "Patent Scrutinizer": 6.4,
  "Ancient Hunting Rifle": 12.5,
  "Tasselled Sword-Cane": 14.4,
  "Irresistible Drum": 25.6,
  "Amber-Topped Walking-Stick": 32.4,
  "Set of Kifers": 32.4,
  "Ravenglass Knife": 51.2,
  "Patent Scrutinizer Deluxe!": 160,
  "Ratwork Derringer": 250,
  "Set of Intricate Kifers": 312.5,
  "Infernal Sharpshooter's Rifle": 210,
  "Poison-Tipped Umbrella": 225,
  "Ratwork Watch": 230,
  // Maywell's Hattery - Head
  "Prisoner's Mask": 0.04,
  "Ridiculous Hat": 0.01,
  "Mask of the Rose": 0.1,
  "Sporing Bonnet": 1.5,
  "Modish Bonnet": 0.5,
  "Pirate Hat": 0.5,
  "Gay Bonnet": 2.5,
  "Gentleman's Hat": 2.5,
  "Iron Hat": 6.4,
  "Sneak-Thief's Mask": 6.4,
  "Beguiling Mask": 62.5,
  "Exceptional Hat": 62.5,
  "Extraordinary Hat": 312.5,
  "Devilish Fedora": 200,
  "Fecund Amber Tiara": 200,
  "Snuffer's Face": 200,
  "Tub of Gloam-Foam": 200,
  // Dark & Savage - Gloves
  "Pair of Iron Manacles": 0.4,
  "Pair of Cutpurse's Mittens": 1.6,
  "Pair of Magician's Gloves": 2.5,
  "Eager Glove": 2.5,
  "Pair of Knife-and-Candler's Gloves": 2.5,
  "Avid Glove": 6.4,
  "Pair of Cracksman's Mittens": 6.4,
  "Pair of Dancemaster's Dabs": 6.4,
  "Pair of Lady's Lace Gloves": 6.4,
  "Pair of Spiderchitin Gauntlets": 6.4,
  "Voracious Glove": 57.6,
  "Insatiable Glove": 62.5,
  "Pair of Master Thief's Hands": 160,
  "Pair of Lenguals": 200,
  // Gottery the Outfitter - Clothing
  "Bundle of Ragged Clothing": 0.01,
  "Set of Workman's Clothes": 0.1,
  "Sober Dress": 0.1,
  "Bloodstained Suit": 0.2,
  "Bundle of Glad Rags": 0.2,
  "Faded Morning Suit": 0.2,
  "Maidservant's Uniform": 0.2,
  "Rough Gown": 0.2,
  "Shabby Opera Cloak": 0.2,
  "Battered Grey Overcoat": 6.4,
  "Outfit of Black Felt Garments": 2.88,
  "Stained Red Velvet Gown": 6.4,
  "Ratskin Suit": 62.5,
  "Far Khanate Lacquered Armour": 200,
  "Smock of Four Thousand Three Hundred and Eight Pockets": 210,
  // Nassos Zoologicals - Companions
  "Cheerful Goldfish": 0.04,
  "Lucky Weasel": 0.2,
  "Reprehensible Lizard": 0.2,
  "Sulky Bat": 0.2,
  "Talkative Rattus Faber": 0.5,
  "Araby Fighting-Weasel": 0.5,
  "Dazed Raven Advisor": 6.4,
  "Deshrieked Mandrake": 6.4,
  "Fairly Tame Sorrow-Spider": 6.4,
  "Working Rat": 32.4,
  "Malevolent Monkey": 45,
  "Rattus Faber Bandit-Chief": 160,
  "Midnight Matriarch": 200,
  "Weasel of Woe": 100,
  "Bengal Tigress": 312.5,
  "Overgoat": 5856.4,
  // MERCURY - Footwear
  "Pair of Scuffed Boots": 0.1,
  "Pair of Leg Irons": 0.4,
  "Pair of Scarlet Stockings of Dubious Origin": 0.4,
  "Pair of Squeakless Boots": 2.5,
  "Pair of Stylish Riding Boots": 2.5,
  "Pair of Savage Hob-Nailed Boots": 6.4,
  "Pair of Spidersilk Slippers": 6.4,
  "Pair of Masterwork Dancing Slippers": 32.4,
  "Pair of Ratskin Boots": 62.5,
  "Pair of Hushed Spidersilk Slippers": 160,
  "Pair of Vakeskin Boots": 160,
  "Pair of Kingscale Boots": 230,
  // Nikolas Pawnbrokers - Accessories/Misc
  "F.F. Gebrandt's Superior Laudanum": 0.1,
  "F.F. Gebrandt's Tincture of Vigour": 0.1,
  "Nikolas & Sons Instant Ablution Absolution": 0.25,
  "Antique Constable's Badge": 25,
  "Entry in Slowcake's Exceptionals": 27.5,
  "Copper Cipher Ring": 37.5,
  "Red-Feathered Pin": 35,
  "Tiny Jewelled Reliquary": 35,
  "Engraved Pewter Tankard": 47.5,
  "Ornate Typewriter": 30,
  "Old Bone Skeleton Key": 57.5,
  "Endowment of a University Fellowship": 50,
  "Firkin of Hesperidean Cider": 80000,
  // Merrigans Exchange - notable items (basics already priced)
  "London Street Sign": 2.5,
  "Bright Brass Skull": 60.0,
  "Nodule of Pulsating Amber": 62.5,
  // Redemptions - Companions
  "Devious Henchman": 12.5,
  "Grubby Urchin": 14.4,
  "Starry-Eyed Scoundrel": 14.0,
  "Winsome Dispossessed Orphan": 32.4,
  "Alluring Accomplice": 62.5,
  "Ruthless Henchman": 62.5,
  "Scuttering Squad": 10,
  // Dauncey's - Men's Clothing
  "Gentleman's Athletic Support": 6.4,
  "Dignified Tailcoat": 12.5,
  "Morning Suit": 14.4,
  "Distinguished Gentleman's Outfit": 62.5,
  "Night-Trimmed Frock Coat": 90,
  "Sumptuous Dandy's Outfit": 230,
  "Parabola-Linen Suit": 230,
  // Fadgett & Daughters - Women's Clothing
  "Corsetted Dress": 12.5,
  "Formidable Gown": 12.5,
  "Respectable Grey Gown": 14.4,
  "Elegant Emerald Gown": 62.5,
  "Magnificent Midnight-Blue Evening Gown": 90,
  "Exquisite Ivory Gown": 230.4,
  "Parabola-Linen Frock": 230,
  // Crawcase Cryptics - Documents
  "F.F. Gebrandt's Flame-Resilient Paper": 0.5,
  "O'Boyle's Practical Primer in the Various Languages of Nippon, Tartary, Cathay and the Princedoms of the Raj": 27.5,
  "Diary of the Dead": 60.0,
  "Rookery Password": 60.0,
  // Trompowsky et Fils - Accessories/Jewellery
  "Pair of Neathglass Goggles": 2.5,
  "Light-Drinking Cravat": 6.25,
  "Rostygold Ring": 6.25,
  "Venom-Ruby Lure": 6.25,
  "Pair of Luminous Neathglass Goggles": 6.4,
  "Brass Ring": 12.5,
  "Carnelian Sapphire Pendant": 75,
  "Unjustifiable Necktie": 75,
  "Semiotic Monocle": 312.5,
  "Twelve-Carat Diamond Ring": 225,
};

// Build inventory map: clean name -> {id, qty}
const inventory = JSON.parse(fs.readFileSync('example-data/current-inventory.json'));
const invByName = new Map();
for (const item of inventory) {
  const cleanName = (item.name || '').split(';')[0].replace(/\s*[×x]\s*\d.*$/, '').trim();
  invByName.set(cleanName, { id: item.id, qty: item.qty });
}

// Load already-priced IDs
const pricesText = fs.readFileSync('extension/prices.js', 'utf8');
const pricedIds = new Set([...pricesText.matchAll(/^\s+(\d+):/gm)].map(m => +m[1]));

// Match shop items against inventory
const toAdd = [];
const inShopNotInInventory = [];

for (const [name, sellPrice] of Object.entries(SHOP_SELL_PRICES)) {
  const inv = invByName.get(name);
  if (!inv) {
    inShopNotInInventory.push(name);
    continue;
  }
  if (pricedIds.has(inv.id)) continue; // already priced
  toAdd.push({ id: inv.id, name, sellPrice, qty: inv.qty });
}

toAdd.sort((a, b) => a.sellPrice - b.sellPrice || a.name.localeCompare(b.name));

console.log(`\n=== TO ADD to prices.js (in inventory, in shop, not yet priced): ${toAdd.length} ===\n`);
for (const x of toAdd) {
  console.log(`  ${String(x.id).padEnd(8)} ${String(x.sellPrice).padEnd(8)} // ${x.name}  (qty: ${x.qty})`);
}

console.log(`\n=== In shops but NOT in your inventory (can't get ID from this method): ${inShopNotInInventory.length} ===`);
for (const name of inShopNotInInventory.sort()) {
  console.log(`  ${name}`);
}
