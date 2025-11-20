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
    profileImage: null,
    bannerImage: null,
    paymentMethod: "",
    senderNumber: "",
    transactionId: "",
    paymentProof: null,
    referralCode: "", // New: optional referral code
    agreed: false,
  });
  const [submittedReferralCode, setSubmittedReferralCode] = useState(""); // New: to display after submit
  const [error, setError] = useState(""); // New: for invalid referral code

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
    const { name, value, files, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      let newValue = value;
      if (name === "referralCode") {
        newValue = value.toUpperCase();
      }
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmittedReferralCode("");
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        // submissionData.append(key, formData[key]);
        if (formData[key] !== null && formData[key] !== undefined) { // Skip null/undefined
          submissionData.append(key, formData[key]);
        }
      }
      submissionData.append("amount", "500");

      const res = await fetch("/api/marketplace/seller/apply", {
        method: "POST",
        body: submissionData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }
      setSubmittedReferralCode(data.referralCode);
      alert("✅ Your seller application has been submitted successfully! Admin will verify your payment and approve within 24 hours.");
    } catch (error) {
      console.error("Error submitting seller form:", error);
      setError(error.message);
      alert(`❌ ${error.message}`);
    }
  };

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow text-black">
      <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
        Become a Seller
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Existing fields... (name, email, shopName, description, phoneNumber, address, profileImage, bannerImage) */}
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-md" required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-md" required />
        <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleChange} className="w-full p-3 border rounded-md" required />
        <textarea name="description" placeholder="Describe your shop or products..." value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-md h-24" required />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full p-3 border rounded-md" required />
        <input type="text" name="address" placeholder="Shop Address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-md" required />

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Profile Image (Shop Logo)</label>
          <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="w-full p-3 border rounded-md" />
          <small className="text-gray-500 mt-1">Recommended: square, e.g., 150x150px</small>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Banner Image (Shop Banner)</label>
          <input type="file" name="bannerImage" accept="image/*" onChange={handleChange} className="w-full p-3 border rounded-md" />
          <small className="text-gray-500 mt-1">Recommended: wide, e.g., 1200x300px</small>
        </div>

        {/* New: Referral Code Input */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Referral Code (Optional)</label>
          <input
            type="text"
            name="referralCode"
            placeholder="Enter referral code if you have one"
            value={formData.referralCode}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <small className="text-gray-500 mt-1">Use a friend's code to reward them upon your approval.</small>
        </div>

        {/* Payment Section... (unchanged) */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-800 mb-3">Seller Registration Fee: 500 BDT (One-time)</h2>
          <p className="text-gray-700 mb-4">Send exactly 500 BDT to any of the following accounts:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>bKash (Personal):</strong> 01XXXXXXXXXX <em className="text-xs">(replace with your number)</em></li>
            <li><strong>Nagad (Personal):</strong> 01XXXXXXXXXX <em className="text-xs">(replace with your number)</em></li>
            <li><strong>Agent Account:</strong> XXXXXXXX <em className="text-xs">(replace with your account)</em></li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">After sending, fill the details below. Approval usually within 24 hours.</p>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Payment Method <span className="text-red-500">*</span></label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full p-3 border rounded-md" required>
            <option value="">Select Method</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="agent">Agent Account</option>
          </select>
        </div>

        <input type="tel" name="senderNumber" placeholder="Sender Phone Number (01XXXXXXXXX)" value={formData.senderNumber} onChange={handleChange} className="w-full p-3 border rounded-md" required />
        <input type="text" name="transactionId" placeholder="Transaction ID / Reference" value={formData.transactionId} onChange={handleChange} className="w-full p-3 border rounded-md" required />

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Payment Proof (Screenshot – optional but recommended)</label>
          <input type="file" name="paymentProof" accept="image/*" onChange={handleChange} className="w-full p-3 border rounded-md" />
          <small className="text-gray-500 mt-1">Faster approval with screenshot</small>
        </div>

        <div className="my-6 p-4 bg-gray-100 rounded-md">
          <label className="flex items-start cursor-pointer">
            <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} className="mr-3 mt-1 h-5 w-5 text-red-600" required />
            <span className="text-gray-700">I confirm I have sent exactly 500 BDT using the selected method and provided correct details. False information may lead to permanent rejection.</span>
          </label>
        </div>

        <button type="submit" className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition font-medium">
          Submit Application
        </button>
      </form>

      {/* New: Display generated referral code after submission */}
      {submittedReferralCode && (
        <div className="mt-6 p-4 bg-green-100 rounded-md text-center">
          <h3 className="text-lg font-bold text-green-800">Application Submitted!</h3>
          <p>Your unique referral code: <strong>{submittedReferralCode}</strong></p>
          <p>Share it with friends—they'll reward you 250 BDT upon their approval!</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
}