import _round from "lodash/round";

import { commonConfig } from "@/utils/config";

import AppImage from "@/components/AppImage";

import { forwardRef, useMemo } from "react";

import useStyles from "./LogoImage.styles";

type CustomLogoImageProps = {
  variant?: keyof typeof variantToImgPathMap;
  alt?: string;
};

export type LogoImageProps = CustomLogoImageProps &
  Omit<
    React.ComponentPropsWithRef<typeof AppImage>,
    keyof CustomLogoImageProps | "src"
  >;

const variantToImgPathMap = {
  logo: "/images/logo.svg",
  textLogo: "/images/text-logo.svg",
};

const LogoImage = forwardRef(
  (props: LogoImageProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      width: controlledWidth,
      height: controlledHeight,
      variant = "textLogo",
      alt = `Logo - ${commonConfig.DOCUMENT_TITLE}`,
      ...rest
    } = props;

    const ratio = useMemo(() => {
      switch (variant) {
        case "textLogo": {
          return 300 / 73;
        }
        case "logo": {
          return 131 / 150;
        }
      }
      return 1;
    }, [variant]);

    const width = useMemo(() => {
      switch (variant) {
        case "textLogo": {
          return 140;
        }
        case "logo": {
          return 24;
        }
      }
      return;
    }, [variant, ratio]);

    const height = useMemo(() => {
      switch (variant) {
        case "textLogo": {
          return Math.round(140 / ratio);
        }
        case "logo": {
          return Math.round(24 / ratio);
        }
      }
      return;
    }, [variant, ratio]);

    const { classes, cx } = useStyles({
      width: controlledWidth,
      height: controlledHeight,
    });

    return (
      <AppImage
        ref={ref}
        sizes="100vw"
        {...rest}
        alt={alt}
        width={width}
        height={height}
        className={cx(classes.root, className)}
        src={variantToImgPathMap[variant]}
        unoptimized
        priority
      />
    );
  }
);

export default LogoImage;
