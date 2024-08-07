import _take from "lodash/take";
import { bindActionCreators } from "@reduxjs/toolkit";

import { appStorageService } from "@/services";

import {
  ButtonBase,
  ClickAwayListener,
  Grid,
  Grow,
  Popper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import LogoImage from "@/components/LogoImage";

import { imageHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";
import { storeCommonAction } from "@/store";

import AppAvatar from "@/components/AppAvatar";
import AppSelect from "@/components/AppSelect";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import MoreHorizIcon from "@@/public/images/icons/more-horiz.svg";
import CheckCirceIcon from "@@/public/images/icons/check-circle.svg";
import AppBadge from "@/components/AppBadge";
import PopperScrollingPaper from "@/components/PopperScrollingPaper";
import AppMenuList from "@/components/AppMenuList";
import AppListItem from "@/components/AppListItem";
import AppListItemText from "@/components/AppListItemText";
import AppSvgIcon from "@/components/AppSvgIcon";

import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";

import useStyles from "./GeneralActionBar.styles";

import type { FetchRegionsResponseData } from "@/utils/apis/common";

const MoreRegionMenuButton = <
  P extends Partial<FetchRegionsResponseData[number]>
>(props: {
  regions: P[];
  onRegionClick: (region: P) => () => void;
}) => {
  const { regions, onRegionClick } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = !!anchorEl;

  const { classes, theme, cx } = useStyles();

  const $s_region = useAppSelector((state) => state.common.region);

  const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = (event: React.SyntheticEvent) => {
    if (anchorEl && anchorEl.contains(event.target as any)) return;
    setAnchorEl(null);
  };

  const handleRegionClick = (region: P) => () => {
    setAnchorEl(null);
    onRegionClick(region)();
  };

  return (
    <>
      {regions.length > 0 && (
        <AppAvatar
          className={classes.regionAvatar}
          component={ButtonBase}
          onClick={handleToggle}
        >
          <AppSvgIcon component={MoreHorizIcon} fontSize="inherit" />
        </AppAvatar>
      )}
      <Popper
        anchorEl={anchorEl}
        open={open}
        placement="top"
        transition
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 40 - 26 + 10],
            },
          },
        ]}
        style={{
          zIndex: theme.zIndex.tooltip,
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose as any}>
            <Grow
              {...TransitionProps}
              timeout={theme.transitions.duration.shortest}
              style={{ transformOrigin: "50% 0 0" }}
            >
              <PopperScrollingPaper boxShadowVariant="menuPopper">
                <AppMenuList>
                  {regions.map((region) => (
                    <AppListItem
                      key={region.id}
                      disablePadding
                      sx={{ px: 1.25, py: 1.25 / 2 }}
                    >
                      <AppBadge
                        className={cx(
                          $s_region?.id === region?.id && classes.selected
                        )}
                        classes={{
                          badge: classes.regionBadge,
                        }}
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <AppSvgIcon
                            className={classes.regionAvatarCheckedCircleIcon}
                            component={CheckCirceIcon}
                          />
                        }
                      >
                        <AppAvatar
                          className={classes.regionAvatar}
                          src={imageHelpers.appImageLoader({
                            src: region.img_url,
                          })}
                          component={ButtonBase}
                          onClick={handleRegionClick(region)}
                        >
                          <Typography>{region.flag}</Typography>
                        </AppAvatar>
                      </AppBadge>
                    </AppListItem>
                  ))}
                </AppMenuList>
              </PopperScrollingPaper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

const RegionSelect = (props: { variant?: "desktop" | "mobile" }) => {
  const { variant = "desktop" } = props;

  const { classes, theme, cx } = useStyles();

  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const outsideMenuCount = isMdDown ? 4 : isLgDown ? 8 : 16;

  const dispatch = useAppDispatch();

  const $s_commonAction = useMemo(
    () => bindActionCreators(storeCommonAction, dispatch),
    [dispatch]
  );

  const $s_region = useAppSelector((state) => state.common.region);

  const $s_regions = useAppSelector((state) => state.common.regions);

  const outsideRegions = useMemo(() => {
    return _take([...$s_regions], outsideMenuCount);
  }, [$s_regions, outsideMenuCount]);

  const insideRegions = useMemo(() => {
    const results = [...$s_regions];
    results.splice(0, outsideMenuCount);
    return results;
  }, [$s_regions, outsideMenuCount]);

  const handleRegionClick = (region: (typeof $s_regions)[number]) => () => {
    $s_commonAction.setRegion(region);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regionId = event.target.value;
    const newRegion = $s_regions.find(
      (region) => region.id === Number(regionId)
    );
    $s_commonAction.setRegion(newRegion!);
  };

  return variant === "desktop" ? (
    <div className={classes.regionMenuList}>
      <MoreRegionMenuButton
        regions={insideRegions}
        onRegionClick={handleRegionClick}
      />
      {outsideRegions.map((region) => (
        <AppBadge
          className={cx($s_region?.id === region?.id && classes.selected)}
          classes={{
            badge: classes.regionBadge,
          }}
          key={region.id}
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <AppSvgIcon
              className={classes.regionAvatarCheckedCircleIcon}
              component={CheckCirceIcon}
            />
          }
        >
          <AppAvatar
            className={classes.regionAvatar}
            src={imageHelpers.appImageLoader({
              src: region.img_url,
            })}
            component={ButtonBase}
            onClick={handleRegionClick(region)}
          >
            {region.flag}
          </AppAvatar>
        </AppBadge>
      ))}
    </div>
  ) : (
    <AppSelect
      className={classes.appSelect}
      fullWidth
      bgColor="transparent"
      value={$s_region?.id}
      native={false}
      onChange={handleRegionChange as any}
    >
      {$s_regions.map((region, regionIndex) => (
        <AppSelectMenuItem native={false} key={regionIndex} value={region.id}>
          <AppListItemText
            primary={`${region.flag} ${region.title}`}
            primaryTypographyProps={{
              noWrap: true,
              whiteSpace: "nowrap",
            }}
            sx={{ m: 0 }}
          />
        </AppSelectMenuItem>
      ))}
    </AppSelect>
  );
};

const LanguageSelect = (props: { variant?: "desktop" | "mobile" }) => {
  const { variant = "desktop" } = props;

  const { i18n } = useTranslation();

  const router = useRouter();

  const { classes } = useStyles();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.NextPublic.lang = event.target.value as any;
    appStorageService.saveCookieLocale(event.target.value);
    router.push(router, undefined, {
      locale: event.target.value,
    });
  };

  return (
    <AppSelect
      className={classes.appSelect}
      fullWidth={variant === "mobile"}
      bgColor="transparent"
      value={i18n.language}
      onChange={handleLanguageChange as any}
      renderValue={(value) =>
        commonConstants.languages.find((language) => language.value === value)
          ?.title || ""
      }
      sx={{ minWidth: variant === "desktop" ? 140 : undefined }}
    >
      {commonConstants.languages.map((language, languageIndex) => (
        <AppSelectMenuItem key={languageIndex} value={language.value}>
          {language.title}
        </AppSelectMenuItem>
      ))}
    </AppSelect>
  );
};

const GeneralActionBar = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const curYear = new Date().getFullYear();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <div className={classes.root}>
      <AppContainer>
        {isTabletDown ? (
          <Grid container spacing={2.5} justifyContent="center">
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              gap={1.25}
            >
              <AppLink href="/help-center">{t("helpCenter")}</AppLink>
              <AppTypography>•</AppTypography>
              <AppLink href="/news">{t("news")}</AppLink>
            </Grid>
            <Grid item xs={6}>
              <RegionSelect variant="mobile" />
            </Grid>
            <Grid item xs={6}>
              <LanguageSelect variant="mobile" />
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems={"center"}
              gap={1.25}
            >
              <AppLink href="/" display={"flex"}>
                <LogoImage variant="logo" height={34} />
              </AppLink>
              <AppTypography textTransform="capitalize">
                {t("limitedWebAppCurYear", {
                  curYear,
                })}
              </AppTypography>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container columnSpacing={2.5} alignItems="center">
              <Grid item xs="auto" display="flex" alignItems="center">
                <AppLink href="/" display="flex">
                  <LogoImage variant="logo" height={34} />
                </AppLink>
                <AppTypography ml={1.25} textTransform="capitalize">
                  {t("limitedWebAppCurYear", {
                    curYear,
                  })}
                </AppTypography>
                <AppLink href="/help-center" ml={5}>
                  {t("helpCenter")}
                </AppLink>
                <AppTypography ml={1.25}>•</AppTypography>
                <AppLink href="/news" ml={1.25}>
                  {t("news")}
                </AppLink>
              </Grid>
              <Grid item xs>
                <div className={classes.regionAndLanguage}>
                  <RegionSelect />
                  <LanguageSelect />
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </AppContainer>
    </div>
  );
};

export default GeneralActionBar;
