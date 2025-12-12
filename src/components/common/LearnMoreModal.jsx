import { useState, useEffect } from 'react';
import { X, BookOpen, ChevronRight, ChevronDown, ExternalLink, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Target, Shield, Activity, BarChart3, PieChart, Percent, Search } from 'lucide-react';
import { FINANCIAL_TERMS } from './EducationalTooltip';

/**
 * Educational categories for organized learning
 */
const CATEGORIES = {
  risk: {
    label: 'Risk Metrics',
    description: 'Understanding how much your portfolio can swing',
    icon: AlertTriangle,
    color: 'ios-red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  diversification: {
    label: 'Diversification',
    description: 'Spreading risk across different investments',
    icon: PieChart,
    color: 'ios-blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  performance: {
    label: 'Performance',
    description: 'Measuring how well your investments do',
    icon: TrendingUp,
    color: 'ios-green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  optimization: {
    label: 'Optimization Strategies',
    description: 'Methods to improve your portfolio',
    icon: Target,
    color: 'ios-purple',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  implementation: {
    label: 'Implementation',
    description: 'Executing trades efficiently',
    icon: Activity,
    color: 'ios-orange',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  tax: {
    label: 'Tax Efficiency',
    description: 'Minimizing taxes on your investments',
    icon: Percent,
    color: 'ios-teal',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  fundamentals: {
    label: 'Fundamentals',
    description: 'Company valuation and analysis',
    icon: BarChart3,
    color: 'ios-indigo',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  stress_testing: {
    label: 'Stress Testing',
    description: 'Preparing for extreme scenarios',
    icon: Shield,
    color: 'ios-yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  risk_management: {
    label: 'Risk Management',
    description: 'Controlling and limiting risk',
    icon: Shield,
    color: 'ios-pink',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
  },
  general: {
    label: 'General',
    description: 'Basic portfolio concepts',
    icon: BookOpen,
    color: 'gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    borderColor: 'border-gray-200 dark:border-gray-700',
  },
  concentration: {
    label: 'Concentration',
    description: 'Position sizing and limits',
    icon: Target,
    color: 'ios-red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

/**
 * Learning paths for guided education
 */
const LEARNING_PATHS = [
  {
    id: 'beginner',
    title: 'Getting Started',
    description: 'Essential concepts for new investors',
    terms: ['portfolioValue', 'weight', 'beta', 'volatility', 'diversificationRatio', 'effectiveHoldings'],
    duration: '5 min',
    icon: Lightbulb,
  },
  {
    id: 'risk-deep-dive',
    title: 'Understanding Risk',
    description: 'Advanced risk metrics explained',
    terms: ['var', 'cvar', 'tailRisk', 'systematicRisk', 'idiosyncraticRisk', 'drawdown'],
    duration: '8 min',
    icon: AlertTriangle,
  },
  {
    id: 'optimization',
    title: 'Portfolio Optimization',
    description: 'Strategies to improve your portfolio',
    terms: ['minimumVariance', 'riskParity', 'maxDiversification', 'marginalContribution', 'turnover'],
    duration: '7 min',
    icon: Target,
  },
  {
    id: 'implementation',
    title: 'Smart Execution',
    description: 'How to trade efficiently',
    terms: ['liquidity', 'marketCap', 'bidAskSpread', 'marketImpact', 'implementationPhase'],
    duration: '6 min',
    icon: Activity,
  },
];

/**
 * LearnMoreModal - Deep-dive educational modal
 */
const LearnMoreModal = ({ isOpen, onClose, initialTerm = null, initialCategory = null }) => {
  const [activeTab, setActiveTab] = useState('glossary'); // 'glossary', 'paths', 'categories'
  const [selectedTerm, setSelectedTerm] = useState(initialTerm);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [pathProgress, setPathProgress] = useState(0);

  // Group terms by category
  const termsByCategory = Object.entries(FINANCIAL_TERMS).reduce((acc, [key, term]) => {
    const category = term.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, ...term });
    return acc;
  }, {});

  // Filter terms by search
  const filteredTerms = searchQuery.trim()
    ? Object.entries(FINANCIAL_TERMS)
        .filter(([key, term]) =>
          term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.short.toLowerCase().includes(searchQuery.toLowerCase()) ||
          key.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(([key, term]) => ({ key, ...term }))
    : null;

  // Handle initial values
  useEffect(() => {
    if (initialTerm) {
      setSelectedTerm(initialTerm);
      setActiveTab('glossary');
    } else if (initialCategory) {
      setExpandedCategories({ [initialCategory]: true });
      setActiveTab('categories');
    }
  }, [initialTerm, initialCategory]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handlePathStart = (path) => {
    setSelectedPath(path);
    setPathProgress(0);
    setSelectedTerm(path.terms[0]);
  };

  const handlePathNext = () => {
    if (!selectedPath) return;
    const nextIndex = pathProgress + 1;
    if (nextIndex < selectedPath.terms.length) {
      setPathProgress(nextIndex);
      setSelectedTerm(selectedPath.terms[nextIndex]);
    } else {
      // Path complete
      setSelectedPath(null);
      setPathProgress(0);
    }
  };

  const handlePathPrev = () => {
    if (!selectedPath || pathProgress === 0) return;
    const prevIndex = pathProgress - 1;
    setPathProgress(prevIndex);
    setSelectedTerm(selectedPath.terms[prevIndex]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-scale-in bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-ios-blue/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-ios-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learn About Investing</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Understand the metrics behind your portfolio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'glossary', label: 'Glossary', icon: BookOpen },
              { id: 'paths', label: 'Learning Paths', icon: Target },
              { id: 'categories', label: 'By Category', icon: PieChart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedPath(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-ios-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar / List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {activeTab === 'glossary' && (
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-ios-blue focus:ring-2 focus:ring-ios-blue/20 outline-none text-sm"
                  />
                </div>

                {/* Term list */}
                <div className="space-y-1">
                  {(filteredTerms || Object.entries(FINANCIAL_TERMS).map(([key, term]) => ({ key, ...term }))).map(
                    (term) => (
                      <button
                        key={term.key}
                        onClick={() => setSelectedTerm(term.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          selectedTerm === term.key
                            ? 'bg-ios-blue text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{term.term}</div>
                        <div
                          className={`text-xs truncate ${
                            selectedTerm === term.key ? 'text-white/80' : 'text-gray-500'
                          }`}
                        >
                          {term.short}
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === 'paths' && (
              <div className="p-4 space-y-3">
                {LEARNING_PATHS.map((path) => {
                  const PathIcon = path.icon;
                  const isActive = selectedPath?.id === path.id;
                  return (
                    <button
                      key={path.id}
                      onClick={() => handlePathStart(path)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'border-ios-blue bg-ios-blue/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-ios-blue/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? 'bg-ios-blue text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <PathIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{path.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{path.description}</div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <span>{path.terms.length} topics</span>
                            <span>•</span>
                            <span>{path.duration}</span>
                          </div>
                          {isActive && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-ios-blue transition-all"
                                  style={{
                                    width: `${((pathProgress + 1) / path.terms.length) * 100}%`,
                                  }}
                                />
                              </div>
                              <div className="text-xs text-ios-blue mt-1">
                                {pathProgress + 1} of {path.terms.length}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="p-4 space-y-2">
                {Object.entries(CATEGORIES).map(([catKey, cat]) => {
                  const CatIcon = cat.icon;
                  const isExpanded = expandedCategories[catKey];
                  const terms = termsByCategory[catKey] || [];

                  if (terms.length === 0) return null;

                  return (
                    <div key={catKey}>
                      <button
                        onClick={() => toggleCategory(catKey)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${cat.bgColor} ${cat.borderColor} border`}
                      >
                        <CatIcon className={`w-5 h-5 text-${cat.color}`} />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">{cat.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{terms.length} terms</div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-8 mt-1 space-y-1">
                          {terms.map((term) => (
                            <button
                              key={term.key}
                              onClick={() => setSelectedTerm(term.key)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedTerm === term.key
                                  ? 'bg-ios-blue text-white'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {term.term}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="flex-1 overflow-y-auto">
            {selectedTerm && FINANCIAL_TERMS[selectedTerm] ? (
              <TermDetail
                term={FINANCIAL_TERMS[selectedTerm]}
                termKey={selectedTerm}
                selectedPath={selectedPath}
                pathProgress={pathProgress}
                onNext={handlePathNext}
                onPrev={handlePathPrev}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <BookOpen className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Select a term to learn more</p>
                <p className="text-sm">Or start a learning path for guided education</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Term Detail Component
 */
const TermDetail = ({ term, termKey, selectedPath, pathProgress, onNext, onPrev }) => {
  const Icon = term.icon || BookOpen;
  const category = CATEGORIES[term.category] || CATEGORIES.general;

  return (
    <div className="p-6">
      {/* Path navigation */}
      {selectedPath && (
        <div className="mb-6 p-4 bg-ios-blue/5 rounded-xl border border-ios-blue/20">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ios-blue">
              Learning: {selectedPath.title}
            </div>
            <div className="text-xs text-gray-500">
              Step {pathProgress + 1} of {selectedPath.terms.length}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onPrev}
              disabled={pathProgress === 0}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-ios-blue text-white hover:bg-ios-blue/90 transition-colors"
            >
              {pathProgress === selectedPath.terms.length - 1 ? 'Complete Path' : 'Next Topic'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`p-4 rounded-2xl ${category.bgColor}`}
        >
          <Icon className={`w-8 h-8 text-${category.color}`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{term.term}</h3>
          <p className="text-lg text-ios-blue mt-1">{term.short}</p>
          <span
            className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${category.bgColor} ${category.borderColor} border`}
          >
            {category.label}
          </span>
        </div>
      </div>

      {/* Full explanation */}
      <div className="prose prose-gray max-w-none">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What is it?</h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{term.full}</p>
      </div>

      {/* Example */}
      {term.example && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-amber-900 dark:text-amber-200">Real-World Example</h4>
          </div>
          <p className="text-amber-800 dark:text-amber-300">{term.example}</p>
        </div>
      )}

      {/* Range indicators */}
      {term.range && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Interpret</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(term.range).map(([key, val]) => (
              <div
                key={key}
                className="p-4 rounded-xl border text-center"
                style={{
                  background: `${val.color}10`,
                  borderColor: `${val.color}40`,
                }}
              >
                <div className="text-xl font-bold" style={{ color: val.color }}>
                  {val.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{val.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related terms */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Related Concepts
        </h4>
        <div className="flex flex-wrap gap-2">
          {getRelatedTerms(termKey).map((relatedKey) => {
            const related = FINANCIAL_TERMS[relatedKey];
            if (!related) return null;
            return (
              <span
                key={relatedKey}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {related.term}
              </span>
            );
          })}
        </div>
      </div>

      {/* Pro tip */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-900">Pro Tip</h4>
        </div>
        <p className="text-green-800 text-sm">
          {getProTip(termKey)}
        </p>
      </div>
    </div>
  );
};

/**
 * Get related terms based on category
 */
const getRelatedTerms = (termKey) => {
  const term = FINANCIAL_TERMS[termKey];
  if (!term) return [];

  const related = Object.entries(FINANCIAL_TERMS)
    .filter(([key, t]) => key !== termKey && t.category === term.category)
    .slice(0, 4)
    .map(([key]) => key);

  return related;
};

/**
 * Get pro tips for each term
 */
const getProTip = (termKey) => {
  const tips = {
    beta: 'A portfolio beta of 0.5-0.8 offers market participation with reduced volatility. Perfect for conservative growth.',
    volatility: 'Target 12-15% annual volatility for a balanced risk/return profile. Higher isn\'t always better.',
    sharpeRatio: 'Focus on Sharpe ratio over raw returns. A 10% return with 1.5 Sharpe is better than 15% return with 0.5 Sharpe.',
    var: 'Use VaR as a "normal day" risk limit. But remember: the worst days are always worse than VaR predicts.',
    cvar: 'CVaR is more honest than VaR about tail risk. Always check both metrics together.',
    correlation: 'Adding just one uncorrelated asset can dramatically reduce portfolio risk without hurting returns.',
    hhi: 'Keep HHI below 0.15 for proper diversification. Above 0.25 means dangerous concentration.',
    effectiveHoldings: 'Aim for 10+ effective holdings. It\'s not about the number of stocks, but their weights.',
    minimumVariance: 'Minimum variance often outperforms in bear markets. Consider tilting toward it when volatility spikes.',
    riskParity: 'Risk parity is excellent for uncertain markets - no single position dominates your risk.',
    liquidity: 'Never put more than 2% in illiquid positions. You don\'t want to be trapped when you need to sell.',
    taxLossHarvesting: 'Review for tax-loss harvesting in December. Those losses can offset gains for years.',
    default: 'Understanding this metric helps you make smarter investment decisions. Knowledge compounds like interest!',
  };
  return tips[termKey] || tips.default;
};

/**
 * Hook for using LearnMoreModal
 */
export const useLearnMore = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTerm, setInitialTerm] = useState(null);
  const [initialCategory, setInitialCategory] = useState(null);

  const openGlossary = () => {
    setInitialTerm(null);
    setInitialCategory(null);
    setIsOpen(true);
  };

  const openTerm = (term) => {
    setInitialTerm(term);
    setInitialCategory(null);
    setIsOpen(true);
  };

  const openCategory = (category) => {
    setInitialTerm(null);
    setInitialCategory(category);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setInitialTerm(null);
    setInitialCategory(null);
  };

  return {
    isOpen,
    initialTerm,
    initialCategory,
    openGlossary,
    openTerm,
    openCategory,
    close,
  };
};

export default LearnMoreModal;
