import { useEffect, useState, useTransition } from 'react';

/**
 * Get the current system theme preference
 */
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Apply theme class to document root
 */
const applyTheme = (themeToApply) => {
  const htmlEl = document.documentElement;
  if (themeToApply === 'dark') {
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
  }
};

/**
 * Hook to manage theme state reactively
 * Supports: system, light, dark preferences
 * TODO: Add sunrise-sunset preference support
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState(() => {
    // Check if user has a stored preference
    const stored = localStorage.getItem('theme');
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');
  const [isPending, startTransition] = useTransition();

  // Resolve the actual theme to apply
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(effectiveTheme);
    applyTheme(effectiveTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }

    // Use transition for non-blocking theme updates
    startTransition(() => {
      setThemeState(newTheme);
    });
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
    isPending,
  };
};

export default useTheme;
