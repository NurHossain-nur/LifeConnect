"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

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
    newImages: [], // for uploading new images
  });

  const [previewUrls, setPreviewUrls] = useState(formData.images || []);

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
    setFormData((prev) => ({ ...prev, newImages: files }));

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...formData.images, ...urls]);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("productId", product._id);
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("brand", formData.brand);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("sku", formData.sku);
      form.append("deliveryCharge", formData.deliveryCharge);
      form.append("discount", formData.discount);
      form.append("status", formData.status);
      form.append("tags", JSON.stringify(formData.tags));
      formData.newImages.forEach((file) => form.append("images", file));

      const res = await fetch("/api/marketplace/seller/edit-product", {
        method: "PUT",
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire("Updated!", "Product info updated successfully.", "success");
        onSave(data.updatedProduct);
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const removePreview = (index) => {
    const updatedImages = [...previewUrls];
    updatedImages.splice(index, 1);
    setPreviewUrls(updatedImages);

    // Also remove from original images if removing old ones
    if (index < formData.images.length) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // Removing new images
      const newImageIndex = index - formData.images.length;
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== newImageIndex),
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Product</h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Price, Stock, Discount */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Discount ($)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Delivery Charge & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Delivery Charge ($)</label>
              <input
                type="number"
                name="deliveryCharge"
                value={formData.deliveryCharge}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(", ")}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt={`preview-${i}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
