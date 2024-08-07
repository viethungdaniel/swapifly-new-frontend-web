import { commonConstants } from "@/utils/constants";

import AppButton from "@/components/AppButton";
import RegionAndLanguageDrawer from "@/containers/RegionAndLanguageDrawer";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppAvatar from "@/components/AppAvatar";
import AppTooltip from "@/components/AppTooltip";

import MenuIcon from "@@/public/images/icons/region.svg";

import { useAppSelector } from "@/hooks";
import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { imageHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";
import { t } from "i18next";

type RegionAndLanguageProps = {
  variant?: "mobile" | "desktop";
};

const RegionAndLanguage = (props: RegionAndLanguageProps) => {
  const { variant = "desktop" } = props;

  const [regionAndLanguageDrawerOpen, setRegionAndLanguageDrawerOpen] =
    useState(false);

  const { i18n } = useTranslation();

  const $s_region = useAppSelector((state) => state.common.region);

  const language = useMemo(() => {
    return (
      commonConstants.languages.find((lang) => lang.value === i18n.language)
        ?.title || ""
    );
  }, [i18n.language]);

  const handleRegionAndLanguageDrawerOpen = () => {
    setRegionAndLanguageDrawerOpen(true);
  };

  const handleRegionAndLanguageDrawerClose = () => {
    setRegionAndLanguageDrawerOpen(false);
  };

  return (
    <>
      {variant === "desktop" && (
        <AppButton
          color="text.primary"
          edge={"xy"}
          fullMaxHeight
          borderRadius="circular"
          onClick={handleRegionAndLanguageDrawerOpen}
          sx={{ gap: 1 }}
        >
          <AppAvatar
            src={imageHelpers.appImageLoader({
              src: $s_region?.img_url,
            })}
            alt={`${$s_region?.short_name} - ${commonConfig.DOCUMENT_TITLE}`}
            sx={{
              width: 24,
              height: 24,
              fontSize: 24,
              bgcolor: "transparent",
            }}
          >
            {$s_region?.flag}
          </AppAvatar>
          <span>{$s_region?.title}</span>
          <span>|</span>
          <span>{language}</span>
        </AppButton>
      )}
      {variant === "mobile" && (
        <AppTooltip title={t("regionAndLanguage")}>
          <AppIconButton
            color="text.primary"
            borderRadius="circular"
            edge={"xy"}
            onClick={handleRegionAndLanguageDrawerOpen}
          >
            <AppSvgIcon component={MenuIcon} />
          </AppIconButton>
        </AppTooltip>
      )}
      <RegionAndLanguageDrawer
        open={regionAndLanguageDrawerOpen}
        onClose={handleRegionAndLanguageDrawerClose}
      />
    </>
  );
};

export default RegionAndLanguage;
