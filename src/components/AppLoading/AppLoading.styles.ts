import _get from "lodash/get";
import { keyframes } from "tss-react";
import { makeStyles } from "tss-react/mui";

import type { AppLoadingProps } from "./AppLoading";

type StylesParams = {
  size: AppLoadingProps["size"];
  color: AppLoadingProps["color"];
};

const useStyles = makeStyles<StylesParams>({
  name: "LogoLoading",
  uniqId: "WbFtWP",
})((theme, params) => {
  const size = parseFloat(`${params.size}`);
  const padding = 3.6 + 10;

  let color: React.CSSProperties["color"] = "";

  switch (params.color) {
    case "primary": {
      color = theme.palette.primary.main;
      break;
    }
    case "secondary": {
      color = theme.palette.secondary.main;
      break;
    }
    case "error": {
      color = theme.palette.error.main;
      break;
    }
    case "blueGradient": {
      color = "linearGradient";
      break;
    }
    default:
      color =
        _get(theme.palette, params?.color ?? "") ??
        (params?.color || theme.palette.primary.main);
      break;
  }

  return {
    root: {
      width: size,
      height: size,
      position: "relative",
    },
    circularLogo: {
      padding: padding,
    },
    circularProgress: {
      color: color !== "linearGradient" ? color : undefined,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "inline-block",
      animation: `${keyframes`
        0% {
          -webkit-transform: rotate(0deg);
          -moz-transform: rotate(0deg);
          -ms-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          -moz-transform: rotate(360deg);
          -ms-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      `} 1.4s linear infinite`,
    },
    circularProgressSvg: {
      width: "100%",
      height: "100%",
      display: "block",
      "& circle": {
        stroke:
          color !== "linearGradient" ? "currentColor" : `url(#${params.color})`,
        strokeDasharray: "80px, 200px",
        strokeDashoffset: 0,
        strokeLinecap: "round",
        animation: `${keyframes`
          0% {
            stroke-dasharray: 1px,200px;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100px,200px;
            stroke-dashoffset: -15px;
          }
          100% {
            stroke-dasharray: 100px,200px;
            stroke-dashoffset: -125px;
          }
        `} 1.4s ease-in-out infinite`,
      },
    },
    logo: {
      width: "100%",
      height: "100%",
      display: "flex",
      padding: theme.spacing(1.25),
      backgroundColor: theme.palette.common.white,
      borderRadius: "50%",
    },
    logoSvg: {
      width: "100%",
      height: "100%",
    },
  };
});

export default useStyles;
