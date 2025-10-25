// import React from "react";
// import { useSession, signIn, signOut } from "next-auth/react";

// export default function LoginButton() {
//   return (
//     <div>
//       <button
//         onClick={() => signIn()}
//         className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
//       >
//         Login
//       </button>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Login
      </button>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}