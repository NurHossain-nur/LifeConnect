"use client";

import { useEffect, useState } from "react";

// Icons
const Icons = {
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Date: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Empty: () => <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage (Logic Unchanged)
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

    // Simulate a small delay to show animation (optional, purely for UX)
    setTimeout(() => {
        setOrders(enhancedOrders);
        setLoading(false);
    }, 600);
  }, []);

  // Cancel Order (Logic Unchanged)
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("আপনি কি নিশ্চিত অর্ডারটি বাতিল করতে চান?")) return;

    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "অর্ডার বাতিল করা সম্ভব হয়নি!");
        return;
      }

      const updatedOrders = orders.filter((o) => o.orderId !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("myOrders", JSON.stringify(updatedOrders));

      alert("অর্ডার সফলভাবে বাতিল হয়েছে!");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("একটি সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।");
    }
  };

  // --- Loading Skeleton UI ---
  if (loading)
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8 mx-auto sm:mx-0"></div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5 border border-gray-100 animate-pulse">
            <div className="flex justify-between mb-4">
               <div className="h-6 w-32 bg-gray-200 rounded"></div>
               <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
               <div className="h-16 w-full bg-gray-100 rounded"></div>
               <div className="h-16 w-full bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );

  // --- Empty State UI ---
  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fadeIn">
        <Icons.Empty />
        <h3 className="text-xl font-semibold text-gray-800 mt-4">কোনো অর্ডার পাওয়া যায়নি</h3>
        <p className="text-gray-500 mt-2">আপনি এখনও কোনো অর্ডার করেননি।</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 min-h-screen bg-gray-50">
      <div className="flex items-center gap-2 mb-8 justify-center sm:justify-start">
        <span className="text-red-600 bg-red-100 p-2 rounded-lg"><Icons.Box /></span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          আমার অর্ডারসমূহ
        </h1>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={order.orderId}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Order Header */}
            <div className="bg-gray-50/50 p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800 font-mono">
                  #{order.orderId}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                   <Icons.Date />
                   <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      order.status === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : order.status === "shipped"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {order.status === "pending"
                      ? "Pending (অপেক্ষমান)"
                      : order.status === "shipped"
                      ? "Shipped (পাঠানো হয়েছে)"
                      : "Delivered (সম্পন্ন)"}
                  </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {/* Items List */}
              <div className="divide-y divide-dashed divide-gray-200 mb-6">
                {order.items.map((item, idx) => {
                  const priceAfterDiscount = (item.price || 0) - (item.discount || 0);
                  const discountPercentage = item.discount
                    ? Math.round((item.discount / item.price) * 100)
                    : 0;

                  return (
                    <div
                      key={idx}
                      className="py-4 first:pt-0 flex gap-4"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image || "/no-image.png"}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                             {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-end justify-between gap-2 mt-2">
                           <div className="text-sm">
                              {item.discount > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">৳{priceAfterDiscount.toFixed(2)}</span>
                                  <span className="text-xs text-gray-400 line-through">৳{item.price.toFixed(2)}</span>
                                  <span className="text-[10px] text-green-600 font-medium">-{discountPercentage}% Off</span>
                                </div>
                              ) : (
                                <span className="font-bold text-gray-900">৳{item.price.toFixed(2)}</span>
                              )}
                           </div>
                           <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                             Delivery: ৳{item.deliveryCharge || 0}
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer / Totals */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 
                 <div className="space-y-1 w-full sm:w-auto text-sm text-gray-600">
                    <div className="flex justify-between sm:justify-start gap-4">
                        <span>Subtotal:</span>
                        <span className="font-medium text-gray-900">৳{order.itemsTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                        <span>Delivery:</span>
                        <span className="font-medium text-gray-900">৳{order.deliveryTotal.toFixed(2)}</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-gray-200">
                    <div>
                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Grand Total</span>
                        <span className="text-xl font-bold text-green-700">৳{order.grandTotal.toFixed(2)}</span>
                    </div>

                    {/* Cancel Button */}
                    {order.status === "pending" && (
                        <button
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all text-sm font-medium shadow-sm"
                        >
                        <Icons.Trash />
                        <span>Cancel</span>
                        </button>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        .animate-fadeIn {
           animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}