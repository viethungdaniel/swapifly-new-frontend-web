import axios from "axios";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";

import { storeUserAction } from "@/store";
import { FollowUserSagaAction } from "@/store/user/types";
import { userConstants } from "@/utils/constants";
import { axiosHelpers, reduxHelpers } from "@/utils/helpers";

import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import CheckedIcon from "@@/public/images/icons/checked.svg";

import {
  useAppDispatch,
  useAppSelector,
  useAuthUser,
  useIsMounted,
} from "@/hooks";

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";

import type { SxProps } from "@mui/material";
import type { CancelTokenSource } from "axios";

type FollowButtonProps = {
  className?: string;
  viewMode?: "desktop" | "mobile";
  sx?: SxProps;
};

const FollowButton = (props: FollowButtonProps) => {
  const { viewMode, className, sx } = props;

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const followUserSourceRef = useRef<CancelTokenSource | null>(null);

  const $s_userAction = useMemo(
    () => bindActionCreators(storeUserAction, dispatch),
    [dispatch]
  );

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_followed = useAppSelector(
    (state) => state.user.user?.shop?.isfollow
  );

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
    if (!$s_userId) return;

    followUserSourceRef.current?.cancel && followUserSourceRef.current.cancel();
    followUserSourceRef.current = axios.CancelToken.source();

    followUser({
      params: {
        user_id: $s_userId!,
        state: !!!$s_followed
          ? userConstants.FOLLOW_ID
          : userConstants.UN_FOLLOW_ID,
      },
    });
  };

  useEffect(() => {
    return () => {
      followUserSourceRef.current?.cancel &&
        followUserSourceRef.current.cancel();
      followUserSourceRef.current = null;
    };
  }, []);

  const isMounted = useIsMounted();

  if (viewMode === "mobile")
    return (
      <AppButton
        className={className}
        fullWidth
        variant={!!$s_followed ? "contained" : "outlined"}
        color="primary"
        startIcon={
          !!$s_followed && (
            <AppSvgIcon component={CheckedIcon} fontSize="inherit" />
          )
        }
        sx={sx}
        onClick={handleFollowedChange}
      >
        {t(!$s_followed ? "follow" : "followed")}
      </AppButton>
    );

  return (
    <AppButton
      className={className}
      variant={!!$s_followed ? "contained" : "outlined"}
      color="primary"
      startIcon={
        !!$s_followed && (
          <AppSvgIcon component={CheckedIcon} fontSize="inherit" />
        )
      }
      sx={sx}
      onClick={handleFollowedChange}
    >
      {t(!$s_followed ? "follow" : "followed")}
    </AppButton>
  );
};

export default FollowButton;
