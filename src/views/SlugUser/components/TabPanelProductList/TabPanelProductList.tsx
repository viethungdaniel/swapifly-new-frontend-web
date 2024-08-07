import { bindActionCreators } from "redux";
import axios from "axios";

import { storeProductAction, storeProductSelectors } from "@/store";
import { commonConstants } from "@/utils/constants";
import { commonHelpers } from "@/utils/helpers";

import { Divider, Grid } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppToolbar from "@/components/AppToolbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import WindowInfiniteScrollLoader from "@/components/WindowInfiniteScrollLoader";
import NoSearchResults from "@/components/NoSearchResults";
import AppButton from "@/components/AppButton";
import ProductCard from "@/containers/ProductCard";
import AppLoading from "@/components/AppLoading";
import AdCard from "@/components/AdCard";

import SearchIcon from "@@/public/images/icons/search.svg";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useDebouncedCallback,
  useEventCallback,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./TabPanelProductList.styles";

import type { CancelToken, CancelTokenSource } from "axios";

type SearchInputProps = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const PRODUCT_LIMIT = 8;

const SearchInput = (props: SearchInputProps) => {
  const { value: controlledValue, onChange } = props;

  const [value, setValue] = useState(controlledValue ?? "");

  const curControlledValueRef = useRef(controlledValue);
  const inputChangeEventRef = useRef<React.ChangeEvent<HTMLInputElement>>();
  const debounceChangeEventAnchorRef = useRef<HTMLDivElement | null>(null);

  const { classes } = useStyles();

  const { t } = useTranslation();

  const debounceChange = useDebouncedCallback(() => {
    debounceChangeEventAnchorRef.current?.click &&
      debounceChangeEventAnchorRef.current.click();
  }, 500);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setValue(event.target.value);
    curControlledValueRef.current = event.target.value;
    inputChangeEventRef.current = event;
    debounceChange();
  };

  const handleHiddenActionClick = () => {
    onChange && onChange(inputChangeEventRef.current!);
  };

  const handleSearchButtonClick = () => {
    onChange &&
      onChange({
        target: {
          name: "",
          value,
        },
      } as any);
  };

  useEffect(() => {
    if (controlledValue !== curControlledValueRef.current) {
      setValue(controlledValue ?? "");
      curControlledValueRef.current = controlledValue;
    }
  }, [controlledValue]);

  return (
    <>
      <div
        ref={debounceChangeEventAnchorRef}
        style={{ display: "none" }}
        onClick={handleHiddenActionClick}
      />
      <AppTextField
        className={classes.searchInput}
        value={value}
        placeholder={`${t("search")}...`}
        bgColor="common.lighterNeutral"
        borderRadius="circular"
        endAdornment={
          <AppInputAdornment position="end">
            <AppIconButton
              color="text.primary"
              borderRadius="circular"
              edge="end"
              onClick={handleSearchButtonClick}
            >
              <AppSvgIcon component={SearchIcon} fontSize="inherit" />
            </AppIconButton>
          </AppInputAdornment>
        }
        onChange={handleInputChange}
      />
    </>
  );
};

const ProductList = () => {
  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);

  const $s_adWithUserProducts = useAppSelector(
    storeProductSelectors.selectAdWithUserProducts
  );

  return $s_adWithUserProducts.map(
    (adWithUserProduct, adWithUserProductIndex) => {
      if (!!adWithUserProduct.productsRectangleAd)
        return (
          <Grid
            key={`productRectangleAd-${
              adWithUserProduct.productsRectangleAd.id || adWithUserProductIndex
            }`}
            item
            xs={12}
          >
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <AdCard
                  fullWidth
                  mediaShape="rectangle"
                  ad={adWithUserProduct.productsRectangleAd}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      if (!!adWithUserProduct.productsSquareAd)
        return (
          <Grid
            key={`productsSquareAd-${adWithUserProduct.productsSquareAd.id}`}
            item
            xs={6}
            sm={4}
            md={3}
          >
            <AdCard
              ad={adWithUserProduct.productsSquareAd}
              fullWidth
              fullHeight
            />
          </Grid>
        );
      return (
        <Grid key={adWithUserProduct.userProduct!.id} item xs={6} sm={4} md={3}>
          <ProductCard
            product={adWithUserProduct.userProduct!}
            userVariant={$s_authUserId === $s_userId ? "owner" : "normal"}
            fullWidth
            fullHeight
          />
        </Grid>
      );
    }
  );

  // return $s_products.map((product) => (
  //   <Grid key={product.id} item xs={6} sm={4} lg={3}>
  //     <ProductCard
  //       product={product}
  //       fullHeight
  //       fullWidth
  //       userVariant={$s_authUserId === $s_userId ? "owner" : "normal"}
  //     />
  //   </Grid>
  // ));
};

const TabPanelProductList = () => {
  const [productPage, setProductPage] = useState(1);
  const [productKeyword, setProductKeyword] = useState("");

  const fetchProductsSourceRef = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_productsLength = useAppSelector(
    (state) => state.product.userProducts.length
  );
  const $s_productsCount = useAppSelector(
    (state) => state.product.userProductsCount
  );
  const $s_productsLoading = useAppSelector(
    (state) => state.product.userProductsLoading
  );
  const $s_productsError = useAppSelector(
    (state) => state.product.userProductsError
  );

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_hasAuth = !!$s_authUserId;

  const canLoadMore = PRODUCT_LIMIT * productPage < $s_productsCount;
  const skeletonLoading = $s_productsLoading && productPage === 1;
  const isEmptyProduct = !$s_productsLoading && $s_productsLength === 0;
  const scrollLoaderHasNextPage = useMemo(() => {
    return (
      !$s_productsLoading &&
      canLoadMore &&
      !$s_productsError &&
      productPage < commonConstants.FETCHED_MAXIMUM_PAGE
    );
  }, [$s_productsLoading, canLoadMore, productPage, $s_productsError]);

  const { classes } = useStyles();

  const fetchProducts = useEventCallback(
    (payload?: {
      params?: {
        page?: number;
        keyword?: string;
      };
      cancelToken?: CancelToken;
      meta?: {
        isLoadMore?: boolean;
        isReset?: boolean;
      };
    }) => {
      if (!$s_userId) return;
      if (!fetchProductsSourceRef.current) {
        fetchProductsSourceRef.current = axios.CancelToken.source();
      }

      type FetchProductParams = NonNullable<
        Parameters<typeof $s_productAction.fetchUserProductsSaga>[0]
      >["params"];

      let outerParams = commonHelpers.prepareRequestParams<
        Partial<FetchProductParams>
      >({
        page: payload?.params?.page,
        query: payload?.params?.keyword,
      });

      const curParams = commonHelpers.prepareRequestParams<FetchProductParams>(
        {
          limit: PRODUCT_LIMIT,
          page: productPage,
          query: productKeyword,
          ...outerParams,
          uid: $s_userId!,
          all_state: $s_authUserId === $s_userId ? 1 : 0,
        },
        { enableClearEmptyValue: true }
      );

      $s_productAction.fetchUserProductsSaga(
        {
          params: curParams,
          cancelToken: fetchProductsSourceRef.current.token,
        },
        {
          isReset: payload?.meta?.isReset,
          isLoadMore: payload?.meta?.isLoadMore,
        }
      );
    }
  );

  const handleLoadMore = () => {
    const newProductPage = productPage + 1;
    setProductPage(newProductPage);
    fetchProducts({
      params: {
        page: newProductPage,
      },
      meta: {
        isLoadMore: true,
      },
    });
  };

  const handleProductKeywordChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setProductKeyword(event.target.value);
    setProductPage(1);
    fetchProducts({
      params: {
        page: 1,
        keyword: event.target.value,
      },
      meta: {
        isReset: true,
      },
    });
  };

  useEffect(() => {
    setProductPage(1);
    fetchProducts({
      params: {
        page: 1,
      },
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchProductsSourceRef.current?.cancel &&
        fetchProductsSourceRef.current.cancel();
      fetchProductsSourceRef.current = null;
    };
  }, [$s_userId, $s_hasAuth]);

  return (
    <div>
      <AppToolbar>
        <AppTypography className={classes.title} variant="titleSemi20" noWrap>
          {t("listing")}
        </AppTypography>
        <SearchInput
          value={productKeyword}
          onChange={handleProductKeywordChange}
        />
      </AppToolbar>
      <Divider className={classes.titleDivider} />
      <AppContainer sx={{ overflowY: "clip" }}>
        <div className={classes.content}>
          <LoadingSkeleton
            loading={skeletonLoading}
            variant="standardProductCard"
            count={PRODUCT_LIMIT}
            keepMounted
            GridContainerProps={{ spacing: 2.5 }}
            GridItemProps={{ xs: 6, sm: 4, lg: 3 }}
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
              {isEmptyProduct && <NoSearchResults variant="list" />}
              {($s_productsLoading ||
                !!$s_productsError ||
                (!$s_productsLoading && canLoadMore && !$s_productsError)) && (
                <div className={classes.actions}>
                  {($s_productsLoading || !!$s_productsError) && (
                    <AppLoading variant="circular" size={40} />
                  )}
                  {!$s_productsLoading && canLoadMore && !$s_productsError && (
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
        </div>
      </AppContainer>
    </div>
  );
};

export default TabPanelProductList;
