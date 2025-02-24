"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [ , setShowContent] = useState(false);

useEffect(() => {
    setTimeout(() => setShowContent(true), 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Logo Animation - Properly Centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="flex flex-col items-center mb-2" // Added margin-bottom for balance
      >
        <Image src="/Maxpo_Logo_Black.png" alt="Logo" width={250} height={250} />
      </motion.div>

      {/* Main Content - Proper Alignment */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-2" // Proper gap between elements
      >
        <h1 className="text-3xl font-bold text-gray-800">Choose Your Role</h1>
        <div className="flex gap-4">
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
    </div>
  );
}
