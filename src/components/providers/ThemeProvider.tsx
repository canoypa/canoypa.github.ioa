import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { DarkTheme, LightTheme } from "../../core/theme";

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const isDark = useMediaQuery("(prefers-color-scheme:dark)");

  return (
    <MuiThemeProvider theme={isDark ? DarkTheme : LightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
