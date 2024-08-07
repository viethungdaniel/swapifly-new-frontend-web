import { Theme } from "@mui/material/styles";

const styleOverrides = (_: Theme) => {
  return `
    .html-scroll-smooth {
      scroll-behavior: smooth !important;
    }
	`;
};

export default styleOverrides;
