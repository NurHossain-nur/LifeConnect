"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace/seller-orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, productId, productName, newStatus) => {
    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      html: `You’re about to mark <strong>${productName}</strong> as "<strong>${newStatus}</strong>".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (!confirmResult.isConfirmed) return;

    setUpdating(true);

    // Optimistic UI: update locally first
    setOrders((prev) =>
      prev.map((order) => {
        if (order._id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.productId === productId ? { ...item, status: newStatus } : item
          ),
          overallStatus:
            newStatus === "delivered"
              ? "delivered"
              : newStatus === "shipped"
              ? "shipped"
              : "pending",
        };
      })
    );

    try {
      const res = await fetch("/api/marketplace/seller-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId, newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        MySwal.fire({
          icon: "success",
          title: "Status Updated",
          html: `<strong>${productName}</strong> marked as "<strong>${newStatus}</strong>".`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchOrders(); // Refresh data from server
      } else {
        MySwal.fire("Error", data.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      MySwal.fire("Error", "Something went wrong!", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading seller orders...</p>;
  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">No orders yet.</p>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">📦 Seller Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow p-5 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Order #{order._id}
              </h2>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  order.overallStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.overallStatus === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.overallStatus}
              </span>
            </div>

            {/* Buyer Info */}
            <div className="mb-4 text-sm text-gray-700">
              <p>
                <strong>Buyer:</strong> {order.customer.name}
              </p>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p>
                <strong>Address:</strong> {order.customer.address}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer.phone}
              </p>
            </div>

            {/* Products */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.productInfo?.images?.[0] || "/no-image.png"}
                      alt={item.productInfo?.name || "Product"}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.productInfo?.name || "Unknown Product"}
                      </p>
                      <p className="text-gray-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                      <p className="text-gray-500">
                        Delivery: ${item.deliveryCharge}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      disabled={updating}
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          item.productId,
                          item.productInfo?.name || "Product",
                          e.target.value
                        )
                      }
                      className={`border rounded-md px-2 py-1 text-sm font-medium focus:outline-none ${
                        item.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                          : item.status === "shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : "bg-green-50 text-green-700 border-green-300"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
