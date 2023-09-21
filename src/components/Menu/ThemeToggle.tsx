import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useEffect } from "react";
import { useTranslations } from "@/lib/useTranslations";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { getTranslation } = useTranslations();

  useEffect(() => {
    const event = new Event(theme === "light" ? "light" : "dark");
    window.dispatchEvent(event);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
    window.location.reload();
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleThemeChange}>
      <div className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 flex items-center justify-center gap-2">
        <div className="w-6 h-6">
          <Icons.yinYang />
        </div>
        <span className="hidden md:block">{getTranslation("dark_side")}</span>
      </div>

      <div className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 flex items-center justify-center gap-2">
        <div className="w-6 h-6">
          <Icons.yinYang />
        </div>
        <span className="hidden md:block">{getTranslation("light_side")}</span>
      </div>

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
