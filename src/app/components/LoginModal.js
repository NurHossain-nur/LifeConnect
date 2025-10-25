"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

export default function LoginModal({ isOpen, onClose }) {
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const identifier = loginMethod === "email" ? email : `+${phone.replace(/\D/g,'')}`; // ensure + in phone

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error || "Login failed. Please try again.");
    } else if (res?.ok) {
      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-red-600">Login</h2>

        {/* Tabs for switching login method */}
        <div className="flex justify-center mb-4 gap-4">
          <button
            className={`px-4 py-1 rounded-t-lg ${loginMethod === "email" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => setLoginMethod("email")}
          >
            Email
          </button>
          <button
            className={`px-4 py-1 rounded-t-lg ${loginMethod === "phone" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => setLoginMethod("phone")}
          >
            Phone
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {loginMethod === "email" ? (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ) : (
            <PhoneInput
              country={"bd"} // default country, can change
              value={phone}
              onChange={setPhone}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
              }}
              containerClass="w-full"
              inputClass="w-full h-11 px-3 text-black rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              buttonClass="border-r border-gray-300"
              dropdownClass="bg-white text-black rounded"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don&lsquo;t have an account?{" "}
          <a
            href="/register"
            className="text-red-500 hover:text-red-600 font-semibold"
            onClick={onClose}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
