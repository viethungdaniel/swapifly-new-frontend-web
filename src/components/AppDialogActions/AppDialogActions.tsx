import { forwardRef } from "react";

import { DialogActions } from "@mui/material";

import useStyles from "./AppDialogActions.styles";

import type { DialogActionsProps } from "@mui/material";

export type AppDialogActionsProps = DialogActionsProps;

const AppDialogActionsActions = forwardRef(
  (props: AppDialogActionsProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <DialogActions
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(classes.root, muiClasses?.root),
        }}
        {...rest}
      />
    );
  }
);

export default AppDialogActionsActions;
