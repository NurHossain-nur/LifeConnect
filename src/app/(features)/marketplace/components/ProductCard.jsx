"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { useEffect, useState, useRef } from "react";

// Icons
const Icons = {
  Plus: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Minus: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Cart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Image: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

export default function ProductCard({ product, delay = 0 }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [seller, setSeller] = useState(null);
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const cardRef = useRef();

  // Fetch seller and trigger animation when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!seller) fetchSeller();
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
  }, [seller]);

  const fetchSeller = async () => {
    const res = await fetch(`/api/marketplace/sellers/${product.sellerId}`);
    const data = await res.json();
    setSeller(data);
  };

  const openDetails = () => {
    router.push(`/marketplace/product/${product._id}`);
  };

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQty = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  // Calculate prices
  const discount = product.discount || 0;
  const finalPrice = product.price - discount;
  const discountPercentage = discount > 0 ? Math.round((discount / product.price) * 100) : 0;

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 flex flex-col cursor-pointer transform transition-all duration-500 ease-out overflow-hidden h-full
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      onClick={openDetails}
    >
      {/* Product Image Section */}
      <div className="relative w-full h-52 sm:h-60 bg-gray-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    -{discountPercentage}% OFF
                </span>
            )}
        </div>

        {product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Icons.Image /> {product.images.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        
        {/* Seller & Title */}
        <div>
            <div className="flex items-center gap-2 mb-2">
                {seller ? (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                        <img
                            src={seller.profileImage || "/default-avatar.png"}
                            alt={seller.shopName}
                            className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate max-w-[100px]">{seller.shopName}</span>
                    </div>
                ) : (
                    <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse"></div>
                )}
            </div>
            <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
                {product.name}
            </h3>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">৳{finalPrice.toFixed(2)}</span>
            {discount > 0 && (
                <span className="text-xs text-gray-400 line-through decoration-gray-400">৳{product.price}</span>
            )}
        </div>

        {/* Stock */}
        <div className="text-xs font-medium">
            {product.stock > 0 ? (
                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">স্টক: {product.stock}</span>
            ) : (
                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">আউট অফ স্টক</span>
            )}
        </div>

        {/* Actions Footer */}
        <div 
            className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()} // Prevent card click
        >
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-lg h-9 bg-white shadow-sm">
                <button
                    onClick={decreaseQty}
                    className="px-3 h-full text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors rounded-l-lg"
                >
                    <Icons.Minus />
                </button>
                <span className="px-2 text-sm font-semibold text-gray-700 min-w-[1.5rem] text-center">
                    {quantity}
                </span>
                <button
                    onClick={increaseQty}
                    className="px-3 h-full text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-colors rounded-r-lg"
                >
                    <Icons.Plus />
                </button>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-sm transition-all active:scale-95 ${
                    product.stock > 0 
                    ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                <Icons.Cart /> 
                <span className="hidden sm:inline">কার্টে যোগ করুন</span>
                <span className="sm:hidden">Add</span>
            </button>
        </div>
      </div>
    </div>
  );
}