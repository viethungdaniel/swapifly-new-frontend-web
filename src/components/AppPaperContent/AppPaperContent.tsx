import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppPaperContent.styles";

import type { PaperProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomAppPaperProps = {
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

export type AppPaperContentProps = Omit<PaperProps, keyof CustomAppPaperProps> &
  CustomAppPaperProps;

type AppPaperContentTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppPaperContentProps;
  defaultComponent: D;
};
type AppPaperContentComponent = OverridableComponent<AppPaperContentTypeMap>;

const AppPaperContent: AppPaperContentComponent = forwardRef(
  (props: AppPaperContentProps, ref: React.ForwardedRef<any>) => {
    const { className, classes: appClasses, sx, ...rest } = props;

    const { classes, theme, css, cx } = useStyles(undefined, {
      props: {
        classes: appClasses,
      },
    });

    return (
      <Box
        ref={ref}
        {...rest}
        className={cx(
          classes.root,
          className,
          sx && css(theme.unstable_sx(sx) as any)
        )}
      />
    );
  }
);

export default AppPaperContent;
