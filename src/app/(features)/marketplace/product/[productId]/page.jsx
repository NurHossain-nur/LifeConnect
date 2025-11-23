"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../CartContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductGrid from "../../components/ProductGrid";

// Icons
const Icons = {
  Star: ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Cart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Check: () => <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

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

  // --- Skeleton Loading UI ---
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="w-full h-96 bg-gray-200 rounded-xl"></div>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>)}
            </div>
          </div>
          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
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
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fadeIn">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-[24rem] sm:h-[28rem] md:h-[32rem] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    img === mainImage ? "border-green-600 ring-2 ring-green-100" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
               <span className="bg-gray-100 px-2 py-1 rounded uppercase font-medium tracking-wide">{product.category}</span>
               <span>•</span>
               <span className="font-medium text-gray-700">{product.brand}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icons.Star key={i} filled={i < Math.round(averageRating)} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price Block */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                <div className="flex items-end gap-3">
                    {product.discount > 0 ? (
                        <>
                        <p className="text-3xl font-bold text-red-600">৳{(product.price - product.discount).toFixed(2)}</p>
                        <p className="text-lg text-gray-400 line-through mb-1">৳{product.price.toFixed(2)}</p>
                        <span className="mb-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            SAVE ৳{product.discount.toFixed(2)}
                        </span>
                        </>
                    ) : (
                        <p className="text-3xl font-bold text-green-700">৳{product.price.toFixed(2)}</p>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="prose text-gray-600 text-sm mb-8 leading-relaxed">
                {product.description}
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="flex flex-col">
                    <span className="text-gray-400">SKU</span>
                    <span className="font-medium text-gray-800">{product.sku || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-400">Stock</span>
                    <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock > 0 ? `${product.stock} Units Available` : "Out of Stock"}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t pt-6">
                <div className="flex items-center border border-gray-300 rounded-lg h-12 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 hover:bg-gray-100 h-full transition text-xl text-gray-600">-</button>
                    <input 
                        type="text" 
                        readOnly 
                        value={quantity} 
                        className="w-12 text-center font-semibold text-gray-800 outline-none border-x border-gray-300 h-full" 
                    />
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 hover:bg-gray-100 h-full transition text-xl text-gray-600">+</button>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 h-12 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                        product.stock > 0 
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    <Icons.Cart /> Add to Cart
                </button>
            </div>
          </div>
        </div>

        {/* Seller Info Card */}
        {seller && (
            <div className="mt-8 bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <img
                        src={seller.profileImage || "/default-avatar.png"}
                        alt={seller.shopName}
                        className="w-14 h-14 rounded-full border-2 border-gray-100 object-cover"
                    />
                    <div>
                        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-1">
                            {seller.shopName} <Icons.Check />
                        </h4>
                        <p className="text-xs text-gray-500">Verified Seller</p>
                    </div>
                </div>
                <Link href={`/marketplace/shop/${product.sellerId}`} className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition">
                    Visit Shop
                </Link>
            </div>
        )}

        {/* Reviews & Ratings Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Review List */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Reviews & Ratings</h2>
                
                {!product.reviews?.length ? (
                    <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedReviews.map((review, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                                            {review.name.charAt(0)}
                                        </div>
                                        <p className="font-semibold text-gray-800">{review.name}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex text-yellow-400 text-sm mb-2">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Icons.Star key={i} filled={i < review.rating} />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                                            currentPage === i + 1 
                                            ? "bg-green-600 text-white" 
                                            : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Review Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className={`text-2xl transition-transform hover:scale-110 ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                            <input
                                type="text"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Review</label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                rows={4}
                                placeholder="Share your thoughts..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-16 border-t pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
                <ProductGrid products={relatedProducts} />
            </div>
        )}

      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}