import "@fontsource-variable/nunito";
import "./ui/tokens.css";
import "./ui/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { kithBackend } from "./sync/useKithRoom";
import { App } from "./ui/App";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element");

createRoot(container).render(
  <StrictMode>
    <App backend={kithBackend} />
  </StrictMode>,
);
