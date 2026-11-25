import "@fontsource-variable/nunito";
import "@fontsource/press-start-2p";
import "@fontsource-variable/pixelify-sans";
import "@fontsource-variable/jetbrains-mono";
import "./ui/tokens.css";
import "./ui/app.css";
import "./ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { kithBackend } from "./sync/useKithRoom";
import { App } from "./ui/App";
import { applyStyle, applyTheme, loadStyle, loadTheme } from "./ui/theme";

// Apply the stored look before the first render (Settings is not always mounted).
applyTheme(loadTheme());
applyStyle(loadStyle());

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element");

createRoot(container).render(
  <StrictMode>
    <App backend={kithBackend} />
  </StrictMode>,
);
