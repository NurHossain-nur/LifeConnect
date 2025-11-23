"use client";

import { useEffect, useState } from "react";

// Icons
const Icons = {
  Users: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Money: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Bag: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  Store: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  ArrowUp: () => <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Skeleton Loader ---
  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-gray-200 rounded-xl lg:col-span-2"></div>
        <div className="h-80 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`৳${stats?.totalRevenue.toLocaleString() || 0}`} 
          icon={<Icons.Money />} 
          trend="+12.5%" 
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={<Icons.Bag />} 
          trend="+8.2%" 
          color="bg-purple-50 text-purple-600"
        />
        <StatCard 
          title="Active Sellers" 
          value={stats?.activeSellers || 0} 
          icon={<Icons.Store />} 
          trend="+2.4%" 
          color="bg-orange-50 text-orange-600"
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<Icons.Users />} 
          trend="+5.1%" 
          color="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
            <a href="/dashboard/admin/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <Icons.ArrowRight />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{order.customer?.name || "Guest"}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">৳{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                        order.overallStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                        order.overallStatus === "shipped" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {order.overallStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Pending Seller Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Seller Requests</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
              {stats?.pendingSellerCount || 0} Pending
            </span>
          </div>
          
          <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar max-h-[400px]">
            {stats?.pendingSellers?.map((app) => (
              <div key={app._id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{app.shopName}</p>
                  <p className="text-xs text-gray-500 truncate">{app.name}</p>
                </div>
                <a 
                  href="/dashboard/admin/seller-requests" 
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Review
                </a>
              </div>
            ))}
            {(!stats?.pendingSellers || stats.pendingSellers.length === 0) && (
               <div className="text-center py-10 text-gray-400 text-sm">
                 No pending requests
               </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50">
             <a href="/dashboard/admin/seller-requests" className="block w-full text-center text-sm text-blue-600 font-medium hover:underline">
                View All Applications
             </a>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Helper Component: Stat Card ---
function StatCard({ title, value, icon, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-1.5 py-0.5 rounded">
           <Icons.ArrowUp /> {trend} <span className="text-gray-400 ml-1 font-normal">vs last month</span>
        </div>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  );
}