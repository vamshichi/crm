"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, User } from "lucide-react"; // Importing icons

export default function Home() {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 1000); // Delay buttons appearing after 1s
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Logo Pop-Up Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image src="/Maxpo_Logo_Black.png" alt="Logo" width={100} height={100} />
      </motion.div>

      {/* Buttons appear after the logo */}
      {showButtons && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex gap-6 mt-6"
        >
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2"
            onClick={() => router.push("/admin-login")}
          >
            <Shield size={20} /> Admin
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2"
            onClick={() => router.push("/employee-login")}
          >
            <User size={20} /> Employee
          </button>
        </motion.div>
      )}
    </div>
  );
}
