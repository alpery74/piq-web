import { useEffect, useState } from 'react';

/**
 * iOS-style Circular Gauge Component
 * Perfect for showing portfolio health scores, risk levels, etc.
 */
const CircularGauge = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'blue',
  label,
  sublabel,
  animate = true,
  showValue = true,
  suffix = '',
  className = '',
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  // iOS System Colors
  const colors = {
    blue: { stroke: '#007AFF', bg: 'rgba(0, 122, 255, 0.12)' },
    green: { stroke: '#34C759', bg: 'rgba(52, 199, 89, 0.12)' },
    orange: { stroke: '#FF9500', bg: 'rgba(255, 149, 0, 0.12)' },
    red: { stroke: '#FF3B30', bg: 'rgba(255, 59, 48, 0.12)' },
    purple: { stroke: '#AF52DE', bg: 'rgba(175, 82, 222, 0.12)' },
    teal: { stroke: '#5AC8FA', bg: 'rgba(90, 200, 250, 0.12)' },
    gray: { stroke: '#8E8E93', bg: 'rgba(142, 142, 147, 0.12)' },
  };

  // Dynamic color based on value
  const getAutoColor = (val) => {
    const percentage = (val / max) * 100;
    if (percentage >= 70) return 'green';
    if (percentage >= 40) return 'orange';
    return 'red';
  };

  const activeColor = color === 'auto' ? getAutoColor(value) : color;
  const { stroke, bg } = colors[activeColor] || colors.blue;

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Animate on mount and value change
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animate]);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* SVG Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(142, 142, 147, 0.15)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: animate ? 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          />
        </svg>

        {/* Center Content */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: size * 0.22,
                color: '#1C1C1E',
                letterSpacing: '-0.02em',
              }}
            >
              {Math.round(animatedValue)}{suffix}
            </span>
            {label && (
              <span
                className="text-xs font-medium"
                style={{ color: 'rgba(60, 60, 67, 0.6)' }}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sublabel below gauge */}
      {sublabel && (
        <span
          className="mt-2 text-sm font-medium text-center"
          style={{ color: 'rgba(60, 60, 67, 0.6)' }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};

/**
 * Mini Gauge for inline use
 */
export const MiniGauge = ({
  value = 0,
  max = 100,
  color = 'auto',
  size = 32,
}) => {
  const colors = {
    blue: '#007AFF',
    green: '#34C759',
    orange: '#FF9500',
    red: '#FF3B30',
    purple: '#AF52DE',
  };

  const getAutoColor = (val) => {
    const percentage = (val / max) * 100;
    if (percentage >= 70) return 'green';
    if (percentage >= 40) return 'orange';
    return 'red';
  };

  const activeColor = color === 'auto' ? getAutoColor(value) : color;
  const strokeColor = colors[activeColor] || colors.blue;

  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(142, 142, 147, 0.15)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </svg>
  );
};

export default CircularGauge;
