"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  // Delete or cancel an order
  const handleDeleteOrder = async (orderId) => {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    // Send delete request to backend
    const res = await fetch(`/api/marketplace/orders/${orderId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to cancel the order.");
      return;
    }

    // Remove from local state & localStorage
    const updatedOrders = orders.filter((order) => order.orderId !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem("myOrders", JSON.stringify(updatedOrders));

    alert("Order canceled successfully!");
  } catch (error) {
    console.error("Error canceling order:", error);
    alert("Something went wrong. Please try again.");
  }
};

  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;
  if (orders.length === 0)
    return <p className="text-center mt-10 text-gray-600">No orders found.</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">🧾 My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-lg shadow p-5 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Order #{order.orderId}
              </h2>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Total:{" "}
              <span className="font-semibold text-red-600">${order.total}</span>
            </p>

            {/* Products */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex justify-between items-center text-sm"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.product?.images?.[0] || "/no-image.png"}
                      alt={item.product?.name || item.name || "Product"}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.product?.name || item.name}
                      </p>
                      <p className="text-gray-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                      <p className="text-gray-500">
                        Delivery: ${item.deliveryCharge}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Cancel/Delete button */}
            {order.status === "pending" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDeleteOrder(order.orderId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
