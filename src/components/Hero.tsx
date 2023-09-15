import React, { memo } from "react";
import { ThreeAnimation } from "@/components/ThreeAnimationPipes/ThreeAnimation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/useTranslations";
import { Icons } from "./icons";
export const Hero = memo(() => {
  const { getTranslation } = useTranslations();
  return (
    <div className="relative w-full h-full">
      <ThreeAnimation
        id="main-webgl-background"
        className="w-full inset-0 h-[50vh] z-[-1]"
      />

      <div
        style={{
          boxShadow: "0px 0px 0px 35px rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
        className="z-20 rounded-full absolute flex flex-col w-full h-full md:w-1/2 justify-start md:justify-center gap-4 md:gap-12 px-12 py-12 -translate-y-[50vh]"
      >
        <div
          className="w-full h-max flex gap-4 items-center text-primary"
          style={{ pointerEvents: "none" }}
        >
          <Icons.logo className="w-1/12" />
          {/*<Logo />*/}
          <h1 className="text-4xl font-bold">CodeDev</h1>
        </div>
        <h2 className="text-2xl font-bold text-primary">
          {getTranslation("copy")}
        </h2>
        <Button
          className="w-full md:w-1/2"
          style={{ cursor: "none", pointerEvents: "auto" }}
        >
          {getTranslation("contact")}
        </Button>
      </div>
    </div>
  );
});

Hero.displayName = "Hero";
