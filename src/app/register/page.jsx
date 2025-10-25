"use client";

import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import LoginButton from "../components/LoginButton";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",          // Added phone field
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  // Handle change specifically for phone input
  const handlePhoneChange = (value) => {
    setForm({ ...form, phone: value });
    setErrors({ ...errors, phone: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.phone || !/^\+?[0-9]{7,15}$/.test(form.phone))
      newErrors.phone = "Enter a valid phone number";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,    // send phone field to API
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Registration failed");
        } else {
          alert("Registration successful!");
          setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl mb-4">Create an Account</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label" htmlFor="name">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="text-sm text-error mt-1">{errors.email}</p>}
            </div>

            {/* Phone Input with country code selector */}
            <div>
              <label className="label" htmlFor="phone">
                <span className="label-text">Phone Number</span>
              </label>
              <PhoneInput
                country={'bd'} // default country to Bangladesh
                value={form.phone}
                onChange={handlePhoneChange}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: false,
                }}
                containerClass={`w-full bg-white ${errors.phone ? 'border-error' : 'border'} rounded-lg`}
                inputClass="w-full h-11 px-3 text-black  rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                buttonClass="border-r  border-gray-300"
                dropdownClass="bg-base-100 text-black rounded-2xl"
              />
              {errors.phone && <p className="text-sm text-error mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && <p className="text-sm text-error mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
              />
              {errors.confirmPassword && <p className="text-sm text-error mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-base-content/70">
            Already have an account?{" "}
            {/* <a href="/login" className="text-primary underline">
              Log in
            </a> */}
            <LoginButton/>
          </p>
        </div>
      </div>
    </div>
  );
}
