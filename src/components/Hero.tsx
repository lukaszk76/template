import React, { memo } from "react";
import { ThreeAnimation } from "@/components/ThreeAnimation/ThreeAnimation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/useTranslations";
export const Hero = memo(() => {
  const { getTranslation } = useTranslations();
  return (
    <div className="w-full">
      <ThreeAnimation
        id="main-webgl-background"
        src="/background.png"
        imageRatio={2100 / 972}
        className="w-full inset-0 h-[50vh]"
      />

      <div className="absolute flex flex-col w-full md:w-1/2 justify-start md:justify-center gap-4 md:gap-12 px-12 py-12 -translate-y-[50vh]">
        <div className="w-full h-max flex gap-4 items-center text-primary">
          <Icons.logo className="w-1/12" />
          <h1 className="text-4xl font-bold">CodeDev</h1>
        </div>
        <h2 className="text-2xl font-bold text-primary">
          {getTranslation("copy")}
        </h2>
        <Button className="w-full md:w-1/2" style={{ cursor: "none" }}>
          {getTranslation("contact")}
        </Button>
      </div>
    </div>
  );
});

Hero.displayName = "Hero";
