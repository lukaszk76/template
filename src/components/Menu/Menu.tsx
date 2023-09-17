import React, { memo } from "react";
import { LanguageSelector } from "@/components/Menu/LanguageSelector";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export const Menu = memo(() => {
  return (
    <div className="fixed z-10 w-screen h-[7vh] bg-background flex justify-center items-center">
      <div className="flex w-full max-w-[1200px] h-full items-center justify-between px-12 bg-muted">
        <div></div>
        <div className="flex items-center">
          <a
            href="https://www.linkedin.com/in/%C5%82ukasz-kaczmarek-849a1b81/"
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.linkedin className="h-5 w-5" />
            </div>
          </a>

          <a
            href="https://github.com/lukaszk76"
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.github className="h-5 w-5" />
            </div>
          </a>

          <LanguageSelector />
        </div>
      </div>
    </div>
  );
});

Menu.displayName = "Menu";
