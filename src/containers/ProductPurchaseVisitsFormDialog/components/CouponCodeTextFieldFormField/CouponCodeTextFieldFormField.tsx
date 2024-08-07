import _isEqual from "lodash/isEqual";
import axios from "axios";
import * as yup from "yup";

import { axiosHelpers } from "@/utils/helpers";

import { impressionPackageOrderApi } from "@/utils/apis";

import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppLoading from "@/components/AppLoading";
import CouponCodeFormat from "@/components/CouponCodeFormat";
import AppButton from "@/components/AppButton";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import CancelSharpIcon from "@@/public/images/icons/cancel-sharp.svg";
import RadioButtonCheckedIcon from "@@/public/images/icons/radio-button-checked.svg";

import { useEffect, useRef, useState } from "react";
import { useEventCallback, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { FastFieldProps, FieldInputProps } from "formik";
import type { CancelTokenSource } from "axios";
import type { ImpressionPackageOrderFormValues } from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog";

const UsernameFormField = (
  props: FastFieldProps<ImpressionPackageOrderFormValues>
) => {
  const { form } = props;
  const field = props.field as unknown as FieldInputProps<
    ImpressionPackageOrderFormValues["impression_package_order_coupon_code"]
  >;

  const { t } = useTranslation();

  const couponCodeValidationSchema = yup
    .string()
    .trim()
    .test(
      "required-impression-package",
      t("pleaseSelectImpressionPackage"),
      () => {
        return !!form.values.impression_package_id;
      }
    )
    .transform((value) => (value === "" ? undefined : value))
    .matches(/^[A-Za-z0-9]+$/, {
      excludeEmptyString: true,
      message: t("promotionCodeOnlyAcceptsAlphabetsOrNumbers"),
    })
    .min(3, ({ min }) =>
      t("promotionCodeMinCharacterWithCount_one", {
        count: min,
      })
    );

  const [
    impressionPackageOrderCouponCodeChecking,
    setImpressionPackageOrderCouponCodeChecking,
  ] = useState(false);
  const [
    impressionPackageOrderCouponCodeError,
    setImpressionPackageOrderCouponCodeError,
  ] = useState("");
  const [
    impressionPackageOrderCouponCodeValid,
    setImpressionPackageOrderCouponCodeValid,
  ] = useState(!!form.values.impression_package_order_coupon_state);

  const checkedUniqueUsernameSourceRef = useRef<CancelTokenSource | null>(null);

  const checkImpressionPackageOrderCouponCode = useEventCallback(
    async (couponCode: string) => {
      if (
        !impressionPackageOrderCouponCodeValid ||
        !form.values.impression_package_id
      )
        return;
      setImpressionPackageOrderCouponCodeChecking(true);
      setImpressionPackageOrderCouponCodeError("");
      checkedUniqueUsernameSourceRef.current?.cancel &&
        checkedUniqueUsernameSourceRef.current.cancel();
      checkedUniqueUsernameSourceRef.current = axios.CancelToken.source();
      try {
        const { data: response } =
          await impressionPackageOrderApi.checkImpressionPackageOrderCouponCode(
            {
              params: {
                exposure_id: form.values.impression_package_id!,
                promotion_code: couponCode,
              },
              cancelToken: checkedUniqueUsernameSourceRef.current?.token,
            }
          );
        if (!isMounted()) return;
        if (axiosHelpers.checkRequestSuccess(response)) {
          form.setFieldValue(
            "impression_package_order_coupon_state",
            response.data
          );
        } else {
          setImpressionPackageOrderCouponCodeError(response.message);
        }
      } catch (error) {
        if (!isMounted()) return;
        if (axios.isCancel(error)) return;
        const message = axiosHelpers.getErrorMessage(error);
        setImpressionPackageOrderCouponCodeError(message);
      }
      setImpressionPackageOrderCouponCodeChecking(false);
    }
  );

  const validateCouponCode = useEventCallback(async (couponCode: string) => {
    if (!couponCode.trim()) {
      setImpressionPackageOrderCouponCodeChecking(false);
      setImpressionPackageOrderCouponCodeError("");
      setImpressionPackageOrderCouponCodeValid(false);
      return;
    }
    const couponCodeError = await couponCodeValidationSchema
      .validate(couponCode)
      .then(() => "")
      .catch((error: Error) => error.message);
    setImpressionPackageOrderCouponCodeValid(!couponCodeError);
    setImpressionPackageOrderCouponCodeError(couponCodeError ?? "");
  });

  const handleCouponCodeChange = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    checkedUniqueUsernameSourceRef.current?.cancel &&
      checkedUniqueUsernameSourceRef.current.cancel();
    checkedUniqueUsernameSourceRef.current = null;
    const newCouponCode = event.target.value;
    setImpressionPackageOrderCouponCodeChecking(false);
    setImpressionPackageOrderCouponCodeError("");
    setImpressionPackageOrderCouponCodeValid(false);
    form.setFieldValue(field.name, newCouponCode);
  };

  const handleCouponCodeApply = () => {
    checkImpressionPackageOrderCouponCode(field.value);
  };

  const handleCouponCodeRemove = () => {
    form.setValues((prevValues) => ({
      ...prevValues,
      impression_package_order_coupon_code: "",
      impression_package_order_coupon_state: null,
    }));
    setImpressionPackageOrderCouponCodeValid(false);
  };

  useEffect(() => {
    validateCouponCode(field.value);
  }, [form.values.impression_package_id, field.value]);

  useEffect(() => {
    return () => {
      checkedUniqueUsernameSourceRef.current?.cancel &&
        checkedUniqueUsernameSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <>
      <AppTextField
        label={t("promotionCode")}
        fullWidth
        readOnly={!!form.values.impression_package_order_coupon_state}
        required
        bgColor="common.white"
        error={!!impressionPackageOrderCouponCodeError}
        helperText={
          !!form.values.impression_package_order_coupon_state ? (
            <>
              <AppSvgIcon
                component={RadioButtonCheckedIcon}
                sx={{ fontSize: 16, verticalAlign: "middle" }}
              />{" "}
              {t("promotionCodeYouEnteredHasBeenSuccessfullyApplied")}
            </>
          ) : (
            !impressionPackageOrderCouponCodeChecking &&
            !!impressionPackageOrderCouponCodeError && (
              <>
                <AppSvgIcon
                  component={CancelSharpIcon}
                  sx={{ fontSize: 16, verticalAlign: "middle" }}
                />{" "}
                {impressionPackageOrderCouponCodeError}
              </>
            )
          )
        }
        endAdornment={
          <AppInputAdornment position="end">
            {impressionPackageOrderCouponCodeChecking && (
              <AppLoading size={24} sx={{ mr: 1 }} />
            )}
            {!!form.values.impression_package_order_coupon_state ? (
              <AppIconButton
                edge={["end", "y"]}
                color="text.primary"
                onClick={handleCouponCodeRemove}
              >
                <AppSvgIcon component={CancelSharpIcon} fontSize="inherit" />
              </AppIconButton>
            ) : (
              <AppButton
                edge={["end", "y"]}
                color="common.blue"
                disabled={
                  impressionPackageOrderCouponCodeChecking ||
                  !impressionPackageOrderCouponCodeValid
                }
                onClick={handleCouponCodeApply}
              >
                {t("apply")}
              </AppButton>
            )}
          </AppInputAdornment>
        }
        formHelperTextProps={{
          color: !!form.values.impression_package_order_coupon_state
            ? "success.main"
            : undefined,
        }}
        inputComponent={CouponCodeFormat}
        {...field}
        onChange={handleCouponCodeChange}
      />
    </>
  );
};

export default UsernameFormField;
