import React, { memo } from "react";
import { ThreeAnimation } from "@/components/ThreeAnimation/ThreeAnimation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const Hero = memo(() => {
  return (
    <div className="w-full h-1/2 relative">
      <ThreeAnimation
        id="main-webgl-background"
        src="/background.png"
        imageRatio={2100 / 972}
        className="w-full h-full absolute inset-0"
      />

      <div className="absolute flex flex-col w-1/2 h-full justify-center gap-12 px-12">
        <div className="w-full flex gap-4 items-center text-primary">
          <Icons.logo className="w-1/12" />
          <h1 className="text-4xl font-bold">CodeDev</h1>
        </div>
        <h2 className="text-2xl font-bold text-primary">
          Your Gateway to Frontend Excellence!
        </h2>
        <Button className="w-1/2" style={{ cursor: "none" }}>
          Contact me
        </Button>
      </div>
    </div>
  );
});

Hero.displayName = "Hero";
