import { createContext, forwardRef, useContext, useMemo } from "react";
import moment from "moment";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import AppSvgIcon from "@/components/AppSvgIcon";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";
import AppIconButton from "@/components/AppIconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import useStyles from "./AppDateCalendar.styles";

import { LocalizationProvider, PickersDay } from "@mui/x-date-pickers";

import { useTranslation } from "next-i18next";

import type { Moment } from "moment";
import type { AppIconButtonProps } from "@/components/AppIconButton";
import type { DateCalendarProps, PickersDayProps } from "@mui/x-date-pickers";
import type { PickerSelectionState } from "@mui/x-date-pickers/internals";

type CustomAppDateCalendarSlotProps = {
  nextIconButton?: AppIconButtonProps;
  previousIconButton?: AppIconButtonProps;
  switchViewButton?: AppIconButtonProps;
};

type DateValue = string | string[] | null;

type CustomAppDateCalendarProps = {
  multiple?: boolean;
  format?: string;
  name?: string;
  value?: DateValue;
  slotProps?: Omit<
    DateCalendarProps<Moment>["slotProps"],
    keyof CustomAppDateCalendarSlotProps
  > &
    CustomAppDateCalendarSlotProps;
  onChange?: (
    event: {
      target: {
        name: string;
        value: DateValue;
      };
    },
    value: string | string[],
    selectionState?: PickerSelectionState
  ) => void;
};

export type AppDateCalendarProps = Omit<
  DateCalendarProps<Moment>,
  keyof CustomAppDateCalendarProps
> &
  CustomAppDateCalendarProps;

type AppDateCalendarContextValue = Pick<
  AppDateCalendarProps,
  "multiple" | "format" | "value"
>;

const AppDateCalendarContext = createContext<AppDateCalendarContextValue>(
  null!
);

const StyledSwitchViewIcon = forwardRef<any, any>((props, ref) => (
  <AppSvgIcon
    ref={ref}
    component={ArrowDropDownIcon}
    fontSize="inherit"
    color="text.primary"
    {...props}
  />
));

class OverriddenAdapterMoment extends AdapterMoment {
  getWeekdays = () => {
    return this.moment.localeData(this.locale).weekdaysShort();
  };
}

const StyledArrowLeftIcon = forwardRef<any, any>((props, ref) => (
  <AppSvgIcon
    ref={ref}
    component={ArrowLeftIcon}
    fontSize="inherit"
    color="text.primary"
    {...props}
  />
));

const StyledArrowRightIcon = forwardRef<any, any>((props, ref) => (
  <AppSvgIcon
    ref={ref}
    component={ArrowRightIcon}
    fontSize="inherit"
    color="text.primary"
    {...props}
  />
));

const SwitchViewButton = forwardRef<any, any>((props, ref) => {
  const { ownerState, className, ...rest } = props;
  const { view, views = [] } = ownerState || {};

  const { classes, cx } = useStyles();

  return (
    <AppIconButton
      ref={ref}
      {...rest}
      className={cx(
        className,
        classes.switchViewButton,
        ((view === "year" && (views.length === 3 || views.length === 2)) ||
          (view === "month" && !views.includes("year"))) &&
          classes.rotated
      )}
    />
  );
});

const AppDateCalendarDay = (props: PickersDayProps<Moment>) => {
  const { format, multiple, value } = useContext(AppDateCalendarContext);

  const { day, ...rest } = props;

  const selected = useMemo(() => {
    if (multiple) {
      return Array.isArray(value)
        ? value.some((v) => moment(v, format).isSame(day.format(format)))
        : false;
    }
    return (
      !!value &&
      moment(value, format).isSame(moment(day.format(format), format))
    );
  }, [day, format, multiple, value]);

  return <PickersDay day={day} {...rest} selected={selected} />;
};

const AppDateCalendar = forwardRef(
  (props: AppDateCalendarProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      slots,
      slotProps,
      multiple,
      format = "DD-MM-YYYY",
      value,
      name = "",
      onChange,
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    const { i18n } = useTranslation();

    const handleChange: DateCalendarProps<Moment>["onChange"] = (
      valueMoment,
      selectionState
    ) => {
      let newValue = multiple
        ? Array.isArray(value)
          ? [...value]
          : []
        : value ?? null;
      if (multiple) {
        const newValueIndex = (newValue as string[]).findIndex((v) =>
          moment(v).isSame(valueMoment!.format(format))
        );
        if (newValueIndex > -1) {
          (newValue as string[]).splice(newValueIndex, 1);
        } else (newValue as string[]).push(valueMoment!.format(format));
      } else newValue = valueMoment!.format(format);
      onChange &&
        onChange(
          {
            target: {
              name,
              value: newValue,
            },
          },
          newValue as any,
          selectionState
        );
    };

    return (
      <AppDateCalendarContext.Provider
        value={{
          value,
          format,
          multiple,
        }}
      >
        <LocalizationProvider
          dateAdapter={OverriddenAdapterMoment}
          adapterLocale={i18n.language}
        >
          <DateCalendar
            ref={ref}
            className={cx(classes.root, className)}
            showDaysOutsideCurrentMonth
            fixedWeekNumber={6}
            {...rest}
            value={null}
            slotProps={{
              ...slotProps,
              nextIconButton: {
                color: "text.primary",
                borderRadius: "circular",
                size: "small",
                ...slotProps?.nextIconButton,
              } as AppIconButtonProps as any,
              previousIconButton: {
                color: "text.primary",
                borderRadius: "circular",
                size: "small",
                ...slotProps?.nextIconButton,
              } as AppIconButtonProps as any,
              switchViewButton: {
                color: "text.primary",
                borderRadius: "circular",
                size: "small",
                ...slotProps?.nextIconButton,
              } as AppIconButtonProps as any,
            }}
            slots={{
              day: AppDateCalendarDay,
              leftArrowIcon: StyledArrowLeftIcon,
              rightArrowIcon: StyledArrowRightIcon,
              nextIconButton: AppIconButton,
              previousIconButton: AppIconButton,
              switchViewIcon: StyledSwitchViewIcon,
              switchViewButton: SwitchViewButton,
              ...slots,
            }}
            onChange={handleChange}
          />
        </LocalizationProvider>
      </AppDateCalendarContext.Provider>
    );
  }
);

export default AppDateCalendar;
