import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, ZoomIn, AlertCircle } from 'lucide-react';
import { ASSETS } from '@/src/assets';
import Papa from 'papaparse';

interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  url: string;
  available: boolean;
}

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Securely fetch menu data via n8n webhook
        const menuUrl = 'https://home.tiffany-major.ts.net/webhook/menu';
        
        const response = await fetch(menuUrl);
        if (!response.ok) throw new Error('Failed to fetch menu data');
        
        const responseData = await response.json();
        
        // n8n Google Sheets node usually returns an array of objects
        const rawItems = Array.isArray(responseData) ? responseData : (responseData.data || []);
        console.log('Raw n8n data:', rawItems);
        
        const parsedItems: MenuItem[] = rawItems.map((row: any, index: number) => {
          // Skip the first row if it's clearly the header row itself (often happens with custom headers in n8n)
          if (row['col_2'] === 'Product Name' || row['col_3'] === 'Price (USD)') return null;

          // Normalize keys to lowercase and trimmed for easier matching
          const normalizedRow: any = {};
          if (row && typeof row === 'object') {
            Object.keys(row).forEach(key => {
              normalizedRow[key.toLowerCase().trim()] = row[key];
            });
          }

          const getVal = (names: string[]) => {
            for (const name of names) {
              const n = name.toLowerCase().trim();
              if (normalizedRow[n] !== undefined && normalizedRow[n] !== null) {
                return normalizedRow[n];
              }
            }
            return '';
          };
          
          // Use exact exact columns from the n8n test, falling back to name searches
          // 🍦 Chicago Ice Cream Truck — Menu & Prices -> ID (#)
          // col_2 -> Product Name
          // col_3 -> Price (USD)
          // col_4 -> Ingredients (Description)
          // col_5 -> Image URL
          
          const rawPrice = String(row['col_3'] || getVal(['price', 'price (usd)', 'col_3']));
          const cleanPrice = rawPrice.replace(/[$\s,]/g, '').trim();

          const rawAvailable = String(row['available'] || getVal(['available', 'in stock'])).toLowerCase().trim();
          const isAvailable = rawAvailable === 'yes' || rawAvailable === 'true' || rawAvailable === '1' || rawAvailable === '' || rawAvailable === 'undefined';

          return {
            id: String(row['🍦 Chicago Ice Cream Truck — Menu & Prices'] || getVal(['#', 'id', 'col_1'])).trim() || `item-${index}`,
            category: String(row['category'] || getVal(['category'])).trim() || 'All Treats',
            name: String(row['col_2'] || getVal(['product name', 'name', 'col_2'])).trim(),
            description: String(row['col_4'] || getVal(['ingredients', 'description', 'col_4'])).trim(),
            price: cleanPrice,
            url: String(row['col_5'] || getVal(['image url', 'url', 'image', 'col_5'])).trim(),
            available: isAvailable
          };
        }).filter((item: any) => item && item.name && item.name !== 'Product Name'); // filter empties and headers
        
        console.log('Parsed items:', parsedItems);
        setItems(parsedItems);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
        setError('Failed to load menu. Please check your connection or ensure the n8n webhook is active.');
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-pink-500 font-bold uppercase tracking-widest text-sm mb-4 block">Our Selection</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">The Sweet Menu</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            From classic character pops to refreshing beverages, we've got something for everyone.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Fetching latest treats...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white rounded-[3rem] shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-slate-500">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No menu items found. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-20">
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-3xl font-black text-slate-900 mb-10 pb-4 border-b-4 border-pink-500 inline-block">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.filter(item => item.category === category).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                    >
                      <div 
                        className="h-64 overflow-hidden relative cursor-pointer"
                        onClick={() => setSelectedImage(item.url || ASSETS.placeholder_treat)}
                      >
                        <img
                          src={item.url ? `https://images.weserv.nl/?url=${encodeURIComponent(item.url)}` : ASSETS.placeholder_treat}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ASSETS.placeholder_treat;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="text-white w-10 h-10" />
                        </div>
                        {!item.available && (
                          <div className="absolute top-4 right-4 bg-slate-900/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                          <span className="text-pink-500 font-black text-lg">${item.price}</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                          {item.description}
                        </p>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          ID: {item.id}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>
              <img
                src={selectedImage ? `https://images.weserv.nl/?url=${encodeURIComponent(selectedImage)}` : ASSETS.placeholder_treat}
                alt="Selected item"
                className="w-full h-auto max-h-[80vh] object-contain bg-slate-50"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
