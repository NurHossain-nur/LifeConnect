"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SellerDashboard() {
  const [stats, setStats] = useState({
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

      if (data.success) setStats(data.data);
      else Swal.fire("Error!", data.message, "error");
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      Swal.fire("Error!", "Unable to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading dashboard...</p>;

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h2 className="text-lg font-medium mb-4">
        Welcome, {stats.sellerName || "Seller"}!
      </h2>
      <p className="text-gray-500 mb-6">
        Shop: <span className="font-semibold">{stats.shopName || "N/A"}</span>
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card label="Total Products" value={stats.totalProducts} />
        <Card label="Orders This Month" value={stats.ordersThisMonth} />
        <Card
          label="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
        />
        <Card label="Pending Shipments" value={stats.pendingShipments} />
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <h3 className="text-md font-medium mb-4">Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No recent orders.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Status</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-gray-600">{order.id}</td>
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${
                        order.status?.toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status?.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2 font-medium">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white shadow rounded p-4 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
