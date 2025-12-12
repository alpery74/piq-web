import { ChevronDown, ChevronUp, HelpCircle, Settings } from 'lucide-react';

const ExpandableSection = ({
  id,
  title,
  icon: Icon,
  tier1,
  tier2,
  tier3,
  isExpanded,
  onToggle,
  showAdvanced = false,
}) => {
  return (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div
        className="flex items-center justify-between pb-4 mb-4 border-b-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary-200 dark:hover:border-primary-600 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isExpanded
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-expanded={isExpanded}
          aria-controls={`${id}-details`}
        >
          <span className="text-sm">{isExpanded ? 'Hide Analyst View' : 'Show Analyst View'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-4">{tier1}</div>

      {isExpanded && tier2 && (
        <div className="mt-6 animate-slide-up">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 border-l-4 border-blue-500 p-5 rounded-lg">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-lg flex items-center gap-2">💡 Analyst View</h3>
                {tier2}
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && showAdvanced && tier3 && (
        <div className="mt-6 animate-slide-up">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20 border-l-4 border-purple-500 p-5 rounded-lg">
            <div className="flex items-start gap-3">
              <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-3 text-lg flex items-center gap-2">
                  ⚙️ Quant View
                  <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">Calculations</span>
                </h3>
                {tier3}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
