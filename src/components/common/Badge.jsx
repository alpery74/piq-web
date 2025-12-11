import { getRiskLevel, getActionType } from '@/utils/formatters';

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
 * ActionBadge - Specialized badge for action recommendations
 */
export const ActionBadge = ({ action, size = 'md', ...props }) => (
  <Badge type="action" value={action} size={size} {...props} />
);

export default Badge;
