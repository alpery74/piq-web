import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Card Component
 * Reusable card container with optional expand/collapse functionality
 *
 * @param {string} title - Card title
 * @param {string} subtitle - Optional subtitle
 * @param {boolean} collapsible - Whether card can be collapsed
 * @param {boolean} defaultExpanded - Initial expanded state
 * @param {React.Node} actions - Action buttons for card header
 * @param {React.Node} children - Card content
 * @param {string} className - Additional CSS classes
 */
const Card = ({
  title,
  subtitle,
  collapsible = false,
  defaultExpanded = true,
  actions,
  children,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`card animate-slide-up ${className}`}>
      {/* Card Header */}
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {title}
                {collapsible && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                )}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      {(!collapsible || isExpanded) && (
        <div className="card-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;
