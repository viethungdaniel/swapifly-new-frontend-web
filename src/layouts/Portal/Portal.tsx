import PortalHeader from "@/layouts/Portal/components/PortalHeader";
import PortalFooter from "@/layouts/Portal/components/PortalFooter";
import PortalFloatActions from "@/layouts/Portal/components/PortalFloatActions";

import PortalContext from "@/layouts/Portal/Portal.context";

import useStyles from "./Portal.styles";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type PortalProps = {
  children: React.ReactNode;
  variant?: "helpCenter" | "news";
  disablePortalHeader?: boolean;
  disablePortalFooter?: boolean;
};

export type VariantState = {
  headerTitle: string;
  footerNextLink: {
    href: string;
    text: string;
  };
};

const Portal = (props: PortalProps) => {
  const {
    variant = "helpCenter",
    disablePortalFooter,
    disablePortalHeader,
    children,
  } = props;

  const { classes } = useStyles();

  const { t } = useTranslation();

  const variantToState = useMemo<{ [variant: string]: VariantState }>(
    () => ({
      helpCenter: {
        headerTitle: t("helpCenter"),
        footerNextLink: {
          href: "/news",
          text: t("news"),
        },
      },
      news: {
        headerTitle: t("news"),
        footerNextLink: {
          href: "/help-center",
          text: t("helpCenter"),
        },
      },
    }),
    [t]
  );

  const variantState = useMemo(() => {
    return variantToState[variant];
  }, [variant, variantToState]);

  return (
    <PortalContext.Provider
      value={{
        variant,
        variantState,
      }}
    >
      <div className={classes.root}>
        {!disablePortalHeader && <PortalHeader />}
        <main className={classes.main}>{children}</main>
        {!disablePortalFooter && <PortalFooter />}
        <PortalFloatActions />
      </div>
    </PortalContext.Provider>
  );
};

export default Portal;
