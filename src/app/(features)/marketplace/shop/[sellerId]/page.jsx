"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "../../components/ProductGrid";
import Filters from "../../components/Filters";

// Icons
const Icons = {
  Map: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Check: () => <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>,
  Filter: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Sort: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>,
  Empty: () => <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
};

export default function SellerShopPage() {
  const params = useParams();
  const sellerId = params.sellerId;

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch seller info
  useEffect(() => {
    async function fetchSeller() {
      try {
        const res = await fetch(`/api/marketplace/sellers/${sellerId}`);
        const data = await res.json();
        setSeller(data);
      } catch (e) { console.error(e); }
    }
    if (sellerId) fetchSeller();
  }, [sellerId]);

  // Fetch products for this seller
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/marketplace/products?sellerId=${sellerId}`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    if (sellerId) fetchProducts();
  }, [sellerId]);

  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const tags = [...new Set(products.flatMap((p) => p.tags || []))];

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

    // Apply Sorting
    if (sortBy === "price-low") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
        result.sort((a, b) => (b.createdAt || b._id) > (a.createdAt || a._id) ? 1 : -1);
    }

    return result;
  }, [products, search, selectedCategory, selectedBrand, selectedTag, priceRange, sortBy]);

  // --- Skeleton Loader ---
  if (!seller || loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
        {/* Banner Skeleton */}
        <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse relative">
            <div className="absolute -bottom-12 left-4 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full border-4 border-white"></div>
        </div>
        {/* Info Skeleton */}
        <div className="mt-16 mb-10 space-y-3 animate-pulse px-2">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
        </div>
        {/* Grid Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-1/4 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        {/* --- Shop Header Section --- */}
        <div className="bg-white border-b shadow-sm pb-6">
            <div className="max-w-7xl mx-auto px-4">
                {/* Banner Image */}
                <div className="relative w-full h-48 md:h-80 rounded-b-2xl overflow-hidden group">
                    <img
                        src={seller.bannerImage || "https://via.placeholder.com/1200x400?text=Shop+Banner"}
                        alt="Shop Banner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 px-4 -mt-12 md:-mt-16 relative z-10">
                    {/* Profile Image */}
                    <div className="relative">
                        <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                            <img
                                src={seller.profileImage || "/default-avatar.png"}
                                alt={seller.shopName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Verified Badge (Static for now) */}
                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Seller">
                            <Icons.Check />
                        </div>
                    </div>

                    {/* Shop Info Text */}
                    <div className="flex-1 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                            {seller.shopName}
                        </h1>
                        <p className="text-gray-600 mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
                            {seller.description || "Welcome to our official store. We provide high quality products."}
                        </p>
                        
                        {/* Contact Details */}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 font-medium">
                             {seller.phoneNumber && (
                                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                                    <Icons.Phone /> <span>{seller.phoneNumber}</span>
                                </div>
                             )}
                             {seller.address && (
                                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                                    <Icons.Map /> <span>{seller.address}</span>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Toolbar (Filter Toggle & Sort) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700"
                >
                    <Icons.Filter /> Filter Products
                </button>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-500 hidden md:block">Sort by:</span>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-green-500 cursor-pointer text-sm font-medium"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                           <Icons.Sort />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sticky Sidebar Filters */}
                <aside className={`w-full lg:w-1/4 lg:block ${showFilters ? 'block' : 'hidden'} transition-all`}>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                             <Icons.Filter />
                             <h3 className="font-bold text-gray-800">Filters</h3>
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

                {/* Product Grid */}
                <main className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Products</h2>
                        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">{filteredProducts.length} items</span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <ProductGrid products={filteredProducts} />
                    ) : (
                         // Empty State
                        <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200 flex flex-col items-center animate-fadeIn">
                            <Icons.Empty />
                            <h3 className="text-lg font-bold text-gray-800 mt-4">No products found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                            <button 
                                onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedBrand(""); setSelectedTag(""); }}
                                className="mt-4 text-green-600 font-medium hover:underline"
                            >
                                Clear all filters
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
                animation: fadeIn 0.5s ease-out forwards;
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #d1d5db;
                border-radius: 10px;
            }
        `}</style>
    </div>
  );
}