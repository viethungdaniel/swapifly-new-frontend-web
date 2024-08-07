import axios from "axios";
import { bindActionCreators } from "redux";

import { storeProductAction, storeProductSelectors } from "@/store";
import { commonConstants } from "@/utils/constants";
import { commonHelpers } from "@/utils/helpers";

import { Divider, Grid, useEventCallback } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import ProductCard from "@/containers/ProductCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AppTypography from "@/components/AppTypography";
import WindowInfiniteScrollLoader from "@/components/WindowInfiniteScrollLoader";
import AppLoading from "@/components/AppLoading";
import AppButton from "@/components/AppButton";
import StickyAppBar from "@/components/StickyAppBar";
import NoSearchResults from "@/components/NoSearchResults";
import AdCard from "@/components/AdCard";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import useStyles from "./SimilarProductList.styles";

import type { CancelTokenSource } from "axios";
import type { FetchSimilarProductsSagaAction } from "@/store/product/types";

type SimilarProductListProps = {
  className?: string;
};

const SIMILAR_PRODUCTS_LIMIT = 8;

const SimilarProductGridList = () => {
  const $s_adWithSimilarProducts = useAppSelector(
    storeProductSelectors.selectAdWithSimilarProducts
  );

  return $s_adWithSimilarProducts.map(
    (adWithSimilarProduct, adWithSimilarProductIndex) => {
      if (!!adWithSimilarProduct.productsRectangleAd)
        return (
          <Grid
            key={`productRectangleAd-${
              adWithSimilarProduct.productsRectangleAd.id ||
              `index-${adWithSimilarProductIndex}`
            }`}
            item
            xs={12}
          >
            <Grid container justifyContent="center">
              <Grid item xs={12} md={6}>
                <AdCard
                  fullWidth
                  mediaShape="rectangle"
                  ad={adWithSimilarProduct.productsRectangleAd}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      if (!!adWithSimilarProduct.productsSquareAd)
        return (
          <Grid
            key={`productsSquareAd-${
              adWithSimilarProduct.productsSquareAd.id ||
              `index-${adWithSimilarProductIndex}`
            }`}
            item
            xs={6}
            sm={4}
            md={3}
          >
            <AdCard
              ad={adWithSimilarProduct.productsSquareAd}
              fullWidth
              fullHeight
            />
          </Grid>
        );
      return (
        <Grid
          key={
            adWithSimilarProduct.similarProduct!.id ||
            `index-${adWithSimilarProductIndex}`
          }
          item
          xs={6}
          sm={4}
          md={3}
        >
          <ProductCard
            product={adWithSimilarProduct.similarProduct!}
            fullWidth
            fullHeight
          />
        </Grid>
      );
    }
  );
};

const SimilarProductList = (props: SimilarProductListProps) => {
  const router = useRouter();

  const query = router.query as { slug: string };

  const productId = useMemo(() => {
    return commonHelpers.getProductSlugId(query.slug);
  }, [query.slug]);

  const [similarProductsPage, setSimilarProductsPage] = useState(1);

  const fetchSimilarProductsSourceRef = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);
  const $s_similarProductsLength = useAppSelector(
    (state) => state.product.similarProducts.length
  );
  const $s_similarProductsCount = useAppSelector(
    (state) => state.product.similarProductsCount
  );
  const $s_similarProductsLoading = useAppSelector(
    (state) => state.product.similarProductsLoading
  );
  const $s_similarProductsError = useAppSelector(
    (state) => state.product.similarProductsError
  );

  const canLoadMore =
    SIMILAR_PRODUCTS_LIMIT * similarProductsPage < $s_similarProductsCount;
  const skeletonLoading =
    $s_similarProductsLoading && similarProductsPage === 1;
  const isEmptyProduct =
    !$s_similarProductsLoading && $s_similarProductsLength === 0;
  const scrollLoaderHasNextPage = useMemo(() => {
    return (
      !$s_similarProductsLoading &&
      canLoadMore &&
      !$s_similarProductsError &&
      similarProductsPage < commonConstants.FETCHED_MAXIMUM_PAGE
    );
  }, [
    $s_similarProductsLoading,
    canLoadMore,
    similarProductsPage,
    $s_similarProductsError,
  ]);

  const { className } = props;

  const { classes, cx } = useStyles();

  const fetchSimilarProducts = useEventCallback(
    (payload?: {
      params?: Partial<FetchSimilarProductsSagaAction["payload"]["params"]>;
      meta?: {
        isLoadMore?: boolean;
        isReset?: boolean;
      };
    }) => {
      if (!fetchSimilarProductsSourceRef.current) {
        fetchSimilarProductsSourceRef.current = axios.CancelToken.source();
      }

      $s_productAction.fetchSimilarProductsSaga(
        {
          params: {
            page: similarProductsPage,
            ...payload?.params,
            limit: SIMILAR_PRODUCTS_LIMIT,
            id: productId!,
          },
          cancelToken: fetchSimilarProductsSourceRef.current.token,
        },
        {
          isReset: payload?.meta?.isReset,
          isLoadMore: payload?.meta?.isLoadMore,
        }
      );
    }
  );

  const handleLoadMore = () => {
    const newSimilarProductsPage = similarProductsPage + 1;
    setSimilarProductsPage((prev) => prev + 1);
    fetchSimilarProducts({
      params: {
        page: newSimilarProductsPage,
      },
      meta: {
        isLoadMore: true,
      },
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    setSimilarProductsPage(1);
    fetchSimilarProducts({
      params: {
        page: 1,
      },
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchSimilarProductsSourceRef.current?.cancel &&
        fetchSimilarProductsSourceRef.current.cancel();
      fetchSimilarProductsSourceRef.current = null;
    };
  }, [router.isReady, $s_hasAuth]);

  return (
    <section className={cx(classes.root, className)}>
      <AppContainer sx={{ mb: -2 }}>
        <Divider />
      </AppContainer>
      <div>
        <StickyAppBar
          thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}
        >
          <AppContainer>
            <AppTypography variant="bodyMed18" py={2}>
              {t("similarListing")}
            </AppTypography>
          </AppContainer>
        </StickyAppBar>
        <LoadingSkeleton
          loading={skeletonLoading}
          variant="standardProductCard"
          count={4}
          keepMounted
          GridContainerProps={{ spacing: 2.5 }}
          GridItemProps={{ xs: 6, sm: 4, md: 3 }}
        >
          <AppContainer className={classes.content}>
            {!isEmptyProduct && (
              <WindowInfiniteScrollLoader
                hasNextPage={scrollLoaderHasNextPage}
                threshold={60}
                onNextPageLoad={handleLoadMore}
              >
                <Grid container spacing={2.5}>
                  <SimilarProductGridList />
                </Grid>
              </WindowInfiniteScrollLoader>
            )}
            {isEmptyProduct && <NoSearchResults />}
            {($s_similarProductsLoading ||
              !!$s_similarProductsError ||
              (!$s_similarProductsLoading && canLoadMore)) && (
              <div className={classes.actions}>
                {($s_similarProductsLoading || !!$s_similarProductsError) && (
                  <AppLoading variant="circular" size={40} />
                )}
                {!$s_similarProductsLoading && canLoadMore && (
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
          </AppContainer>
        </LoadingSkeleton>
      </div>
    </section>
  );
};

export default SimilarProductList;
