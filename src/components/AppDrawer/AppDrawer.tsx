import { forwardRef, useEffect, useState } from "react";

import { SwipeableDrawer as Drawer } from "@mui/material";
import AppPaper from "@/components/AppPaper";

import useStyles from "./AppDrawer.styles";

import type { SwipeableDrawerProps as DrawerProps } from "@mui/material";

type CustomDrawerProps = {
  PaperProps?: Omit<React.ComponentProps<typeof AppPaper>, "component">;
  onOpen?: DrawerProps["onOpen"];
};

export type AppDrawerProps = CustomDrawerProps &
  Omit<DrawerProps, keyof CustomDrawerProps>;

const AppDrawer = forwardRef(
  (props: AppDrawerProps, ref: React.ForwardedRef<any>) => {
    const {
      classes: muiClasses,
      PaperProps,
      open: controlledOpen,
      onClose,
      onOpen,
      sx,
      ...rest
    } = props;

    const [open, setOpen] = useState(!!controlledOpen);

    const { classes, theme, cx, css } = useStyles();

    const handleDrawerClose: DrawerProps["onClose"] = (event) => {
      setOpen(false);
      onClose && onClose(event);
    };

    const handleDrawerOpen: DrawerProps["onOpen"] = (event) => {
      setOpen(true);
      onOpen && onOpen(event);
    };

    useEffect(() => {
      if (open !== !!controlledOpen) {
        setOpen(!!controlledOpen);
      }
    }, [controlledOpen]);

    return (
      <Drawer
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(muiClasses?.root, sx && css(theme.unstable_sx(sx) as any)),
          paper: cx(classes.paper, muiClasses?.paper),
          paperAnchorRight: cx(
            classes.paperAnchorRight,
            muiClasses?.paperAnchorRight
          ),
        }}
        variant="temporary"
        anchor="right"
        {...rest}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
        open={open}
        PaperProps={
          {
            component: AppPaper,
            ...PaperProps,
          } as any
        }
      />
    );
  }
);

export default AppDrawer;
