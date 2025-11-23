"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Heart, X } from "lucide-react"; // Added icons for better UI
import DonorCard from "./components/DonorCard";
import SearchFilter from "./components/SearchFilter";
import DonorForm from "./components/DonorForm";

export default function BloodPage() {
  const [donors, setDonors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

  // Fetch donors
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

  const handleFilter = (criteria) => {
    setFilterCriteria(criteria);
    let temp = donors;

    if (criteria.name?.trim()) {
      const q = criteria.name.toLowerCase();
      temp = temp.filter((d) => d.name?.toLowerCase().includes(q));
    }
    if (criteria.bloodGroup && criteria.bloodGroup !== "All") {
      temp = temp.filter((d) => d.bloodGroup === criteria.bloodGroup);
    }
    if (criteria.district) {
      temp = temp.filter((d) => d.district === criteria.district);
    }
    if (criteria.thana) {
      temp = temp.filter((d) => d.thana === criteria.thana);
    }
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* --- Hero Section --- */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3">
              <Heart className="w-8 h-8 fill-white text-white animate-pulse" />
              Find a Blood Donor
            </h1>
            <p className="mt-2 text-red-100 text-sm md:text-base">
              Connect with heroes saving lives in your area.
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Register as Donor
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        
        {/* --- Filter Section --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 text-gray-600 font-semibold border-b pb-2">
            <Search className="w-5 h-5 text-red-500" />
            Filter Search
          </div>
          <SearchFilter onFilter={handleFilter} />
        </div>

        {/* --- Donors Grid --- */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
              <Search className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No donors found matching your criteria.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-red-500 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((donor) => (
                <div key={donor.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                  <DonorCard donor={donor} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Donor Registration Modal --- */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-fadeInScale">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Become a Donor
                </h2>
                <p className="text-xs text-gray-500 mt-1">Fill in your details to help save lives.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <DonorForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}