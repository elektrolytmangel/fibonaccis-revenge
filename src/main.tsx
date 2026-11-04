import "@fontsource-variable/nunito";
import "./ui/tokens.css";
import "./ui/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
