import * as yup from "yup";
import { toast } from "react-toastify";
import { bindActionCreators } from "@reduxjs/toolkit";
import _isEqual from "lodash/isEqual";

import { appGtagService } from "@/services";
import {
  axiosHelpers,
  commonHelpers,
  formikHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import loadingScreenOverlay from "@/services/loadingScreenOverlay";
import { storeAuthAction } from "@/store";
import { commonConstants } from "@/utils/constants";

import { FastField, Form, Formik, useFormikContext } from "formik";
import { Divider, FormGroup, Grid, Typography } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppTextField from "@/components/AppTextField";
import SignInFacebookButton from "@/containers/SignInAndSignUpDialog/components/SignInFacebookButton";
import SignInGoogleButton from "@/containers/SignInAndSignUpDialog/components/SignInGoogleButton";
import SignInWeChatButton from "@/containers/SignInAndSignUpDialog/components/SignInWeChatButton";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import PasswordVisibilityToggleTextField from "@/components/PasswordVisibilityToggleTextField";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";
import EmailVerificationTextField from "@/components/EmailVerificationTextField";

import SignUpAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";

import {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Trans, useTranslation } from "next-i18next";
import {
  useAppDispatch,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";
import { SIGN_UP_VIEW } from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.constants";

import type { FastFieldProps, FormikHelpers, FormikProps } from "formik";

export type ViewSignUpApiRef = {
  isFillingForm: () => boolean;
  resetForm: () => void;
};

export type ViewSignUpProps = {
  apiRef?: React.ForwardedRef<ViewSignUpApiRef>;
};

type SignUpValues = {
  email: string;
  code: string;
  key: string;
  password: string;
  confirm_password: string;
  newsletter_swapifly: BooleanNumber;
  newsletter_partners: BooleanNumber;
};

const LeavePageConfirmation = () => {
  const { view } = useContext(SignInAndSignUpDialogContext);
  const { values, initialValues } = useFormikContext<SignUpValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave:
      !_isEqual(values, initialValues) && view === SIGN_UP_VIEW,
  });

  return null;
};

const SubmitButton = () => {
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
      {t("register")}
    </AppButton>
  );
};

const SimpleForm = () => {
  const {
    handleSignInAndSignUpDialogClose,
    handleViewPrivacyPolicyPush,
    handleViewSignInPush,
    handleViewTermsOfServicePush,
  } = useContext(SignUpAndSignUpDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle
        startActions={
          <AppIconButton
            edge="xy"
            color="text.primary"
            borderRadius="circular"
            onClick={handleViewSignInPush}
          >
            <AppSvgIcon component={ArrowLeftIcon} fontSize="small" />
          </AppIconButton>
        }
        onCloseButtonClick={handleSignInAndSignUpDialogClose}
      >
        {t("register")}
      </AppDialogTitle>
      <AppDialogContent>
        <Form>
          <Typography
            variant="captionReg12"
            color="text.secondary"
            align="center"
            marginBottom={2.5}
          >
            {t("registerCaption")}
          </Typography>
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <FastField name="email">
                {({ field, form, meta }: FastFieldProps) => (
                  <EmailVerificationTextField
                    emailVerificationName="key"
                    emailVerificationVariant="signUp"
                    label="Email"
                    placeholder="Email"
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
                    onEmailVerificationCodeSendSucceeded={field.onChange}
                  />
                )}
              </FastField>
            </Grid>
            <Grid item xs={12}>
              <FastField name="code">
                {({ field, form, meta }: FastFieldProps) => (
                  <AppTextField
                    label={t("verificationCode")}
                    placeholder={t("verificationCode")}
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
              <FastField name="password">
                {({ field, form, meta }: FastFieldProps) => (
                  <PasswordVisibilityToggleTextField
                    label={t("password")}
                    placeholder={t("passwordRangeWords", {
                      min: commonConstants.PASSWORD_MIN_LENGTH,
                      max: commonConstants.PASSWORD_MAX_LENGTH,
                    })}
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
              <FastField name="confirm_password">
                {({ field, form, meta }: FastFieldProps) => (
                  <PasswordVisibilityToggleTextField
                    label={t("confirmPassword")}
                    placeholder={t("confirmPasswordRangeWords", {
                      min: commonConstants.PASSWORD_MIN_LENGTH,
                      max: commonConstants.PASSWORD_MAX_LENGTH,
                    })}
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
              <FormGroup>
                <FastField name="newsletter_swapifly">
                  {({ field }: FastFieldProps) => (
                    <AppFormControlLabel
                      label={t("latestTrendsAndUpdatesFromSwapifly")}
                      control={<AppCheckbox checked={!!field.value} />}
                      {...field}
                      onChange={(_, checked) => {
                        field.onChange({
                          target: {
                            name: field.name,
                            value: checked ? 1 : 0,
                          },
                        });
                      }}
                    />
                  )}
                </FastField>
                <FastField name="newsletter_partners">
                  {({ field }: FastFieldProps) => (
                    <AppFormControlLabel
                      label={t("promotionalOffersFromPartnersOfSwapifly")}
                      control={<AppCheckbox checked={!!field.value} />}
                      {...field}
                      onChange={(_, checked) => {
                        field.onChange({
                          target: {
                            name: field.name,
                            value: checked ? 1 : 0,
                          },
                        });
                      }}
                    />
                  )}
                </FastField>
              </FormGroup>
            </Grid>
          </Grid>

          <SubmitButton />

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
              t={t}
              defaults="hasAccountSuggest"
              components={{
                p1: (
                  <Typography
                    component="span"
                    variant="inherit"
                    color="primary.main"
                    sx={{ cursor: "pointer" }}
                    onClick={handleViewSignInPush}
                  />
                ),
              }}
            />
          </Typography>

          <Typography marginTop={3.75} component="div" align="center">
            <Trans
              t={t}
              defaults="registerTermPolicySuggest"
              components={{
                p1: (
                  <Typography
                    component="span"
                    variant="inherit"
                    color="common.blue"
                    sx={{ cursor: "pointer" }}
                    onClick={handleViewTermsOfServicePush}
                  />
                ),
                p2: (
                  <Typography
                    component="span"
                    variant="inherit"
                    color="common.blue"
                    sx={{ cursor: "pointer" }}
                    onClick={handleViewPrivacyPolicyPush}
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

const ViewSignUp = (props: ViewSignUpProps) => {
  const { apiRef } = props;

  const { handleViewSelectPreferencesPush } = useContext(
    SignInAndSignUpDialogContext
  );

  const { t, i18n } = useTranslation();

  const formikRef = useRef<FormikProps<SignUpValues> | null>(null);

  const initialValues = useMemo<SignUpValues>(
    () => ({
      email: "",
      password: "",
      code: "",
      key: "",
      confirm_password: "",
      newsletter_partners: 0,
      newsletter_swapifly: 1,
    }),
    []
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email()
        .required(t("emailIsRequired")!)
        .max(commonConstants.TITLE_TEXT_MAX_LENGTH, ({ max }) =>
          t("emailMaxCharacterWithCount", {
            count: max,
          })
        ),
      code: yup.string().required(t("verificationCodeIsRequired")!),
      password: yup
        .string()
        .required(t("passwordIsRequired")!)
        .min(commonConstants.PASSWORD_MIN_LENGTH, ({ min }) =>
          t("newPasswordMinCharacterWithCount", {
            count: min,
          })
        )
        .max(commonConstants.PASSWORD_MAX_LENGTH, ({ max }) =>
          t("passwordMaxCharacterWithCount", {
            count: max,
          })
        ),
      confirm_password: yup
        .string()
        .required(t("confirmPasswordIsRequired")!)
        .oneOf([yup.ref("password")], t("confirmPasswordMustMatch")!),
    });
  }, [t]);

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const handleSubmit = async (
    values: SignUpValues,
    formikHelpers: FormikHelpers<SignUpValues>
  ) => {
    loadingScreenOverlay.fire(`${t("pending")}...`);
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.signUpSaga,
      {
        params: {
          code: values.code,
          email: values.email,
          key: values.key,
          password: values.password,
          newsletter_partners: values.newsletter_partners,
          newsletter_swapifly: values.newsletter_swapifly,
        },
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      appGtagService.dispatchSignUpEvent({
        email: values.email,
      });
      handleViewSelectPreferencesPush();
      formikHelpers.resetForm({
        values: initialValues,
        submitCount: 0,
        errors: {},
        touched: {},
      });
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlay.close();
  };

  useImperativeHandle(apiRef, () => ({
    isFillingForm: () => {
      const values = formikRef.current?.values ?? null;
      const initialValues = formikRef.current?.initialValues ?? null;
      return !_isEqual(values, initialValues);
    },
    resetForm: () => {
      if (!!formikRef.current)
        formikRef.current.resetForm({
          values: initialValues,
          submitCount: 0,
          errors: {},
          touched: {},
        });
    },
  }));

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

export default ViewSignUp;
