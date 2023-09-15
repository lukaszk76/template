import React, { memo, useLayoutEffect } from "react";
import { AnimationEngine } from "./Three/AnimationEngine";

export interface ThreeAnimationProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}
export const ThreeAnimation = memo(
  ({ id, className, style }: ThreeAnimationProps) => {
    useLayoutEffect(() => {
      new AnimationEngine(id);
    }, [id]);

    return (
      <div className={className} style={style}>
        <canvas id={id} className="w-full h-full"></canvas>
      </div>
    );
  },
);

ThreeAnimation.displayName = "ThreeAnimation";
