"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { 
  User, Phone, Mail, MapPin, Calendar, Heart, 
  Briefcase, AlertTriangle, MessageSquare, FileText, 
  CheckCircle, Send, Loader2 
} from "lucide-react";

const professions = [
  "Student",
  "Doctor",
  "Engineer",
  "Teacher",
  "Government Service",
  "Business",
  "Farmer",
  "Others",
];

const genders = ["Male", "Female", "Other"];
const contactMethods = ["Phone", "WhatsApp", "Email"];

export default function DonorForm({ onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedDistrictId = watch("district");

  // Fetch districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch("https://bdapis.vercel.app/geo/v2.0/districts");
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        setDistricts(data.data || data);
      } catch (err) {
        console.error("Error loading districts:", err);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch upazilas
  useEffect(() => {
    if (!selectedDistrictId) {
      setUpazilas([]);
      return;
    }
    const selectedDistrict = districts.find((dist) => dist.name === selectedDistrictId);
    if (!selectedDistrict) {
      setUpazilas([]);
      return;
    }
    const fetchUpazilas = async () => {
      try {
        const res = await fetch(`https://bdapis.vercel.app/geo/v2.0/upazilas/${selectedDistrict.id}`);
        if (!res.ok) throw new Error("Failed to fetch upazilas");
        const data = await res.json();
        setUpazilas(data.data || data);
      } catch (err) {
        console.error("Error loading upazilas:", err);
        setUpazilas([]);
      }
    };
    fetchUpazilas();
  }, [selectedDistrictId, districts]);

  const onSubmit = async (data) => {
    setErrorMsg("");
    setSuccess(false);
    try {
      const res = await fetch("/api/blood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to register donor");
      
      setSuccess(true);
      reset();
      // Optional: Close modal after delay if onClose prop provided
      if(onClose) setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    }
  };

  // --- Reusable Input Wrapper ---
  const InputGroup = ({ label, error, icon: Icon, children }) => (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fadeIn flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {error.message}
        </p>
      )}
    </div>
  );

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all hover:bg-white hover:border-gray-300 placeholder-gray-400";
  const selectClass = "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-white hover:border-gray-300 appearance-none";

  return (
    <div className="w-full">
      
      {/* Feedback Messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
          <AlertTriangle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
          <CheckCircle className="w-5 h-5" />
          Donor registered successfully! Thank you for being a hero.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* 1. Personal Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Full Name *" error={errors.name} icon={User}>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="e.g. John Doe"
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Date of Birth *" error={errors.dob} icon={Calendar}>
              <input
                type="date"
                {...register("dob", { 
                  required: "DOB is required",
                  validate: (v) => new Date(v) < new Date() || "Must be in the past"
                })}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Gender *" error={errors.gender} icon={User}>
              <select {...register("gender", { required: "Gender is required" })} className={selectClass}>
                <option value="">Select Gender</option>
                {genders.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </InputGroup>

            <InputGroup label="Profession *" error={errors.profession} icon={Briefcase}>
              <select {...register("profession", { required: "Profession is required" })} className={selectClass}>
                <option value="">Select Profession</option>
                {professions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </InputGroup>
          </div>
        </div>

        {/* 2. Contact Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" /> Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="User ID (Mobile) *" error={errors.userId} icon={Phone}>
              <input
                placeholder="01XXXXXXXXX"
                {...register("userId", { 
                  required: "User ID is required", 
                  pattern: { value: /^01[0-9]{9}$/, message: "Invalid BD number" } 
                })}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Contact Number *" error={errors.contact} icon={Phone}>
              <input
                placeholder="Active contact number"
                {...register("contact", { required: "Contact is required", pattern: { value: /^[0-9+\- ]+$/, message: "Invalid number" } })}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Email (Optional)" error={errors.email} icon={Mail}>
              <input
                type="email"
                placeholder="your@email.com"
                {...register("email", { pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="WhatsApp (Optional)" error={errors.whatsapp} icon={MessageSquare}>
              <input
                placeholder="WhatsApp number"
                {...register("whatsapp", { pattern: { value: /^[0-9+\- ]*$/, message: "Invalid number" } })}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Emergency Contact (Optional)" error={errors.emergencyContact} icon={AlertTriangle}>
              <input
                placeholder="Emergency number"
                {...register("emergencyContact", { pattern: { value: /^[0-9+\- ]*$/, message: "Invalid number" } })}
                className={inputClass}
              />
            </InputGroup>

            <InputGroup label="Preferred Contact *" error={errors.preferredContact} icon={Phone}>
              <select {...register("preferredContact", { required: "Required" })} className={selectClass}>
                <option value="">Select Preference</option>
                {contactMethods.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </InputGroup>
          </div>
        </div>

        {/* 3. Location */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" /> Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="District *" error={errors.district} icon={MapPin}>
              <select {...register("district", { required: "Required" })} className={selectClass}>
                <option value="">Select District</option>
                {districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </InputGroup>

            <InputGroup label="Thana / Upazila *" error={errors.thana} icon={MapPin}>
              <select 
                {...register("thana", { required: "Required" })} 
                className={`${selectClass} ${!selectedDistrictId && "opacity-50 cursor-not-allowed"}`}
                disabled={!selectedDistrictId}
              >
                <option value="">Select Thana</option>
                {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </InputGroup>
          </div>
        </div>

        {/* 4. Medical Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" /> Medical & Donation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Blood Group *" error={errors.bloodGroup} icon={Heart}>
              <select {...register("bloodGroup", { required: "Required" })} className={selectClass}>
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="Last Donation Date (Optional)" error={errors.lastDonation} icon={Calendar}>
              <input
                type="date"
                {...register("lastDonation", { 
                  validate: (v) => !v || new Date(v) <= new Date() || "Cannot be in future"
                })}
                className={inputClass}
              />
            </InputGroup>

            <div className="md:col-span-2">
              <InputGroup label="Health Conditions / Notes" error={errors.healthConditions} icon={FileText}>
                <textarea
                  rows={2}
                  placeholder="Any relevant medical history or notes..."
                  {...register("healthConditions")}
                  className={`${inputClass} resize-none h-auto`}
                />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* 5. Consent & Submit */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="consent"
                type="checkbox"
                {...register("consent", { required: "You must agree to proceed" })}
                className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consent" className="font-medium text-gray-700">I agree to the Terms & Conditions</label>
              <p className="text-gray-500">I confirm that the information provided is accurate and I consent to share my details for blood donation purposes.</p>
              {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                ${isSubmitting ? "cursor-wait" : ""}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Register as Donor
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}