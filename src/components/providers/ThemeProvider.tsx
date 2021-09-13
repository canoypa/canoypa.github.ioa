import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { FC } from "react";
import { DarkTheme, LightTheme } from "../../core/theme";

export const ThemeProvider: FC = ({ children }) => {
  const isDark = useMediaQuery("(prefers-color-scheme:dark)");

  return (
    <MuiThemeProvider theme={isDark ? DarkTheme : LightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
