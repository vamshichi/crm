import React from "react";

interface CircularProgressProps {
  value: number;       // Percentage (0-100)
  text?: string;       // Text to display inside the circle
  size?: number;       // Diameter of the circle in pixels
  strokeWidth?: number;
  pathColor?: string;
  trailColor?: string;
  textColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  text,
  size = 80,
  strokeWidth = 8,
  pathColor = "#3b82f6", // Blue
  trailColor = "#e5e7eb", // Gray-200
  textColor = "#1F2937",  // Gray-800
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        stroke={trailColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={pathColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {text && (
        <text
          x="50%"
          y="50%"
          dy="0.3em"
          textAnchor="middle"
          fill={textColor}
          style={{ fontSize: size * 0.3 }}
        >
          {text}
        </text>
      )}
    </svg>
  );
};

export default CircularProgress;
