import React, { memo, useLayoutEffect } from "react";
import { AnimationEngine } from "./Three/AnimationEngine";

export interface DodecahedronProps {
  id: string;
  textureFile?: string;
  color?: number;
  className?: string;
}
export const Dodecahedron = memo(
  ({ id, textureFile, color, className }: DodecahedronProps) => {
    useLayoutEffect(() => {
      new AnimationEngine(id, textureFile, color);
    }, [id]);

    return (
      <canvas
        id={id}
        className={`h-screen w-screen fixed z-[-1]  ${className}`}
        style={{ cursor: "pointer" }}
      ></canvas>
    );
  },
);

Dodecahedron.displayName = "Dodecahedron";
