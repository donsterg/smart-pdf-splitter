import {
  useState,
  useCallback,
} from 'react';

export default function useProgress() {

  const [progress, setProgress] =
    useState(0);

  const resetProgress =
    useCallback(() => {

      setProgress(0);

    }, []);

  const completeProgress =
    useCallback(() => {

      setProgress(100);

    }, []);

  return {
    progress,
    setProgress,
    resetProgress,
    completeProgress,
  };
}