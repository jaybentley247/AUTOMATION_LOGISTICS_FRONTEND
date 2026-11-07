import { useCallback, useEffect, useState } from "react";

// "system" follows the OS setting and is the default. "light" and "dark"
// are explicit choices, saved per browser. public/index.html applies a saved
// choice before first paint to avoid a flash of the wrong theme.
const STORAGE_KEY = "automationLogisticsTheme";
const CHANGE_EVENT = "automation-theme-change";
export const THEMES = ["system", "light", "dark"];

export function getStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(value) ? value : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
  else root.removeAttribute("data-theme");
}

export function useTheme() {
  const [theme, setThemeState] = useState(getStoredTheme);

  useEffect(() => {
    const sync = () => setThemeState(getStoredTheme());
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        applyTheme(getStoredTheme());
        sync();
      }
    };
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((next) => {
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode etc.): the choice lasts for this page only.
    }
    applyTheme(next);
    setThemeState(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [theme, setTheme];
}
