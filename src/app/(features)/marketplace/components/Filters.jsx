export default function Filters({
  search, setSearch,
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  selectedTag, setSelectedTag,
  priceRange, setPriceRange,
  categories, brands, tags
}) {
  return (
    <div className="flex text-black flex-wrap justify-center gap-4 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400"
      />
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400">
        <option value="">All Categories</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400">
        <option value="">All Brands</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-red-400">
        <option value="">All Tags</option>
        {tags.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <div className="flex gap-2 items-center">
        <input type="number" placeholder="Min $" value={priceRange[0]}
               onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
               className="px-2 py-1 border rounded w-20 focus:ring-2 focus:ring-red-400"/>
        <span>-</span>
        <input type="number" placeholder="Max $" value={priceRange[1]}
               onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
               className="px-2 py-1 border rounded w-20 focus:ring-2 focus:ring-red-400"/>
      </div>
    </div>
  );
}
