import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, Target, Zap, ChevronRight } from 'lucide-react';

// Animated number component with formatting
const AnimatedValue = ({ value, prefix = '', suffix = '', decimals = 2, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (value === null || value === undefined) return;

    const startTime = Date.now();
    startValueRef.current = displayValue;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValueRef.current + (endValue - startValueRef.current) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span>{prefix}{formatted}{suffix}</span>;
};

// Circular health gauge (Apple Watch style)
const HealthRing = ({ score, size = 120, strokeWidth = 12 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score || 0);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s) => {
    if (s >= 80) return '#34C759'; // iOS green
    if (s >= 60) return '#FF9500'; // iOS orange
    if (s >= 40) return '#FF9500';
    return '#FF3B30'; // iOS red
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(142, 142, 147, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: getColor(animatedScore) }}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {getLabel(animatedScore)}
        </span>
      </div>
    </div>
  );
};

// Quick action button
const QuickAction = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200',
    primary: 'bg-ios-blue/10 hover:bg-ios-blue/20 text-ios-blue',
    success: 'bg-ios-green/10 hover:bg-ios-green/20 text-ios-green',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${variants[variant]} backdrop-blur-sm border border-white/20 dark:border-white/10`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <ChevronRight className="w-3 h-3 opacity-50" />
    </button>
  );
};

const HeroCard = ({
  portfolioValue,
  dailyChange,
  dailyChangePercent,
  healthScore,
  riskLevel,
  volatility,
  holdingsCount = 0,
  onOptimize,
  onExport,
  onCompare,
  isLoading = false,
}) => {
  const isPositiveChange = dailyChangePercent >= 0;

  return (
    <div className="card-glass-hero relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ios-blue/5 via-transparent to-ios-purple/5 pointer-events-none" />

      <div className="relative z-10">
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Portfolio Value */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Portfolio Value
                </p>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {isLoading ? (
                      <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ) : (
                      <AnimatedValue value={portfolioValue} prefix="$" decimals={2} />
                    )}
                  </h1>
                </div>
              </div>
            </div>

            {/* Daily change */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                  isPositiveChange
                    ? 'bg-ios-green/15 text-ios-green'
                    : 'bg-ios-red/15 text-ios-red'
                }`}
              >
                {isPositiveChange ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {isPositiveChange ? '+' : ''}
                  <AnimatedValue value={dailyChangePercent} suffix="%" decimals={2} />
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isPositiveChange ? '+' : ''}
                <AnimatedValue value={dailyChange} prefix="$" decimals={2} /> today
              </span>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/30 dark:border-white/10">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Risk Level</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      riskLevel === 'Low'
                        ? 'bg-ios-green'
                        : riskLevel === 'Moderate'
                        ? 'bg-ios-orange'
                        : 'bg-ios-red'
                    }`}
                  />
                  {riskLevel || 'N/A'}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/30 dark:border-white/10">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Volatility</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  <AnimatedValue value={volatility} suffix="%" decimals={1} />
                </p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/30 dark:border-white/10">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Holdings</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {holdingsCount} {holdingsCount === 1 ? 'asset' : 'assets'}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
              <QuickAction icon={Zap} label="Optimize" onClick={onOptimize} variant="primary" />
              <QuickAction icon={Target} label="Set Goals" onClick={onCompare} variant="success" />
              <QuickAction icon={Activity} label="Export Report" onClick={onExport} />
            </div>
          </div>

          {/* Right: Health Score Ring */}
          <div className="flex flex-col items-center justify-center lg:border-l lg:border-white/20 dark:lg:border-white/10 lg:pl-8">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Portfolio Health
            </p>
            <HealthRing score={healthScore} size={140} strokeWidth={14} />
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on diversification, volatility & risk metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
