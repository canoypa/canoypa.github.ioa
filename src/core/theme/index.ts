import { alpha, createTheme } from "@mui/material";
import { common, indigo } from "@mui/material/colors";

export const LightTheme = createTheme({
  palette: {
    mode: "light",

    primary: { main: indigo[500] },

    text: {
      primary: alpha(common.black, 0.87),
      secondary: alpha(common.black, 0.6),
      disabled: alpha(common.black, 0.38),
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitTapHighlightColor: "transparent",
        },
      },
    },
  },
});

export const DarkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: { main: indigo[300] },

    text: {
      primary: alpha(common.white, 0.87),
      secondary: alpha(common.white, 0.6),
      disabled: alpha(common.white, 0.38),
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitTapHighlightColor: "transparent",
        },
      },
    },
  },
});
