/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  TrendingUp,
  Layers,
  Target,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Eye,
  MousePointer,
  Zap,
} from 'lucide-react';

// Context for sharing onboarding state across the app
const OnboardingContext = createContext(null);

// Onboarding steps configuration
// highlightHeader: true means only highlight the first ~100px of a section (the header)
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to PIQ Labs',
    subtitle: 'Your AI-Powered Portfolio Intelligence',
    description:
      'Get institutional-grade portfolio analysis with our three-tier visualization system: Simple, Analyst, and Quant. Let\'s take a quick tour to help you get the most out of your dashboard.',
    icon: Sparkles,
    color: 'ios-purple',
    position: 'center',
  },
  {
    id: 'hero',
    title: 'Portfolio Overview',
    subtitle: 'Your Key Metrics at a Glance',
    description:
      'See your total portfolio value, daily changes, and health score in one place. Tap the portfolio name at the top to switch between portfolios or start a new analysis.',
    icon: Activity,
    color: 'ios-blue',
    targetSelector: '.card-glass-hero',
    position: 'bottom',
  },
  {
    id: 'nav-pills',
    title: 'Section Navigation',
    subtitle: 'Jump to Any Section',
    description:
      'Use these pills to quickly navigate between sections. They highlight automatically as you scroll, showing where you are on the page.',
    icon: MousePointer,
    color: 'ios-blue',
    targetSelector: '.md\\:sticky',
    position: 'bottom',
  },
  {
    id: 'view-tier-toggle',
    title: '3-Tier Detail System',
    subtitle: 'Control Information Depth',
    description:
      'Use this dropdown to switch between Simple (quick metrics), Analyst (deeper context), and Quant (full data). This controls HOW MUCH detail you see in each section.',
    icon: Eye,
    color: 'ios-purple',
    targetSelector: '.group:has([title*="Current view"])',
    position: 'bottom',
  },
  {
    id: 'overview-section',
    title: 'Overview Section',
    subtitle: 'Health Score & Key Metrics',
    description:
      'Start here! See your portfolio health score and key risk indicators. Colored badges help you quickly identify areas that need attention.',
    icon: Activity,
    color: 'ios-green',
    targetSelector: '#overview-section',
    position: 'bottom',
    highlightHeader: true,
  },
  {
    id: 'risk-section',
    title: 'Risk Analysis',
    subtitle: 'VaR, Volatility & Stress Testing',
    description:
      'Understand your risk exposure with VaR, CVaR, volatility metrics, and stress test scenarios. See Monte Carlo simulations and tail risk assessments.',
    icon: TrendingUp,
    color: 'ios-red',
    targetSelector: '#risk-section',
    position: 'bottom',
    highlightHeader: true,
  },
  {
    id: 'holdings-section',
    title: 'Holdings',
    subtitle: 'Position Data & Allocation',
    description:
      'View all your positions, weights, risk contributions, and sector allocations. Interactive charts help visualize your portfolio composition.',
    icon: Layers,
    color: 'ios-blue',
    targetSelector: '#holdings-section',
    position: 'bottom',
    highlightHeader: true,
  },
  {
    id: 'optimization-section',
    title: 'Optimization',
    subtitle: 'AI-Powered Recommendations',
    description:
      'Get actionable portfolio optimization strategies, implementation steps, and risk decomposition analysis. Toggle "ESG Mode" to see ESG-aware optimization strategies with environmental, social, and governance scores.',
    icon: Target,
    color: 'ios-orange',
    targetSelector: '#optimization-section',
    position: 'bottom',
    highlightHeader: true,
  },
  {
    id: 'tooltips',
    title: 'Educational Tooltips',
    subtitle: 'Learn as You Go',
    description:
      'Hover over any metric with an info icon to see plain-English explanations. We\'ll teach you financial concepts as you explore your data. Click "Learn" in the toolbar for more.',
    icon: MousePointer,
    color: 'ios-orange',
    position: 'center',
  },
  {
    id: 'command-palette',
    title: 'Power User Tip',
    subtitle: 'Quick Navigation',
    description:
      'Press Cmd+K (or Ctrl+K on Windows) anytime to open the command palette. Search for any section, toggle settings, or take quick actions.',
    icon: Zap,
    color: 'ios-orange',
    position: 'center',
    shortcut: '⌘K',
  },
];

// Spotlight overlay for highlighting elements
const Spotlight = ({ targetRect, padding = 12 }) => {
  if (!targetRect) return null;

  const { top, left, width, height } = targetRect;

  return (
    <div className="fixed inset-0 pointer-events-none z-[90]">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={left - padding}
              y={top - padding}
              width={width + padding * 2}
              height={height + padding * 2}
              rx="16"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#spotlight-mask)"
        />
      </svg>
      {/* Highlight border */}
      <div
        className="absolute border-2 border-ios-blue rounded-2xl animate-pulse-slow"
        style={{
          top: top - padding,
          left: left - padding,
          width: width + padding * 2,
          height: height + padding * 2,
        }}
      />
    </div>
  );
};

// Tooltip card for each step
const StepTooltip = ({ step, currentStep, totalSteps, onNext, onPrev, onSkip, targetRect }) => {
  const Icon = step.icon;

  // Tooltip dimensions (approximate)
  const tooltipHeight = 280;
  const tooltipWidth = 360;
  const padding = 20;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate position based on target and preference, ensuring it stays in viewport
  let tooltipStyle = {};
  let arrowPosition = 'none';

  if (step.position === 'center' || !targetRect) {
    // Center in viewport
    tooltipStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  } else {
    // Calculate horizontal position (same for both top and bottom)
    const leftPos = Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, viewportWidth - tooltipWidth - padding));

    // Check if there's enough space below the target
    const spaceBelow = viewportHeight - targetRect.bottom - padding;
    const spaceAbove = targetRect.top - padding;

    // Prefer the requested position, but fall back if not enough space
    let useBottom = step.position === 'bottom';

    if (useBottom && spaceBelow < tooltipHeight && spaceAbove > spaceBelow) {
      useBottom = false; // Switch to top
    } else if (!useBottom && spaceAbove < tooltipHeight && spaceBelow > spaceAbove) {
      useBottom = true; // Switch to bottom
    }

    if (useBottom) {
      // Position below target, but ensure it doesn't go off screen
      const topPos = Math.min(targetRect.bottom + padding, viewportHeight - tooltipHeight - padding);
      tooltipStyle = {
        top: Math.max(padding, topPos),
        left: leftPos,
      };
      arrowPosition = 'top';
    } else {
      // Position above target, but ensure it doesn't go off screen
      const topPos = Math.max(padding, targetRect.top - tooltipHeight - padding);
      tooltipStyle = {
        top: topPos,
        left: leftPos,
      };
      arrowPosition = 'bottom';
    }
  }

  return (
    <div
      className="fixed z-[95] w-[360px] animate-scale-in"
      style={tooltipStyle}
    >
      {/* Arrow */}
      {arrowPosition === 'top' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-900 rotate-45 border-t border-l border-gray-200 dark:border-gray-700" />
      )}
      {arrowPosition === 'bottom' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-900 rotate-45 border-b border-r border-gray-200 dark:border-gray-700" />
      )}

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className={`bg-${step.color}/10 p-4`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-${step.color}/20`}>
              <Icon className={`w-5 h-5 text-${step.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{step.title}</h3>
              <p className={`text-sm text-${step.color}`}>{step.subtitle}</p>
            </div>
            {step.shortcut && (
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                {step.shortcut}
              </kbd>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStep
                    ? `bg-${step.color}`
                    : i < currentStep
                    ? 'bg-gray-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            {currentStep < totalSteps - 1 ? (
              <button
                onClick={onNext}
                className={`flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-${step.color} hover:opacity-90 rounded-lg transition-opacity`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onSkip}
                className={`flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-${step.color} hover:opacity-90 rounded-lg transition-opacity`}
              >
                Get Started
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Skip link */}
        {currentStep < totalSteps - 1 && (
          <div className="px-4 pb-3 text-center">
            <button
              onClick={onSkip}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Skip tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main onboarding wizard component
const OnboardingWizard = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const step = ONBOARDING_STEPS[currentStep];

  // Find and measure target element
  useEffect(() => {
    if (!isOpen) return;

    const updateTargetRect = () => {
      if (step.targetSelector) {
        const element = document.querySelector(step.targetSelector);
        if (element) {
          const rect = element.getBoundingClientRect();

          // If highlightHeader is true, only highlight the top portion (header area)
          if (step.highlightHeader) {
            const headerHeight = Math.min(150, rect.height); // Max 150px for header
            setTargetRect({
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: headerHeight,
              bottom: rect.top + headerHeight,
              right: rect.right,
            });
          } else {
            setTargetRect(rect);
          }
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    // Scroll element into view first, then update rect
    const scrollAndUpdate = () => {
      if (step.targetSelector) {
        const element = document.querySelector(step.targetSelector);
        if (element) {
          // Scroll to start (top) of element, not center
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Wait for scroll to complete before measuring
          setTimeout(updateTargetRect, 400);
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    // Initial scroll and update
    setTimeout(scrollAndUpdate, 100);

    // Update on resize only (not scroll, to avoid jumpiness)
    window.addEventListener('resize', updateTargetRect);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [isOpen, step, currentStep]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
    onComplete?.();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[85]">
      {/* Spotlight overlay */}
      <Spotlight targetRect={targetRect} />

      {/* Close button */}
      <button
        onClick={handleComplete}
        className="fixed top-4 right-4 z-[100] p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close tour"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Step tooltip */}
      <StepTooltip
        step={step}
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleComplete}
        targetRect={targetRect}
      />
    </div>,
    document.body
  );
};

// Provider component to wrap the app
export const OnboardingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });
  // Track if user has ever logged in before (not a new user)
  const [isNewUser, setIsNewUser] = useState(() => {
    return localStorage.getItem('hasLoggedInBefore') !== 'true';
  });

  // Don't auto-show onboarding here - let Dashboard handle it
  // This prevents showing on login page or other pages

  const startTour = () => setIsOpen(true);

  const endTour = () => {
    setIsOpen(false);
    setHasCompleted(true);
  };

  const resetTour = () => {
    localStorage.removeItem('onboardingComplete');
    setHasCompleted(false);
    setIsOpen(true);
  };

  // Called when user successfully logs in for the first time
  const markUserAsReturning = () => {
    localStorage.setItem('hasLoggedInBefore', 'true');
    setIsNewUser(false);
  };

  // Auto-start tour for new users (called from Dashboard after auth check)
  const autoStartForNewUser = () => {
    if (isNewUser && !hasCompleted) {
      // Delay to let the page load first
      setTimeout(() => {
        setIsOpen(true);
      }, 1500);
    }
  };

  return (
    <OnboardingContext.Provider value={{
      isOpen,
      hasCompleted,
      isNewUser,
      startTour,
      endTour,
      resetTour,
      markUserAsReturning,
      autoStartForNewUser,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook to access onboarding state from context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  // Fallback for when context is not available (shouldn't happen in normal usage)
  if (!context) {
    return {
      isOpen: false,
      hasCompleted: true,
      isNewUser: false,
      startTour: () => {},
      endTour: () => {},
      resetTour: () => {},
      markUserAsReturning: () => {},
      autoStartForNewUser: () => {},
    };
  }
  return context;
};

export default OnboardingWizard;
