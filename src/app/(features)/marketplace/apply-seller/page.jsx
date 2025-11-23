"use client";
import LoginButton from "@/app/components/LoginButton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import styles from '../apply-seller/module.css';

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

  const [sellerApplication, setSellerApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  // Fetch seller application when logged in:
  useEffect(() => {
  if (session?.user?._id) {
    fetch(`/api/marketplace/seller/check?userId=${session.user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.application) {
          setSellerApplication(data.application);
        }
      })
      .finally(() => setLoadingApp(false));
  } else {
    setLoadingApp(false);
  }
}, [session]);

// console.log("Seller Application:", sellerApplication);

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


  // ❗ NEW FEATURE: If user is NOT logged in, show a message, not the form
  if (!session && status !== "loading") {
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center text-black 
      animate-fadeIn" 
    >
      {/* Animated Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center 
          text-3xl animate-bounce-slow shadow-md"
        >
          🔒
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-red-600 mb-4">
        সেলার হতে আপনাকে লগইন করতে হবে
      </h2>

      <p className="text-gray-700 text-base sm:text-lg leading-relaxed px-2">
        আমাদের প্ল্যাটফর্মে সেলার হিসেবে যোগ দিতে হলে আগে{" "}
        <span className="font-semibold text-red-600">লগইন</span> অথবা{" "}
        <span className="font-semibold text-green-600">রেজিস্ট্রেশন</span>{" "}
        করতে হবে। 
        <br />
        লগইন করার পর আপনি সহজেই সেলার অ্যাপ্লিকেশন ফর্ম দেখতে এবং পূরণ করতে পারবেন।
      </p>

      {/* Info Box */}
      <div className="mt-5 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">
          👉 সেলার অ্যাকাউন্ট তৈরি করলে আপনি আপনার নিজস্ব দোকান খুলে প্রোডাক্ট বিক্রি করতে পারবেন।
        </p>
        <p className="text-sm text-gray-700 mt-1">
          👉 অনুমোদন পেতে মাত্র ২৪ ঘণ্টা লাগবে।
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <LoginButton redirect="/marketplace/apply-seller"></LoginButton>
        <a
          href="/register"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all 
            transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto block animate-slideUp delay-200"
        >
          📝 রেজিস্টার করুন
        </a>
      </div>
    </div>
  );
}

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-500">লোডিং হচ্ছে...</p>;
  }

  // If user has already applied and still pending
  // If user has already applied and still pending
if (sellerApplication && sellerApplication.status === "pending") {
  return (
    <div className="max-w-xl mx-auto mt-12 p-6 sm:p-8 bg-white rounded-2xl shadow-xl text-black
                    animate-fadeIn sm:animate-slideUp">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 flex items-center justify-center bg-orange-100 rounded-full mb-4 shadow-md
                        animate-bounce-slow text-4xl">
          🕒
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-600 mb-3">
          আপনার সেলার আবেদন পর্যালোচনাধীন
        </h2>
        <p className="text-gray-700 sm:text-lg leading-relaxed px-2 sm:px-0">
          আপনার সেলার হওয়ার আবেদনটি সফলভাবে জমা দেওয়া হয়েছে। <br />
          আমাদের টিম আপনার তথ্য যাচাই করছে। সাধারণত <b>২৪ ঘণ্টা</b> এর মধ্যে অনুমোদন সম্পন্ন হয়।
        </p>
      </div>

      {/* Application Summary Card */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 
                      p-5 rounded-2xl shadow-md transform transition-all hover:scale-105">
        <h3 className="text-xl font-semibold text-orange-700 mb-3 text-center">আপনার আবেদনের সারসংক্ষেপ</h3>
        
        <div className="space-y-2 text-gray-800">
          <p><span className="font-semibold">নাম:</span> {sellerApplication.name}</p>
          <p><span className="font-semibold">দোকানের নাম:</span> {sellerApplication.shopName}</p>
          <p><span className="font-semibold">ফোন:</span> {sellerApplication.phoneNumber}</p>
          <p><span className="font-semibold">স্ট্যাটাস:</span> 
            <span className="text-orange-600 font-bold ml-1">Pending (Review চলছে)</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            আবেদন জমা দেওয়ার সময়: {new Date(sellerApplication.createdAt).toLocaleString("bn-BD")}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-5 bg-orange-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div className="h-3 bg-orange-500 rounded-full animate-progressBar"></div>
        </div>
        <p className="text-sm text-gray-600 mt-1 text-center">অ্যাপ্লিকেশন প্রক্রিয়াধীন...</p>
      </div>

      {/* Info / Guidance */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 text-center shadow-sm
                      animate-fadeIn delay-200">
        <p className="text-gray-600 sm:text-sm">
          যদি ভুল তথ্য দিয়ে থাকেন বা কোনো সাহায্য প্রয়োজন, লাইভ চ্যাট বা সাপোর্টে যোগাযোগ করুন।<br/>
          আমাদের টিম দ্রুত সাড়া দেবে। 
        </p>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 text-center">
        <a href="/marketplace" 
           className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg 
                      hover:bg-orange-600 transition transform hover:-translate-y-1 hover:shadow-xl
                      text-sm sm:text-base font-medium animate-slideUp delay-300">
          বাজারে ফিরে যান
        </a>
      </div>

      
    </div>
  );
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