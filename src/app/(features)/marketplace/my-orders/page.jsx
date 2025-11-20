"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

    // Compute totals for each order
    const enhancedOrders = savedOrders.map((order) => {
      const itemsTotal = order.items.reduce(
        (sum, item) => {
          const priceAfterDiscount = (item.price || 0) - (item.discount || 0);
          return sum + priceAfterDiscount * item.quantity;
        },
        0
      );

      const deliveryTotal = order.items.reduce(
        (sum, item) => sum + (item.deliveryCharge || 0),
        0
      );

      const grandTotal = itemsTotal + deliveryTotal;

      return {
        ...order,
        itemsTotal,
        deliveryTotal,
        grandTotal,
      };
    });

    setOrders(enhancedOrders);
    setLoading(false);
  }, []);

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to cancel the order.");
        return;
      }

      const updatedOrders = orders.filter((o) => o.orderId !== orderId);
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

            {/* Order Details */}
            <p className="text-sm text-gray-600 mb-1">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* Total Summary Section */}
            <div className="bg-gray-50 rounded-lg p-3 mt-3 mb-4 border">
              <p className="text-sm text-gray-700">
                Items Total:{" "}
                <span className="font-semibold text-gray-800">
                  ${order.itemsTotal.toFixed(2)}
                </span>
              </p>

              <p className="text-sm text-gray-700">
                Delivery Charges:{" "}
                <span className="font-semibold text-gray-800">
                  ${order.deliveryTotal.toFixed(2)}
                </span>
              </p>

              <p className="text-lg font-bold text-red-600 mt-2">
                Grand Total: ${order.grandTotal.toFixed(2)}
              </p>
            </div>

            {/* Products */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => {
  const priceAfterDiscount = (item.price || 0) - (item.discount || 0);
  const discountPercentage = item.discount
    ? Math.round((item.discount / item.price) * 100)
    : 0;

  return (
    <div
      key={idx}
      className="py-3 flex justify-between items-center text-sm"
    >
      <div className="flex gap-3 items-center">
        <img
          src={item.image || "/no-image.png"}
          alt={item.name || "Product"}
          className="w-16 h-16 object-cover rounded border"
        />

        <div>
          <p className="font-medium text-gray-800">{item.name}</p>

          <p className="text-gray-500">
            Qty: {item.quantity} ×{" "}
            {item.discount > 0 ? (
              <>
                <span className="line-through text-gray-400 mr-1">
                  ${item.price.toFixed(2)}
                </span>
                <span className="font-semibold text-gray-800">
                  ${priceAfterDiscount.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-gray-800">
                ${item.price.toFixed(2)}
              </span>
            )}
          </p>

          {item.discount > 0 && (
            <p className="text-green-600 text-sm">
              You save ${item.discount.toFixed(2)} ({discountPercentage}%)
            </p>
          )}

          <p className="text-gray-500">
            Delivery: ${item.deliveryCharge || 0}
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
  );
})}
            </div>

            {/* Cancel Order */}
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
