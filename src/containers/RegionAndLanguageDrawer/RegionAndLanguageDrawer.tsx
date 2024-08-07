import { bindActionCreators } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

import { storeCommonAction } from "@/store";
import { commonConstants } from "@/utils/constants";
import { imageHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";
import { appStorageService } from "@/services";

import AppDrawer from "@/components/AppDrawer";
import AppDrawerTitle from "@/components/AppDrawerTitle";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppDrawerBody from "@/components/AppDrawerBody";
import AppIconButton from "@/components/AppIconButton";
import AppListItemText from "@/components/AppListItemText";
import AppDrawerActions from "@/components/AppDrawerActions";
import AppButton from "@/components/AppButton";
import AppAutocomplete from "@/components/AppAutocomplete";
import AppSelect from "@/components/AppSelect";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import AppMenuItem from "@/components/AppMenuItem";
import AppDrawerTitleText from "@/components/AppDrawerTitleText";
import AppDrawerTitleIcon from "@/components/AppDrawerTitleIcon";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppAvatar from "@/components/AppAvatar";

import CloseIcon from "@@/public/images/icons/close.svg";
import CheckedIcon from "@@/public/images/icons/checked.svg";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./RegionAndLanguageDrawer.styles";

type RegionAndLanguageDrawerProps = {
  open?: boolean;
  onClose?: (event: React.SyntheticEvent) => void;
};

const RegionAndLanguageContent = (props: RegionAndLanguageDrawerProps) => {
  const { onClose = () => {} } = props;

  const { t, i18n } = useTranslation();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const $s_commonAction = useMemo(
    () => bindActionCreators(storeCommonAction, dispatch),
    [dispatch]
  );

  const $s_region = useAppSelector((state) => state.common.region);

  const $s_regions = useAppSelector((state) => state.common.regions);
  const $s_regionsLoading = useAppSelector(
    (state) => state.common.regionsLoading
  );

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [selectedRegion, setSelectedRegion] = useState($s_region);

  const { classes } = useStyles();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    $s_commonAction.setRegion(selectedRegion);
    window.NextPublic.lang = selectedLanguage as typeof window.NextPublic.lang;
    appStorageService.saveCookieLocale(selectedLanguage);
    onClose && onClose(event);
    if (
      selectedLanguage !== i18n.language ||
      selectedRegion?.id !== $s_region?.id
    )
      router.push(router, undefined, {
        locale: selectedLanguage,
      });
  };

  return (
    <>
      <AppDrawerTitle stickyHeader>
        <AppDrawerTitleText>{t("regionAndLanguage")}</AppDrawerTitleText>
        <AppDrawerTitleIcon position="end">
          <AppIconButton
            className={classes.titleIconButton}
            edge={"xy"}
            borderRadius="circular"
            color="text.primary"
            onClick={onClose}
          >
            <AppSvgIcon component={CloseIcon} />
          </AppIconButton>
        </AppDrawerTitleIcon>
      </AppDrawerTitle>
      <AppDrawerBody>
        <AppSelect
          value={selectedLanguage}
          label={t("language")}
          fullWidth
          bgColor="white"
          sx={{ marginBottom: 2.5 }}
          onChange={handleLanguageChange as any}
          renderValue={(value) =>
            commonConstants.languages.find(
              (language) => language.value === value
            )?.title || ""
          }
        >
          {commonConstants.languages.map((language, languageIndex) => (
            <AppSelectMenuItem key={languageIndex} value={language.value}>
              {language.title}
            </AppSelectMenuItem>
          ))}
        </AppSelect>
        <AppAutocomplete
          defaultInputProps={{
            label: t("location"),
            bgColor: "white",
            startAdornment: selectedRegion ? (
              <AppInputAdornment position="start">
                <AppAvatar
                  src={imageHelpers.appImageLoader({
                    src: selectedRegion.img_url,
                  })}
                  alt={`${selectedRegion.short_name} - ${commonConfig.DOCUMENT_TITLE}`}
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: 20,
                    bgcolor: "transparent",
                  }}
                >
                  {selectedRegion.flag}
                </AppAvatar>
              </AppInputAdornment>
            ) : undefined,
          }}
          disableClearable
          options={$s_regions}
          value={selectedRegion}
          loading={$s_regionsLoading}
          renderOption={(props, option, state) => {
            return (
              <AppMenuItem
                {...props}
                sx={{
                  color: state.selected ? "primary.main" : "text.primary",
                }}
              >
                <AppAvatar
                  src={imageHelpers.appImageLoader({
                    src: option?.img_url,
                  })}
                  alt={`${option?.short_name} - ${commonConfig.DOCUMENT_TITLE}`}
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: 24,
                    bgcolor: "transparent",
                    mr: 1.25,
                  }}
                >
                  {option?.flag}
                </AppAvatar>
                <AppListItemText
                  primary={option?.title}
                  primaryTypographyProps={{
                    variant: state.selected ? "bodyMed14" : "bodyReg14",
                    lineHeight: "20px",
                    color: "inherit",
                  }}
                />
                {state.selected && (
                  <AppSvgIcon
                    component={CheckedIcon}
                    sx={{
                      mr: "-4px",
                    }}
                    fontSize="small"
                  />
                )}
              </AppMenuItem>
            );
          }}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          getOptionLabel={(option) => `${option?.title}`}
          onChange={(_, region) => setSelectedRegion(region)}
        />
      </AppDrawerBody>
      <AppDrawerActions stickyFooter>
        <AppButton variant="contained" fullWidth onClick={handleSubmit}>
          {t("save")}
        </AppButton>
      </AppDrawerActions>
    </>
  );
};

const RegionAndLanguageDrawer = (props: RegionAndLanguageDrawerProps) => {
  const { open, onClose = () => {} } = props;

  return (
    <AppDrawer open={!!open} onClose={onClose as any}>
      <RegionAndLanguageContent {...props} />
    </AppDrawer>
  );
};

export default RegionAndLanguageDrawer;
