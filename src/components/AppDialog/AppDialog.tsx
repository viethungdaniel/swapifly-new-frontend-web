import { forwardRef } from "react";

import { Dialog } from "@mui/material";

import { useMediaQuery } from "@mui/material";

import AppPaper from "@/components/AppPaper";

import useStyles from "./AppDialog.styles";

import type { DialogProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomDialogProps = {
  mobileFullScreen?: boolean;
  mobileScroll?: DialogProps["scroll"];
};

export type AppDialogProps = CustomDialogProps &
  Omit<DialogProps, keyof CustomDialogProps>;

type AppDialogTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppDialogProps;
  defaultComponent: D;
};
type AppDialogComponent = OverridableComponent<AppDialogTypeMap>;

const AppDialog: AppDialogComponent = forwardRef(
  (props: AppDialogProps, ref: React.ForwardedRef<any>) => {
    const {
      scroll = "body",
      fullScreen,
      mobileFullScreen,
      mobileScroll,
      classes: muiClasses,
      ...rest
    } = props;

    const { theme, classes, cx } = useStyles();

    const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

    return (
      <Dialog
        ref={ref}
        PaperComponent={AppPaper}
        {...rest}
        classes={{
          ...muiClasses,
          paperFullScreen: cx(
            classes.paperFullScreen,
            muiClasses?.paperFullScreen
          ),
          scrollBody: cx(classes.scrollBody, muiClasses?.scrollBody),
        }}
        fullScreen={(!!mobileFullScreen && isTabletDown) || !!fullScreen}
        scroll={mobileScroll && isTabletDown ? mobileScroll : scroll}
      />
    );
  }
);

export default AppDialog;
