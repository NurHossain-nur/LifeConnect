"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import EditProductModal from "./components/EditProductModal";

// Icons
const Icons = {
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
};

// ...imports remain the same

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace/seller/my-products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এটি ফেরত দিতে পারবেন না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে দিন!",
      cancelButtonText: "বাতিল করুন",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/marketplace/seller/my-products`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          Swal.fire("মুছে ফেলা হয়েছে!", "পণ্যটি সরানো হয়েছে।", "success");
        } else {
          Swal.fire("ত্রুটি!", data.message, "error");
        }
      } catch (err) {
        Swal.fire("ত্রুটি!", "মুছে ফেলা সম্ভব হয়নি।", "error");
      }
    }
  };

  const toggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/marketplace/seller/my-products`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p))
        );
        const toastMixin = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        toastMixin.fire({
            icon: 'success',
            title: `পণ্যটি ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 w-full p-4 md:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">আমার পণ্যসমূহ</h1>
           <p className="text-gray-500 text-sm mt-1">আপনার স্টক এবং মূল্যসমূহ পরিচালনা করুন</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="পণ্য অনুসন্ধান করুন..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Icons.Search />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-800">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-gray-500">নতুন পণ্য যোগ করুন বা অনুসন্ধান সংশোধন করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onDelete={deleteProduct}
              onToggle={toggleStatus}
              onEdit={setEditingProduct}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
            );
            setEditingProduct(null);
            Swal.fire("সফল!", "পণ্যটি সফলভাবে আপডেট হয়েছে", "success");
          }}
        />
      )}
      
      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// --- ProductCard & SkeletonCard remain same, but you can translate tooltips: ---
function ProductCard({ product, onDelete, onToggle, onEdit }) {
    const price = parseInt(product.price);
    const discount = parseInt(product.discount || 0);
    const finalPrice = price - discount;
    const hasDiscount = discount > 0;

    return (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in flex flex-col h-full">
            
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <Image 
                    src={product.images?.[0] || "/no-image.png"} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wide backdrop-blur-sm ${
                        product.status === 'active' 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-gray-500/90 text-white'
                    }`}>
                        {product.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                </div>

                {hasDiscount && (
                    <div className="absolute top-2 left-2">
                         <span className="px-2 py-1 text-xs font-bold rounded-md bg-red-500 text-white shadow-sm">
                            -৳{discount} ছাড়
                         </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    {product.category}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-2 line-clamp-2">
                    {product.name}
                </h3>

                <div className="mt-auto pt-2">
                    <div className="flex items-end gap-2 mb-2">
                         <span className="text-xl font-bold text-green-700">
                             ৳{finalPrice.toLocaleString()}
                         </span>
                         {hasDiscount && (
                             <span className="text-sm text-gray-400 line-through mb-1">
                                 ৳{price.toLocaleString()}
                             </span>
                         )}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 border-t pt-2 mb-4">
                        <span>স্টক: <span className={product.stock < 5 ? "text-red-500 font-bold" : "text-gray-700"}>{product.stock}</span></span>
                        <span>SKU: {product.sku || 'N/A'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <button 
                           onClick={() => onEdit(product)}
                           className="flex items-center justify-center gap-1 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                           title="সম্পাদনা"
                        >
                            <Icons.Edit /> 
                        </button>
                        
                        <button 
                           onClick={() => onToggle(product._id, product.status)}
                           className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-colors text-sm font-medium ${
                               product.status === 'active' 
                               ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                               : 'bg-green-50 text-green-600 hover:bg-green-100'
                           }`}
                           title={product.status === 'active' ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                        >
                            {product.status === 'active' ? <Icons.EyeOff /> : <Icons.Eye />}
                        </button>

                        <button 
                           onClick={() => onDelete(product._id)}
                           className="flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                           title="মুছে দিন"
                        >
                            <Icons.Trash />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse h-96 flex flex-col">
            <div className="h-40 bg-gray-200 rounded-lg mb-4 w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mt-auto mb-4"></div>
            <div className="flex gap-2 mt-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
            </div>
        </div>
    );
}