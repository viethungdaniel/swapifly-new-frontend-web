import _isEqual from "lodash/isEqual";
import _debounce from "lodash/debounce";
import axios from "axios";
import { bindActionCreators } from "redux";

import {
  storeProductAction,
  storeProductCategorySelectors,
  storeProductSelectors,
} from "@/store";
import { commonHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";

import { Grid, Skeleton, Typography } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import ProductCard from "@/containers/ProductCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppContent from "@/components/AppContent/AppContent";
import StickyAppBar from "@/components/StickyAppBar";
import AdCard from "@/components/AdCard";

import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import { useAppDispatch, useAppSelector, useAuthUser } from "@/hooks";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./SectionProductListCategoryList.styles";

import type { CancelToken, CancelTokenSource } from "axios";

type ProductCategoryItemWithProductListProps = {
  productCategory: ReturnType<
    typeof storeProductCategorySelectors.selectProductCategoriesTrees
  >[number];
};

const ProductList = (props: { productCategoryId: number }) => {
  const { productCategoryId } = props;

  const selectAdWithProductCategoryHomeProducts = useCallback(
    storeProductSelectors.selectAdWithProductCategoryHomeProducts,
    []
  );

  const $s_adWithProductCategoryHomeProducts = useAppSelector((state) =>
    selectAdWithProductCategoryHomeProducts(state, productCategoryId)
  );

  return $s_adWithProductCategoryHomeProducts.map(
    (adWithProductCategoryHomeProduct) => {
      if (adWithProductCategoryHomeProduct.productsRectangleAd)
        return (
          <Grid
            key={`productRectangleAd-${adWithProductCategoryHomeProduct.productsRectangleAd.id}`}
            item
            xs={12}
          >
            <Grid container justifyContent="center">
              <Grid item xs={12} md={6}>
                <AdCard
                  fullWidth
                  fullHeight
                  mediaShape="rectangle"
                  ad={adWithProductCategoryHomeProduct.productsRectangleAd}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      if (adWithProductCategoryHomeProduct.productsSquareAd)
        return (
          <Grid
            key={`productSquareAd-${adWithProductCategoryHomeProduct.productsSquareAd.id}`}
            item
            xs={6}
            sm={4}
            md={3}
          >
            <AdCard
              fullWidth
              fullHeight
              mediaShape="square"
              ad={adWithProductCategoryHomeProduct.productsSquareAd}
            />
          </Grid>
        );
      return (
        <Grid
          key={adWithProductCategoryHomeProduct.product?.id}
          item
          xs={6}
          sm={4}
          md={3}
        >
          <ProductCard
            product={adWithProductCategoryHomeProduct.product!}
            fullWidth
            fullHeight
          />
        </Grid>
      );
    }
  );
};

const ProductCategoryItemWithProductList = (
  props: ProductCategoryItemWithProductListProps
) => {
  const { productCategory } = props;

  const productCategoryId = productCategory.id;

  const $s_homeProductsLength =
    useAppSelector(
      (state) =>
        state.product.productCategoryIdToHomeProductsMap[productCategoryId]
          ?.length
    ) ?? 0;

  const $s_homeProductsLoading =
    useAppSelector(
      (state) =>
        state.product.productCategoryIdToHomeProductsLoadingMap[
          productCategoryId
        ]
    ) ?? true;
  const $s_homeProductsError =
    useAppSelector(
      (state) =>
        state.product.productCategoryIdToHomeProductsErrorMap[productCategoryId]
    ) ?? "";

  const { t } = useTranslation();

  const { classes } = useStyles();

  if (!$s_homeProductsLoading && $s_homeProductsLength < 1) return null;

  return (
    <div className={classes.categoryItem}>
      <StickyAppBar thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}>
        <AppContainer>
          <div className={classes.categoryItemTitle}>
            <AppTypography variant="headerSemi35" flex={1} noWrap>
              {$s_homeProductsLoading ? (
                <Skeleton variant="text" sx={{ maxWidth: 120 }} />
              ) : (
                productCategory.title
              )}
            </AppTypography>
            {!$s_homeProductsLoading && (
              <div className={classes.categoryItemActions}>
                <AppButton
                  component={AppLink}
                  href={{
                    pathname: `/${commonHelpers.generateProductCategorySlug(
                      productCategory.title,
                      productCategory.id
                    )}`,
                    query: {
                      product_category:
                        commonHelpers.encodeURIComponentQueryItem(
                          productCategory.title,
                          productCategory.id
                        ),
                    },
                  }}
                  underline="none"
                  color="text.primary"
                  edge="xy"
                  size="small"
                  endIcon={
                    <AppSvgIcon component={ArrowRightIcon} fontSize="inherit" />
                  }
                >
                  {t("seeAll")}
                </AppButton>
              </div>
            )}
          </div>
        </AppContainer>
      </StickyAppBar>

      <AppContainer>
        <LoadingSkeleton
          loading={$s_homeProductsLoading || !!$s_homeProductsError}
          count={4}
          keepMounted
          variant="standardProductCard"
          GridContainerProps={{ spacing: 2.5 }}
          GridItemProps={{ xs: 6, sm: 4, md: 3 }}
        >
          {$s_homeProductsLength > 0 ? (
            <Grid container spacing={2.5}>
              <ProductList productCategoryId={productCategoryId} />
            </Grid>
          ) : (
            <Typography align="center" color="textSecondary">
              {t("noResults")}
            </Typography>
          )}
        </LoadingSkeleton>
      </AppContainer>
    </div>
  );
};

const SectionProductListCategoryList = () => {
  const fetchHomeProductsByProductCategoryIdSourceRef =
    useRef<CancelTokenSource>();

  const { hasAuth } = useAuthUser();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_productCategoriesTrees = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesTrees
  );
  const $s_productCategoriesLoading = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesLoading
  );
  const $s_productCategoriesError = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesError
  );

  const { classes } = useStyles();

  const fetchHomeProductsByProductCategoryId = (payload: {
    params: {
      productCategoryId: number;
    };
    cancelToken: CancelToken;
  }) => {
    const { productCategoryId } = payload.params;
    $s_productAction.fetchMapHomeProductsByProductCategoryIdSaga({
      params: {
        rid: productCategoryId,
        limit: 12,
      },
      cancelToken: payload.cancelToken,
    });
  };

  useEffect(() => {
    if ($s_productCategoriesTrees.length > 0) {
      const debouncedMap = {} as {
        [key: number]: ReturnType<typeof _debounce>;
      };
      fetchHomeProductsByProductCategoryIdSourceRef.current =
        axios.CancelToken.source();
      $s_productCategoriesTrees.forEach(
        (productCategory, productCategoryIndex) => {
          debouncedMap[productCategoryIndex] = _debounce(
            fetchHomeProductsByProductCategoryId,
            250 * productCategoryIndex
          );
          debouncedMap[productCategoryIndex]({
            params: {
              productCategoryId: productCategory.id,
            },
            cancelToken:
              fetchHomeProductsByProductCategoryIdSourceRef.current!.token,
          });
        }
      );

      return () => {
        fetchHomeProductsByProductCategoryIdSourceRef.current!.cancel();
        Object.entries(debouncedMap).forEach(([_, debounced]) => {
          debounced.cancel();
        });
      };
    }
    return;
  }, [$s_productCategoriesTrees, hasAuth]);

  return (
    <AppContent component={"section"}>
      <LoadingOverlay
        loading={$s_productCategoriesLoading || !!$s_productCategoriesError}
      >
        {$s_productCategoriesTrees.length > 0 && (
          <div className={classes.categoryList}>
            {$s_productCategoriesTrees.map((productCategory) => (
              <ProductCategoryItemWithProductList
                key={productCategory.id}
                productCategory={productCategory}
              />
            ))}
          </div>
        )}
      </LoadingOverlay>
    </AppContent>
  );
};

export default SectionProductListCategoryList;
