"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="text-7xl sm:text-8xl"
        >
          😕
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold text-red-600">
          404 - Page Not Found
        </h1>

        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
