"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ApplySellerPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    shopName: "",
    description: "",
  });

  // ✅ Auto-fill name/email when session is loaded
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example: send to API route
      const res = await fetch("/api/marketplace/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit application");

      alert("✅ Your seller application has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting seller form:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white mt-10 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
        Become a Seller
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="text"
          name="shopName"
          placeholder="Shop Name"
          value={formData.shopName}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <textarea
          name="description"
          placeholder="Describe your shop or products..."
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-md h-24"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
