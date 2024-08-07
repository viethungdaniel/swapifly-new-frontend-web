import * as yup from "yup";
import { toast } from "react-toastify";
import _isEqual from "lodash/isEqual";
import axios from "axios";

import { axiosHelpers, formikHelpers } from "@/utils/helpers";
import loadingScreenOverlay from "@/services/loadingScreenOverlay";
import { commonConstants } from "@/utils/constants";
import { authApi } from "@/utils/apis";
import { RESET_PASSWORD_VIEW } from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.constants";

import { FastField, Form, Formik, useFormikContext } from "formik";
import { Box, Divider, useMediaQuery } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppToolbar from "@/components/AppToolbar";
import AppTypography from "@/components/AppTypography";
import StickyAppBar from "@/components/StickyAppBar";
import AppContainer from "@/components/AppContainer";
import PasswordVisibilityToggleTextField from "@/components/PasswordVisibilityToggleTextField";

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useAuthUser, useIsMounted, useOnLeavePageConfirmation } from "@/hooks";

import useStyles from "./UserAccountChangePassword.styles";

import type { FastFieldProps, FormikHelpers, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";

export type ChangeUserPasswordValues = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};

const LeavePageConfirmation = () => {
  const { values, initialValues } =
    useFormikContext<ChangeUserPasswordValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues),
  });

  return null;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<ChangeUserPasswordValues>();

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

const CurrentPasswordFormField = (props: FastFieldProps) => {
  const { field, form, meta } = props;

  const { openSignInAndSignUpDialog } = useAuthUser();

  const { t } = useTranslation();

  const handleForgotPasswordOpen = () => {
    openSignInAndSignUpDialog({
      view: RESET_PASSWORD_VIEW,
    });
  };

  return (
    <>
      <PasswordVisibilityToggleTextField
        label={t("currentPassword")}
        autoComplete="off"
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
        sx={{ mb: 0.5 }}
        {...field}
      />
      <Box display="flex" justifyContent="flex-end" mb={0.5}>
        <AppButton
          variant="text"
          size="small"
          color="text.secondary"
          edge="x"
          onClick={handleForgotPasswordOpen}
        >
          {t("forgotPassword")}
        </AppButton>
      </Box>
    </>
  );
};

const SimpleForm = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <Form autoComplete="off">
      <LeavePageConfirmation />
      <StickyAppBar thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}>
        <AppToolbar>
          <AppTypography
            variant="titleSemi20"
            textTransform="capitalize"
            flex={1}
          >
            {t("changePassword")}
          </AppTypography>
          <div>
            <SubmitButton />
          </div>
        </AppToolbar>
      </StickyAppBar>
      {!isTabletDown && <Divider />}
      <AppContainer>
        <div className={classes.content}>
          <FastField name="old_password">
            {(fastFieldProps: FastFieldProps) => (
              <CurrentPasswordFormField {...fastFieldProps} />
            )}
          </FastField>
          <FastField name="new_password">
            {({ field, form, meta }: FastFieldProps) => (
              <PasswordVisibilityToggleTextField
                label={t("newPassword")}
                placeholder={t("passwordRangeWords", {
                  min: commonConstants.PASSWORD_MIN_LENGTH,
                  max: commonConstants.PASSWORD_MAX_LENGTH,
                })}
                autoComplete="off"
                fullWidth
                sx={{ mb: 1.25 }}
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
          <FastField name="new_password_confirmation">
            {({ field, form, meta }: FastFieldProps) => (
              <PasswordVisibilityToggleTextField
                label={t("confirmNewPassword")}
                placeholder={t("passwordRangeWords", {
                  min: commonConstants.PASSWORD_MIN_LENGTH,
                  max: commonConstants.PASSWORD_MAX_LENGTH,
                })}
                autoComplete="off"
                fullWidth
                sx={{ mb: 1.25 }}
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
        </div>
      </AppContainer>
    </Form>
  );
};

const UserAccountChangePassword = () => {
  const { t } = useTranslation();

  const formikRef = useRef<FormikProps<ChangeUserPasswordValues>>(null!);
  const changeAuthUserPasswordSourceRef = useRef<CancelTokenSource | null>(
    null
  );

  const initialValues = useMemo<ChangeUserPasswordValues>(
    () => ({
      new_password_confirmation: "",
      old_password: "",
      new_password: "",
    }),
    []
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      old_password: yup.string().required(t("currentPasswordIsRequired")!),
      new_password: yup
        .string()
        .required(t("newPasswordIsRequired")!)
        .min(commonConstants.PASSWORD_MIN_LENGTH, ({ min }) =>
          t("newPasswordMinCharacterWithCount", {
            count: min,
          })
        )
        .max(commonConstants.PASSWORD_MAX_LENGTH, ({ max }) =>
          t("newPasswordMaxCharacterWithCount", {
            count: max,
          })
        ),
      new_password_confirmation: yup
        .string()
        .required(t("confirmMewPasswordIsRequired")!)
        .oneOf([yup.ref("new_password")], t("confirmNewPasswordMustMatch")!),
    });
  }, [t]);

  const handleSubmit = async (
    values: ChangeUserPasswordValues,
    formikHelpers: FormikHelpers<ChangeUserPasswordValues>
  ) => {
    loadingScreenOverlay.fire(`${"submitting"}...`);
    changeAuthUserPasswordSourceRef.current?.cancel &&
      changeAuthUserPasswordSourceRef.current.cancel();
    changeAuthUserPasswordSourceRef.current = axios.CancelToken.source();
    try {
      const { data: response } = await authApi.changePassword({
        params: {
          new_password: values.new_password,
          new_password_confirmation: values.new_password_confirmation,
          old_password: values.old_password,
        },
        cancelToken: changeAuthUserPasswordSourceRef.current?.token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        formikHelpers.resetForm({
          values: initialValues,
          submitCount: 0,
          errors: {},
          touched: {},
        });
        toast.success(t("updatedSuccessfully"));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const message = axiosHelpers.getErrorMessage(error);
      toast.error(message);
    }
    loadingScreenOverlay.close();
  };

  useEffect(() => {
    return () => {
      changeAuthUserPasswordSourceRef.current?.cancel &&
        changeAuthUserPasswordSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <SimpleForm />
    </Formik>
  );
};

export default UserAccountChangePassword;
