import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxThreadAiChatStatus",
  uniqId: "GYFL8h",
})((theme) => {
  return {
    root: {
      justifyContent: "center",
      minHeight: "auto",
      paddingTop: theme.spacing(2.5),
    },
    chip: {
      height: "auto",
      padding: "4.5px 0px",
      borderRadius: 90 / 2,
    },
    chipLabel: {
      whiteSpace: "pre-wrap",
      textOverflow: "auto",
      textAlign: "center",
    },
  };
});

export default useStyles;
