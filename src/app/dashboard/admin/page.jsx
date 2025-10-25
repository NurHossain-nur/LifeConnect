"use client"; // Only needed in Next.js App Router

import { useState } from "react";

export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
       <h2>OverView</h2>
    </div>
  );
}
