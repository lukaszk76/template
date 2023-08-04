import React, { memo, useLayoutEffect } from "react";
import { AnimationEngine } from "./Three/AnimationEngine";

export interface DodecahedronProps {
  id: string;
  textureFile?: string;
  color?: number;
  className?: string;
}
export const Hexagon = memo(
  ({ id, textureFile, color, className }: DodecahedronProps) => {
    useLayoutEffect(() => {
      new AnimationEngine(id, textureFile, color);
    }, [id, color]);

    return (
      <canvas
        id={id}
        className={`h-screen w-screen fixed z-[1]  ${className}`}
        style={{ pointerEvents: "none" }}
      ></canvas>
    );
  },
);

Hexagon.displayName = "Hexagon";
