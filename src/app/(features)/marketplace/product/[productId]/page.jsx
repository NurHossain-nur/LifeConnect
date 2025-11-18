"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../CartContext";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
  const { productId } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [seller, setSeller] = useState(null); // <-- seller state

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/marketplace/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setMainImage(data.images[0]);

      // Fetch seller info
      const sellerRes = await fetch(`/api/marketplace/sellers/${data.sellerId}`);
      const sellerData = await sellerRes.json();
      setSeller(sellerData);
    }
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p className="text-center mt-20 text-red-600">Loading product...</p>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/marketplace/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: reviewName,
        comment: reviewComment,
        rating: reviewRating,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setProduct((prev) => ({
        ...prev,
        reviews: [data.review, ...(prev.reviews || [])],
      }));
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
      setCurrentPage(1);
    }
  };

  const averageRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length
    : 0;

  const paginatedReviews = (product.reviews || []).slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(
    (product.reviews?.length || 0) / reviewsPerPage
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Images */}
        <div>
          <img
            src={mainImage}
            className="w-full h-96 object-cover rounded-lg shadow"
          />
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded border cursor-pointer transition-transform hover:scale-105 ${
                  img === mainImage ? "border-red-500 ring-2 ring-red-400" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Average Rating */}
            {product.reviews?.length > 0 && (
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>
                    {i < Math.round(averageRating) ? "⭐" : "☆"}
                  </span>
                ))}
                <span className="text-gray-700 ml-1 text-sm">
                  ({product.reviews.length})
                </span>
              </div>
            )}
          </div>

          <p className="text-red-600 text-2xl font-semibold mt-5">
            ${product.price - (product.discount || 0)}
          </p>
          {product.discount > 0 && (
            <p className="text-green-600 mt-1">
              Discount: ${product.discount}
            </p>
          )}
          <p className="mt-3 text-gray-700">Stock: {product.stock} units</p>

          {/* Seller Info */}
          {seller && (
            <Link href={`/marketplace/shop/${product.sellerId}`} className="mt-4 flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <img
                src={seller.profileImage}
                alt={seller.shopName}
                className="w-10 h-10 rounded-full border transition-transform duration-200 hover:scale-110"
              />
              <p className="text-gray-700 font-medium">{seller.shopName}</p>
              <span className="text-blue-500 ml-1 text-sm">View Shop →</span>
            </Link>
          )}

          {/* Add to Cart */}
          <div className="mt-6 flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={handleAddToCart}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">⭐ Ratings & Reviews</h2>

        {!product.reviews?.length ? (
          <p className="mt-4 text-gray-500">No reviews yet.</p>
        ) : (
          <>
            <div className="mt-5 space-y-5">
              {paginatedReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow-sm bg-white"
                >
                  <p className="text-yellow-500 text-lg">
                    {"⭐".repeat(review.rating)}
                  </p>
                  <p className="font-medium mt-1">{review.name}</p>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1 ? "bg-gray-300" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Review Form */}
        <form
          onSubmit={handleReviewSubmit}
          className="mt-6 p-4 border rounded-lg bg-white"
        >
          <h3 className="font-semibold mb-2">Leave a Review</h3>
          <input
            type="text"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            placeholder="Your name"
            className="w-full border px-2 py-1 rounded mb-2"
            required
          />
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Your comment"
            className="w-full border px-2 py-1 rounded mb-2"
            required
          />
          <div className="flex items-center gap-1 mb-3">
            <span>Rating:</span>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <span
                key={star}
                onClick={() => setReviewRating(star)}
                className={`cursor-pointer text-2xl ${
                  star <= reviewRating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
