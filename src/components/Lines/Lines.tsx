import React, { memo, useLayoutEffect } from "react";

// @ts-ignore
import Sketch from "./Sketch";
import "./Lines.css";

export const Lines = memo(() => {
  const linesArray = Array.from({ length: 1 }, () =>
    Math.floor(Math.random() * 10),
  );

  useLayoutEffect(() => {
    linesArray.forEach((_, index) => {
      const lines = document.getElementById(`lines-${index}`);
      if (lines) {
        const sketch = new Sketch({
          dom: lines,
          variant: index,
        });
      }
    });
  }, []);
  return (
    <>
      {linesArray.map((_, index) => (
        <div id={`lines-${index}`} className="lines"></div>
      ))}
    </>
  );
});

Lines.displayName = "Lines";
