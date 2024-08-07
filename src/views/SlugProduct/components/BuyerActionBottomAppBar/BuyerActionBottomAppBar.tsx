import * as yup from "yup";

import { formikHelpers } from "@/utils/helpers";

import { useMediaQuery } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppDrawer from "@/components/AppDrawer";
import AppDrawerBody from "@/components/AppDrawerBody";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppNumberFormat from "@/components/AppNumberFormat";
import MainBottomAppBarToolbar from "@/components/MainBottomAppBarToolbar";
import AppBottomAppBar from "@/components/AppBottomAppBar";
import { FastField, Form, Formik, useFormikContext } from "formik";
import AppTypography from "@/components/AppTypography";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector, useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./BuyerActionBottomAppBar.styles";

import SlugProductContext from "@/views/SlugProduct/SlugProduct.context";

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
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2.5 }}
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
  const $s_currency = useAppSelector((state) => state.common.region?.currency);

  const offerInputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    offerInputRef.current && offerInputRef.current.focus();
  }, []);

  return (
    <Form>
      <FastField name="price">
        {({ field, form, meta }: FastFieldProps) => (
          <AppTextField
            autoFocus
            fullWidth
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
            inputComponent={AppNumberFormat as any}
            inputRef={offerInputRef}
            startAdornment={
              <AppInputAdornment position="start">
                {$s_currency}
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
  );
};

const BuyerActionBottomAppBar = () => {
  const { productDeleted, navigateInboxThread, createProductInboxThreadOffer } =
    useContext(SlugProductContext);

  const [offerDrawerOpen, setOfferDrawerOpen] = useState(false);

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_productSellerId = useAppSelector(
    (state) => state.product.product?.seller?.id
  );
  const $s_productChatBlocked = useAppSelector(
    (state) => state.product.product?.seller_block_chat_this_user
  );

  const { t } = useTranslation();

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

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

  const handleOfferDrawerOpen = () => {
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    setOfferDrawerOpen(true);
  };

  const handleOfferDrawerClose = () => {
    setOfferDrawerOpen(false);
  };

  const handleInboxThreadOpen = () => {
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    navigateInboxThread();
  };

  const handleOfferSubmit = (values: OfferFormValues) => {
    createProductInboxThreadOffer({
      price: values.price as number,
    });
  };

  if (
    (!!$s_authUserId && $s_authUserId === $s_productSellerId) ||
    !isTabletDown
  )
    return null;

  return (
    <>
      <AppBottomAppBar>
        <MainBottomAppBarToolbar
          enablePaddingY
          autoHeight
          className={classes.actionList}
          sx={{
            pointerEvents: productDeleted ? "none" : "auto",
          }}
        >
          {$s_productChatBlocked ? (
            <AppTypography color="text.secondary" align="center" flex={1}>
              {t("productChatBlockedMessage")}
            </AppTypography>
          ) : (
            <>
              <AppButton
                variant="outlined"
                color="text.primary"
                fullWidth
                noWrap
                onClick={handleInboxThreadOpen}
              >
                {t("chat")}
              </AppButton>
              <AppButton
                variant="contained"
                color="primary"
                fullWidth
                noWrap
                onClick={handleOfferDrawerOpen}
              >
                {t("offer")}
              </AppButton>
            </>
          )}
        </MainBottomAppBarToolbar>
      </AppBottomAppBar>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleOfferSubmit}
      >
        <AppDrawer
          open={offerDrawerOpen}
          anchor="bottom"
          onClose={handleOfferDrawerClose}
        >
          <AppDrawerBody>
            <OfferForm />
          </AppDrawerBody>
        </AppDrawer>
      </Formik>
    </>
  );
};

export default BuyerActionBottomAppBar;
