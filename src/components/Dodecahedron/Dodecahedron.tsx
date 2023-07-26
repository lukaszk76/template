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
        className={`hover:scale-[1.2] transition ease-in-out duration-300  ${className}`}
        style={{ cursor: "pointer" }}
      ></canvas>
    );
  },
);

Dodecahedron.displayName = "Dodecahedron";
