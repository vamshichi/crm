"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show the main content after the animation
    setTimeout(() => setShowContent(true), 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Animated Logo - Shown First */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center"
          >
            <Image src="/Maxpo_Logo_Black.png" alt="Logo" width={500} height={500} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Appears After Animation */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Choose Your Role
          </h1>
          <div className="flex gap-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
              onClick={() => router.push("/admin-login")}
            >
              Admin
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
              onClick={() => router.push("/employee-login")}
            >
              Employee
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
