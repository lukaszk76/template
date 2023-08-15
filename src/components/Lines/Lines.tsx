import React, { memo, useLayoutEffect } from "react";

// @ts-ignore
import Sketch from "./Sketch";
import "./Lines.css";

export const Lines = memo(() => {
  useLayoutEffect(() => {
    const sketch = new Sketch({
      dom: document.getElementById("points-logo"),
    });
    sketch.startAnimation();
  }, []);
  return <div id="points-logo"></div>;
});

Lines.displayName = "Lines";
