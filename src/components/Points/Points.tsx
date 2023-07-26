import React, { memo, useLayoutEffect } from "react";

// @ts-ignore
import Sketch from "./Sketch";
import { useTheme } from "next-themes";

export const Points = memo(() => {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const sketch = new Sketch({
      dom: document.getElementById("points-canvas"),
    });
    sketch.startAnimation(theme);
  }, []);
  return (
    <div
      id="points-canvas"
      className="fixed h-screen w-screen z-[-1] masked-right"
    ></div>
  );
});

Points.displayName = "Points";
