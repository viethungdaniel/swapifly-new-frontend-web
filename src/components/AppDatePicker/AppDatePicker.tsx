import moment from "moment";

import { ClickAwayListener, Popper, Grow } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateField } from "@mui/x-date-pickers/DateField";
import AppTextField from "@/components/AppTextField";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppPaper from "@/components/AppPaper";
import AppDateCalendar from "@/components/AppDateCalendar";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppIconButton from "@/components/AppIconButton";

import CalendarIcon from "@@/public/images/icons/calendar.svg";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useContext,
} from "react";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";

import AppDatePickerContext from "@/components/AppDatePicker/AppDatePicker.context";

import type { Moment } from "moment";
import type { AppDateCalendarProps } from "@/components/AppDateCalendar";
import type { AppDatePickerContextValue } from "@/components/AppDatePicker/AppDatePicker.context";
import type { DateFieldProps } from "@mui/x-date-pickers/DateField";
import type { AppTextFieldProps } from "@/components/AppTextField";

class OverriddenAdapterMoment extends AdapterMoment {
  getWeekdays = () => {
    return this.moment.localeData(this.locale).weekdaysShort();
  };
}

type CustomAppDatePicker = {
  DateCalendarProps?: AppDateCalendarProps;
  slotProps?: {
    textField?: AppTextFieldProps;
  };
  value?: string | null;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: Moment | null
  ) => void;
};

export type AppDatePickerProps = Omit<
  DateFieldProps<Moment>,
  keyof CustomAppDatePicker
> &
  CustomAppDatePicker;

const CalendarPickerPopper = () => {
  const {
    value,
    calendarPickerPopperAnchorEl,
    calendarPickerPopperOpen,
    AppDatePickerProps,
    setCalendarPickerPopperOpen,
    changeValue,
  } = useContext(AppDatePickerContext);

  const { DateCalendarProps, format } = AppDatePickerProps;

  const theme = useTheme();

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (calendarPickerPopperAnchorEl) {
      const targetEle = event.target as Element;
      if (calendarPickerPopperAnchorEl.contains(targetEle)) return;
    }
    setCalendarPickerPopperOpen(false);
  };

  const handleChange: AppDateCalendarProps["onChange"] = (
    _,
    newValue,
    selectionState
  ) => {
    if (selectionState === "finish") {
      changeValue(moment(newValue, format));
      setCalendarPickerPopperOpen(false);
    }
  };

  if (!calendarPickerPopperAnchorEl) return null;

  return (
    <Popper
      open={!!calendarPickerPopperOpen}
      anchorEl={calendarPickerPopperAnchorEl}
      placement="bottom-end"
      transition
      keepMounted
      modifiers={[
        {
          name: "flip",
          enabled: true,
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            altAxis: true,
          },
        },
      ]}
      style={{
        zIndex: theme.zIndex.tooltip,
      }}
    >
      {({ TransitionProps, placement }) => (
        <ClickAwayListener onClickAway={handleClose}>
          <Grow
            {...TransitionProps}
            timeout={theme.transitions.duration.shortest}
            style={{
              transformOrigin:
                placement === "bottom-end" ? "100% 0 0" : "100% 100% 0",
            }}
          >
            <AppPaper boxShadowVariant="menuPopper" sx={{ maxWidth: "100vw" }}>
              <AppDateCalendar
                format={format}
                {...DateCalendarProps}
                dayOfWeekFormatter={(day) => day}
                value={!!value ? value.format(format) : null}
                onChange={handleChange}
              />
            </AppPaper>
          </Grow>
        </ClickAwayListener>
      )}
    </Popper>
  );
};

const DateTextField = forwardRef((props: any, ref: React.ForwardedRef<any>) => {
  const { InputProps, ownerState, ...rest } = props;

  const { toggleCalendarPickerPopper } = useContext(AppDatePickerContext);

  const handleCalendarIconButtonClick = () => {
    toggleCalendarPickerPopper();
  };

  return (
    <AppTextField
      ref={ref}
      {...rest}
      endAdornment={
        <AppInputAdornment position="end">
          {rest?.endAdornment}
          <AppIconButton
            borderRadius={rest?.borderRadius}
            color="text.primary"
            edge="end"
            data-role="appDatePicker-toggleCalendarPicker"
            onClick={handleCalendarIconButtonClick}
          >
            <AppSvgIcon component={CalendarIcon} />
          </AppIconButton>
        </AppInputAdornment>
      }
    />
  );
});

const AppDatePicker = forwardRef(
  (props: AppDatePickerProps, ref: React.ForwardedRef<any>) => {
    const {
      value: controlledValue,
      format = "DD-MM-YYYY",
      DateCalendarProps,
      slotProps,
      minDate,
      maxDate,
      onChange,
      ...rest
    } = props;

    const [value, setValue] = useState<Moment | null>(() => {
      return !!controlledValue && moment(controlledValue, format).isValid()
        ? moment(controlledValue, format)
        : null;
    });

    const [calendarPickerPopperAnchorEl, setCalendarPickerPopperAnchorEl] =
      useState<HTMLDivElement | null>(null);
    const [calendarPickerPopperOpen, setCalendarPickerPopperOpen] =
      useState(false);

    const { i18n } = useTranslation();

    const curValueRef = useRef(controlledValue);
    const datePickerRef = useRef<HTMLDivElement>(null!);

    const changeValue: AppDatePickerContextValue["changeValue"] = (
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

    const handleChange: DateFieldProps<Moment>["onChange"] = (newValue) => {
      changeValue(newValue);
    };

    const toggleCalendarPickerPopper = () => {
      setCalendarPickerPopperAnchorEl(datePickerRef.current);
      setCalendarPickerPopperOpen(!calendarPickerPopperOpen);
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
      <AppDatePickerContext.Provider
        value={{
          value,
          calendarPickerPopperAnchorEl,
          calendarPickerPopperOpen,
          AppDatePickerProps: {
            ...props,
            format,
            DateCalendarProps: {
              disableFuture: rest.disableFuture,
              disablePast: rest.disablePast,
              disabled: rest.disabled,
              minDate,
              maxDate,
              shouldDisableDate: rest.shouldDisableDate,
              shouldDisableMonth: rest.shouldDisableMonth,
              shouldDisableYear: rest.shouldDisableYear,
              ...DateCalendarProps,
            },
          },
          changeValue,
          setValue,
          setCalendarPickerPopperOpen,
          toggleCalendarPickerPopper,
        }}
      >
        <LocalizationProvider
          dateAdapter={OverriddenAdapterMoment}
          adapterLocale={i18n.language}
        >
          <DateField
            ref={datePickerRef}
            value={value}
            format={format}
            {...rest}
            slotProps={{
              ...(slotProps as any),
            }}
            slots={{
              textField: DateTextField,
            }}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleChange}
          />
          <CalendarPickerPopper />
        </LocalizationProvider>
      </AppDatePickerContext.Provider>
    );
  }
);

export default AppDatePicker;
