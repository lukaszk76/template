import React, { memo, useLayoutEffect } from "react";
import { gsap } from "gsap";

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
    gsap.from(".technology", { duration: 0.3, yPercent: 200, stagger: -0.1 });
  }, []);

  return (
    <div className="flex w-full justify-between">
      {logos.map((logo) => (
        <div key={logo.image} className="flex flex-col gap-2 items-center ">
          <div
            className={`w-6 h-6 rounded shadow-lg bg-card flex justify-center items-center backdrop-blur-lg bg-card technology`}
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
