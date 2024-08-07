import { toast } from "react-toastify";
import _isEqual from "lodash/isEqual";
import axios from "axios";
import { bindActionCreators } from "redux";

import { axiosHelpers, reduxHelpers } from "@/utils/helpers";
import loadingScreenOverlay from "@/services/loadingScreenOverlay";
import { commonConstants } from "@/utils/constants";
import { storeAuthAction } from "@/store";

import { Divider, Grid, useMediaQuery } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppToolbar from "@/components/AppToolbar";
import AppTypography from "@/components/AppTypography";
import StickyAppBar from "@/components/StickyAppBar";
import AppContainer from "@/components/AppContainer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector, useIsMounted } from "@/hooks";

import useStyles from "./UserAccountChangePreferences.styles";

import type { CancelTokenSource } from "axios";

const UserAccountChangePreferences = () => {
  const [selectedUserLabelIds, setSelectedUserLabelIds] = useState<number[]>(
    []
  );

  const updateUserLabelsSourceRef = useRef<CancelTokenSource>();
  const fetchUserLabelsSourceRef = useRef<CancelTokenSource>();

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

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const fetchUserLabels = async () => {
    fetchUserLabelsSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.fetchUserLabelsSaga,
      {
        cancelToken: fetchUserLabelsSourceRef.current.token,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      setSelectedUserLabelIds(
        (response.data.data as typeof $s_authUserLabels)
          .filter((authUserLabel) => !!authUserLabel.type)
          .map((authUserLabel) => authUserLabel.id)
      );
    }
  };

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
    loadingScreenOverlay.fire(`${t("saving")}...`);
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.updateUserLabelsSaga,
      {
        params: {
          rid: selectedUserLabelIds,
        },
      }
    );
    if (!isMounted()) {
      loadingScreenOverlay.close();
      return;
    }
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("savedSuccessfully"));
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlay.close();
  };

  useEffect(() => {
    fetchUserLabels();
    return () => {
      updateUserLabelsSourceRef.current?.cancel &&
        updateUserLabelsSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <div>
      <StickyAppBar thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}>
        <AppToolbar>
          <AppTypography
            variant="titleSemi20"
            textTransform="capitalize"
            flex={1}
          >
            {t("changePreferences")}
          </AppTypography>
          <div>
            <AppButton
              fullWidth
              color="primary"
              variant="contained"
              type="submit"
              onClick={handleSelectedUserLabelSubmit}
            >
              {t("save")}
            </AppButton>
          </div>
        </AppToolbar>
      </StickyAppBar>
      {!isTabletDown && <Divider />}
      <AppContainer>
        <div className={classes.content}>
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
        </div>
      </AppContainer>
    </div>
  );
};

export default UserAccountChangePreferences;
