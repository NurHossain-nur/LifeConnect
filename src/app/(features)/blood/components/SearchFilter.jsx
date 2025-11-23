"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Droplet, RotateCcw, Filter } from "lucide-react";

const bloodGroups = [
  "All",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

export default function SearchFilter({ onFilter }) {
  const [criteria, setCriteria] = useState({
    name: "",
    bloodGroup: "All",
    district: "",
    thana: "",
    search: "",
  });

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch("https://bdapis.vercel.app/geo/v2.0/districts");
        const data = await res.json();
        setDistricts(data.data || data);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    fetchDistricts();
  }, []);

  // Trigger filter on criteria change
  useEffect(() => {
    onFilter(criteria);
  }, [criteria]);

  // Fetch upazilas when district changes
  useEffect(() => {
    if (!criteria.district) {
      setUpazilas([]);
      return;
    }

    const districtObj = districts.find((d) => d.name === criteria.district);
    if (!districtObj) {
      setUpazilas([]);
      return;
    }

    const fetchUpazilas = async () => {
      try {
        const res = await fetch(
          `https://bdapis.vercel.app/geo/v2.0/upazilas/${districtObj.id}`
        );
        const data = await res.json();
        setUpazilas(data.data || data);
      } catch (err) {
        console.error("Error fetching upazilas:", err);
        setUpazilas([]);
      }
    };

    fetchUpazilas();
  }, [criteria.district]);

  const handleChange = (e) => {
    setCriteria((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(criteria);
  };

  const handleReset = () => {
    const reset = {
      name: "",
      bloodGroup: "All",
      district: "",
      thana: "",
      search: "",
    };
    setCriteria(reset);
    onFilter(reset);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Filter className="w-4 h-4 text-red-500" /> Filters
        </h3>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-red-500 hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Blood Group */}
        <div className="relative group">
          <label htmlFor="bloodGroup" className="sr-only">Blood Group</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Droplet className="w-4 h-4 text-red-500" />
          </div>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={criteria.bloodGroup}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-white hover:border-gray-300 appearance-none"
          >
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg === "All" ? "All Blood Groups" : bg}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* District */}
        <div className="relative group">
          <label htmlFor="district" className="sr-only">District</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <select
            id="district"
            name="district"
            value={criteria.district}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-white hover:border-gray-300 appearance-none"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Thana / Upazila */}
        <div className="relative group">
          <label htmlFor="thana" className="sr-only">Thana</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <select
            id="thana"
            name="thana"
            value={criteria.thana}
            onChange={handleChange}
            disabled={!criteria.district}
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none
              ${!criteria.district 
                ? "cursor-not-allowed opacity-60" 
                : "cursor-pointer hover:bg-white hover:border-gray-300"
              }`}
          >
            <option value="">All Areas (Thana)</option>
            {upazilas.map((upa) => (
              <option key={upa.id} value={upa.name}>
                {upa.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative group">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            id="search"
            name="search"
            value={criteria.search}
            onChange={handleChange}
            placeholder="Search by name, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 hover:bg-white hover:border-gray-300"
          />
        </div>
      </div>

      {/* Desktop Reset Button */}
      <div className="hidden md:flex justify-end mt-4 pt-3 border-t border-gray-50">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      </div>
    </form>
  );
}