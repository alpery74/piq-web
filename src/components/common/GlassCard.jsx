import { forwardRef } from 'react';

/**
 * iOS-style Glass Card Component
 * Supports multiple variants: default, thin, colored (blue, green, orange, red, purple)
 */
const GlassCard = forwardRef(({
  children,
  variant = 'default',
  color,
  className = '',
  hover = true,
  padding = 'default',
  onClick,
  ...props
}, ref) => {
  // Base glass styles
  const baseStyles = {
    background: 'var(--glass-bg-thick)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '0.5px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4)',
  };

  // Variant-specific backgrounds
  const variantStyles = {
    default: {},
    thin: {
      background: 'var(--glass-bg-thin)',
      backdropFilter: 'blur(20px) saturate(150%)',
      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    },
    thick: {
      background: 'var(--glass-bg-thick)',
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    },
    solid: {
      background: '#FFFFFF',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      border: '0.5px solid rgba(0, 0, 0, 0.04)',
    },
  };

  // Color overlays for tinted glass cards
  const colorStyles = {
    blue: {
      background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.12) 0%, rgba(88, 86, 214, 0.08) 100%)',
      borderColor: 'rgba(0, 122, 255, 0.2)',
    },
    green: {
      background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.12) 0%, rgba(48, 209, 88, 0.08) 100%)',
      borderColor: 'rgba(52, 199, 89, 0.2)',
    },
    orange: {
      background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.12) 0%, rgba(255, 159, 10, 0.08) 100%)',
      borderColor: 'rgba(255, 149, 0, 0.2)',
    },
    red: {
      background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.12) 0%, rgba(255, 69, 58, 0.08) 100%)',
      borderColor: 'rgba(255, 59, 48, 0.2)',
    },
    purple: {
      background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.12) 0%, rgba(191, 90, 242, 0.08) 100%)',
      borderColor: 'rgba(175, 82, 222, 0.2)',
    },
  };

  // Padding sizes
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  // Combine styles
  const combinedStyles = {
    ...baseStyles,
    ...(variantStyles[variant] || {}),
    ...(color ? colorStyles[color] : {}),
  };

  // Build class names
  const classes = [
    'relative rounded-ios-xl transition-all duration-300',
    paddingSizes[padding],
    hover && 'hover:-translate-y-0.5',
    onClick && 'cursor-pointer tap-scale',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      style={combinedStyles}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
