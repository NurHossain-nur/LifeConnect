"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-600">
          LifeConnect
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 font-medium text-orange-400 items-center">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <Link href="/blood" className="hover:text-red-600">Blood Donation</Link>
          <Link href="/marketplace" className="hover:text-red-600">Books & Notes</Link>
          <Link href="/electric" className="hover:text-red-600">Electric Items</Link>
          <Link href="/dashboard/admin" className="hover:text-red-600">Dashboard</Link>
          <Link href="/register" className="hover:text-red-600">Register</Link>

          {/* ✅ Conditional Auth Buttons */}
          {status === "loading" ? null : session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" title="Profile">
                <UserCircle
                  size={30}
                  className="text-gray-600 hover:text-red-600 cursor-pointer"
                />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white text-orange-400 shadow-lg border-t">
          <nav className="flex flex-col space-y-2 px-4 py-4 font-medium">
            <Link href="/" className="hover:text-red-600" onClick={toggleMenu}>Home</Link>
            <Link href="/blood" className="hover:text-red-600" onClick={toggleMenu}>Blood Donation</Link>
            <Link href="/marketplace" className="hover:text-red-600" onClick={toggleMenu}>Books & Notes</Link>
            <Link href="/electric" className="hover:text-red-600" onClick={toggleMenu}>Electric Items</Link>

            {/* ✅ Mobile Auth Logic */}
            {status === "loading" ? null : session ? (
              <>
                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="flex items-center gap-2 hover:text-red-600"
                >
                  <UserCircle size={20} /> Profile
                </Link>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
