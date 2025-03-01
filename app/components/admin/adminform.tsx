"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Loader2 } from "lucide-react"; // Importing icons

const AdminForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/add-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Something went wrong");
      } else {
        setSuccess("Admin created successfully!");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add New Admin</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-4 relative">
          <label className="block mb-1">Name (optional)</label>
          <div className="flex items-center border rounded p-2">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full outline-none"
              placeholder="Admin Name"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4 relative">
          <label className="block mb-1">Email</label>
          <div className="flex items-center border rounded p-2">
            <Mail className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none"
              placeholder="Admin Email"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="block mb-1">Password</label>
          <div className="flex items-center border rounded p-2">
            <Lock className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
              placeholder="Password"
              required
            />
          </div>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Add Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminForm;
