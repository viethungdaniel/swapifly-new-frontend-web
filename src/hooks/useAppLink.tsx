import { commonConfig } from "@/utils/config";
import { commonHelpers } from "@/utils/helpers";
import { useTranslation } from "next-i18next";

import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { useMemo } from "react";

type UseAppLinkProps = {
  autoRedirect?: boolean;
  variant?: "iOS" | "android";
};

const useAppLink = (props?: UseAppLinkProps) => {
  const { autoRedirect = false, variant } = props || {};

  const { i18n } = useTranslation();

  const appLink = useMemo(() => {
    const mobileOperatingSystem = commonHelpers.getMobileOperatingSystem();
    if (
      (variant !== "android" && mobileOperatingSystem === "IOS") ||
      variant === "iOS"
    ) {
      return `https://apps.apple.com/hk/app/swapifly/id${commonConfig.APPLE_APP_ID}`;
    }
    return `https://play.google.com/store/apps/details?id=${commonConfig.GOOGLE_PLAY_APP_ID}&hl=${i18n.language}`;
  }, [i18n.language, variant]);

  useIsomorphicLayoutEffect(() => {
    if (!!autoRedirect) window.location.href = appLink;
  }, [autoRedirect, appLink]);

  return appLink;
};

export default useAppLink;
