import React, { memo, useLayoutEffect, useContext } from "react";
import { ThreeAnimation } from "@/components/ThreeAnimationPipes/ThreeAnimation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/useTranslations";
import { Icons } from "@/components/ui/icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { AppContext } from "@/AppContext";

export const Hero = memo(() => {
  const { getTranslation } = useTranslations();
  const { setIsContactFormOpen } = useContext(AppContext);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to("#rounded-hero", {
      scrollTrigger: {
        trigger: "#rounded-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: "-100vh",
      ease: "power2.inOut",
    });

    gsap.from("#rounded-hero", {
      opacity: 0.0,
      duration: 2,
      delay: 0.5,
      ease: "power2.inOut",
    });

    gsap.to("#main-webgl-background", {
      scrollTrigger: {
        trigger: "#main-webgl-background",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      opacity: 0,
      ease: "power2.inOut",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <ThreeAnimation
        id="main-webgl-background"
        className="w-full inset-0 h-[50vh] z-[-1] bg-muted"
      />

      <div
        style={{
          boxShadow: "0px 0px 0px 35px rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
        className="z-20 rounded-full absolute flex flex-col w-full h-full md:w-1/2 justify-around md:justify-center gap-4 md:gap-12 px-12 py-12 -translate-y-[50vh]"
        id="rounded-hero"
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
          onClick={() => setIsContactFormOpen(true)}
        >
          {getTranslation("contact")}
        </Button>
      </div>
    </div>
  );
});

Hero.displayName = "Hero";
