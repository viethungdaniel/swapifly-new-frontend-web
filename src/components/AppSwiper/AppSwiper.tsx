import { forwardRef, useId } from "react";

import { Swiper } from "swiper/react";
import {
  Pagination,
  Navigation,
  Virtual,
  Autoplay,
  EffectFade,
  Thumbs,
  Controller,
} from "swiper/modules";
import AppSvgIcon from "@/components/AppSvgIcon";
import { Box, ButtonBase } from "@mui/material";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import useStyles from "./AppSwiper.styles";

import type { BoxProps } from "@mui/material";
import type { SwiperProps } from "swiper/react";
import type { PaginationOptions, NavigationOptions } from "swiper/types";

type CustomAppSwiperProps = {
  pagination?: PaginationOptions;
  navigation?: NavigationOptions;
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
  rootProps?: BoxProps;
};

export type AppSwiperProps = Omit<
  SwiperProps,
  "modules" & keyof CustomAppSwiperProps
> &
  CustomAppSwiperProps;

const AppSwiper = forwardRef(
  (props: AppSwiperProps, ref: React.ForwardedRef<any>) => {
    const {
      pagination,
      navigation,
      speed = 1000,
      classes: appClasses,
      rootProps,
      ...rest
    } = props;

    const id = useId();

    const { classes, cx } = useStyles(undefined, {
      props: {
        classes: appClasses,
      },
    });

    const swiperCustomPaginationClassName = `swiper-custom-pagination-${id.replaceAll(
      ":",
      "app"
    )}`;
    const customNavigationNextElClassName = `swiper-button-next-${id.replaceAll(
      ":",
      "app"
    )}`;
    const customNavigationPrevElClassName = `swiper-button-prev-${id.replaceAll(
      ":",
      "app"
    )}`;
    const navigationEnabled = !!navigation?.enabled;
    const paginationEnabled = !!pagination?.enabled;

    return (
      <Box {...rootProps} className={cx(classes.root, rootProps?.className)}>
        <Swiper
          ref={ref}
          {...rest}
          speed={speed}
          navigation={{
            disabledClass: classes.navigationArrowButtonDisabled,
            nextEl: `.${customNavigationNextElClassName}`,
            prevEl: `.${customNavigationPrevElClassName}`,
            ...(navigation as any),
            enabled: navigationEnabled,
          }}
          pagination={{
            el: `.${swiperCustomPaginationClassName}`,
            clickable: true,
            renderBullet: function (_, className) {
              return `<span class="${cx(
                className,
                classes.paginationBullet
              )}"></span>`;
            },
            ...(pagination as any),
          }}
          modules={[
            Pagination,
            Navigation,
            Virtual,
            Autoplay,
            Thumbs,
            EffectFade,
            Controller,
          ]}
          {...rest}
        />
        {!navigation?.prevEl && (
          <ButtonBase
            className={cx(
              customNavigationPrevElClassName,
              classes.navigationArrow,
              classes.navigationArrowPrev,
              classes.navigationArrowButton,
              !navigationEnabled && classes.hidden
            )}
          >
            <AppSvgIcon component={ArrowLeftIcon} fontSize="inherit" />
          </ButtonBase>
        )}
        {!navigation?.nextEl && (
          <ButtonBase
            className={cx(
              customNavigationNextElClassName,
              classes.navigationArrow,
              classes.navigationArrowNext,
              classes.navigationArrowButton,
              !navigationEnabled && classes.hidden
            )}
          >
            <AppSvgIcon component={ArrowRightIcon} fontSize="inherit" />
          </ButtonBase>
        )}
        <div
          className={cx(
            swiperCustomPaginationClassName,
            "swiper-pagination",
            classes.pagination,
            !paginationEnabled && classes.hidden
          )}
        />
      </Box>
    );
  }
);

export default AppSwiper;
