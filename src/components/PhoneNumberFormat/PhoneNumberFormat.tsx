import { commonConfig } from "@/utils/config";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import MaskedInput from "react-text-mask";

type CustomPhoneNumberFormatProps = {
  countryCode?: string;
};

type PhoneNumberFormatProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  keyof CustomPhoneNumberFormatProps
> &
  CustomPhoneNumberFormatProps;

const PhoneNumberFormat = forwardRef(
  (props: PhoneNumberFormatProps, ref: React.ForwardedRef<any>) => {
    const { countryCode = commonConfig.DEFAULT_PHONE_COUNTRY_CODE, ...rest } =
      props;

    const maskedInputRef = useRef<any>();

    const phoneNumberMask = useMemo(() => {
      const basicPhoneNumberMasks = [
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
      basicPhoneNumberMasks.splice(-((countryCode ?? "").length - 1));
      return countryCode === "+852"
        ? [/4|5|6|7|9/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        : basicPhoneNumberMasks;
    }, [countryCode]);

    useImperativeHandle(ref, () => maskedInputRef.current.inputElement);

    return (
      <MaskedInput
        ref={maskedInputRef}
        type="tel"
        {...rest}
        mask={phoneNumberMask}
        placeholderChar={"\u2000"}
        guide={false}
      />
    );
  }
);

export default PhoneNumberFormat;
