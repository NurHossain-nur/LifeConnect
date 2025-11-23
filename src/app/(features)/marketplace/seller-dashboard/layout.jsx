"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function SellerDashboard({ children }) {
  // Default sidebar state: Closed on mobile (handled by CSS/Effect), Open on Desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [seller, setSeller] = useState(null);
  const pathname = usePathname();

  // Handle Screen Resize to auto-close sidebar on mobile initially
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    // Set initial state
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Translated Menu Items
  const menuItems = [
    { label: "ড্যাশবোর্ড", icon: "📊", href: "/marketplace/seller-dashboard" },
    { label: "আমার পণ্যসমূহ", icon: "🛍️", href: "/marketplace/seller-dashboard/my-products" },
    { label: "অর্ডারসমূহ", icon: "📦", href: "/marketplace/seller-dashboard/orders" },
    { label: "পণ্য যোগ করুন", icon: "➕", href: "/marketplace/seller-dashboard/add-product" },
    { label: "সেটিংস", icon: "⚙️", href: "/marketplace/seller-dashboard/settings" },
  ];

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch("/api/marketplace/seller/profile");
        const data = await res.json();

        if (data.success) {
          setSeller(data.data);
        } else {
          Swal.fire("ত্রুটি!", data.message || "তথ্য লোড করা যায়নি", "error");
        }
      } catch (err) {
        console.error("Error loading seller info:", err);
        Swal.fire("ত্রুটি!", "সেলার ইনফো লোড করা যায়নি", "error");
      }
    };

    fetchSeller();
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen bg-gray-50 relative overflow-hidden">
      
      {/* Mobile Overlay (Backdrop) - Only visible when sidebar is open on mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 h-full min-h-screen bg-green-800 text-white shadow-xl 
          transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"}
        `}
      >
        <div className="flex items-center justify-between p-4 font-bold text-lg border-b border-green-700 h-16">
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
            {isSidebarOpen ? "সেলার প্যানেল" : "S"}
          </span>
          
          {/* Toggle Button (Desktop: Minimize / Mobile: Close) */}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded hover:bg-green-700 transition-colors"
          >
            {isSidebarOpen ? (
              // Close Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            ) : (
              // Open Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)} // Close on click (mobile)
                className={`group flex items-center gap-4 px-4 py-3 transition-all duration-200 relative ${
                  isActive
                    ? "bg-green-700 border-l-4 border-white text-white shadow-inner"
                    : "hover:bg-green-700/80 text-green-100 hover:text-white"
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span 
                  className={`whitespace-nowrap transition-all duration-300 origin-left ${
                    isSidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 md:hidden"
                  }`}
                >
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state on Desktop */}
                {!isSidebarOpen && (
                  <div className="hidden md:block absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-700 text-xs text-center text-green-200">
          {isSidebarOpen ? "© ২০২৫ সেলার ইনক." : "©"}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm p-4 flex justify-between items-center border-b border-gray-200 h-16">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              সেলার ড্যাশবোর্ড
            </h1>
          </div>

          {seller ? (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">
                  {seller.name}
                  <span
                    className={`ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full border ${
                      seller.status === "approved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {seller.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500">{seller.shopName}</p>
              </div>

              <div className="relative group cursor-pointer">
                <Image
                  src={seller.profileImage || "/default-avatar.png"}
                  alt="Seller Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-100 group-hover:border-green-500 transition-colors object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="animate-pulse flex items-center gap-2">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <section className="p-4 md:p-6 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="animate-slideUp fade-in-up">
             {children}
          </div>
        </section>
      </main>
      
      {/* Custom Keyframe for simple entry animation */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}