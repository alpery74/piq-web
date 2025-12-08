import { useMemo } from 'react';

/**
 * Sparkline - Mini inline chart for showing trends
 * Used in holdings table to show 7-day price movement
 */
const Sparkline = ({
  data = [],
  width = 80,
  height = 24,
  strokeWidth = 1.5,
  color, // optional override, otherwise auto-detect from trend
  showDot = true, // show dot at end
  className = '',
}) => {
  const { path, trend, minY, maxY, lastPoint } = useMemo(() => {
    if (!data || data.length < 2) {
      return { path: '', trend: 'neutral', minY: 0, maxY: 0, lastPoint: null };
    }

    const values = data.map((d) => (typeof d === 'number' ? d : d.value || 0));
    const minY = Math.min(...values);
    const maxY = Math.max(...values);
    const range = maxY - minY || 1;

    // Padding for the stroke
    const padding = 2;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    // Generate SVG path
    const points = values.map((v, i) => {
      const x = padding + (i / (values.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((v - minY) / range) * chartHeight;
      return { x, y, value: v };
    });

    const pathData = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    // Determine trend
    const first = values[0];
    const last = values[values.length - 1];
    const trend = last > first ? 'up' : last < first ? 'down' : 'neutral';

    return {
      path: pathData,
      trend,
      minY,
      maxY,
      lastPoint: points[points.length - 1],
    };
  }, [data, width, height]);

  if (!data || data.length < 2) {
    return (
      <div
        className={`flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={{ width, height }}
      >
        —
      </div>
    );
  }

  const strokeColor = color || (
    trend === 'up' ? '#34C759' : trend === 'down' ? '#FF3B30' : '#8E8E93'
  );

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id={`sparkline-gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={`${path} L ${lastPoint?.x || 0} ${height} L 2 ${height} Z`}
        fill={`url(#sparkline-gradient-${trend})`}
      />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      {showDot && lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={strokeColor}
        />
      )}
    </svg>
  );
};

/**
 * Generate mock sparkline data for demo purposes
 * In production, this would come from real price data
 */
export const generateMockSparklineData = (baseValue = 100, volatility = 0.02, days = 7) => {
  const data = [];
  let value = baseValue;

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * value;
    value += change;
    data.push({ day: i, value: Math.max(0, value) });
  }

  return data;
};

/**
 * SparklineWithChange - Sparkline with percentage change indicator
 */
export const SparklineWithChange = ({
  data,
  width = 100,
  height = 24,
  className = '',
}) => {
  const change = useMemo(() => {
    if (!data || data.length < 2) return 0;
    const values = data.map((d) => (typeof d === 'number' ? d : d.value || 0));
    const first = values[0];
    const last = values[values.length - 1];
    return first !== 0 ? ((last - first) / first) * 100 : 0;
  }, [data]);

  const isPositive = change >= 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sparkline data={data} width={width - 40} height={height} />
      <span
        className={`text-xs font-semibold ${
          isPositive ? 'text-ios-green' : 'text-ios-red'
        }`}
      >
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  );
};

export default Sparkline;
