import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

const useStyles = makeStyles({
  name: "AppTooltip",
})((theme) => {
  return {
    tooltip: {
      backgroundColor: theme.palette.common.darkNeutral,
      borderRadius: 4,
      padding: "6.25px 10.25px",
      ...theme.typography.captionReg12,
    },
  };
});

export default useStyles;
