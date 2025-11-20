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
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 lg:table table-auto">
            <thead className="bg-gray-100 text-black hidden lg:table-header-group">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Shop Name</th>
                <th className="border p-2 text-left">Referral Code</th>
                <th className="border p-2 text-left">Payment Method</th>
                <th className="border p-2 text-left">Transaction ID</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="block lg:table-row-group">
              {applications.map((app) => (
                <tr key={app._id} className="block lg:table-row mb-4 lg:mb-0 border-b lg:border-none hover:bg-gray-50 flex flex-col lg:table-row">
                  <td className="block lg:table-cell border p-2 before:content-['Name:'] before:font-bold before:mr-2 lg:before:content-none">{app.name}</td>
                  <td className="block lg:table-cell border p-2 before:content-['Email:'] before:font-bold before:mr-2 lg:before:content-none">{app.email}</td>
                  <td className="block lg:table-cell border p-2 before:content-['Shop_Name:'] before:font-bold before:mr-2 lg:before:content-none">{app.shopName}</td>
                  <td className="block lg:table-cell border p-2 before:content-['Referral_Code:'] before:font-bold before:mr-2 lg:before:content-none">{app.referralCode}</td>
                  <td className="block lg:table-cell border p-2 before:content-['Payment_Method:'] before:font-bold before:mr-2 lg:before:content-none">{app.paymentDetails?.method || 'N/A'}</td>
                  <td className="block lg:table-cell border p-2 before:content-['Transaction_ID:'] before:font-bold before:mr-2 lg:before:content-none">{app.paymentDetails?.transactionId || 'N/A'}</td>
                  <td className={`block lg:table-cell border p-2 font-medium before:content-['Status:'] before:font-bold before:mr-2 lg:before:content-none ${
                    app.status === "approved"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}>
                    {app.status}
                  </td>
                  <td className="block lg:table-cell border p-2 text-center before:content-['Actions:'] before:font-bold before:mr-2 lg:before:content-none">
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
                      {app.paymentDetails?.proofUrl && (
                        <a
                          href={app.paymentDetails.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          View Proof
                        </a>
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
        </div>
      )}
    </div>
  );
}