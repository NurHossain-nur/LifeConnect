"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../CartContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductGrid from "../../components/ProductGrid";

export default function ProductDetailsPage() {
  const params = useParams();
  const { productId } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [seller, setSeller] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product and seller info
  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/marketplace/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setMainImage(data.images[0]);

      const sellerRes = await fetch(`/api/marketplace/sellers/${data.sellerId}`);
      const sellerData = await sellerRes.json();
      setSeller(sellerData);
    }
    fetchProduct();
  }, [productId]);


  // Fetch related products in the same category
useEffect(() => {
  async function fetchRelatedProducts() {
    if (!product?.category) return;

    const res = await fetch(`/api/marketplace/products?category=${encodeURIComponent(product.category)}&limit=7`);
    const data = await res.json();

    if (data.success) {
      const filtered = data.products.filter(p => String(p._id) !== String(product._id));
      setRelatedProducts(filtered);
    }
  }

  fetchRelatedProducts();
}, [product]);


  if (!product) {
    return <p className="text-center mt-20 text-red-600">Loading product...</p>;
  }

  const handleAddToCart = () => addToCart(product, quantity);

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

  const totalPages = Math.ceil((product.reviews?.length || 0) / reviewsPerPage);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Images */}
        <div>
          <img
            src={mainImage}
            className="w-full h-96 sm:h-[28rem] md:h-[32rem] object-cover rounded-lg shadow"
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
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>

          {/* Average Rating */}
          {product.reviews?.length > 0 && (
            <div className="flex items-center gap-1 text-yellow-500 mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < Math.round(averageRating) ? "⭐" : "☆"}</span>
              ))}
              <span className="text-gray-700 ml-2 text-sm">
                ({product.reviews.length})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-5 flex items-center gap-3">
            {product.discount > 0 ? (
              <>
                <p className="text-gray-400 text-lg sm:text-xl line-through">
                  ৳{product.price.toFixed(2)}
                </p>
                <p className="text-red-600 text-2xl sm:text-3xl font-semibold">
                  ৳{(product.price - product.discount).toFixed(2)}
                </p>
                <p className="text-green-600 text-sm sm:text-base">
                  You save: ৳{product.discount.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-red-600 text-2xl sm:text-3xl font-semibold">
                ৳{product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock & SKU */}
          <p className="mt-2 text-gray-700">
            স্টক: {product.stock} ইউনিট
          </p>
          <p className="text-gray-500 text-sm mt-1">SKU: {product.sku || "LOG-MX3-004"}</p>

          {/* Category & Brand */}
          <p className="text-gray-500 text-sm mt-1">Category: {product.category}</p>
          <p className="text-gray-500 text-sm mt-1">Brand: {product.brand}</p>

          {/* Description */}
          {product.description && (
            <p className="mt-4 text-gray-700 text-sm sm:text-base">{product.description}</p>
          )}

          {/* Seller Info */}
          {seller && (
            <Link
              href={`/marketplace/shop/${product.sellerId}`}
              className="mt-4 flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
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
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-base"
              >
                -
              </button>
              <span className="px-3 py-1 border-x w-14 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-base"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition w-full sm:w-auto text-center"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">⭐ Ratings & Reviews</h2>

        {!product.reviews?.length ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <>
            <div className="space-y-5">
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
              <div className="mt-4 flex gap-2 flex-wrap">
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

      {/* Related Products */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
}
