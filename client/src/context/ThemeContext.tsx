import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const cachedPreference = localStorage.getItem("leadsync_dark_mode");
    return (
      cachedPreference === "true" ||
      (!cachedPreference &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const coreDocumentElement = window.document.documentElement;
    if (isDarkMode) {
      coreDocumentElement.classList.add("dark");
      localStorage.setItem("leadsync_dark_mode", "true");
    } else {
      coreDocumentElement.classList.remove("dark");
      localStorage.setItem("leadsync_dark_mode", "false");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error(
      "useTheme must be wrapper-bound inside an active ThemeProvider component context tree.",
    );
  return context;
};
