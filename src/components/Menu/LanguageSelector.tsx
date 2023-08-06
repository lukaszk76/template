import React, { memo, useCallback, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTranslations } from "@/lib/useTranslations";

export const LanguageSelector = memo(() => {
  const { language } = useTranslations();
  const onLanguageSelected = useCallback((lang: string) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.set("lang", lang);

    window.location.search = urlParams.toString();
  }, []);

  const [flagFile, setFlagFile] = React.useState<string>("/poland.png");

  useEffect(() => {
    if (language === "pl") {
      setFlagFile("/poland.png");
    } else {
      setFlagFile("/england.png");
    }
  }, [language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger style={{ cursor: "none" }}>
        <div
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
          })}
          style={{ cursor: "none" }}
        >
          <img
            src={flagFile}
            width={50}
            height={20}
            alt="flag of Poland"
            className="w-6 h-4 border-[1px] border-foreground"
            style={{ cursor: "none" }}
          />
          <span className="sr-only">Languages</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ cursor: "none" }}>
        <DropdownMenuItem
          onClick={() => onLanguageSelected("pl")}
          style={{ cursor: "none" }}
        >
          <img
            src="/poland.png"
            width={50}
            height={20}
            alt="flag of Poland"
            className="mr-2 w-6 h-4 border-[1px] border-gray-300"
          />
          polski
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLanguageSelected("en")}
          style={{ cursor: "none" }}
        >
          <img
            src="/england.png"
            alt="flag of United Kingdom"
            className="mr-2 w-6 h-4 border-[1px] border-gray-300"
          />
          english
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

LanguageSelector.displayName = "LanguageSelector";
