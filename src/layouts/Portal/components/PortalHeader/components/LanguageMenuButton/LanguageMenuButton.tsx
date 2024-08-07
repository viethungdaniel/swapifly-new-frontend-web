import { commonConstants } from "@/utils/constants";
import { appStorageService } from "@/services";

import { Menu } from "@mui/material";
import AppMenuList from "@/components/AppMenuList";
import AppMenuItem from "@/components/AppMenuItem";
import AppPaper from "@/components/AppPaper";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppButton from "@/components/AppButton";

import ArrowDropDownIcon from "@@/public/images/icons/arrow-dropdown.svg";

import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";

import { useRouter } from "next/router";

import type { AppPaperProps } from "@/components/AppPaper";

const LanguageMenuButton = () => {
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] =
    useState<null | HTMLButtonElement>(null);
  const languageMenuOpen = !!languageMenuAnchorEl;

  const { i18n } = useTranslation();

  const router = useRouter();

  const language = useMemo(() => {
    return (
      commonConstants.languages.find((lang) => lang.value === i18n.language)
        ?.title || ""
    );
  }, [i18n.language]);

  const languages = commonConstants.languages;

  const handleLanguageMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setLanguageMenuAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  const handleLanguageChange = (languageValue: string) => () => {
    setLanguageMenuAnchorEl(null);
    window.NextPublic.lang = languageValue as typeof window.NextPublic.lang;
    appStorageService.saveCookieLocale(languageValue);
    languageValue !== i18n.language &&
      router.push(router, undefined, {
        locale: languageValue,
      });
  };

  return (
    <>
      <AppButton
        variant="text"
        color="text.primary"
        borderRadius="circular"
        edge="end"
        endIcon={
          <AppSvgIcon
            component={ArrowDropDownIcon}
            fontSize="inherit"
            sx={(theme) => ({
              rotate: languageMenuOpen ? "180deg" : "0deg",
              transition: theme.transitions.create(["rotate"], {
                duration: theme.transitions.duration.shorter,
              }),
            })}
          />
        }
        onClick={handleLanguageMenuOpen}
      >
        {language}
      </AppButton>
      <Menu
        slots={{
          paper: AppPaper,
        }}
        slotProps={{
          paper: {
            boxShadowVariant: "menuPopper",
            sx: {
              position: "absolute",
            },
          } as AppPaperProps,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={languageMenuOpen}
        anchorEl={languageMenuAnchorEl}
        component={AppMenuList}
        onClose={handleLanguageMenuClose}
      >
        {languages.map((languageOption) => (
          <AppMenuItem
            key={languageOption.id}
            value={languageOption.value}
            onClick={handleLanguageChange(languageOption.value)}
          >
            {languageOption.title}
          </AppMenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageMenuButton;
