"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { useEffect, useState, useRef } from "react";

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

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`bg-white rounded-lg shadow-md border border-gray-100 flex flex-col cursor-pointer transform transition-all duration-700 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      onClick={openDetails}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.images.length > 1 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm md:text-base">
            {product.images.length} images
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        {/* Product Info */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
              {product.name}
            </h3>

            {/* Seller Info */}
            {seller && (
              <div className="tooltip tooltip-top" data-tip={seller.shopName}>
                <img
                  src={seller.profileImage}
                  alt={seller.shopName}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border cursor-pointer transition-transform duration-200 hover:scale-110"
                />
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-2">
            {product.discount > 0 ? (
              <>
                <p className="font-medium text-red-500 text-sm sm:text-base md:text-lg">
                  <span className="line-through text-gray-400 mr-1 sm:mr-2">
                    ৳{product.price}
                  </span>
                  <span>৳{(product.price - product.discount).toFixed(2)}</span>
                </p>
                <p className="text-green-600 text-xs sm:text-sm md:text-base">
                  You save: ৳{product.discount.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="font-medium text-red-500 text-sm sm:text-base md:text-lg">
                ৳{product.price.toFixed(2)}
              </p>
            )}
          </div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
            স্টক: {product.stock} ইউনিট
          </p>
        </div>

        {/* Add to Cart */}
        <div
          className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border rounded overflow-hidden text-black">
            <button
              onClick={decreaseQty}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm md:text-base"
            >
              -
            </button>
            <span className="px-3 py-1 border-x w-12 text-center text-xs sm:text-sm md:text-base">
              {quantity}
            </span>
            <button
              onClick={increaseQty}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm md:text-base"
            >
              +
            </button>
          </div>
          <button
            onClick={() => addToCart(product, quantity)}
            className="flex-1 sm:flex-none w-full px-4 sm:w-auto bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-xs sm:text-sm md:text-base"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
