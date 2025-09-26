"use client";

import { useState } from "react";

const mockItems = [
  {
    id: 1,
    title: "Blood Donation Camp T-Shirt",
    price: "$15",
    image: "https://source.unsplash.com/400x300/?tshirt,red",
  },
  {
    id: 2,
    title: "Reusable Blood Bag (Dummy)",
    price: "$25",
    image: "https://source.unsplash.com/400x300/?medical,equipment",
  },
  {
    id: 3,
    title: "Donor Appreciation Mug",
    price: "$10",
    image: "https://source.unsplash.com/400x300/?mug,donor",
  },
  {
    id: 4,
    title: "Badge of Honor - Blood Donor",
    price: "$5",
    image: "https://source.unsplash.com/400x300/?badge",
  },
  // Add more items here
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");

  const filteredItems = mockItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-4">
          🛍️ Marketplace
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore unique items and gear for blood donors and volunteers!
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 shadow"
          />
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No items found.</p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-red-500 font-medium mt-1">{item.price}</p>
                  <button className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
