import React, { memo } from "react";
import { LanguageSelector } from "@/components/Menu/LanguageSelector";

export const Menu = memo(() => {
  return (
    <div className="fixed z-10 w-full h-[7vh] bg-background flex justify-center items-center">
      <div className="flex w-full max-w-[1200px] h-full items-center justify-between px-12 bg-muted">
        <div></div>
        <LanguageSelector />
      </div>
    </div>
  );
});

Menu.displayName = "Menu";
