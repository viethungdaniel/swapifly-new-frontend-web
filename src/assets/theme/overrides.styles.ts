import { Theme } from "@mui/material/styles";

const styleOverrides = (theme: Theme) => {
  return `
		.animate__animated.animate__entering-screen__duration {
			--animate-duration: ${theme.transitions.duration.enteringScreen}ms;
		}
		.animate__animated.animate__leaving-screen__duration {
			--animate-duration: ${theme.transitions.duration.leavingScreen}ms;
		}
		.animate__animated.animate__switch-medium__duration {
			--animate-duration: ${theme.transitions.duration.switchMedium}ms;
		}

		#credential_picker_container {
			z-index: ${theme.zIndex.googleOneTabLogin} !important;
		}
		#credential_picker_iframe {
			z-index: ${theme.zIndex.googleOneTabLogin} !important;
		}
	`;
};

export default styleOverrides;
