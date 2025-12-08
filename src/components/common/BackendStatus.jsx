import { useState, useEffect } from 'react';
import { Loader2, CloudOff, Zap, Coffee } from 'lucide-react';

/**
 * Backend Status Indicator
 * Shows when Heroku dyno is waking up (cold start)
 * Heroku free/eco dynos sleep after 30 mins of inactivity
 */
const BackendStatus = ({
  isLoading = false,
  error = null,
  loadingStartTime = null,
  onRetry,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showWakingUp, setShowWakingUp] = useState(false);

  // Track elapsed time when loading
  useEffect(() => {
    if (!isLoading || !loadingStartTime) {
      setElapsedTime(0);
      setShowWakingUp(false);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - loadingStartTime;
      setElapsedTime(elapsed);

      // Show "waking up" message after 3 seconds (typical Heroku cold start takes 5-15s)
      if (elapsed > 3000 && !showWakingUp) {
        setShowWakingUp(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, loadingStartTime, showWakingUp]);

  // Error state
  if (error) {
    return (
      <div className="card-glass-red p-6 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255, 59, 48, 0.15)' }}
          >
            <CloudOff className="w-7 h-7 text-ios-red" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#1C1C1E' }}>
              Connection Error
            </h3>
            <p className="text-sm" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
              Unable to reach the analysis server. It may be temporarily unavailable.
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary mt-2"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Not loading
  if (!isLoading) {
    return null;
  }

  // Waking up state (cold start detected)
  if (showWakingUp) {
    return (
      <div className="card-glass-blue p-6 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          {/* Animated coffee icon */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: 'rgba(0, 122, 255, 0.12)' }}
            >
              <Coffee className="w-8 h-8 text-ios-blue" />
            </div>
            {/* Steam animation */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
              <span
                className="w-1 h-3 rounded-full animate-float"
                style={{
                  background: 'rgba(0, 122, 255, 0.4)',
                  animationDelay: '0s',
                }}
              />
              <span
                className="w-1 h-4 rounded-full animate-float"
                style={{
                  background: 'rgba(0, 122, 255, 0.3)',
                  animationDelay: '0.2s',
                }}
              />
              <span
                className="w-1 h-3 rounded-full animate-float"
                style={{
                  background: 'rgba(0, 122, 255, 0.4)',
                  animationDelay: '0.4s',
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#1C1C1E' }}>
              Waking up the servers...
            </h3>
            <p className="text-sm mb-2" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
              Our analysis engine is starting up. This usually takes 10-15 seconds.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(60, 60, 67, 0.4)' }}>
              <span className="tabular-nums">{Math.floor(elapsedTime / 1000)}s</span>
              <span>elapsed</span>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="w-full max-w-xs">
            <div className="progress-ios">
              <div
                className="progress-ios-fill"
                style={{
                  width: `${Math.min((elapsedTime / 15000) * 100, 95)}%`,
                }}
              />
            </div>
          </div>

          <p className="text-xs" style={{ color: 'rgba(60, 60, 67, 0.4)' }}>
            Tip: The server stays active for 30 minutes after each request
          </p>
        </div>
      </div>
    );
  }

  // Normal loading state
  return (
    <div className="card p-6 text-center animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0, 122, 255, 0.1)' }}
        >
          <Loader2 className="w-6 h-6 text-ios-blue animate-spin" />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>
            Connecting to server...
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Inline status badge for header/compact areas
 */
export const BackendStatusBadge = ({ status = 'connected' }) => {
  const statusConfig = {
    connected: {
      color: '#34C759',
      bg: 'rgba(52, 199, 89, 0.12)',
      icon: Zap,
      label: 'Connected',
    },
    connecting: {
      color: '#FF9500',
      bg: 'rgba(255, 149, 0, 0.12)',
      icon: Loader2,
      label: 'Connecting',
      animate: true,
    },
    waking: {
      color: '#007AFF',
      bg: 'rgba(0, 122, 255, 0.12)',
      icon: Coffee,
      label: 'Waking up',
      animate: true,
    },
    error: {
      color: '#FF3B30',
      bg: 'rgba(255, 59, 48, 0.12)',
      icon: CloudOff,
      label: 'Offline',
    },
  };

  const config = statusConfig[status] || statusConfig.connected;
  const Icon = config.icon;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      <Icon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </div>
  );
};

export default BackendStatus;
