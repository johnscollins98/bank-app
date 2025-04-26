import React, { ReactNode, use, useCallback, useOptimistic } from "react";

const useProgressInternal = () => {
  const [loading, setLoading] = useOptimistic(false);

  const start = useCallback(() => {
    setLoading(true);
  }, [setLoading]);

  return { loading, start };
};

export const ProgressContext = React.createContext<ReturnType<
  typeof useProgressInternal
> | null>(null);

export const useProgressContext = () => use(ProgressContext)!;

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const value = useProgressInternal();
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
