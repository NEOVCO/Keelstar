"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useProductTour } from "@/components/onboarding/ProductTourProvider";

export function RestartTourButton({
  variant = "secondary",
  size = "sm",
  className,
}: Pick<ButtonProps, "variant" | "size" | "className">) {
  const { startTour, isRunning } = useProductTour();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={isRunning}
      onClick={() => startTour({ manual: true })}
    >
      {isRunning ? "Tour in progress…" : "Restart product tour"}
    </Button>
  );
}
