/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_DURATION = 4000;

const toastStyles = {
  success: {
    bg: 'bg-ios-green/15 dark:bg-ios-green/20',
    border: 'border-ios-green/30',
    icon: CheckCircle,
    iconColor: 'text-ios-green',
  },
  error: {
    bg: 'bg-ios-red/15 dark:bg-ios-red/20',
    border: 'border-ios-red/30',
    icon: XCircle,
    iconColor: 'text-ios-red',
  },
  warning: {
    bg: 'bg-ios-orange/15 dark:bg-ios-orange/20',
    border: 'border-ios-orange/30',
    icon: AlertCircle,
    iconColor: 'text-ios-orange',
  },
  info: {
    bg: 'bg-ios-blue/15 dark:bg-ios-blue/20',
    border: 'border-ios-blue/30',
    icon: Info,
    iconColor: 'text-ios-blue',
  },
};

const Toast = ({ id, type, title, message, onDismiss }) => {
  const style = toastStyles[type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-2xl backdrop-blur-xl border shadow-lg
        ${style.bg} ${style.border}
        animate-slide-in-right
        max-w-sm w-full
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
        )}
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = TOAST_DURATION }) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
    custom: addToast,
    dismiss: dismissToast,
    dismissAll: () => setToasts([]),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
