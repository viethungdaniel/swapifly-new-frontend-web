import { Dispatch, createContext } from "react";

import type { Moment } from "moment";
import type { AppDateCalendarProps } from "@/components/AppDateCalendar";
import type { AppTimePickerProps } from "@/components/AppTimePicker/AppTimePicker";

export interface AppTimePickerContextValue {
  value: Moment | null;
  calendarPickerPopperAnchorEl: HTMLDivElement | null;
  calendarPickerPopperOpen: boolean;
  disabled?: boolean;
  CalendarPickerProps?: AppDateCalendarProps;
  setValue: Dispatch<Moment | null>;
  setCalendarPickerPopperOpen: React.Dispatch<boolean>;
  changeValue: (value: Moment | null) => void;
  toggleCalendarPickerPopper: () => void;
  AppTimePickerProps: AppTimePickerProps;
}

const AppTimePickerContext = createContext<AppTimePickerContextValue>(null!);

export default AppTimePickerContext;
