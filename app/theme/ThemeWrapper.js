"use client"; // Ensure this component is client-side only
import React, { useEffect } from 'react';
import { useTheme } from './ThemeContext'; // Import the custom hook

const ThemeWrapper = ({ children }) => {
  const { theme } = useTheme(); // Use the theme context

  useEffect(() => {
    document.documentElement.className = theme; // Apply theme to the html element
  }, [theme]);

  return <>{children}</>; // Render children normally
};

export default ThemeWrapper;
