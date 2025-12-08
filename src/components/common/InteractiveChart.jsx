import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Time range options
const TIME_RANGES = [
  { key: '1D', label: '1D', days: 1 },
  { key: '1W', label: '1W', days: 7 },
  { key: '1M', label: '1M', days: 30 },
  { key: '3M', label: '3M', days: 90 },
  { key: '1Y', label: '1Y', days: 365 },
  { key: 'ALL', label: 'ALL', days: null },
];

// Time range selector component
export const TimeRangeSelector = ({ selected, onChange, className = '' }) => (
  <div className={`inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 ${className}`}>
    {TIME_RANGES.map((range) => (
      <button
        key={range.key}
        onClick={() => onChange(range.key)}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          selected === range.key
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        {range.label}
      </button>
    ))}
  </div>
);

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, valuePrefix = '', valueSuffix = '' }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p
          key={index}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: {valuePrefix}{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}{valueSuffix}
        </p>
      ))}
    </div>
  );
};

// Interactive Area Chart with time range
export const InteractiveAreaChart = ({
  data = [],
  dataKey = 'value',
  xAxisKey = 'date',
  color = '#007AFF',
  gradientId = 'areaGradient',
  height = 300,
  showTimeRange = true,
  valuePrefix = '$',
  valueSuffix = '',
  title,
  subtitle,
}) => {
  const [timeRange, setTimeRange] = useState('1M');

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const range = TIME_RANGES.find((r) => r.key === timeRange);
    if (!range?.days) return data;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - range.days);

    return data.filter((item) => {
      const itemDate = new Date(item[xAxisKey]);
      return itemDate >= cutoffDate;
    });
  }, [data, timeRange, xAxisKey]);

  // Calculate change
  const change = useMemo(() => {
    if (filteredData.length < 2) return { value: 0, percent: 0, isPositive: true };
    const first = filteredData[0][dataKey];
    const last = filteredData[filteredData.length - 1][dataKey];
    const diff = last - first;
    const percent = first !== 0 ? (diff / first) * 100 : 0;
    return {
      value: diff,
      percent,
      isPositive: diff >= 0,
    };
  }, [filteredData, dataKey]);

  return (
    <div className="space-y-4">
      {/* Header with title and time range */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {title && (
            <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-sm font-semibold ${
                change.isPositive ? 'text-ios-green' : 'text-ios-red'
              }`}
            >
              {change.isPositive ? '+' : ''}{valuePrefix}{change.value.toFixed(2)}{valueSuffix}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                change.isPositive
                  ? 'bg-ios-green/15 text-ios-green'
                  : 'bg-ios-red/15 text-ios-red'
              }`}
            >
              {change.isPositive ? '+' : ''}{change.percent.toFixed(2)}%
            </span>
          </div>
        </div>
        {showTimeRange && (
          <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 11, fill: '#8E8E93' }}
            tickLine={false}
            axisLine={{ stroke: '#E5E5EA' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8E8E93' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${valuePrefix}${v}`}
          />
          <Tooltip
            content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Interactive Bar Chart
export const InteractiveBarChart = ({
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  color = '#007AFF',
  height = 300,
  showTimeRange = false,
  valuePrefix = '',
  valueSuffix = '%',
  title,
  subtitle,
  layout = 'vertical', // 'vertical' or 'horizontal'
}) => {
  const [timeRange, setTimeRange] = useState('1M');

  // Sort data for better visualization
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b[dataKey] - a[dataKey]);
  }, [data, dataKey]);

  // Color bars based on value (positive = green, negative = red)
  const getBarColor = (value) => {
    if (value > 20) return '#FF3B30'; // High risk - red
    if (value > 10) return '#FF9500'; // Medium risk - orange
    if (value < 0) return '#007AFF'; // Negative - blue
    return '#34C759'; // Normal - green
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {title && (
            <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {showTimeRange && (
          <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sortedData}
          layout={layout === 'horizontal' ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis
            dataKey={layout === 'horizontal' ? dataKey : xAxisKey}
            type={layout === 'horizontal' ? 'number' : 'category'}
            tick={{ fontSize: 11, fill: '#8E8E93' }}
            tickLine={false}
          />
          <YAxis
            dataKey={layout === 'horizontal' ? xAxisKey : dataKey}
            type={layout === 'horizontal' ? 'category' : 'number'}
            tick={{ fontSize: 11, fill: '#8E8E93' }}
            tickLine={false}
            width={layout === 'horizontal' ? 60 : 40}
          />
          <Tooltip
            content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />}
          />
          <Bar
            dataKey={dataKey}
            radius={[4, 4, 4, 4]}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry[dataKey])} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Interactive Pie Chart with legend
export const InteractivePieChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FF2D55', '#8E8E93'],
  height = 300,
  title,
  subtitle,
  showLegend = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  }, [data, dataKey]);

  return (
    <div className="space-y-4">
      <div>
        {title && (
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      <div className={`flex ${showLegend ? 'flex-col lg:flex-row' : ''} gap-4 items-center`}>
        <div className="flex-shrink-0" style={{ width: height, height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey={dataKey}
                nameKey={nameKey}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip valueSuffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {showLegend && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            {data.map((item, index) => {
              const percent = total > 0 ? (item[dataKey] / total) * 100 : 0;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer ${
                    activeIndex === index ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item[nameKey]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {percent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveAreaChart;
