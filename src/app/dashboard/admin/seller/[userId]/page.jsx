"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Icons
const Icons = {
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export default function SellerDetailsPage() {
  const params = useParams();
  const { userId } = params;

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchSellerDetails();
  }, [userId]);

  const fetchSellerDetails = async () => {
    try {
      const res = await fetch(`/api/marketplace/seller/${userId}`);
      const data = await res.json();
      setSeller(data.seller);
    } catch (err) {
      console.error("Error fetching seller details:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Skeleton Loading ---
  if (loading) return (
    <div className="max-w-7xl mx-auto mt-8 p-6 animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="h-64 bg-gray-200 rounded-xl"></div>
             <div className="h-64 bg-gray-200 rounded-xl col-span-2"></div>
        </div>
    </div>
  );

  if (!seller) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <h2 className="text-2xl font-bold">Seller not found</h2>
        <p>The requested seller ID does not exist.</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* --- Header Section --- */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        {/* Banner */}
        <div className="h-48 md:h-64 w-full bg-gray-200 relative overflow-hidden">
          <img 
            src={seller.bannerImage || "https://via.placeholder.com/1500x500?text=No+Banner"} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
           <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-6">
              {/* Profile Pic */}
              <img 
                src={seller.profileImage || "/default-avatar.png"} 
                alt="Profile" 
                className="w-32 h-32 rounded-xl border-4 border-white shadow-lg bg-white object-cover z-10"
              />
              
              {/* Name & Actions */}
              <div className="flex-1 text-white md:text-gray-900 pb-2">
                 <h1 className="text-3xl font-bold drop-shadow-md md:drop-shadow-none">{seller.shopName}</h1>
                 <p className="opacity-90 md:opacity-100 font-medium">{seller.name}</p>
                 <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${
                    seller.status === "approved" 
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-red-100 text-red-700 border-red-200"
                 }`}>
                    {seller.status}
                 </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 w-full md:w-auto bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4 md:mt-0">
                 <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase">Revenue</p>
                    <p className="text-lg font-bold text-green-600">৳{seller.revenue?.toFixed(0) || 0}</p>
                 </div>
                 <div className="text-center border-l">
                    <p className="text-xs text-gray-500 uppercase">Orders</p>
                    <p className="text-lg font-bold text-gray-800">{seller.orders}</p>
                 </div>
                 <div className="text-center border-l">
                    <p className="text-xs text-gray-500 uppercase">Products</p>
                    <p className="text-lg font-bold text-gray-800">{seller.products}</p>
                 </div>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex gap-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
              {['overview', 'products', 'orders', 'financials'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-2 text-sm font-medium capitalize whitespace-nowrap transition-colors relative ${
                    activeTab === tab 
                    ? "text-blue-600" 
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slideUp">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Col: Details */}
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">About Seller</h3>
                   <p className="text-gray-600 mb-6 leading-relaxed">{seller.description || "No description provided."}</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                         <Icons.Mail /> <span>{seller.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                         <Icons.Phone /> <span>{seller.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg md:col-span-2">
                         <Icons.Map /> <span>{seller.address}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Payment Information</h3>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                         <span className="text-gray-500 block text-xs uppercase">Method</span>
                         <span className="font-medium capitalize">{seller.paymentDetails?.method || "N/A"}</span>
                      </div>
                      <div>
                         <span className="text-gray-500 block text-xs uppercase">Sender No</span>
                         <span className="font-medium">{seller.paymentDetails?.senderNumber || "N/A"}</span>
                      </div>
                      <div className="col-span-2">
                         <span className="text-gray-500 block text-xs uppercase">Transaction ID</span>
                         <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{seller.paymentDetails?.transactionId || "N/A"}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Col: Proof Image */}
             <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                   <h3 className="font-bold text-gray-800 mb-4 text-lg">Payment Proof</h3>
                   {seller.paymentDetails?.proofUrl ? (
                     <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                       <img 
                         src={seller.paymentDetails.proofUrl} 
                         alt="Proof" 
                         className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                       />
                       <a 
                         href={seller.paymentDetails.proofUrl} 
                         target="_blank" 
                         className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium"
                       >
                         View Full Image
                       </a>
                     </div>
                   ) : (
                     <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm">No Proof Uploaded</div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                         <th className="p-4 w-1/2">Product Name</th>
                         <th className="p-4">Category</th>
                         <th className="p-4 text-right">Price</th>
                         <th className="p-4 text-center">Stock</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-sm">
                      {seller.productList?.map((p) => {
                         const discount = p.discount || 0;
                         const finalPrice = p.price - discount;
                         return (
                           <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                 <p className="font-semibold text-gray-800 text-base">{p.name}</p>
                                 {discount > 0 && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                                       Discount Available
                                    </span>
                                 )}
                              </td>
                              <td className="p-4 text-gray-500">{p.category || 'General'}</td>
                              <td className="p-4 text-right">
                                 {discount > 0 ? (
                                    <div className="flex flex-col items-end">
                                       <span className="font-bold text-gray-900 text-base">৳{finalPrice.toFixed(2)}</span>
                                       <div className="flex items-center gap-1 text-xs">
                                          <span className="text-gray-400 line-through">৳{p.price}</span>
                                          <span className="text-red-500 font-medium">(-৳{discount})</span>
                                       </div>
                                    </div>
                                 ) : (
                                    <span className="font-bold text-gray-700">৳{p.price}</span>
                                 )}
                              </td>
                              <td className={`p-4 text-center font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                 {p.stock > 0 ? p.stock : "Out of Stock"}
                              </td>
                           </tr>
                         );
                      }) || <tr><td colSpan="4" className="p-6 text-center text-gray-500">No products listed.</td></tr>}
                   </tbody>
                </table>
              </div>
           </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === "orders" && (
           <div className="space-y-4">
              {seller.orderList?.length > 0 ? seller.orderList.map((o) => (
                <div key={o._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-dashed pb-3">
                      <div>
                         <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            Order #{o._id.slice(-6)}
                            <span className={`px-2 py-0.5 text-[10px] uppercase rounded-full ${
                               o.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                               o.status === "shipped" ? "bg-blue-100 text-blue-700" : 
                               "bg-green-100 text-green-700"
                            }`}>{o.status}</span>
                         </h4>
                         <p className="text-xs text-gray-400 mt-1">Placed on {new Date().toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-lg text-gray-900 mt-2 sm:mt-0">Total: ৳{o.total.toFixed(2)}</p>
                   </div>
                   
                   {/* Order Items Grid */}
                   <div className="grid gap-3">
                      {o.items.map(item => {
                         // Calculate price logic for order view
                         const itemDiscount = item.discount || 0;
                         const effectivePrice = item.price - itemDiscount;
                         
                         return (
                           <div key={item.productId} className="flex flex-col sm:flex-row justify-between text-sm p-4 bg-gray-50 rounded-lg gap-3 sm:gap-0">
                              <div className="flex flex-col">
                                 {/* Product Name */}
                                 <span className="font-bold text-gray-800 text-base mb-1">
                                    {item.name || "Product Name Unavailable"}
                                 </span>
                                 <span className="text-[10px] text-gray-400 font-mono uppercase mb-1">ID: {item.productId.slice(-6)}</span>
                                 
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border">Qty: {item.quantity}</span>
                                    <span className="text-xs text-gray-500">x</span>
                                    {itemDiscount > 0 ? (
                                       <div className="flex items-center gap-1">
                                          <span className="font-bold text-gray-900">৳{effectivePrice}</span>
                                          <span className="text-gray-400 line-through text-xs">৳{item.price}</span>
                                       </div>
                                    ) : (
                                       <span className="font-bold text-gray-900">৳{item.price}</span>
                                    )}
                                 </div>
                              </div>

                              <div className="flex flex-col sm:text-right mt-2 sm:mt-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                                 <span className="font-semibold text-gray-800 text-lg">৳{item.total}</span>
                                 <span className="text-xs text-gray-500">+ ৳{item.deliveryCharge} delivery</span>
                                 {itemDiscount > 0 && (
                                    <span className="text-[10px] text-green-600 font-bold mt-1">
                                       Saved ৳{itemDiscount * item.quantity}
                                    </span>
                                 )}
                              </div>
                           </div>
                         );
                      })}
                   </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-500">No orders found.</div>
              )}
           </div>
        )}

        {/* 4. FINANCIALS TAB */}
        {activeTab === "financials" && (
           <div className="grid grid-cols-1 gap-8">
              {/* Referral Info */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 shadow-lg">
                 <h3 className="text-lg font-bold opacity-90 mb-4">Referral Program</h3>
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-sm opacity-75 uppercase">Referral Code</p>
                       <p className="text-3xl font-mono font-bold tracking-wider mt-1">{seller.referralCode || "N/A"}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm opacity-75 uppercase">Referred By</p>
                       <p className="font-medium mt-1">{seller.referredBy || "Direct Sign-up"}</p>
                    </div>
                 </div>
              </div>

              {/* Commissions Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <h3 className="p-4 font-bold text-gray-800 border-b">Commissions History</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                          <tr>
                             <th className="p-4">Date</th>
                             <th className="p-4">Ref User ID</th>
                             <th className="p-4">Amount</th>
                             <th className="p-4">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-sm">
                          {seller.commissions?.length > 0 ? seller.commissions.map((comm, i) => (
                             <tr key={i} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500">{new Date(comm.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 font-mono text-xs">{comm.referredUserId}</td>
                                <td className="p-4 font-bold text-green-600">+৳{comm.amount}</td>
                                <td className="p-4"><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">{comm.status}</span></td>
                             </tr>
                          )) : (
                             <tr><td colSpan="4" className="p-8 text-center text-gray-500">No commission history available.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}