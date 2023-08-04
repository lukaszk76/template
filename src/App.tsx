import { ThreeAnimation } from "@/components/ThreeAnimation/ThreeAnimation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import "../app/globals.css";
import "./app.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { Points } from "@/components/Points/Points";
import React from "react";
import { Logos } from "@/components/Logos/Logos";

function App() {
  return (
    <div className="h-screen">
      <ThreeAnimation
        id="main-webgl-background"
        src="/hexagons_dark.png"
        imageRatio={16 / 9}
        className="z-[-1] fixed top-0 left-0 w-screen h-screen masked"
      />

      <Points />

      <div className="fixed right-8 top-8">
        <ThemeToggle />
      </div>

      {/*<Hexagon*/}
      {/*  id="dodecahedron-tailwind-canvas"*/}
      {/*  color={theme === "light" ? 0x59869c : 0x386a85}*/}
      {/*/>*/}

      <div className="flex flex-col h-screen justify-evenly md:p-16 ">
        <div className="flex flex-col gap-4 md:gap-8 w-full md:w-1/2 lg:w-[700px]  ">
          <div className="flex flex-row gap-4 items-center">
            <Icons.logo className="w-16" />
            <h1 className="text-4xl text-foreground">CodeDev</h1>
          </div>
          <h2 className="text-2xl text-foreground">
            Your Gateway to Frontend Excellence!
          </h2>
          <p className="text-muted-foreground">
            Our expertise lies in harnessing cutting-edge technologies, such as
            React, JavaScript, Three.js, and gsap, to craft visually stunning
            and interactive webpages that captivate and engage your audience.
          </p>
          <p className="text-muted-foreground w">
            What sets us apart is not only our ability to bring your designs to
            life but also our passion for creating original and eye-catching
            designs ourselves.
          </p>
          <Button className="w-full md:w-1/2 lg:w-1/3">Contact me</Button>
        </div>
        <Logos />
      </div>
    </div>
  );
}

export default App;
