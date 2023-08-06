import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactLenis } from "@studio-freight/react-lenis";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ReactLenis root>
    <App />,
  </ReactLenis>,
);
