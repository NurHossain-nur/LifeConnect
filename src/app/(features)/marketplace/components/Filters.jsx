import { useEffect, useState } from "react";

export default function Filters({
  search, setSearch,
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  selectedTag, setSelectedTag,
  priceRange, setPriceRange,
  categories, brands, tags
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Helper function for animation classes with delay
  const getAnimationClass = (delay) => ({
    className: `transition-all duration-700 ease-in-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
    style: { transitionDelay: `${delay}ms` }
  });

  return (
    <div className="flex flex-col gap-3 mb-6 px-2 sm:px-0 text-black">
      
      {/* Line 1: Search */}
      <div 
      className={`w-full ${getAnimationClass(100).className}`}
      style={getAnimationClass(100).style}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="পণ্য খুঁজুন..."
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400 text-xs sm:text-sm md:text-base"
        />
      </div>

      {/* Line 2: Category, Brand, Tag */}
      <div 
      className={`flex flex-wrap justify-center gap-2 sm:gap-4 ${getAnimationClass(300).className}`}
      style={getAnimationClass(300).style}
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400 text-xs sm:text-sm md:text-base w-full sm:w-auto"
        >
          <option value="">সকল ক্যাটেগরি</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400 text-xs sm:text-sm md:text-base w-full sm:w-auto"
        >
          <option value="">সকল ব্র্যান্ড</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400 text-xs sm:text-sm md:text-base w-full sm:w-auto"
        >
          <option value="">সকল ট্যাগ</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Line 3: Price Range */}
      <div 
      className={`flex flex-col items-center gap-1 ${getAnimationClass(500).className}`}
      style={getAnimationClass(500).style}
      >
        <span className="text-xs sm:text-sm md:text-base font-semibold">মূল্য সীমা (৳)</span>
        <div className="flex gap-2 items-center justify-center">
          <input
            type="number"
            placeholder="নূন্যতম"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="px-2 py-1 border rounded w-20 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-red-400"
          />
          <span className="text-xs sm:text-sm md:text-base">-</span>
          <input
            type="number"
            placeholder="সর্বাধিক"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="px-2 py-1 border rounded w-20 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>
    </div>
  );
}
