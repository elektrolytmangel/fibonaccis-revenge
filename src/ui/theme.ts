export type Theme = "system" | "light" | "dark";
const KEY = "fr.theme";

export function loadTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme: Theme): void {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable: theme just won't persist */
  }
}

export const nextTheme = (t: Theme): Theme =>
  t === "system" ? "light" : t === "light" ? "dark" : "system";
