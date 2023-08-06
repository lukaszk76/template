import pl from "../assets/translations-pl.json";
import en from "../assets/translations-en.json";
import React, { useCallback, useEffect, useState } from "react";

export type Translation = {
  [key: string]: string;
};
export const useTranslations = () => {
  const [texts, setTexts] = React.useState<Translation>(
    JSON.parse(JSON.stringify(pl)),
  );

  const [language, setLanguage] = useState<string>("pl");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lang = urlParams.get("lang");

    if (lang === "en") {
      setLanguage("en");
    } else {
      setLanguage("pl");
    }
  }, [window.location.search]);

  useEffect(() => {
    if (language === "en") {
      setTexts(JSON.parse(JSON.stringify(en)));
    } else {
      setTexts(JSON.parse(JSON.stringify(pl)));
    }
  }, [language]);

  const getTranslation = useCallback(
    (key: string) => {
      if (texts[key]) return texts[key];
      return key;
    },
    [texts],
  );

  return { language, texts, getTranslation };
};
