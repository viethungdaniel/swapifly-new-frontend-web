import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

type StylesParams = {
  color?: string;
};

const useStyles = makeStyles<StylesParams>({
  name: "appBadge",
})((theme, params) => {
  let color = "";
  let textColor: string | undefined = undefined;

  switch (params.color) {
    case "primary": {
      color = theme.palette.primary.main;
      textColor = theme.palette.common.white;
      break;
    }
    case "secondary": {
      color = theme.palette.secondary.main;
      textColor = theme.palette.common.white;
      break;
    }
    case "error": {
      color = theme.palette.error.main;
      textColor = theme.palette.common.white;
      break;
    }
    default:
      color =
        _get(theme.palette, params?.color ?? "") ??
        (params?.color || "transparent");
      break;
  }
  if (color !== "transparent" && !!color && !textColor) {
    textColor = theme.palette.getContrastText(color);
  }

  return {
    badge: {
      // border: `2px solid ${
      //   !!color && color !== "transparent"
      //     ? theme.palette.common.white
      //     : "transparent"
      // }`,
      fontSize: theme.typography.captionReg12.fontSize,
      fontWeight: theme.typography.captionReg12.fontWeight,
      fontFamily: theme.typography.captionReg12.fontFamily,
      lineHeight: 1,
      padding: theme.spacing(0, 0.5),
      // borderRadius: 4,
      backgroundColor: color,
      color: textColor,
    },
  };
});

export default useStyles;
