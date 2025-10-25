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
    phoneNumber: "",
    address: "",
    profileImage: null, // File object
  });

  // Auto-fill name/email from session
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
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use FormData for file upload
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }

      const res = await fetch("/api/marketplace/seller/apply", {
        method: "POST",
        body: submissionData,
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
    <div className="max-w-2xl text-black mx-auto bg-white mt-10 p-6 rounded-lg shadow">
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
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Shop Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
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
