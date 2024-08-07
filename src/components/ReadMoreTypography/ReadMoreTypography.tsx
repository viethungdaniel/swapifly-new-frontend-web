import { forwardRef, useEffect, useRef, useState } from "react";

import { Collapse } from "@mui/material";
import AppTypography from "@/components/AppTypography";

import { useTranslation } from "next-i18next";

import useStyles from "./ReadMoreTypography.styles";

import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { AppTypographyProps } from "@/components/AppTypography";

type CustomReadMoreTypographyProps = {};

export type ReadMoreTypographyProps = Omit<
  AppTypographyProps,
  keyof CustomReadMoreTypographyProps
> &
  CustomReadMoreTypographyProps;

interface ReadMoreTypographyTypeMap<
  P = {},
  D extends React.ElementType = "div"
> {
  props: P & ReadMoreTypographyProps;
  defaultComponent: D;
}

type ReadMoreTypographyComponent =
  OverridableComponent<ReadMoreTypographyTypeMap>;

const ReadMoreTypography: ReadMoreTypographyComponent = forwardRef(
  (props: ReadMoreTypographyProps, ref: React.ForwardedRef<any>) => {
    const { children, component = "div", sx, className, ...rest } = props;

    const [contentCollapsed, setContentCollapsed] = useState(true);
    const [readMoreActionShow, setReadMoreActionShow] = useState(true);

    const contentElRef = useRef<HTMLDivElement>(null!);

    const { t } = useTranslation();

    const contentMinHeight = 500;

    const handleCollapsedContentToggle = () => {
      setContentCollapsed((prevContentCollapsed) => !prevContentCollapsed);
    };

    const { classes, theme, css, cx } = useStyles();

    useEffect(() => {
      const resizeContentObserver = () => {
        setReadMoreActionShow(
          contentElRef.current.clientHeight >= contentMinHeight + 20
        );
      };

      const contentObserver = new ResizeObserver(resizeContentObserver);
      contentElRef.current && contentObserver.observe(contentElRef.current);
      return () => {
        contentObserver.disconnect();
      };
    }, []);

    return (
      <AppTypography
        ref={ref}
        {...rest}
        className={cx(
          contentCollapsed && readMoreActionShow && classes.collapsed,
          className,
          sx && css(theme.unstable_sx(sx) as any)
        )}
        component={component}
      >
        <Collapse
          className={classes.collapse}
          in={!contentCollapsed || !readMoreActionShow}
          collapsedSize={readMoreActionShow ? contentMinHeight : undefined}
        >
          <div ref={contentElRef}>{children}</div>
        </Collapse>
        {readMoreActionShow && (
          <AppTypography variant="inherit" textTransform="lowercase" mt={1}>
            <span
              className={classes.readMoreAction}
              onClick={handleCollapsedContentToggle}
            >
              {!contentCollapsed ? t("readLess") : t("readMore")}
            </span>
          </AppTypography>
        )}
      </AppTypography>
    );
  }
);

export default ReadMoreTypography;
