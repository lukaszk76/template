import React, { memo } from "react";
import { Icons } from "@/components/icons";
import { useTranslations } from "@/lib/useTranslations";

export const Footer = memo(() => {
  const { getTranslation } = useTranslations();
  return (
    <div className="absolute z-10 w-screen h-max bg-background flex justify-center items-center w-full">
      <div className="w-full max-w-[1200px] h-max px-12 py-8 bg-muted flex flex-col gap-4 justify-end w-full">
        <div className="text-sm font-bold text-muted-foreground flex gap-2 items-center pb-4">
          <Icons.logo className="w-6" />
          Łukasz Kaczmarek CodeDev
        </div>
        <div className="flex flex-col md:flex-row h-max justify-between w-full ">
          <div className="text-xs text-muted-foreground flex gap-2 items-center">
            <Icons.home className="w-3" /> {getTranslation("address")}
          </div>
          <div className="text-xs text-muted-foreground flex gap-2 items-center">
            <Icons.phone className="w-3" />
            <a href="tel:+48690399839" style={{ cursor: "none" }}>
              +48 690 399 839
            </a>
          </div>
          <div className="text-xs text-muted-foreground flex gap-2 items-center">
            <Icons.mail className="w-3" />{" "}
            <a
              href="mailto:lukasz.kaczmarek.codedev@gmail.com"
              style={{ cursor: "none" }}
            >
              lukasz.kaczmarek.codedev@gmail.com
            </a>
          </div>
          <div className="text-xs text-muted-foreground flex gap-2 items-center">
            <Icons.hash className="w-3" /> NIP: 716-17-98-627
          </div>
          <div className="text-xs text-muted-foreground flex gap-2 items-center">
            <Icons.hash className="w-3" /> REGON: 432685791
          </div>
        </div>
      </div>
    </div>
  );
});

Footer.displayName = "Footer";
