import { useCallback, useEffect, useState } from 'react';

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

  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  const applyTheme = useCallback((themeToApply) => {
    const htmlEl = document.documentElement;
    if (themeToApply === 'dark') {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }, []);

  // Resolve the actual theme to apply
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(effectiveTheme);
    applyTheme(effectiveTheme);
  }, [theme, getSystemTheme, applyTheme]);

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
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
};

export default useTheme;
