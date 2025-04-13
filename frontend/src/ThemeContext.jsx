import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

export const ColorModeContext = createContext();

const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(() => ({
    mode, 
    toggleColorMode: () => {
      setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  }), [mode]);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default CustomThemeProvider;
