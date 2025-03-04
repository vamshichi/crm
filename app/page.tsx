"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, User } from "lucide-react"; // Importing icons
import { Typewriter } from "react-simple-typewriter"; // Typing effect
import { Briefcase } from "lucide-react"; 

export default function Home() {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  // const colors = ["#ff5733", "#33ff57", "#3357ff", "#ff33a8", "#ffcc33"]
  // const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 1500); // Delay buttons appearing after typing effect
  }, []);
  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     setColorIndex((prevIndex) => (prevIndex + 1) % colors.length)
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, [colors.length]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Logo and Company Name (Moved Down) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center mt-12" // Adjust margin for positioning
      >
        <Image src="/Maxpo_Logo_Black.png" alt="Logo" width={250} height={120} />
        {/* Typing Effect for Company Name */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="text-xl font-semibold text-gray-700 mt-2 tracking-wide uppercase"
        >
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            // color: colors[colorIndex],
            transition: "color 0.5s ease-in-out"
          }}>
          <Typewriter words={["Maxpo Exhibition PVT Ltd"]}  loop={0}cursor cursorStyle="|" typeSpeed={100} 
          delaySpeed={1000} deleteSpeed={50} 
          />
          </span>

        </motion.h2>
      </motion.div>

      {/* Heading Below the Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
        className="text-3xl font-bold text-gray-800 mt-8"
      >
        Choose Your Role
      </motion.h1>

      {/* Buttons appear after the heading */}
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
            <Shield size={24} /> Admin
          </button>
          <button
                className="bg-black hover:bg-black text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2"
                onClick={() => router.push("/manager-login")}
          >
          <Briefcase size={24} /> Manager
          </button>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2"
            onClick={() => router.push("/employee-login")}
          >
            <User size={24} /> Employee
          </button>
        </motion.div>
      )}
    </div>
  );
}
