"use client";

import { useState } from "react";

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-green-800 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 font-bold text-lg border-b border-green-700">
          <span>{isSidebarOpen ? "Seller Panel" : "S"}</span>
          <button onClick={toggleSidebar} className="text-sm">
            {isSidebarOpen ? "⏴" : "⏵"}
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-2">
          {[
            { label: "Dashboard", icon: "📊" },
            { label: "My Products", icon: "🛍️" },
            { label: "Orders", icon: "📦" },
            { label: "Add Product", icon: "➕" },
            { label: "Settings", icon: "⚙️" },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:bg-green-700"
            >
              <span>{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-green-700 text-sm">
          {isSidebarOpen ? "© 2025 Seller Inc." : "©"}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Seller Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, Seller 👋</span>
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <section className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-lg font-medium mb-4">Sales Overview</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">48</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500">Orders This Month</p>
              <p className="text-2xl font-semibold">124</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold">$3,480</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-500">Pending Shipments</p>
              <p className="text-2xl font-semibold">9</p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white shadow rounded p-4 overflow-x-auto">
            <h3 className="text-md font-medium mb-4">Recent Orders</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#00123", product: "Wireless Headphones", customer: "Jane Doe", status: "Shipped", amount: "$120" },
                  { id: "#00124", product: "Gaming Mouse", customer: "John Smith", status: "Pending", amount: "$45" },
                  { id: "#00125", product: "Keyboard", customer: "Alice Lee", status: "Delivered", amount: "$60" },
                ].map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.product}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
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
          </div>
        </section>
      </main>
    </div>
  );
}
