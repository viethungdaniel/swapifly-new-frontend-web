import axios from "axios";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import { storeUserAction } from "@/store";
import {
  axiosHelpers,
  commonHelpers,
  imageHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import { commonConstants, userConstants } from "@/utils/constants";

import { Divider, Skeleton } from "@mui/material";
import AppAvatar from "@/components/AppAvatar";
import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppLoading from "@/components/AppLoading";
import AppTypography from "@/components/AppTypography";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppLink from "@/components/AppLink";
import NoSearchResults from "@/components/NoSearchResults";
import AppContent from "@/components/AppContent/AppContent";
import AppSvgIcon from "@/components/AppSvgIcon";
import WindowInfiniteScrollLoader from "@/components/WindowInfiniteScrollLoader";

import CheckedIcon from "@@/public/images/icons/checked.svg";

import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  useAppDispatch,
  useAppSelector,
  useAuthUser,
  useIsMounted,
} from "@/hooks";

import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";

import useStyles from "./UserSearch.styles";

import type { AppState } from "@/store";
import type { CancelTokenSource } from "axios";
import type { FollowUserSagaAction } from "@/store/user/types";

const FETCHED_USER_LIMIT = 8;

const FollowButton = (
  props: { isFollowed?: boolean } & React.ComponentProps<typeof AppButton>
) => {
  const { isFollowed, ...rest } = props;

  const { t } = useTranslation();

  return (
    <AppButton
      {...rest}
      variant={isFollowed ? "contained" : "outlined"}
      color="primary"
      startIcon={
        isFollowed && <AppSvgIcon component={CheckedIcon} fontSize="inherit" />
      }
    >
      {t(!isFollowed ? "follow" : "followed")}
    </AppButton>
  );
};

const UserItem = memo(
  (props: {
    user?: AppState["user"]["users"][number];
    skeletonLoading?: boolean;
  }) => {
    const { user, skeletonLoading } = props;

    const followUserSourceRef = useRef<CancelTokenSource | null>(null);

    const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

    const { classes } = useStyles();

    const userLink = `/${commonHelpers.generateUserSlug(user)}`;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const $s_userAction = useMemo(
      () => bindActionCreators(storeUserAction, dispatch),
      [dispatch]
    );

    const $s_authUserId = useAppSelector((state) => state.auth.user?.id);

    const followUser = async (payload: FollowUserSagaAction["payload"]) => {
      const response = await reduxHelpers.callActionWithPromise(
        $s_userAction.followUserSaga,
        {
          ...payload,
        }
      );
      if (!isMounted()) return;
      if (!axiosHelpers.checkRequestSuccess(response)) {
        toast.error(response.message);
      }
    };

    const handleFollowedChange = () => {
      if (!hasAuth) {
        openSignInAndSignUpDialog();
        return;
      }

      followUserSourceRef.current?.cancel &&
        followUserSourceRef.current.cancel();
      followUserSourceRef.current = axios.CancelToken.source();

      followUser({
        params: {
          user_id: user?.id!,
          state: !!!user?.isfollow
            ? userConstants.FOLLOW_ID
            : userConstants.UN_FOLLOW_ID,
        },
      });
    };

    useEffect(() => {
      return () => {
        followUserSourceRef.current?.cancel &&
          followUserSourceRef.current.cancel();
      };
    }, []);

    const isMounted = useIsMounted();

    return (
      <div className={classes.userItem}>
        {skeletonLoading ? (
          <Skeleton variant="circular" className={classes.userItemAvatar} />
        ) : (
          <AppAvatar
            className={classes.userItemAvatar}
            src={imageHelpers.appImageLoader({
              src: user?.avatar,
            })}
            component={AppLink}
            href={userLink}
          />
        )}

        <div className={classes.userItemContent}>
          <div className={classes.userItemContentName}>
            {skeletonLoading ? (
              <Skeleton variant="text" sx={{ width: "50%" }} />
            ) : (
              <AppLink href={userLink} variant="bodyMed16">
                {user?.nickname}
              </AppLink>
            )}
          </div>
          <AppTypography variant="captionReg12" color="text.secondary" noWrap>
            {skeletonLoading ? (
              <Skeleton variant="text" sx={{ width: "25%" }} />
            ) : (
              `@${commonHelpers.generateUserSlug(user)}`
            )}
          </AppTypography>
          <AppTypography>
            {skeletonLoading ? (
              <Skeleton variant="text" sx={{ width: "15%" }} />
            ) : (
              t("followerWithCount", {
                count: user?.follower_count ?? 0,
              })
            )}
          </AppTypography>
        </div>
        {!skeletonLoading && $s_authUserId !== user?.id && (
          <div className={classes.userItemActions}>
            <FollowButton
              isFollowed={!!user?.isfollow}
              onClick={handleFollowedChange}
            />
          </div>
        )}
      </div>
    );
  }
);

const UserSearch = () => {
  const [userPage, setUserPage] = useState(1);

  const { classes } = useStyles();

  const router = useRouter();

  const { t } = useTranslation();

  const routerQuery = router.query as { keyword: string | string[] };

  const queryKeyword = commonHelpers.getOneRouterQueryValue(
    routerQuery.keyword
  );

  const { hasAuth } = useAuthUser();

  const dispatch = useAppDispatch();

  const fetchUsersSourceRef = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  );

  const $s_userAction = useMemo(
    () => bindActionCreators(storeUserAction, dispatch),
    [dispatch]
  );

  const $s_users = useAppSelector((state) => state.user.users);
  const $s_usersLoading = useAppSelector((state) => state.user.usersLoading);
  const $s_usersError = useAppSelector((state) => state.user.usersError);
  const $s_usersCount = useAppSelector((state) => state.user.usersCount);

  const canLoadMore = $s_usersCount > userPage * FETCHED_USER_LIMIT;

  const scrollLoaderHasNextPage = useMemo(() => {
    return (
      !$s_usersLoading &&
      canLoadMore &&
      !$s_usersError &&
      userPage < commonConstants.FETCHED_MAXIMUM_PAGE
    );
  }, [$s_usersLoading, canLoadMore, userPage, $s_usersError]);

  const fetchUsers = <
    T extends Parameters<typeof $s_userAction.fetchUsersSaga>
  >(
    payload: T[0],
    meta?: Partial<T[1]>
  ) => {
    $s_userAction.fetchUsersSaga(
      {
        params: {
          page: userPage,
          limit: FETCHED_USER_LIMIT,
          query: queryKeyword,
          ...payload?.params,
        },
        cancelToken: payload?.cancelToken,
      },
      meta
    );
  };

  const handleLoadButtonClick = (action: "reload" | "loadMore") => () => {
    let newUserPage = userPage;
    if (action === "loadMore") {
      newUserPage += 1;
      setUserPage(newUserPage);
    }
    fetchUsers(
      {
        params: {
          page: newUserPage,
        },
        cancelToken: fetchUsersSourceRef.current.token,
      },
      {
        isLoadMore: action === "loadMore",
      }
    );
  };

  useEffect(() => {
    if (!queryKeyword) return;
    fetchUsersSourceRef.current = axios.CancelToken.source();
    fetchUsers(
      {
        cancelToken: fetchUsersSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
    return () => {
      fetchUsersSourceRef.current?.cancel &&
        fetchUsersSourceRef.current.cancel();
    };
  }, [queryKeyword, hasAuth]);

  if (!router.isReady) return null;

  return (
    <AppContainer component="section">
      <AppContent>
        <AppBreadcrumbs sx={{ marginBottom: 2 }}>
          <AppLink href="/" color="text.secondary">
            {t("home")}
          </AppLink>
          {!!queryKeyword && (
            <AppTypography color="text.primary">
              {t("userSearchResultsForKeyword", {
                keyword: queryKeyword,
              })}
            </AppTypography>
          )}
        </AppBreadcrumbs>

        {!!queryKeyword && (
          <AppTypography variant="titleSemi20" marginBottom={5}>
            {!!$s_usersLoading
              ? t("searchingResultsForKeyword", {
                  keyword: queryKeyword,
                })
              : t("userCountSearchResultForKeywordWithCount", {
                  count: $s_users.length,
                  keyword: queryKeyword,
                })}
          </AppTypography>
        )}
        <AppContainer maxWidth="sm" disableGutters>
          <WindowInfiniteScrollLoader
            hasNextPage={scrollLoaderHasNextPage}
            onNextPageLoad={handleLoadButtonClick("loadMore")}
          >
            <div className={classes.userList}>
              {$s_users.map((user, userIndex) => (
                <Fragment key={user.id}>
                  {userIndex !== 0 && <Divider />}
                  <UserItem user={user} />
                </Fragment>
              ))}
              {(!!$s_usersLoading || !!$s_usersError) &&
                !!queryKeyword &&
                userPage === 1 &&
                [...Array.from(Array(FETCHED_USER_LIMIT)).keys()].map(
                  (index) => (
                    <Fragment key={index}>
                      {index !== 0 && <Divider />}
                      <UserItem skeletonLoading />
                    </Fragment>
                  )
                )}
              {(!queryKeyword ||
                (!$s_users.length && !$s_usersError && !$s_usersLoading)) && (
                <NoSearchResults keyword={queryKeyword} />
              )}
            </div>
          </WindowInfiniteScrollLoader>
          {($s_usersLoading ||
            !!$s_usersError ||
            (!$s_usersLoading && canLoadMore && !$s_usersError)) && (
            <div className={classes.loadMore}>
              {!$s_usersLoading && canLoadMore && !$s_usersError && (
                <AppButton
                  variant="outlined"
                  color="text.primary"
                  onClick={handleLoadButtonClick(
                    !!$s_users.length ? "loadMore" : "reload"
                  )}
                >
                  {t(!!$s_users.length ? "loadMore" : "reload")}
                </AppButton>
              )}
              {($s_usersLoading || !!$s_usersError) && (
                <AppLoading variant="circular" size={40} />
              )}
            </div>
          )}
        </AppContainer>
      </AppContent>
    </AppContainer>
  );
};

export default UserSearch;
