"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { PRODUCT_TOUR_STEPS } from "@/lib/onboarding/steps";
import { PRODUCT_TOUR_START_EVENT } from "@/lib/onboarding/constants";

type ProductTourContextValue = {
  startTour: (options?: { manual?: boolean }) => void;
  isRunning: boolean;
};

const ProductTourContext = createContext<ProductTourContextValue | null>(null);

async function markOnboardingComplete() {
  await fetch("/api/onboarding", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ onboardingCompleted: true }),
  });
}

function createTourDriver(onDone: () => void): Driver {
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    void markOnboardingComplete().finally(onDone);
  };

  return driver({
    showProgress: true,
    allowClose: true,
    overlayClickBehavior: "close",
    steps: PRODUCT_TOUR_STEPS,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Finish",
    onDestroyed: finish,
  });
}

export function ProductTourProvider({
  onboardingCompleted,
  deferAutoTour = false,
  children,
}: {
  onboardingCompleted: boolean;
  deferAutoTour?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const driverRef = useRef<Driver | null>(null);
  const autoStartedRef = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(onboardingCompleted);

  const startTour = useCallback(
    (options?: { manual?: boolean }) => {
      if (driverRef.current?.isActive()) return;

      const manual = options?.manual ?? false;
      if (!manual && completed) return;

      driverRef.current?.destroy();
      setIsRunning(true);
      window.dispatchEvent(new Event(PRODUCT_TOUR_START_EVENT));

      const instance = createTourDriver(() => {
        setIsRunning(false);
        setCompleted(true);
        driverRef.current = null;
      });

      driverRef.current = instance;
      instance.drive();
    },
    [completed]
  );

  useEffect(() => {
    if (completed || autoStartedRef.current || deferAutoTour) return;
    if (pathname !== "/app") return;

    autoStartedRef.current = true;
    const timer = window.setTimeout(() => startTour(), 600);
    return () => window.clearTimeout(timer);
  }, [pathname, completed, deferAutoTour, startTour]);

  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, []);

  return (
    <ProductTourContext.Provider value={{ startTour, isRunning }}>
      {children}
    </ProductTourContext.Provider>
  );
}

export function useProductTour() {
  const ctx = useContext(ProductTourContext);
  if (!ctx) {
    throw new Error("useProductTour must be used within ProductTourProvider");
  }
  return ctx;
}
