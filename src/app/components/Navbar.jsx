"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Added to track active page
import { Menu, X, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const isAdmin = session?.user?.role === "admin";

  // Handle scroll effect for professional look
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reusable Desktop Nav Link Component with Animation
  const NavLink = ({ href, label }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative group py-2 font-medium transition-colors duration-300 ${
          isActive ? "text-red-600" : "text-gray-600 hover:text-red-600"
        }`}
      >
        {label}
        {/* Animated Underline */}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ease-out ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    );
  };

  // Reusable Mobile Nav Link Component
  const MobileLink = ({ href, label }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={toggleMenu}
        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
          isActive
            ? "bg-red-50 text-red-600 border-l-4 border-red-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-white shadow-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group"
          >
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
              LifeConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm lg:text-base">
            <NavLink href="/" label="Home" />
            <NavLink href="/blood" label="Blood Donation" />
            <NavLink href="/marketplace" label="Marketplace" />
            {/* <NavLink href="/electric" label="Electric Items" /> */}
            
            {isAdmin && (
              <NavLink href="/dashboard/admin" label="Dashboard" />
            )}
            
            {!session && (
              <NavLink href="/register" label="Register" />
            )}

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-md" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  title="Profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors group"
                >
                  <UserCircle
                    size={32}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="hidden lg:block font-medium text-sm">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            {/* Show minimal profile icon on mobile if logged in */}
            {session && (
                <Link href="/profile" className="text-gray-600">
                    <UserCircle size={28} />
                </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-red-600 focus:outline-none transition-transform duration-200 active:scale-90"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Animated) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          <MobileLink href="/" label="Home" />
          <MobileLink href="/blood" label="Blood Donation" />
          <MobileLink href="/marketplace" label="Marketplace" />
          {/* <MobileLink href="/electric" label="Electric Items" /> */}
          
          {isAdmin && (
            <MobileLink href="/dashboard/admin" label="Admin Dashboard" />
          )}
          
          {!session && (
            <MobileLink href="/register" label="Register" />
          )}

          {/* Mobile Auth Actions */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            {status === "loading" ? (
              <div className="h-10 bg-gray-100 rounded animate-pulse" />
            ) : session ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <UserCircle size={24} className="text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="block w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  View Profile
                </Link>
                <div onClick={toggleMenu} className="w-full">
                    <LogoutButton />
                </div>
              </div>
            ) : (
              <div onClick={toggleMenu} className="w-full">
                <LoginButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}