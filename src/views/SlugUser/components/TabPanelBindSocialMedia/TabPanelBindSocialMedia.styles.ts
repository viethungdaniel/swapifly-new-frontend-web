import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "TabPanelBindSocialMedia",
})(() => {
  return {
    title: {
      flex: 1,
    },
    socialMediaItem: {
      minHeight: 60,
    },
  };
});

export default useStyles;
