"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "./components/CartDrawer";
import Header from "./components/Header"; // <-- import header

function MarketplaceNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cart, setCartOpen } = useCart(); // <-- get cart + drawer control

  const navItems = [
    { href: "/marketplace", label: "User View" },
    { href: "/marketplace/my-orders", label: "My Orders" },
    session?.user?.role === "seller"
      ? { href: "/marketplace/seller-dashboard", label: "Seller Dashboard" }
      : { href: "/marketplace/apply-seller", label: "Apply for Seller" },
  ];

  return (
    <>
      {/* TOP NAV */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600">Marketplace</h2>

          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm transition ${
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

      {/* MAIN MARKETPLACE HEADER (search + cart button) */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Header
            cartItemCount={Object.values(cart).length}
            onCartClick={() => setCartOpen(true)}
          />
        </div>
      </div>
    </>
  );
}

export default function MarketplaceLayout({ children }) {
  return (
    <CartProvider>
      <MarketplaceNavbar />

      <main className="min-w-screen bg-white">{children}</main>

      {/* GLOBAL CART DRAWER */}
      <CartDrawer />
    </CartProvider>
  );
}
