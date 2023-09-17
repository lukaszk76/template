import React, { memo, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const logos = [
  { image: "/react.png", name: "React" },
  { image: "/Typescript.png", name: "Typescript" },

  { image: "/js.png", name: "Javascript" },
  { image: "/nextjs.png", name: "Next.js" },

  { image: "/tailwindcss.svg", name: "TailwindCSS" },
  { image: "/three.png", name: "Three.js" },

  { image: "/gsap.png", name: "GSAP" },
  { image: "/google.png", name: "Google" },
];

export const Logos = memo(() => {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const logos = gsap.utils.toArray(".technology");
    gsap.from(logos, {
      scrollTrigger: {
        trigger: ".technology",
        start: "top 90%",
        end: "top 85%",
        scrub: 1,
      },
      stagger: 0.3,
      ease: "power2.out",
      yPercent: 100,
      opacity: 0,
      blur: 10,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8 md:gap-0 md:flex w-full justify-between pt-4 pb-8 px-4">
      {logos.map((logo) => (
        <div
          key={logo.image}
          className="flex flex-col gap-2 items-center technology"
        >
          <div
            className={`w-6 h-6 rounded shadow-lg bg-card flex justify-center items-center backdrop-blur-lg bg-card `}
          >
            <img src={logo.image} alt="logo" className="w-4" />
          </div>
          <span className="text-xs text-muted-foreground">{logo.name}</span>
        </div>
      ))}
    </div>
  );
});

Logos.displayName = "Logos";
