// Usage: node check-prices.js example-data/current-inventory.json
const fs = require('fs');

const inventoryFile = process.argv[2] || 'example-data/current-inventory.json';
const pricesFile = 'extension/prices.js';

// Extract priced IDs from prices.js
const pricesText = fs.readFileSync(pricesFile, 'utf8');
const pricedIds = new Set();
for (const m of pricesText.matchAll(/^\s+(\d+):/gm)) {
  pricedIds.add(+m[1]);
}

// Parse inventory, clean up names (aria-label includes bonuses after first ';' and ' x ' qty)
const inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
const items = inventory.map(item => ({
  id: item.id,
  name: (item.name || '').split(';')[0].replace(/\s*[×x]\s*\d.*$/, '').trim(),
  qty: item.qty,
})).filter(x => x.id && x.name);

// Split into priced vs unpriced
const unpriced = items.filter(x => !pricedIds.has(x.id));
const priced   = items.filter(x =>  pricedIds.has(x.id));

console.log(`Inventory: ${items.length} items | Priced: ${priced.length} | Unpriced: ${unpriced.length}\n`);

if (unpriced.length === 0) {
  console.log('All inventory items are in prices.js!');
} else {
  console.log('Items in inventory NOT in prices.js:');
  for (const x of unpriced.sort((a,b) => a.name.localeCompare(b.name))) {
    console.log(`  ${String(x.id).padEnd(8)} ${x.name}  (qty: ${x.qty})`);
  }
}
