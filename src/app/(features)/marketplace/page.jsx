"use client";

import { useState, useEffect, useMemo } from "react";
import ProductGrid from "./components/ProductGrid";
import Filters from "./components/Filters";

// Icons
const Icons = {
  Filter: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Sort: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>,
  Empty: () => <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Reset: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
};

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]); // Increased default range
  
  // New Features State
  const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/marketplace/products");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived Data for Filters
  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const tags = [...new Set(products.flatMap((p) => p.tags || []))];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedCategory || p.category === selectedCategory) &&
        (!selectedBrand || p.brand === selectedBrand) &&
        (!selectedTag || p.tags?.includes(selectedTag)) &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
      );
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      // Assuming 'createdAt' or '_id' implies newness. using _id for basic timestamp check if date missing
      result.sort((a, b) => (b.createdAt || b._id) > (a.createdAt || a._id) ? 1 : -1);
    }

    return result;
  }, [products, search, selectedCategory, selectedBrand, selectedTag, priceRange, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedTag("");
    setPriceRange([0, 50000]);
    setSortBy("newest");
  };

  // --- Skeleton Loading Component ---
  if (loading) return (
    <div className="bg-gray-50 py-10 px-4 min-h-screen">
       <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block w-1/4 space-y-4">
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Grid Skeleton */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white rounded-xl h-80 border border-gray-100 p-4 animate-pulse">
                        <div className="h-40 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Showing {filteredProducts.length} results
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                    <Icons.Filter /> Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:border-green-500 transition-colors">
                        <Icons.Sort />
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent outline-none appearance-none cursor-pointer pr-4 font-medium"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start">
            
            {/* Filters Sidebar (Fixed on Big Screen) */}
            <aside className={`w-full lg:w-1/4 lg:block ${showFilters ? 'block' : 'hidden'} transition-all`}>
                {/* UPDATED: Added lg:sticky, lg:top-4, lg:max-h-[90vh] and lg:overflow-y-auto 
                   This makes it fixed on the screen while allowing internal scroll if filters are long 
                */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Icons.Filter /> Filters
                        </h3>
                        {(search || selectedCategory || selectedBrand || selectedTag) && (
                            <button 
                                onClick={resetFilters}
                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                            >
                                <Icons.Reset /> Clear All
                            </button>
                        )}
                    </div>
                    
                    <Filters
                        search={search}
                        setSearch={setSearch}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        categories={categories}
                        brands={brands}
                        tags={tags}
                    />
                </div>
            </aside>

            {/* Product Grid Area */}
            <main className="flex-1 w-full">
                {filteredProducts.length > 0 ? (
                    <ProductGrid products={filteredProducts} />
                ) : (
                    // Empty State
                    <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300 flex flex-col items-center animate-fadeIn">
                        <Icons.Empty />
                        <h3 className="text-lg font-bold text-gray-800 mt-4">No products found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            We couldn't find any products matching your filters. Try adjusting your search or clearing filters.
                        </p>
                        <button 
                            onClick={resetFilters}
                            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </main>
        </div>

      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        /* Custom scrollbar for the filter section if it gets too long */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}