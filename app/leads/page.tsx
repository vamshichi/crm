"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Use next/navigation instead of next/router
import axios from "axios";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await axios.get("/api/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(res.data);
      } catch (err) {
        router.push("/");
      }
    };

    fetchLeads();
  }, [router]); // ✅ Include router in dependencies

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border">
              <td className="border p-2">{lead.name}</td>
              <td className="border p-2">{lead.email}</td>
              <td className="border p-2">{lead.phone}</td>
              <td className="border p-2">{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
