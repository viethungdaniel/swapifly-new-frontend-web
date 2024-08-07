import { formikHelpers } from "@/utils/helpers";

import AppButton from "@/components/AppButton";
import AppInputLabel from "@/components/AppInputLabel";
import AppFormHelperText from "@/components/AppFormHelperText";

import { useAppMomentWithLocale } from "@/hooks";
import { useMemo } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./WeekdaysFormField.styles";

import type { FastFieldProps } from "formik";

type WeekdaysFormFieldProps = FastFieldProps;

const WeekdaysFormField = (props: WeekdaysFormFieldProps) => {
  const { field, form, meta } = props;

  const { momentWithLocale } = useAppMomentWithLocale();

  const { t } = useTranslation();

  const weekdayOptions = useMemo(() => {
    return momentWithLocale.weekdaysShort().map((weekday, weekdayIndex) => ({
      label: weekday,
      value: weekdayIndex,
    }));
  }, [momentWithLocale]);

  const handleWeekdayValuesChange = (weekdayValue: number) => () => {
    const newWeekdayValues = [...field.value];
    const weekdayValueIndex = newWeekdayValues.findIndex(
      (newWeekdayValue) => newWeekdayValue === weekdayValue
    );
    if (weekdayValueIndex > -1) {
      newWeekdayValues.splice(weekdayValueIndex, 1);
    } else newWeekdayValues.push(weekdayValue);
    form.setFieldValue(field.name, true);
    form.setFieldValue(field.name, newWeekdayValues);
  };

  const { classes } = useStyles();

  return (
    <div data-name={field.name}>
      <AppInputLabel
        error={
          !!formikHelpers.showError({
            error: meta.error,
            touched: meta.touched,
            submitCount: form.submitCount,
          })
        }
      >
        {t("weekdays")}
      </AppInputLabel>
      <div className={classes.weekdayList}>
        {weekdayOptions.map((weekdayOption) => (
          <AppButton
            key={weekdayOption.value}
            className={classes.weekdayItemButton}
            color={
              field.value.includes(weekdayOption.value)
                ? "primary.main"
                : "text.primary"
            }
            variant={
              field.value.includes(weekdayOption.value)
                ? "contained"
                : "containedTonal"
            }
            onClick={handleWeekdayValuesChange(weekdayOption.value)}
          >
            {weekdayOption.label}
          </AppButton>
        ))}
      </div>
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

export default WeekdaysFormField;
