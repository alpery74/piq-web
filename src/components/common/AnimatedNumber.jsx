import { useEffect, useState, useRef } from 'react';

/**
 * iOS-style Animated Number Component
 * Smoothly animates number changes like in stock apps
 */
const AnimatedNumber = ({
  value,
  format = 'number', // 'number', 'currency', 'percent'
  decimals = 2,
  duration = 800,
  prefix = '',
  suffix = '',
  className = '',
  size = 'default', // 'sm', 'default', 'lg', 'xl'
  showChange = false,
  previousValue,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(value);

  // Size variants
  const sizeClasses = {
    sm: 'text-lg',
    default: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  // Format the number
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '—';

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(num);

      case 'percent':
        return `${num.toFixed(decimals)}%`;

      case 'compact':
        if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (Math.abs(num) >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toFixed(decimals);

      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(num);
    }
  };

  // Easing function for smooth animation
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Animate value changes
  useEffect(() => {
    if (value === displayValue) return;

    setIsAnimating(true);
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = startValueRef.current + (value - startValueRef.current) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Calculate change indicator
  const change = previousValue !== undefined ? value - previousValue : null;
  const changePercent = previousValue && previousValue !== 0
    ? ((value - previousValue) / previousValue) * 100
    : null;

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span
        className={`font-bold tabular-nums tracking-tight ${sizeClasses[size]}`}
        style={{
          color: '#1C1C1E',
          letterSpacing: '-0.02em',
        }}
      >
        {prefix}{formatNumber(displayValue)}{suffix}
      </span>

      {showChange && change !== null && (
        <span
          className="text-sm font-semibold mt-0.5"
          style={{
            color: change >= 0 ? '#34C759' : '#FF3B30',
          }}
        >
          {change >= 0 ? '+' : ''}{formatNumber(change)}
          {changePercent !== null && (
            <span className="ml-1 opacity-80">
              ({change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          )}
        </span>
      )}
    </div>
  );
};

/**
 * Portfolio Value Display - Like Robinhood
 */
export const PortfolioValue = ({
  value,
  change,
  changePercent,
  label = 'Total Value',
}) => {
  const isPositive = change >= 0;

  return (
    <div className="value-display">
      {label && (
        <p
          className="text-sm font-medium mb-1"
          style={{ color: 'rgba(60, 60, 67, 0.6)' }}
        >
          {label}
        </p>
      )}
      <AnimatedNumber
        value={value}
        format="currency"
        decimals={2}
        size="xl"
        className="mb-1"
      />
      {(change !== undefined || changePercent !== undefined) && (
        <div
          className="flex items-center gap-2 text-base font-semibold"
          style={{ color: isPositive ? '#34C759' : '#FF3B30' }}
        >
          <span className="flex items-center gap-1">
            {isPositive ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {change !== undefined && (
              <span>${Math.abs(change).toFixed(2)}</span>
            )}
          </span>
          {changePercent !== undefined && (
            <span className="opacity-80">
              ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          )}
          <span
            className="text-sm font-normal"
            style={{ color: 'rgba(60, 60, 67, 0.6)' }}
          >
            Today
          </span>
        </div>
      )}
    </div>
  );
};

export default AnimatedNumber;
