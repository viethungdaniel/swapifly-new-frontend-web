import axios from "axios";
import { bindActionCreators } from "redux";

import { commonHelpers, imageHelpers } from "@/utils/helpers";
import { storeNewsItemAction } from "@/store";
import { commonConstants } from "@/utils/constants";

import { Box, Divider, Grid, Skeleton, useMediaQuery } from "@mui/material";
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
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AppImage from "@/components/AppImage";
import AppButton from "@/components/AppButton";
import AppSwiper from "@/components/AppSwiper";
import { SwiperSlide } from "swiper/react";

import SearchIcon from "@@/public/images/icons/search.svg";
import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import {
  useAppDispatch,
  useAppMomentWithLocale,
  useAppSelector,
} from "@/hooks";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import useStyles from "./NewsSlug.styles";

import type { CancelTokenSource } from "axios";

type NewsSlugProps = {
  newsItemId: number;
};

const FetchData = (props: Pick<NewsSlugProps, "newsItemId">) => {
  const { newsItemId } = props;

  const fetchRecentNewsItemsSource = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_newsItemAction = useMemo(
    () => bindActionCreators(storeNewsItemAction, dispatch),
    [dispatch]
  );

  useEffect(() => {
    fetchRecentNewsItemsSource.current = axios.CancelToken.source();

    $s_newsItemAction.fetchRecentNewsItemsSaga(
      {
        params: {
          ignored_news_id: newsItemId,
        },
        cancelToken: fetchRecentNewsItemsSource.current.token,
      },
      {
        isReset: true,
      }
    );
    return () => {
      fetchRecentNewsItemsSource.current!.cancel();
      fetchRecentNewsItemsSource.current!.cancel();

      fetchRecentNewsItemsSource.current = null;
    };
  }, [newsItemId]);

  return null;
};

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
    if (!keyword) return;
    router.push({
      pathname: `/news`,
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
      placeholder={t("searchForNews")}
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

const RecentNewsItems = () => {
  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const $s_recentNewsItems = useAppSelector(
    (state) => state.newsItem.recentNewsItems
  );
  const $s_recentNewsItemsLoading = useAppSelector(
    (state) => state.newsItem.recentNewsItemsLoading
  );
  const $s_recentNewsItemsError = useAppSelector(
    (state) => state.newsItem.recentNewsItemsError
  );

  return (
    <AppStickyBox
      thresholdTopEle={`#${commonConstants.PORTAL_HEADER_ELE_ID}`}
      offsetTop={20}
    >
      <AppList disablePadding>
        <AppListItem sx={{ px: 0 }}>
          <AppListItemText
            primary={t("recentNews")}
            primaryTypographyProps={{
              variant: "bodySemi16",
            }}
          />
        </AppListItem>
        <LoadingSkeleton
          count={3}
          loading={$s_recentNewsItemsLoading || !!$s_recentNewsItemsError}
          variant="custom"
          customSkeleton={
            <>
              <AppListItem sx={{ py: 0, height: 0, minHeight: 0 }}>
                <Divider sx={{ width: "100%" }} />
              </AppListItem>
              <AppListItem sx={{ px: 0 }}>
                <Skeleton variant="text" sx={{ width: "100%" }} />
              </AppListItem>
            </>
          }
          GridItemProps={{
            xs: 12,
          }}
        >
          {$s_recentNewsItems.map((recentNewsItem) => (
            <Fragment key={recentNewsItem.id}>
              <AppListItem sx={{ py: 0, px: 0, height: 0, minHeight: 0 }}>
                <Divider sx={{ width: "100%" }} />
              </AppListItem>
              <AppListItem
                component={AppLink}
                href={{
                  pathname: `/news/${commonHelpers.generateSlug(
                    recentNewsItem.title,
                    recentNewsItem.id
                  )}`,
                  query: {
                    ...navigatedQuery,
                  },
                }}
                underline="none"
                sx={{ px: 0 }}
              >
                <AppListItemText primary={recentNewsItem.title} />
              </AppListItem>
            </Fragment>
          ))}
          {$s_recentNewsItems.length < 1 && (
            <>
              <Divider />
              <AppListItem sx={{ px: 0 }}>
                <AppListItemText
                  primary={t("noRecentNewsYet")}
                  primaryTypographyProps={{
                    color: "text.secondary",
                  }}
                />
              </AppListItem>
            </>
          )}
        </LoadingSkeleton>
      </AppList>
    </AppStickyBox>
  );
};

const RecentNewsSwiper = () => {
  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const $s_recentNewsItems = useAppSelector(
    (state) => state.newsItem.recentNewsItems
  );
  const $s_recentNewsItemsLoading = useAppSelector(
    (state) => state.newsItem.recentNewsItemsLoading
  );
  const $s_recentNewsItemsError = useAppSelector(
    (state) => state.newsItem.recentNewsItemsError
  );

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const { classes, theme } = useStyles();

  return (
    <>
      <div className={classes.recentNewsSwiperTitle}>
        <AppTypography variant="bodySemi16" noWrap>
          {t("recentNews")}
        </AppTypography>
        {!$s_recentNewsItemsLoading && $s_recentNewsItems.length > 0 && (
          <AppButton
            size="small"
            edge="xy"
            component={AppLink}
            href={{
              pathname: "/news",
              query: {
                ...navigatedQuery,
              },
            }}
            underline="none"
            hoverColor="none"
          >
            {t("more")}
          </AppButton>
        )}
      </div>
      {!$s_recentNewsItemsLoading && $s_recentNewsItems.length < 1 ? (
        <AppTypography align="center" color="text.secondary" py={2.5}>
          {t("noRecentNewsYet")}
        </AppTypography>
      ) : (
        <AppSwiper
          slidesPerView={2}
          spaceBetween={parseInt(theme.spacing(2.5))}
          navigation={{
            enabled: true,
          }}
          breakpoints={{
            [theme.breakpoints.values.sm]: {
              slidesPerView: 3,
            },
          }}
        >
          {$s_recentNewsItemsLoading || !!$s_recentNewsItemsError
            ? [...Array.from(Array(3)).keys()].map((key) => (
                <SwiperSlide
                  key={key}
                  className={classes.recentNewsSwiperSlide}
                >
                  <div className={classes.recentNewsSwiperSlideThumbnail}>
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  <AppTypography>
                    <Skeleton
                      variant="text"
                      sx={{ width: 120, maxWidth: "100%" }}
                    />
                  </AppTypography>
                  <AppTypography>
                    <Skeleton variant="text" />
                  </AppTypography>
                </SwiperSlide>
              ))
            : $s_recentNewsItems.map((recentNewsItem, recentNewsItemIndex) => (
                <SwiperSlide key={recentNewsItemIndex}>
                  <AppLink
                    className={classes.recentNewsSwiperSlide}
                    href={{
                      pathname: `/news/${commonHelpers.generateSlug(
                        recentNewsItem.title,
                        recentNewsItem.id
                      )}`,
                      query: {
                        ...navigatedQuery,
                      },
                    }}
                    underline="none"
                  >
                    <div className={classes.recentNewsSwiperSlideThumbnail}>
                      <AppImage
                        src={recentNewsItem.img}
                        loader={imageHelpers.appImageLoader}
                        fill
                        alt={recentNewsItem.title}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <AppTypography color="text.secondary">
                      {!!recentNewsItem.news_time &&
                        momentWithLocaleByCurrentTz(
                          recentNewsItem.news_time,
                          "X"
                        ).format("YYYY-MM-DD")}
                    </AppTypography>
                    <AppTypography>{recentNewsItem.title}</AppTypography>
                  </AppLink>
                </SwiperSlide>
              ))}
        </AppSwiper>
      )}
    </>
  );
};

const NewsSlug = (props: NewsSlugProps) => {
  const { newsItemId } = props;

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const $s_newsItem = useAppSelector((state) => state.newsItem.newsItem);

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <>
      <FetchData newsItemId={newsItemId} />
      <div>
        <AppContainer>
          <AppContent>
            <Grid container spacing={2.5}>
              <Grid item xs={12} tablet={8}>
                <AppTypography variant="headerSemi35">
                  {t("news")}
                </AppTypography>
              </Grid>
              <Grid item xs={12} tablet={4} display="flex" alignItems="center">
                <SearchForm />
              </Grid>
              <Grid item xs={12} tablet={8}>
                <AppBreadcrumbs sx={{ mb: 2.5 }}>
                  <AppLink
                    href={{
                      pathname: "/news",
                      query: {
                        ...navigatedQuery,
                      },
                    }}
                    color="text.secondary"
                  >
                    {t("news")}
                  </AppLink>
                  {$s_newsItem?.news?.title && (
                    <AppTypography color="text.primary">
                      {$s_newsItem.news.title}
                    </AppTypography>
                  )}
                </AppBreadcrumbs>
                {!!$s_newsItem?.news?.img && (
                  <AppImage
                    className={classes.thumbnail}
                    src={$s_newsItem?.news?.img}
                    loader={imageHelpers.appImageLoader}
                    width={500}
                    height={500}
                  />
                )}

                <AppTypography mb={0.5}>
                  {$s_newsItem?.news?.news_time &&
                    momentWithLocaleByCurrentTz(
                      $s_newsItem.news.news_time,
                      "X"
                    ).format("YYYY-MM-DD HH:mm:ss")}
                </AppTypography>
                <AppTypography variant="titleSemi20" mb={0.5}>
                  {$s_newsItem?.news?.title}
                </AppTypography>
                <HtmlParser html={$s_newsItem?.news?.details ?? ""} />

                <Divider sx={{ my: 2.5 }} />
                <RecentNewsSwiper />
                <Divider sx={{ my: 2.5 }} />

                <div className={classes.prevNextArticleNavigation}>
                  {$s_newsItem?.addition_news?.previous?.id && (
                    <div className={classes.prevNextArticleNavigationActions}>
                      <Box display="flex" justifyContent="flex-start">
                        <AppButton
                          variant="text"
                          color="text.secondary"
                          startIcon={
                            <AppSvgIcon
                              component={ArrowLeftIcon}
                              fontSize="inherit"
                            />
                          }
                          edge="start"
                          size="small"
                          component={AppLink}
                          href={{
                            pathname: `/news/${commonHelpers.generateSlug(
                              $s_newsItem.addition_news.previous.title,
                              $s_newsItem.addition_news.previous.id
                            )}`,
                            query: {
                              ...navigatedQuery,
                            },
                          }}
                          underline="none"
                          hoverColor="none"
                          noWrap
                        >
                          {t("previousArticle")}
                        </AppButton>
                      </Box>
                      <AppTypography noWrap>
                        {$s_newsItem.addition_news.previous.title}
                      </AppTypography>
                    </div>
                  )}
                  <Box flex={1} />
                  {$s_newsItem?.addition_news?.next?.id && (
                    <div className={classes.prevNextArticleNavigationActions}>
                      <Box display="flex" justifyContent="flex-end">
                        <AppButton
                          variant="text"
                          color="text.secondary"
                          endIcon={
                            <AppSvgIcon
                              component={ArrowRightIcon}
                              fontSize="inherit"
                            />
                          }
                          edge="end"
                          size="small"
                          component={AppLink}
                          href={{
                            pathname: `/news/${commonHelpers.generateSlug(
                              $s_newsItem.addition_news.next.title,
                              $s_newsItem.addition_news.next.id
                            )}`,
                            query: {
                              ...navigatedQuery,
                            },
                          }}
                          underline="none"
                          hoverColor="none"
                          noWrap
                        >
                          {t("nextArticle")}
                        </AppButton>
                      </Box>
                      <AppTypography noWrap>
                        {$s_newsItem.addition_news.next.title}
                      </AppTypography>
                    </div>
                  )}
                </div>
              </Grid>
              {!isTabletDown && (
                <Grid item xs={12} tablet={4}>
                  <RecentNewsItems />
                </Grid>
              )}
            </Grid>
          </AppContent>
        </AppContainer>
      </div>
    </>
  );
};

export default NewsSlug;
