import axios from "axios";
import { bindActionCreators } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { axiosHelpers, reduxHelpers } from "@/utils/helpers";
import { storeAuthAction } from "@/store";
import loadingScreenOverlay from "@/services/loadingScreenOverlay";

import { Grid } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppDialogActions from "@/components/AppDialogActions";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AppTypography from "@/components/AppTypography";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector, useEventCallback } from "@/hooks";
import { useRouter } from "next/router";

import type { CancelTokenSource } from "axios";

const FetchInitialData = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const userLabelsSourceRef = useRef<CancelTokenSource>();

  const fetchUserLabels = useEventCallback(() => {
    if (router.asPath === "/user/account/change-preferences") return;
    userLabelsSourceRef.current = axios.CancelToken.source();
    $s_authAction.fetchUserLabelsSaga({
      cancelToken: userLabelsSourceRef.current.token,
    });
  });

  useEffect(() => {
    $s_hasAuth && fetchUserLabels();
    return () => {
      userLabelsSourceRef.current?.cancel &&
        userLabelsSourceRef.current.cancel();
    };
  }, [$s_hasAuth]);

  return null;
};

const ViewSelectPreferences = () => {
  const { handleSignInAndSignUpDialogClose } = useContext(
    SignInAndSignUpDialogContext
  );

  const [selectedUserLabelIds, setSelectedUserLabelIds] = useState<number[]>(
    []
  );

  const updateUserLabelsSourceRef = useRef<CancelTokenSource>();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUserLabels = useAppSelector((state) => state.auth.userLabels);
  const $s_authUserLabelsLoading = useAppSelector(
    (state) => state.auth.userLabelsLoading
  );
  const $s_authUserLabelsError = useAppSelector(
    (state) => state.auth.userLabelsError
  );

  const handleSelectedUserLabelChange = (event: React.SyntheticEvent) => {
    const newSelectedUserLabelIds = [...selectedUserLabelIds];
    const userLabelId = (event.target as any).value;
    const userLabelIdIndex = newSelectedUserLabelIds.indexOf(
      Number(userLabelId)
    );
    if (userLabelIdIndex === -1) {
      newSelectedUserLabelIds.push(Number(userLabelId));
    } else newSelectedUserLabelIds.splice(userLabelIdIndex, 1);

    setSelectedUserLabelIds(newSelectedUserLabelIds);
  };

  const handleSelectedUserLabelSubmit = async () => {
    updateUserLabelsSourceRef.current = axios.CancelToken.source();
    loadingScreenOverlay.fire(`${t("pending")}...`);
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.updateUserLabelsSaga,
      {
        params: {
          rid: selectedUserLabelIds,
        },
      }
    );

    if (axiosHelpers.checkRequestSuccess(response)) {
      handleSignInAndSignUpDialogClose();
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlay.close();
  };

  useEffect(() => {
    return () => {
      updateUserLabelsSourceRef.current?.cancel &&
        updateUserLabelsSourceRef.current.cancel();
    };
  }, []);

  return (
    <>
      <FetchInitialData />
      <AppDialogTitle onCloseButtonClick={handleSignInAndSignUpDialogClose}>
        {t("selectPreferences")}
      </AppDialogTitle>
      <AppDialogContent>
        <LoadingSkeleton
          count={4}
          variant="userLabel"
          keepMounted
          loading={$s_authUserLabelsLoading || !!$s_authUserLabelsError}
          GridContainerProps={{ spacing: 2.5 }}
          GridItemProps={{ xs: 12, md: 6 }}
        >
          <Grid container spacing={{ xs: 1.25, md: 2.5 }}>
            {$s_authUserLabels.map((userLabel) => (
              <Grid key={userLabel.id} item xs={12} md={6}>
                <AppFormControlLabel
                  fullWidth
                  variant="outlined"
                  disableGutters
                  label={userLabel.title}
                  labelPlacement="start"
                  control={
                    <AppCheckbox color="text.primary" value={userLabel.id} />
                  }
                  checked={selectedUserLabelIds.indexOf(userLabel.id) > -1}
                  onChange={handleSelectedUserLabelChange}
                />
              </Grid>
            ))}
            {$s_authUserLabels.length === 0 && (
              <Grid item xs={12}>
                <AppTypography color="textSecondary" align="center">
                  {t("noOptions")}
                </AppTypography>
              </Grid>
            )}
          </Grid>
        </LoadingSkeleton>
      </AppDialogContent>
      <AppDialogActions>
        <AppButton
          fullWidth
          color="primary"
          variant="contained"
          disabled={selectedUserLabelIds.length === 0}
          onClick={handleSelectedUserLabelSubmit}
        >
          {t("done")}
        </AppButton>
      </AppDialogActions>
    </>
  );
};

export default ViewSelectPreferences;
