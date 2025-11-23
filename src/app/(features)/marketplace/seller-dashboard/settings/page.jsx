"use client";

export default function SellerSettingsComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden p-6">

      {/* Floating Background Dots */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-orange-300 rounded-full animate-pulseSlow"></div>
      <div className="absolute bottom-16 right-16 w-4 h-4 bg-orange-200 rounded-full animate-pulseSlow delay-300"></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-orange-300 rounded-full animate-pulseSlow delay-700"></div>
      
      {/* Main Card */}
      <div className="relative bg-white/80 backdrop-blur-lg border border-orange-200 shadow-xl rounded-2xl p-8 max-w-lg w-full animate-fadeUp">
        
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shadow-md animate-bounceSlow">
            <svg
              className="w-10 h-10 text-orange-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v3m6.364 1.636l-2.121 2.121M21 12h-3m-1.636 6.364l-2.121-2.121M12 21v-3m-6.364-1.636 2.121-2.121M3 12h3m1.636-6.364 2.121 2.121" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mt-6">
          Settings Page Coming Soon
        </h1>

        {/* Subtext */}
        <p className="text-center text-gray-600 mt-3 leading-relaxed">
          সেলার ড্যাশবোর্ডের <b>Settings</b> সেকশন আপগ্রেড করা হচ্ছে।
          <br />  
          শীঘ্রই আপনি পারবেন—
        </p>

        {/* List */}
        <ul className="mt-5 text-gray-700 space-y-3 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-orange-500">⚙️</span> প্রোফাইল ও দোকানের তথ্য আপডেট করতে
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">🔒</span> পাসওয়ার্ড পরিবর্তন করতে
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">🧾</span> পেমেন্ট ও বিলিং সেট করতে
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">📢</span> নোটিফিকেশন কাস্টমাইজ করতে
          </li>
        </ul>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-progressLoop"></div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Updating… Please wait for the next release
          </p>
        </div>

        {/* Button */}
        <div className="mt-7 flex justify-center">
          <button className="px-6 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all shadow-md">
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes progressLoop {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 0%; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fadeUp { animation: fadeUp 0.6s ease-out; }
        .animate-pulseSlow { animation: pulseSlow 3s infinite ease-in-out; }
        .animate-progressLoop { animation: progressLoop 2.2s infinite ease-in-out; }
        .animate-bounceSlow { animation: bounceSlow 2.8s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
