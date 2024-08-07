import { makeStyles } from "tss-react/mui";

import type { AppBarCharProps } from "./AppChartBar";

type StylesParams = {
  minHeight?: AppBarCharProps["minHeight"];
};

const useStyles = makeStyles<StylesParams>({
  name: "AppChartBar",
  uniqId: "2pJNb4",
})((_, params) => {
  return {
    root: {
      minHeight: params?.minHeight || 380,
    },
    bar: {
      height: "100%",
    },
  };
});

export default useStyles;
