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
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
        {seller.name} - {seller.shopName}
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <p><strong>Email:</strong> {seller.email}</p>
        <p><strong>Status:</strong> {seller.status}</p>
        <p><strong># Products:</strong> {seller.products}</p>
        <p><strong># Orders:</strong> {seller.orders}</p>
        <p><strong>Total Revenue:</strong> ${seller.revenue?.toFixed(2) || 0}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Products</h2>
      <ul className="list-disc pl-5 mb-4">
        {seller.productList?.map((p) => (
          <li key={p._id}>{p.name} - ${p.price}</li>
        )) || <li>No products</li>}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
      <ul className="list-disc pl-5">
        {seller.orderList?.map((o) => (
          <li key={o._id}>
            Order #{o._id} - ${o.total} - {o.status}
          </li>
        )) || <li>No orders</li>}
      </ul>
    </div>
  );
}
