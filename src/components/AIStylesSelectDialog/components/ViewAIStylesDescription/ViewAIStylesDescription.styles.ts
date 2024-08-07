import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "ViewAIStylesDescription",
})(() => {
  return {
    aIDescriptionContent: {
      position: "relative",
    },
    aIDescriptionContentPlaceholder: {
      opacity: 0,
    },
    typewriter: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    },
  };
});

export default useStyles;
