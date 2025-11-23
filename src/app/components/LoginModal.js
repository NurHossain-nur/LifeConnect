"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginModal({ isOpen, onClose, initialEmail = "", redirect  }) {
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  // const redirectTo = searchParams.get("redirect") || "/";

  const redirectTo = redirect || searchParams.get("redirect") || "/";

  // Pre-fill email if passed from Register page
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setLoginMethod("email");
    }
  }, [initialEmail, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const identifier =
      loginMethod === "email"
        ? email
        : `+${phone.replace(/\D/g, "")}`;

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error || "Login failed. Please try again.");
    } else if (res?.ok) {
      router.push(redirectTo);
      router.refresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white text-black rounded-xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl transform transition-all scale-100">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-red-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 sm:mb-6 text-gray-800">
          Welcome Back
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-5 sm:mb-6 bg-gray-100 p-1 rounded-lg text-xs sm:text-sm">
          <button
            className={`flex-1 py-2 rounded-md transition-all duration-200 ${
              loginMethod === "email"
                ? "bg-white text-red-600 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setLoginMethod("email")}
          >
            Email
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition-all duration-200 ${
              loginMethod === "phone"
                ? "bg-white text-red-600 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setLoginMethod("phone")}
          >
            Phone
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs sm:text-sm p-2 sm:p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">

          {/* EMAIL LOGIN */}
          {loginMethod === "email" ? (
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
          ) : (
            /* PHONE LOGIN */
            <div className="relative flex items-center">
              <PhoneInput
                country={"bd"}
                value={phone}
                onChange={(v) => setPhone(v)}
                inputProps={{ required: true }}
                containerClass="w-full"
                inputClass="!w-full !h-10 sm:!h-11 !pl-12 !pr-3 !text-sm sm:!text-base !rounded-lg !border !border-gray-300 focus:!outline-none focus:!ring-2 focus:!ring-red-500/20 focus:!border-red-500"
                buttonClass="!border-r !border-gray-300"
                dropdownClass="bg-white text-black rounded"
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-2 sm:py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm sm:text-base shadow-lg shadow-red-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
          Don&apos;t have an account?
          <a
            href="/register"
            className="text-red-600 hover:text-red-700 font-semibold hover:underline ml-1"
            onClick={onClose}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
