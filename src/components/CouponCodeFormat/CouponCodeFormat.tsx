import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import MaskedInput from "react-text-mask";

type CustomCouponCodeFormatProps = {};

type CouponCodeFormatProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  keyof CustomCouponCodeFormatProps
> &
  CustomCouponCodeFormatProps;

const CouponCodeFormat = forwardRef(
  (props: CouponCodeFormatProps, ref: React.ForwardedRef<any>) => {
    const { ...rest } = props;

    const maskedInputRef = useRef<any>();

    const couponCodeMask = useMemo(() => {
      return [...Array.from(Array(30)).keys()].map(() => /[a-zA-Z0-9]/);
    }, []);

    useImperativeHandle(ref, () => maskedInputRef.current.inputElement);

    return (
      <MaskedInput
        ref={maskedInputRef}
        {...rest}
        mask={couponCodeMask}
        placeholderChar={"\u2000"}
        guide={false}
      />
    );
  }
);

export default CouponCodeFormat;
