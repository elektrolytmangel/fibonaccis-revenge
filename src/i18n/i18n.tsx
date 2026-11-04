import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LANGUAGE_CODES, LANGUAGES, type Language, type MessageKey } from "./messages";

const KEY = "fr.lang";

export function isLanguage(v: unknown): v is Language {
  return typeof v === "string" && (LANGUAGE_CODES as string[]).includes(v);
}

/** Saved choice, else the first supported browser language, else English. */
export function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem(KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLanguage(base)) return base;
  }
  return "en";
}

export type TFunction = (key: MessageKey, vars?: { count?: number }) => string;

export function makeT(language: Language): TFunction {
  const rules = new Intl.PluralRules(language);
  const messages = LANGUAGES[language].messages;
  return (key, vars) => {
    const m = messages[key];
    const text = typeof m === "string" ? m : (m[rules.select(vars?.count ?? 0)] ?? m.other);
    return vars?.count === undefined ? text : text.replaceAll("{count}", String(vars.count));
  };
}

interface I18n {
  language: Language;
  setLanguage(language: Language): void;
  t: TFunction;
}

const Context = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* the choice just won't persist */
    }
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, t: makeT(language) }),
    [language, setLanguage],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
