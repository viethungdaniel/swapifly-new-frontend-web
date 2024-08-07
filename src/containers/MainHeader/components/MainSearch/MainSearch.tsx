import _debounce from "lodash/debounce";
import _kebabCase from "lodash/kebabCase";
import axios from "axios";

import { appGtagService, storageService } from "@/services";
import { storageKeyConstants } from "@/utils/constants";
import { commonApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import { FetchSearchHistoriesResponseData } from "@/utils/apis/common";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createFilterOptions } from "@mui/material/Autocomplete";
import DesktopSearch from "./components/DesktopSearch";
import MobileSearch from "./components/MobileSearch";

import MainSearchContext from "./MainSearch.context";
import MainHeaderContext from "@/containers/MainHeader/MainHeader.context";

import { useAppSelector, useEventCallback, useIsMounted } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import type { MainSearchContextValue } from "./MainSearch.context";
import type { CancelTokenSource } from "axios";

type MainSearchProps = {
  variant: "desktop" | "mobile";
};

const MainSearch = (props: MainSearchProps) => {
  const { variant = "desktop" } = props;

  const {
    search: controlledSearch,
    selectedProductCategoryId,
    setSearch: setControlledSearch,
    setSelectedProductCategoryId,
  } = useContext(MainHeaderContext);

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);
  const $s_settings = useAppSelector((state) => state.common.settings);

  const router = useRouter();

  const { slug, ...query } = router.query;

  const [histories, setHistories] = useState<
    MainSearchContextValue["optionMenus"]
  >([]);

  const [search, setSearch] = useState(controlledSearch ?? "");
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(search);

  const curSearchRef = useRef(search);
  const historiesSourceRef = useRef<CancelTokenSource>();

  const { t } = useTranslation();

  const filterLocalHistories = createFilterOptions({
    limit: $s_settings.search_history_max_records,
    matchFrom: "any",
  });

  const optionMenus = useMemo<MainSearchContextValue["optionMenus"]>(() => {
    let results = [...histories];

    results = filterLocalHistories(results, {
      inputValue: searchInput,
      getOptionLabel: (option: any) => option.label,
    }) as MainSearchContextValue["optionMenus"];
    $s_settings.search_history_max_records;

    if (!!searchInput) {
      results.unshift({
        key: "userSearch",
        variant: "userSearch",
        label: t("searchUserWithKeyword", {
          keyword: searchInput,
        }),
        value: searchInput,
        search: searchInput,
      });
    }

    return results;
  }, [histories, search, $s_hasAuth, $s_settings.search_history_max_records]);

  const fetchOptionMenus: MainSearchContextValue["fetchOptionMenus"] =
    useEventCallback(async () => {
      historiesSourceRef.current = axios.CancelToken.source();
      try {
        const { data: response } = await commonApi.fetchSearchHistories({
          cancelToken: historiesSourceRef.current.token,
        });
        if (axiosHelpers.checkRequestSuccess(response)) {
          const newHistories: MainSearchContextValue["optionMenus"] = (
            response.data as FetchSearchHistoriesResponseData
          ).map((history) => ({
            key: `${history.id}`,
            label: history.title,
            search: history.title,
            value: history.title,
            variant: "productSearch",
            isHistory: true,
          }));
          setHistories(newHistories);
        }
      } catch (error) {}
    });

  const changeControlledSearch = useEventCallback((search: string) => {
    setControlledSearch(search);
  });

  const debounceChangeControlledSearch = useCallback(
    _debounce(changeControlledSearch, 500),
    []
  );

  const saveSubmittedSearchHistory = async (searchValue: string) => {
    try {
      await commonApi.saveSubmittedSearchHistory({
        params: {
          title: searchValue,
        },
      });
    } catch (_) {}
    fetchOptionMenus();
  };

  const handleHistoryRemove: MainSearchContextValue["handleHistoryRemove"] =
    (key) => (event: React.SyntheticEvent) => {
      event.stopPropagation();
      const newHistories = histories.filter((history) => history.key !== key);
      if ($s_hasAuth) {
        try {
          commonApi.removeSearchHistory({ params: { id: key as SafeNumber } });
        } catch (error) {
          console.log(error);
        }
      }
      setHistories(newHistories);
    };

  const handleHistoryClear: MainSearchContextValue["handleHistoryClear"] =
    () => {
      setHistories([]);
      try {
        commonApi.clearSearchHistory();
      } catch {}
    };

  const handleSearchChange: MainSearchContextValue["handleSearchChange"] = (
    event
  ) => {
    historiesSourceRef.current?.cancel && historiesSourceRef.current.cancel();
    const newSearch = event.target.value;
    curSearchRef.current = newSearch;
    setSearchInput(newSearch);
    setSearch(newSearch);
    setSubmittedSearch("");
  };

  const handleProductCategoryChange: MainSearchContextValue["handleProductCategoryChange"] =
    (newProductCategory) => {
      setSelectedProductCategoryId(newProductCategory?.id ?? null);
    };

  const submitSearch = (optionMenu?: (typeof optionMenus)[number]) => {
    let newOptionMenu = optionMenu
      ? { ...optionMenu }
      : search.length >= 1
      ? ({
          key: "productSearch",
          variant: "productSearch",
          isHistory: true,
          label: search,
          search,
          value: search,
        } as (typeof optionMenus)[number])
      : undefined;

    if (!newOptionMenu) return;

    switch (newOptionMenu!.variant) {
      case "userSearch": {
        newOptionMenu.label = newOptionMenu!.search;
        break;
      }
    }
    if (newOptionMenu!.variant === "productSearch") {
      if ($s_hasAuth) {
        saveSubmittedSearchHistory(search);
      } else {
        const newHistories = [
          {
            ...newOptionMenu,
            key: `localHistory::${newOptionMenu.search}::${newOptionMenu.key}`,
          },
          ...histories.filter((history) => {
            if (history.variant === newOptionMenu!.variant) {
              return history.value !== newOptionMenu!.value;
            }
            return true;
          }),
        ];
        newHistories.length - $s_settings.search_history_max_records > 0 &&
          newHistories.splice(
            $s_settings.search_history_max_records,
            newHistories.length - $s_settings.search_history_max_records
          );
        setHistories(newHistories);
        storageService.saveLocalItem(
          storageKeyConstants.SEARCH_HISTORY,
          newHistories
        );
      }
    }

    setSearchInput("");
    setSubmittedSearch(newOptionMenu.search);

    switch (newOptionMenu.variant) {
      case "userSearch": {
        appGtagService.dispatchSearchEvent({
          keyword: newOptionMenu.search,
        });
        router.push({
          pathname: "/user-search",
          query: {
            ...query,
            keyword: newOptionMenu.search,
          },
        });
        break;
      }
      case "productSearch": {
        appGtagService.dispatchSearchEvent({
          keyword: newOptionMenu.search,
        });
        router.push({
          pathname: "/search",
          query: commonHelpers.prepareRequestParams(
            {
              ...query,
              keyword: newOptionMenu.search,
              product_category: selectedProductCategoryId ?? null,
            },
            { enableClearEmptyValue: true }
          ),
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (!isMounted()) return;
    if (controlledSearch !== curSearchRef.current) {
      curSearchRef.current = controlledSearch!;
      debounceChangeControlledSearch.cancel();
      setSearch(controlledSearch ?? "");
      setSubmittedSearch(controlledSearch ?? "");
    }
  }, [controlledSearch]);

  useEffect(() => {
    if ($s_hasAuth) {
      setHistories([]);
      fetchOptionMenus();
    } else {
      const histories = storageService.getLocalItem<
        MainSearchContextValue["optionMenus"]
      >(storageKeyConstants.SEARCH_HISTORY);
      setHistories(histories ?? []);
    }
    return () => {
      historiesSourceRef.current?.cancel && historiesSourceRef.current.cancel();
    };
  }, [$s_hasAuth]);

  const isMounted = useIsMounted();

  return (
    <MainSearchContext.Provider
      value={{
        optionMenus,
        search,
        searchInput,
        submittedSearch,
        histories,
        setSearch,
        setSearchInput,
        setSubmittedSearch,
        fetchOptionMenus,
        submitSearch,
        handleHistoryRemove,
        handleSearchChange,
        handleHistoryClear,
        handleProductCategoryChange,
      }}
    >
      {variant === "desktop" ? <DesktopSearch /> : <MobileSearch />}
    </MainSearchContext.Provider>
  );
};

export default MainSearch;
