import { forwardRef } from "react";

import { NumericFormat } from "react-number-format";

import type { NumericFormatProps } from "react-number-format";

export interface AppNumberFormatProps
  extends Omit<NumericFormatProps, "onChange"> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppNumberFormat = forwardRef(
  (props: AppNumberFormatProps, ref: React.ForwardedRef<any>) => {
    const {
      name,
      allowNegative = false,
      valueIsNumericString,
      onChange,
      ...rest
    } = props;

    return (
      <NumericFormat
        thousandSeparator
        valueIsNumericString={valueIsNumericString}
        allowNegative={allowNegative}
        name={name}
        inputMode="decimal"
        {...rest}
        getInputRef={ref}
        onValueChange={(values: any) => {
          onChange &&
            onChange({
              target: {
                name: name,
                value: !!valueIsNumericString
                  ? values.value == ""
                    ? ""
                    : Number(values.value)
                  : values.value,
                floatValue: values.floatValue,
              },
            } as any);
        }}
      />
    );
  }
);

export default AppNumberFormat;
