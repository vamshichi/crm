import type React from "react"

interface CircularProgressProps {
  value: number
  text: string
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, text }) => {
  const radius = 25
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r={radius} fill="none" stroke="#ddd" strokeWidth="4" />
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#0070f3"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
        style={{ transition: "stroke-dashoffset 0.35s" }}
      />
      <text
        x="30"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs sm:text-sm font-medium"
        style={{ fill: "#333" }}
      >
        {text}
      </text>
    </svg>
  )
}

export default CircularProgress

