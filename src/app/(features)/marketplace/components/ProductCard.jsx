"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { useEffect, useState, useRef } from "react";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [seller, setSeller] = useState(null);
  const cardRef = useRef();

  // Fetch seller only when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seller) {
            fetchSeller();
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

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col cursor-pointer"
      onClick={openDetails}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {product.images.length > 1 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            {product.images.length} images
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Product Info */}
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>

            {/* Seller Info */}
            {seller && (
              <div className="tooltip tooltip-top" data-tip={seller.shopName}>
                <img
                  src={seller.profileImage}
                  alt={seller.shopName}
                  className="w-6 h-6 rounded-full border cursor-pointer transition-transform duration-200 hover:scale-110"
                />
              </div>
            )}
          </div>

          <div className="mt-2">
            {product.discount > 0 ? (
              <>
                <p className="font-medium text-red-500">
                  <span className="line-through text-gray-400 mr-2">${product.price}</span>
                  <span>${(product.price - product.discount).toFixed(2)}</span>
                </p>
                <p className="text-green-600 text-sm">You save: ${product.discount.toFixed(2)}</p>
              </>
            ) : (
              <p className="font-medium text-red-500">${product.price.toFixed(2)}</p>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">Stock: {product.stock} units</p>
        </div>

        {/* Add to Cart */}
        <div
          className="mt-4 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="number"
            min="1"
            max={product.stock}
            defaultValue={1}
            id={`qty-${product._id}`}
            className="w-16 px-2 py-1 border rounded focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={() =>
              addToCart(
                product,
                Number(document.getElementById(`qty-${product._id}`).value)
              )
            }
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
