"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressApi = {
  start: () => void;
  done: () => void;
};

const NProgressContext = React.createContext<ProgressApi | null>(null);

export function NProgressProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);
  const hideRef = React.useRef<number | null>(null);

  const clearTimers = React.useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (hideRef.current !== null) window.clearTimeout(hideRef.current);
    timerRef.current = null;
    hideRef.current = null;
  }, []);

  const start = React.useCallback(() => {
    clearTimers();
    setActive(true);
    setValue(18);

    timerRef.current = window.setInterval(() => {
      setValue((current) => {
        if (current >= 88) {
          if (timerRef.current !== null) window.clearInterval(timerRef.current);
          timerRef.current = null;
          return 88;
        }

        return Math.min(88, current + Math.max(3, Math.round((100 - current) * 0.12)));
      });
    }, 180);
  }, [clearTimers]);

  const done = React.useCallback(() => {
    clearTimers();
    setValue(100);
    hideRef.current = window.setTimeout(() => {
      setActive(false);
      setValue(0);
    }, 220);
  }, [clearTimers]);

  React.useEffect(() => clearTimers, [clearTimers]);

  const contextValue = React.useMemo(() => ({ start, done }), [start, done]);

  return (
    <NProgressContext.Provider value={contextValue}>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full overflow-hidden transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className="h-full rounded-r-full bg-ktr-primary shadow-[0_0_18px_rgba(32,64,255,0.45)] transition-[width,opacity] duration-200 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      {children}
    </NProgressContext.Provider>
  );
}

export function useNProgress() {
  const context = React.useContext(NProgressContext);
  if (!context) {
    throw new Error("useNProgress must be used within NProgressProvider");
  }

  return context;
}
