import { formikHelpers } from "@/utils/helpers";

import AppDateCalendar from "@/components/AppDateCalendar";
import AppChip from "@/components/AppChip";
import AppFormHelperText from "@/components/AppFormHelperText";
import AppInputLabel from "@/components/AppInputLabel";

import { useMemo } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./DatesFormField.styles";

import type { FastFieldProps } from "formik";
import type { AppDateCalendarProps } from "@/components/AppDateCalendar";

type DatesFormFieldProps = FastFieldProps;

const DatesFormField = (props: DatesFormFieldProps) => {
  const { field, form, meta } = props;

  const { classes } = useStyles();

  const { t } = useTranslation();

  const handleDateRemove = (dateIndex: number) => () => {
    const newDates = [...field.value];
    newDates.splice(dateIndex, 1);
    form.setFieldTouched(field.name, true);
    form.setFieldValue(field.name, newDates);
  };

  const handleDatesChange: AppDateCalendarProps["onChange"] = (
    event,
    _,
    selectionState
  ) => {
    selectionState === "finish" && field.onChange(event);
  };

  const sortedValue = useMemo(() => {
    return (Array.isArray(field.value) ? field.value : []).sort((a, b) =>
      a >= b ? 1 : -1
    );
  }, [field.value]);

  return (
    <div className={classes.root}>
      <AppInputLabel
        error={
          !!formikHelpers.showError({
            error: meta.error,
            touched: meta.touched,
            submitCount: form.submitCount,
          })
        }
      >
        {t("specifyDay")}
      </AppInputLabel>
      <AppDateCalendar
        className={classes.dateCalendar}
        disablePast
        multiple
        format="YYYY-MM-DD"
        {...field}
        onChange={handleDatesChange}
      />
      {(sortedValue?.length ?? 0) > 0 && (
        <div className={classes.dateList}>
          {sortedValue.map((date, dateIndex) => (
            <AppChip
              key={date}
              label={date}
              size="small"
              color="common.blue"
              onDelete={handleDateRemove(dateIndex)}
            />
          ))}
        </div>
      )}
      {!!formikHelpers.showError({
        error: meta.error,
        touched: meta.touched,
        submitCount: form.submitCount,
      }) && (
        <AppFormHelperText error>
          {formikHelpers.showError({
            error: meta.error,
            touched: meta.touched,
            submitCount: form.submitCount,
          })}
        </AppFormHelperText>
      )}
    </div>
  );
};

export default DatesFormField;
