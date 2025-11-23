"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Icons
const Icons = {
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Map: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
};

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
    // Translate status for Alert
    const statusMap = {
      pending: "অপেক্ষমান (Pending)",
      shipped: "শিফড (Shipped)",
      delivered: "ডেলিভারড (Delivered)",
    };

    const confirmResult = await MySwal.fire({
      title: "আপনি কি নিশ্চিত?",
      html: `আপনি <strong>${productName}</strong> এর স্ট্যাটাস পরিবর্তন করে "<strong>${statusMap[newStatus]}</strong>" করতে যাচ্ছেন।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, আপডেট করুন!",
      cancelButtonText: "না",
    });

    if (!confirmResult.isConfirmed) return;

    setUpdating(true);

    // Optimistic UI Update
    setOrders((prev) =>
      prev.map((order) => {
        if (order._id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.productId === productId ? { ...item, status: newStatus } : item
          ),
          overallStatus: newStatus, // Simplified overall status logic for UI
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
          title: "সফল!",
          text: "স্ট্যাটাস আপডেট করা হয়েছে।",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchOrders(); // Refresh to ensure sync
      } else {
        MySwal.fire("ত্রুটি", data.message || "আপডেট ব্যর্থ হয়েছে", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      MySwal.fire("ত্রুটি", "কিছু ভুল হয়েছে!", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 animate-fadeIn">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-lg">কোন অর্ডার নেই</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">অর্ডার সমূহ</h1>
         <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {orders.length} টি
         </span>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Order Header */}
            <div className="bg-gray-50/50 p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                  অর্ডার #<span className="font-mono text-gray-500">{order._id.slice(-6).toUpperCase()}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                   Placed on {new Date().toLocaleDateString()}
                </p>
              </div>
              
              {/* Customer Badge Mobile/Desktop */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm w-fit">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {order.customer.name.charAt(0)}
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-700 leading-tight">{order.customer.name}</p>
                    <p className="text-[10px] text-gray-500">{order.customer.phone}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                
                {/* 1. Customer Details Column */}
                <div className="p-5 space-y-3 text-sm text-gray-600 lg:col-span-1 bg-gray-50/30">
                    <h3 className="font-semibold text-gray-800 mb-2 uppercase text-xs tracking-wider">কাস্টমার তথ্য</h3>
                    
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-gray-400"><Icons.Map /></span>
                        <p className="leading-relaxed">{order.customer.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400"><Icons.Mail /></span>
                        <p>{order.customer.email}</p>
                    </div>
                     <div className="flex items-center gap-3">
                        <span className="text-gray-400"><Icons.Phone /></span>
                        <p className="font-mono">{order.customer.phone}</p>
                    </div>
                </div>

                {/* 2. Products List Column */}
                <div className="lg:col-span-2 divide-y divide-gray-50">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors group">
                            <div className="flex flex-col sm:flex-row gap-4">
                                
                                {/* Image */}
                                <div className="relative w-full sm:w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <img
                                        src={item.productInfo?.images?.[0] || "/no-image.png"}
                                        alt={item.productInfo?.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Details & Actions */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 line-clamp-2 mb-1">
                                                {item.productInfo?.name || "Product Name Unavailable"}
                                            </h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                                                {/* Price + Discount */}
                                                <span className="flex items-center gap-1">
                                                  Price:
                                                                    
                                                  {item.discount > 0 ? (
                                                    <>
                                                      {/* Final Price After Discount */}
                                                      <span className="font-semibold text-green-700">
                                                        ৳{item.price - item.discount}
                                                      </span>
                                                  
                                                      {/* Original Price */}
                                                      <span className="line-through text-gray-400">
                                                        ৳{item.price}
                                                      </span>
                                                  
                                                      {/* Discount Badge */}
                                                      <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] ml-1">
                                                        -৳{item.discount}
                                                      </span>
                                                    </>
                                                  ) : (
                                                    <span>৳{item.price}</span>
                                                  )}
                                                </span>
                                                <span>Delivery: ৳{item.deliveryCharge}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">৳{(item.price * item.quantity) + item.deliveryCharge}</p>
                                        </div>
                                    </div>

                                    {/* Status Select */}
                                    <div className="mt-3 sm:mt-0 flex justify-end">
                                        <div className="relative">
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
                                                className={`
                                                    appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus:ring-2 focus:ring-offset-1 outline-none
                                                    ${item.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-400" : ""}
                                                    ${item.status === "shipped" ? "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400" : ""}
                                                    ${item.status === "delivered" ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-400" : ""}
                                                `}
                                            >
                                                <option value="pending">অপেক্ষমান (Pending)</option>
                                                <option value="shipped">শিফড (Shipped)</option>
                                                <option value="delivered">ডেলিভারড (Delivered)</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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