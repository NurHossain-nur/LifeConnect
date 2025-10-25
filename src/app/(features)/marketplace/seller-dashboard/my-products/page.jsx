"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditProductModal from "./components/EditProductModal";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ✅ Optimized delete
  const deleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
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
          // Remove product from local state instantly
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
          Swal.fire("Deleted!", "Product has been deleted.", "success");
        } else {
          Swal.fire("Error!", data.message, "error");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // ✅ Optimized toggle status
  const toggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const result = await Swal.fire({
      title: "Change Status?",
      text: `Do you want to mark this product as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/marketplace/seller/my-products`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, newStatus }),
        });
        const data = await res.json();
        if (data.success) {
          // Update product status in local state instantly
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === productId
                ? { ...product, status: newStatus }
                : product
            )
          );
          Swal.fire("Updated!", "Product status updated.", "success");
        } else {
          Swal.fire("Error!", data.message, "error");
        }
      } catch (err) {
        console.error("Error updating status:", err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const openEditModal = (product) => {
  setEditingProduct(product);
};

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (products.length === 0)
    return <p className="text-center mt-10 text-gray-600">No products found.</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">🛒 My Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              src={product.images[0] || "/no-image.png"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="mt-2 font-medium text-gray-800">
                ${product.price} + Delivery: ${product.deliveryCharge}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Stock: {product.stock} | SKU: {product.sku}
              </p>

              <span
                className={`inline-block mt-2 px-2 py-1 rounded text-sm font-medium ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {product.status}
              </span>

              <div className="flex gap-2 mt-4">

                <button
  onClick={() => openEditModal(product)}
  className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 transition"
>
  Edit
</button>
                <button
                  onClick={() => toggleStatus(product._id, product.status)}
                  className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
                >
                  {product.status === "active" ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      // ...inside component
{editingProduct && (
  <EditProductModal
    product={editingProduct}
    onClose={() => setEditingProduct(null)}
    onSave={(updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      setEditingProduct(null);
    }}
  />
)}
    </div>
  );
}
