import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadModel } from './model';

interface AIContextType {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  ensureModelLoaded: () => Promise<void>;
  retryLoading: () => Promise<void>;
}

const AIContext = createContext<AIContextType>({
  isReady: false,
  isLoading: false,
  error: null,
  ensureModelLoaded: async () => {},
  retryLoading: async () => {},
});

const MAX_RETRIES = 3;

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const ensureModelLoaded = useCallback(async () => {
    if (isReady || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await loadModel();
      setIsReady(true);
      console.log('[AI Context] Model loaded successfully');
    } catch (err) {
      console.error('[AI Context] Failed to load AI model', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, isLoading]);

  const retryLoading = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      console.warn('[AI Context] Max retries reached');
      return;
    }
    setRetryCount(prev => prev + 1);
    setError(null);
    await ensureModelLoaded();
  }, [retryCount, ensureModelLoaded]);

  // Background preloading when browser is idle
  useEffect(() => {
    const schedulePreload = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          ensureModelLoaded();
        }, { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          ensureModelLoaded();
        }, 2000);
      }
    };

    // Delay preload to not block initial page render
    const timer = setTimeout(schedulePreload, 1000);
    return () => clearTimeout(timer);
  }, [ensureModelLoaded]);

  return (
    <AIContext.Provider value={{ isReady, isLoading, error, ensureModelLoaded, retryLoading }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);

