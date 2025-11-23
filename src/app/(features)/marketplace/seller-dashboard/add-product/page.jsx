"use client";

import { useState } from "react";

// Simple Icons
const Icons = {
  Image: () => <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
};

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
    sku: "",
    images: [],
    tags: "",
    discount: "",
    deliveryCharge: "",
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => form.append("images", file));
      } else {
        form.append(key, value);
      }
    });

    try {
      const res = await fetch("/api/marketplace/seller/upload-products", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ পণ্য সফলভাবে যোগ করা হয়েছে!");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          brand: "",
          sku: "",
          images: [],
          tags: "",
          discount: "",
          deliveryCharge: "",
        });
        setPreviewUrls([]);
      } else {
        alert("❌ ত্রুটি: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icons.Plus /> নতুন পণ্য যোগ করুন
          </h2>
          <p className="text-green-100 text-sm mt-1">
            আপনার পণ্য বাজারে যুক্ত করতে নিচের তথ্য পূরণ করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Product Name */}
              <div>
                <label className="label-text">পণ্যের নাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: স্মার্ট ঘড়ি, হেডফোন"
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="label-text">বিবরণ <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="পণ্যের বিস্তারিত বিবরণ..."
                  className="input-field resize-none"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text">ক্যাটেগরি <span className="text-red-500">*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-field cursor-pointer"
                  >
                    <option value="">ক্যাটেগরি নির্বাচন করুন</option>
                    <option value="electronics">ইলেকট্রনিক্স</option>
                    <option value="fashion">ফ্যাশন</option>
                    <option value="home">হোম & কিচেন</option>
                    <option value="beauty">বিউটি</option>
                    <option value="sports">স্পোর্টস</option>
                  </select>
                </div>

                <div>
                  <label className="label-text">ব্র্যান্ড</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="যেমন: Samsung, Nike"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Tags & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text">ট্যাগ / কীওয়ার্ড</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="যেমন: new, sale, gadget"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">SKU কোড</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="অনন্য পণ্য শনাক্তকারী"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Pricing */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">
                  মূল্য ও স্টক
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label-text">
                      মূল্য (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">ডিসকাউন্ট (৳)</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        className="input-field"
                      />
                    </div>
                     <div>
                      <label className="label-text">
                        স্টক <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">ডেলিভারি চার্জ (৳)</label>
                    <input
                      type="number"
                      name="deliveryCharge"
                      value={formData.deliveryCharge}
                      onChange={handleChange}
                      min="0"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">
                  পণ্যের ছবি <span className="text-red-500">*</span>
                </h3>
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white hover:border-green-500 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="group-hover:scale-110 transition-transform duration-200">
                      <Icons.Image />
                    </div>
                    <p className="mb-2 text-sm text-gray-500 group-hover:text-green-600">
                      <span className="font-semibold">ক্লিক করে ছবি আপলোড করুন</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4 animate-slideUp">
                    {previewUrls.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-300 shadow-sm">
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-all 
                ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800 hover:shadow-lg active:scale-95"}`}
            >
              {isSubmitting ? "আপলোড হচ্ছে..." : (
                <>
                  <Icons.Save /> পণ্য যোগ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Styles */}
      <style jsx>{`
        .label-text {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.375rem;
        }
        .input-field {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          outline: none;
          transition: all 0.2s ease-in-out;
          font-size: 0.95rem;
        }
        .input-field:focus {
          border-color: #15803d;
          box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
