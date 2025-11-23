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
import { usePathname } from "next/navigation";

export default function LoginButton({ redirect }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // If no redirect prop passed → fallback to current page
  const finalRedirect = redirect || pathname;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        🔑 লগইন করুন
      </button>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} redirect={finalRedirect} />
    </>
  );
}