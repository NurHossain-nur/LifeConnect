"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

// Simplified Product Card
const ProductCard = ({ product, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const discount = product.discount || 0;
  const finalPrice = product.price - discount;
  const discountPercentage =
    discount > 0 ? Math.round((discount / product.price) * 100) : 0;

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 flex flex-col cursor-pointer transform transition-all duration-500 ease-out overflow-hidden h-full
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {/* Product Image */}
      <div className="relative w-full h-52 sm:h-60 bg-gray-50 overflow-hidden">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            -{discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg leading-tight line-clamp-2 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            ৳{finalPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through decoration-gray-400">
              ৳{product.price}
            </span>
          )}
        </div>

        <div className="text-xs sm:text-sm font-medium">
          {product.stock > 0 ? (
            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">
              Stock: {product.stock}
            </span>
          ) : (
            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* View Button */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
          <Link
            href={`/marketplace/product/${product._id}`}
            className="flex-1 h-9 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-sm transition-all active:scale-95 bg-red-600 text-white hover:bg-red-700 hover:shadow-md"
          >
            দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Featured Products Component
export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/marketplace/featured");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (error) {
        console.error("Failed to load featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="bg-red-100 p-2 rounded-lg text-red-600">
                <ShoppingBag size={28} />
              </span>
              Marketplace Highlights
            </h2>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl">
              Explore the latest additions to our community marketplace. Buy, sell, and connect.
            </p>
          </div>
          <a
            href="/marketplace"
            className="hidden md:flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard key={product._id} product={product} delay={index * 100} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No featured products available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-10 text-center md:hidden">
          <a
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-transform active:scale-95 shadow-lg shadow-red-200"
          >
            Visit Marketplace <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
