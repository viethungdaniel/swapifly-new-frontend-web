import { forwardRef } from "react";

import { commonHelpers } from "@/utils/helpers";

import { Box } from "@mui/material";
import parseHtml, { domToReact } from "html-react-parser";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";

import useStyles from "./HtmlParser.styles";

import type { HTMLReactParserOptions } from "html-react-parser";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { AppTypographyProps } from "@/components/AppTypography";
import type { BoxProps } from "@mui/material";
import type { AppLinkProps } from "@/components/AppLink";

type CustomHtmlParserProps = {
  html?: string;
  htmlOptions?: HTMLReactParserOptions;
  children?: null;
};

export type HtmlParserProps = Omit<BoxProps, keyof CustomHtmlParserProps> &
  CustomHtmlParserProps;

type HtmlParserTypeMap<P = {}, D extends React.ElementType = "span"> = {
  props: P & HtmlParserProps;
  defaultComponent: D;
};
type HtmlParserComponent = OverridableComponent<HtmlParserTypeMap>;

const HtmlParser: HtmlParserComponent = forwardRef(
  (props: HtmlParserProps, ref: React.ForwardedRef<any>) => {
    const { html, className, htmlOptions, sx, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    const tagToPropsMap = {
      a: {
        variant: "bodyReg14",
        component: AppLink,
        color: "primary",
        disabledNextLink: true,
        target: "_blank",
      } as AppLinkProps,
      u: {
        variant: "bodyReg14",
      },
      p: {
        variant: "bodyReg14",
      },
      h1: {
        variant: "h1",
      },
      h2: {
        variant: "h2",
      },
      h3: {
        variant: "h3",
      },
      h4: {
        variant: "h4",
      },
      h5: {
        variant: "h5",
      },
      h6: {
        variant: "h6",
      },
      pre: {
        variant: "bodyReg14",
      },
      li: {
        variant: "bodyReg14",
      },
    } as {
      [key: string]: AppTypographyProps & {
        [key: string]: any;
      };
    };

    const htmlParserOptions = {
      replace: (options: any) => {
        const { children, attribs, name } = options;

        if (!attribs) {
          return;
        }

        if (!!name) {
          if (!!tagToPropsMap[name]) {
            const { class: attribClass, ...attribsRest } = attribs || {};
            return (
              <AppTypography
                component={name ?? "span"}
                {...tagToPropsMap[name]}
                {...attribsRest}
                className={attribClass}
                style={commonHelpers.parseStyles(attribs.style)}
              >
                {domToReact(children, htmlParserOptions)}
              </AppTypography>
            );
          }
        }
      },
    };

    return (
      <Box
        ref={ref}
        className={cx(
          classes.root,
          className,
          sx && css(theme.unstable_sx(sx) as any)
        )}
        {...rest}
        component="div"
      >
        <div className={classes.clearMarginTop} />
        {parseHtml(html || "", { ...htmlParserOptions, ...htmlOptions })}
      </Box>
    );
  }
);

export default HtmlParser;
