"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

    const enhancedOrders = savedOrders.map((order) => {
      const itemsTotal = order.items.reduce((sum, item) => {
        const priceAfterDiscount =
          (item.price || 0) - (item.discount || 0);
        return sum + priceAfterDiscount * item.quantity;
      }, 0);

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

  // Cancel Order
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("আপনি কি নিশ্চিত অর্ডারটি বাতিল করতে চান?")) return;

    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "অর্ডার বাতিল করা সম্ভব হয়নি!");
        return;
      }

      const updatedOrders = orders.filter((o) => o.orderId !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("myOrders", JSON.stringify(updatedOrders));

      alert("অর্ডার সফলভাবে বাতিল হয়েছে!");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("একটি সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।");
    }
  };

  // Loading UI
  if (loading)
    return <p className="text-center mt-10">আপনার অর্ডার লোড হচ্ছে...</p>;

  // Empty state
  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        কোনো অর্ডার পাওয়া যায়নি।
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 text-center sm:text-left">
        🧾 আমার অর্ডারসমূহ
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-lg shadow p-5 border border-gray-200"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                অর্ডার আইডি: #{order.orderId}
              </h2>

              <span
                className={`px-3 py-1 rounded text-sm font-medium w-fit ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status === "pending"
                  ? "Pending (অপেক্ষমান)"
                  : order.status === "shipped"
                  ? "Shipped (পাঠানো হয়েছে)"
                  : "Delivered (ডেলিভারী সম্পন্ন)"}
              </span>
            </div>

            {/* Date */}
            <p className="text-sm text-gray-600 mb-1">
              তারিখ: {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* Summary Box */}
            <div className="bg-gray-50 rounded-lg p-4 mt-3 mb-4 border text-sm sm:text-base">
              <p className="text-gray-700">
                পণ্যের মূল্যঃ{" "}
                <span className="font-semibold text-gray-800">
                  ৳{order.itemsTotal.toFixed(2)}
                </span>
              </p>

              <p className="text-gray-700">
                ডেলিভারি চার্জঃ{" "}
                <span className="font-semibold text-gray-800">
                  ৳{order.deliveryTotal.toFixed(2)}
                </span>
              </p>

              <p className="text-xl font-bold text-red-600 mt-2">
                মোটঃ ৳{order.grandTotal.toFixed(2)}
              </p>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => {
                const priceAfterDiscount =
                  (item.price || 0) - (item.discount || 0);

                const discountPercentage = item.discount
                  ? Math.round((item.discount / item.price) * 100)
                  : 0;

                return (
                  <div
                    key={idx}
                    className="py-4 flex flex-col sm:flex-row justify-between gap-4 text-sm"
                  >
                    <div className="flex gap-3 items-start">
                      <img
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
                      />

                      <div>
                        <p className="font-medium text-gray-800 text-base">
                          {item.name}
                        </p>

                        {/* Quantity + Pricing */}
                        <p className="text-gray-600 mt-1">
                          পরিমাণ: {item.quantity} ×{" "}
                          {item.discount > 0 ? (
                            <>
                              <span className="line-through text-gray-400 mr-1">
                                ৳{item.price.toFixed(2)}
                              </span>
                              <span className="font-semibold text-gray-800">
                                ৳{priceAfterDiscount.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-gray-800">
                              ৳{item.price.toFixed(2)}
                            </span>
                          )}
                        </p>

                        {item.discount > 0 && (
                          <p className="text-green-600 text-xs sm:text-sm">
                            সেভ: ৳{item.discount.toFixed(2)} (
                            {discountPercentage}%)
                          </p>
                        )}

                        <p className="text-gray-600 text-sm">
                          ডেলিভারি চার্জ: ৳{item.deliveryCharge || 0}
                        </p>
                      </div>
                    </div>

                    {/* Item Status */}
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold w-fit ${
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

            {/* Cancel Button */}
            {order.status === "pending" && (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => handleDeleteOrder(order.orderId)}
                  className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm sm:text-base"
                >
                  ❌ অর্ডার বাতিল করুন
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
