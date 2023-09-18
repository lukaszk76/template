import React, { memo, useEffect, useState } from "react";

export const Logo = memo(() => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const logo1 = document.getElementById("logo1");
      if (logo1) {
        const { x, width, y, height } = logo1.getBoundingClientRect();
        setCenterX(x + 0.5 * width);
        setCenterY(y + 0.5 * height);
        setMaxX(window.innerWidth - (x + 0.5 * width));
        setMaxY(window.innerHeight - (y + 0.5 * height));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (maxX === 0 || maxY === 0) return;
      setMouseX((e.pageX - centerX) / maxX);
      setMouseY(-(e.clientY - centerY) / maxY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [centerX, centerY, maxX, maxY]);

  useEffect(() => {
    const logo1 = document.getElementById("logo1");
    const logo2 = document.getElementById("logo2");
    const logo3 = document.getElementById("logo3");
    if (logo1 && logo2 && logo3) {
      logo1.style.transform = `translate(${mouseX * 6}px, ${
        mouseY * 6
      }px) scale(${1 + 0.2 * Math.max(Math.abs(mouseX), Math.abs(mouseY))})`;
      logo2.style.transform = `translate(${mouseX * 4}px, ${
        mouseY * 4
      }px) scale(${1 + 0.132 * Math.max(Math.abs(mouseX), Math.abs(mouseY))})`;
      logo3.style.transform = `translate(${mouseX * 2}px, ${
        mouseY * 2
      }px) scale(${1 + 0.066 * Math.max(Math.abs(mouseX), Math.abs(mouseY))})`;
    }
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-[20px] h-[20px] block">
      <img
        src="/logo4.png"
        id="logo4"
        alt="logo"
        className="absolute top-0 left-0 opacity-50"
      />
      <img
        src="/logo3.png"
        id="logo3"
        alt="logo"
        className="absolute top-0 left-0 opacity-50"
      />
      <img
        src="/logo2.png"
        id="logo2"
        alt="logo"
        className="absolute top-0 left-0 opacity-50"
      />
      <img
        src="/logo1.png"
        id="logo1"
        alt="logo"
        className="absolute top-0 left-0"
      />
    </div>
  );
});

Logo.displayName = "Logo";
