"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // ✅ Import NextAuth
import { useMemo } from "react";

export default function MarketplaceLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // ✅ Get user session

  // ✅ Dynamically create nav items based on role
  const navItems = useMemo(() => {
    const items = [
      { href: "/marketplace", label: "User View" },
    ];

    // Only add seller link if user is seller
    if (session?.user?.role === "seller") {
      items.push({ href: "/marketplace/seller-dashboard", label: "Seller Dashboard" });
    } else {
      items.push({ href: "/marketplace/apply-seller", label: "Apply for Seller" });
    }

    return items;
  }, [session]);

  return (
    <div>
      {/* Secondary Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600">Marketplace</h2>
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-red-500 text-white"
                    : "text-gray-700 hover:bg-red-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
