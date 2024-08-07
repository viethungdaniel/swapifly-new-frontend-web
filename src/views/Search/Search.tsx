import axios from "axios";
import { bindActionCreators } from "redux";
import _isEqual from "lodash/isEqual";

import { brandApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import {
  storeAdAction,
  storeProductAction,
  storeProductCategorySelectors,
  storeProductConditionAction,
  storeProductSelectors,
  storeProductSortAction,
} from "@/store";
import { commonConstants } from "@/utils/constants";

import { Grid } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppLoading from "@/components/AppLoading";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProductCard from "@/containers/ProductCard";
import ProductFilterBar from "@/containers/ProductFilterBar";
import NoSearchResults from "@/components/NoSearchResults";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent/AppContent";
import LoadingOverlay from "@/components/LoadingOverlay";
import WindowInfiniteScrollLoader from "@/components/WindowInfiniteScrollLoader";
import StickyAppBar from "@/components/StickyAppBar";
import AdCard from "@/components/AdCard";

import {
  useAppDispatch,
  useAppSelector,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./Search.styles";

import type { CancelToken, CancelTokenSource } from "axios";
import type { ProductFilterBarProps } from "@/containers/ProductFilterBar";

const MemoProductFilterBar = memo(ProductFilterBar);

export type SearchProps = {
  query: {
    keyword?: string;
    product_category_id?: number | null;
    brand_ids?: number[];
    product_sort_id?: number | null;
    product_condition_ids?: number[];
    max_price?: EmptySafeNumber;
    min_price?: EmptySafeNumber;
    is_trade_in_person?: BooleanNumber;
    is_post_courier?: BooleanNumber;
    merchant_location_ids?: number[];
    user_ids?: number[];
  };
};

const PRODUCT_LIMIT = 8;

const FetchData = () => {
  const fetchedProductConditionSourceRef = useRef<CancelTokenSource | null>(
    null
  );
  const fetchedProductSortSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_productConditionAction = useMemo(
    () => bindActionCreators(storeProductConditionAction, dispatch),
    [dispatch]
  );
  const $s_productSortAction = useMemo(
    () => bindActionCreators(storeProductSortAction, dispatch),
    [dispatch]
  );

  useEffect(() => {
    fetchedProductConditionSourceRef.current = axios.CancelToken.source();
    fetchedProductSortSourceRef.current = axios.CancelToken.source();

    $s_productConditionAction.fetchProductConditionsSaga({
      cancelToken: fetchedProductConditionSourceRef.current.token,
    });
    $s_productSortAction.fetchProductSortsSaga({
      cancelToken: fetchedProductSortSourceRef.current.token,
    });
    return () => {
      fetchedProductConditionSourceRef.current!.cancel();
      fetchedProductSortSourceRef.current!.cancel();
    };
  }, []);

  return null;
};

const ProductList = () => {
  const $s_adWithProducts = useAppSelector(
    storeProductSelectors.selectAdWithProducts
  );

  return $s_adWithProducts.map((adWithProduct, adWithProductIndex) => {
    if (!!adWithProduct.productsRectangleAd)
      return (
        <Grid
          key={`productRectangleAd-${
            adWithProduct.productsRectangleAd.id || adWithProductIndex
          }`}
          item
          xs={12}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6}>
              <AdCard
                fullWidth
                mediaShape="rectangle"
                ad={adWithProduct.productsRectangleAd}
              />
            </Grid>
          </Grid>
        </Grid>
      );
    if (!!adWithProduct.productsSquareAd)
      return (
        <Grid
          key={`productsSquareAd-${adWithProduct.productsSquareAd.id}`}
          item
          xs={6}
          sm={4}
          md={3}
        >
          <AdCard ad={adWithProduct.productsSquareAd} fullWidth fullHeight />
        </Grid>
      );
    return (
      <Grid key={adWithProduct.product!.id} item xs={6} sm={4} md={3}>
        <ProductCard product={adWithProduct.product!} fullWidth fullHeight />
      </Grid>
    );
  });
};

const Search = (props: SearchProps) => {
  const { query } = props;

  const router = useRouter();

  const curQueryRef = useRef<SearchProps["query"]>({});

  const queryKeyword = useMemo(() => {
    return (
      (commonHelpers.getOneRouterQueryValue(query.keyword) as string) ?? ""
    );
  }, [query.keyword]);

  const fetchedProductsSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchBrandsSourceRef = useRef<CancelTokenSource | null>(null);

  const { classes } = useStyles();
  const { t } = useTranslation();

  const [isFetchingFilterBrands, setIsFetchingFilterBrands] = useState(
    (query.brand_ids?.length ?? 0) > 0
  );
  const [isFetchingFilterProductCategory, setIsFetchingFilterProductCategory] =
    useState(!!query.product_category_id);
  const [
    isFetchingFilterProductConditions,
    setIsFetchingFilterProductConditions,
  ] = useState((query.product_condition_ids?.length ?? 0) > 0);
  const [isFetchingFilterProductSort, setIsFetchingFilterProductSort] =
    useState(!!query.product_sort_id);

  const [productsPage, setProductsPage] = useState(1);
  const [productFilterBrands, setProductFilterBrands] = useState<
    NonNullable<ProductFilterBarProps["filterValue"]>["brands"]
  >([]);
  const [productFilterProductCategory, setProductFilterProductCategory] =
    useState<
      NonNullable<ProductFilterBarProps["filterValue"]>["product_category"]
    >(null);
  const [productFilterProductConditions, setProductFilterProductConditions] =
    useState<
      NonNullable<ProductFilterBarProps["filterValue"]>["product_conditions"]
    >([]);
  const [productFilterProductSort, setProductFilterProductSort] =
    useState<NonNullable<ProductFilterBarProps["filterValue"]>["product_sort"]>(
      null
    );
  const [productFilterMaxPrice, setProductFilterMaxPrice] = useState<
    NonNullable<ProductFilterBarProps["filterValue"]>["max_price"]
  >(query.max_price ?? "");
  const [productFilterMinPrice, setProductFilterMinPrice] = useState<
    NonNullable<ProductFilterBarProps["filterValue"]>["min_price"]
  >(query.min_price ?? "");
  const [productFilterIsPostCourier, setProductFilterIsPostCourier] = useState<
    NonNullable<ProductFilterBarProps["filterValue"]>["is_post_courier"]
  >(query.is_post_courier ?? 0);
  const [productFilterIsTradeInPerson, setProductFilterIsTradeInPerson] =
    useState<
      NonNullable<ProductFilterBarProps["filterValue"]>["is_trade_in_person"]
    >(query.is_trade_in_person ?? 0);

  const filterValue = useMemo<
    NonNullable<ProductFilterBarProps["filterValue"]>
  >(() => {
    return {
      brands: productFilterBrands,
      product_category: productFilterProductCategory,
      product_conditions: productFilterProductConditions,
      product_sort: productFilterProductSort,
      max_price: productFilterMaxPrice,
      min_price: productFilterMinPrice,
      is_post_courier: productFilterIsPostCourier,
      is_trade_in_person: productFilterIsTradeInPerson,
    };
  }, [
    productFilterBrands,
    productFilterProductCategory,
    productFilterProductConditions,
    productFilterProductSort,
    productFilterMaxPrice,
    productFilterMinPrice,
    productFilterIsPostCourier,
    productFilterIsTradeInPerson,
  ]);

  const curFilterValueRef = useRef<typeof filterValue>({});

  const fetchedProductsAdsSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_adAction = useMemo(
    () => bindActionCreators(storeAdAction, dispatch),
    [dispatch]
  );

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);
  const $s_productsLength = useAppSelector(
    (state) => state.product.products.length
  );
  const $s_productsCount = useAppSelector(
    (state) => state.product.productsCount
  );
  const $s_productsLoading = useAppSelector(
    (state) => state.product.productsLoading
  );
  const $s_productsError = useAppSelector(
    (state) => state.product.productsError
  );
  const $s_idToProductCategoriesTreesMap = useAppSelector(
    storeProductCategorySelectors.selectIdToProductCategoriesTreesMap
  );
  const $s_productCategoryLoading = useAppSelector(
    (state) => state.productCategory.productCategoriesLoading
  );

  const $s_productConditions = useAppSelector(
    (state) => state.productCondition.productConditions
  );
  const $s_productConditionsLoading = useAppSelector(
    (state) => state.productCondition.productConditionsLoading
  );

  const $s_productSorts = useAppSelector(
    (state) => state.productSort.productSorts
  );
  const $s_productSortsLoading = useAppSelector(
    (state) => state.productSort.productSortsLoading
  );

  const $s_productsRectangleAdsLoading = useAppSelector(
    (state) => state.ad.productsRectangleAdsLoading
  );
  const $s_productsSquareAdsLoading = useAppSelector(
    (state) => state.ad.productsSquareAdsLoading
  );

  const $s_region = useAppSelector((state) => state.common.region);

  const canLoadMore = PRODUCT_LIMIT * productsPage < $s_productsCount;
  const skeletonLoading =
    ($s_productsLoading && productsPage === 1) ||
    $s_productsRectangleAdsLoading ||
    $s_productsSquareAdsLoading;
  const isEmptyProduct = !$s_productsLoading && $s_productsLength === 0;

  const pageLoading = useMemo(() => {
    return (
      isFetchingFilterBrands ||
      isFetchingFilterProductCategory ||
      isFetchingFilterProductConditions ||
      isFetchingFilterProductSort
    );
  }, [
    isFetchingFilterBrands,
    isFetchingFilterProductCategory,
    isFetchingFilterProductConditions,
    isFetchingFilterProductSort,
  ]);

  const scrollLoaderHasNextPage = useMemo(() => {
    return (
      !$s_productsLoading &&
      canLoadMore &&
      !$s_productsError &&
      productsPage < commonConstants.FETCHED_MAXIMUM_PAGE
    );
  }, [$s_productsLoading, canLoadMore, productsPage, $s_productsError]);

  const fetchProducts = useEventCallback(
    (payload?: {
      params?: {
        page?: number;
        keyword?: string;
        merchant_location_ids?: number[];
        user_ids?: number[];
        product_category_id?: EmptySafeNumber;
        product_condition_ids?: number[];
        product_sort_id?: EmptySafeNumber;
        brand_ids?: number[];
        is_post_courier?: BooleanNumber;
        is_trade_in_person?: BooleanNumber;
        min_price?: EmptySafeNumber;
        max_price?: EmptySafeNumber;
      };
      cancelToken?: CancelToken;
      meta?: {
        isLoadMore?: boolean;
        isReset?: boolean;
      };
    }) => {
      if (!fetchedProductsSourceRef.current) {
        fetchedProductsSourceRef.current = axios.CancelToken.source();
      }

      type FetchProductParams = NonNullable<
        Parameters<typeof $s_productAction.fetchProductsSaga>[0]
      >["params"];

      let outerParams = commonHelpers.prepareRequestParams<FetchProductParams>({
        page: payload?.params?.page,
        mail: payload?.params?.is_post_courier,
        offline: payload?.params?.is_trade_in_person,
        min: payload?.params?.min_price,
        max: payload?.params?.max_price,
        sort: payload?.params?.product_sort_id,
        query: payload?.params?.keyword,
        merchant_location_ids: payload?.params?.merchant_location_ids,
        uids: payload?.params?.user_ids,
        nids: payload?.params?.product_condition_ids,
        rid: payload?.params?.product_category_id as number,
        brand_ids: payload?.params?.brand_ids,
      });

      const curParams = commonHelpers.prepareRequestParams<FetchProductParams>(
        {
          limit: PRODUCT_LIMIT,
          page: productsPage,
          mail: filterValue?.is_post_courier,
          offline: filterValue?.is_trade_in_person,
          min: filterValue?.min_price,
          max: filterValue?.max_price,
          sort: filterValue?.product_sort?.id,
          query: queryKeyword,
          merchant_location_ids: query?.merchant_location_ids,
          uids: query?.user_ids,
          nids: filterValue?.product_conditions
            ? filterValue?.product_conditions.map(
                (productCondition) => productCondition.id
              )
            : [],
          rid: filterValue?.product_category?.id,
          brand_ids: (filterValue?.brands ?? []).map((brand) => brand.id),
          ...outerParams,
        },
        { enableClearEmptyValue: true }
      );

      $s_productAction.fetchProductsSaga(
        {
          params: curParams,
          cancelToken: fetchedProductsSourceRef.current.token,
        },
        {
          isReset: payload?.meta?.isReset,
          isLoadMore: payload?.meta?.isLoadMore,
        }
      );
    }
  );

  const fetchProductsAds = () => {
    fetchedProductsAdsSourceRef.current &&
      fetchedProductsAdsSourceRef.current!.cancel();
    fetchedProductsAdsSourceRef.current = axios.CancelToken.source();
    $s_adAction.fetchAdsSaga(
      {
        params: {
          scopes: ["productsRectangleAds", "productsSquareAds"],
        },
        cancelToken: fetchedProductsAdsSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
  };

  const fetchFilterBrands = async () => {
    const brandIds = query.brand_ids ?? [];
    if (brandIds.length < 1) {
      curFilterValueRef.current.brands = [];
      setProductFilterBrands([]);
      setIsFetchingFilterBrands(false);
      return;
    }
    setIsFetchingFilterBrands(true);
    try {
      const { data: response } = await brandApi.fetchBrands({
        params: {
          ids: brandIds,
        },
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        const newBrands = (response.data.data ?? []).map((brand) => ({
          title: brand.title,
          id: brand.id,
        }));
        curFilterValueRef.current.brands = newBrands;
        setProductFilterBrands(newBrands);
      } else setProductFilterBrands([]);
    } catch (error) {
      if (!isMounted()) return;
      if (!axios.isCancel(error)) {
        setProductFilterBrands([]);
      }
    }
    setIsFetchingFilterBrands(false);
  };

  const handleLoadMore = () => {
    const newProductPage = productsPage + 1;
    setProductsPage(newProductPage);
    fetchProducts({
      params: {
        page: newProductPage,
      },
      meta: {
        isLoadMore: true,
      },
    });
  };

  const handleFilterValueChange = useCallback(
    (
      newFilterValue: Parameters<
        NonNullable<ProductFilterBarProps["onFilterValueChange"]>
      >[0]
    ) => {
      curFilterValueRef.current = {
        brands: newFilterValue.brands,
        product_category: newFilterValue.product_category,
        product_conditions: newFilterValue.product_conditions,
        product_sort: newFilterValue.product_sort,
        max_price: newFilterValue.max_price,
        min_price: newFilterValue.min_price,
        is_post_courier: newFilterValue.is_post_courier,
        is_trade_in_person: newFilterValue.is_trade_in_person,
      };
      const newQuery = {
        keyword: queryKeyword,
        merchant_location_ids: [],
        user_ids: [],
        brand_ids: newFilterValue.brands.map((brand) => brand.id),
        product_category_id: newFilterValue.product_category?.id || null,
        is_trade_in_person: newFilterValue.is_trade_in_person,
        is_post_courier: newFilterValue.is_post_courier,
        max_price: newFilterValue.max_price,
        min_price: newFilterValue.min_price,
        product_condition_ids: newFilterValue.product_conditions.map(
          (productCondition) => productCondition.id
        ),
        product_sort_id: newFilterValue.product_sort?.id || null,
      } as SearchProps["query"];
      const newRouterQuery = commonHelpers.prepareRequestParams(
        {
          keyword: newQuery.keyword,
          brand: newQuery.brand_ids,
          product_category: newQuery.product_category_id,
          is_trade_in_person: newQuery.is_trade_in_person || null,
          is_post_courier: newQuery.is_post_courier || null,
          max_price: newQuery.max_price,
          min_price: newQuery.min_price,
          product_condition: newQuery.product_condition_ids,
          product_sort: newQuery.product_sort_id,
        },
        {
          enableClearEmptyValue: true,
        }
      );
      curQueryRef.current = newQuery;

      setProductFilterProductCategory(newFilterValue.product_category);
      setProductFilterBrands(newFilterValue.brands);
      setProductFilterProductConditions(newFilterValue.product_conditions);
      setProductFilterProductSort(newFilterValue.product_sort);
      setProductFilterMaxPrice(newFilterValue.max_price);
      setProductFilterMinPrice(newFilterValue.min_price);
      setProductFilterIsTradeInPerson(newFilterValue.is_trade_in_person);
      setProductFilterIsPostCourier(newFilterValue.is_post_courier);
      setProductsPage(1);

      fetchedProductsSourceRef.current?.cancel &&
        fetchedProductsSourceRef.current.cancel();
      fetchedProductsSourceRef.current = null;

      newFilterValue?.product_category?.id !==
        filterValue?.product_category?.id && fetchProductsAds();

      fetchProducts({
        params: {
          page: 1,
          is_post_courier: newFilterValue.is_post_courier,
          is_trade_in_person: newFilterValue.is_trade_in_person,
          max_price: newFilterValue.max_price,
          min_price: newFilterValue.min_price,
          product_category_id: commonHelpers.isEmpty(
            newFilterValue.product_category?.id
          )
            ? ("" as const)
            : newFilterValue.product_category?.id,
          product_condition_ids: newFilterValue.product_conditions.map(
            (productCondition) => productCondition.id
          ),
          brand_ids: newFilterValue.brands.map((brand) => brand.id),
          product_sort_id: commonHelpers.isEmpty(
            newFilterValue.product_sort?.id
          )
            ? ("" as const)
            : newFilterValue.product_sort?.id,
          merchant_location_ids: [],
          user_ids: [],
        },
        meta: {
          isReset: true,
        },
      });

      router.push(
        {
          query: newRouterQuery,
        },
        undefined,
        {
          shallow:
            (query.merchant_location_ids ?? []).length === 0 &&
            (query.user_ids ?? []).length === 0,
          scroll: false,
        }
      );
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    [queryKeyword, filterValue.product_category?.id]
  );

  useEffect(() => {
    if (_isEqual(query.max_price, curFilterValueRef.current.max_price)) return;
    curFilterValueRef.current.max_price = query.max_price;
    setProductFilterMaxPrice(query.max_price);
  }, [query]);

  useEffect(() => {
    if (_isEqual(query.min_price, curFilterValueRef.current.min_price)) return;
    curFilterValueRef.current.min_price = query.min_price;
    setProductFilterMinPrice(query.min_price);
  }, [query]);

  useEffect(() => {
    if (
      _isEqual(query.is_post_courier, curFilterValueRef.current.is_post_courier)
    )
      return;
    curFilterValueRef.current.is_post_courier = query.is_post_courier;
    setProductFilterIsPostCourier(query.is_post_courier);
  }, [query]);

  useEffect(() => {
    if (
      _isEqual(
        query.is_trade_in_person,
        curFilterValueRef.current.is_trade_in_person
      )
    )
      return;
    curFilterValueRef.current.is_trade_in_person = query.is_trade_in_person;
    setProductFilterIsTradeInPerson(query.is_trade_in_person);
  }, [query]);

  useEffect(() => {
    if (
      _isEqual(
        query.product_category_id,
        curFilterValueRef.current.product_category?.id
      )
    )
      return;
    if ($s_productCategoryLoading) {
      setIsFetchingFilterProductCategory(true);
      return;
    }
    const newProductFilterProductCategory =
      $s_idToProductCategoriesTreesMap[query.product_category_id as any] ||
      null;
    curFilterValueRef.current.product_category =
      newProductFilterProductCategory;
    setProductFilterProductCategory(newProductFilterProductCategory);
    setIsFetchingFilterProductCategory(false);
    fetchProductsAds();
  }, [query, $s_productCategoryLoading, $s_idToProductCategoriesTreesMap]);

  useEffect(() => {
    if (
      _isEqual(
        query.product_condition_ids,
        (curFilterValueRef.current.product_conditions ?? [])?.map(
          (productCondition) => productCondition.id
        )
      )
    )
      return;
    if ($s_productConditionsLoading) {
      setIsFetchingFilterProductConditions(true);
      return;
    }
    const newProductFilterProductConditions = $s_productConditions.filter(
      (productCondition) =>
        (query.product_condition_ids ?? []).includes(productCondition.id)
    );

    curFilterValueRef.current.product_conditions =
      newProductFilterProductConditions;
    setProductFilterProductConditions(newProductFilterProductConditions);
    setIsFetchingFilterProductConditions(false);
  }, [query, $s_productConditionsLoading, $s_productConditions]);

  useEffect(() => {
    if (
      _isEqual(
        query.product_sort_id,
        curFilterValueRef.current.product_sort?.id
      )
    )
      return;
    if ($s_productSortsLoading) {
      setIsFetchingFilterProductSort(true);
      return;
    }
    const newProductFilterProductSort = $s_productSorts.find(
      (productSort) => query.product_sort_id === productSort.id
    );
    curFilterValueRef.current.product_sort = newProductFilterProductSort;
    setProductFilterProductSort(newProductFilterProductSort || null);
    setIsFetchingFilterProductSort(false);
  }, [query, $s_productSortsLoading, $s_productSorts]);

  useEffect(() => {
    if (
      _isEqual(
        query.brand_ids,
        (curFilterValueRef.current.brands ?? [])?.map((brand) => brand.id)
      )
    )
      return;
    fetchFilterBrands();
    return () => {
      fetchBrandsSourceRef.current?.cancel &&
        fetchBrandsSourceRef.current.cancel();
    };
  }, [query]);

  useEffect(() => {
    if (!isMounted()) return;
    setProductsPage(1);
    fetchProducts({
      params: {
        page: 1,
      },
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchedProductsSourceRef.current?.cancel &&
        fetchedProductsSourceRef.current.cancel();
      fetchedProductsSourceRef.current = null;
    };
  }, [$s_hasAuth]);

  useEffect(() => {
    if (_isEqual(query, curQueryRef.current)) return;
    curQueryRef.current = query;
    setProductsPage(1);
    fetchProducts({
      params: {
        page: 1,
        keyword: query.keyword ?? "",
        merchant_location_ids: query.merchant_location_ids ?? [],
        user_ids: query.user_ids ?? [],
        product_category_id: query.product_category_id ?? "",
        brand_ids: query.brand_ids ?? [],
        product_sort_id: query.product_sort_id ?? "",
        min_price: query.max_price ?? "",
        max_price: query.max_price ?? "",
        product_condition_ids: query.product_condition_ids ?? [],
        is_post_courier: query.is_post_courier ?? 0,
        is_trade_in_person: query.is_trade_in_person ?? 0,
      },
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchedProductsSourceRef.current?.cancel &&
        fetchedProductsSourceRef.current.cancel();
      fetchedProductsSourceRef.current = null;
    };
  }, [query]);

  useEffect(() => {
    return () => {
      fetchedProductsAdsSourceRef.current?.cancel &&
        fetchedProductsAdsSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <>
      <FetchData />
      <AppContent className={classes.main}>
        <LoadingOverlay loading={pageLoading}>
          <AppContainer>
            <AppBreadcrumbs sx={{ marginBottom: 2 }}>
              <AppLink href="/" color="text.secondary">
                {t("home")}
              </AppLink>
              <AppTypography color="text.primary">
                {queryKeyword.length > 0
                  ? t("searchResultsForKeywordInRegion", {
                      keyword: queryKeyword,
                      regionName: $s_region?.title ?? "",
                    })
                  : t("searchResultsInRegion", {
                      regionName: $s_region?.title ?? "",
                    })}
              </AppTypography>
            </AppBreadcrumbs>

            <AppTypography variant="titleSemi20">
              {queryKeyword.length > 0
                ? t("productCountSearchResultsForKeywordInRegionWithCount", {
                    count: $s_productsCount,
                    keyword: queryKeyword,
                    regionName: $s_region?.title ?? "",
                  })
                : t("productCountSearchResultsInRegionWithCount", {
                    count: $s_productsCount,
                    regionName: $s_region?.title ?? "",
                  })}
            </AppTypography>
          </AppContainer>

          <StickyAppBar
            thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}
          >
            <AppContainer>
              <MemoProductFilterBar
                className={classes.productFilterBar}
                filterValue={filterValue}
                onFilterValueChange={handleFilterValueChange}
              />
            </AppContainer>
          </StickyAppBar>

          <AppContainer>
            <LoadingSkeleton
              loading={skeletonLoading}
              variant="standardProductCard"
              count={4}
              keepMounted
              GridContainerProps={{ spacing: 2.5 }}
              GridItemProps={{ xs: 6, sm: 4, md: 3 }}
            >
              <div className={classes.content}>
                {!isEmptyProduct && (
                  <WindowInfiniteScrollLoader
                    hasNextPage={scrollLoaderHasNextPage}
                    threshold={60}
                    onNextPageLoad={handleLoadMore}
                  >
                    <Grid container spacing={2.5}>
                      <ProductList />
                    </Grid>
                  </WindowInfiniteScrollLoader>
                )}
                {isEmptyProduct && <NoSearchResults keyword={queryKeyword} />}
                {($s_productsLoading ||
                  !!$s_productsError ||
                  (!$s_productsLoading &&
                    canLoadMore &&
                    !$s_productsError)) && (
                  <div className={classes.actions}>
                    {($s_productsLoading || !!$s_productsError) && (
                      <AppLoading variant="circular" size={40} />
                    )}
                    {!$s_productsLoading &&
                      canLoadMore &&
                      !$s_productsError && (
                        <AppButton
                          variant="outlined"
                          color="text.primary"
                          onClick={handleLoadMore}
                        >
                          {t("loadMore")}
                        </AppButton>
                      )}
                  </div>
                )}
              </div>
            </LoadingSkeleton>
          </AppContainer>
        </LoadingOverlay>
      </AppContent>
    </>
  );
};

export default Search;
