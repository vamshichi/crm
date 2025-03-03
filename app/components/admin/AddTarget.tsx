"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building, DollarSign, Calendar } from "lucide-react"; // Import icons

const AddTarget = () => {
  const router = useRouter();
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    departmentId: "",
    amount: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // Success or error message

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        console.log("API Response Status:", response.status);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();
        console.log("Fetched Data:", data);
        setDepartments(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setMessage({ text: "Error loading departments.", type: "error" });
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (!formData.departmentId || !formData.amount || !formData.startDate || !formData.endDate) {
      setMessage({ text: "All fields are required.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add target.");
      }

      setMessage({ text: "Target added successfully!", type: "success" });
      setFormData({ departmentId: "", amount: "", startDate: "", endDate: "" }); // Reset form
      router.refresh();
    } catch (err) {
      const errorMessage = (err as Error).message || "Something went wrong!";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Target</h2>

      {/* Success or Error Message */}
      {message.text && (
        <p
          className={`text-center mb-3 ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Department Dropdown */}
        <div className="flex items-center border rounded p-2">
          <Building className="w-5 h-5 text-gray-500 mr-2" />
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full outline-none"
          >
            <option value="">Select a Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Target Amount */}
        <div className="flex items-center border rounded p-2">
          <DollarSign className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="number"
            name="amount"
            placeholder="Target Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>

        {/* Start Date */}
        <div className="flex items-center border rounded p-2">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>

        {/* End Date */}
        <div className="flex items-center border rounded p-2">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Target"}
        </button>
      </form>
    </div>
  );
};

export default AddTarget;
