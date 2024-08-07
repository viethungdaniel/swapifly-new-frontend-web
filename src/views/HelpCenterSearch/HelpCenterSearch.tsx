import axios from "axios";
import { bindActionCreators } from "redux";

import { storeHelpCenterAction } from "@/store";
import { commonHelpers } from "@/utils/helpers";

import { Divider, Skeleton } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppContent from "@/components/AppContent";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppPagination from "@/components/AppPagination";
import AppTypography from "@/components/AppTypography";
import PortalHelpCenterHeader from "@/components/PortalHelpCenterHeader";
import NoSearchResults from "@/components/NoSearchResults";
import AppLink from "@/components/AppLink";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import LoadingSkeleton from "@/components/LoadingSkeleton";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import useStyles from "./HelpCenterSearch.styles";

import type { FetchHelpCentersSagaAction } from "@/store/helpCenter/types";
import type { AppPaginationProps } from "@/components/AppPagination/AppPagination";
import type { CancelTokenSource } from "axios";
import type { HelpCenterSearchProps as PageHelpCenterSearchProps } from "@/pages/help-center/search";

type HelpCenterSearchProps = PageHelpCenterSearchProps;

const HELP_CENTERS_LIMIT = 16;

const HelpCenterSearch = (props: HelpCenterSearchProps) => {
  const { query } = props;

  const [helpCentersPage, setHelpCentersPage] = useState(
    commonHelpers.isNumber(query.page) ? Number(query.page) : 1
  );
  const curQueryPageRef = useRef<number | string>(query.page);

  const fetchHelpCentersSource = useRef<CancelTokenSource | null>(null);

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const $s_helpCenterAction = useMemo(
    () => bindActionCreators(storeHelpCenterAction, dispatch),
    [dispatch]
  );

  const $s_helpCenters = useAppSelector(
    (state) => state.helpCenter.helpCenters
  );
  const $s_helpCentersCount = useAppSelector(
    (state) => state.helpCenter.helpCentersCount
  );
  const $s_helpCentersLoading = useAppSelector(
    (state) => state.helpCenter.helpCentersLoading
  );
  const $s_helpCentersError = useAppSelector(
    (state) => state.helpCenter.helpCentersError
  );

  const fetchHelpCenters = useEventCallback(
    (payload?: { params: { page?: number; keyword?: string } }) => {
      fetchHelpCentersSource.current?.cancel &&
        fetchHelpCentersSource.current.cancel();
      fetchHelpCentersSource.current = axios.CancelToken.source();

      let outerParams = commonHelpers.prepareRequestParams<
        NonNullable<FetchHelpCentersSagaAction["payload"]>["params"]
      >({
        page: payload?.params?.page!,
        query: payload?.params?.keyword!,
      });

      const curParams = commonHelpers.prepareRequestParams<
        NonNullable<FetchHelpCentersSagaAction["payload"]>["params"]
      >({
        page: helpCentersPage,
        query: query.keyword,
        ...outerParams,
        limit: HELP_CENTERS_LIMIT,
      });

      $s_helpCenterAction.fetchHelpCentersSaga({
        params: curParams,
        cancelToken: fetchHelpCentersSource.current.token,
      });
    }
  );

  const handleHelpCentersPaginationChange: AppPaginationProps["onChange"] = (
    _,
    newPage
  ) => {
    if (newPage !== helpCentersPage) {
      curQueryPageRef.current = `${newPage}`;
      setHelpCentersPage(newPage);
      fetchHelpCenters({
        params: {
          page: newPage,
        },
      });
      router.push(
        {
          pathname: `/help-center/search`,
          query: {
            keyword: query.keyword,
            page: newPage,
            ...navigatedQuery,
          },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }

    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    if (!isMounted()) return;
    curQueryPageRef.current = "1";
    setHelpCentersPage(1);
    fetchHelpCenters({
      params: {
        keyword: query.keyword,
        page: 1,
      },
    });
    router.push({
      pathname: `/help-center/search`,
      query: {
        keyword: query.keyword,
        page: 1,
        ...navigatedQuery,
      },
    });
  }, [query.keyword]);

  useEffect(() => {
    if (!isMounted()) return;
    if (
      query.page !== curQueryPageRef.current &&
      commonHelpers.isNumber(query.page)
    ) {
      const newPage = Number(query.page);
      setHelpCentersPage(newPage);
      fetchHelpCenters({
        params: {
          page: newPage,
        },
      });
    }
  }, [query.page]);

  useEffect(() => {
    fetchHelpCenters();
    return () => {
      fetchHelpCentersSource.current?.cancel &&
        fetchHelpCentersSource.current.cancel();
      fetchHelpCentersSource.current = null;
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <div>
      <PortalHelpCenterHeader />
      <AppContainer>
        <AppContent>
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
            <AppTypography color="text.primary">
              {t("searchResultsForKeyword", {
                keyword: query.keyword,
              })}
            </AppTypography>
          </AppBreadcrumbs>
          <AppTypography variant="titleSemi20" mb={2.5}>
            {t("countSearchResultsForKeywordWithCount", {
              count: $s_helpCentersCount ?? 0,
              keyword: query.keyword,
            })}
          </AppTypography>
          <LoadingSkeleton
            loading={$s_helpCentersLoading || !!$s_helpCentersError}
            variant="custom"
            count={HELP_CENTERS_LIMIT}
            customSkeleton={
              <Fragment>
                <AppListItem>
                  <Skeleton variant="text" sx={{ width: "100%" }} />
                </AppListItem>
                <AppListItem sx={{ py: 0, height: 0, minHeight: 0 }}>
                  <Divider sx={{ width: "100%" }} />
                </AppListItem>
              </Fragment>
            }
            GridItemProps={{
              xs: 12,
            }}
          >
            {$s_helpCenters.length > 0 ? (
              <AppList disablePadding edge="x">
                {$s_helpCenters.map((helpCenter) => (
                  <Fragment key={helpCenter.id}>
                    <AppListItem
                      component={AppLink}
                      href={{
                        pathname: `/help-center/${commonHelpers.generateSlug(
                          helpCenter.title,
                          helpCenter.id
                        )}`,
                        query: {
                          ...navigatedQuery,
                        },
                      }}
                      underline="none"
                    >
                      {helpCenter.title}
                    </AppListItem>
                    <AppListItem sx={{ py: 0, height: 0, minHeight: 0 }}>
                      <Divider sx={{ width: "100%" }} />
                    </AppListItem>
                  </Fragment>
                ))}
              </AppList>
            ) : (
              <NoSearchResults />
            )}
          </LoadingSkeleton>
          {Math.ceil($s_helpCentersCount / HELP_CENTERS_LIMIT) > 1 && (
            <div className={classes.pagination}>
              <AppPagination
                page={helpCentersPage}
                count={Math.ceil($s_helpCentersCount / HELP_CENTERS_LIMIT)}
                onChange={handleHelpCentersPaginationChange}
              />
            </div>
          )}
        </AppContent>
      </AppContainer>
    </div>
  );
};

export default HelpCenterSearch;
