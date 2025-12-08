import { getRiskLevel, getActionType, formatCurrency } from '@/utils/formatters';
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp, Check } from 'lucide-react';

/**
 * Badge Component
 * Displays colored badges for risk levels, actions, and status indicators
 *
 * @param {string} type - Badge type: 'risk', 'action', 'status'
 * @param {string} value - Badge value
 * @param {string} size - Size: 'sm', 'md', 'lg'
 * @param {boolean} showIcon - Whether to show icon/emoji
 */
const Badge = ({
  type = 'status',
  value,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  let badgeConfig = {};

  if (type === 'risk') {
    badgeConfig = getRiskLevel(value);
  } else if (type === 'action') {
    badgeConfig = getActionType(value);
  } else {
    // Custom status badge
    badgeConfig = {
      color: 'text-gray-700 bg-gray-100',
      icon: '',
      label: value,
    };
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${badgeConfig.color}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && (badgeConfig.emoji || badgeConfig.icon) && (
        <span>{badgeConfig.emoji || badgeConfig.icon}</span>
      )}
      <span>{badgeConfig.label}</span>
    </span>
  );
};

/**
 * RiskBadge - Specialized badge for risk levels
 */
export const RiskBadge = ({ level, size = 'md', ...props }) => (
  <Badge type="risk" value={level} size={size} {...props} />
);

/**
 * ActionBadge - Specialized badge for action recommendations
 */
export const ActionBadge = ({ action, size = 'md', ...props }) => (
  <Badge type="action" value={action} size={size} {...props} />
);

/**
 * EnhancedActionBadge - Action badge with specific dollar amounts and percentages
 * Shows "REDUCE by $2,340 (8.2%)" instead of just "REDUCE"
 */
export const EnhancedActionBadge = ({
  action,
  dollarAmount,
  percentage,
  ticker,
  size = 'md',
  showDetails = true,
  className = '',
}) => {
  const config = {
    REDUCE: {
      bgColor: 'bg-ios-red/15 dark:bg-ios-red/25',
      textColor: 'text-ios-red',
      borderColor: 'border-ios-red/30',
      Icon: TrendingDown,
      label: 'Reduce',
    },
    INCREASE: {
      bgColor: 'bg-ios-green/15 dark:bg-ios-green/25',
      textColor: 'text-ios-green',
      borderColor: 'border-ios-green/30',
      Icon: TrendingUp,
      label: 'Increase',
    },
    HOLD: {
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400',
      borderColor: 'border-gray-200 dark:border-gray-700',
      Icon: Check,
      label: 'Hold',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const actionConfig = config[action?.toUpperCase()] || config.HOLD;
  const { bgColor, textColor, borderColor, Icon, label } = actionConfig;

  const hasDollarAmount = dollarAmount !== undefined && dollarAmount !== null;
  const hasPercentage = percentage !== undefined && percentage !== null;

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-xl border
        ${bgColor} ${textColor} ${borderColor}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <Icon className={iconSizes[size]} />
      <span className="font-semibold">{label}</span>
      {showDetails && (hasDollarAmount || hasPercentage) && (
        <span className="font-medium opacity-80">
          {hasDollarAmount && (
            <>by {formatCurrency(Math.abs(dollarAmount), 0)}</>
          )}
          {hasPercentage && (
            <span className="ml-1">
              ({percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%)
            </span>
          )}
        </span>
      )}
    </div>
  );
};

/**
 * SmartActionBadge - Compact version that expands on hover
 * Perfect for table cells where space is limited
 */
export const SmartActionBadge = ({
  action,
  dollarAmount,
  percentage,
  size = 'sm',
}) => {
  const config = {
    REDUCE: {
      bg: 'bg-ios-red/15 hover:bg-ios-red/25',
      text: 'text-ios-red',
      Icon: ArrowDown,
    },
    INCREASE: {
      bg: 'bg-ios-green/15 hover:bg-ios-green/25',
      text: 'text-ios-green',
      Icon: ArrowUp,
    },
    HOLD: {
      bg: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
      text: 'text-gray-500 dark:text-gray-400',
      Icon: Minus,
    },
  };

  const actionConfig = config[action?.toUpperCase()] || config.HOLD;
  const { bg, text, Icon } = actionConfig;

  const hasDollarAmount = dollarAmount !== undefined && dollarAmount !== null && dollarAmount !== 0;

  return (
    <span
      className={`
        group inline-flex items-center gap-1 px-2 py-1 rounded-lg
        font-medium transition-all cursor-default
        ${bg} ${text}
        ${size === 'sm' ? 'text-xs' : 'text-sm'}
      `}
      title={hasDollarAmount ? `${action} by ${formatCurrency(Math.abs(dollarAmount), 0)}` : action}
    >
      <Icon className="w-3 h-3" />
      <span className="uppercase">{action}</span>
      {hasDollarAmount && (
        <span className="hidden group-hover:inline-block ml-0.5 opacity-80">
          {formatCurrency(Math.abs(dollarAmount), 0)}
        </span>
      )}
    </span>
  );
};

/**
 * PercentChange - Displays percentage change with color coding
 */
export const PercentChange = ({ value, decimals = 2 }) => {
  if (value === null || value === undefined) return <span className="text-gray-500">N/A</span>;
  
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const colorClass = isNeutral 
    ? 'text-gray-600' 
    : isPositive 
    ? 'text-green-600' 
    : 'text-red-600';
  
  const arrow = isNeutral ? '' : isPositive ? '↑' : '↓';
  
  return (
    <span className={`font-medium ${colorClass}`}>
      {arrow} {Math.abs(value).toFixed(decimals)}%
    </span>
  );
};

export default Badge;
