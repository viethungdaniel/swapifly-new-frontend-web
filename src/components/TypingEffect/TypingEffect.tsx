import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./TypingEffect.styles";

import type { BoxProps } from "@mui/material";

export type CustomTypingEffectProps = {
  children?: null;
};

export type TypingEffectProps = CustomTypingEffectProps &
  Omit<BoxProps, keyof CustomTypingEffectProps>;

const TypingEffect = forwardRef(
  (props: TypingEffectProps, ref: React.ForwardedRef<any>) => {
    const { className, sx, ...rest } = props;

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
        <div className={classes.dot} />
        <div className={classes.dot} />
        <div className={classes.dot} />
      </Box>
    );
  }
);

export default TypingEffect;
