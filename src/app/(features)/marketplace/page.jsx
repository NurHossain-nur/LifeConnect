"use client";

import { useState, useEffect, useMemo } from "react";
import ProductGrid from "./components/ProductGrid";
import Filters from "./components/Filters";

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/marketplace/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const tags = [...new Set(products.flatMap((p) => p.tags || []))];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedCategory || p.category === selectedCategory) &&
        (!selectedBrand || p.brand === selectedBrand) &&
        (!selectedTag || p.tags?.includes(selectedTag)) &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
      );
    });
  }, [products, search, selectedCategory, selectedBrand, selectedTag, priceRange]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Filters stay here */}
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

        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
