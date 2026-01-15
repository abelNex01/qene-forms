import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadModel } from './model';

interface AIContextType {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  ensureModelLoaded: () => Promise<void>;
}

const AIContext = createContext<AIContextType>({
  isReady: false,
  isLoading: false,
  error: null,
  ensureModelLoaded: async () => {},
});

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ensureModelLoaded = async () => {
    if (isReady) return;
    setIsLoading(true);
    try {
      await loadModel();
      setIsReady(true);
    } catch (err) {
      console.error('Failed to load AI model', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Warm up on mount (lazy loading preferred for performance, but we can set up the struct)
  // useEffect(() => { ensureModelLoaded(); }, []);

  return (
    <AIContext.Provider value={{ isReady, isLoading, error, ensureModelLoaded }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
