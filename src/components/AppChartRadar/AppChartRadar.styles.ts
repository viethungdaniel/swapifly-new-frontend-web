import { makeStyles } from "tss-react/mui";

import type { AppChartRadarProps } from "./AppChartRadar";

type StylesParams = {
  minHeight?: AppChartRadarProps["minHeight"];
};

const useStyles = makeStyles<StylesParams>({
  name: "AppChartRadar",
  uniqId: "2pJNb4",
})((_, params) => {
  return {
    root: {
      minHeight: params?.minHeight || 380,
    },
    radar: {
      // height: "100%",
    },
  };
});

export default useStyles;
