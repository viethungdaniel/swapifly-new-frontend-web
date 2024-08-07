import _get from "lodash/get";
import { makeStyles } from "tss-react/mui";

import type { AppLinkProps } from "@/components/AppLink/AppLink";

type StylesParams = {
  hoverColor?: AppLinkProps["hoverColor"];
};

const useStyles = makeStyles<StylesParams>({
  name: "AppLink",
  uniqId: "i5uc6D",
})((theme, params) => {
  let hoverColor: React.CSSProperties["color"] = "";

  switch (params.hoverColor) {
    case "primary": {
      hoverColor = theme.palette.primary.main;
      break;
    }

    case "secondary": {
      hoverColor = theme.palette.secondary.main;
      break;
    }

    case "error": {
      hoverColor = theme.palette.error.main;
      break;
    }

    default: {
      hoverColor =
        _get(theme.palette, params.hoverColor as string)! || params.hoverColor!;
      break;
    }
  }

  return {
    root: {
      "&:hover": {
        color: hoverColor,
      },
    },
  };
});

export default useStyles;
