import RegionAndLanguageDrawer from "@/containers/RegionAndLanguageDrawer";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTooltip from "@/components/AppTooltip";

import MenuIcon from "@@/public/images/icons/region.svg";

import { useState } from "react";
import { useTranslation } from "next-i18next";

const RegionAndLanguage = () => {
  const [regionAndLanguageDrawerOpen, setRegionAndLanguageDrawerOpen] =
    useState(false);

  const { t } = useTranslation();

  const handleRegionAndLanguageDrawerOpen = () => {
    setRegionAndLanguageDrawerOpen(true);
  };

  const handleRegionAndLanguageDrawerClose = () => {
    setRegionAndLanguageDrawerOpen(false);
  };

  return (
    <>
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
      <RegionAndLanguageDrawer
        open={regionAndLanguageDrawerOpen}
        onClose={handleRegionAndLanguageDrawerClose}
      />
    </>
  );
};

export default RegionAndLanguage;
