"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ManagerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manager, setManager] = useState<{ id: string; name: string; email: string; department: string } | null>(null);

  useEffect(() => {
    // ✅ Get manager data from localStorage or URL params
    const storedManager = localStorage.getItem("manager");
    if (storedManager) {
      setManager(JSON.parse(storedManager));
    } else {
      // ✅ If not found, try getting from URL
      const managerId = searchParams.get("id");
      if (!managerId) {
        router.push("/manager-login"); // Redirect if no data
      }
    }
  }, [router, searchParams]);

  if (!manager) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Welcome, {manager.name}</h1>
    </div>
  );
}

// ✅ Wrap it with Suspense in your page
export default function ManagerDashboard() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <ManagerDashboardContent />
    </Suspense>
  );
}
