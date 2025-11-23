"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Icons for a professional look
const Icons = {
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Upload: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
};

export default function EditProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    category: product.category || "",
    brand: product.brand || "",
    price: product.price || 0,
    stock: product.stock || 0,
    sku: product.sku || "",
    images: product.images || [], 
    deliveryCharge: product.deliveryCharge || 0,
    tags: product.tags || [],
    discount: product.discount || 0,
    status: product.status || "inactive",
    newImages: [], 
  });

  const [previewUrls, setPreviewUrls] = useState(formData.images || []);
  const [isSaving, setIsSaving] = useState(false);

  // Scroll to top when modal opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : name === "tags"
          ? value.split(",").map((tag) => tag.trim())
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if(files.length === 0) return;
    
    setFormData((prev) => ({ ...prev, newImages: [...prev.newImages, ...files] }));

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...urls]);
  };

  const removePreview = (index) => {
    const updatedPreviews = [...previewUrls];
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);

    if (index < formData.images.length) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      const newIndex = index - formData.images.length;
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== newIndex),
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("productId", product._id);
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("brand", formData.brand);
      payload.append("price", formData.price);
      payload.append("stock", formData.stock);
      payload.append("sku", formData.sku);
      payload.append("deliveryCharge", formData.deliveryCharge);
      payload.append("discount", formData.discount);
      payload.append("status", formData.status);
      payload.append("tags", formData.tags.join(","));

      formData.images.forEach((url) => payload.append("existingImages", url));
      formData.newImages.forEach((file) => payload.append("newImages", file));

      const res = await fetch("/api/marketplace/seller/edit-product", {
        method: "PUT",
        body: payload,
      });

      const data = await res.json();
      if (data.success) {
        onSave(data.updatedProduct);
        onClose();
        Swal.fire("Success", "Product updated successfully!", "success");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
    <div className="flex min-h-screen items-start sm:items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl sm:h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
            <p className="text-xs text-gray-500">Update product details and inventory</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-gray-50/50">
          
          {/* Image Section */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Product Images</label>
            <div className="flex flex-wrap gap-4">
              {/* Existing/New Previews */}
              {previewUrls.map((url, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group">
                <div className="text-gray-400 group-hover:text-green-500"><Icons.Upload /></div>
                <span className="text-[10px] text-gray-500 mt-1 font-medium">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Full Width Inputs */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="label-text">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Ex: Wireless Headphones" />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="label-text">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Product details..." />
            </div>

            {/* General Info */}
            <div>
              <label className="label-text">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label-text">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label-text">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field cursor-pointer">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="label-text">Price ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" />
                </div>
                <div>
                    <label className="label-text">Discount ($)</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="input-field" />
                </div>
                <div>
                    <label className="label-text">Stock Qty</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input-field" />
                </div>
            </div>

            {/* Logistics */}
            <div>
              <label className="label-text">Delivery Charge ($)</label>
              <input type="number" name="deliveryCharge" value={formData.deliveryCharge} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label-text">SKU Code</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="input-field" />
            </div>

            {/* Tags */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="label-text">Tags <span className="text-gray-400 font-normal text-xs">(comma separated)</span></label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="input-field" placeholder="gadget, new, sale" />
            </div>

          </div>
        </div>

        {/* --- Footer --- */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Saving...
               </span>
            ) : (
                <>
                 <Icons.Save /> Save Changes
                </>
            )}
          </button>
        </div>
      </div>

      {/* --- Custom CSS for clean Inputs --- */}
      <style jsx>{`
        .label-text {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151; /* gray-700 */
          margin-bottom: 0.25rem;
        }
        .input-field {
          width: 100%;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          outline: none;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }
        .input-field:focus {
          border-color: #16a34a; /* green-600 */
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
    </div>
  );
}