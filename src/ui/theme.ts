/** Colour mode (REQ-UI-004): follows the system unless overridden. */
export type Theme = "system" | "light" | "dark";
/** Visual style (REQ-UI-011), independent of the colour mode. */
export type Style = "modern" | "pixel" | "terminal";

const THEME_KEY = "fr.theme";
const STYLE_KEY = "fr.style";
export const STYLES: readonly Style[] = ["modern", "pixel", "terminal"];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
}

export function loadTheme(): Theme {
  const v = read(THEME_KEY);
  return v === "light" || v === "dark" ? v : "system";
}

export function applyTheme(theme: Theme): void {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
  write(THEME_KEY, theme);
}

export const nextTheme = (t: Theme): Theme =>
  t === "system" ? "light" : t === "light" ? "dark" : "system";

export function loadStyle(): Style {
  const v = read(STYLE_KEY);
  return STYLES.find((s) => s === v) ?? "modern";
}

export function applyStyle(style: Style): void {
  if (style === "modern") document.documentElement.removeAttribute("data-style");
  else document.documentElement.setAttribute("data-style", style);
  write(STYLE_KEY, style);
}

export const nextStyle = (s: Style): Style => STYLES[(STYLES.indexOf(s) + 1) % STYLES.length];
