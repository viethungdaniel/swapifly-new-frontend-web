import React from "react";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    mobile: true;
    tablet: true;
    desktop: true;
  }

  interface ZIndex {
    backdrop: number;
    bottomBar: number;
    googleOneTabLogin: number;
    firebaseRecaptchaContainer: number;
  }

  interface Duration {
    switchMedium: number;
  }

  interface CommonColors {
    blue: string;
    lightBlue: string;
    darkBlue: string;

    darkPink: string;
    pink: string;
    lightPink: string;
    lighterPink: string;
    lightestPink: string;

    darkNeutral: string;
    neutral: string;
    lightNeutral: string;
    lighterNeutral: string;
    lightestNeutral: string;

    darkRed: string;

    dotRed: string;
    starYellow: string;

    green: string;

    weChat: string;
  }

  interface TypeAction {
    tonalOpacity: number;
  }

  interface TypeBackground {}

  interface FontStyleOptions {
    fontWeightBlack: number;
    fontWeightExtraBold: number;
    fontWeightSemiBold: number;
  }

  interface TypographyVariants {
    headerSemi35: React.CSSProperties;

    titleSemi20: React.CSSProperties;
    titleReg20: React.CSSProperties;

    bodyReg14: React.CSSProperties;
    bodyReg16: React.CSSProperties;

    bodyMed14: React.CSSProperties;
    bodyMed16: React.CSSProperties;
    bodyMed18: React.CSSProperties;

    bodySemi16: React.CSSProperties;
    bodySemi18: React.CSSProperties;

    captionReg12: React.CSSProperties;
    captionMed12: React.CSSProperties;

    captionReg10: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headerSemi35?: React.CSSProperties;

    captionReg12?: React.CSSProperties;
    captionMed12?: React.CSSProperties;

    bodyReg14?: React.CSSProperties;
    bodyReg16?: React.CSSProperties;

    bodyMed14?: React.CSSProperties;
    bodyMed16?: React.CSSProperties;
    bodyMed18?: React.CSSProperties;

    bodySemi16?: React.CSSProperties;
    bodySemi18?: React.CSSProperties;

    titleReg20?: React.CSSProperties;

    captionReg10?: React.CSSProperties;

    titleSemi20?: React.CSSProperties;
  }

  interface Theme {
    app: {
      shadows: {
        bottomAppBar: string;
      };
      sizes: {
        small: number;
        medium: number;
        large: number;
      };
      spacings: {
        gutters: number;
        guttersSmall: number;
      };
      utils: {
        remToPx: (rem: string | number) => number;
      };
    };
  }

  interface ThemeOptions {
    app?: {
      shadows?: {
        bottomAppBar?: string;
      };
      sizes?: {
        small?: number;
        medium?: number;
        large?: number;
      };
      spacings?: {
        gutters?: number;
        guttersSmall?: number;
      };
      utils?: {
        remToPx?: (rem: string) => number;
      };
    };
  }
}

declare module "@mui/material/styles/createTypography" {
  interface FontStyle
    extends Required<{
      fontWeightBlack?: React.CSSProperties["fontWeight"];
      fontWeightExtraBold?: React.CSSProperties["fontWeight"];
      fontWeightSemiBold?: React.CSSProperties["fontWeight"];
    }> {}
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    headerSemi35: true;

    titleSemi20: true;
    titleReg20: true;

    bodyReg14: true;
    bodyReg16: true;

    bodyMed14: true;
    bodyMed16: true;
    bodyMed18: true;

    bodySemi16: true;
    bodySemi18: true;

    captionReg12: true;
    captionMed12: true;

    captionReg10: true;

    body1: false;
    body2: false;
    subtitle1: false;
    subtitle2: false;
    caption: false;
    overline: false;
  }
}
