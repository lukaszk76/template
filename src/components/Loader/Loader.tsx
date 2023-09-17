import React, { memo, useCallback, useEffect } from "react";
import { Icons } from "@/components/ui/icons";
import gsap from "gsap";
export const Loader = memo(() => {
  const animateLoader = useCallback(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      gsap.to(loader, {
        duration: 1,
        ease: "power2.inOut",
        rotation: 360,
        repeat: -1,
      });
    }
  }, []);

  useEffect(() => {
    animateLoader();
  }, [animateLoader]);

  return <Icons.logo className="w-6 h-6" id="loader" />;
});

Loader.displayName = "Loader";
