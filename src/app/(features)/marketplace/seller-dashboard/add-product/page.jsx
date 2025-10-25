"use client";

import { useState } from "react";

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
    tags: "",           // ✅ new field
    discount: "",       // ✅ new field
    deliveryCharge: "", // ✅ new field
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("✅ Product added successfully!");
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
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong while uploading.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-6">➕ Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Nike, Samsung..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Price, Stock and Delivery Charge */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Delivery Charge ($)
            </label>
            <input
              type="number"
              name="deliveryCharge"
              value={formData.deliveryCharge}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Unique product identifier"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tags / Keywords
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. electronics, smartphone"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Discount ($)
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Product Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previewUrls.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
