import { forwardRef } from "react";

import { Pagination, PaginationItem } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import useStyles from "./AppPagination.styles";

import type { PaginationProps } from "@mui/material";

export type AppPaginationProps = Omit<
  PaginationProps,
  "variant" | "color" | "size"
>;

const ArrowPrevIcon = forwardRef((props: any, ref: React.ForwardedRef<any>) => {
  return (
    <AppSvgIcon
      ref={ref}
      {...props}
      component={ArrowLeftIcon}
      fontSize="inherit"
    />
  );
});

const ArrowNextIcon = forwardRef((props: any, ref: React.ForwardedRef<any>) => {
  return (
    <AppSvgIcon
      ref={ref}
      {...props}
      component={ArrowRightIcon}
      fontSize="inherit"
    />
  );
});

const AppPagination = forwardRef(
  (props: AppPaginationProps, ref: React.ForwardedRef<any>) => {
    const { ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <Pagination
        ref={ref}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowPrevIcon, next: ArrowNextIcon }}
            {...item}
            classes={{
              root: cx(classes.paginationItem),
              selected: cx(classes.selected),
            }}
          />
        )}
        {...rest}
        color="primary"
        variant="text"
      />
    );
  }
);

export default AppPagination;
