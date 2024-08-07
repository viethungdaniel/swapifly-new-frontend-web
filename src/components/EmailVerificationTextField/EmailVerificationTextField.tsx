import axios from "axios";
import * as yup from "yup";
import moment from "moment";
import { toast } from "react-toastify";

import { storageService } from "@/services";
import { storageKeyConstants } from "@/utils/constants";
import { commonApi } from "@/utils/apis";
import { axiosHelpers } from "@/utils/helpers";

import AppButton from "@/components/AppButton";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppLoading from "@/components/AppLoading";

import { forwardRef, useEffect, useRef, useState } from "react";
import {
  useAppSelector,
  useCountDownTimer,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import type { AppTextFieldProps } from "@/components/AppTextField";
import type { CancelTokenSource } from "axios";

type CustomEmailVerificationTextFieldProps = {
  emailVerificationName?: string;
  emailVerificationVariant?: keyof typeof emailVerificationVariantToConfigMap;
  onEmailVerificationCodeSendRequested?: (event: React.SyntheticEvent) => void;
  onEmailVerificationCodeSendSucceeded?: (
    event: {
      target: {
        name: string;
        value: string;
      };
    },
    payload: { key: string }
  ) => void;
  onEmailVerificationCodeSendFailed?: (
    event: {
      target: {
        name: string;
        value: string;
      };
    },
    reason: string
  ) => void;
};

type EmailVerificationTextFieldProps = Omit<
  AppTextFieldProps,
  "endAdornment" | keyof CustomEmailVerificationTextFieldProps
> &
  CustomEmailVerificationTextFieldProps;

const emailVerificationVariantToConfigMap = {
  bindEmail: {
    storageKey: storageKeyConstants.BIND_EMAIL_VERIFIER_COUNTDOWN_END_TIME,
    reduxStoreCommonKey: "resend_email_code_time",
  },
  signUp: {
    storageKey: storageKeyConstants.SIGN_UP_EMAIL_VERIFIER_COUNTDOWN_END_TIME,
    reduxStoreCommonKey: "resend_email_code_time",
  },
  resetPassword: {
    storageKey:
      storageKeyConstants.RESET_PASSWORD_EMAIL_VERIFIER_COUNTDOWN_END_TIME,
    reduxStoreCommonKey: "reset_pwd_resend_email_code_time",
  },
};

const VerificationButton = (
  props: Pick<
    EmailVerificationTextFieldProps,
    | "value"
    | "emailVerificationName"
    | "emailVerificationVariant"
    | "emailVerificationName"
    | "onEmailVerificationCodeSendSucceeded"
    | "onEmailVerificationCodeSendFailed"
    | "onEmailVerificationCodeSendRequested"
  > & {
    submitting: boolean;
  }
) => {
  const {
    emailVerificationName,
    emailVerificationVariant,
    value,
    submitting,
    onEmailVerificationCodeSendRequested,
    onEmailVerificationCodeSendSucceeded,
    onEmailVerificationCodeSendFailed,
  } = props;

  const [countDownEndTime, setCountDownEndTime] = useState<number>(() => {
    return 0;
  });
  const [validEmail, setValidEmail] = useState(false);

  const sendEmailVerificationCodeSourceRef = useRef<CancelTokenSource | null>(
    null!
  );

  const { t } = useTranslation();

  const { asSeconds } = useCountDownTimer(countDownEndTime);

  const $s_resendEmailCodeTime = useAppSelector(
    (state) =>
      state.common.settings[
        emailVerificationVariantToConfigMap[emailVerificationVariant!]
          .reduxStoreCommonKey as keyof typeof state.common.settings
      ]
  );

  const startCountDown = () => {
    const startDateTime = new Date(
      moment().add($s_resendEmailCodeTime, "seconds").toString()
    ).getTime();

    const emailToCountDownEndTimeMap =
      storageService.getLocalItem<{ [email: string]: number }>(
        emailVerificationVariantToConfigMap[emailVerificationVariant!]
          .storageKey
      ) ?? {};

    storageService.saveLocalItem(
      emailVerificationVariantToConfigMap[emailVerificationVariant!].storageKey,
      {
        ...emailToCountDownEndTimeMap,
        [`${value}`]: startDateTime,
      }
    );
    setCountDownEndTime(startDateTime);
  };

  const handleEmailVerificationCodeSendFailed = useEventCallback(
    (data: { message: string }) => {
      onEmailVerificationCodeSendFailed &&
        onEmailVerificationCodeSendFailed(
          {
            target: {
              name: emailVerificationName!,
              value: data.message,
            },
          } as any,
          data.message
        );
    }
  );

  const handleEmailVerificationCodeSendSucceed = useEventCallback(
    (data: { key: string }) => {
      toast.success(t("sentSuccessfully"));
      startCountDown();
      onEmailVerificationCodeSendSucceeded &&
        onEmailVerificationCodeSendSucceeded(
          {
            target: {
              name: emailVerificationName!,
              value: data.key,
            },
          } as any,
          {
            key: data.key,
          }
        );
    }
  );

  const sendEmailVerificationCode = async (event: React.SyntheticEvent) => {
    sendEmailVerificationCodeSourceRef.current?.cancel &&
      sendEmailVerificationCodeSourceRef.current.cancel();
    sendEmailVerificationCodeSourceRef.current = axios.CancelToken.source();
    onEmailVerificationCodeSendRequested &&
      onEmailVerificationCodeSendRequested(event);

    try {
      switch (emailVerificationVariant) {
        case "signUp": {
          const { data: response } =
            await commonApi.sendRegistrationEmailVerificationCode({
              params: {
                email: value as string,
              },
              cancelToken: sendEmailVerificationCodeSourceRef.current.token,
            });
          if (!isMounted()) return;
          if (axiosHelpers.checkRequestInvalidToken(response)) {
            handleEmailVerificationCodeSendSucceed(response.data);
          } else {
            handleEmailVerificationCodeSendFailed({
              message: response.message,
            });
          }
          break;
        }
        case "resetPassword": {
          const { data: response } =
            await commonApi.sendPasswordResetEmailVerificationCode({
              params: {
                email: value as string,
              },
              cancelToken: sendEmailVerificationCodeSourceRef.current.token,
            });
          if (!isMounted()) return;
          if (axiosHelpers.checkRequestInvalidToken(response)) {
            handleEmailVerificationCodeSendSucceed(response.data);
          } else {
            handleEmailVerificationCodeSendFailed({
              message: response.message,
            });
          }
          break;
        }
        case "bindEmail": {
          const { data: response } =
            await commonApi.sendBindEmailVerificationCode({
              params: {
                email: value as string,
              },
              cancelToken: sendEmailVerificationCodeSourceRef.current.token,
            });
          if (!isMounted()) return;
          if (axiosHelpers.checkRequestInvalidToken(response)) {
            handleEmailVerificationCodeSendSucceed(response.data);
          } else {
            handleEmailVerificationCodeSendFailed({
              message: response.message,
            });
          }
          break;
        }
      }
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "";
      handleEmailVerificationCodeSendFailed({ message: message });
    }
  };

  const handleEmailVerificationButtonClick: React.MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    const emailToCountDownEndTimeMap =
      storageService.getLocalItem<{ [email: string]: number }>(
        emailVerificationVariantToConfigMap[emailVerificationVariant!]
          .storageKey
      ) ?? {};
    const emailCountDownEndTime = emailToCountDownEndTimeMap[`${value}`];
    const dateTime = new Date().getTime();
    if (!!emailCountDownEndTime && emailCountDownEndTime > dateTime) {
      setCountDownEndTime(emailToCountDownEndTimeMap[`${value}`]);
    } else {
      sendEmailVerificationCode(event);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const validateEmail = async () => {
      const valid = await yup
        .string()
        .required()
        .email()
        .validate(value)
        .then(() => true)
        .catch(() => false);
      isSubscribed && setValidEmail(valid);
    };
    setCountDownEndTime(0);
    validateEmail();

    return () => {
      isSubscribed = false;
      setValidEmail(false);
      sendEmailVerificationCodeSourceRef.current?.cancel &&
        sendEmailVerificationCodeSourceRef.current.cancel();
    };
  }, [value]);

  const isMounted = useIsMounted();

  return (
    <AppButton
      edge={"x"}
      disabled={submitting || !validEmail || asSeconds > 0}
      startIcon={
        submitting && (
          <AppLoading variant="circular" size={20} sx={{ ml: "2px" }} />
        )
      }
      onClick={handleEmailVerificationButtonClick}
    >
      {submitting
        ? `${t("sending")}...`
        : asSeconds > 0
        ? t(`resendInSecond`, {
            count: asSeconds,
          })
        : t("verification")}
    </AppButton>
  );
};

const EmailVerificationTextField = forwardRef(
  (props: EmailVerificationTextFieldProps, ref: React.ForwardedRef<any>) => {
    const {
      value,
      emailVerificationVariant = "resetPassword",
      emailVerificationName = "",
      disabled,
      error,
      helperText,
      onEmailVerificationCodeSendSucceeded,
      onEmailVerificationCodeSendFailed,
      onEmailVerificationCodeSendRequested,
      onChange,
      ...rest
    } = props;

    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(event);
      setErrorMessage("");
    };

    return (
      <AppTextField
        ref={ref}
        disabled={submitting || disabled}
        {...rest}
        inputProps={{
          inputMode: "email",
          ...rest.inputProps,
        }}
        helperText={errorMessage || helperText}
        error={!!errorMessage || !!error}
        onChange={handleInputChange}
        value={value}
        endAdornment={
          <AppInputAdornment position="end">
            <VerificationButton
              value={value}
              submitting={submitting}
              emailVerificationName={emailVerificationName}
              emailVerificationVariant={emailVerificationVariant}
              onEmailVerificationCodeSendRequested={(event) => {
                onEmailVerificationCodeSendRequested &&
                  onEmailVerificationCodeSendRequested(event);
                setSubmitting(true);
              }}
              onEmailVerificationCodeSendSucceeded={(event, data) => {
                onEmailVerificationCodeSendSucceeded &&
                  onEmailVerificationCodeSendSucceeded(event, data);
                setSubmitting(false);
              }}
              onEmailVerificationCodeSendFailed={(event, reason) => {
                onEmailVerificationCodeSendFailed &&
                  onEmailVerificationCodeSendFailed(event, reason);
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

export default EmailVerificationTextField;
