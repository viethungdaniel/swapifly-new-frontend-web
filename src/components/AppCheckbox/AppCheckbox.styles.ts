import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

type StylesParams = {
  color: string;
  defaultCheckedIconColor: string;
};

const useStyles = makeStyles<StylesParams, "indeterminate" | "checked">({
  name: "AppCheckbox",
  uniqId: "YWqNfx",
})((theme, params, classes) => {
  let color = "";
  let defaultCheckedIconColor = "";

  switch (params.color) {
    case "primary": {
      color = theme.palette.primary.main;
      break;
    }
    case "secondary": {
      color = theme.palette.secondary.main;
      break;
    }
    case "error": {
      color = theme.palette.secondary.main;
      break;
    }
    default: {
      color =
        _get(theme.palette, params?.color ?? "") ??
        (params?.color || theme.palette.primary.main);
      break;
    }
  }

  switch (params.defaultCheckedIconColor) {
    case "primary": {
      defaultCheckedIconColor = theme.palette.primary.main;
      break;
    }
    case "secondary": {
      defaultCheckedIconColor = theme.palette.secondary.main;
      break;
    }
    case "error": {
      defaultCheckedIconColor = theme.palette.secondary.main;
      break;
    }
    default: {
      defaultCheckedIconColor =
        _get(theme.palette, params?.color ?? "") ??
        (params?.color || theme.palette.primary.main);
      break;
    }
  }

  const spacing = 1;

  return {
    root: {
      padding: theme.spacing(spacing),
      [`&.${classes.indeterminate}`]: {
        color,
      },
      [`&.${classes.checked}`]: {
        color: defaultCheckedIconColor,
      },
    },
    checked: {},
    indeterminate: {},
    icon: {
      fontSize: theme.typography.pxToRem(24),
      color,
    },
    checkedIcon: {
      color: defaultCheckedIconColor,
    },
    edgeStart: {
      marginLeft: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
    edgeEnd: {
      marginRight: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
    edgeTop: {
      marginTop: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
    edgeBottom: {
      marginBottom: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
    edgeX: {
      marginLeft: `calc(${theme.spacing(-spacing)} - 2px)`,
      marginRight: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
    edgeY: {
      marginTop: `calc(${theme.spacing(-spacing)} - 2px)`,
      marginBottom: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
    edgeXY: {
      marginLeft: `calc(${theme.spacing(-spacing)} - 2px)`,
      marginRight: `calc(${theme.spacing(-spacing)} - 2px)`,
      marginTop: `calc(${theme.spacing(-spacing)} - 2px)`,
      marginBottom: `calc(${theme.spacing(-spacing)} - 2px)`,
    },
  };
});

export default useStyles;
