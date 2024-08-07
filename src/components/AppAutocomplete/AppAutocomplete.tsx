import _take from "lodash/take";
import { Autocomplete } from "@mui/material";

import AppTextField from "@/components/AppTextField";
import AppPaper from "@/components/AppPaper";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppMenuItem from "@/components/AppMenuItem";
import AppMenuList from "@/components/AppMenuList";
import AppListItemText from "@/components/AppListItemText";

import ArrowDropdownIcon from "@@/public/images/icons/arrow-dropdown.svg";
import CheckedIcon from "@@/public/images/icons/checked.svg";
import AppChip from "@/components/AppChip";
import AppTooltip from "@/components/AppTooltip";

import { useIsomorphicLayoutEffect } from "@/hooks";
import { forwardRef, useImperativeHandle, useRef } from "react";

import useStyles from "./AppAutocomplete.styles";

import type { AppTextFieldProps } from "@/components/AppTextField";
import type {
  AutocompleteProps,
  AutocompleteChangeReason,
  AutocompleteRenderOptionState,
} from "@mui/material/Autocomplete";
import type { AppMenuItemProps } from "@/components/AppMenuItem";
import type { AppChipProps } from "@/components/AppChip/AppChip";

type CustomAppAutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = "div",
  ListboxComponent extends React.ElementType = "div",
  ListboxProps = React.ComponentProps<ListboxComponent>,
  AP extends AutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent
  > = AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>
> = {
  name?: string;
  value?: T | null;
  defaultInputProps?: AppTextFieldProps;
  ListboxComponent?: ListboxComponent;
  ListboxProps?: ListboxProps;
  ChipProps?: AppChipProps;

  renderInput?: AP["renderInput"];
  renderOption?: (
    props: AppMenuItemProps,
    option: T,
    state: AutocompleteRenderOptionState
  ) =>
    | [AppMenuItemProps, React.ReactNode, AutocompleteRenderOptionState]
    | [AppMenuItemProps, React.ReactNode]
    | React.ReactNode;
  onChange?: (
    event: {
      target: {
        name?: string;
        value: T;
      };
    },
    newValue: T,
    reason: AutocompleteChangeReason
  ) => void;
};

export type AppAutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = typeof AppChip,
  ListboxComponent extends React.ElementType = typeof AppMenuList,
  ListboxProps = React.ComponentProps<ListboxComponent>
> = CustomAppAutocompleteProps<T> &
  Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>,
    keyof CustomAppAutocompleteProps<
      T,
      Multiple,
      DisableClearable,
      FreeSolo,
      ChipComponent,
      ListboxComponent,
      ListboxProps
    >
  >;

const Listbox = forwardRef(
  (
    props: React.ComponentProps<typeof AppMenuList>,
    ref: React.ForwardedRef<any>
  ) => {
    const rootElRef = useRef<HTMLUListElement>(null!);

    const getChildNodeSize = (childNode: HTMLLIElement) => {
      return childNode?.clientHeight || 40;
    };

    const getMaxHeight = (childNodes: HTMLLIElement[]) => {
      if (childNodes.length > 8) {
        return _take(childNodes, 8)
          .map(getChildNodeSize)
          .reduce((a, b) => a + b, 0);
      }
      return childNodes.map(getChildNodeSize).reduce((a, b) => a + b, 0);
    };

    useIsomorphicLayoutEffect(() => {
      const rootEl = rootElRef.current;
      if (!rootEl) return;
      const childNodes = Array.from(rootEl.childNodes) as HTMLLIElement[];
      const maxHeight = getMaxHeight(childNodes) + 20;
      const windowHeight =
        typeof window !== "undefined" ? (window.innerHeight * 40) / 100 : 0;
      rootEl.style.paddingTop = "10px";
      rootEl.style.paddingBottom = "10px";
      rootEl.style.maxHeight = `${
        windowHeight < maxHeight ? windowHeight : maxHeight
      }px`;
    });

    useImperativeHandle(ref, () => rootElRef.current);

    return <AppMenuList ref={rootElRef} component="ul" {...props} />;
  }
);

const AppAutocomplete = forwardRef(
  <
    T,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
    ChipComponent extends React.ElementType = "div"
  >(
    props: AppAutocompleteProps<
      T,
      Multiple,
      DisableClearable,
      FreeSolo,
      ChipComponent
    >,
    ref: React.ForwardedRef<any>
  ) => {
    const {
      name,
      defaultInputProps,
      classes: muiClasses,
      value = props.multiple ? [] : null,
      ChipProps,
      ListboxComponent,
      ListboxProps,
      renderInput,
      renderTags,
      renderOption,
      getOptionLabel,
      onChange,
      onBlur,
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    const handleChange: typeof onChange = (event, newValue, reason) => {
      onChange &&
        onChange(
          {
            ...event,
            target: {
              name: name || "",
              value: newValue,
            } as any,
          },
          newValue,
          reason
        );
    };

    return (
      <Autocomplete
        ref={ref}
        popupIcon={
          <AppSvgIcon
            component={ArrowDropdownIcon}
            className={classes.popupIcon}
          />
        }
        PaperComponent={AppPaper as unknown as any}
        renderInput={
          !!renderInput
            ? renderInput
            : ({ InputProps, InputLabelProps, ...restParams }) => {
                return (
                  <AppTextField
                    {...(restParams as any)}
                    inputLabelProps={InputLabelProps}
                    name={name}
                    onBlur={onBlur ? (onBlur as any) : () => {}}
                    {...defaultInputProps}
                    onClick={(event) => {
                      (InputProps as any).onClick(event);
                      defaultInputProps?.onClick &&
                        defaultInputProps.onClick(event);
                    }}
                    ref={(textFieldRef: any) => {
                      (InputProps as any).ref(textFieldRef);
                      if (!!defaultInputProps?.ref)
                        (defaultInputProps as any).ref(textFieldRef);
                    }}
                    classes={{
                      root: cx(
                        InputProps.className,
                        defaultInputProps?.className
                      ),
                    }}
                    startAdornment={
                      defaultInputProps?.startAdornment ? (
                        <>
                          {defaultInputProps.startAdornment}
                          {InputProps.startAdornment}
                        </>
                      ) : (
                        InputProps.startAdornment
                      )
                    }
                    endAdornment={
                      defaultInputProps?.endAdornment ? (
                        <>
                          {defaultInputProps.endAdornment}
                          {InputProps.endAdornment}
                        </>
                      ) : (
                        InputProps.endAdornment
                      )
                    }
                  />
                );
              }
        }
        {...rest}
        ListboxProps={ListboxProps as unknown as any}
        ListboxComponent={ListboxComponent || (Listbox as unknown as any)}
        ChipProps={ChipProps as unknown as any}
        getOptionLabel={getOptionLabel}
        renderTags={(value, getTagProps, ownerState) => {
          if (!!renderTags)
            return renderTags(
              value,
              getTagProps,
              ownerState as any
            ) as React.ReactNode;
          const numTags = value.length;
          const limitTags = ownerState.limitTags ?? numTags;

          const labels = value
            .slice(limitTags)
            .map((option: any) => {
              return getOptionLabel
                ? getOptionLabel(option)
                : (option as any)?.name ?? option;
            })
            .join(", ");

          return (
            <>
              {value.slice(0, limitTags).map((option: any, index) => {
                const { key = index, ...rest } = getTagProps({ index });
                const label = getOptionLabel
                  ? getOptionLabel(option)
                  : (option as any)?.name ?? option;
                return (
                  <AppChip
                    key={key}
                    title={label}
                    variant="filled"
                    color="common.blue"
                    size="small"
                    {...ownerState.ChipProps}
                    label={label}
                    {...rest}
                  />
                );
              })}
              {numTags > limitTags && (
                <AppTooltip title={labels}>
                  <AppChip
                    variant="filled"
                    color="common.blue"
                    size="small"
                    {...ownerState.ChipProps}
                    className={classes.tag}
                    label={`+${numTags - limitTags}...`}
                  />
                </AppTooltip>
              )}
            </>
          );
        }}
        renderOption={(props, option, state) => {
          if (!!renderOption)
            return renderOption(props as any, option, state) as React.ReactNode;
          const [_props, _option, _state] = [
            {
              ...props,
            },
            option,
            state,
          ];

          return (
            <AppMenuItem
              {..._props}
              sx={{
                color: state.selected ? "primary.main" : "text.primary",
              }}
            >
              <AppListItemText
                primary={
                  getOptionLabel
                    ? getOptionLabel(_option)
                    : (_option as any)?.name ?? _option
                }
                primaryTypographyProps={{
                  variant: state.selected ? "bodyMed14" : "bodyReg14",
                  lineHeight: "20px",
                  color: "inherit",
                }}
              />
              {state.selected && (
                <AppSvgIcon
                  className={classes.selectedIcon}
                  component={CheckedIcon}
                  sx={{
                    mr: "-4px",
                  }}
                  fontSize="small"
                  color="inherit"
                />
              )}
            </AppMenuItem>
          );
        }}
        value={value as any}
        componentsProps={{
          ...rest.componentsProps,
          paper: {
            ...(!rest.PaperComponent ? { boxShadowVariant: "menuPopper" } : {}),
            ...rest.componentsProps?.paper,
          } as React.ComponentProps<typeof AppPaper>,
          popper: {
            ...rest.componentsProps?.popper,
            modifiers: (rest?.componentsProps?.popper?.modifiers ?? []).some(
              (m) => m.name === "offset"
            )
              ? rest?.componentsProps?.popper?.modifiers ?? []
              : [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 4],
                    },
                  },
                  ...(rest?.componentsProps?.popper?.modifiers ?? []),
                ],
          },
        }}
        classes={{
          ...muiClasses,
          root: cx(muiClasses?.root, classes.root),
          input: cx(muiClasses?.input, classes.input),
          hasPopupIcon: cx(muiClasses?.hasPopupIcon, classes.hasPopupIcon),
          hasClearIcon: cx(muiClasses?.hasClearIcon, classes.hasClearIcon),
          popupIndicator: cx(
            muiClasses?.popupIndicator,
            classes.popupIndicator
          ),
          endAdornment: cx(muiClasses?.endAdornment, classes.endAdornment),
          listbox: cx(classes.listbox, muiClasses?.listbox),
          noOptions: cx(classes.noOptions, muiClasses?.noOptions),
          loading: cx(classes.loading, muiClasses?.loading),
          tag: cx(classes.tag, muiClasses?.tag),
        }}
        onChange={handleChange as any}
      />
    );
  }
);

export default AppAutocomplete;
