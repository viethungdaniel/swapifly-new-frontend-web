import * as yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import _isEqual from "lodash/isEqual";

import { formikHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";

import AppInputAdornment from "@/components/AppInputAdornment";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppButton from "@/components/AppButton";
import PhoneTextField from "@/components/PhoneTextField";
import PhoneVerificationFormDialog from "@/containers/PhoneVerificationFormDialog";

import CheckCircleIcon from "@@/public/images/icons/check-circle.svg";

import { useEffect, useMemo, useState } from "react";

import { useFormik } from "formik";
import {
  useAppSelector,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";
import { useTranslation } from "next-i18next";

type PhoneFormValues = {
  phone: string;
  country_code: string;
  is_verified_phone: boolean;
};

const PhoneForm = () => {
  const $s_authUserPhone = useAppSelector((state) => state.auth.user?.phone);
  const $s_authUserCountryCode = useAppSelector(
    (state) => state.auth.user?.country_code
  );

  const { t } = useTranslation();

  const phoneFormikInitialValues = useMemo<PhoneFormValues>(() => {
    return {
      phone: $s_authUserPhone ?? "",
      country_code:
        $s_authUserCountryCode! || commonConfig.DEFAULT_PHONE_COUNTRY_CODE,
      is_verified_phone: !!$s_authUserPhone,
    };
  }, [$s_authUserPhone, $s_authUserCountryCode]);

  const phoneFormik = useFormik<PhoneFormValues>({
    initialValues: phoneFormikInitialValues,
    validationSchema: yup.object().shape({
      phone: yup.string().when("is_verified_phone", {
        is: false,
        then: (schema) =>
          schema.test(
            "valid-phone",
            t("phoneNumberIsInvalid")!,
            (phone, cxt) => {
              const { country_code } = cxt.parent;

              return (
                !phone ||
                isValidPhoneNumber(phone, {
                  defaultCallingCode: `${parseInt(country_code)}`,
                })
              );
            }
          ),
      }),
    }),
    onSubmit: () => {
      setPhoneVerificationFormDialogOpen(true);
    },
  });

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(
      phoneFormik.values,
      phoneFormik.initialValues
    ),
  });

  const [phoneVerificationFormDialogOpen, setPhoneVerificationFormDialogOpen] =
    useState(false);

  const phoneError = formikHelpers.showError({
    error: phoneFormik.errors.phone,
    touched: phoneFormik.touched.phone,
    submitCount: phoneFormik.submitCount,
  });
  const isVerifiedPhone = !!phoneFormik.values.is_verified_phone;

  const handlePhoneVerificationFormDialogClose = () => {
    setPhoneVerificationFormDialogOpen(false);
  };

  const handlePhoneVerificationFormDialogSubmitSucceed = () => {
    phoneFormik.setFieldValue("phone_verified", true);
  };

  useEffect(() => {
    if (!isMounted()) return;
    phoneFormik.resetForm({
      values: phoneFormikInitialValues,
    });
  }, [phoneFormikInitialValues]);

  const isMounted = useIsMounted();

  return (
    <>
      <PhoneTextField
        label={t("phoneNumber")}
        placeholder={t("phoneNumber")}
        disabled={isVerifiedPhone}
        phoneFieldName="phone"
        countryCodeFieldName="country_code"
        phone={phoneFormik.values.phone}
        countryCode={phoneFormik.values.country_code}
        bgColor="common.white"
        fullWidth
        endAdornment={
          <AppInputAdornment position="end">
            {isVerifiedPhone ? (
              <AppSvgIcon component={CheckCircleIcon} color="success.main" />
            ) : (
              <AppButton
                disabled={!!phoneError || !phoneFormik.values.phone}
                edge="x"
                variant="text"
                color="primary"
                onClick={phoneFormik.handleSubmit as any}
              >
                {t("verification")}
              </AppButton>
            )}
          </AppInputAdornment>
        }
        error={!!phoneError}
        helperText={phoneError}
        sx={{
          mb: 1.25,
        }}
        onBlur={phoneFormik.handleBlur}
        onCountryCodeChange={(event) => {
          phoneFormik.handleChange(event);
          phoneFormik.setFieldTouched("phone", true);
        }}
        onPhoneChange={phoneFormik.handleChange}
      />
      <PhoneVerificationFormDialog
        open={phoneVerificationFormDialogOpen}
        defaultPhoneFormValues={{
          phone: phoneFormik.values.phone,
          country_code: phoneFormik.values.country_code,
        }}
        onSubmitSucceed={handlePhoneVerificationFormDialogSubmitSucceed}
        onClose={handlePhoneVerificationFormDialogClose}
      />
    </>
  );
};

export default PhoneForm;
