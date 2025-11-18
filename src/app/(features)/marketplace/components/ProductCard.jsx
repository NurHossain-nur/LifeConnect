"use client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, addToCart }) {
  const router = useRouter();

  const openDetails = () => {
    router.push(`/marketplace/product/${product._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col cursor-pointer"
      onClick={openDetails}
    >
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>

          <p className="text-red-500 font-medium mt-2">
            ${product.price - (product.discount || 0)}
          </p>

          {product.discount > 0 && (
            <p className="text-green-600 text-sm">Discount: ${product.discount}</p>
          )}

          <p className="text-gray-600 text-sm mt-1">Stock: {product.stock} units</p>
        </div>

        {/* Add to cart section - stop bubbling click */}
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
