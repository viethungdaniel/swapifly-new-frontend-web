import { commonHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";

import { Divider, Grid } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppContent from "@/components/AppContent";
import AppLink from "@/components/AppLink";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppIconButton from "@/components/AppIconButton";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import HtmlParser from "@/components/HtmlParser";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemText from "@/components/AppListItemText";
import AppStickyBox from "@/components/AppStickyBox";

import SearchIcon from "@@/public/images/icons/search.svg";

import { useAppMomentWithLocale, useAppSelector } from "@/hooks";
import { Fragment, useState } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const SearchForm = () => {
  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const [keyword, setKeyword] = useState("");

  const handleSearchFormSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    router.push({
      pathname: `/help-center/search`,
      query: {
        keyword,
        ...navigatedQuery,
      },
    });
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <AppTextField
      value={keyword}
      fullWidth
      required
      bgColor="common.lighterNeutral"
      borderRadius="circular"
      placeholder={t("searchForArticles")}
      endAdornment={
        <AppInputAdornment position="end">
          <AppIconButton
            edge="end"
            color="text.primary"
            borderRadius="circular"
            type="submit"
          >
            <AppSvgIcon component={SearchIcon} fontSize="inherit" />
          </AppIconButton>
        </AppInputAdornment>
      }
      FormControlProps={{
        component: "form",
        onSubmit: handleSearchFormSubmit,
      }}
      onChange={handleKeywordChange}
    />
  );
};

const HelpCenterSlug = () => {
  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const $s_helpCenter = useAppSelector((state) => state.helpCenter.helpCenter);

  return (
    <>
      <div>
        <AppContainer>
          <AppContent>
            <Grid container spacing={2.5}>
              <Grid item xs={12} tablet={8}>
                <AppTypography variant="headerSemi35">
                  {t("articles")}
                </AppTypography>
              </Grid>
              <Grid item xs={12} tablet={4} display="flex" alignItems="center">
                <SearchForm />
              </Grid>
              <Grid item xs={12} tablet={8}>
                <AppBreadcrumbs sx={{ mb: 2.5 }}>
                  <AppLink
                    href={{
                      pathname: "/help-center",
                      query: {
                        ...navigatedQuery,
                      },
                    }}
                    color="text.secondary"
                  >
                    {t("helpCenter")}
                  </AppLink>
                  {$s_helpCenter?.help_center?.category?.parent && (
                    <AppTypography color="text.secondary">
                      {$s_helpCenter?.help_center?.category?.parent?.title}
                    </AppTypography>
                  )}
                  {$s_helpCenter?.help_center?.category && (
                    <AppTypography color="text.primary">
                      {$s_helpCenter?.help_center?.category?.title}
                    </AppTypography>
                  )}
                </AppBreadcrumbs>
                <AppTypography mb={0.5}>
                  {$s_helpCenter?.help_center?.create_time &&
                    momentWithLocaleByCurrentTz(
                      $s_helpCenter!.help_center!.create_time,
                      "X"
                    ).format("YYYY-MM-DD HH:mm:ss")}
                </AppTypography>
                <AppTypography variant="titleSemi20" mb={0.5}>
                  {$s_helpCenter?.help_center?.title}
                </AppTypography>
                <HtmlParser html={$s_helpCenter?.help_center?.details ?? ""} />
              </Grid>
              <Grid item xs={12} sx={{ display: { tablet: "none" } }}>
                <Divider />
              </Grid>
              <Grid item xs={12} tablet={4}>
                <AppStickyBox
                  thresholdTopEle={`#${commonConstants.PORTAL_HEADER_ELE_ID}`}
                  offsetTop={20}
                >
                  <AppList disablePadding>
                    <AppListItem sx={{ px: 0 }}>
                      <AppListItemText
                        primary={t("articlesOnSameTopic")}
                        primaryTypographyProps={{
                          variant: "bodySemi16",
                        }}
                        sx={{ m: 0 }}
                      />
                    </AppListItem>
                    {($s_helpCenter?.same_topic ?? []).map((sameTopic) => (
                      <Fragment key={sameTopic.id}>
                        <AppListItem
                          sx={{ py: 0, px: 0, height: 0, minHeight: 0 }}
                        >
                          <Divider sx={{ width: "100%" }} />
                        </AppListItem>
                        <AppListItem
                          component={AppLink}
                          href={{
                            pathname: `/help-center/${commonHelpers.generateSlug(
                              sameTopic.title,
                              sameTopic.id
                            )}`,
                            query: {
                              ...navigatedQuery,
                            },
                          }}
                          underline="none"
                          sx={{ px: 0 }}
                        >
                          <AppListItemText primary={sameTopic.title} />
                        </AppListItem>
                      </Fragment>
                    ))}
                    {($s_helpCenter?.same_topic ?? []).length < 1 && (
                      <>
                        <Divider />
                        <AppListItem sx={{ px: 0 }}>
                          <AppListItemText
                            primary={t("noSameTopicYet")}
                            primaryTypographyProps={{
                              color: "text.secondary",
                            }}
                          />
                        </AppListItem>
                      </>
                    )}
                  </AppList>
                </AppStickyBox>
              </Grid>
            </Grid>
          </AppContent>
        </AppContainer>
      </div>
    </>
  );
};

export default HelpCenterSlug;
