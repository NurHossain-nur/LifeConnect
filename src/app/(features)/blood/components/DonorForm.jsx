"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

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

/**
 * @typedef {Object} District
 * @property {number} id
 * @property {string} name_en
 * @property {string} [name_bn]
 */

/**
 * @typedef {Object} Upazila
 * @property {number} id
 * @property {string} name_en
 * @property {string} [name_bn]
 */

export default function DonorForm() {
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

  // Fetch all districts on mount
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

  // When district changes, fetch upazilas for that district
  useEffect(() => {
    if (!selectedDistrictId) {
      setUpazilas([]);
      return;
    }

    const selectedDistrict = districts.find(
    (dist) => dist.name === selectedDistrictId
  );

  if (!selectedDistrict) {
    setUpazilas([]);
    return;
  }

    const fetchUpazilas = async () => {
      try {
        const res = await fetch(
          `https://bdapis.vercel.app/geo/v2.0/upazilas/${selectedDistrict.id}`
        );
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

    console.log("Submitting data:", data);

    try {
      const res = await fetch("/api/blood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to register donor");
      }

      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-red-200 shadow-xl rounded-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-red-600 text-center mb-6">
          Donor Registration
        </h2>

        {errorMsg && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 shadow text-sm">
            {errorMsg}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 shadow text-sm">
            Donor registered successfully!
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-orange-400">
            {/* User ID */}
            <div>
              <label
                htmlFor="userId"
                className="block font-medium text-red-700 mb-1"
              >
                User ID (Mobile Number) *
              </label>
              <input
                id="userId"
                placeholder="e.g. 01XXXXXXXXX"
                {...register("userId", {
                  required: "User ID is required",
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: "Enter a valid Bangladeshi mobile number",
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block font-medium text-red-700 mb-1"
              >
                Full Name *
              </label>
              <input
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block font-medium text-red-700 mb-1"
              >
                Gender *
              </label>
              <select
                id="gender"
                {...register("gender", { required: "Gender is required" })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label
                htmlFor="bloodGroup"
                className="block font-medium text-red-700 mb-1"
              >
                Blood Group *
              </label>
              <select
                id="bloodGroup"
                {...register("bloodGroup", {
                  required: "Blood group is required",
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              >
                <option value="" className="text-orange-400">
                  Select Blood Group
                </option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                  (bg) => (
                    <option key={bg} value={bg} className="text-orange-400">
                      {bg}
                    </option>
                  )
                )}
              </select>
              {errors.bloodGroup && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block font-medium text-red-700 mb-1"
              >
                Date of Birth *
              </label>
              <input
                id="dob"
                type="date"
                {...register("dob", {
                  required: "Date of Birth is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    return (
                      selectedDate < today || "Date of Birth must be in the past"
                    );
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact"
                className="block font-medium text-red-700 mb-1"
              >
                Contact Number *
              </label>
              <input
                id="contact"
                placeholder="Active contact number"
                {...register("contact", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9+\- ]+$/,
                    message: "Invalid contact number",
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div>
              <label
                htmlFor="whatsapp"
                className="block font-medium text-red-700 mb-1"
              >
                WhatsApp Number (optional)
              </label>
              <input
                id="whatsapp"
                placeholder="WhatsApp number"
                {...register("whatsapp", {
                  pattern: {
                    value: /^[0-9+\- ]*$/,
                    message: "Invalid WhatsApp number",
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-red-700 mb-1"
              >
                Email Address (optional)
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                {...register("email", {
                  pattern: {
                    value:
                      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="block font-medium text-red-700 mb-1"
              >
                District *
              </label>
              <select
                id="district"
                {...register("district", { required: "District is required" })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white  shadow-sm"
              >
                <option value="">Select District</option>
                {districts.map((dist) => (
                  <option key={dist.name} value={dist.name}>
                    {dist.name_en || dist.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* Thana / Upazila */}
            <div>
              <label
                htmlFor="thana"
                className="block font-medium text-red-700 mb-1"
              >
                Thana / Upazila *
              </label>
              <select
                id="thana"
                {...register("thana", { required: "Thana is required" })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white  shadow-sm"
                disabled={!selectedDistrictId}
              >
                <option value="">Select Thana</option>
                {upazilas.map((upa) => (
                  <option key={upa.id} value={upa.name}>
                    {upa.name_en || upa.name}
                  </option>
                ))}
              </select>
              {errors.thana && (
                <p className="text-red-500 text-sm mt-1">{errors.thana.message}</p>
              )}
            </div>

            {/* Profession */}
            <div className="sm:col-span-2">
              <label
                htmlFor="profession"
                className="block font-medium text-red-700 mb-1"
              >
                Profession *
              </label>
              <select
                id="profession"
                {...register("profession", { required: "Profession is required" })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white  shadow-sm"
              >
                <option value="">Select Profession</option>
                {professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.profession && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>

            {/* Last Donation Date */}
            <div>
              <label
                htmlFor="lastDonation"
                className="block font-medium text-red-700 mb-1"
              >
                Last Donation Date (optional)
              </label>
              <input
                id="lastDonation"
                type="date"
                {...register("lastDonation", {
                  validate: (value) => {
                    if (!value) return true;
                    const selectedDate = new Date(value);
                    const today = new Date();
                    return (
                      selectedDate <= today ||
                      "Last Donation Date cannot be in the future"
                    );
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.lastDonation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastDonation.message}
                </p>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <label
                htmlFor="emergencyContact"
                className="block font-medium text-red-700 mb-1"
              >
                Emergency Contact Number (optional)
              </label>
              <input
                id="emergencyContact"
                placeholder="Emergency contact number"
                {...register("emergencyContact", {
                  pattern: {
                    value: /^[0-9+\- ]*$/,
                    message: "Invalid emergency contact number",
                  },
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
              {errors.emergencyContact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emergencyContact.message}
                </p>
              )}
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label
                htmlFor="preferredContact"
                className="block font-medium text-red-700 mb-1"
              >
                Preferred Contact Method *
              </label>
              <select
                id="preferredContact"
                {...register("preferredContact", {
                  required: "Preferred contact method is required",
                })}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              >
                <option value="">Select Contact Method</option>
                {contactMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {errors.preferredContact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.preferredContact.message}
                </p>
              )}
            </div>

            {/* Health Conditions / Medical History */}
            <div className="sm:col-span-2">
              <label
                htmlFor="healthConditions"
                className="block font-medium text-red-700 mb-1"
              >
                Health Conditions / Medical History (optional)
              </label>
              <textarea
                id="healthConditions"
                rows={3}
                placeholder="Any relevant medical info"
                {...register("healthConditions")}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="block font-medium text-red-700 mb-1"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any additional info"
                {...register("notes")}
                className="w-full border border-red-300 focus:ring-2 focus:ring-red-500 rounded px-3 py-2 bg-white shadow-sm"
              />
            </div>

            {/* Consent */}
            <div className="sm:col-span-2 flex items-center">
              <input
                id="consent"
                type="checkbox"
                {...register("consent", {
                  required: "You must agree to the terms",
                })}
                className="mr-2 accent-red-600"
              />
              <label htmlFor="consent" className="text-red-700 font-medium">
                I agree to the terms and privacy policy *
              </label>
            </div>
            {errors.consent && (
              <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 text-white font-bold px-6 py-2 rounded shadow hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
