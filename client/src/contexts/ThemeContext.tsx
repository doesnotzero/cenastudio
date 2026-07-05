import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

/**
 * Save theme preference to user profile via API
 * This is a best-effort operation - failures are logged but don't block the theme change
 */
async function saveThemeToProfile(theme: Theme): Promise<void> {
  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ themePreference: theme }),
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Failed to save theme preference to profile:", response.statusText);
    }
  } catch (error) {
    // Silently fail - theme is still saved to localStorage
    console.warn("Failed to save theme preference to profile:", error);
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      // Try to load from localStorage first to prevent FOUC
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Set data-theme attribute for CSS custom properties (primary method)
    root.setAttribute("data-theme", theme);

    // Also maintain dark class for Tailwind compatibility
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save to localStorage for persistence
    if (switchable) {
      localStorage.setItem("theme", theme);

      // Also save to user profile if authenticated (best effort)
      // Only sync to backend after user interaction (not on initial mount)
      if (isInitialized) {
        saveThemeToProfile(theme);
      }
    }

    // Mark as initialized after first effect run
    // This prevents API calls on initial mount
    if (!isInitialized) {
      // Use setTimeout to defer setting isInitialized until after first render
      setTimeout(() => setIsInitialized(true), 0);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
