export const isDarkModeEnabled = () => {
  const hasSystemDarkModeEnabled = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  // const appTheme = getData('theme') || null;
  // if (appTheme === 'dark' || (!appTheme && hasSystemDarkModeEnabled)) {
  //   return true;
  // }
  // return false;

  return hasSystemDarkModeEnabled;
};

export const toggleDarkMode = () => {
  const htmlEl = document.querySelector('html');

  if (isDarkModeEnabled()) {
    htmlEl.classList.add('dark');
    // setData('theme', 'dark');
  } else {
    // clearData('theme');
    // setData('theme', 'light');
    htmlEl.classList.remove('dark');
  }
};

export const initDarkMode = () => {
  const htmlEl = document.querySelector('html');

  if (isDarkModeEnabled()) {
    htmlEl.classList.add('dark');
    // setData('theme', 'dark');
  } else {
    // clearData('theme');
    // setData('theme', 'light');
    htmlEl.classList.remove('dark');
  }

  // eslint-disable-next-line no-unused-vars
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (_event) => {
    // console.log("window.matchMedia('(prefers-color-scheme: dark)').matches: ", event.matches);
    window.location.reload();
  });
};
