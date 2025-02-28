"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error loading departments.");
        toast.error("Error loading departments!");
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
    setError("");

    if (!formData.departmentId || !formData.amount || !formData.startDate || !formData.endDate) {
      setError("All fields are required.");
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: formData.departmentId,
          amount: parseFloat(formData.amount), // Ensure amount is a number
          startDate: new Date(formData.startDate).toISOString(), // Convert date to ISO format
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to add target");

      toast.success("Target added successfully! 🎯");

      // Reset form after submission
      setFormData({ departmentId: "", amount: "", startDate: "", endDate: "" });
      router.refresh();
    } catch (err) {
      const errorMessage = (err as Error).message || "Something went wrong!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl font-semibold mb-4">Add Target</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Department Dropdown */}
        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Target Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Target Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Target"}
        </button>
      </form>
    </div>
  );
};

export default AddTarget;
