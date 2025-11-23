"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Icons
const Icons = {
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Link: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Empty: () => <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
};

export default function SellerRequestsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // To lock buttons during action

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

  const handleAction = async (userId, action) => {
    const isApprove = action === "approve";
    
    const result = await Swal.fire({
      title: isApprove ? "Approve Seller?" : "Reject Seller?",
      text: isApprove 
        ? "This user will be able to start selling products." 
        : "This user's application will be rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10B981" : "#EF4444",
      confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Reject",
    });

    if (!result.isConfirmed) return;

    setProcessingId(userId);

    try {
      const res = await fetch("/api/marketplace/seller/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success!", data.message, "success");
        fetchApplications(); 
      } else {
        Swal.fire("Error", data.error || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Action error:", err);
      Swal.fire("Error", "Network request failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // --- Skeleton Loader ---
  if (loading) return (
    <div className="max-w-6xl mx-auto mt-10 p-6 space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-6 mx-auto"></div>
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg w-full"></div>
        ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Seller Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Manage incoming requests from sellers</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            Total: {applications.length}
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center animate-fadeIn">
           <Icons.Empty />
           <h3 className="mt-4 text-lg font-semibold text-gray-700">No pending applications</h3>
           <p className="text-gray-500 text-sm">All seller requests have been processed.</p>
        </div>
      ) : (
        <>
          {/* --- Desktop View (Table) --- */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {app.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{app.shopName}</div>
                      <div className="text-xs text-gray-500">Ref: {app.referralCode || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{app.paymentDetails?.method || 'N/A'}</div>
                      <div className="text-xs font-mono text-gray-500">{app.paymentDetails?.transactionId || '---'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                         <ActionButtons 
                            app={app} 
                            handleAction={handleAction} 
                            processingId={processingId} 
                        />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Mobile View (Cards) --- */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
             {applications.map((app) => (
                <div key={app._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 animate-slideUp">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {app.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{app.name}</h3>
                                <p className="text-xs text-gray-500">{app.email}</p>
                            </div>
                        </div>
                        <StatusBadge status={app.status} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Shop Name:</span>
                            <span className="font-medium text-gray-800">{app.shopName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Payment:</span>
                            <span className="font-medium text-gray-800 uppercase">{app.paymentDetails?.method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Trx ID:</span>
                            <span className="font-mono text-gray-800">{app.paymentDetails?.transactionId}</span>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-gray-100">
                        <ActionButtons 
                            app={app} 
                            handleAction={handleAction} 
                            processingId={processingId}
                            isMobile={true}
                        />
                    </div>
                </div>
             ))}
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        .animate-fadeIn {
           animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// --- Helper Components ---

function StatusBadge({ status }) {
    const styles = {
        approved: "bg-green-100 text-green-800 border-green-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
}

function ActionButtons({ app, handleAction, processingId, isMobile = false }) {
    const isProcessing = processingId === app.userId;

    return (
        <div className={`flex items-center gap-2 ${isMobile ? "w-full justify-end" : "justify-center"}`}>
            {app.status === "pending" && (
                <>
                    <button
                        onClick={() => handleAction(app.userId, "approve")}
                        disabled={isProcessing}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                        title="Approve"
                    >
                       <Icons.Check /> {isMobile && "Approve"}
                    </button>
                    <button
                        onClick={() => handleAction(app.userId, "reject")}
                        disabled={isProcessing}
                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-600 transition shadow-sm disabled:opacity-50"
                        title="Reject"
                    >
                       <Icons.X /> {isMobile && "Reject"}
                    </button>
                </>
            )}
            
            {app.paymentDetails?.proofUrl && (
                <a
                    href={app.paymentDetails.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-yellow-600 transition shadow-sm"
                    title="View Payment Proof"
                >
                    <Icons.Link /> {isMobile && "Proof"}
                </a>
            )}
            
            <button
                onClick={() => window.location.href = `/dashboard/admin/seller/${app.userId}`}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition shadow-sm"
                title="View Details"
            >
               <Icons.Eye /> {isMobile && "Details"}
            </button>
        </div>
    );
}