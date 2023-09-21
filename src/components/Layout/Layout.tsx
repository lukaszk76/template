import React, { memo } from "react";
import { Menu } from "@/components/Menu/Menu";
import { ThreeAnimation } from "@/components/ThreeAnimationPipes/ThreeAnimation";
import { useTranslations } from "@/lib/useTranslations";

export const Layout = memo(() => {
  const { getTranslation } = useTranslations();

  return (
    <div className="w-screen h-max min-h-screen ">
      <div className="cursor"></div>
      <div className="cursor-pointer"></div>
      <Menu />
      <div className="w-screen bg-card flex flex-col items-center h-full min-h-screen pt-[7vh]">
        <div className="flex w-full h-full min-h-screen max-w-[1200px] flex-col items-start gap-8 bg-background z-[1]">
          <h1 className="text-4xl md:text-5xl py-8 font-bold">
            {getTranslation("title")}
          </h1>
          <ThreeAnimation
            id={"webgl"}
            className="w-full inset-0 h-[50vh] z-[-1] bg-muted"
          />
        </div>
      </div>
    </div>
  );
});

Layout.displayName = "Layout";
