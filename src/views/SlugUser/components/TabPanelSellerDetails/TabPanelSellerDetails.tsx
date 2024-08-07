import axios from "axios";
import { bindActionCreators } from "redux";

import { storeAuthAction } from "@/store";
import { authConstants } from "@/utils/constants";
import { commonHelpers } from "@/utils/helpers";

import { Divider, Grid, Skeleton, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppToolbar from "@/components/AppToolbar";
import AppButton from "@/components/AppButton";
import SellerVerificationRequestDialog from "@/components/SellerVerificationRequestDialog";
import AppLink from "@/components/AppLink";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./TabPanelSellerDetails.styles";

import type { CancelTokenSource } from "axios";

const SellerVerificationRequestButton = (props: {
  onUserShopVerificationRequestSubmitSucceed: Function;
}) => {
  const { onUserShopVerificationRequestSubmitSucceed } = props;

  const $s_userShopId = useAppSelector((state) => state.auth.userShop?.id);

  const { classes } = useStyles();

  const { t } = useTranslation();

  const [
    sellerVerificationRequestDialogOpen,
    setSellerVerificationRequestDialogOpen,
  ] = useState(false);

  const handleSellerVerificationRequestDialogOpen = () => {
    setSellerVerificationRequestDialogOpen(true);
  };

  const handleSellerVerificationRequestDialogClose = () => {
    setSellerVerificationRequestDialogOpen(false);
  };

  return (
    <>
      <AppButton
        className={classes.verificationRequestButton}
        variant="outlined"
        color="text.primary"
        onClick={handleSellerVerificationRequestDialogOpen}
      >
        {t("verificationRequest")}
      </AppButton>
      <SellerVerificationRequestDialog
        userShopId={$s_userShopId}
        open={sellerVerificationRequestDialogOpen}
        onUserShopVerificationRequestSubmitSucceed={
          onUserShopVerificationRequestSubmitSucceed
        }
        onClose={handleSellerVerificationRequestDialogClose}
      />
    </>
  );
};

const TabPanelSellerDetails = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const fetchedAuthUserShopSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUserShop = useAppSelector((state) => state.auth.userShop);
  const $s_authUserShopLoading = useAppSelector(
    (state) => state.auth.userShopLoading
  );
  const $s_authUserShopError = useAppSelector(
    (state) => state.auth.userShopError
  );

  const authUserShopLoading = useMemo(() => {
    return $s_authUserShopLoading || !!$s_authUserShopError;
  }, [$s_authUserShopLoading, $s_authUserShopError]);

  const handleUserShopVerificationRequestSubmitSucceed = () => {
    fetchedAuthUserShopSourceRef.current?.cancel &&
      fetchedAuthUserShopSourceRef.current.cancel();
    fetchedAuthUserShopSourceRef.current = axios.CancelToken.source();
    $s_authAction.fetchUserShopSaga({
      cancelToken: fetchedAuthUserShopSourceRef.current.token,
    });
  };

  useEffect(() => {
    return () => {
      fetchedAuthUserShopSourceRef.current?.cancel &&
        fetchedAuthUserShopSourceRef.current.cancel();
    };
  }, []);

  return (
    <div>
      {(!isTabletDown ||
        ![
          authConstants.PENDING_STATE_ID,
          authConstants.VERIFIED_STATE_ID,
        ].includes($s_authUserShop?.state as any)) && (
        <AppToolbar>
          <AppTypography className={classes.title} variant="titleSemi20" noWrap>
            <span>{t("sellerDetails")}</span>
          </AppTypography>
          {!authUserShopLoading &&
            ![
              authConstants.PENDING_STATE_ID,
              authConstants.VERIFIED_STATE_ID,
            ].includes($s_authUserShop?.state as any) && (
              <SellerVerificationRequestButton
                onUserShopVerificationRequestSubmitSucceed={
                  handleUserShopVerificationRequestSubmitSucceed
                }
              />
            )}
        </AppToolbar>
      )}
      <Divider className={classes.titleDivider} />
      <AppContainer>
        <AppTypography align="center" className={classes.sellerInfoStatus}>
          {authUserShopLoading ? (
            <Skeleton variant="text" sx={{ width: 120 }} />
          ) : (
            `${t("verificationStatus")}: ${t(
              authConstants.stateIdToLabelMap[$s_authUserShop?.state!] ||
                "notYetVerified"
            )}`
          )}
        </AppTypography>
        <div className={classes.sellerInfoContent}>
          {authUserShopLoading ? (
            <Grid container spacing={3.75}>
              {[...Array.from(Array(5)).keys()].map((key) => (
                <Grid key={key} item xs={12}>
                  <div className={classes.sellerInfoItem}>
                    <Skeleton variant="text" sx={{ width: "25%" }} />
                    <Skeleton variant="text" sx={{ width: "50%" }} />
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3.75}>
              <Grid item xs={12}>
                <div className={classes.sellerInfoItem}>
                  <AppTypography variant="bodyMed16">
                    {t("sellerName")}
                  </AppTypography>
                  <AppTypography color="text.secondary">
                    {$s_authUserShop?.title || t("notFilledIn")}
                  </AppTypography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.sellerInfoItem}>
                  <AppTypography variant="bodyMed16">
                    {t("sellerAddress")}
                  </AppTypography>
                  <AppTypography color="text.secondary">
                    {$s_authUserShop?.address || t("notFilledIn")}
                  </AppTypography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.sellerInfoItem}>
                  <AppTypography variant="bodyMed16">
                    {t("contactNumber")}
                  </AppTypography>
                  <AppTypography color="text.secondary">
                    {$s_authUserShop?.contact || t("notFilledIn")}
                  </AppTypography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.sellerInfoItem}>
                  <AppTypography variant="bodyMed16">
                    {t("website")}
                  </AppTypography>
                  <AppLink
                    href={$s_authUserShop?.website ?? ""}
                    target="_blank"
                    disabledNextLink
                    color="text.secondary"
                  >
                    {$s_authUserShop?.website || t("notFilledIn")}
                  </AppLink>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.sellerInfoItem}>
                  <AppTypography variant="bodyMed16">
                    {t("specialMerchant")}
                  </AppTypography>
                  <AppTypography color="text.secondary">
                    {($s_authUserShop?.merchant_location?.id &&
                      $s_authUserShop?.merchant_location?.title) ||
                      t("notFilledIn")}
                  </AppTypography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.sellerInfoItem}>
                  <AppTypography variant="bodyMed16">
                    {t("businessCertificationIsRequired")}
                  </AppTypography>
                  <AppLink
                    href={
                      commonHelpers.filePathLoader($s_authUserShop?.image) ?? ""
                    }
                    target="_blank"
                    disabledNextLink
                    color="text.secondary"
                  >
                    {($s_authUserShop?.image ?? "").split("/").reverse()[0] ||
                      t("notYetUploaded")}
                  </AppLink>
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </AppContainer>
    </div>
  );
};

export default TabPanelSellerDetails;
