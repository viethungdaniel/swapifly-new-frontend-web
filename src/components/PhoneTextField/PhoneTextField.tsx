import getCountryFlag from "country-flag-icons/unicode";

import { countryCodes } from "@/utils/constants/countryCode.constants";
import { commonConfig } from "@/utils/config";

import { Box, ClickAwayListener, Popper } from "@mui/material";
import AppInputAdornment from "@/components/AppInputAdornment";
import PhoneTextFieldContext from "@/components/PhoneTextField/PhoneTextField.context";
import AutocompleteListboxVirtualization from "@/components/AutocompleteListboxVirtualization";
import PhoneNumberFormat from "@/components/PhoneNumberFormat";
import AppAutocomplete from "@/components/AppAutocomplete";
import AppTypography from "@/components/AppTypography";
import AppPaper from "@/components/AppPaper";
import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTextField from "@/components/AppTextField";

import ArrowDropdownIcon from "@@/public/images/icons/arrow-dropdown.svg";

import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./PhoneTextField.styles";

import type { AppTextFieldProps } from "@/components/AppTextField";

export type CustomPhoneTextFieldProps = {
  phoneFieldName?: string;
  phone?: string;
  countryCodeFieldName?: string;
  countryCode?: string;
  onPhoneChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    phone: string
  ) => void;
  onCountryCodeChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    countryCode: string
  ) => void;
};

export type PhoneTextFieldProps = Omit<
  AppTextFieldProps,
  "inputComponent" | "inputProps" | keyof CustomPhoneTextFieldProps
> &
  CustomPhoneTextFieldProps;

const CountryCodeSelectPopper = () => {
  const {
    countryCode,
    countryCodeSelectPopperAnchor,
    countryCodeSelectPopperOpen,
    setCountryCodeSelectPopperOpen,
    changeCountryCode,
  } = useContext(PhoneTextFieldContext);

  const { theme, classes } = useStyles();

  const { t } = useTranslation();

  const setFixedWidth = (data: any) => {
    if (countryCodeSelectPopperAnchor) {
      const clientWidth = countryCodeSelectPopperAnchor.clientWidth;
      if (clientWidth) {
        data.state.styles.popper.width =
          clientWidth < 320 ? `${clientWidth}px` : "320px";
      }
    }
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (countryCodeSelectPopperAnchor) {
      const targetEle = event.target as Element;
      if (countryCodeSelectPopperAnchor.contains(targetEle)) return;
    }
    setCountryCodeSelectPopperOpen(false);
  };

  if (!countryCodeSelectPopperAnchor) return null;

  return (
    <Popper
      open={!!countryCodeSelectPopperOpen}
      anchorEl={countryCodeSelectPopperAnchor}
      placement="bottom-start"
      modifiers={[
        {
          name: "fixedWidth",
          enabled: true,
          fn: setFixedWidth,
          phase: "beforeWrite",
          options: {
            order: 840,
          },
        },
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
      <ClickAwayListener onClickAway={handleClose}>
        <AppPaper boxShadowVariant="menuPopper" sx={{ overflow: "clip" }}>
          <AppAutocomplete
            classes={{
              root: classes.countryCodeAutocomplete,
              popper: classes.countryCodeAutocompletePopper,
            }}
            fullWidth
            defaultInputProps={{
              placeholder: `${t("search")}...`,
              autoFocus: true,
            }}
            open
            forcePopupIcon={false}
            options={countryCodes}
            PaperComponent={Box}
            ListboxComponent={AutocompleteListboxVirtualization as any}
            renderOption={(props, option) => [
              {
                ...props,
                selected: option.dial_code === countryCode,
              },
              (
                <AppTypography
                  component="div"
                  display="flex"
                  alignItems="center"
                  whiteSpace="pre-wrap"
                  width="100%"
                  gap={1}
                  variant={
                    option.dial_code === countryCode ? "bodyMed14" : "bodyReg14"
                  }
                >
                  <AppTypography variant="inherit" fontSize={20} lineHeight={1}>
                    {getCountryFlag(option?.code)}
                  </AppTypography>
                  <AppTypography variant="inherit" flex={1} noWrap>
                    {option?.name}
                  </AppTypography>
                  <AppTypography variant="inherit">
                    {option?.dial_code}
                  </AppTypography>
                </AppTypography>
              ) as React.ReactNode,
            ]}
            getOptionLabel={(option: any) =>
              `${option?.code} ${option?.name} ${option?.dial_code}`
            }
            onClose={(_, reason) => {
              if (reason === "escape") {
                setCountryCodeSelectPopperOpen(false);
              }
            }}
            onChange={(_: any, newValue) => {
              if (!newValue) return;
              changeCountryCode(newValue.dial_code);
              setCountryCodeSelectPopperOpen(false);
            }}
            disablePortal
            disableClearable
          />
        </AppPaper>
      </ClickAwayListener>
    </Popper>
  );
};

const PhoneTextField = (props: PhoneTextFieldProps) => {
  const {
    phone,
    phoneFieldName,
    countryCode = commonConfig.DEFAULT_PHONE_COUNTRY_CODE,
    countryCodeFieldName,
    disabled,
    readOnly,
    startAdornment,
    onCountryCodeChange,
    onPhoneChange,
    ...rest
  } = props;

  const [countryCodeSelectPopperAnchor, setCountryCodeSelectPopperAnchor] =
    useState<HTMLDivElement | null>(null);
  const [countryCodeSelectPopperOpen, setCountryCodeSelectPopperOpen] =
    useState(false);

  const textFieldRef = useRef<HTMLDivElement>(null!);

  const { classes, cx } = useStyles();

  const changeCountryCode = (newCountryCode: string) => {
    onCountryCodeChange &&
      onCountryCodeChange(
        {
          target: {
            name: countryCodeFieldName,
            value: newCountryCode,
          },
        } as any,
        newCountryCode
      );
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPhoneChange && onPhoneChange(event, event.target.value);
  };

  const handleCountryCodeSelectToggle = () => {
    if (disabled || readOnly) return;
    setCountryCodeSelectPopperAnchor(textFieldRef.current);
    setCountryCodeSelectPopperOpen(!countryCodeSelectPopperOpen);
  };

  useEffect(() => {
    if (!!readOnly || !!disabled) {
      setCountryCodeSelectPopperOpen(false);
    }
  }, [readOnly, disabled]);

  return (
    <PhoneTextFieldContext.Provider
      value={{
        countryCode,
        countryCodeSelectPopperAnchor,
        countryCodeSelectPopperOpen,
        setCountryCodeSelectPopperOpen,
        changeCountryCode,
      }}
    >
      <AppTextField
        ref={textFieldRef}
        {...rest}
        disabled={disabled}
        readOnly={readOnly}
        name={phoneFieldName}
        inputComponent={PhoneNumberFormat}
        inputProps={{
          countryCode,
        }}
        startAdornment={
          <>
            <AppInputAdornment position="start">
              <AppButton
                disableRipple={!!disabled || !!readOnly}
                disableTouchRipple={!!disabled || !!readOnly}
                disableHoverEffect={!!disabled || !!readOnly}
                disabled={!!disabled}
                variant="text"
                edge="x"
                color="text.primary"
                endIcon={
                  !disabled &&
                  !readOnly && (
                    <AppSvgIcon
                      className={cx(
                        classes.arrowDropdownIcon,
                        countryCodeSelectPopperOpen && classes.rotated
                      )}
                      component={ArrowDropdownIcon}
                      fontSize="inherit"
                      color="inherit"
                    />
                  )
                }
                sx={{
                  cursor: !!disabled || !!readOnly ? "auto" : undefined,
                }}
                onClick={handleCountryCodeSelectToggle}
              >
                {countryCode}
              </AppButton>
            </AppInputAdornment>
            {startAdornment}
          </>
        }
        value={phone}
        onChange={handlePhoneChange}
      />
      <CountryCodeSelectPopper />
    </PhoneTextFieldContext.Provider>
  );
};

export default PhoneTextField;
