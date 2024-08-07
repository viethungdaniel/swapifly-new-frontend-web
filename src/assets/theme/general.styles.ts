import { Theme } from "@mui/material/styles";

const styleOverrides = (_: Theme) => {
  return `
    body {
      padding: 0 !important;
    }
	`;
};

export default styleOverrides;
