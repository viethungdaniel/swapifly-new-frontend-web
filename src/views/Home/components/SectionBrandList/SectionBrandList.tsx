import axios from "axios";
import { bindActionCreators } from "redux";

import { storeBrandAction } from "@/store";
import { commonHelpers } from "@/utils/helpers";

import BranchList from "./components/BrandList";
import MobileBrandList from "./components/MobileBrandList";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAppDispatch } from "@/hooks";

import SectionBrandListContext from "./SectionBrandList.context";

import type { SectionBrandListContextValue } from "./SectionBrandList.context";
import type { CancelTokenSource } from "axios";

const FETCHED_BRANDS_LIMIT = 8 * 5;

const SectionBanner = () => {
  const [brandsPage, setBrandsPage] = useState(1);

  const dispatch = useAppDispatch();

  const fetchBrandSourceRef = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  );
  const $s_brandAction = useMemo(
    () => bindActionCreators(storeBrandAction, dispatch),
    [dispatch]
  );

  const fetchBrands: SectionBrandListContextValue["fetchBrands"] = (
    payload,
    meta
  ) => {
    $s_brandAction.fetchBrandsSaga(
      {
        params: {
          show: 0 as const,
          page: brandsPage,
          limit: FETCHED_BRANDS_LIMIT,
          ...payload?.params,
        },
        cancelToken: fetchBrandSourceRef.current.token,
      },
      meta
    );
  };

  useEffect(() => {
    fetchBrandSourceRef.current = axios.CancelToken.source();
    fetchBrands();
    return () => {
      fetchBrandSourceRef.current?.cancel &&
        fetchBrandSourceRef.current.cancel();
    };
  }, []);

  return (
    <SectionBrandListContext.Provider
      value={{
        brandsLimit: FETCHED_BRANDS_LIMIT,
        brandsPage,
        setBrandsPage,
        fetchBrands,
      }}
    >
      {!commonHelpers.isMobile() ? <BranchList /> : <MobileBrandList />}
    </SectionBrandListContext.Provider>
  );
};

export default SectionBanner;
