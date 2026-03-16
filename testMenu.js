async function run() {
  const res = await fetch('https://home.tiffany-major.ts.net/webhook/menu');
  const responseData = await res.json();
  const rawItems = Array.isArray(responseData) ? responseData : (responseData.data || []);
  let currentCategory = 'All Treats';
  const parsedItems = [];
  
  rawItems.forEach((row, index) => {
    if (!row || typeof row !== 'object') return;
    if (row['col_2'] === 'Product Name' || row['col_3'] === 'Price (USD)') return;

    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      normalizedRow[key.toLowerCase().trim()] = row[key];
    });

    const getVal = (names) => {
      for (const name of names) {
        const n = name.toLowerCase().trim();
        if (normalizedRow[n] !== undefined && normalizedRow[n] !== null) {
          return normalizedRow[n];
        }
      }
      return '';
    };
    
    // Check what the actual keys are!
    if (index === 0 || index === 1) console.log("Keys: ", Object.keys(row));

    const firstColRaw = row['🍦 Chicago Ice Cream Truck — Menu & Prices'] || getVal(['#', 'id', 'col_1']);
    const nameRaw = row['col_2'] || getVal(['product name', 'name', 'col_2']);
    const priceRaw = row['col_3'] || getVal(['price', 'price (usd)', 'col_3']);
    
    const firstColStr = String(firstColRaw || '').trim();
    const nameStr = String(nameRaw || '').trim();
    const urlRaw = row['col_5'] || getVal(['image url', 'url', 'image', 'col_5']);
    
    console.log(`Row index: ${index}, nameStr: "${nameStr}", firstColStr: "${firstColStr}", rawPrice: "${priceRaw}", url: "${urlRaw}"`);
    
    if (firstColStr && firstColStr !== "Total: 24 products" && !nameStr && (!priceRaw || String(priceRaw).trim() === '')) {
      currentCategory = firstColStr;
      return;
    }
    
    if (!nameStr || nameStr === 'Product Name' || nameStr === 'undefined') return;
    
    parsedItems.push({ name: nameStr, category: currentCategory, url: urlRaw });
  });
  
  console.log(`Successfully parsed: ${parsedItems.length}`);
}
run();
