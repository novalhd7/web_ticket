"use client";

import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";

export const StarsBackgroundDemo = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND */}
      <StarsBackground
        starColor="#FFF"
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* FOREGROUND */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
