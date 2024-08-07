import { Dispatch, createContext } from "react";

import type { Moment } from "moment";
import type { AppDateCalendarProps } from "@/components/AppDateCalendar";
import type { AppDatePickerProps } from "@/components/AppDatePicker/AppDatePicker";

export interface AppDatePickerContextValue {
  value: Moment | null;
  calendarPickerPopperAnchorEl: HTMLDivElement | null;
  calendarPickerPopperOpen: boolean;
  disabled?: boolean;
  CalendarPickerProps?: AppDateCalendarProps;
  setValue: Dispatch<Moment | null>;
  setCalendarPickerPopperOpen: React.Dispatch<boolean>;
  changeValue: (value: Moment | null) => void;
  toggleCalendarPickerPopper: () => void;
  AppDatePickerProps: AppDatePickerProps;
}

const AppDatePickerContext = createContext<AppDatePickerContextValue>(null!);

export default AppDatePickerContext;
