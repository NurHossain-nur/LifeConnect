"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

// Helper icons (SVGs) to avoid installing new packages
const Icons = {
  Box: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  ),
  Cart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  Money: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  Truck: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 00-1-1H9z" /></svg>
  ),
};

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    sellerName: "",
    shopName: "",
    profileImage: "",
    bannerImage: "",
    totalProducts: 0,
    ordersThisMonth: 0,
    totalRevenue: 0,
    pendingShipments: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/marketplace/seller/dashboard");
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      Swal.fire("Error!", "Unable to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-full pb-10">
      
      {/* 1. Profile Header / Banner Section */}
      <div className="bg-white shadow-sm mb-6">
        <div className="relative h-48 md:h-64 w-full bg-gray-300">
           {/* Banner Image */}
           <Image 
             src={stats.bannerImage || "/default-banner.jpg"} 
             alt="Shop Banner"
             fill
             className="object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-16 gap-4">
            {/* Profile Image */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
              <Image 
                src={stats.profileImage || "/default-avatar.png"} 
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Name and Info */}
            <div className="text-center md:text-left flex-1 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 md:text-white md:drop-shadow-md">
                {stats.shopName || "My Shop"}
              </h2>
              <p className="text-gray-600 md:text-gray-200 font-medium">
                {stats.sellerName}
              </p>
            </div>

            {/* Optional Action Button */}
            <div className="mt-2 md:mt-0">
               <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold border border-green-200">
                 Verified Seller
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 2. Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            label="Total Revenue" 
            value={`৳${stats.totalRevenue?.toLocaleString()}`} 
            icon={<Icons.Money />} 
            color="bg-blue-50 text-blue-600"
          />
          <StatCard 
            label="Orders (Month)" 
            value={stats.ordersThisMonth} 
            icon={<Icons.Cart />} 
            color="bg-purple-50 text-purple-600"
          />
          <StatCard 
            label="Total Products" 
            value={stats.totalProducts} 
            icon={<Icons.Box />} 
            color="bg-orange-50 text-orange-600"
          />
          <StatCard 
            label="Pending Shipments" 
            value={stats.pendingShipments} 
            icon={<Icons.Truck />} 
            color="bg-red-50 text-red-600"
          />
        </div>

        {/* 3. Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500">No orders found yet.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                        #{order.id ? order.id.slice(-6).toUpperCase() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            {/* Assuming order.items[0].image exists based on JSON */}
                            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 border">
                              <Image 
                                src={order.items?.[0]?.image || "/placeholder.png"} 
                                alt="Product"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">
                                    {order.items?.[0]?.name || "Unknown Item"}
                                </span>
                                {order.items?.length > 1 && (
                                    <span className="text-xs text-gray-400">
                                        + {order.items.length - 1} more items
                                    </span>
                                )}
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-700">{order.customer || "Guest"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-700">
                         ৳{order.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = status?.toLowerCase() || "pending";
  
  const styles = {
    delivered: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    shipped: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const style = styles[s] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${style}`}>
      {status}
    </span>
  );
}