import * as yup from "yup";
import _isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import axios from "axios";
import { bindActionCreators } from "redux";
import { isValidPhoneNumber } from "libphonenumber-js";

import { axiosHelpers, formikHelpers, reduxHelpers } from "@/utils/helpers";
import { loadingScreenOverlayService } from "@/services";
import { storeAuthAction } from "@/store";
import { commonConfig } from "@/utils/config";

import { FastField, Form, Formik, useFormikContext } from "formik";
import AppDialog, { AppDialogProps } from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppButton from "@/components/AppButton";
import AppPaper from "@/components/AppPaper";
import AppTextField from "@/components/AppTextField";
import AppDialogActions from "@/components/AppDialogActions";
import AppTypography from "@/components/AppTypography";
import PhoneVerificationTextField from "@/components/PhoneVerificationTextField";

import PhoneVerificationSuccessSvg from "@@/public/images/svgs/phone-verification-success.svg";

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

import PhoneVerificationFormDialogContext from "./PhoneVerificationFormDialog.context";

import { useTranslation } from "next-i18next";

import useStyles from "./PhoneVerificationFormDialog.styles";

import type { FastFieldProps, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";
import type { ConfirmationResult } from "firebase/auth";
import type { PhoneVerificationTextFieldProps } from "@/components/PhoneVerificationTextField";

type PhoneVerificationValues = {
  phone: string;
  country_code: string;
  code: string;
};

export type PhoneVerificationFormDialogProps = {
  open?: boolean;
  defaultPhoneFormValues?: {
    phone?: string;
    country_code?: string;
  };
  onClose?: AppDialogProps["onClose"];
  onSubmitSucceed?: () => void;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const LeavePageConfirmation = () => {
  const { open } = useContext(PhoneVerificationFormDialogContext);

  const { values, initialValues } = useFormikContext<PhoneVerificationValues>();

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
  const { onClose } = useContext(PhoneVerificationFormDialogContext);

  const { t } = useTranslation();

  const { classes } = useStyles();

  return (
    <>
      <AppDialogTitle onCloseButtonClick={onClose as any}></AppDialogTitle>
      <AppDialogContent className={classes.submissionSuccessContent}>
        <PhoneVerificationSuccessSvg className={classes.submissionSuccessSvg} />
        <AppTypography variant="bodyMed18" align="center">
          {t("phoneVerificationSuccessful")}
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

const PhoneFormField = (props: FastFieldProps) => {
  const { field, form, meta } = props;

  const { t } = useTranslation();

  const { setFirebaseAuthConfirmationResult } = useContext(
    PhoneVerificationFormDialogContext
  );

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
      phoneFieldName="phone"
      phone={field.value}
      countryCodeFieldName="country_code"
      countryCode={form.values.country_code}
      phoneVerificationVariant="bindPhone"
      fullWidth
      bgColor="common.white"
      error={!!phoneError}
      helperText={phoneError}
      sx={{
        mb: 1.25,
      }}
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
  const { onClose } = useContext(PhoneVerificationFormDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("phoneVerification")}
      </AppDialogTitle>
      <AppDialogContent>
        <FastField
          name="phone"
          shouldUpdate={formikHelpers.shouldUpdate(["country_code"])}
        >
          {(fastFieldProps: FastFieldProps) => (
            <PhoneFormField {...fastFieldProps} />
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

const PhoneVerificationFormDialog = (
  props: PhoneVerificationFormDialogProps
) => {
  const { open, defaultPhoneFormValues, onClose, onSubmitSucceed } = props;

  const [submitted, setSubmitted] = useState(false);

  const [firebaseAuthConfirmationResult, setFirebaseAuthConfirmationResult] =
    useState<{
      [phone: string]: ConfirmationResult;
    }>({});

  const formikRef = useRef<FormikProps<PhoneVerificationValues>>(null!);
  const submitPhoneVerificationRequestSourceRef =
    useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const initialValues = useMemo<PhoneVerificationValues>(() => {
    return {
      phone: defaultPhoneFormValues?.phone ?? "",
      country_code:
        defaultPhoneFormValues?.country_code ??
        commonConfig.DEFAULT_PHONE_COUNTRY_CODE,
      code: "",
    };
  }, [defaultPhoneFormValues?.country_code, defaultPhoneFormValues?.phone]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      phone: yup
        .string()
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
      code: yup.string().required(t("verificationCodeIsRequired")),
    });
  }, [t]);

  const pushIncorrectVerificationCodeErrorMessage = () => {
    toast.error(t("verificationCodeIsIncorrect"));
  };

  const updateFormikValueOnOpen = useEventCallback(() => {
    formikRef.current.resetForm({
      values: initialValues,
    });
  });

  const handleSubmit = async (values: PhoneVerificationValues) => {
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
      loadingScreenOverlayService.close();
      return;
    }
    const uid = firebaseAuthConfirmationResultResponse.user.uid;
    const idToken =
      await firebaseAuthConfirmationResultResponse.user.getIdToken();
    if (!idToken) {
      pushIncorrectVerificationCodeErrorMessage();
      loadingScreenOverlayService.close();
      return;
    }
    submitPhoneVerificationRequestSourceRef.current?.cancel &&
      submitPhoneVerificationRequestSourceRef.current.cancel();
    submitPhoneVerificationRequestSourceRef.current =
      axios.CancelToken.source();
    try {
      const response = await reduxHelpers.callActionWithPromise(
        $s_authAction.bindPhoneNumberSaga,
        {
          params: {
            country_code: values.country_code,
            phone: values.phone,
            id_token: idToken,
            uid,
          },
          cancelToken: submitPhoneVerificationRequestSourceRef.current.token,
        }
      );
      if (!isMounted()) {
        loadingScreenOverlayService.close();
        return;
      }
      if (axiosHelpers.checkRequestSuccess(response)) {
        setSubmitted(true);
        onSubmitSucceed && onSubmitSucceed();
        formikRef.current.resetForm({
          values: {
            code: "",
            country_code: "",
            phone: "",
          },
          submitCount: 0,
          errors: {},
          touched: {},
        });
        setFirebaseAuthConfirmationResult({});
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      const message = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || error?.message
        : "";
      toast.error(message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    open && updateFormikValueOnOpen();
  }, [open]);

  const isMounted = useIsMounted();

  return (
    <PhoneVerificationFormDialogContext.Provider
      value={{
        open,
        setFirebaseAuthConfirmationResult,
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
    </PhoneVerificationFormDialogContext.Provider>
  );
};

export default PhoneVerificationFormDialog;
