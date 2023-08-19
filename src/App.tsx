import "../app/globals.css";
import "./app.css";
import React, { useEffect, useLayoutEffect } from "react";
import { Hero } from "@/components/Hero";
// @ts-ignore
import { addAnimatedCursor } from "./components/animatedCursor.js";
import { Ciphered } from "@/components/CipheredText/Ciphered";
import { Logos } from "@/components/Logos/Logos";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/useTranslations";
import { Menu } from "@/components/Menu/Menu";
import { Lines } from "@/components/Lines/Lines";

export interface TextI {
  title: string;
  text: string;
}
function App() {
  useEffect(() => {
    addAnimatedCursor();
  }, []);

  const [cardTexts, setCardTexts] = React.useState<TextI[]>();

  const { getTranslation } = useTranslations();

  useEffect(() => {
    const texts = [
      {
        title: getTranslation("card1_title"),
        text: getTranslation("card1_description"),
      },
      {
        title: getTranslation("card2_title"),
        text: getTranslation("card2_description"),
      },
      {
        title: getTranslation("card3_title"),
        text: getTranslation("card3_description"),
      },
      {
        title: getTranslation("card4_title"),
        text: getTranslation("card4_description"),
      },
    ];
    setCardTexts(texts);
  }, [getTranslation]);

  useLayoutEffect(() => {
    const cipheredGrid = document.getElementById("ciphered-grid");
    if (cipheredGrid) {
      const { height } = cipheredGrid.getBoundingClientRect();
      const cards = document.querySelectorAll(".ciphered-card");
      cards.forEach((card) => {
        // @ts-ignore
        card.style.height = `${height}px`;
      });
    }
  }, [cardTexts]);

  return (
    <div className="w-screen min-h-screen ">
      <Lines />
      <div className="cursor"></div>
      <div className="cursor-pointer"></div>
      <Menu />
      <div className="w-screen bg-card flex flex-col items-center h-max min-h-screen pt-[7vh]">
        <div className="flex w-full h-max min-h-screen max-w-[1200px] flex-col items-start gap-8 bg-background z-[1]">
          <Hero />

          <div className="flex flex-col gap-4 px-8">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full h-max gap-8 "
              id="ciphered-grid"
            >
              {cardTexts &&
                cardTexts.map((text, index) => (
                  <Ciphered text={text} key={index} />
                ))}
            </div>
            <Separator />

            <Logos />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
