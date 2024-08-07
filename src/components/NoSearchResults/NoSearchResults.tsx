import { forwardRef, useMemo } from "react";

import { Box } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppContainer from "@/components/AppContainer";

import NoResultsSvg from "@@/public/images/svgs/no-results.svg";
import NoListingSvg from "@@/public/images/svgs/no-listing.svg";
import NoReviewsSvg from "@@/public/images/svgs/no-reviews.svg";
import NoNotificationSvg from "@@/public/images/svgs/no-notifications.svg";
import NoMessageSvg from "@@/public/images/svgs/no-messages.svg";

import { Trans, useTranslation } from "next-i18next";

import useStyles from "./NoSearchResults.styles";

import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { BoxProps } from "@mui/material";

type CustomNoSearchResultsProps = {
  keyword?: string;
  variant?:
    | "search"
    | "list"
    | "reviews"
    | "notification"
    | "inbox"
    | "description";
};

export type NoSearchResultsProps = Omit<
  BoxProps,
  keyof CustomNoSearchResultsProps
> &
  CustomNoSearchResultsProps;

type NoSearchResultsTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & NoSearchResultsProps;
  defaultComponent: D;
};
type NoSearchResultsComponent = OverridableComponent<NoSearchResultsTypeMap>;

const NoSearchResults: NoSearchResultsComponent = forwardRef(
  (props: NoSearchResultsProps, ref: React.ForwardedRef<any>) => {
    const { className, keyword, variant = "search", sx, ...rest } = props;

    const { t } = useTranslation();

    const title = useMemo(() => {
      switch (variant) {
        case "list": {
          return t("noListingsYet");
        }
        case "inbox": {
          return t("youHaveNoChatsHere");
        }
        case "reviews": {
          return t("noReviewsYet");
        }
        case "notification": {
          return t("noNoticesYet");
        }
        case "description": {
          return t("noProfileDescriptionYet");
        }
        default: {
          return t("noSearchResults");
        }
      }
    }, [variant, keyword, t]);

    const Icon = useMemo(() => {
      switch (variant) {
        case "list": {
          return NoListingSvg;
        }
        case "inbox": {
          return NoMessageSvg;
        }
        case "reviews": {
          return NoReviewsSvg;
        }
        case "notification": {
          return NoNotificationSvg;
        }
        case "description": {
          return NoReviewsSvg;
        }
        default: {
          return NoResultsSvg;
        }
      }
    }, [variant]);

    const subtitle = useMemo(() => {
      switch (variant) {
        case "list": {
          return "There is no any listing";
        }
        default: {
          return "";
        }
      }
    }, [variant]);

    const { classes, theme, cx, css } = useStyles();

    return (
      <Box
        ref={ref}
        {...rest}
        className={cx(
          classes.root,
          className,
          sx && css(theme.unstable_sx(sx) as any)
        )}
      >
        <AppContainer className={classes.container} maxWidth="sm">
          <div className={classes.content}>
            <Box display="flex" justifyContent="center">
              <Icon className={classes.icon} />
            </Box>
            <AppTypography variant="titleSemi20" align="center">
              {title}
            </AppTypography>
            {!!subtitle && (
              <AppTypography color="text.secondary" align="center">
                {subtitle}
              </AppTypography>
            )}
            {!!keyword && (
              <AppTypography color="text.secondary" align="center">
                <Trans
                  t={t}
                  defaults="noSearchResultsCaption"
                  values={{
                    keyword,
                  }}
                />
              </AppTypography>
            )}
          </div>
        </AppContainer>
      </Box>
    );
  }
);

export default NoSearchResults;
