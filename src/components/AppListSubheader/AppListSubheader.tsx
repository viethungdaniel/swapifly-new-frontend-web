import { forwardRef } from "react";

import { ListSubheader } from "@mui/material";

import useStyles from "./AppListSubheader.styles";

import type { ListSubheaderProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type AppListSubheaderProps = ListSubheaderProps;

type AppListSubheaderTypeMap<P = {}, D extends React.ElementType = "li"> = {
  props: P & AppListSubheaderProps;
  defaultComponent: D;
};
type AppListSubheaderComponent = OverridableComponent<AppListSubheaderTypeMap>;

const AppListSubheader: AppListSubheaderComponent = forwardRef(
  (props: AppListSubheaderProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <ListSubheader
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(classes.root, muiClasses?.root, className),
          gutters: cx(classes.gutters, muiClasses?.gutters),
        }}
      />
    );
  }
);

export default AppListSubheader;
