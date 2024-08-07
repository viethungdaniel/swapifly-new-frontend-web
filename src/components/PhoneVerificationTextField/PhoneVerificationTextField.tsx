import moment from "moment";
import { forwardRef, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { storageService } from "@/services";
import { storageKeyConstants } from "@/utils/constants";
import { axiosHelpers } from "@/utils/helpers";
import { commonApi } from "@/utils/apis";

import AppButton from "@/components/AppButton";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppLoading from "@/components/AppLoading";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneTextField from "@/components/PhoneTextField";

import {
  useAppSelector,
  useCountDownTimer,
  useEventCallback,
  useFirebase,
  useIsMounted,
} from "@/hooks";
import { useTranslation } from "react-i18next";

import type { ConfirmationResult } from "firebase/auth";
import type { PhoneTextFieldProps } from "../PhoneTextField";
import type { CancelTokenSource } from "axios";

type CustomPhoneVerificationTextFieldProps = {
  phoneVerificationVariant?: keyof typeof phoneVerificationVariantToConfigMap;
  onPhoneVerificationOtpCodeSendRequested?: () => void;
  onPhoneVerificationOtpCodeSendSucceeded?: (
    firebaseAuthConfirmationResult: ConfirmationResult
  ) => void;
  onPhoneVerificationOtpCodeSendFailed?: (reason: string) => void;
};

export type PhoneVerificationTextFieldProps = Omit<
  PhoneTextFieldProps,
  keyof CustomPhoneVerificationTextFieldProps
> &
  CustomPhoneVerificationTextFieldProps;

const phoneVerificationVariantToConfigMap = {
  resetPassword: {
    storageKey:
      storageKeyConstants.RESET_PASSWORD_PHONE_VERIFIER_COUNTDOWN_END_TIME,
    reduxStoreCommonKey: "reset_pwd_resend_otp_code_time",
  },
  bindPhone: {
    storageKey: storageKeyConstants.BIND_PHONE_VERIFIER_COUNTDOWN_END_TIME,
    reduxStoreCommonKey: "bind_phone_resend_otp_code_time",
  },
};

const VerificationButton = (
  props: Pick<
    PhoneVerificationTextFieldProps,
    | "phone"
    | "countryCode"
    | "phoneVerificationVariant"
    | "error"
    | "onPhoneVerificationOtpCodeSendSucceeded"
    | "onPhoneVerificationOtpCodeSendFailed"
    | "onPhoneVerificationOtpCodeSendRequested"
  > & {
    submitting: boolean;
  }
) => {
  const {
    phoneVerificationVariant,
    phone,
    countryCode,
    submitting,
    error,
    onPhoneVerificationOtpCodeSendRequested,
    onPhoneVerificationOtpCodeSendSucceeded,
    onPhoneVerificationOtpCodeSendFailed,
  } = props;

  const value = `${countryCode}${phone}`;

  const [countDownEndTime, setCountDownEndTime] = useState<number>(() => {
    return 0;
  });

  const { asSeconds } = useCountDownTimer(countDownEndTime);

  const { t } = useTranslation();

  const appFirebase = useFirebase();

  const id = useId();

  const recaptchaContainerAnchorId = `VerificationButton-recaptchaContainer-${id}`;
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const validatePhoneNumberExistedSourceRef = useRef<CancelTokenSource | null>(
    null
  );

  const $s_resendPhoneCodeTime = useAppSelector(
    (state) =>
      state.common.settings[
        phoneVerificationVariantToConfigMap[phoneVerificationVariant!]
          .reduxStoreCommonKey as keyof typeof state.common.settings
      ]
  );

  const startCountDown = () => {
    const startDateTime = new Date(
      moment().add($s_resendPhoneCodeTime, "seconds").toString()
    ).getTime();

    const phoneToCountDownEndTimeMap =
      storageService.getLocalItem<{ [phone: string]: number }>(
        phoneVerificationVariantToConfigMap[phoneVerificationVariant!]
          .storageKey
      ) ?? {};

    storageService.saveLocalItem(
      phoneVerificationVariantToConfigMap[phoneVerificationVariant!].storageKey,
      {
        ...phoneToCountDownEndTimeMap,
        [`${value}`]: startDateTime,
      }
    );
    setCountDownEndTime(startDateTime);
  };

  const handlePhoneVerificationCodeSendFailed = useEventCallback(
    (reason: string) => {
      onPhoneVerificationOtpCodeSendFailed &&
        onPhoneVerificationOtpCodeSendFailed(reason);
    }
  );

  const handlePhoneVerificationCodeSendSucceed = useEventCallback(
    (firebaseAuthConfirmationResult: ConfirmationResult) => {
      toast.success(t("sentSuccessfully")!);
      startCountDown();
      onPhoneVerificationOtpCodeSendSucceeded &&
        onPhoneVerificationOtpCodeSendSucceeded(firebaseAuthConfirmationResult);
    }
  );

  const sendPhoneVerificationCode = async () => {
    onPhoneVerificationOtpCodeSendRequested &&
      onPhoneVerificationOtpCodeSendRequested();
    if (phoneVerificationVariant === "bindPhone") {
      validatePhoneNumberExistedSourceRef.current = axios.CancelToken.source();
      try {
        const { data: response } = await commonApi.validatePhoneNumberExisted({
          params: {
            phone: phone!,
            country_code: countryCode!,
          },
          cancelToken: validatePhoneNumberExistedSourceRef.current.token,
        });
        if (!isMounted()) return;
        if (!axiosHelpers.checkRequestSuccess(response)) {
          const message = response.message;
          handlePhoneVerificationCodeSendFailed(message);
          return;
        } else if (!!response.data.is_existed) {
          const message = t("registeredPhoneNumberErrorMessage");
          handlePhoneVerificationCodeSendFailed(message);
          return;
        }
      } catch (error) {
        if (!isMounted()) return;
        if (axios.isCancel(error)) return;
        const message = axiosHelpers.getErrorMessage(error);
        handlePhoneVerificationCodeSendFailed(message);
        return;
      }
    }

    try {
      if (!recaptchaVerifierRef.current)
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          appFirebase.auth,
          recaptchaContainerAnchorId,
          {
            size: "invisible",
          }
        );
      const response = await signInWithPhoneNumber(
        appFirebase.auth,
        value,
        recaptchaVerifierRef.current!
      );
      if (!isMounted()) return;
      handlePhoneVerificationCodeSendSucceed(response);
    } catch (error) {
      if (!isMounted()) return;
      const message = axiosHelpers.getErrorMessage(error);
      handlePhoneVerificationCodeSendFailed(message);
    }
  };

  const handlePhoneVerificationButtonClick: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    const phoneToCountDownEndTimeMap =
      storageService.getLocalItem<{ [phone: string]: number }>(
        phoneVerificationVariantToConfigMap[phoneVerificationVariant!]
          .storageKey
      ) ?? {};
    const phoneCountDownEndTime = phoneToCountDownEndTimeMap[`${value}`];
    const dateTime = new Date().getTime();
    if (!!phoneCountDownEndTime && phoneCountDownEndTime > dateTime) {
      setCountDownEndTime(phoneToCountDownEndTimeMap[`${value}`]);
    } else {
      sendPhoneVerificationCode();
    }
  };

  const isMounted = useIsMounted();

  useEffect(() => {
    setCountDownEndTime(0);
  }, [value]);

  useEffect(() => {
    return () => {
      validatePhoneNumberExistedSourceRef.current?.cancel &&
        validatePhoneNumberExistedSourceRef.current.cancel();
    };
  }, []);

  return (
    <>
      <AppButton
        edge={"x"}
        disabled={!phone || submitting || !!error || asSeconds > 0}
        startIcon={
          submitting && (
            <AppLoading variant="circular" size={20} sx={{ ml: "2px" }} />
          )
        }
        onClick={handlePhoneVerificationButtonClick}
      >
        {submitting
          ? `${t("sending")}...`
          : asSeconds > 0
          ? t("resendInSecond", {
              count: asSeconds,
            })
          : t("verification")}
      </AppButton>
      <div id={recaptchaContainerAnchorId} style={{ display: "none" }} />
    </>
  );
};

const PhoneVerificationTextField = forwardRef(
  (props: PhoneVerificationTextFieldProps, ref: React.ForwardedRef<any>) => {
    const {
      value,
      phoneVerificationVariant = "resetPassword",
      disabled,
      error,
      helperText,
      onPhoneVerificationOtpCodeSendSucceeded,
      onPhoneVerificationOtpCodeSendFailed,
      onPhoneVerificationOtpCodeSendRequested,
      onPhoneChange,
      ...rest
    } = props;

    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handlePhoneChange: PhoneTextFieldProps["onPhoneChange"] = (
      ...payload
    ) => {
      onPhoneChange && onPhoneChange(...payload);
      setErrorMessage("");
    };

    return (
      <PhoneTextField
        ref={ref}
        disabled={submitting || disabled}
        {...rest}
        helperText={errorMessage || helperText}
        error={!!errorMessage || !!error}
        onPhoneChange={handlePhoneChange}
        value={value}
        endAdornment={
          <AppInputAdornment position="end">
            <VerificationButton
              submitting={submitting}
              phone={rest.phone}
              error={error}
              countryCode={rest.countryCode}
              phoneVerificationVariant={phoneVerificationVariant}
              onPhoneVerificationOtpCodeSendRequested={() => {
                onPhoneVerificationOtpCodeSendRequested &&
                  onPhoneVerificationOtpCodeSendRequested();
                setSubmitting(true);
                setErrorMessage("");
              }}
              onPhoneVerificationOtpCodeSendSucceeded={(
                firebaseAuthConfirmationResult
              ) => {
                onPhoneVerificationOtpCodeSendSucceeded &&
                  onPhoneVerificationOtpCodeSendSucceeded(
                    firebaseAuthConfirmationResult
                  );
                setSubmitting(false);
              }}
              onPhoneVerificationOtpCodeSendFailed={(reason) => {
                onPhoneVerificationOtpCodeSendFailed &&
                  onPhoneVerificationOtpCodeSendFailed(reason);
                setErrorMessage(reason);
                setSubmitting(false);
              }}
            />
          </AppInputAdornment>
        }
      />
    );
  }
);

export default PhoneVerificationTextField;
