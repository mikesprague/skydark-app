/**
 * @deprecated Use useTheme hook from src/lib/theme/useTheme.js instead
 * These functions are kept for backward compatibility during migration
 */

export const isDarkModeEnabled = () => {
  const hasSystemDarkModeEnabled = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  return hasSystemDarkModeEnabled;
};

export const toggleDarkMode = () => {
  const htmlEl = document.querySelector('html');

  if (isDarkModeEnabled()) {
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
  }
};

export const initDarkMode = () => {
  const htmlEl = document.querySelector('html');

  if (isDarkModeEnabled()) {
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
  }

  // Note: No longer reloading page on theme change
  // Use useTheme hook for reactive theme updates
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (event.matches) {
        htmlEl.classList.add('dark');
      } else {
        htmlEl.classList.remove('dark');
      }
    });
};
