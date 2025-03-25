"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, User, Briefcase } from "lucide-react"; // Importing icons
import { Typewriter } from "react-simple-typewriter"; // Typing effect

export default function Home() {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 1500); // Delay buttons appearing after typing effect
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      {/* Logo and Company Name */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center mt-8 sm:mt-12"
      >
        <Image
          src="/Maxpo_Logo_Black.png"
          alt="Logo"
          width={200}
          height={100}
          className="w-44 sm:w-64"
        />
        {/* Typing Effect for Company Name */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="text-lg sm:text-xl font-semibold text-gray-700 mt-2 tracking-wide uppercase text-center"
        >
          <span className="font-bold">
            <Typewriter
              words={["Maxpo Exhibition PVT Ltd"]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              delaySpeed={1000}
              deleteSpeed={50}
            />
          </span>
        </motion.h2>
      </motion.div>

      {/* Heading Below the Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mt-6 sm:mt-8 text-center"
      >
        Choose Your Role
      </motion.h1>

      {/* Buttons appear after the heading */}
      {showButtons && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 w-full max-w-md"
        >
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => router.push("/admin-login")}
          >
            <Shield size={20} /> Admin
          </button>
          <button
            className="bg-black hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => router.push("/manager-login")}
          >
            <Briefcase size={20} /> Manager
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => router.push("/employee-login")}
          >
            <User size={20} /> Employee
          </button>
        </motion.div>
      )}
    </div>
  );
}
