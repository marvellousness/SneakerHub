import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, Star, ShoppingBag, Heart, 
  X, Filter, RotateCcw, AlertCircle, Sparkles, Sliders 
} from 'lucide-react';
import { SneakerProduct } from '../types';

interface ProductListingViewProps {
  products: SneakerProduct[];
  selectedBrandFilter: string;
  selectedCategoryFilter: string;
  onSelectProduct: (id: string) => void;
  onToggleWishlist: (product: SneakerProduct) => void;
  wishlistIds: string[];
  onAddToCart: (product: SneakerProduct, size: number, color: any) => void;
}

export default function ProductListingView({
  products,
  selectedBrandFilter,
  selectedCategoryFilter,
  onSelectProduct,
  onToggleWishlist,
  wishlistIds,
  onAddToCart
}: ProductListingViewProps) {
  // Filters local State
  const [brand, setBrand] = useState(selectedBrandFilter === "All" ? "" : selectedBrandFilter);
  const [category, setCategory] = useState(selectedCategoryFilter === "All" ? "" : selectedCategoryFilter);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);
  const [sortBy, setSortBy] = useState('best'); // 'best' | 'price-low' | 'price-high' | 'rated'
  const [priceRange, setPriceRange] = useState<number>(300);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Sync state if selections change from external paths
  React.useEffect(() => {
    if (selectedBrandFilter !== "All" && ["Nike", "Adidas", "New Balance", "Puma", "Asics", "Reebok"].includes(selectedBrandFilter)) {
      setBrand(selectedBrandFilter);
      setCategory("");
    } else if (selectedBrandFilter !== "All" && ["Running", "Basketball", "Lifestyle", "Tennis"].includes(selectedBrandFilter)) {
      setCategory(selectedBrandFilter);
      setBrand("");
    } else if (selectedBrandFilter === "All") {
      setBrand("");
      setCategory("");
    }
  }, [selectedBrandFilter]);

  React.useEffect(() => {
    if (selectedCategoryFilter !== "All") {
      setCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  // Unique lists computed for filters panel
  const allBrands = ["Nike", "Adidas", "New Balance", "Puma", "Asics", "Reebok"];
  const allCategories = ["Running", "Basketball", "Lifestyle", "Tennis"];
  const allSizes = [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

  // Reset Filters logic
  const handleResetFilters = () => {
    setBrand("");
    setCategory("");
    setSelectedSize(null);
    setOnlyDiscounts(false);
    setPriceRange(300);
    setSortBy("best");
  };

  // Filtered and Sorted Products List computation
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by Brand
    if (brand) {
      result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // 2. Filter by Category
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Filter by Size availability
    if (selectedSize) {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // 4. Filter by Max Price
    result = result.filter(p => {
      const activePrice = p.discountPrice || p.price;
      return activePrice <= priceRange;
    });

    // 5. Filter by Discounts
    if (onlyDiscounts) {
      result = result.filter(p => p.discountPrice !== undefined);
    }

    // 6. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Best Sellers / Hot items top
      result.sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return b.reviewsCount - a.reviewsCount;
      });
    }

    return result;
  }, [products, brand, category, selectedSize, onlyDiscounts, sortBy, priceRange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (brand) count++;
    if (category) count++;
    if (selectedSize) count++;
    if (onlyDiscounts) count++;
    if (priceRange < 300) count++;
    return count;
  }, [brand, category, selectedSize, onlyDiscounts, priceRange]);

  return (
    <div id="product-listing-container" className="pb-24 overflow-y-auto h-full max-h-[calc(100vh-140px)] scrollbar-none px-4 bg-white">
      
      {/* 1. FILTER CONTROLLER HEADER */}
      <div id="filters-header-bar" className="flex items-center justify-between py-2.5 border-b border-slate-100 sticky top-0 bg-white z-20">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            id="open-filters-modal-btn"
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 select-none cursor-pointer"
          >
            <SlidersHorizontal size={12} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-black text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              id="reset-filters-shortcut"
              onClick={handleResetFilters}
              className="text-[10px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5"
            >
              <RotateCcw size={10} /> Clear
            </button>
          )}
        </div>

        {/* Short Sorting list */}
        <select
          id="sorting-dropdown-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5 leading-none focus:outline-none"
        >
          <option value="best">Best Match</option>
          <option value="price-low">Price: Low-High</option>
          <option value="price-high">Price: High-Low</option>
          <option value="rated">Top Rated</option>
        </select>
      </div>

      {/* ACTIVE CHIP SUMMARY */}
      {activeFiltersCount > 0 && (
        <div id="active-filter-chips" className="flex flex-wrap gap-1.5 py-2.5">
          {brand && (
            <span className="text-[10px] bg-slate-50 text-slate-800 font-bold px-2 py-1 rounded-full flex items-center gap-1 select-none border border-slate-100">
              {brand} <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => setBrand("")} />
            </span>
          )}
          {category && (
            <span className="text-[10px] bg-slate-50 text-slate-800 font-bold px-2 py-1 rounded-full flex items-center gap-1 select-none border border-slate-100">
              {category} <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => setCategory("")} />
            </span>
          )}
          {selectedSize && (
            <span className="text-[10px] bg-slate-50 text-slate-800 font-bold px-2 py-1 rounded-full flex items-center gap-1 select-none border border-slate-100">
              US {selectedSize} <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => setSelectedSize(null)} />
            </span>
          )}
          {onlyDiscounts && (
            <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-1 rounded-full flex items-center gap-1 select-none border border-orange-100">
              On Sale <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => setOnlyDiscounts(false)} />
            </span>
          )}
          {priceRange < 300 && (
            <span className="text-[10px] bg-slate-50 text-slate-800 font-bold px-2 py-1 rounded-full flex items-center gap-1 select-none border border-slate-100">
              &lt;=${priceRange} <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => setPriceRange(300)} />
            </span>
          )}
        </div>
      )}

      {/* 2. SNEAKERS GRID */}
      <div id="sneakers-listing-grid" className="py-2">
        {processedProducts.length === 0 ? (
          <div id="empty-filtered-state" className="py-12 text-center space-y-3">
            <AlertCircle size={40} className="text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No sneakers found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Try loosening your active filters, sliding budget price higher, or selecting another brand.</p>
            </div>
            <button
              id="empty-reset-filters-btn"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold shadow cursor-pointer active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {processedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col relative group shadow-xs hover:shadow-sm transition-all duration-300"
                >
                  {/* Hot or sale indicator tags */}
                  {product.discountPrice ? (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-orange-500 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      Sale
                    </span>
                  ) : product.isHot ? (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-black text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      Hot Drop
                    </span>
                  ) : null}

                  {/* Absolute Wishlist toggle button */}
                  <button
                    id={`list-wishlist-toggle-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-md transition-all active:scale-90 cursor-pointer"
                  >
                    <Heart size={14} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
                  </button>

                  {/* Thumbnail stage */}
                  <div 
                    onClick={() => onSelectProduct(product.id)}
                    className="w-full h-32 md:h-36 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center relative cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info details */}
                  <div className="pt-2.5 text-left flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] tracking-wider font-extrabold text-slate-450 block uppercase font-mono leading-none">
                        {product.brand} • {product.category}
                      </span>
                      <h4 
                        onClick={() => onSelectProduct(product.id)}
                        className="text-xs font-bold text-slate-800 line-clamp-1 py-1 leading-tight group-hover:text-black transition-colors cursor-pointer mt-1"
                      >
                        {product.name}
                      </h4>
                      
                      {/* Star and Review details */}
                      <div className="flex items-center gap-1 pt-0.5">
                        <div className="flex items-center text-amber-500">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-black text-slate-705 ml-0.5 leading-none">{product.rating}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">({product.reviewsCount})</span>
                      </div>

                      {/* Sizes listing dots preview */}
                      <div className="flex items-center gap-1 pt-1.5">
                        <span className="text-[8px] text-slate-450 uppercase font-mono font-bold shrink-0">Sizes:</span>
                        <div className="flex gap-0.5 overflow-hidden text-[8px] font-black text-slate-600 bg-slate-50 rounded px-1.5 max-w-[100px] truncate leading-none py-0.5 font-mono border border-slate-100">
                          {product.sizes.slice(0, 4).join(", ")}{product.sizes.length > 4 && "+"}
                        </div>
                      </div>

                      {/* Small visual color dots */}
                      <div className="flex gap-1 pt-1.5 items-center">
                        {product.colors.map((c, i) => (
                          <div 
                            key={i} 
                            style={{ backgroundColor: c.hex }} 
                            title={c.name}
                            className="w-2.5 h-2.5 rounded-full border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action panel footer */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                      <div className="flex flex-col">
                        {product.discountPrice ? (
                          <>
                            <span className="text-xs font-black text-slate-900 leading-none">${product.discountPrice.toFixed(2)}</span>
                            <span className="text-[9px] text-slate-400 line-through leading-none mt-0.5">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-xs font-black text-slate-900 leading-none">${product.price.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        id={`list-quick-add-${product.id}`}
                        onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
                        className="bg-black text-white rounded-lg p-2 hover:bg-slate-900 transition-all cursor-pointer shadow active:scale-95 flex items-center justify-center"
                        title="Add first size/color to cart"
                      >
                        <ShoppingBag size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. ABSOLUTE FILTER DRAWER PANEL DIALOG */}
      <AnimatePresence>
        {showFiltersModal && (
          <div id="filters-bg-overlay" className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
            {/* Click backdrop to exit */}
            <div className="absolute inset-0" onClick={() => setShowFiltersModal(false)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl w-full max-w-md p-5 !z-50 shadow-2xl relative text-left space-y-5 border-t border-slate-100"
            >
              {/* Header drawer controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <Filter size={16} />
                  <h4 className="text-xs font-black uppercase font-sans tracking-widest">Filter Sneakers</h4>
                </div>
                <button
                  id="close-filters-drawer"
                  onClick={() => setShowFiltersModal(false)}
                  className="p-1 text-slate-400 hover:text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* BRAND SELECTION PANEL */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider">Shoe Brands</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    id="filter-brand-all"
                    onClick={() => setBrand("")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      brand === "" ? "bg-black border-black text-white" : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Brands
                  </button>
                  {allBrands.map((b) => (
                    <button
                      id={`filter-brand-${b.toLowerCase()}`}
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        brand === b ? "bg-black border-black text-white" : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATEGORY SELECTION PANEL */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider font-sans">Category Scene</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    id="filter-category-all"
                    onClick={() => setCategory("")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      category === "" ? "bg-black border-black text-white" : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Actions
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      id={`filter-category-${cat.toLowerCase()}`}
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        category === cat ? "bg-black border-black text-white" : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZES RANGE PANEL */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider font-mono">US sneaker Size</span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {allSizes.map((sz) => (
                    <button
                      id={`filter-size-${String(sz).replace('.', '-')}`}
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                      className={`w-9 h-9 shrink-0 rounded-lg text-xs font-black border transition-all cursor-pointer font-mono ${
                        selectedSize === sz ? "bg-black border-black text-white" : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE RANGE LIMITER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block tracking-wider">Max Price Budget</span>
                  <span className="text-slate-900 font-mono font-bold">${priceRange} USD</span>
                </div>
                <input
                  id="filter-price-slider"
                  type="range"
                  min="90"
                  max="300"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-black bg-slate-100 rounded-lg h-2"
                />
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>Min: $90</span>
                  <span>Max: $300</span>
                </div>
              </div>

              {/* DISCOUNT TOGGLE BOX */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                <div className="text-left">
                  <span className="text-xs font-black text-slate-800 block uppercase tracking-tight">Only Discounted Shoes</span>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Exclude standard full-price items</p>
                </div>
                <input
                  id="filter-discount-toggle"
                  type="checkbox"
                  checked={onlyDiscounts}
                  onChange={(e) => setOnlyDiscounts(e.target.checked)}
                  className="w-4 h-4 rounded text-black accent-black cursor-pointer"
                />
              </div>

              {/* PANEL CTA SUBMISSION BUTTON */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  id="filter-reset-bottom-btn"
                  onClick={handleResetFilters}
                  className="flex-1 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold tracking-wide uppercase transition-all select-none cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  id="filter-apply-bottom-btn"
                  onClick={() => setShowFiltersModal(false)}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold tracking-wide uppercase shadow hover:bg-slate-900 transition-all select-none cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
