import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  return (
    <div>
      <button
        onClick={() => signIn()}
        className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Login
      </button>
    </div>
  );
}
