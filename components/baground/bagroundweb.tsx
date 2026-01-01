"use client";

import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";

export const StarsBackgroundDemo = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative overflow-hidden pt-32 pb-20">
      {/* BACKGROUND (NAIK) */}
      <StarsBackground
        starColor="#FFF"
        className="
          absolute inset-0 
          z-0 
          pointer-events-none 
          -translate-y-5
        "
      />

      {/* FOREGROUND */}
      <div className="relative z-10 flex justify-center">{children}</div>
    </div>
  );
};
