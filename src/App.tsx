import "../app/globals.css";
import "./app.css";
import React, { useEffect } from "react";
import { Hero } from "@/components/Hero";
// @ts-ignore
import { addAnimatedCursor } from "./components/animatedCursor.js";

function App() {
  useEffect(() => {
    addAnimatedCursor();
  }, []);

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-pointer"></div>

      <div className="h-full w-full flex items-start justify-center overflow-hidden bg-card ">
        <div className="flex w-full max-w-[1200px] flex-col items-start gap-8 h-screen bg-background">
          <Hero />
        </div>
      </div>
    </>
  );
}

export default App;
