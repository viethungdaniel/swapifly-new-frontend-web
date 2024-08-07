import * as yup from "yup";
import _isEqual from "lodash/isEqual";

import { formikHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";

import AppInputAdornment from "@/components/AppInputAdornment";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppButton from "@/components/AppButton";
import EmailVerificationFormDialog from "@/containers/EmailVerificationFormDialog";
import AppTextField from "@/components/AppTextField";

import CheckCircleIcon from "@@/public/images/icons/check-circle.svg";

import { useEffect, useMemo, useState } from "react";

import { useFormik } from "formik";
import {
  useAppSelector,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";
import { useTranslation } from "next-i18next";

type EmailFormValues = {
  email: string;
  is_verified_email: boolean;
};

const EmailForm = () => {
  const $s_authUserEmail = useAppSelector((state) => state.auth.user?.email);

  const { t } = useTranslation();

  const emailFormikInitialValues = useMemo<EmailFormValues>(() => {
    return {
      email: $s_authUserEmail ?? "",
      is_verified_email: !!$s_authUserEmail,
    };
  }, [$s_authUserEmail]);

  const emailFormik = useFormik<EmailFormValues>({
    initialValues: emailFormikInitialValues,
    validationSchema: yup.object().shape({
      email: yup.string().when("is_verified_email", {
        is: false,
        then: (schema) =>
          schema
            .email(t("emailIsInvalid"))
            .max(commonConstants.TITLE_TEXT_MAX_LENGTH, ({ max }) =>
              t("emailMaxCharacterWithCount", {
                count: max,
              })
            ),
      }),
    }),
    onSubmit: () => {
      setEmailVerificationFormDialogOpen(true);
    },
  });

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(
      emailFormik.values,
      emailFormik.initialValues
    ),
  });

  const [emailVerificationFormDialogOpen, setEmailVerificationFormDialogOpen] =
    useState(false);

  const emailError = formikHelpers.showError({
    error: emailFormik.errors.email,
    touched: emailFormik.touched.email,
    submitCount: emailFormik.submitCount,
  });
  const isVerifiedEmail = !!emailFormik.values.is_verified_email;

  const handleEmailVerificationFormDialogClose = () => {
    setEmailVerificationFormDialogOpen(false);
  };

  const handleEmailVerificationFormDialogSubmitSucceeded = () => {
    emailFormik.setFieldValue("is_verified_email", true);
  };

  useEffect(() => {
    if (!isMounted()) return;
    emailFormik.resetForm({
      values: emailFormikInitialValues,
    });
  }, [emailFormikInitialValues]);

  const isMounted = useIsMounted();

  return (
    <>
      <AppTextField
        label="Email"
        disabled={isVerifiedEmail}
        name="email"
        inputProps={{
          inputMode: "email",
        }}
        value={emailFormik.values.email}
        bgColor="common.white"
        fullWidth
        endAdornment={
          <AppInputAdornment position="end">
            {isVerifiedEmail ? (
              <AppSvgIcon component={CheckCircleIcon} color="success.main" />
            ) : (
              <AppButton
                disabled={!!emailError || !emailFormik.values.email}
                edge="x"
                variant="text"
                color="primary"
                onClick={emailFormik.handleSubmit as any}
              >
                {t("verification")}
              </AppButton>
            )}
          </AppInputAdornment>
        }
        error={!!emailError}
        helperText={emailError}
        sx={{
          mb: 1.25,
        }}
        onBlur={emailFormik.handleBlur}
        onChange={emailFormik.handleChange}
      />
      <EmailVerificationFormDialog
        open={emailVerificationFormDialogOpen}
        defaultEmailFormValues={{
          email: emailFormik.values.email,
        }}
        onSubmitSucceeded={handleEmailVerificationFormDialogSubmitSucceeded}
        onClose={handleEmailVerificationFormDialogClose}
      />
    </>
  );
};

export default EmailForm;
