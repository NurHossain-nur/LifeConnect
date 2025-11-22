"use client";
import React, { useState } from "react";
import { CheckCircle, AlertCircle, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

import dynamic from "next/dynamic";

export default function App() {

  const LoginModal = dynamic(() => import("../components/LoginModal"), {
    ssr: false,
  });


  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    text: "",
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#3b82f6",
    onConfirm: () => {},
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.phone || form.phone.length < 7) newErrors.phone = "Enter a valid phone number";
    if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: "+" + form.phone.replace(/\D/g, ""),
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setAlertConfig({
            isOpen: true,
            title: "Registration Failed",
            text: data.error || "Something went wrong",
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor: "#d1d5db",
            onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
          });
          return;
        }

        setAlertConfig({
          isOpen: true,
          title: "Registration Successful!",
          text: "Please log in with your new credentials.",
          icon: "success",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#EF4444",
          onConfirm: () => {
            setAlertConfig(prev => ({ ...prev, isOpen: false }));
            setIsLoginModalOpen(true);
          },
        });

        setForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
      } catch (error) {
        setAlertConfig({
          isOpen: true,
          title: "Registration Failed",
          text: "Server error. Please try again.",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor: "#d1d5db",
          onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 font-sans">
      {/* Custom SweetAlert */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center animate-in fade-in zoom-in duration-200">
            {alertConfig.icon === "success" && (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            )}
            {alertConfig.icon === "error" && (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{alertConfig.title}</h2>
            <p className="text-gray-600 text-center mb-6">{alertConfig.text}</p>
            <button
              onClick={alertConfig.onConfirm}
              style={{ backgroundColor: alertConfig.confirmButtonColor || "#3b82f6" }}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition-transform active:scale-95 hover:brightness-95"
            >
              {alertConfig.confirmButtonText || "OK"}
            </button>
          </div>
        </div>
      )}

      {/* Register Card */}
      <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          Create an Account
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:gap-4 text-black">

          {/* NAME */}
          <div className="relative flex items-center">
            <User className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.name}</p>}

          {/* EMAIL */}
          <div className="relative flex items-center">
            <Mail className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.email}</p>}

          {/* PHONE */}
          <div>
            <PhoneInput
              country={"bd"}
              value={form.phone}
              onChange={(value) => {
                setForm({ ...form, phone: value });
                setErrors({ ...errors, phone: "" });
              }}
              inputProps={{ name: "phone", required: true }}
              containerClass="w-full"
              inputClass="!w-full !h-10 !pl-12 sm:!h-11 !pl-3 !pr-3 !text-sm sm:!text-base !rounded-lg !border !border-gray-300 focus:!outline-none focus:!ring-2 focus:!ring-red-500/20 focus:!border-red-500"
              buttonClass="!border-r !border-gray-300"
              dropdownClass="bg-white text-black rounded"
            />
            {errors.phone && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* PASSWORD */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.password}</p>}

          {/* CONFIRM PASSWORD */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="bg-red-600 text-white py-2 sm:py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm sm:text-base shadow-lg shadow-red-500/30 active:scale-[0.98] transition-all mt-2"
          >
            Register
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
          Already have an account?
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-red-600 hover:text-red-700 font-semibold ml-1"
          >
            Login
          </button>
        </p>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialEmail={form.email}
      />
    </div>
  );
}
