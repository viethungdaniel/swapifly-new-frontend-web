import { forwardRef } from "react";

import { ListItemText } from "@mui/material";

import type { ListItemTextProps } from "@mui/material";

export type AppListItemTextProps = ListItemTextProps;

const AppListItemText = forwardRef(
  (props: AppListItemTextProps, ref: React.ForwardedRef<any>) => {
    const {
      classes: muiClasses,
      primaryTypographyProps,
      secondaryTypographyProps,
      ...rest
    } = props;

    return (
      <ListItemText
        ref={ref}
        {...rest}
        primaryTypographyProps={{
          variant: "bodyReg14",
          whiteSpace: "pre-wrap",
          ...primaryTypographyProps,
        }}
        secondaryTypographyProps={{
          variant: "captionReg12",
          whiteSpace: "pre-wrap",
          ...secondaryTypographyProps,
        }}
        classes={{
          ...muiClasses,
        }}
      />
    );
  }
);

export default AppListItemText;
