// Written by Brian McCarthy
import { useState, useEffect } from 'react';
import { ShoppingCart, Store, ChevronRight, Package, ListChecks, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState('');
  const [priceMessage, setPriceMessage] = useState('');
  const [allPrices, setAllPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce logic for search field
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setError(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Unable to fetch products list from server');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Unable to fetch product details. Please ensure the backend microservice is active.');
      console.error('Error fetching products:', err);
    }
  };

  const handleProductChange = async (productName) => {
    setSelectedProduct(productName);
    setSelectedDealer('');
    setPriceMessage('');
    setAllPrices([]);
    setError(null);
    
    if (!productName) {
      setDealers([]);
      return;
    }

    try {
      const response = await fetch(`/api/products/${productName}`);
      if (!response.ok) throw new Error('Product details found but could not be retrieved');
      const data = await response.json();
      setDealers(data.Dealers || []);
    } catch (err) {
      setError('Failed to retrieve specific product information from the microservice.');
      console.error('Error fetching product details:', err);
    }
  };

  const handleDealerChange = async (dealer) => {
    setSelectedDealer(dealer);
    setPriceMessage('');
    setAllPrices([]);
    setError(null);

    if (!dealer || !selectedProduct) return;

    setLoading(true);
    try {
      if (dealer === 'all') {
        const response = await fetch(`/api/allprice/${selectedProduct}`);
        if (!response.ok) throw new Error('Batch pricing request failed');
        const data = await response.json();
        if (data.prices) {
          setAllPrices(data.prices);
        } else {
          setPriceMessage(data.message);
        }
      } else {
        const response = await fetch(`/api/price/${dealer}/${selectedProduct}`);
        if (!response.ok) throw new Error('Individual pricing request failed');
        const data = await response.json();
        setPriceMessage(data.message);
      }
    } catch (err) {
      setError('Failed to retrieve pricing information. The pricing microservice might be offline.');
      console.error('Error fetching price:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on debounced search term
  const filteredProducts = products.filter(p => 
    p.product.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      {/* Header / Navbar */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">CNB</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CheckNBuy</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Microservice Deployment Hub</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="status-dot online"></span>
            <span className="text-[11px] font-mono text-slate-300">PROD_LIST:3000</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="status-dot online"></span>
            <span className="text-[11px] font-mono text-slate-300">PRICING:3000</span>
          </div>
          <button 
            onClick={fetchProducts}
            className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 p-4 sm:p-8 overflow-hidden">
        {/* Search Sidebar */}
        <aside className="md:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 flex flex-col">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" /> SEARCH FILTERS
            </h2>
            
            <div className="space-y-5">
              {/* Product Search Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Type to filter..."
                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">1. Select Product</label>
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  disabled={products.length === 0}
                >
                  <option value="">Choose a product...</option>
                  {filteredProducts.map((p) => (
                    <option key={p.product} value={p.product}>{p.product}</option>
                  ))}
                  {filteredProducts.length === 0 && searchTerm && (
                    <option disabled>No matches found</option>
                  )}
                </select>
                {searchTerm && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                )}
              </div>

              <AnimatePresence>
                {selectedProduct && !error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[11px] font-bold text-slate-500 uppercase">2. Distribution Dealer</label>
                    <select 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all"
                      value={selectedDealer}
                      onChange={(e) => handleDealerChange(e.target.value)}
                    >
                      <option value="">Choose a dealer...</option>
                      <option value="all" className="font-bold text-blue-600">--- All Registered Dealers ---</option>
                      {dealers.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                <h3 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1">
                  <Store className="w-3 h-3" /> Microservice Sync
                </h3>
                <p className="text-[11px] text-blue-600 leading-tight">
                  JavaScript-native execution. Error-aware handlers active.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard Content */}
        <section className="md:col-span-8 flex flex-col gap-6 h-full min-h-[500px]">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-slate-100 p-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <ListChecks className="w-6 h-6 text-blue-600" />
                  Pricing Analysis Dashboard
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedProduct ? (
                    <>Displaying current market rates for <span className="font-semibold text-slate-700 underline">{selectedProduct}</span></>
                  ) : (
                    "Please select a product model to begin analysis"
                  )}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Last Sync</span>
                <span className="text-sm font-mono font-bold text-slate-700">
                  {new Date().toISOString().replace('T', ' ').split('.')[0]}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8 relative">
              <AnimatePresence mode="wait">
                {error ? (
                   <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4"
                  >
                    <div className="bg-red-50 p-4 rounded-full border border-red-100">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800">Connection Error</h3>
                      <p className="text-sm text-slate-500 max-w-sm">{error}</p>
                    </div>
                    <button 
                      onClick={fetchProducts}
                      className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Retry Connection
                    </button>
                  </motion.div>
                ) : loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px]"
                  >
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Polling Servers...</p>
                  </motion.div>
                ) : priceMessage || allPrices.length > 0 ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    {priceMessage && (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm shadow-blue-100/50">
                          <Store className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {priceMessage}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <span className="status-dot online"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Supplier Quote</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {allPrices.length > 0 && (
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="py-4 px-2">Dealer Identity</th>
                            <th className="py-4 px-2">Region</th>
                            <th className="py-4 px-2">Stock Status</th>
                            <th className="py-4 px-2 text-right">Dealer Quote</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                          {allPrices.map((item, idx) => (
                            <motion.tr 
                              key={item.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                            >
                              <td className="py-4 px-2 font-bold text-slate-900">{item.key}</td>
                              <td className="py-4 px-2 text-slate-500">Global Distribution</td>
                              <td className="py-4 px-2">
                                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase">In Stock</span>
                              </td>
                              <td className="py-4 px-2 text-right font-mono text-blue-600 font-bold text-lg">{item.value}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                        <Package className="w-10 h-10 text-slate-200" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Waiting for Input</h3>
                        <p className="text-sm text-slate-400 max-w-[280px]">Apply search filters to view distributed network pricing data.</p>
                     </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-slate-500 font-medium">
                {allPrices.length > 0 ? `Displaying ${allPrices.length} distributed dealer quotes` : "Monitoring 2 backend services"}
              </div>
              <div className="flex gap-4 items-center">
                <div className="hidden sm:flex items-center gap-2">
                   <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-3/4"></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Load: Stable</span>
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded border border-blue-100">System Live</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 px-8 py-3 flex flex-col sm:flex-row justify-between items-center text-[10px] font-medium text-slate-400 uppercase tracking-tighter gap-2">
        <div className="flex gap-4">
          <span>System: 1.0.3-JS-DEPLOYED</span>
          <span>Environment: Production-CodeEngine</span>
          <span>Auth: Session-Active</span>
        </div>
        <div>&copy; 2026 CheckNBuy Microservices Infrastructure</div>
      </footer>
    </div>
  );
}
