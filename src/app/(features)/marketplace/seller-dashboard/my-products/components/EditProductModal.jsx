"use client";

import { useState } from "react";
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
    images: product.images?.join("\n") || "",
    deliveryCharge: product.deliveryCharge || 0,
    tags: product.tags?.join(", ") || "",
    discount: product.discount || 0,
    status: product.status || "inactive",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/marketplace/seller/edit-product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          ...formData,
          images: formData.images.split("\n"),
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }),
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <div className="grid gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="Images (one URL per line)"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="deliveryCharge"
            value={formData.deliveryCharge}
            onChange={handleChange}
            placeholder="Delivery Charge"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount"
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
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
