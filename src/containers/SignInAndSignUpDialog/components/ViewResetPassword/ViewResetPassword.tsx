import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import _isEqual from "lodash/isEqual";
import { isValidPhoneNumber } from "libphonenumber-js";

import { axiosHelpers, formikHelpers } from "@/utils/helpers";
import { authApi } from "@/utils/apis";
import { RESET_PASSWORD_VIEW } from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.constants";
import { commonConstants } from "@/utils/constants";
import { commonConfig } from "@/utils/config";
import { loadingScreenOverlayService } from "@/services";

import AppButton from "@/components/AppButton";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTextField from "@/components/AppTextField";
import EmailVerificationTextField from "@/components/EmailVerificationTextField";
import PasswordVisibilityToggleTextField from "@/components/PasswordVisibilityToggleTextField";
import { Grid } from "@mui/material";
import { FastField, Field, Form, Formik, useFormikContext } from "formik";
import PhoneVerificationTextField from "@/components/PhoneVerificationTextField";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";
import ViewResetPasswordContext from "@/containers/SignInAndSignUpDialog/components/ViewResetPassword/ViewResetPassword.context";

import { useTranslation } from "next-i18next";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  useAppSelector,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";

import type { FastFieldProps, FormikHelpers, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";
import type { PhoneVerificationTextFieldProps } from "@/components/PhoneVerificationTextField";
import type { ConfirmationResult } from "firebase/auth";
import AppDialogActions from "@/components/AppDialogActions";

type ResetPasswordValues = {
  phone: string;
  country_code: string;
  verify_by: "email" | "phoneNumber";
  email: string;
  key: string;
  code: string;
  password: string;
  confirm_password: string;
};

const LeavePageConfirmation = () => {
  const { view } = useContext(SignInAndSignUpDialogContext);
  const { values, initialValues } = useFormikContext<ResetPasswordValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave:
      !_isEqual(values, initialValues) && view === RESET_PASSWORD_VIEW,
  });

  return null;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<ResetPasswordValues>();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      color="primary"
      variant="contained"
      type="submit"
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t("submit")}
    </AppButton>
  );
};

const PhoneFormField = (props: FastFieldProps) => {
  const { field, form, meta } = props;

  const { setFirebaseAuthConfirmationResult } = useContext(
    ViewResetPasswordContext
  );

  const { t } = useTranslation();

  const phoneError = formikHelpers.showError({
    error: meta.error,
    touched: meta.touched,
    submitCount: form.submitCount,
  });

  const handlePhoneVerificationOtpCodeSendSucceed: PhoneVerificationTextFieldProps["onPhoneVerificationOtpCodeSendSucceeded"] =
    (confirmationResult) => {
      const fullPhoneNumber = `${form.values.country_code}${field.value}`;
      setFirebaseAuthConfirmationResult({
        [fullPhoneNumber]: confirmationResult,
      });
    };

  return (
    <PhoneVerificationTextField
      label={t("phoneNumber")}
      placeholder={t("phoneNumber")}
      phoneFieldName="phone"
      phone={field.value}
      countryCodeFieldName="country_code"
      countryCode={form.values.country_code}
      phoneVerificationVariant="resetPassword"
      fullWidth
      bgColor="common.white"
      error={!!phoneError}
      helperText={phoneError}
      onBlur={() => {
        form.setFieldTouched("phone", true);
      }}
      onCountryCodeChange={field.onChange}
      onPhoneChange={field.onChange}
      onPhoneVerificationOtpCodeSendSucceeded={
        handlePhoneVerificationOtpCodeSendSucceed
      }
    />
  );
};

const SimpleForm = () => {
  const { handleSignInAndSignUpDialogClose, handleViewSignInPush } = useContext(
    SignInAndSignUpDialogContext
  );

  const { t } = useTranslation();

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle
        startActions={
          !$s_hasAuth ? (
            <AppIconButton
              edge="xy"
              color="text.primary"
              borderRadius="circular"
              onClick={handleViewSignInPush}
            >
              <AppSvgIcon component={ArrowLeftIcon} fontSize="small" />
            </AppIconButton>
          ) : undefined
        }
        onCloseButtonClick={handleSignInAndSignUpDialogClose}
      >
        {t("resetPassword")}
      </AppDialogTitle>
      <AppDialogContent>
        <Form>
          <Grid container spacing={1.25}>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <FastField name="verify_by">
                {({ field, form }: FastFieldProps) => (
                  <AppButton
                    variant="text"
                    size="small"
                    edge={["x", "bottom"]}
                    color="common.blue"
                    onClick={() => {
                      form.setFieldValue(
                        field.name,
                        field.value === "email" ? "phoneNumber" : "email"
                      );
                    }}
                  >
                    {t(
                      field.value === "email"
                        ? "verifyByPhoneNumber"
                        : "verifyByEmail"
                    )}
                  </AppButton>
                )}
              </FastField>
            </Grid>
            <Grid item xs={12}>
              <Field name="verify_by">
                {({ field }: FastFieldProps) =>
                  field.value === "email" ? (
                    <FastField name="email">
                      {({ field, form, meta }: FastFieldProps) => (
                        <EmailVerificationTextField
                          emailVerificationName="key"
                          emailVerificationVariant="resetPassword"
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
                  ) : (
                    <FastField
                      name="phone"
                      shouldUpdate={formikHelpers.shouldUpdate([
                        "country_code",
                      ])}
                    >
                      {(fastFieldProps: FastFieldProps) => (
                        <PhoneFormField {...fastFieldProps} />
                      )}
                    </FastField>
                  )
                }
              </Field>
            </Grid>
            <Grid item xs={12}>
              <FastField name="code">
                {({ field, form, meta }: FastFieldProps) => (
                  <AppTextField
                    label={t("verificationCode")}
                    placeholder={t("verificationCode")}
                    required
                    fullWidth
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
          </Grid>
        </Form>
      </AppDialogContent>
      <AppDialogActions>
        <SubmitButton />
      </AppDialogActions>
    </>
  );
};

const ViewResetPassword = () => {
  const {
    signInAndSignUpDialogOpen,
    handleViewSignInPush,
    handleSignInAndSignUpDialogClose,
  } = useContext(SignInAndSignUpDialogContext);

  const [firebaseAuthConfirmationResult, setFirebaseAuthConfirmationResult] =
    useState<{
      [phone: string]: ConfirmationResult;
    }>({});

  const formikRef = useRef<FormikProps<ResetPasswordValues>>(null!);
  const resetPasswordSourceRef = useRef<CancelTokenSource>();

  const { t, i18n } = useTranslation();

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const initialValues = useMemo<ResetPasswordValues>(
    () => ({
      phone: "",
      country_code: commonConfig.DEFAULT_PHONE_COUNTRY_CODE,
      verify_by: "email",
      email: "",
      code: "",
      key: "",
      password: "",
      confirm_password: "",
    }),
    []
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().when("verify_by", {
        is: "email",
        then: (schema) => schema.email().required(t("emailIsRequired")!),
      }),
      phone: yup.string().when("verify_by", {
        is: "phoneNumber",
        then: (schema) =>
          schema
            .required(t("phoneNumberIsRequired"))
            .test("valid-phone", t("phoneNumberIsInvalid")!, (phone, cxt) => {
              const { country_code } = cxt.parent;
              return (
                !phone ||
                isValidPhoneNumber(phone ?? "", {
                  defaultCallingCode: `${parseInt(country_code)}`,
                })
              );
            }),
      }),
      code: yup.string().required(t("verificationCodeIsRequired")!),
      password: yup
        .string()
        .required(t("passwordIsRequired")!)
        .min(commonConstants.PASSWORD_MIN_LENGTH, ({ min }) =>
          t("passwordMinCharacterWithCount", {
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

  const pushIncorrectVerificationCodeErrorMessage = () => {
    toast.error(t("verificationCodeIsIncorrect"));
  };

  const handleSubmit = async (
    values: ResetPasswordValues,
    formikHelpers: FormikHelpers<ResetPasswordValues>
  ) => {
    if (values.verify_by === "email") {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      resetPasswordSourceRef.current = axios.CancelToken.source();
      try {
        const { data: response } = await authApi.resetPassword({
          params: {
            email: values.email,
            password: values.password,
            checkpassword: values.confirm_password,
            code: values.code,
            key: values.key,
          },
          cancelToken: resetPasswordSourceRef.current.token,
        });
        if (!isMounted()) {
          loadingScreenOverlayService.close();
          return;
        }
        if (axiosHelpers.checkRequestSuccess(response)) {
          toast.success(t("resetSuccessfully"));
          if (!!$s_hasAuth) handleSignInAndSignUpDialogClose();
          else handleViewSignInPush();
          formikHelpers.resetForm({
            values: initialValues,
            submitCount: 0,
            errors: {},
            touched: {},
          });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          const message = axios.isAxiosError(error)
            ? (error.response?.data as any)?.message || error.message
            : "";
          toast.error(message);
        }
      }
      loadingScreenOverlayService.close();
      return;
    }
    // By phone number
    const fullPhoneNumber = `${values.country_code}${values.phone}`;
    if (!firebaseAuthConfirmationResult[fullPhoneNumber]) {
      pushIncorrectVerificationCodeErrorMessage();
      return;
    }
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    const firebaseAuthConfirmationResultResponse =
      await firebaseAuthConfirmationResult[fullPhoneNumber]
        .confirm(values.code)
        .catch(() => {
          return null;
        });
    if (!firebaseAuthConfirmationResultResponse) {
      pushIncorrectVerificationCodeErrorMessage();
      return;
    }
    const uid = firebaseAuthConfirmationResultResponse.user.uid;
    const idToken =
      await firebaseAuthConfirmationResultResponse.user.getIdToken();
    if (!idToken) {
      pushIncorrectVerificationCodeErrorMessage();
      return;
    }
    resetPasswordSourceRef.current?.cancel &&
      resetPasswordSourceRef.current.cancel();
    resetPasswordSourceRef.current = axios.CancelToken.source();
    try {
      const { data: response } = await authApi.resetPasswordByPhoneNumber({
        params: {
          country_code: values.country_code,
          id_token: idToken,
          password: values.password,
          password_confirmation: values.confirm_password,
          phone: values.phone,
          uid,
        },
        cancelToken: resetPasswordSourceRef.current.token,
      });
      if (!isMounted()) {
        loadingScreenOverlayService.close();
        return;
      }
      if (axiosHelpers.checkRequestSuccess(response)) {
        toast.success(t("resetSuccessfully"));
        setFirebaseAuthConfirmationResult({});
        if (!!$s_hasAuth) handleSignInAndSignUpDialogClose();
        else handleViewSignInPush();
        formikHelpers.resetForm({
          values: initialValues,
          submitCount: 0,
          errors: {},
          touched: {},
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      const message = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || error.message
        : "";
      toast.error(message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    if (!isMounted()) return;
    !signInAndSignUpDialogOpen &&
      formikRef.current.resetForm({
        values: initialValues,
        submitCount: 0,
        errors: {},
        touched: {},
      });
  }, [signInAndSignUpDialogOpen]);

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
    <ViewResetPasswordContext.Provider
      value={{
        setFirebaseAuthConfirmationResult,
      }}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <SimpleForm key={i18n.language} />
      </Formik>
    </ViewResetPasswordContext.Provider>
  );
};

export default ViewResetPassword;
