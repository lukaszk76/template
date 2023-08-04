import React, { memo } from "react";
import { useTheme } from "next-themes";

const logos = [
  { image: "/react.png", name: "React" },
  { image: "/Typescript.png", name: "Typescript" },
  { image: "/js.png", name: "Javascript" },
  { image: "/nextjs.png", name: "Next.js" },
  { image: "/tailwindcss.svg", name: "TailwindCSS" },
  { image: "/three.svg", name: "Three.js" },
  { image: "/material.png", name: "Material UI" },
  { image: "/gsap.png", name: "GSAP" },
  { image: "/firebase.png", name: "Firebase" },
];

export const Logos = memo(() => {
  const { theme } = useTheme();
  return (
    <div className="flex gap-16">
      {logos.map((logo) => (
        <div key={logo.image} className="flex flex-col items-center gap-2">
          <div
            className={`w-16 h-16 z-[100] rounded-full shadow-lg flex items-center justify-center backdrop-blur-lg ${
              theme === "dark" ? "bg-foreground" : "bg-background"
            } `}
          >
            <img src={logo.image} alt="logo" className="w-10" />
          </div>
          <span className="text-xs text-muted-foreground">{logo.name}</span>
        </div>
      ))}
    </div>
  );
});

Logos.displayName = "Logos";
