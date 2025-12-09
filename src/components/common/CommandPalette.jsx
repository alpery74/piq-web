import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Activity,
  TrendingUp,
  Layers,
  Target,
  Settings,
  Moon,
  Sun,
  Download,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  Command,
  BarChart3,
  Shield,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Command categories and items
const getCommands = (isDark, toggleTheme) => [
  {
    category: 'Navigation',
    items: [
      {
        id: 'nav-health',
        icon: Activity,
        label: 'Go to Coach View',
        shortcut: '1',
        action: () => document.getElementById('health-section')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'nav-insights',
        icon: TrendingUp,
        label: 'Go to Analyst View',
        shortcut: '2',
        action: () => document.getElementById('insights-section')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'nav-holdings',
        icon: Layers,
        label: 'Go to Quant View',
        shortcut: '3',
        action: () => document.getElementById('holdings-section')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'nav-goals',
        icon: Target,
        label: 'Go to Goals',
        shortcut: '4',
        action: () => document.getElementById('goals-section')?.scrollIntoView({ behavior: 'smooth' }),
      },
    ],
  },
  {
    category: 'Actions',
    items: [
      {
        id: 'action-optimize',
        icon: Zap,
        label: 'Optimize Portfolio',
        description: 'Run optimization strategies',
        action: () => document.getElementById('optimization-section')?.scrollIntoView({ behavior: 'smooth' }),
      },
      {
        id: 'action-export',
        icon: Download,
        label: 'Export Report',
        description: 'Download PDF or CSV',
        action: () => window.print(),
      },
      {
        id: 'action-refresh',
        icon: RefreshCw,
        label: 'Refresh Analysis',
        description: 'Re-run portfolio analysis',
        action: () => window.location.reload(),
      },
    ],
  },
  {
    category: 'Settings',
    items: [
      {
        id: 'settings-theme',
        icon: isDark ? Sun : Moon,
        label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        shortcut: 'T',
        action: toggleTheme,
      },
      {
        id: 'settings-advanced',
        icon: BarChart3,
        label: 'Toggle Advanced Metrics',
        shortcut: 'A',
        action: () => {
          const btn = document.querySelector('[aria-pressed]');
          if (btn) btn.click();
        },
      },
    ],
  },
  {
    category: 'Help',
    items: [
      {
        id: 'help-guide',
        icon: HelpCircle,
        label: 'View User Guide',
        description: 'Learn how to use the dashboard',
        action: () => window.open('/legal', '_self'),
      },
      {
        id: 'help-glossary',
        icon: Shield,
        label: 'Financial Terms Glossary',
        description: 'Understand key metrics',
        action: () => document.querySelector('[title="Learn about investing terms"]')?.click(),
      },
    ],
  },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  const commands = useMemo(() => getCommands(isDark, toggleTheme), [isDark, toggleTheme]);

  // Flatten commands for navigation
  const flatCommands = useMemo(() => {
    return commands.flatMap((cat) => cat.items);
  }, [commands]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const searchLower = search.toLowerCase();
    return commands
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.label.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [commands, search]);

  const flatFilteredCommands = useMemo(() => {
    return filteredCommands.flatMap((cat) => cat.items);
  }, [filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatFilteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatFilteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (flatFilteredCommands[selectedIndex]) {
            flatFilteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatFilteredCommands, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const selected = listRef.current?.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-gray-200 dark:border-gray-700">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-base"
          />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
            <span>esc</span>
          </kbd>
        </div>

        {/* Command list */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No commands found</p>
            </div>
          ) : (
            filteredCommands.map((category, catIndex) => (
              <div key={category.category}>
                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {category.category}
                  </span>
                </div>
                {category.items.map((item) => {
                  const globalIndex = flatFilteredCommands.findIndex((c) => c.id === item.id);
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      data-selected={isSelected}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        isSelected
                          ? 'bg-ios-blue/10 dark:bg-ios-blue/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-ios-blue/20 text-ios-blue'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${
                          isSelected ? 'text-ios-blue' : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                          {item.shortcut}
                        </kbd>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Hook to manage command palette state
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
};

export default CommandPalette;
