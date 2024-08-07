import { forwardRef, useRef } from "react";

import { DialogTitle, Typography, useMediaQuery } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppIconButton from "@/components/AppIconButton";

import CloseIcon from "@@/public/images/icons/close.svg";

import { useIsomorphicLayoutEffect } from "@/hooks";

import useStyles from "./AppDialogTitle.styles";

import type { DialogTitleProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomDialogTitleProps = {
  align?: "left" | "center";
  mobileAlign?: "left" | "center";
  startActions?: React.ReactNode;
  endActions?: React.ReactNode;
  appClasses?: Partial<ReturnType<typeof useStyles>["classes"]>;
  onCloseButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type AppDialogTitleProps = Omit<
  DialogTitleProps,
  keyof CustomDialogTitleProps
> &
  CustomDialogTitleProps;

type AppDialogTitleTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppDialogTitleProps;
  defaultComponent: D;
};
type AppDialogTitleComponent = OverridableComponent<AppDialogTitleTypeMap>;

const AppDialogTitle: AppDialogTitleComponent = forwardRef(
  (props: AppDialogTitleProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      classes: muiClasses,
      appClasses,
      variant,
      children,
      align = "center",
      mobileAlign = "center",
      startActions,
      endActions,
      sx,
      onCloseButtonClick,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles(undefined, {
      props: {
        classes: appClasses,
      },
    });

    const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

    const titleElRef = useRef<HTMLDivElement>(undefined!);
    const endActionsElRef = useRef<HTMLDivElement>(undefined!);
    const startActionsElRef = useRef<HTMLDivElement>(undefined!);

    useIsomorphicLayoutEffect(() => {
      const updateStartEndActionsEl = () => {
        if (
          (!isTabletDown && align === "center") ||
          (isTabletDown && mobileAlign === "center")
        ) {
          const startActionsElWidth =
            startActionsElRef.current.getBoundingClientRect().width;
          const endActionsElWidth =
            endActionsElRef.current.getBoundingClientRect().width;
          if (endActionsElWidth >= startActionsElWidth) {
            startActionsElRef.current.style.width = `${endActionsElWidth}px`;
          } else {
            endActionsElRef.current.style.width = `${startActionsElWidth}px`;
          }
        } else {
          startActionsElRef.current.style.width = "";
          endActionsElRef.current.style.width = "";
        }
      };
      const resizeObserverStartEndActionsEle = new ResizeObserver(
        updateStartEndActionsEl
      );
      resizeObserverStartEndActionsEle.observe(startActionsElRef.current);
      resizeObserverStartEndActionsEle.observe(endActionsElRef.current);
      return () => {
        resizeObserverStartEndActionsEle.disconnect();
      };
    }, [isTabletDown, align, mobileAlign]);

    return (
      <DialogTitle
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            {
              [classes.alignLeft]: align === "left",
              [classes.alignCenter]: align === "center",
              [classes.mobileAlignLeft]: mobileAlign === "left",
              [classes.mobileAlignCenter]: mobileAlign === "center",
            },
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
        component="div"
        {...rest}
      >
        <div ref={startActionsElRef} className={classes.startActions}>
          {startActions}
        </div>
        <Typography
          className={classes.title}
          ref={titleElRef}
          variant="titleSemi20"
          component="div"
          noWrap
        >
          {children}
        </Typography>
        <div ref={endActionsElRef} className={classes.endActions}>
          {endActions}
          {!!onCloseButtonClick && (
            <AppIconButton
              color="text.primary"
              borderRadius="circular"
              edge="xy"
              onClick={onCloseButtonClick}
            >
              <AppSvgIcon component={CloseIcon} fontSize={"small"} />
            </AppIconButton>
          )}
        </div>
      </DialogTitle>
    );
  }
);

export default AppDialogTitle;
