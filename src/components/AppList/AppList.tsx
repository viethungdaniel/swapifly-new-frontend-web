import { forwardRef } from "react";

import { List } from "@mui/material";

import useStyles from "./AppList.styles";

import type { ListProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type AppListEdge = "start" | "end" | "top" | "bottom" | "x" | "y" | "xy";

type CustomAppListProps = {
  edge?: AppListEdge | AppListEdge[];
};

export type AppListProps = Omit<ListProps, keyof CustomAppListProps> &
  CustomAppListProps;

interface AppListTypeMap<P = {}, D extends React.ElementType = "ul"> {
  props: P & AppListProps;
  defaultComponent: D;
}
type AppListComponent = OverridableComponent<AppListTypeMap>;

const AppList: AppListComponent = forwardRef(
  (props: AppListProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, edge, sx, ...rest } = props;

    const { classes, theme, css, cx } = useStyles();

    return (
      <List
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            {
              [classes.edgeTop]: edge === "top",
              [classes.edgeBottom]: edge === "bottom",
              [classes.edgeStart]: edge === "start",
              [classes.edgeEnd]: edge === "end",
              [classes.edgeX]: edge === "x",
              [classes.edgeY]: edge === "y",
              [classes.edgeXY]: edge === "xy",
            },
            muiClasses?.root,
            sx && css(theme.unstable_sx(sx) as any)
          ),
          padding: cx(classes.padding, muiClasses?.padding),
        }}
      />
    );
  }
);

export default AppList;
