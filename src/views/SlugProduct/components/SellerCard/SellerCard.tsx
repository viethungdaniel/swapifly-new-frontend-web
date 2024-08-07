import * as yup from "yup";

import { commonHelpers, formikHelpers, imageHelpers } from "@/utils/helpers";
import { productConstants } from "@/utils/constants";

import { FastField, Form, Formik, useFormikContext } from "formik";
import { Box, ButtonBase, Divider } from "@mui/material";
import AppPaper from "@/components/AppPaper";
import AppPaperContent from "@/components/AppPaperContent";
import AppAvatar from "@/components/AppAvatar";
import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppNumberFormat from "@/components/AppNumberFormat";
import SlugProductContext from "@/views/SlugProduct/SlugProduct.context";
import AppLink from "@/components/AppLink";

import DeleteIcon from "@@/public/images/icons/delete.svg";
import CheckedIcon from "@@/public/images/icons/checked.svg";
import EditIcon from "@@/public/images/icons/edit.svg";
import StarIcon from "@@/public/images/icons/star.svg";

import { useContext, useMemo } from "react";
import { useAppSelector, useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./SellerCard.styles";

import type { FastFieldProps } from "formik";

type OfferFormValues = {
  price: EmptySafeNumber;
};

const OfferSubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<OfferFormValues>();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      variant="contained"
      color="primary"
      type="submit"
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t("offer")}
    </AppButton>
  );
};

const OfferForm = () => {
  const { createProductInboxThreadOffer } = useContext(SlugProductContext);

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  const { t } = useTranslation();

  const initialValues = useMemo<OfferFormValues>(() => {
    return {
      price: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      price: yup
        .number()
        .required(t("priceIsRequired")!)
        .min(
          1,
          ({ min }) =>
            t("priceMinNumberWithCount", {
              count: min,
            })!
        ),
    });
  }, [t]);

  const { classes } = useStyles();

  const handleOfferFormSubmit = async (values: OfferFormValues) => {
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    createProductInboxThreadOffer({
      price: values.price as number,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleOfferFormSubmit}
    >
      <Form className={classes.offerForm}>
        <FastField name="price">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              fullWidth
              bgColor="common.lightNeutral"
              inputComponent={AppNumberFormat as any}
              type="tel"
              placeholder="00.00"
              inputProps={{
                pattern: "[0-9]*",
                valueIsNumericString: true,
                isAllowed: (values: any) => {
                  const { floatValue } = values;
                  return (floatValue || 0) >= 0;
                },
              }}
              startAdornment={
                <AppInputAdornment position="start">
                  {$s_regionCurrency}
                </AppInputAdornment>
              }
              error={
                !!formikHelpers.showError({
                  error: meta.error,
                  submitCount: form.submitCount,
                  touched: meta.touched,
                })
              }
              helperText={formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              })}
              {...field}
            />
          )}
        </FastField>
        <OfferSubmitButton />
      </Form>
    </Formik>
  );
};

const ChatButton = () => {
  const { navigateInboxThread } = useContext(SlugProductContext);

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const { t } = useTranslation();

  const handleInboxThreadOpen = () => {
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    navigateInboxThread();
  };

  return (
    <AppButton
      fullWidth
      variant="outlined"
      color="text.primary"
      onClick={handleInboxThreadOpen}
    >
      {t("chat")}
    </AppButton>
  );
};

const SellerCard = () => {
  const { productId, markSoldProduct, deleteProduct } =
    useContext(SlugProductContext);

  const { t } = useTranslation();

  const { classes, cx } = useStyles();

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);

  const $s_productChatBlocked = useAppSelector(
    (state) => state.product.product?.seller_block_chat_this_user
  );

  const $s_productSeller = useAppSelector(
    (state) => state.product.product?.seller
  );
  const $s_productStateNumber = useAppSelector(
    (state) => state.product.product?.product?.state
  );
  const $s_productTitle = useAppSelector(
    (state) => state.product.product?.product?.title
  );

  return (
    <AppPaper className={classes.root} boxShadowVariant="card">
      <AppPaperContent className={classes.sellerContent}>
        <div className={classes.sellerProfile}>
          <AppAvatar
            component={AppLink}
            href={`/${commonHelpers.generateUserSlug($s_productSeller as any)}`}
            src={imageHelpers.imagePathLoader($s_productSeller?.avatar)}
          />
          <div>
            <AppLink
              variant="bodySemi16"
              href={`/${commonHelpers.generateUserSlug(
                $s_productSeller as any
              )}`}
            >
              {$s_productSeller?.nickname ?? "..."}
            </AppLink>
            <AppTypography variant="bodyReg14">
              @{commonHelpers.generateUserSlug($s_productSeller)}
            </AppTypography>
            <AppTypography className={classes.sellerProfileText}>
              {commonHelpers.formatNumber($s_productSeller?.point_average ?? 0)}{" "}
              <AppSvgIcon
                component={StarIcon}
                color="common.starYellow"
                fontSize="small"
              />{" "}
              {!!$s_productSeller?.e_num
                ? `(${t("reviewWithCount", {
                    count: $s_productSeller.e_num,
                  })})`
                : t("noReviewsYet")}
            </AppTypography>
          </div>
        </div>
        {(!$s_authUserId || $s_authUserId !== $s_productSeller?.id) &&
          !$s_productChatBlocked && <ChatButton />}
        {!!$s_authUserId && $s_authUserId === $s_productSeller?.id && (
          <AppButton
            variant="outlined"
            color="text.primary"
            component={AppLink}
            href="/inbox"
            underline="none"
            hoverColor="none"
          >
            {t("viewConversation")}
          </AppButton>
        )}
        {$s_productChatBlocked && $s_authUserId !== $s_productSeller?.id && (
          <AppTypography color="text.secondary">
            {t("productChatBlockedMessage")}
          </AppTypography>
        )}
        {!$s_productChatBlocked && (
          <>
            <Divider />
            {(!$s_authUserId || $s_authUserId !== $s_productSeller?.id) && (
              <OfferForm />
            )}
          </>
        )}
      </AppPaperContent>

      {!!$s_authUserId && $s_authUserId === $s_productSeller?.id && (
        <AppPaperContent className={classes.salesOwnerActionList}>
          <Box
            {...($s_productStateNumber !== productConstants.SOLD_STATE_NUMBER
              ? {
                  component: AppLink,
                  href: `/sell/${commonHelpers.generateProductSlug(
                    $s_productTitle,
                    productId
                  )}`,
                  hoverColor: "none",
                  underline: "none",
                }
              : {})}
          >
            <ButtonBase
              className={cx(
                classes.salesOwnerActionItem,
                $s_productStateNumber === productConstants.SOLD_STATE_NUMBER &&
                  classes.disabled
              )}
              disabled={
                $s_productStateNumber === productConstants.SOLD_STATE_NUMBER
              }
              component={AppPaperContent}
            >
              <AppSvgIcon component={EditIcon} fontSize="small" />
              <AppTypography component="span" variant="bodyReg16">
                {t("editItem")}
              </AppTypography>
            </ButtonBase>
          </Box>

          <ButtonBase
            className={cx(
              classes.salesOwnerActionItem,
              $s_productStateNumber === productConstants.SOLD_STATE_NUMBER &&
                classes.disabled
            )}
            disabled={
              $s_productStateNumber === productConstants.SOLD_STATE_NUMBER
            }
            onClick={markSoldProduct}
            component={AppPaperContent}
          >
            <AppSvgIcon component={CheckedIcon} fontSize="small" />
            <AppTypography component="span" variant="bodyReg16">
              {t("markSold")}
            </AppTypography>
          </ButtonBase>

          <ButtonBase
            className={classes.salesOwnerActionItem}
            component={AppPaperContent}
            onClick={deleteProduct}
          >
            <AppSvgIcon component={DeleteIcon} fontSize="small" />
            <AppTypography component="span" variant="bodyReg16">
              {t("deleteItem")}
            </AppTypography>
          </ButtonBase>
        </AppPaperContent>
      )}
    </AppPaper>
  );
};

export default SellerCard;
