"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ReferralPage() {
  const [loading, setLoading] = useState(true);
  const [referral, setReferral] = useState(null);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await fetch("/api/marketplace/seller/referral");
        const data = await res.json();

        if (data.success) {
          setReferral(data.data);
        } else {
          Swal.fire("ত্রুটি!", data.message, "error");
        }
      } catch (e) {
        Swal.fire("ত্রুটি!", "রেফারেল তথ্য লোড করা যায়নি", "error");
      }
      setLoading(false);
    };

    fetchReferral();
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(referral.referralCode);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "রেফারেল কোড কপি হয়েছে!",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 p-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="text-center mt-16">
        <h3 className="text-lg font-bold text-gray-800">ডেটা পাওয়া যায়নি</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">রেফারেল কমিশন</h1>

      {/* Referral Info Card */}
      <div className="bg-white shadow rounded-xl border p-6 animate-slideUp">
        <h2 className="text-lg font-bold">আপনার রেফারেল কোড</h2>

        <div className="mt-3 flex items-center gap-3 bg-gray-100 p-3 rounded-lg border">
          <span className="font-mono text-xl tracking-wider text-green-700">
            {referral.referralCode}
          </span>
          <button
            onClick={copyReferral}
            className="ml-auto px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
          >
            কপি করুন
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-2">
          এই কোড ব্যবহার করে যেকেউ সেলার হলে আপনি কমিশন পাবেন।
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-xl bg-green-50 border border-green-200 text-center shadow-sm animate-slideUp">
          <p className="text-sm text-green-700 font-medium">মোট কমিশন</p>
          <h2 className="text-3xl font-bold mt-1 text-green-900">
            ৳{referral.totalCommission}
          </h2>
        </div>

        <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200 text-center shadow-sm animate-slideUp">
          <p className="text-sm text-yellow-700 font-medium">পেন্ডিং কমিশন</p>
          <h2 className="text-3xl font-bold mt-1 text-yellow-900">
            ৳{referral.pendingCommission}
          </h2>
        </div>

        <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-center shadow-sm animate-slideUp">
          <p className="text-sm text-blue-700 font-medium">অনুমোদিত</p>
          <h2 className="text-3xl font-bold mt-1 text-blue-900">
            ৳{referral.approvedCommission}
          </h2>
        </div>

      </div>

      {/* Commission Table */}
      <div className="bg-white rounded-xl border shadow-sm p-6 animate-slideUp">
        <h2 className="text-lg font-bold mb-4">কমিশন হিস্ট্রি</h2>

        {referral.commissions.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            এখনো কোনো রেফারেল কমিশন পাওয়া যায়নি।
          </p>
        ) : (
          <div className="space-y-4">
            {referral.commissions.map((c, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="text-sm text-gray-600">User ID: {c.referredUserId}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-800">৳{c.amount}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      c.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .4s ease-out; }
        .animate-slideUp { animation: fadeIn .4s ease-out; }
      `}</style>
    </div>
  );
}
