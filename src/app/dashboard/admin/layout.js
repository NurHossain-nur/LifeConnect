"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Professional SVG Icons
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Product: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Orders: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
};

export default function AdminPage({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Extended Navigation Items
  const navItems = [
    { label: "Dashboard", icon: <Icons.Dashboard />, href: "/dashboard/admin" },
    { label: "Sellers", icon: <Icons.Users />, href: "/dashboard/admin/seller-requests" },
    { label: "All Products", icon: <Icons.Product />, href: "/dashboard/admin/all-products" },
    { label: "Orders", icon: <Icons.Orders />, href: "/dashboard/admin/orders" },
    { label: "Settings", icon: <Icons.Settings />, href: "/dashboard/admin/settings" },
  ];

  // Handle Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false); // Default closed on mobile
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true); // Default open on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen flex overflow-hidden">
      
      {/* --- Sidebar --- */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 
          flex flex-col bg-slate-900 text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64 translate-x-0" : isMobile ? "-translate-x-full w-64" : "w-20 translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800">
          {isSidebarOpen ? (
            <span className="font-bold text-xl tracking-wider text-white animate-fadeIn">ADMIN</span>
          ) : (
            <span className="font-bold text-xl mx-auto">A</span>
          )}
          
          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => isMobile && setIsSidebarOpen(false)} // Close on click (mobile)
                className={`
                  flex items-center px-4 py-3 transition-all duration-200 border-l-4
                  ${isActive 
                    ? "bg-slate-800 border-blue-500 text-blue-400" 
                    : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"}
                `}
              >
                <span className={`${isActive ? "text-blue-400" : ""}`}>{item.icon}</span>
                
                <span 
                  className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 origin-left
                    ${isSidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 hidden"}
                  `}
                >
                  {item.label}
                </span>

                {/* Tooltip for Mini Sidebar */}
                {!isSidebarOpen && !isMobile && (
                   <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                     {item.label}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
           <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full">
              <Icons.Logout />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
           </button>
        </div>
      </aside>

      {/* --- Mobile Overlay --- */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- Main Content Wrapper --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
                <Icons.Menu />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800">
              {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Dropdown / Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                    A
                </div>
            </div>
          </div>
        </header>

        {/* Page Content Scroller */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8 custom-scrollbar">
           <div className="max-w-7xl mx-auto animate-slideUp">
              {children}
           </div>
        </main>
      </div>

      <style jsx global>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
    </div>
  );
}