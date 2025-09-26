"use client";

import { useEffect, useState } from "react";

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
      className="bg-white border border-red-200 rounded-lg shadow p-4 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-orange-400">

        {/* Blood Group */}
        <div>
          <label htmlFor="bloodGroup" className="block text-red-700 font-medium mb-1">
            Blood Group
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={criteria.bloodGroup}
            onChange={handleChange}
            className="w-full border border-red-300 rounded px-3 py-2 bg-white text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
          >
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        

        {/* District */}
        <div>
          <label htmlFor="district" className="block text-red-700 font-medium mb-1">
            District
          </label>
          <select
            id="district"
            name="district"
            value={criteria.district}
            onChange={handleChange}
            className="w-full border border-red-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thana / Upazila */}
        <div>
          <label htmlFor="thana" className="block text-red-700 font-medium mb-1">
            Thana / Upazila
          </label>
          <select
            id="thana"
            name="thana"
            value={criteria.thana}
            onChange={handleChange}
            disabled={!criteria.district}
            className="w-full border border-red-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
          >
            <option value="">All Upazilas</option>
            {upazilas.map((upa) => (
              <option key={upa.id} value={upa.name}>
                {upa.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Search */}
        <div>
          <label htmlFor="search" className="block text-red-700 font-medium mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={criteria.search}
            onChange={handleChange}
            placeholder="Name, phone, notes..."
            className="w-full border border-red-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm text-orange-400"
          />
        </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded hover:bg-gray-200 transition"
        >
          Reset
        </button>
        {/* <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Filter
        </button> */}
      </div>
    </form>
  );
}
