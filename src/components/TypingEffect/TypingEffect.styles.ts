import { makeStyles } from "tss-react/mui";
import { keyframes } from "tss-react";

const useStyles = makeStyles({
  name: "TypingEffect",
})((theme) => {
  return {
    root: {
      height: theme.spacing(1),
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    dot: {
      float: "left",
      width: 8,
      height: 8,
      background: theme.palette.common.neutral,
      borderRadius: "50%",
      opacity: 0,
      animation: `${keyframes`
        0% {
          opacity: 0;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          opacity: 0;
        }
        `} 1s infinite`,
      "&:nth-of-type(1)": {
        animationDelay: "0s",
      },
      "&:nth-of-type(2)": {
        animationDelay: "0.2s",
      },
      "&:nth-of-type(3)": {
        animationDelay: "0.4s",
      },
    },
  };
});

export default useStyles;
