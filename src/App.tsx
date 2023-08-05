import "../app/globals.css";
import "./app.css";
import React, { useEffect } from "react";
import { Hero } from "@/components/Hero";
// @ts-ignore
import { addAnimatedCursor } from "./components/animatedCursor.js";
import { texts } from "./assets/texts";
import { Ciphered } from "@/components/CipheredText/Ciphered";
function App() {
  useEffect(() => {
    addAnimatedCursor();
  }, []);

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-pointer"></div>

      <div className="h-full w-screen bg-card overflow-y-scroll flex justify-center">
        <div className="flex w-full h-full max-w-[1200px] flex-col items-start gap-8 h-screen bg-background">
          <Hero />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full h-full gap-8 px-8">
            {texts.map((text, index) => (
              <Ciphered text={text} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
