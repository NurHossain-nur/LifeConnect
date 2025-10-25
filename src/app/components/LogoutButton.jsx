"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <>
      <button
        onClick={() => signOut()}
        className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded"
      >
        Logout
      </button>
    </>
  );
}
