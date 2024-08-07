import { forwardRef } from "react";

import { Rating } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";

import StarIcon from "@@/public/images/icons/star.svg";
import StarOutlinedIcon from "@@/public/images/icons/star-outlined.svg";

import useStyles from "./AppRating.styles";

import type { RatingProps } from "@mui/material";

export type CustomRatingProps = {
  color?: "default" | "primary" | "error" | AppThemeColor;
};

export type AppRatingProps = Omit<RatingProps, keyof CustomRatingProps> &
  CustomRatingProps;

const AppRating = forwardRef(
  (props: AppRatingProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, color = "default", ...rest } = props;

    const { classes, cx } = useStyles({
      color,
    });

    return (
      <Rating
        ref={ref}
        size="small"
        icon={<AppSvgIcon component={StarIcon} fontSize="inherit" />}
        emptyIcon={
          <AppSvgIcon component={StarOutlinedIcon} fontSize="inherit" />
        }
        {...rest}
        classes={{
          ...muiClasses,
          iconFilled: cx(classes.iconFilled, muiClasses?.iconFilled),
          sizeMedium: cx(classes.sizeMedium, muiClasses?.sizeMedium),
          sizeSmall: cx(classes.sizeSmall, muiClasses?.sizeSmall),
        }}
      />
    );
  }
);

export default AppRating;
