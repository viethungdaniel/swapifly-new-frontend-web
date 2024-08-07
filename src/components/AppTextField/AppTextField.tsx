import { Fragment, forwardRef, useMemo, useId } from "react";

import { commonConfig } from "@/utils/config";
import { commonHelpers } from "@/utils/helpers";

import { OutlinedInput, FormControl } from "@mui/material";
import AppInputLabel from "@/components/AppInputLabel";
import AppFormHelperText from "@/components/AppFormHelperText";

import useStyles from "./AppTextField.styles";

import type { AppInputLabelProps } from "@/components/AppInputLabel";
import type {
  OutlinedInputProps,
  FormHelperTextProps,
  FormControlProps,
} from "@mui/material";

export type AppTextFieldProps<DisableFormControl extends boolean = false> = {
  label?: React.ReactNode;
  inputLabelProps?: AppInputLabelProps;

  borderRadius?: "rounded" | "circular";
  borderColor?: AppThemeColor;
  hoverBorderColor?: AppThemeColor;

  helperText?: React.ReactNode;
  formHelperTextProps?: FormHelperTextProps;

  disabledFormControl?: DisableFormControl;

  bgColor?: "white" | "transparent" | AppThemeColor;

  FormControlProps?: DisableFormControl extends true ? never : FormControlProps;
} & Omit<OutlinedInputProps, "margin" | "size">;

const AppTextField = forwardRef(
  <DisableFormControl extends boolean = false>(
    props: AppTextFieldProps<DisableFormControl>,
    ref: React.ForwardedRef<any>
  ) => {
    const {
      className,
      classes: muiClasses,
      label,
      inputLabelProps,
      fullWidth,
      error,
      required,
      id,
      helperText,
      formHelperTextProps,
      disabledFormControl,
      disabled,
      sx,
      borderRadius,
      borderColor,
      hoverBorderColor,
      value,
      FormControlProps,
      bgColor,
      ...rest
    } = props;

    const { classes, theme, cx, css } = useStyles({
      bgColor,
      borderColor,
      hoverBorderColor,
    });

    const rid = useId();

    const htmlId = useMemo(() => {
      return id || !commonHelpers.isEmpty(rest.name)
        ? `${commonConfig.APP_NAME}-input-${rest.name}-${rid}`
        : `${commonConfig.APP_NAME}-input-${rid}`;
    }, [id, rest.name]);

    const formControlProps: React.ComponentProps<typeof FormControl> =
      !disabledFormControl
        ? {
            required,
            error,
            fullWidth,
            className,
            ...FormControlProps,
            sx,
          }
        : {};

    const ControlledFormControl = disabledFormControl ? Fragment : FormControl;

    return (
      <ControlledFormControl {...formControlProps}>
        {!!label && (
          <AppInputLabel
            shrink
            htmlFor={htmlId}
            {...inputLabelProps}
            classes={{
              ...inputLabelProps?.classes,
              root: cx(
                classes.inputLabel,
                !!inputLabelProps?.classes?.root && inputLabelProps.classes.root
              ),
            }}
            className={cx(
              !!inputLabelProps?.className && inputLabelProps.className
            )}
          >
            {label}
          </AppInputLabel>
        )}
        <OutlinedInput
          ref={ref}
          id={htmlId}
          autoComplete="off"
          {...rest}
          required={required}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          value={value}
          classes={{
            ...muiClasses,
            root: cx(
              classes.outlinedInputRoot,
              {
                [classes.borderRadiusCircular]: borderRadius === "circular",
                [classes.outlinedInputBg]: !!bgColor,
              },
              !!muiClasses?.root && muiClasses.root,
              disabledFormControl && !!sx && css(theme.unstable_sx(sx) as any),
              disabledFormControl && className
            ),
            multiline: cx(
              classes.outlinedInputMultiline,
              !!muiClasses?.multiline && muiClasses.multiline
            ),
            input: cx(
              classes.outlinedInputInput,
              !!muiClasses?.input && muiClasses.input
            ),
            error: cx(
              classes.outlinedInputError,
              !!muiClasses?.error && muiClasses.error
            ),
            notchedOutline: cx(
              classes.outlinedInputNotchedOutline,
              !!muiClasses?.notchedOutline && muiClasses.notchedOutline
            ),
            focused: cx(
              classes.outlinedInputFocused,
              !!muiClasses?.focused && muiClasses.focused
            ),
            disabled: cx(
              classes.outlinedInputDisabled,
              !!muiClasses?.disabled && muiClasses.disabled
            ),
            adornedStart: cx(
              classes.outlinedInputAdornedStart,
              !!muiClasses?.adornedStart && muiClasses.adornedStart
            ),
            adornedEnd: cx(
              classes.outlinedInputAdornedEnd,
              !!muiClasses?.adornedEnd && muiClasses.adornedEnd
            ),
            inputAdornedStart: cx(
              classes.outlinedInputInputAdornedStart,
              !!muiClasses?.inputAdornedStart && muiClasses.inputAdornedStart
            ),
            inputAdornedEnd: cx(
              classes.outlinedInputInputAdornedEnd,
              !!muiClasses?.inputAdornedEnd && muiClasses.inputAdornedEnd
            ),
          }}
        />
        {!!helperText && (
          <AppFormHelperText
            {...formHelperTextProps}
            classes={{
              ...formHelperTextProps?.classes,
              root: cx(
                classes.formHelperText,
                formHelperTextProps?.classes?.root
              ),
            }}
          >
            {helperText}
          </AppFormHelperText>
        )}
      </ControlledFormControl>
    );
  }
);

export default AppTextField;
