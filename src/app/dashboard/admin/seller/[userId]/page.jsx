"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SellerDetailsPage() {
  const params = useParams();
  const { userId } = params;

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!seller) return <p className="text-center mt-10 text-red-500">Seller not found</p>;

  return (
    <div className="max-w-5xl text-black mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
        {seller.name} <span className="text-gray-700">- {seller.shopName}</span>
      </h1>

      {/* Seller Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-medium text-gray-800">{seller.email}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <p className="text-gray-500 text-sm">Status</p>
          <p className={`font-medium ${seller.status === "approved" ? "text-green-600" : "text-red-600"}`}>
            {seller.status}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <p className="text-gray-500 text-sm"># Products</p>
          <p className="font-medium text-gray-800">{seller.products}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <p className="text-gray-500 text-sm"># Orders</p>
          <p className="font-medium text-gray-800">{seller.orders}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded shadow-sm col-span-2 md:col-span-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="font-medium text-gray-800 text-xl">${seller.revenue?.toFixed(2) || 0}</p>
        </div>
      </div>

      {/* Products Table */}
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Product Name</th>
              <th className="border px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {seller.productList?.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{p.name}</td>
                <td className="border px-4 py-2">${p.price}</td>
              </tr>
            )) || (
              <tr>
                <td className="border px-4 py-2" colSpan={2}>No products</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Orders Table */}
      <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-6">
        {seller.orderList?.map((o) => (
          <div key={o._id} className="bg-gray-50 p-4 rounded shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-gray-800">Order #{o._id}</p>
              <p className={`font-semibold ${o.status === "pending" ? "text-yellow-600" : o.status === "shipped" ? "text-blue-600" : "text-green-600"}`}>
                {o.status}
              </p>
            </div>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Product ID</th>
                  <th className="border px-4 py-2 text-left">Qty</th>
                  <th className="border px-4 py-2 text-left">Price</th>
                  <th className="border px-4 py-2 text-left">Delivery</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map(item => (
                  <tr key={item.productId} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.productId}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">${item.price}</td>
                    <td className="border px-4 py-2">${item.deliveryCharge}</td>
                    <td className="border px-4 py-2 font-semibold">${item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right mt-2 font-medium text-gray-800">Order Total: ${o.total.toFixed(2)}</p>
          </div>
        )) || <p>No orders</p>}
      </div>
    </div>
  );
}
