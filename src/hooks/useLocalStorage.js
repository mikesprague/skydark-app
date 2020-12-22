import { useState, useCallback, useEffect } from 'react';
import { getData, setData } from '../modules/local-storage';

// Similar to `useState` but with some lightweight behind-the-scenes
// writing to localStorage; also subscribes to changes in localStorage
// to allow for cross-tab changes to sync automatically.
export const useLocalStorage = (key, val) => {
  const [value, setValue] = useState();

  useEffect(() => {
    const storedValue = getData(key);
    setValue(storedValue);

    const handleChanges = (e) => {
      if (e.key === key) {
        setValue(e.newValue);
      }
    };

    window.addEventListener('storage', handleChanges);

    return () => {
      window.removeEventListener('storage', handleChanges);
    };
  }, [key, val]);

  const updater = useCallback((newValue) => {
    setValue(newValue);
    setData(key, newValue);
  },
  [key]);

  return [value, updater];
};

export default useLocalStorage;
