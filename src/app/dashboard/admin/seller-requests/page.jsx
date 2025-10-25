"use client";

import { useEffect, useState } from "react";

export default function SellerRequestsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all applications on load
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/marketplace/seller/list");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Approve / Reject
  const handleAction = async (userId, action) => {
    const confirmMsg =
      action === "approve"
        ? "Approve this seller application?"
        : "Reject this seller application?";
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/marketplace/seller/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchApplications(); // Refresh list
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl text-black mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
        Seller Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-center text-gray-500">No applications found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Shop Name</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="border p-2">{app.name}</td>
                <td className="border p-2">{app.email}</td>
                <td className="border p-2">{app.shopName}</td>
                <td
                  className={`border p-2 font-medium ${
                    app.status === "approved"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}
                >
                  {app.status}
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(app.userId, "approve")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(app.userId, "reject")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => window.location.href = `/dashboard/admin/seller/${app.userId}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
