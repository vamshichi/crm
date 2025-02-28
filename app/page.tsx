"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const [ , setShowContent] = useState(false);

useEffect(() => {
    setTimeout(() => setShowContent(true), 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Choose Your Role</h1>
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
    </div>
  );
}
