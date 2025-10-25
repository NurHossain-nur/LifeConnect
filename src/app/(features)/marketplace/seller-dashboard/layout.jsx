"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function SellerDashboard({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [seller, setSeller] = useState(null);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/marketplace/seller-dashboard" },
    { label: "My Products", icon: "🛍️", href: "/marketplace/seller-dashboard/my-products" },
    { label: "Orders", icon: "📦", href: "/marketplace/seller-dashboard/orders" },
    { label: "Add Product", icon: "➕", href: "/marketplace/seller-dashboard/add-product" },
    { label: "Settings", icon: "⚙️", href: "/marketplace/seller-dashboard/settings" },
  ];

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch("/api/marketplace/seller/profile");
        const data = await res.json();

        if (data.success) {
          setSeller(data.data);
        } else {
          Swal.fire("Error!", data.message, "error");
        }
      } catch (err) {
        console.error("Error loading seller info:", err);
        Swal.fire("Error!", "Failed to load seller info.", "error");
      }
    };

    fetchSeller();
  }, []);

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
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-green-700 border-l-4 border-white"
                    : "hover:bg-green-700"
                }`}
              >
                <span>{item.icon}</span>
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-700 text-sm">
          {isSidebarOpen ? "© 2025 Seller Inc." : "©"}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-semibold text-gray-800">Seller Dashboard</h1>

          {seller ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">
                  {seller.name}{" "}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      seller.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {seller.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500">{seller.shopName}</p>
              </div>

              <Image
                src={seller.profileImage || "/default-avatar.png"}
                alt="Seller Profile"
                width={40}
                height={40}
                className="rounded-full border"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </header>

        {/* Page Content */}
        <section className="p-6 flex-1 overflow-y-auto">{children}</section>
      </main>
    </div>
  );
}
