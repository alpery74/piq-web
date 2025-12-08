import { useState } from 'react';
import { Info } from 'lucide-react';

/**
 * Tooltip Component
 * Displays helpful information on hover/click
 * 
 * @param {string} content - Tooltip content
 * @param {string} title - Optional title
 * @param {string} position - Position: 'top', 'bottom', 'left', 'right'
 * @param {React.Node} children - Trigger element (defaults to info icon)
 */
const Tooltip = ({ 
  content, 
  title, 
  position = 'top',
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help inline-flex"
      >
        {children || (
          <Info className="w-4 h-4 text-gray-500 hover:text-primary-600 transition-colors" />
        )}
      </div>

      {isVisible && (
        <>
          <div
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg max-w-xs whitespace-normal pointer-events-none ${positionClasses[position]}`}
          >
            {title && (
              <div className="font-semibold mb-1">{title}</div>
            )}
            <div className="text-gray-200">{content}</div>
            
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Tooltip;
