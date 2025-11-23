"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function WithdrawPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [number, setNumber] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/marketplace/seller/withdrawal");
      const data = await res.json();

      if (data.success) {
        setWithdrawals(data.data);
      } else {
        Swal.fire("ত্রুটি!", data.message, "error");
      }
    } catch (e) {
      Swal.fire("ত্রুটি!", "হিস্ট্রি লোড করা যাচ্ছে না", "error");
    }
    setLoading(false);
  };

  const submitWithdraw = async () => {
    if (!amount || !number) {
      return Swal.fire("ত্রুটি!", "সব তথ্য পূরণ করুন", "error");
    }

    try {
      const res = await fetch("/api/marketplace/seller/withdrawal", {
        method: "POST",
        body: JSON.stringify({ amount, method, number }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("সফল!", data.message, "success");
        setIsModalOpen(false);
        fetchHistory();
      } else {
        Swal.fire("ত্রুটি!", data.message, "error");
      }
    } catch (e) {
      Swal.fire("ত্রুটি!", "রিকোয়েস্ট ব্যর্থ হয়েছে", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          উত্তোলন (Withdrawal)
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
        >
          টাকা উত্তোলন করুন
        </button>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white p-6 shadow rounded-xl border">
        <h2 className="text-lg font-bold mb-4">উত্তোলন হিস্ট্রি</h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ) : withdrawals.length === 0 ? (
          <p className="text-gray-500 py-6 text-center">কোনো উত্তোলন পাওয়া যায়নি।</p>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((w, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-bold text-gray-800">৳{w.amount}</p>
                  <p className="text-xs text-gray-500">{new Date(w.createdAt).toLocaleString()}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    w.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : w.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-slideUp">

            <h2 className="text-xl font-bold mb-4">টাকা উত্তোলন</h2>

            <label className="block mb-2 text-sm">উত্তোলন পরিমাণ (৳)</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg mb-4"
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <label className="block mb-2 text-sm">পেমেন্ট মেথড</label>
            <select
              className="w-full p-3 border rounded-lg mb-4"
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
            </select>

            <label className="block mb-2 text-sm">নম্বর</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-4"
              onChange={(e) => setNumber(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                বাতিল
              </button>

              <button
                onClick={submitWithdraw}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                রিকোয়েস্ট পাঠান
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

    </div>
  );
}
