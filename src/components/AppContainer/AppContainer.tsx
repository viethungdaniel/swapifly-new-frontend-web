import { useMemo, forwardRef } from "react";

import { Container } from "@mui/material";

import useStyles from "./AppContainer.styles";

import type { ContainerProps, Theme } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomContainerProps = {
  disableGutters?:
    | boolean
    | `${keyof Theme["breakpoints"]["values"]}Up`
    | `${keyof Theme["breakpoints"]["values"]}Down`;
};

export type AppContainerProps = Omit<
  ContainerProps,
  keyof CustomContainerProps
> &
  CustomContainerProps;

type AppContainerTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppContainerProps;
  defaultComponent: D;
};
type AppContainerComponent = OverridableComponent<AppContainerTypeMap>;

const AppContainer: AppContainerComponent = forwardRef(
  (props: AppContainerProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, disableGutters, ...rest } = props;
    const { classes, cx } = useStyles();

    const disableGutterClassName = useMemo(() => {
      if (typeof disableGutters === "string") {
        const className = (disableGutters.charAt(0).toUpperCase() +
          disableGutters.slice(1)) as Capitalize<
          string & typeof disableGutters
        >;
        return classes[`disableGutter${className}`];
      }
      return disableGutters === true ? classes.disableGutters : "";
    }, [disableGutters, classes]);

    return (
      <Container
        maxWidth="lg"
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(disableGutterClassName, muiClasses?.root),
        }}
        {...rest}
      />
    );
  }
);

export default AppContainer;
