import { useEffect, useRef, useState } from 'react';
import { pollUnifiedResults } from '@/services/analysisService';

const SUBTOOLS = [
  'math_correlation',
  'math_risk_metrics',
  'math_performance',
  'math_volatility',
  'math_quality_metrics',
  'math_performance_attribution',
  'optimization_risk_decomposition',
  'optimization_strategy_generation',
  'optimization_implementation',
  'optimization_stress_testing',
  'optimization_esg',
];

const getDelayMs = (recommendation, emptyPolls) => {
  switch (recommendation) {
    case 'aggressive':
      return 2000;
    case 'moderate':
      return 7000;
    case 'gentle':
      return 20000;
    default: {
      const backoff = 2000 * Math.pow(1.3, emptyPolls);
      return Math.min(backoff, 30000);
    }
  }
};

export const useAnalysisPolling = (analysisRunId) => {
  const [results, setResults] = useState({});
  const [pending, setPending] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  // Track connection timing for "waking up" indicator
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, waking, connected, error
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  const lastSinceRef = useRef(null);
  const activeRef = useRef(false);
  const timeoutRef = useRef(null);
  const pendingRef = useRef(new Set());
  const totalRef = useRef(SUBTOOLS.length);
  const emptyPollsRef = useRef(0);
  const firstResponseRef = useRef(false);

  useEffect(() => {
    if (!analysisRunId) return;

    const initialPending = new Set(SUBTOOLS);
    pendingRef.current = initialPending;
    totalRef.current = initialPending.size || SUBTOOLS.length;
    emptyPollsRef.current = 0;
    lastSinceRef.current = null;
    firstResponseRef.current = false;

    setResults({});
    setPending(initialPending);
    setProgress(0);
    setError(null);
    activeRef.current = true;
    setLoading(true);
    setConnectionStatus('connecting');
    setLoadingStartTime(Date.now());

    const clearTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const finalize = () => {
      activeRef.current = false;
      clearTimer();
      setLoading(false);
      setConnectionStatus('idle');
      setLoadingStartTime(null);
    };

    const processParsedResults = (parsedResults) => {
      if (!parsedResults || !Object.keys(parsedResults).length) {
        return false;
      }
      setResults((prev) => ({ ...prev, ...parsedResults }));
      setPending((prev) => {
        const next = new Set(prev);
        Object.keys(parsedResults).forEach((key) => next.delete(key));
        pendingRef.current = next;
        return next;
      });
      return true;
    };

    const performFinalCheck = async () => {
      try {
        const finalResponse = await pollUnifiedResults(analysisRunId, lastSinceRef.current);
        lastSinceRef.current = finalResponse.timestamp || lastSinceRef.current;
        processParsedResults(finalResponse?.parsedResults || {});
      } catch (err) {
        // Final polling check failed - continue with cleanup
      }
      // When the backend tells us to stop, treat the session as complete for UI purposes.
      setPending(new Set());
      pendingRef.current = new Set();
      setProgress(100);
      finalize();
    };

    const poll = async () => {
      if (!activeRef.current) return;
      try {
        const response = await pollUnifiedResults(analysisRunId, lastSinceRef.current);

        // First successful response - server is awake!
        if (!firstResponseRef.current) {
          firstResponseRef.current = true;
          setConnectionStatus('connected');
        }

        lastSinceRef.current = response.timestamp || lastSinceRef.current;

        const hasNew = processParsedResults(response?.parsedResults || {});
        emptyPollsRef.current = hasNew ? 0 : emptyPollsRef.current + 1;

        // If the backend shares total/completed counts, align our progress to it.
        if (response.metadata?.totalTools && response.metadata?.completedTools >= 0) {
          totalRef.current = response.metadata.totalTools;
          const metaProgress = Math.round((response.metadata.completedTools / response.metadata.totalTools) * 100);
          setProgress(metaProgress);
        }

        if (response.metadata?.pollingRecommendation === 'stop') {
          await performFinalCheck();
          return;
        }

        if (pendingRef.current.size === 0) {
          finalize();
          return;
        }

        const delay = getDelayMs(response.metadata?.pollingRecommendation, emptyPollsRef.current);
        timeoutRef.current = setTimeout(poll, delay);
      } catch (err) {
        // Polling error occurred
        setError(err);
        setConnectionStatus('error');
        finalize();
      }
    };

    // Kick off immediately, subsequent polls are scheduled dynamically
    poll();

    return () => {
      activeRef.current = false;
      clearTimer();
    };
  }, [analysisRunId]);

  useEffect(() => {
    const remaining = pending.size;
    const total = totalRef.current || SUBTOOLS.length;
    const completed = total - remaining;
    const nextProgress = total ? Math.round((completed / total) * 100) : 0;
    setProgress(nextProgress);
    if (remaining === 0 && loading) {
      setLoading(false);
    }
  }, [pending, loading]);

  return {
    results,
    loading,
    error,
    progress,
    pending,
    // New: connection status for "waking up" indicator
    connectionStatus,
    loadingStartTime,
  };
};

export default useAnalysisPolling;
