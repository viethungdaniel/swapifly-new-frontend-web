import { Fragment, forwardRef } from "react";

import { commonHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";

import { Select, FormControl, Typography, Box } from "@mui/material";
import AppInputLabel from "@/components/AppInputLabel";
import AppFormHelperText from "@/components/AppFormHelperText";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppChip from "@/components/AppChip";
import AppTooltip from "@/components/AppTooltip";

import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";

import useStyles from "./AppSelect.styles";

import type { AppInputLabelProps } from "@/components/AppInputLabel";
import type {
  SelectProps,
  FormHelperTextProps,
  FormControlProps,
} from "@mui/material";
import type { AppChipProps } from "@/components/AppChip";

export type AppSelectProps<
  Value,
  DisableFormControl extends boolean = false
> = {
  label?: string;
  inputLabelProps?: AppInputLabelProps;

  borderRadius?: "rounded" | "circular";
  borderColor?: AppThemeColor;
  hoverBorderColor?: AppThemeColor;

  helperText?: React.ReactNode | string | number | null;
  formHelperTextProps?: FormHelperTextProps;

  disabledFormControl?: DisableFormControl;

  bgColor?: "white" | "transparent" | AppThemeColor;

  FormControlProps?: DisableFormControl extends true ? FormControlProps : never;

  appClasses?: Partial<ReturnType<typeof useStyles>["classes"]>;

  limitTags?: number;
  ChipProps?: AppChipProps;
  getOptionLabel?: (value?: any) => React.ReactNode;
} & Omit<SelectProps<Value>, "margin" | "size" | "variant">;

const SelectArrowIcon = forwardRef(
  (props: any, ref: React.ForwardedRef<any>) => {
    return (
      <AppSvgIcon
        ref={ref}
        {...props}
        component={ArrowDownIcon}
        sx={{ fontSize: 20, marginRight: "-2px" }}
      />
    );
  }
);

const AppSelect = forwardRef(
  <Value, DisableFormControl extends boolean = false>(
    props: AppSelectProps<Value, DisableFormControl>,
    ref: React.ForwardedRef<any>
  ) => {
    const {
      className,
      classes: muiClasses,
      appClasses,
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
      children,
      placeholder,
      displayEmpty,
      bgColor,
      multiple,
      ChipProps,
      limitTags,
      getOptionLabel,
      renderValue,
      onChange,
      ...rest
    } = props;

    const { classes, theme, cx, css } = useStyles(
      {
        bgColor,
        borderColor,
        hoverBorderColor,
      },
      {
        props: { classes: appClasses },
      }
    );

    const htmlId =
      id || `${commonConfig.APP_NAME}${rest.name ? `-${rest.name}` : ""}-input`;

    const formControlProps: React.ComponentProps<typeof FormControl> =
      !disabledFormControl
        ? {
            required,
            error,
            fullWidth,
            disabled,
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
        <Select
          ref={ref}
          id={htmlId}
          autoComplete="off"
          IconComponent={SelectArrowIcon}
          native={commonHelpers.isMobile() && !multiple}
          {...rest}
          onChange={onChange}
          multiple={multiple}
          displayEmpty={displayEmpty}
          required={required}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          value={value}
          renderValue={
            !commonHelpers.isEmpty(value)
              ? !!renderValue
                ? renderValue
                : !!multiple
                ? (selected: any) => {
                    const numTags = selected.length;
                    const newLimitTags = limitTags ?? numTags;
                    const labels = selected
                      .slice(limitTags)
                      .map((option: any) => {
                        return !!getOptionLabel
                          ? getOptionLabel(option)
                          : typeof option !== "object"
                          ? option
                          : "";
                      })
                      .join(", ");

                    return (
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={0.75}
                        margin="-1.5px 0px -1.5px -8px"
                      >
                        {selected
                          .slice(0, limitTags)
                          .map((option: any, index: number) => (
                            <AppChip
                              key={index}
                              variant="filled"
                              color="common.blue"
                              size="small"
                              {...ChipProps}
                              label={
                                !!getOptionLabel
                                  ? getOptionLabel(option)
                                  : typeof option !== "object"
                                  ? option
                                  : ""
                              }
                            />
                          ))}
                        {numTags > newLimitTags && (
                          <AppTooltip title={labels}>
                            <AppChip
                              variant="filled"
                              color="common.blue"
                              size="small"
                              {...ChipProps}
                              label={`+${numTags - newLimitTags}...`}
                            />
                          </AppTooltip>
                        )}
                      </Box>
                    );
                  }
                : undefined
              : () => {
                  return (
                    <Typography className={classes.placeholder}>
                      {placeholder}
                    </Typography>
                  );
                }
          }
          MenuProps={{
            ...rest.MenuProps,
            classes: {
              ...rest.MenuProps?.classes,
              paper: cx(
                classes.selectMenuPaper,
                rest.MenuProps?.classes?.paper
              ),
              list: cx(classes.selectMenuList, rest.MenuProps?.classes?.list),
            },
          }}
          className={cx(
            !!bgColor && classes.selectBgColor,
            classes.root,
            { [classes.borderRadiusCircular]: borderRadius === "circular" },
            disabledFormControl && className,
            disabledFormControl && !!sx && css(theme.unstable_sx(sx) as any)
          )}
          classes={{
            ...muiClasses,
          }}
        >
          {children}
        </Select>
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

export default AppSelect;
