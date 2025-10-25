"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          You’re not logged in 😕
        </h2>
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6 text-center">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          {user.image ? (
            <Image
              src={user.image}
              alt="User profile"
              width={100}
              height={100}
              className="rounded-full border-4 border-red-400"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-red-200 flex items-center justify-center text-4xl text-red-600 font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        {/* User Info */}
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>

        {/* Actions */}
        <div className="mt-6 space-x-3">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
