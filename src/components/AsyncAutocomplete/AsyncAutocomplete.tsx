import axios from "axios";
import _isEqual from "lodash/isEqual";

import { axiosHelpers, imageHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";
import { aiApi, brandApi, commonApi } from "@/utils/apis";

import { Box } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import AppLoading from "@/components/AppLoading";
import AppTextField from "@/components/AppTextField";
import AppAutocomplete from "@/components/AppAutocomplete";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import VirtualizationListboxComponent from "./components/VirtualizationListboxComponent";
import AutocompleteListboxVirtualization from "@/components/AutocompleteListboxVirtualization";
import AppAvatar from "@/components/AppAvatar";
import AppListItemText from "@/components/AppListItemText";

import CheckedIcon from "@@/public/images/icons/checked.svg";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useAppSelector, useDebouncedCallback, useIsMounted } from "@/hooks";

import useStyles from "./AsyncAutocomplete.styles";

import type { AppAutocompleteProps } from "@/components/AppAutocomplete";
import type {
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse,
  CancelToken,
} from "axios";
import {
  type AutocompleteRenderOptionState,
  type AutocompleteInputChangeReason,
  type AutocompleteValue,
  type AutocompleteChangeReason,
  type AutocompleteChangeDetails,
  type AutocompleteFreeSoloValueMapping,
  type AutocompleteRenderInputParams,
  type FilterOptionsState,
} from "@mui/material";
import type { FetchBrandsResponseData } from "@/utils/apis/brand";
import type {
  FetchLocationsResponseData,
  FetchMerchantLocationsResponseData,
  FetchRegionsResponseData,
} from "@/utils/apis/common";
import type { FetchAiStylesResponseData } from "@/utils/apis/ai";

export type AsyncAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = {
  module: Modules;
  moduleParams?: {
    [key: string]: any;
  };
  enabledInfiniteLoaderModule?: boolean;
  disabledModule?: boolean;
  name?: string;
  renderOption?: AsyncAutocompleteRenderOption<T>;
  // AppAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>["renderOption"]
  renderInput?: (
    params: AutocompleteRenderInputParams,
    moduleState: { options: any[]; isLoading: boolean }
  ) => React.ReactNode;
  onChange?: AsyncAutocompleteOnChange<T, Multiple, DisableClearable, FreeSolo>;
} & Omit<
  AppAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  | "options"
  | "renderInput"
  | "ListboxComponent"
  | "onChange"
  | "renderOption"
  | "ListboxComponent"
>;

type Modules =
  | "brands"
  | "regions"
  | "aIStyles"
  | "locations"
  | "merchantLocations";

type AsyncAutocompleteRenderOption<
  T = any,
  P = React.HTMLAttributes<HTMLLIElement>
> = (
  props: P,
  option: T,
  state: AutocompleteRenderOptionState
) => [P, React.ReactNode | React.ReactNode[]];

type AsyncAutocompleteOnInputChange = (
  event: React.SyntheticEvent<Element, Event>,
  value: string,
  reason: AutocompleteInputChangeReason
) => void;

type AsyncAutocompleteOnChange<T, Multiple, DisableClearable, FreeSolo> = (
  event: { target: { name: string; value: any } },
  value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
  reason: AutocompleteChangeReason,
  details?: AutocompleteChangeDetails<T>
) => void;

type ModuleMap<T, FreeSolo> = {
  [key in Modules]: {
    isServerSide?: boolean;
    keywordFieldName?: "search" | string;
    noOptionsText?: string;
    fetchData: (payload: {
      params: {
        page: number;
        limit: number;
        [x: string]: any;
      };
      cancelToken?: CancelToken;
    }) => AxiosPromise;
    customData: (response: AxiosResponse) => { list: Array<T>; count?: number };
    renderOption: AsyncAutocompleteRenderOption;
    getOptionLabel?: (
      option: T | AutocompleteFreeSoloValueMapping<FreeSolo>
    ) => string;
    isOptionEqualToValue?: (option: T, value: any) => boolean;
    filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[];
  };
};

const AsyncAutocomplete = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: AsyncAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>
) => {
  const {
    module: controlledModule,
    moduleParams,
    enabledInfiniteLoaderModule,
    disabledModule,
    name,
    noOptionsText,
    multiple,
    ListboxProps,
    inputValue,
    classes: muiClasses,
    defaultInputProps,
    filterOptions,
    onInputChange,
    onOpen,
    onChange,
    onBlur,
    renderInput: controlledRenderInput,
    ...rest
  } = props;

  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [data, setData] = useState<T[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [internalInputValue, setInternalInputValue] = useState(inputValue);

  const { classes, cx } = useStyles();
  const sourceRef = useRef<CancelTokenSource>(null!);
  const internalInputValueRef = useRef(internalInputValue);
  const inputReasonRef = useRef("");

  const $s_commonLocationLatitude = useAppSelector(
    (state) => state.common.location.latitude
  );
  const $s_commonLocationLongitude = useAppSelector(
    (state) => state.common.location.longitude
  );
  const $s_commonRegionId = useAppSelector((state) => state.common.region?.id);

  const moduleMap: ModuleMap<T, FreeSolo> = {
    brands: {
      isServerSide: true,
      keywordFieldName: "query",
      fetchData: brandApi.fetchBrands,
      customData: (response) => {
        const data = response.data as FetchBrandsResponseData;
        return {
          list: data.data ?? [],
          count: data.pagination.total,
        } as any;
      },
      renderOption: (
        props,
        option: FetchBrandsResponseData["data"][number],
        { selected }
      ) => {
        return [
          props,
          <AppTypography
            color={selected ? "primary.main" : "text.primary"}
            variant={selected ? "bodyMed14" : "bodyReg14"}
            key={option.id}
            display="flex"
            gap={1}
            width={"100%"}
            component="div"
            lineHeight={"20px"}
          >
            <AppTypography variant="inherit" flex={1}>
              {option?.title}
            </AppTypography>
            {selected && (
              <AppSvgIcon
                component={CheckedIcon}
                sx={{
                  mr: "-4px",
                }}
                fontSize="small"
              />
            )}
          </AppTypography>,
        ];
      },
      getOptionLabel: (option: any) => option?.title ?? "",
      isOptionEqualToValue: (option: any, value: any) => {
        return option?.id === value?.id;
      },
    },
    aIStyles: {
      fetchData: aiApi.fetchAiStyles,
      customData: (response) => {
        const data = response.data as FetchAiStylesResponseData;
        return {
          list: data.data,
          count: data.data.length,
        } as any;
      },
      renderOption: (
        props,
        option: FetchAiStylesResponseData["data"][number],
        { selected }
      ) => {
        return [
          props,
          <AppTypography
            color={selected ? "primary.main" : "text.primary"}
            variant={selected ? "bodyMed14" : "bodyReg14"}
            key={option.id}
            display="flex"
            gap={1}
            width={"100%"}
            component="div"
            lineHeight={"20px"}
          >
            <AppTypography variant="inherit" flex={1}>
              {option?.name}
            </AppTypography>
            {selected && (
              <AppSvgIcon
                component={CheckedIcon}
                sx={{
                  mr: "-4px",
                }}
                fontSize="small"
              />
            )}
          </AppTypography>,
        ];
      },
      getOptionLabel: (option: any) => option?.name ?? "",
      isOptionEqualToValue: (option: any, value: any) => {
        return option?.id === value?.id;
      },
    },
    merchantLocations: {
      fetchData: ({ params, ...rest }) => {
        return commonApi.fetchMerchantLocations({
          params: {
            ...(params as any),
            region_id: $s_commonRegionId!,
          },
          ...rest,
        });
      },
      customData: (response) => {
        const data = response.data as FetchMerchantLocationsResponseData;
        return {
          list: data,
          count: data.length,
        } as any;
      },
      renderOption: (
        props,
        option: FetchMerchantLocationsResponseData[number],
        { selected }
      ) => {
        return [
          props,
          <AppTypography
            color={selected ? "primary.main" : "text.primary"}
            variant={selected ? "bodyMed14" : "bodyReg14"}
            key={option.id}
            display="flex"
            gap={1}
            width={"100%"}
            component="div"
            lineHeight={"20px"}
          >
            <AppTypography variant="inherit" flex={1}>
              {option?.title}
            </AppTypography>
            {selected && (
              <AppSvgIcon
                component={CheckedIcon}
                sx={{
                  mr: "-4px",
                }}
                fontSize="small"
              />
            )}
          </AppTypography>,
        ];
      },
      getOptionLabel: (option: any) => option?.title ?? "",
      isOptionEqualToValue: (option: any, value: any) => {
        return option?.id === value?.id;
      },
    },
    locations: {
      isServerSide: true,
      keywordFieldName: "query",
      fetchData: ({ params, ...rest }) => {
        return commonApi.fetchLocations({
          params: {
            ...(params as any),
            lat: $s_commonLocationLatitude!,
            lng: $s_commonLocationLongitude!,
          },
          ...rest,
        });
      },
      customData: (response) => {
        const data = response.data as FetchLocationsResponseData;
        return {
          list: data,
          count: data.length,
        } as any;
      },
      renderOption: (
        props,
        option: FetchLocationsResponseData[number],
        { selected }
      ) => {
        return [
          props,
          <Box
            key={`${option?.title}${option?.address}`}
            display="flex"
            alignItems="center"
            gap={1}
            width={"100%"}
            color={selected ? "primary.main" : "initial"}
          >
            <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
              <AppTypography>{option?.title}</AppTypography>
              <AppTypography variant="captionReg12" color="text.secondary">
                {option?.address}
              </AppTypography>
            </Box>
            {selected && (
              <AppSvgIcon
                component={CheckedIcon}
                sx={{
                  mr: "-4px",
                }}
                fontSize="small"
              />
            )}
          </Box>,
        ];
      },
      getOptionLabel: (option: any) => `${option?.title} ${option?.address}`,
      isOptionEqualToValue: (option: any, value: any) => {
        return _isEqual(
          {
            address: option?.address,
            lat: option?.lat,
            lng: option?.lng,
            title: option?.title,
          },
          {
            address: value?.address,
            lat: value?.lat,
            lng: value?.lng,
            title: value?.title,
          }
        );
      },
    },
    regions: {
      fetchData: commonApi.fetchRegions,
      customData: (response) => {
        const data = response.data as FetchRegionsResponseData;
        return {
          list: data ?? [],
          count: data.length,
        } as any;
      },
      renderOption: (
        props,
        option: FetchRegionsResponseData[number],
        { selected }
      ) => {
        return [
          props,
          <AppTypography
            color={selected ? "primary.main" : "text.primary"}
            variant={selected ? "bodyMed14" : "bodyReg14"}
            key={option?.id}
            display="flex"
            gap={1}
            component="div"
            width={"100%"}
            lineHeight={"20px"}
          >
            <AppAvatar
              src={imageHelpers.appImageLoader({
                src: option?.img_url,
              })}
              alt={`${option?.short_name} - ${commonConfig.DOCUMENT_TITLE}`}
              sx={{
                width: 24,
                height: 24,
                fontSize: 24,
                bgcolor: "transparent",
                mr: 1.25,
              }}
            >
              {option?.flag}
            </AppAvatar>
            <AppListItemText
              primary={option?.title}
              primaryTypographyProps={{
                variant: selected ? "bodyMed14" : "bodyReg14",
                lineHeight: "20px",
                color: "inherit",
              }}
            />
            {selected && (
              <AppSvgIcon
                component={CheckedIcon}
                sx={{
                  mr: "-4px",
                }}
                fontSize="small"
              />
            )}
          </AppTypography>,
        ];
      },
      getOptionLabel: (option: any) => option?.title ?? "",
      filterOptions: createFilterOptions({
        matchFrom: "any",
        stringify: (option: any) => option?.title,
      }),
      isOptionEqualToValue: (option: any, value: any) => {
        return option?.id === value?.id;
      },
    },
  };

  const _module = moduleMap[controlledModule];

  const fetchData = async (payload?: {
    params?: any;
    isNextPage?: boolean;
  }) => {
    const { params, isNextPage } = payload || {};
    sourceRef.current?.cancel && sourceRef.current.cancel();
    sourceRef.current = axios.CancelToken.source();
    const setLoading = isNextPage ? setIsLoadingNextPage : setIsLoading;
    setLoading(true);
    setErrorMessage("");
    const { data: response } = await _module
      .fetchData({
        params,
        cancelToken: sourceRef.current.token,
      })
      .then((response) => {
        if (!axiosHelpers.checkRequestSuccess(response.data)) return response;

        const { list, count } = _module.customData(response.data);

        return {
          data: {
            ...response.data,
            data: {
              list,
              count: count || 0,
            },
          },
        };
      })
      .catch((error) => {
        return {
          data: {
            error: error,
            status: false,
            message: error?.response?.data?.message || error?.message,
          },
        };
      });

    if (!isMounted() || axios.isCancel(response?.error)) return;
    if (!axiosHelpers.checkRequestSuccess(response)) {
      setErrorMessage(response.message as string);
    } else {
      if (isNextPage && (response.data.list?.length || 0) > 0)
        setData((prevData) =>
          prevData.concat(
            response.data.list.filter((item: any) => {
              return !prevData.some((prevItem) => _isEqual(prevItem, item));
            })
          )
        );
      else if (!!response.data.list) setData(response.data.list);
      if (page * pageSize < (response.data.count || 0)) setHasNextPage(true);
      else setHasNextPage(false);
    }
    setLoading(false);
  };

  const debounceFetchData = useDebouncedCallback(fetchData, 250);

  const isServerSide = useMemo(() => {
    return !!_module.isServerSide;
  }, [_module.isServerSide]);

  const handleNextPageLoad = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
    fetchData({
      params: {
        ...moduleParams,
        [_module.keywordFieldName || "search"]:
          inputReasonRef.current === "reset" ? undefined : internalInputValue,
        page: page + 1,
        limit: pageSize,
      },
      isNextPage: true,
    });
  }, [internalInputValue, page, pageSize]);

  const autocompleteProps = useMemo(() => {
    if (!isServerSide)
      return {
        ListboxProps,
        filterOptions: filterOptions
          ? filterOptions
          : _module.filterOptions
          ? _module.filterOptions
          : undefined,
      };
    return {
      autoComplete: true,
      filterOptions: (x: any) => x,
      includeInputInList: true,
      // filterSelectedOptions: true,
      ListboxProps: {
        ...ListboxProps,
        hasNextPage,
        isLoadingNextPage,
        enabledInfiniteLoader: enabledInfiniteLoaderModule,
        onNextPageLoad: handleNextPageLoad,
      },
    };
  }, [
    isServerSide,
    hasNextPage,
    isLoadingNextPage,
    enabledInfiniteLoaderModule,
    handleNextPageLoad,
  ]);

  const handleDataFetch = (
    payload?: { keyword: string },
    options?: { enabledDebounce: boolean }
  ) => {
    const { enabledDebounce } = options || {};
    const { keyword } = payload || {};

    if (isServerSide && !disabledModule) {
      setPage(1);
      setHasNextPage(true);
      const params = {
        ...moduleParams,
        ...payload,
        page: 1,
        limit: pageSize,
        [_module.keywordFieldName || "search"]: keyword,
      };
      if (enabledDebounce) debounceFetchData({ params });
      else fetchData({ params });
    }
  };

  const handleInputChange: AsyncAutocompleteOnInputChange = (
    event,
    newInputValue,
    reason
  ) => {
    inputReasonRef.current = reason;
    internalInputValueRef.current = newInputValue;
    setInternalInputValue(newInputValue || "");
    if (["input", "clear"].includes(reason)) {
      handleDataFetch({ keyword: newInputValue }, { enabledDebounce: true });
    }
    onInputChange && onInputChange(event, newInputValue, reason);
  };

  const handleChange: AsyncAutocompleteOnChange<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  > = (_, newValue, reason) => {
    onChange &&
      onChange(
        {
          target: {
            name: name || "",
            value: newValue,
          },
        },
        newValue,
        reason
      );
  };

  const handleOpen = (event: React.SyntheticEvent) => {
    handleDataFetch();
    onOpen && onOpen(event);
  };

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const { InputProps, ...restParams } = params;

    return !!controlledRenderInput ? (
      controlledRenderInput(params, { options: data, isLoading })
    ) : (
      <AppTextField
        {...(restParams as any)}
        name={name}
        onBlur={onBlur ? (onBlur as any) : () => {}}
        {...defaultInputProps}
        autoComplete="off"
        ref={InputProps.ref}
        classes={{
          root: InputProps.className,
        }}
        startAdornment={InputProps.startAdornment}
        endAdornment={
          <>
            {data.length < 1 && isLoading ? <AppLoading size={24} /> : null}
            {InputProps.endAdornment}
          </>
        }
      />
    );
  };

  useEffect(() => {
    if (!isServerSide && !disabledModule) {
      setPage(1);
      debounceFetchData({
        params: {
          ...moduleParams,
          page: 1,
          page_size: pageSize,
        },
        isNextPage: false,
      });
    }
  }, [controlledModule, moduleParams]);

  useEffect(() => {
    if (inputValue !== internalInputValueRef.current) {
      setInternalInputValue(inputValue);
    }
  }, [inputValue]);

  const isMounted = useIsMounted();

  return (
    <AppAutocomplete
      disableCloseOnSelect={multiple}
      getOptionLabel={_module.getOptionLabel}
      isOptionEqualToValue={_module.isOptionEqualToValue}
      renderOption={_module.renderOption as any}
      loading={isLoading}
      {...rest}
      ListboxComponent={
        isServerSide
          ? (VirtualizationListboxComponent as any)
          : (AutocompleteListboxVirtualization as any)
      }
      {...autocompleteProps}
      classes={{
        ...muiClasses,
        listbox: cx(muiClasses?.listbox, classes.listBox),
      }}
      options={(isLoading ? [] : data) || []}
      multiple={multiple}
      noOptionsText={
        noOptionsText || errorMessage || _module.noOptionsText || undefined
      }
      renderInput={renderInput}
      onInputChange={handleInputChange}
      onOpen={handleOpen}
      onChange={handleChange as any}
    />
  );
};

export default AsyncAutocomplete;
