import * as yup from "yup";
import { toast } from "react-toastify";
import { bindActionCreators } from "@reduxjs/toolkit";

import loadingScreenOverlay from "@/services/loadingScreenOverlay";
import { useAppDispatch, useIsMounted } from "@/hooks";
import { storeAuthAction } from "@/store";
import {
  axiosHelpers,
  commonHelpers,
  formikHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import { appGtagService } from "@/services";

import { FastField, Form, Formik, useFormikContext } from "formik";
import { Box, Divider, Grid, Typography } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppTextField from "@/components/AppTextField";
import PasswordVisibilityToggleTextField from "@/components/PasswordVisibilityToggleTextField";

import SignInFacebookButton from "@/containers/SignInAndSignUpDialog/components/SignInFacebookButton";
import SignInGoogleButton from "@/containers/SignInAndSignUpDialog/components/SignInGoogleButton";
import SignInWeChatButton from "@/containers/SignInAndSignUpDialog/components/SignInWeChatButton";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef } from "react";
import { Trans, useTranslation } from "next-i18next";

import type { FastFieldProps, FormikHelpers, FormikProps } from "formik";

type SignInValues = {
  email: string;
  password: string;
};

const SignInButton = () => {
  const { values, validateForm, handleSubmit } = useFormikContext();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      color="primary"
      variant="contained"
      sx={{ marginTop: 2.5 }}
      type="submit"
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t("login")}
    </AppButton>
  );
};

const SimpleForm = () => {
  const {
    handleSignInAndSignUpDialogClose,
    handleViewSignUpPush,
    handleViewResetPasswordPush,
  } = useContext(SignInAndSignUpDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <AppDialogTitle onCloseButtonClick={handleSignInAndSignUpDialogClose}>
        {t("login")}
      </AppDialogTitle>
      <AppDialogContent>
        <Form>
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <FastField name="email">
                {({ field, form, meta }: FastFieldProps) => (
                  <AppTextField
                    label="Email"
                    placeholder="Email"
                    fullWidth
                    required
                    inputProps={{
                      inputMode: "email",
                    }}
                    error={
                      !!formikHelpers.showError({
                        error: meta.error,
                        touched: meta.touched,
                        submitCount: form.submitCount,
                      })
                    }
                    helperText={formikHelpers.showError({
                      error: meta.error,
                      touched: meta.touched,
                      submitCount: form.submitCount,
                    })}
                    {...field}
                  />
                )}
              </FastField>
            </Grid>
            <Grid item xs={12}>
              <FastField name="password">
                {({ field, form, meta }: FastFieldProps) => (
                  <PasswordVisibilityToggleTextField
                    label={t("password")}
                    placeholder={t("password")}
                    fullWidth
                    required
                    error={
                      !!formikHelpers.showError({
                        error: meta.error,
                        touched: meta.touched,
                        submitCount: form.submitCount,
                      })
                    }
                    helperText={formikHelpers.showError({
                      error: meta.error,
                      touched: meta.touched,
                      submitCount: form.submitCount,
                    })}
                    {...field}
                  />
                )}
              </FastField>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <AppButton
                  size="small"
                  edge="xy"
                  color="text.secondary"
                  onClick={handleViewResetPasswordPush}
                >
                  {t("forgotPassword")}
                </AppButton>
              </Box>
            </Grid>
          </Grid>
          <SignInButton />

          <Divider sx={{ my: 3.75, textTransform: "uppercase" }}>
            {t("Or")}
          </Divider>

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <SignInFacebookButton />
            </Grid>
            <Grid item xs={12}>
              <SignInGoogleButton />
            </Grid>
            {!commonHelpers.isMobile() && (
              <Grid item xs={12}>
                <SignInWeChatButton />
              </Grid>
            )}
          </Grid>

          <Typography marginTop={3.75} component="div" align="center">
            <Trans
              defaults="noAccountYetSuggest"
              components={{
                p1: (
                  <Typography
                    component="span"
                    variant="inherit"
                    color="primary.main"
                    sx={{ cursor: "pointer" }}
                    onClick={handleViewSignUpPush}
                  />
                ),
              }}
            />
          </Typography>
        </Form>
      </AppDialogContent>
    </>
  );
};

const ViewSignIn = () => {
  const { signInAndSignUpDialogOpenPayload, handleSignInAndSignUpDialogClose } =
    useContext(SignInAndSignUpDialogContext);

  const { t, i18n } = useTranslation();

  const formikRef = useRef<FormikProps<SignInValues>>(null!);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const initialValues = useMemo<SignInValues>(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().email().required(t("emailIsRequired")!),
      password: yup.string().required(t("passwordIsRequired")!),
    });
  }, [t]);

  const handleSubmit = async (
    values: SignInValues,
    formikHelpers: FormikHelpers<SignInValues>
  ) => {
    loadingScreenOverlay.fire(`${t("pending")}...`);
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.signInSaga,
      {
        params: {
          email: values.email,
          password: values.password,
        },
      }
    );
    if (!isMounted()) {
      handleSignInAndSignUpDialogClose();
      loadingScreenOverlay.close();
      return;
    }

    if (axiosHelpers.checkRequestSuccess(response)) {
      appGtagService.dispatchSignInEvent({
        email: values.email,
      });
      handleSignInAndSignUpDialogClose();
      await commonHelpers.sleep(150);
      loadingScreenOverlay.close();
      if (!isMounted()) return;
      if (!!signInAndSignUpDialogOpenPayload?.href) {
        if (signInAndSignUpDialogOpenPayload?.href === "/profile")
          router.push(`/${commonHelpers.generateUserSlug(response.data)}`);
        else router.push(signInAndSignUpDialogOpenPayload.href);
      } else router.push(router, undefined, { scroll: false });
      formikHelpers.resetForm({
        values: initialValues,
        submitCount: 0,
        errors: {},
        touched: {},
      });
    } else {
      toast.error(response.message);
      loadingScreenOverlay.close();
    }
  };

  useEffect(() => {
    if (!isMounted()) return;
    formikRef.current &&
      formikRef.current.resetForm({
        errors: {},
        submitCount: 0,
        touched: {},
        isSubmitting: false,
        isValidating: false,
      });
  }, [i18n.language]);

  const isMounted = useIsMounted();

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <SimpleForm key={i18n.language} />
    </Formik>
  );
};

export default ViewSignIn;
