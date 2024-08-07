import { forwardRef } from "react";

import { MenuList } from "@mui/material";

import useStyles from "./AppMenuList.styles";

import type { MenuListProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type AppMenuListProps = MenuListProps;

type AppMenuListTypeMap<P = {}, D extends React.ElementType = "ul"> = {
  props: P & AppMenuListProps;
  defaultComponent: D;
};
type AppMenuListComponent = OverridableComponent<AppMenuListTypeMap>;

const AppMenuList: AppMenuListComponent = forwardRef(
  (props: AppMenuListProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <MenuList
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          padding: cx(classes.padding, muiClasses?.padding),
        }}
      />
    );
  }
);

export default AppMenuList;
