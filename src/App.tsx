// @ts-ignore
import { addAnimatedCursor } from "./components/AnimatedCursor/animatedCursor.js";

import { setMetaDescription, setMetaTitle, setHtmlLang } from "@/lib/utils";

import { AppContextProvider } from "@/AppContext";
import { useEffect, useRef } from "react";
import { useTranslations } from "@/lib/useTranslations";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Layout } from "@/components/Layout/Layout";
import { gsap } from "gsap";

export interface TextI {
  title: string;
  text: string;
}
function App() {
  const lenisRef = useRef<typeof ReactLenis>();

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  });
  useEffect(() => {
    addAnimatedCursor();
  }, []);

  const { getTranslation, language } = useTranslations();

  useEffect(() => {
    setMetaDescription(getTranslation("meta_description"));
    setMetaTitle(getTranslation("meta_title"));
    setHtmlLang(language);
  }, [getTranslation, language, setMetaDescription, setMetaTitle, setHtmlLang]);

  return (
    <AppContextProvider>
      <ReactLenis ref={lenisRef} autoRaf={false}>
        <Layout />
      </ReactLenis>
    </AppContextProvider>
  );
}

export default App;
