import * as yup from "yup";
import _isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import axios from "axios";
import { bindActionCreators } from "redux";

import { axiosHelpers, formikHelpers, reduxHelpers } from "@/utils/helpers";
import { loadingScreenOverlayService } from "@/services";
import { storeAuthAction } from "@/store";
import { commonConstants } from "@/utils/constants";

import { FastField, Form, Formik, useFormikContext } from "formik";
import AppDialog, { AppDialogProps } from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppButton from "@/components/AppButton";
import AppPaper from "@/components/AppPaper";
import AppTextField from "@/components/AppTextField";
import AppDialogActions from "@/components/AppDialogActions";
import AppTypography from "@/components/AppTypography";
import EmailVerificationTextField from "@/components/EmailVerificationTextField";
import PasswordVisibilityToggleTextField from "@/components/PasswordVisibilityToggleTextField";

import EmailVerificationSuccessSvg from "@@/public/images/svgs/email-verification-success.svg";

import {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useAppDispatch,
  useEventCallback,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";

import EmailVerificationFormDialogContext from "./EmailVerificationFormDialog.context";

import { useTranslation } from "next-i18next";

import useStyles from "./EmailVerificationFormDialog.styles";

import type { FastFieldProps, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";

type EmailVerificationValues = {
  email: string;
  email_key: string;
  code: string;
  password: string;
  confirm_password: string;
};

export type EmailVerificationFormDialogProps = {
  open?: boolean;
  defaultEmailFormValues?: {
    email?: string;
  };
  onClose?: AppDialogProps["onClose"];
  onSubmitSucceeded?: () => void;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const LeavePageConfirmation = () => {
  const { open } = useContext(EmailVerificationFormDialogContext);

  const { values, initialValues } = useFormikContext<EmailVerificationValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues) && !!open,
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

const SubmissionSuccessContent = () => {
  const { onClose } = useContext(EmailVerificationFormDialogContext);

  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <>
      <AppDialogTitle onCloseButtonClick={onClose as any}></AppDialogTitle>
      <AppDialogContent className={classes.submissionSuccessContent}>
        <EmailVerificationSuccessSvg className={classes.submissionSuccessSvg} />
        <AppTypography variant="bodyMed18" align="center">
          {t("emailVerificationSuccess")}
        </AppTypography>
      </AppDialogContent>
      <AppDialogActions>
        <AppButton
          fullWidth
          color="common.darkNeutral"
          variant="contained"
          type="submit"
          onClick={onClose as any}
        >
          {t("done")}
        </AppButton>
      </AppDialogActions>
    </>
  );
};

const SimpleForm = () => {
  const { onClose } = useContext(EmailVerificationFormDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("emailVerification")}
      </AppDialogTitle>
      <AppDialogContent>
        <FastField
          name="email"
          shouldUpdate={formikHelpers.shouldUpdate(["email_key"])}
        >
          {({ field, form, meta }: FastFieldProps) => (
            <EmailVerificationTextField
              emailVerificationName="email_key"
              emailVerificationVariant="bindEmail"
              bgColor="common.white"
              label="Email"
              placeholder="Email"
              fullWidth
              required
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
              onEmailVerificationCodeSendSucceeded={field.onChange}
            />
          )}
        </FastField>
        <FastField name="code">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("verificationCode")}
              placeholder={t("verificationCode")}
              bgColor="common.white"
              required
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
        <FastField name="password">
          {({ field, form, meta }: FastFieldProps) => (
            <PasswordVisibilityToggleTextField
              label="Password"
              required
              placeholder={t("passwordRangeWords", {
                min: commonConstants.PASSWORD_MIN_LENGTH,
                max: commonConstants.PASSWORD_MAX_LENGTH,
              })}
              bgColor="common.white"
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
        <FastField name="confirm_password">
          {({ field, form, meta }: FastFieldProps) => (
            <PasswordVisibilityToggleTextField
              label={t("confirmPassword")}
              required
              bgColor="common.white"
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
      </AppDialogContent>
      <AppDialogActions>
        <SubmitButton />
      </AppDialogActions>
    </>
  );
};

const EmailVerificationFormDialog = (
  props: EmailVerificationFormDialogProps
) => {
  const { open, defaultEmailFormValues, onClose, onSubmitSucceeded } = props;

  const [submitted, setSubmitted] = useState(false);

  const formikRef = useRef<FormikProps<EmailVerificationValues>>(null!);
  const submitEmailVerificationRequestSourceRef =
    useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const initialValues = useMemo<EmailVerificationValues>(() => {
    return {
      email: defaultEmailFormValues?.email ?? "",
      email_key: "",
      password: "",
      confirm_password: "",
      code: "",
    };
  }, [defaultEmailFormValues?.email]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email(t("emailIsInvalid"))
        .required(t("emailIsRequired")),
      code: yup.string().required("verificationCodeIsRequired"),
      password: yup
        .string()
        .required(t("Password is required")!)
        .min(commonConstants.PASSWORD_MIN_LENGTH, ({ min }) =>
          t("passwordMinCharacterWithCount", {
            min: min,
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

  const updateFormikValueOnOpen = useEventCallback(() => {
    formikRef.current.resetForm({
      values: initialValues,
    });
  });

  const handleSubmit = async (values: EmailVerificationValues) => {
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    submitEmailVerificationRequestSourceRef.current?.cancel &&
      submitEmailVerificationRequestSourceRef.current.cancel();
    submitEmailVerificationRequestSourceRef.current =
      axios.CancelToken.source();
    try {
      const response = await reduxHelpers.callActionWithPromise(
        $s_authAction.bindEmailSaga,
        {
          params: {
            email: values.email,
            code: values.code,
            key: values.email_key,
            checkpassword: values.password,
            password: values.password,
          },
          cancelToken: submitEmailVerificationRequestSourceRef.current.token,
        }
      );
      if (!isMounted()) {
        loadingScreenOverlayService.close();
        return;
      }
      if (axiosHelpers.checkRequestSuccess(response)) {
        setSubmitted(true);
        onSubmitSucceeded && onSubmitSucceeded();
        formikRef.current.resetForm({
          values,
          submitCount: 0,
          errors: {},
          touched: {},
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      const message = axiosHelpers.getErrorMessage(error);
      toast.error(message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    open && updateFormikValueOnOpen();
  }, [open]);

  const isMounted = useIsMounted();

  return (
    <EmailVerificationFormDialogContext.Provider
      value={{
        open,
        onClose,
      }}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <AppDialog
          maxWidth="sm"
          scroll="body"
          mobileScroll="paper"
          mobileFullScreen
          fullWidth
          keepMounted
          open={!!open}
          sx={{
            pointerEvents: !!open ? "auto" : "none",
          }}
          PaperComponent={PaperForm}
          onClose={onClose as any}
          onTransitionEnd={() => {
            !open && setSubmitted(false);
          }}
        >
          {!submitted && <SimpleForm />}
          {!!submitted && <SubmissionSuccessContent />}
        </AppDialog>
      </Formik>
    </EmailVerificationFormDialogContext.Provider>
  );
};

export default EmailVerificationFormDialog;
