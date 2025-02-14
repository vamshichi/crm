"use client"

import { useState, useEffect } from "react"

type Category = "gmec" | "fps" | "ips" | "tascon"

type Target = {
  id: string
  category: string
  period: "daily" | "weekly" | "monthly"
  target: number
  achieved: number
}

export default function SalesTargetTracking({ category }: { category: Category }) {
  const [targets, setTargets] = useState<Target[]>([])

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?category=${category}`)
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "salesTargets") {
        setTargets(data.data)
      }
    }

    return () => {
      eventSource.close()
    }
  }, [category])

  const handleTargetChange = async (id: string, value: number) => {
    const response = await fetch(`/api/salesTargets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: value }),
    })

    if (response.ok) {
      const updatedTarget = await response.json()
      setTargets(targets.map((t) => (t.id === id ? updatedTarget : t)))
    }
  }

  const handleAchievedChange = async (id: string, value: number) => {
    const response = await fetch(`/api/salesTargets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ achieved: value }),
    })

    if (response.ok) {
      const updatedTarget = await response.json()
      setTargets(targets.map((t) => (t.id === id ? updatedTarget : t)))
    }
  }

  const calculatePercentage = (achieved: number, target: number) => {
    return target > 0 ? Math.round((achieved / target) * 100) : 0
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sales Target Tracking</h2>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Period</th>
            <th className="border p-2">Target</th>
            <th className="border p-2">Achieved</th>
            <th className="border p-2">Progress</th>
          </tr>
        </thead>
        <tbody>
          {targets.map((target) => (
            <tr key={target.id}>
              <td className="border p-2 capitalize">{target.period}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={target.target}
                  onChange={(e) => handleTargetChange(target.id, Number.parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={target.achieved}
                  onChange={(e) => handleAchievedChange(target.id, Number.parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calculatePercentage(target.achieved, target.target)}%` }}
                  ></div>
                </div>
                <span className="text-sm">{calculatePercentage(target.achieved, target.target)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

