import _isEqual from "lodash/isEqual";
import axios from "axios";

import { axiosHelpers, commonHelpers, formikHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";
import { userApi } from "@/utils/apis";

import AppTextField from "@/components/AppTextField";
import AppTypography from "@/components/AppTypography";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppFormHelperText from "@/components/AppFormHelperText";
import AppLoading from "@/components/AppLoading";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useDebouncedCallback, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { FastFieldProps } from "formik";
import type { CancelTokenSource } from "axios";

const UsernameFormField = (props: FastFieldProps) => {
  const { field, form, meta } = props;

  const $s_authUser = useAppSelector((state) => state.auth.user);

  const { t } = useTranslation();

  const [uniqueUsernameChecking, setUniqueUsernameChecking] = useState(false);
  const [uniqueUsernameError, setUniqueUsernameError] = useState("");
  const checkUniqueUsernameSourceRef = useRef<CancelTokenSource | null>(null);

  const fieldError =
    formikHelpers.showError({
      error: meta.error !== "username-existed" ? meta.error : "",
      touched: meta.touched,
      submitCount: form.submitCount,
    }) || uniqueUsernameError;

  const checkUniqueUsername = async (username: string) => {
    setUniqueUsernameChecking(true);
    setUniqueUsernameError("");
    checkUniqueUsernameSourceRef.current?.cancel &&
      checkUniqueUsernameSourceRef.current.cancel();
    checkUniqueUsernameSourceRef.current = axios.CancelToken.source();
    try {
      const { data: response } = await userApi.checkUniqueUsername({
        params: {
          username,
        },
        cancelToken: checkUniqueUsernameSourceRef.current?.token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        setUniqueUsernameChecking(false);
        form.setFieldValue("server_side_username_valid", true);
      }
    } catch (error) {
      if (!isMounted()) return;
      if (axios.isAxiosError(error)) {
        setUniqueUsernameError("");
        setUniqueUsernameChecking(false);
        return;
      }
      const message = axiosHelpers.getErrorMessage(error);
      setUniqueUsernameError(message);
    }
    setUniqueUsernameChecking(false);
  };

  const debounceCheckUniqueUsername = useDebouncedCallback(
    checkUniqueUsername,
    500
  );

  const handleChange = async (event: React.FocusEvent<HTMLInputElement>) => {
    debounceCheckUniqueUsername.cancel();
    checkUniqueUsernameSourceRef.current?.cancel &&
      checkUniqueUsernameSourceRef.current.cancel();
    checkUniqueUsernameSourceRef.current = null;
    const value = event.target.value;
    form.setFieldError(field.name, "");
    form.setValues((prevValues: any) => ({
      ...prevValues,
      username: value,
      server_side_username_valid: false,
    }));
  };

  useEffect(() => {
    if (!!field.value && !!meta.error && meta.error === "username-existed") {
      debounceCheckUniqueUsername(field.value);
    }
  }, [field.value, meta.error]);

  useEffect(() => {
    return () => {
      checkUniqueUsernameSourceRef.current?.cancel &&
        checkUniqueUsernameSourceRef.current.cancel();
      checkUniqueUsernameSourceRef.current = null;
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <>
      <AppTextField
        label={t("username")}
        fullWidth
        required
        bgColor="common.white"
        error={!!fieldError}
        helperText={fieldError}
        endAdornment={
          <AppInputAdornment position="end">
            {uniqueUsernameChecking && <AppLoading size={24} sx={{ mr: 1 }} />}
            <AppTypography component="span" color="text.secondary">
              @
            </AppTypography>
          </AppInputAdornment>
        }
        {...field}
        onChange={handleChange}
      />
      <AppFormHelperText color="text.secondary">
        {t("yourPublicUsernameIsSameAsYourTimelineAddress")}:{" "}
        {commonConfig.BASE_DOMAIN}/
        {field.value ||
          (!!form.values.nickname
            ? commonHelpers.generateUserSlug({
                id: $s_authUser?.id,
                nickname: form.values.nickname,
                username: field.value,
              })
            : t("yourDotUsername"))}
      </AppFormHelperText>
      <AppFormHelperText color="text.secondary">
        {t("fullUsernameContainsValidation")}
      </AppFormHelperText>
    </>
  );
};

export default UsernameFormField;
