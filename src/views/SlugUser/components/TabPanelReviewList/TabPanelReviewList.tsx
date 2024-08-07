import { bindActionCreators } from "redux";
import axios from "axios";

import { AppState, storeReviewAction } from "@/store";
import { commonConstants, reviewConstants } from "@/utils/constants";
import { commonHelpers, imageHelpers } from "@/utils/helpers";

import { Divider, Grid, Skeleton } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppToolbar from "@/components/AppToolbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import WindowInfiniteScrollLoader from "@/components/WindowInfiniteScrollLoader";
import NoSearchResults from "@/components/NoSearchResults";
import AppButton from "@/components/AppButton";
import AppLoading from "@/components/AppLoading";
import AppSelect from "@/components/AppSelect";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import AppChip from "@/components/AppChip";
import AppAvatar from "@/components/AppAvatar";
import AppImage from "@/components/AppImage";
import AppRating from "@/components/AppRating";
import AppInputAdornment from "@/components/AppInputAdornment";
import ReadMoreTypography from "@/components/ReadMoreTypography";

import StarIcon from "@@/public/images/icons/star.svg";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, useEventCallback } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./TabPanelReviewList.styles";

import type { CancelToken, CancelTokenSource } from "axios";

type ReviewItemProps = {
  loading?: boolean;
  review?: AppState["review"]["reviews"][0];
};

const PRODUCT_LIMIT = 8;

const ReviewItem = (props: ReviewItemProps) => {
  const { review, loading } = props;

  const { classes } = useStyles();

  const { t } = useTranslation();

  const typeLabel = t(
    reviewConstants.idToTypeItemMap[review?.type!]?.label ?? ""
  );
  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  return (
    <div className={classes.reviewItem}>
      {loading && (
        <Skeleton className={classes.reviewItemAvatar} variant="circular" />
      )}
      {!loading && (
        <AppAvatar
          className={classes.reviewItemAvatar}
          src={imageHelpers.appImageLoader({
            src: review?.avatar,
          })}
          imgProps={{ alt: review?.nickname }}
        />
      )}
      <div className={classes.reviewItemContent}>
        <div className={classes.reviewItemTitle}>
          {!!loading && (
            <AppTypography variant="bodyMed16" flex={1}>
              <Skeleton variant="text" sx={{ width: "50%" }} />
            </AppTypography>
          )}
          {!loading && (
            <>
              <AppTypography variant="bodyMed16">
                {review?.nickname}
              </AppTypography>
              <AppTypography
                component="span"
                color="text.secondary"
                whiteSpace="nowrap"
              >
                {review?.create_time}
              </AppTypography>
              <AppTypography component="span" color="text.secondary">
                •
              </AppTypography>
              <AppTypography
                component="span"
                color="text.secondary"
                whiteSpace="nowrap"
              >
                {typeLabel}
              </AppTypography>
            </>
          )}
        </div>
        {loading && (
          <AppTypography my={1.25}>
            <Skeleton variant="text" sx={{ width: "100%" }} />
          </AppTypography>
        )}
        {!loading && (
          <>
            <AppRating size="small" value={review?.num ?? 0} max={5} readOnly />
            <ReadMoreTypography my={1.25}>
              <AppTypography sx={{ whiteSpace: "break-spaces" }}>
                {review?.content}
              </AppTypography>
            </ReadMoreTypography>
            <div className={classes.reviewItemProductItem}>
              <AppImage
                className={classes.reviewItemProductItemPhoto}
                src={review?.image}
                loader={imageHelpers.appImageLoader}
                width={40}
                height={40}
              />
              <div>
                <AppTypography>{review?.title}</AppTypography>
                <AppTypography variant="bodyMed14">
                  {$s_regionCurrency}{" "}
                  {commonHelpers.formatNumber(review?.price)}
                </AppTypography>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ReviewList = () => {
  const $s_reviews = useAppSelector((state) => state.review.reviews);

  return (
    <Grid container>
      {$s_reviews.map((review) => (
        <Grid key={review.id} item xs={12}>
          <ReviewItem review={review} />
        </Grid>
      ))}
    </Grid>
  );
};

const TabPanelReviewList = () => {
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSortTypeId, setReviewSortTypeId] = useState(
    reviewConstants.LATEST_SORT_TYPE_ID
  );
  const [reviewTypeId, setReviewTypeId] = useState<EmptySafeNumber>("");

  const fetchReviewsSourceRef = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_reviewAction = useMemo(
    () => bindActionCreators(storeReviewAction, dispatch),
    [dispatch]
  );

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_reviewsLength = useAppSelector(
    (state) => state.review.reviews.length
  );
  const $s_reviewsCount = useAppSelector((state) => state.review.reviewsCount);
  const $s_reviewsLoading = useAppSelector(
    (state) => state.review.reviewsLoading
  );
  const $s_reviewsError = useAppSelector((state) => state.review.reviewsError);

  const $s_userStarPoint = useAppSelector(
    (state) => state.user.user?.shop?.point_average
  );
  const $s_userReviewCount = useAppSelector(
    (state) => state.user.user?.shop?.e_num
  );

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const canLoadMore = PRODUCT_LIMIT * reviewPage < $s_reviewsCount;
  const skeletonLoading = $s_reviewsLoading && reviewPage === 1;
  const isEmptyReview = !$s_reviewsLoading && $s_reviewsLength === 0;
  const scrollLoaderHasNextPage = useMemo(() => {
    return (
      !$s_reviewsLoading &&
      canLoadMore &&
      !$s_reviewsError &&
      reviewPage < commonConstants.FETCHED_MAXIMUM_PAGE
    );
  }, [$s_reviewsLoading, canLoadMore, reviewPage, $s_reviewsError]);

  const sortTypeItems = useMemo(() => {
    return Object.entries(reviewConstants.idToSortTypeItemMap).map(
      ([_, sortTypeItem]) => ({ ...sortTypeItem, label: t(sortTypeItem.label) })
    );
  }, [t]);

  const typeItems = useMemo(() => {
    return [
      {
        label: t("all"),
        value: "",
      },
      ...Object.entries(reviewConstants.idToTypeItemMap).map(
        ([_, typeItem]) => ({
          ...typeItem,
          label: t(typeItem.label),
        })
      ),
    ];
  }, [t]);

  const { classes, cx } = useStyles();

  const fetchReviews = useEventCallback(
    (payload?: {
      params?: {
        page?: number;
        type?: EmptySafeNumber;
        sort_type?: number;
      };
      cancelToken?: CancelToken;
      meta?: {
        isLoadMore?: boolean;
        isReset?: boolean;
      };
    }) => {
      if (!$s_userId) return;
      if (!fetchReviewsSourceRef.current) {
        fetchReviewsSourceRef.current = axios.CancelToken.source();
      }

      type FetchReviewParams = NonNullable<
        Parameters<typeof $s_reviewAction.fetchReviewsSaga>[0]
      >["params"];

      let outerParams = commonHelpers.prepareRequestParams<
        Partial<FetchReviewParams>
      >({
        page: payload?.params?.page,
        type: payload?.params?.type,
        sort_type: payload?.params?.sort_type,
      });

      const curParams = commonHelpers.prepareRequestParams<FetchReviewParams>(
        {
          limit: PRODUCT_LIMIT,
          page: reviewPage,
          sort_type: reviewSortTypeId,
          type: reviewTypeId,
          ...outerParams,
          user_id: $s_userId!,
        },
        { enableClearEmptyValue: true }
      );

      $s_reviewAction.fetchReviewsSaga(
        {
          params: curParams,
          cancelToken: fetchReviewsSourceRef.current.token,
        },
        {
          isReset: payload?.meta?.isReset,
          isLoadMore: payload?.meta?.isLoadMore,
        }
      );
    }
  );

  const handleLoadMore = () => {
    const newReviewPage = reviewPage + 1;
    setReviewPage(newReviewPage);
    fetchReviews({
      params: {
        page: newReviewPage,
      },
      meta: {
        isLoadMore: true,
      },
    });
  };

  const handleReviewSortTypeIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newReviewSortTypeId = parseInt(event.target.value);
    setReviewSortTypeId(newReviewSortTypeId);
    fetchReviews({
      params: {
        page: 1,
        sort_type: newReviewSortTypeId,
      },
      meta: {
        isReset: true,
      },
    });
  };

  const handleReviewTypeIdChange =
    (typeItemId: EmptySafeNumber) => (_: any) => {
      setReviewTypeId(typeItemId);
      fetchReviews({
        params: {
          page: 1,
          type: typeItemId,
        },
        meta: {
          isReset: true,
        },
      });
    };

  useEffect(() => {
    setReviewPage(1);
    fetchReviews({
      params: {
        page: 1,
      },
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchReviewsSourceRef.current?.cancel &&
        fetchReviewsSourceRef.current.cancel();
      fetchReviewsSourceRef.current = null;
    };
  }, [$s_userId, $s_hasAuth]);

  return (
    <div>
      <AppToolbar>
        <AppTypography className={classes.title} variant="titleSemi20" noWrap>
          <span>{t("reviews")}</span>
        </AppTypography>
        <AppSelect
          className={classes.sortTypeSelect}
          bgColor="common.lighterNeutral"
          borderRadius="circular"
          value={reviewSortTypeId}
          displayEmpty
          startAdornment={
            <AppInputAdornment position="start">
              <AppTypography component="span" color="text.secondary">
                {t("sortBy")}:
              </AppTypography>
            </AppInputAdornment>
          }
          renderValue={(value) => {
            return (
              <AppTypography
                component="span"
                variant="bodyMed14"
                color="text.primary"
                lineHeight={1}
              >
                {t(reviewConstants.idToSortTypeItemMap[value]?.label ?? "")}
              </AppTypography>
            );
          }}
          onChange={handleReviewSortTypeIdChange as any}
        >
          {sortTypeItems.map((sortTypeItem) => (
            <AppSelectMenuItem
              key={sortTypeItem.value}
              value={sortTypeItem.value}
            >
              {sortTypeItem.label}
            </AppSelectMenuItem>
          ))}
        </AppSelect>
      </AppToolbar>
      <Divider className={classes.titleDivider} />
      <AppToolbar className={classes.reviewToolbar}>
        <div className={classes.reviewToolbarState}>
          <AppTypography
            className={classes.reviewToolbarStateStarPoint}
            component="div"
            variant="headerSemi35"
          >
            {commonHelpers.formatNumber($s_userStarPoint || 0)}
            <AppSvgIcon
              component={StarIcon}
              color="common.starYellow"
              fontSize="small"
            />
          </AppTypography>
          <AppTypography>
            {!!$s_userReviewCount
              ? `(${t("reviewWithCount", {
                  count: $s_userReviewCount,
                })})`
              : t("noReviewsYet")}
          </AppTypography>
        </div>
        <div className={classes.reviewToolbarTypeChip}>
          {typeItems.map((typeItem) => {
            const selected = typeItem?.value === reviewTypeId;
            return (
              <AppChip
                classes={{
                  root: cx(classes.typeItemChip, selected && classes.selected),
                }}
                key={typeItem.value}
                label={typeItem.label}
                variant="outlined"
                color="common.lightNeutral"
                textColor="text.primary"
                borderRadius="circular"
                onClick={handleReviewTypeIdChange(
                  typeItem.value as EmptySafeNumber
                )}
              />
            );
          })}
        </div>
      </AppToolbar>
      <AppContainer>
        <LoadingSkeleton
          loading={skeletonLoading}
          count={PRODUCT_LIMIT}
          variant="custom"
          customSkeleton={<ReviewItem loading />}
          keepMounted
          GridContainerProps={{ spacing: 0 }}
          GridItemProps={{ xs: 12 }}
        >
          {!isEmptyReview && (
            <WindowInfiniteScrollLoader
              hasNextPage={scrollLoaderHasNextPage}
              threshold={60}
              onNextPageLoad={handleLoadMore}
            >
              <ReviewList />
            </WindowInfiniteScrollLoader>
          )}
          {isEmptyReview && (
            <div className={classes.noSearchResults}>
              <NoSearchResults variant="reviews" />
            </div>
          )}
          {$s_reviewsLoading ||
            !!$s_reviewsError ||
            (!$s_reviewsLoading && canLoadMore && !$s_reviewsError && (
              <div className={classes.actions}>
                {($s_reviewsLoading || !!$s_reviewsError) && (
                  <AppLoading variant="circular" size={40} />
                )}
                {!$s_reviewsLoading && canLoadMore && !$s_reviewsError && (
                  <AppButton
                    variant="outlined"
                    color="text.primary"
                    onClick={handleLoadMore}
                  >
                    {t("loadMore")}
                  </AppButton>
                )}
              </div>
            ))}
        </LoadingSkeleton>
      </AppContainer>
    </div>
  );
};

export default TabPanelReviewList;
