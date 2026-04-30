"""
Batch-queries the Fallen London wiki API for sell prices of unpriced inventory items.
Uses 50-title batches (MediaWiki limit) to stay efficient.
Outputs prices.js-ready entries for any items that have prices on the wiki.
"""
import json, re, time, urllib.parse, urllib.request

INVENTORY_FILE = "example-data/current-inventory.json"
PRICES_JS_FILE = "extension/prices.js"
API_URL = "https://fallenlondon.wiki/w/api.php"

# --- Load inventory ---
with open(INVENTORY_FILE, encoding="utf-8") as f:
    inventory = json.load(f)

inv_by_clean_name = {}
for item in inventory:
    raw = item.get("name", "")
    clean = re.sub(r'\s*[×x]\s*\d.*$', '', raw.split(';')[0]).strip()
    clean = re.sub(r'<[^>]+>', '', clean).strip()  # strip HTML tags
    inv_by_clean_name[clean] = {"id": item["id"], "qty": item.get("qty", "?")}

# --- Load already-priced IDs ---
with open(PRICES_JS_FILE, encoding="utf-8") as f:
    prices_text = f.read()
priced_ids = set(int(m.group(1)) for m in re.finditer(r'^\s+(\d+):', prices_text, re.MULTILINE))

# --- Filter to unpriced items ---
unpriced = {name: data for name, data in inv_by_clean_name.items()
            if not priced_ids.__contains__(data["id"])}
print(f"Unpriced items to query: {len(unpriced)}")

def wiki_title(name):
    """Convert item name to wiki page title."""
    return name.replace(' ', '_')

# --- Batch query wiki ---
names = list(unpriced.keys())
results = {}  # name -> wikitext or None

BATCH = 50
for i in range(0, len(names), BATCH):
    batch = names[i:i+BATCH]
    titles = '|'.join(wiki_title(n) for n in batch)
    params = urllib.parse.urlencode({
        'action': 'query',
        'titles': titles,
        'prop': 'revisions',
        'rvprop': 'content',
        'rvslots': 'main',
        'format': 'json',
    })
    url = f"{API_URL}?{params}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'FLPriceScraper/1.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for page in pages.values():
            title = page.get('title', '').replace('_', ' ')
            # Map back to our item name (try exact match first, then normalized)
            matched_name = None
            for n in batch:
                if wiki_title(n).replace('_', ' ').lower() == title.lower():
                    matched_name = n
                    break
            if not matched_name:
                matched_name = title  # fallback
            slots = page.get('revisions', [{}])[0].get('slots', {})
            wikitext = slots.get('main', {}).get('*', '') or page.get('revisions', [{}])[0].get('*', '')
            results[matched_name] = wikitext if wikitext else None
        print(f"  Batch {i//BATCH + 1}: fetched {len(pages)} pages")
        time.sleep(0.5)
    except Exception as e:
        print(f"  Batch {i//BATCH + 1} error: {e}")
        time.sleep(2)

# --- Extract sell prices ---
found = []
not_found = []

for name, wikitext in results.items():
    inv_data = unpriced.get(name)
    if not inv_data:
        continue
    if not wikitext:
        not_found.append(name)
        continue
    # Look for Buying/Selling N = X/Y pairs, matching their Sell Currency N
    # Only accept entries with no Sell Currency (meaning Echoes) or where we handle the currency
    STUIVER_RATE = 20   # 20 Stuivers = 1 Echo (1 Stuiver = 0.05 Echo)
    # Note: Hinterland Scrip rate = 2 Scrip per Echo (1 Scrip = 0.50 Echo)
    sell_echo = None
    sell_note = None
    for m in re.finditer(r'\|\s*Buying/Selling\s*(\d*)\s*=\s*[\d-]*/([\d.]+)', wikitext):
        n = m.group(1)
        raw_sell = float(m.group(2))
        # Check if this entry has a Sell Currency
        currency_match = re.search(rf'\|\s*Sell Currency\s*{n}\s*=\s*(.+)', wikitext)
        if currency_match:
            continue  # non-echo currency, skip
        # Check what market this is
        market_match = re.search(rf'\|\s*Market\s*{n}\s*=\s*(.+)', wikitext)
        market = market_match.group(1).strip() if market_match else 'The Echo Bazaar!'
        STUIVER_MARKETS = {"Hallow's Exchange", 'The Midnight Market', 'The Markets of Burgundy',
                           'The Mausoleum Stalls', 'The Stores of the Queensmen'}
        if market in STUIVER_MARKETS:
            sell_echo = raw_sell / STUIVER_RATE
            sell_note = f"{int(raw_sell)} Stuivers at {market}"
        elif market == 'The Echo Bazaar!' or not market:
            sell_echo = raw_sell
            sell_note = f"{raw_sell} Echoes at Bazaar"
        else:
            sell_echo = raw_sell
            sell_note = f"{raw_sell} at {market} (currency unknown — verify)"
        break
    if sell_echo is not None:
        found.append({"id": inv_data["id"], "name": name, "sell": sell_echo, "note": sell_note})
    else:
        not_found.append(name)

print(f"\n=== FOUND PRICES ({len(found)}) — add to prices.js ===")
found.sort(key=lambda x: x['sell'])
for x in found:
    print(f"  {str(x['id']).ljust(8)} {str(x['sell']).ljust(10)} // {x['name']}  [{x.get('note','')}]")

print(f"\n=== NO PRICE ON WIKI ({len(not_found)}) ===")
for name in sorted(not_found)[:30]:
    print(f"  {name}")
if len(not_found) > 30:
    print(f"  ... and {len(not_found)-30} more")
