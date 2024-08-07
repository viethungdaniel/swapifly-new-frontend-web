import moment from "moment";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers";
import AppTextField from "@/components/AppTextField";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";

import { useTranslation } from "next-i18next";

import type { Moment } from "moment";
import type { AppTimePickerContextValue } from "@/components/AppTimePicker/AppTimePicker.context";
import type { AppTextFieldProps } from "@/components/AppTextField";
import type { TimeFieldProps } from "@mui/x-date-pickers";

class OverriddenAdapterMoment extends AdapterMoment {}

type CustomAppTimePicker = {
  slotProps?: {
    textField?: AppTextFieldProps;
  };
  value?: string | null;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: Moment | null
  ) => void;
};

export type AppTimePickerProps = Omit<
  TimeFieldProps<Moment>,
  keyof CustomAppTimePicker
> &
  CustomAppTimePicker;

const TimeTextField = forwardRef((props: any, ref: React.ForwardedRef<any>) => {
  const { InputProps, ownerState, ...rest } = props;

  return <AppTextField ref={ref} readOnly={InputProps.readOnly} {...rest} />;
});

const AppTimePicker = forwardRef(
  (props: AppTimePickerProps, ref: React.ForwardedRef<any>) => {
    const {
      value: controlledValue,
      format = "HH:mm",
      slotProps,
      onChange,
      ...rest
    } = props;

    const [value, setValue] = useState<Moment | null>(() => {
      return !!controlledValue && moment(controlledValue, format).isValid()
        ? moment(controlledValue, format)
        : null;
    });

    const { i18n } = useTranslation();

    const curValueRef = useRef(controlledValue);
    const datePickerRef = useRef<HTMLDivElement>(null!);

    const changeValue: AppTimePickerContextValue["changeValue"] = (
      newValue
    ) => {
      const newDateValue =
        !!newValue && moment(newValue).isValid()
          ? newValue.format(format)
          : !!newValue
          ? null
          : "";
      curValueRef.current = newDateValue;
      setValue(newValue);
      !!onChange &&
        onChange(
          {
            target: {
              value: newDateValue,
              name: rest.name,
            },
          } as any,
          newValue
        );
    };

    const handleChange: TimeFieldProps<Moment>["onChange"] = (newValue) => {
      changeValue(newValue);
    };

    useImperativeHandle(ref, () => datePickerRef.current);

    useEffect(() => {
      if (controlledValue !== curValueRef.current) {
        curValueRef.current = controlledValue;
        const newValue: typeof value =
          !!controlledValue && moment(controlledValue, format).isValid()
            ? moment(controlledValue, format)
            : null;
        setValue(newValue);
      }
    }, [controlledValue, format]);

    return (
      <LocalizationProvider
        dateAdapter={OverriddenAdapterMoment}
        adapterLocale={i18n.language}
      >
        <TimeField
          ref={datePickerRef}
          value={value}
          format={format}
          {...rest}
          slotProps={{
            ...(slotProps as any),
          }}
          slots={{
            textField: TimeTextField,
          }}
          onChange={handleChange}
        />
      </LocalizationProvider>
    );
  }
);

export default AppTimePicker;
