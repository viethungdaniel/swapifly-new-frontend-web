import { createTheme } from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";

import generalStyles from "./general.styles";
import overridesStyles from "./overrides.styles";
import customStyles from "./custom.styles";

const muiTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      mobile: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      tablet: 900 - 0.01,
      desktop: 1200,
    },
    keys: ["xs", "mobile", "sm", "tablet", "md", "desktop", "lg", "xl"],
  },
});

const fontFamily = "var(--font-app), sans-serif";

const typography: TypographyOptions = {
  fontFamily: fontFamily,
  fontWeightBlack: 900,
  fontWeightExtraBold: 800,
  fontWeightBold: 700,
  fontWeightSemiBold: 600,
  fontWeightMedium: 500,
  fontWeightRegular: 400,
  fontWeightLight: 300,
  htmlFontSize: 16,
  fontSize: 14,
  captionReg10: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(10),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  captionReg12: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(12),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  bodyReg14: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(14),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  bodyReg16: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(16),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  captionMed12: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(12),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  bodyMed14: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(14),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  bodyMed16: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(16),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  bodyMed18: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(18),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(16),
    },
  },
  titleReg20: {
    fontFamily,
    fontWeight: 400,
    fontSize: muiTheme.typography.pxToRem(20),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(18),
    },
  },
  bodySemi16: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(16),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
  },
  bodySemi18: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(18),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(16),
    },
  },
  titleSemi20: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(20),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(18),
    },
  },
  headerSemi35: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(36),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(22),
    },
  },
  button: {
    fontFamily,
    fontWeight: 500,
    fontSize: muiTheme.typography.pxToRem(14),
    lineHeight: "normal",
    letterSpacing: "normal",
    textTransform: "initial",
  },
  body1: undefined,
  body2: undefined,
  caption: undefined,
  h1: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(94),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(28),
    },
  },
  h2: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(58),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(26),
    },
  },
  h3: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(46),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(24),
    },
  },
  h4: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(32),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(22),
    },
  },
  h5: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(22),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(20),
    },
  },
  h6: {
    fontFamily,
    fontWeight: 600,
    fontSize: muiTheme.typography.pxToRem(18),
    lineHeight: "normal",
    letterSpacing: "normal",
    wordBreak: "break-word",
    [muiTheme.breakpoints.down("tablet")]: {
      fontSize: muiTheme.typography.pxToRem(16),
    },
  },
  overline: undefined,
  subtitle1: undefined,
  subtitle2: undefined,
};

const appColors = {
  blue: "#5072EE",
  darkBlue: "#445BD3",
  lightBlue: "#EDF0FD",

  darkPink: "#FF0073",
  pink: "#FF3D98",
  lightPink: "#FF6CB2",
  lighterPink: "#FFA4CF",
  lightestPink: "#FFEBF5",

  darkNeutral: "#383838",
  neutral: "#8F8F8F",
  lightNeutral: "#EAE9E9",
  lighterNeutral: "#F5F5F5",
  lightestNeutral: "#FCFCFC",

  error: "#FF6261",

  dotRed: "#F52525",

  darkRed: "#F52525",

  starYellow: "#F8B403",

  green: "#33EAA8",

  warning: "#F59300",

  weChat: "#2FC700",
};

const defaultTheme = createTheme({
  ...muiTheme,
  palette: {
    primary: {
      main: appColors.darkPink,
      contrastText: muiTheme.palette.common.white,
    },
    secondary: {
      dark: appColors.darkNeutral,
      main: appColors.neutral,
      light: appColors.lightNeutral,
    },
    success: {
      main: "#549E62",
      contrastText: muiTheme.palette.common.white,
    },
    error: {
      main: appColors.error,
      contrastText: muiTheme.palette.common.white,
    },
    warning: {
      main: appColors.warning,
      contrastText: muiTheme.palette.common.white,
    },
    background: {
      default: appColors.lightestNeutral,
    },
    divider: appColors.lightNeutral,
    text: {
      primary: appColors.darkNeutral,
      secondary: appColors.neutral,
      disabled: appColors.neutral,
    },
    common: {
      ...appColors,
    },
    action: {
      tonalOpacity: 0.15,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParams: any) => `
				${generalStyles(themeParams)}
				${overridesStyles(themeParams)}
        ${customStyles(themeParams)}
			`,
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: 1350,
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: "bodyReg14",
        variantMapping: {
          bodyReg14: "p",
          bodyMed14: "p",
          bodyMed16: "p",
          bodyMed18: "p",
          bodyReg16: "p",
          captionReg12: "p",
          button: "p",
          headerSemi35: "p",
          bodySemi16: "p",
          titleSemi20: "p",
          titleReg20: "p",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
        color: appColors.darkNeutral,
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: { ...typography },
  zIndex: {
    googleOneTabLogin: 1150,
    firebaseRecaptchaContainer: 1600,
    backdrop: 1350,
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  transitions: {
    duration: {
      switchMedium: 500,
    },
  },
  app: {
    shadows: {
      bottomAppBar: "0px -11px 24px -4px rgba(27, 46, 94, 0.08)",
    },
    sizes: {
      large: 50,
      medium: 40,
      small: 30,
    },
    spacings: {
      gutters: 24,
      guttersSmall: 16,
    },
    utils: {
      remToPx: (rem) =>
        (parseFloat(rem) * typography.htmlFontSize!) /
        (typography.fontSize! / 14),
    },
  },
});

export default defaultTheme;
