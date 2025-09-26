"use client";

import DonorForm from "../components/DonorForm";

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Register as Donor</h1>
      <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <DonorForm />
      </div>
    </div>
  );
}
