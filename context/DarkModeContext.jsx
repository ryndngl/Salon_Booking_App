import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadDarkModePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem('darkMode');
        if (savedPreference !== null) {
          setDarkMode(JSON.parse(savedPreference));
        } else {
          // Fallback to system color scheme if no preference is saved
          setDarkMode(systemColorScheme === 'dark');
        }
      } catch (e) {
        console.error("Failed to load dark mode preference", e);
        // Default to system preference on error
        setDarkMode(systemColorScheme === 'dark');
      }
    };
    loadDarkModePreference();
  }, [systemColorScheme]);

  const toggleDarkMode = async () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkModeState));
    } catch (e) {
      console.error("Failed to save dark mode preference", e);
    }
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};