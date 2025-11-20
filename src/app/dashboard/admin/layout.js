"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminPage({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Close on small screens by default
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Map routes to labels and icons
  const navItems = [
    { label: "Dashboard", icon: "📊", href: "/dashboard/admin" },
    // { label: "Users", icon: "👤", href: "/dashboard/admin/users" },
    { label: "Seller", icon: "👤", href: "/dashboard/admin/seller-requests" },
    // { label: "Products", icon: "📦", href: "/dashboard/admin/products" },
    // { label: "Settings", icon: "⚙️", href: "/dashboard/admin/settings" },
  ];

  // Determine active nav item based on current pathname
  const activeItem = navItems.find((item) => pathname.startsWith(item.href))?.label || "Dashboard";

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex max-w-7xl mx-auto min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 transform ${
            isSidebarOpen ? 'translate-x-0 w-64' : window.innerWidth >= 1024 ? 'w-16' : '-translate-x-full w-64'
          } lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 transition-transform duration-300 ease-in-out bg-blue-900 text-white flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 font-bold text-lg border-b border-blue-700">
            <span>{isSidebarOpen ? "Admin Panel" : "A"}</span>
            <button onClick={toggleSidebar} className="text-sm">
              {isSidebarOpen ? "⏴" : "⏵"}
            </button>
          </div>

          <nav className="flex-1 mt-4 space-y-2">
            {navItems.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 hover:bg-blue-800 ${
                  activeItem === label ? "bg-blue-700 font-semibold" : ""
                }`}
              >
                <span>{icon}</span>
                {isSidebarOpen && <span>{label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-blue-700 text-sm">
            {isSidebarOpen ? "© 2025 Admin Inc." : "©"}
          </div>
        </aside>

        {/* Overlay for mobile when sidebar open */}
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div 
            className="fixed inset-0 bg-black opacity-50 z-40" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Navbar */}
          <header className="bg-white shadow p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {window.innerWidth < 1024 && (
                <button onClick={toggleSidebar} className="text-2xl">
                  ☰
                </button>
              )}
              <h1 className="text-xl font-semibold">{activeItem}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hi, Admin 👋</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <section className="p-6 flex-1 overflow-y-auto">{children}</section>
        </main>
      </div>
    </div>
  );
}