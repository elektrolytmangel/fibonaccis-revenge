import { useEffect, useState } from "react";
import { isLanguage, useI18n } from "../i18n/i18n";
import { LANGUAGE_CODES, LANGUAGES } from "../i18n/messages";
import { applyStyle, applyTheme, loadStyle, loadTheme, nextStyle, nextTheme } from "./theme";

export function Settings() {
  const { t, language, setLanguage } = useI18n();
  const [theme, setTheme] = useState(loadTheme);
  useEffect(() => applyTheme(theme), [theme]);
  const [style, setStyle] = useState(loadStyle);
  useEffect(() => applyStyle(style), [style]);

  return (
    <div className="settings">
      <button type="button" className="btn btn--quiet" onClick={() => setTheme(nextTheme(theme))}>
        {t("settings.theme")}: {t(`settings.theme.${theme}`)}
      </button>
      <button type="button" className="btn btn--quiet" onClick={() => setStyle(nextStyle(style))}>
        {t("settings.style")}: {t(`settings.style.${style}`)}
      </button>
      <label className="settings__lang">
        <span className="sr-only">{t("settings.language")}</span>
        <select
          value={language}
          onChange={(e) => isLanguage(e.target.value) && setLanguage(e.target.value)}
        >
          {LANGUAGE_CODES.map((code) => (
            <option key={code} value={code}>
              {LANGUAGES[code].name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
