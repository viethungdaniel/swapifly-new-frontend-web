import { forwardRef } from "react";

import { DialogContent } from "@mui/material";

import type { DialogContentProps } from "@mui/material";

import useStyles from "./AppDialogContent.styles";

export type AppDialogContentProps = DialogContentProps;

const AppDialogContent = forwardRef(
  (props: AppDialogContentProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, sx, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <DialogContent
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
        {...rest}
      />
    );
  }
);

export default AppDialogContent;
