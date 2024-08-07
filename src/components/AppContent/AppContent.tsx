import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppContent.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomAppContentProps = {
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

type AppContentProps = Omit<BoxProps, keyof CustomAppContentProps> &
  CustomAppContentProps;

type AppContentTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppContentProps;
  defaultComponent: D;
};
type AppContentComponent = OverridableComponent<AppContentTypeMap>;

const AppContent: AppContentComponent = forwardRef(
  (props: AppContentProps, ref: React.ForwardedRef<any>) => {
    const { className, classes: appClasses, ...rest } = props;

    const { classes, cx } = useStyles(undefined, {
      props: { classes: appClasses },
    });

    return (
      <Box
        ref={ref}
        className={cx(classes.root, !!className && className)}
        {...rest}
      />
    );
  }
);

export default AppContent;
