import "../app/globals.css";
import "./app.css";
import React, { useEffect } from "react";
import { Hero } from "@/components/Hero";
// @ts-ignore
import { addAnimatedCursor } from "./components/animatedCursor.js";
import { texts } from "./assets/texts";
import { Ciphered } from "@/components/CipheredText/Ciphered";
import { Logos } from "@/components/Logos/Logos";
import { Separator } from "@/components/ui/separator";
function App() {
  useEffect(() => {
    addAnimatedCursor();
  }, []);

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-pointer"></div>

      <div className="h-max w-screen bg-card overflow-y-scroll flex justify-center">
        <div className="flex w-full h-max max-w-[1200px] flex-col items-start gap-8 h-screen bg-background">
          <Hero />

          <div className="flex flex-col gap-4 px-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full h-full gap-8 ">
              {texts.map((text, index) => (
                <Ciphered text={text} key={index} />
              ))}
            </div>
            <Separator />
            <div className="flex w-full justify-end">
              <Logos />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
