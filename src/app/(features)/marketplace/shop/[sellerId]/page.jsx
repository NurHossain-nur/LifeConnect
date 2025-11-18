"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "../../components/ProductGrid";
import Filters from "../../components/Filters";
// import Filters from "./components/Filters";

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

  // Fetch seller info
  useEffect(() => {
    async function fetchSeller() {
      const res = await fetch(`/api/marketplace/sellers/${sellerId}`);
      const data = await res.json();
      setSeller(data);
    }
    if (sellerId) fetchSeller();
  }, [sellerId]);

  // Fetch products for this seller
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`/api/marketplace/products?sellerId=${sellerId}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
      setLoading(false);
    }
    if (sellerId) fetchProducts();
  }, [sellerId]);

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

  if (!seller || loading) {
    return <p className="text-center mt-20 text-gray-500">Loading shop...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Shop Banner */}
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={seller.bannerImage || "https://via.placeholder.com/1200x300?text=Shop+Banner"}
          alt="Shop Banner"
          className="w-full h-full object-cover"
        />
        {/* Logo overlay */}
        <div className="absolute -bottom-12 left-10 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
          <img
            src={seller.profileImage}
            alt={seller.shopName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Shop Info */}
      <div className="mt-16 mb-6">
        <h1 className="text-3xl font-bold">{seller.shopName}</h1>
        <p className="text-gray-600 mt-2">{seller.description}</p>
        <p className="text-gray-500 mt-1">📞 {seller.phoneNumber}</p>
        <p className="text-gray-500">{seller.address}</p>
      </div>

      {/* Filters */}
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

      {/* Products */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
