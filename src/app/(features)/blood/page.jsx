"use client";

import { useState, useEffect } from "react";
import DonorCard from "./components/DonorCard";
import SearchFilter from "./components/SearchFilter";
import DonorForm from "./components/DonorForm";
// import dbConnect from "@/lib/db";

export default  function BloodPage() {
  const [donors, setDonors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // <-- toggle state

  const [filterCriteria, setFilterCriteria] = useState({
  name: "",
  bloodGroup: "All",
  district: "",
  thana: "",
  search: "",
});

  const buildQueryString = (criteria) => {
    const params = new URLSearchParams();  

    if (criteria.name) params.append("name", criteria.name);
    if (criteria.bloodGroup && criteria.bloodGroup !== "All") params.append("bloodGroup", criteria.bloodGroup);
    if (criteria.district) params.append("district", criteria.district);
    if (criteria.thana) params.append("thana", criteria.thana);
    if (criteria.search) params.append("search", criteria.search);     

    return params.toString();
  };

  // Fetch donors from API on mount
  useEffect(() => {
    async function fetchDonors() {
      try {
        const queryString = buildQueryString(filterCriteria);
        const res = await fetch(`/api/blood?${queryString}`);
        const data = await res.json();
        setDonors(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching donors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDonors();
  }, []);

    

//   console.log(donors);

  const handleFilter = (criteria) => {
    setFilterCriteria(criteria);

  let temp = donors;

  // Filter by name
  if (criteria.name?.trim()) {
    const q = criteria.name.toLowerCase();
    temp = temp.filter((d) => d.name?.toLowerCase().includes(q));
  }

  // Filter by blood group
  if (criteria.bloodGroup && criteria.bloodGroup !== "All") {
    temp = temp.filter((d) => d.bloodGroup === criteria.bloodGroup);
  }

  // Filter by district
  if (criteria.district) {
    temp = temp.filter((d) => d.district === criteria.district);
  }

  // Filter by thana/upazila
  if (criteria.thana) {
    temp = temp.filter((d) => d.thana === criteria.thana);
  }

  // Global search: name, phone, notes
  if (criteria.search?.trim()) {
    const q = criteria.search.toLowerCase();
    temp = temp.filter((d) =>
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.phone && d.phone.toLowerCase().includes(q)) ||
      (d.notes && d.notes.toLowerCase().includes(q))
    );
  }

  setFiltered(temp);
};

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-4">Find Donors</h1>

      {/* Add Register Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-500 text-white font-semibold px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Register as Donor
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <SearchFilter onFilter={handleFilter} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
        <p className="text-center">Loading donors...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center">No donors found.</p>
      ) : (
        <div className=" mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      )}
      </div>

      {/* Donor Form Modal */}
      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-4">
    <div className="relative bg-white text-gray-800 w-full max-w-4xl max-h-screen overflow-y-auto rounded-lg shadow-lg p-4 sm:p-6">
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-xl font-semibold mb-4 mt-2 text-red-600">
        Register as Donor
      </h2>
      <DonorForm />
    </div>
  </div>
)}
    </div>
  );
}
