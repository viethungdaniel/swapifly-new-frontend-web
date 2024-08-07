import axios from "axios";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import { axiosHelpers, commonHelpers, reduxHelpers } from "@/utils/helpers";
import { storeAdAction, storeProductAction } from "@/store";
import { commonConstants, productConstants } from "@/utils/constants";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import { Grid } from "@mui/material";
import AppStickyBox from "@/components/AppStickyBox";
import AppContainer from "@/components/AppContainer";
import AppContent from "@/components/AppContent";
import ProductBreadcrumbs from "@/views/SlugProduct/components/ProductBreadcrumbs";
import ProductGallery from "@/views/SlugProduct/components/ProductGallery";
import ProductContent from "@/views/SlugProduct/components/ProductContent";
import SellerCard from "@/views/SlugProduct/components/SellerCard";
import SimilarProductList from "@/views/SlugProduct/components/SimilarProductList";
import BuyerActionBottomAppBar from "@/views/SlugProduct/components/BuyerActionBottomAppBar";
import SellerActionBottomAppBar from "@/views/SlugProduct/components/SellerActionBottomAppBar";
import SellerActionCard from "@/views/SlugProduct/components/SellerActionCard";
import ProductItemReportDialog from "@/containers/ProductItemReportDialog";
import ProductPurchaseVisitsFormDialog from "@/containers/ProductPurchaseVisitsFormDialog";

import {
  useAppDispatch,
  useAppSelector,
  useAppWebsocket,
  useEventCallback,
  useIsMounted,
} from "@/hooks";

import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import SlugProductContext from "@/views/SlugProduct/SlugProduct.context";

import useStyles from "./SlugProduct.styles";

import type { CancelTokenSource } from "axios";

type RouterQuery = {
  slug: string;
  app_action?: string;
};

const FetchData = () => {
  const fetchedProductAdSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchedSimilarProductsAdsSourceRef = useRef<CancelTokenSource | null>(
    null
  );

  const dispatch = useAppDispatch();

  const $s_adAction = useMemo(
    () => bindActionCreators(storeAdAction, dispatch),
    [dispatch]
  );

  const $s_productBreadcrumbCategories = useAppSelector(
    (state) => state.product.product?.product?.rid ?? []
  );

  const $s_productId = useAppSelector(
    (state) => state.product.product?.product?.id ?? null
  );

  const productCategoryId = useMemo(() => {
    return $s_productBreadcrumbCategories.reverse()[0]?.id ?? null;
  }, [$s_productBreadcrumbCategories]);

  const fetchProductAd = () => {
    fetchedProductAdSourceRef.current &&
      fetchedProductAdSourceRef.current!.cancel();
    fetchedProductAdSourceRef.current = axios.CancelToken.source();
    $s_adAction.fetchAdsSaga(
      {
        params: {
          scopes: ["productAd"],
        },
        cancelToken: fetchedProductAdSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
  };

  const fetchSimilarProductsAds = () => {
    fetchedSimilarProductsAdsSourceRef.current &&
      fetchedSimilarProductsAdsSourceRef.current!.cancel();
    fetchedSimilarProductsAdsSourceRef.current = axios.CancelToken.source();
    $s_adAction.fetchAdsSaga(
      {
        params: {
          scopes: ["productsRectangleAds", "productsSquareAds"],
        },
        cancelToken: fetchedSimilarProductsAdsSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
  };

  useEffect(() => {
    fetchProductAd();
    return () => {
      fetchedProductAdSourceRef.current?.cancel &&
        fetchedProductAdSourceRef.current.cancel();
    };
  }, [productCategoryId]);

  useEffect(() => {
    fetchSimilarProductsAds();
    return () => {
      fetchedSimilarProductsAdsSourceRef.current?.cancel &&
        fetchedSimilarProductsAdsSourceRef.current.cancel();
    };
  }, [$s_productId]);

  return null;
};

const AuthSellerGuard = (props: { children?: React.ReactNode }) => {
  const { children } = props;

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_productSellerId = useAppSelector(
    (state) => state.product.product?.seller?.id
  );

  if (!$s_authUserId || $s_authUserId !== $s_productSellerId) return null;

  return children;
};

const StyledProductItemReportDialog = () => {
  const { productItemReportDialogOpen, closeProductItemReportDialog } =
    useContext(SlugProductContext);

  const $s_productStateNumber = useAppSelector(
    (state) => state.product.product?.product?.state
  );
  const $s_productPurchasable = useAppSelector(
    (state) => !!state.product.product?.product?.purchase_enable
  );
  const $s_productId = useAppSelector(
    (state) => state.product.product?.product?.id
  );

  return (
    <ProductItemReportDialog
      productId={$s_productId}
      open={productItemReportDialogOpen}
      disabledPurchaseVisits={
        !$s_productPurchasable ||
        $s_productStateNumber !== productConstants.NORMAL_STATE_NUMBER
      }
      onClose={closeProductItemReportDialog}
    />
  );
};

const StyledProductPurchaseVisitsFormDialog = () => {
  const {
    productPurchaseVisitsFormDialogOpen,
    closeProductPurchaseVisitsFormDialog,
  } = useContext(SlugProductContext);

  const $s_productId = useAppSelector(
    (state) => state.product.product?.product?.id
  );

  return (
    <ProductPurchaseVisitsFormDialog
      productId={$s_productId!}
      open={productPurchaseVisitsFormDialogOpen}
      onClose={closeProductPurchaseVisitsFormDialog}
    />
  );
};

const SlugProduct = () => {
  const [productDeleted, setProductDeleted] = useState(false);
  const [productItemReportDialogOpen, setProductItemReportDialogOpen] =
    useState(false);
  const [
    productPurchaseVisitsFormDialogOpen,
    setProductPurchaseVisitsFormDialogOpen,
  ] = useState(false);

  const markSoldProductSourceRef = useRef<CancelTokenSource | null>(null);
  const deleteProductSourceRef = useRef<CancelTokenSource | null>(null);
  const openedProductPurchaseVisitsFormDialogOnAppActionCountRef = useRef(0);

  const router = useRouter();

  const query = router.query as RouterQuery;

  const productId = useMemo(() => {
    return commonHelpers.getProductSlugId(query.slug);
  }, [query.slug]);

  const { classes, cx } = useStyles();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const fetchInboxThreadFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const createProductInboxThreadOfferFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const $s_productStateNumber = useAppSelector(
    (state) => state.product.product?.product?.state
  );
  const $s_productPurchasable = useAppSelector(
    (state) => !!state.product.product?.product?.purchase_enable
  );
  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const appWebsocket = useAppWebsocket({
    onInboxThreadFetch: (_, eventData) => {
      if (!!fetchInboxThreadFailedTimeoutRef.current) {
        clearTimeout(fetchInboxThreadFailedTimeoutRef.current!);
        fetchInboxThreadFailedTimeoutRef.current = null;
        if (eventData.success) {
          router.push(`/inbox/${eventData.data}`);
        } else {
          toast.error(eventData.message);
          loadingScreenOverlayService.close();
        }
      }
    },
    onProductInboxThreadOfferCreate: (_, eventData) => {
      if (!!createProductInboxThreadOfferFailedTimeoutRef.current) {
        clearTimeout(createProductInboxThreadOfferFailedTimeoutRef.current!);
        createProductInboxThreadOfferFailedTimeoutRef.current = null;
        if (eventData.success) {
          router.push(`/inbox/${eventData.data.thread_id}`);
        } else {
          toast.error(eventData.message);
          loadingScreenOverlayService.close();
        }
      }
    },
  });

  const deleteProduct = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("deleteProductConfirmationTitle"),
      content: t("deleteProductConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    deleteProductSourceRef.current?.cancel &&
      deleteProductSourceRef.current.cancel();
    deleteProductSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_productAction.deleteProductSaga,
      {
        params: {
          id: productId!,
        },
        cancelToken: deleteProductSourceRef.current.token,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      setProductDeleted(true);
      toast.success(t("deletedSuccessfully"));
      router.push("/");
    } else toast.error(response.message);
    loadingScreenOverlayService.close();
  };

  const markSoldProduct = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("markSoldConfirmationTitle"),
      content: t("markSoldConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    markSoldProductSourceRef.current?.cancel &&
      markSoldProductSourceRef.current.cancel();
    markSoldProductSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_productAction.markSoldProductSaga,
      {
        params: {
          id: productId!,
        },
        cancelToken: markSoldProductSourceRef.current.token,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("markedSuccessfullySold"));
    } else toast.error(response.message);
    loadingScreenOverlayService.close();
  };

  const fetchInboxThreadFailed = () => {
    toast.error(t("noResponseServerErrorMessage"));
    loadingScreenOverlayService.close();
  };

  const createProductInboxThreadOfferFailed = () => {
    toast.error(t("noResponseServerErrorMessage"));
    loadingScreenOverlayService.close();
  };

  const navigateInboxThread = () => {
    const response = appWebsocket.fetchInboxThread({
      productId: productId!,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      fetchInboxThreadFailedTimeoutRef.current = setTimeout(
        fetchInboxThreadFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const createProductInboxThreadOffer = (payload: { price: number }) => {
    const response = appWebsocket.createProductInboxThreadOffer({
      productId: productId!,
      price: payload.price,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      createProductInboxThreadOfferFailedTimeoutRef.current = setTimeout(
        createProductInboxThreadOfferFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const openProductItemReportDialog = () => {
    setProductItemReportDialogOpen(true);
  };

  const closeProductItemReportDialog = () => {
    setProductItemReportDialogOpen(false);
  };

  const openProductPurchaseVisitsFormDialog = () => {
    setProductPurchaseVisitsFormDialogOpen(true);
  };

  const closeProductPurchaseVisitsFormDialog = () => {
    setProductPurchaseVisitsFormDialogOpen(false);
  };

  const remindAppOnWebApp = useEventCallback(async () => {
    if (
      !commonHelpers.isMobile() ||
      query.app_action ===
        commonConstants.COMMON_QUERY_APP_ACTION_PURCHASE_VISITS
    )
      return;
    const { isConfirmed } = await alertDialogService.fire({
      title: t("openAppConfirmationTitle"),
      content: t("openAppConfirmationContent"),
      actions: [
        {
          children: t("cancel"),
          buttonProps: {
            variant: "outlined",
            color: "text.primary",
          },
        },
        {
          children: t("open"),
          isConfirmAction: true,
          buttonProps: {
            variant: "contained",
            color: "text.primary",
          },
        },
      ],
    });
    if (!isConfirmed || !isMounted()) return;
    window.open(commonHelpers.generateProductDeepLink(productId!), "_self");
  });

  useEffect(() => {
    const remindAppOnWebAppTimeout = setTimeout(remindAppOnWebApp, 1000);
    setProductDeleted(false);
    return () => {
      openedProductPurchaseVisitsFormDialogOnAppActionCountRef.current = 0;
      clearTimeout(remindAppOnWebAppTimeout);
      clearTimeout(fetchInboxThreadFailedTimeoutRef.current!);
      fetchInboxThreadFailedTimeoutRef.current = null;
      alertDialogService.close();
      loadingScreenOverlayService.close();
      deleteProductSourceRef.current?.cancel &&
        deleteProductSourceRef.current.cancel();
      markSoldProductSourceRef.current?.cancel &&
        markSoldProductSourceRef.current.cancel();
    };
  }, [productId, query.app_action]);

  useEffect(() => {
    if (
      $s_productStateNumber !== productConstants.NORMAL_STATE_NUMBER ||
      !$s_productPurchasable ||
      query.app_action !==
        commonConstants.COMMON_QUERY_APP_ACTION_PURCHASE_VISITS ||
      !$s_hasAuth ||
      openedProductPurchaseVisitsFormDialogOnAppActionCountRef.current > 0
    )
      return;
    openedProductPurchaseVisitsFormDialogOnAppActionCountRef.current += 1;
    setProductPurchaseVisitsFormDialogOpen(true);
  }, [
    query.app_action,
    $s_hasAuth,
    $s_productStateNumber,
    $s_productPurchasable,
    $s_hasAuth,
  ]);

  const isMounted = useIsMounted();

  return (
    <SlugProductContext.Provider
      value={{
        productId: productId!,
        productDeleted,
        productItemReportDialogOpen,
        productPurchaseVisitsFormDialogOpen,
        deleteProduct,
        createProductInboxThreadOffer,
        navigateInboxThread,
        markSoldProduct,
        openProductItemReportDialog,
        closeProductItemReportDialog,
        openProductPurchaseVisitsFormDialog,
        closeProductPurchaseVisitsFormDialog,
      }}
    >
      <FetchData />
      <AppContent className={cx(productDeleted && classes.disabledPage)}>
        <AppContainer className={classes.breadcrumbsContainer}>
          <ProductBreadcrumbs />
        </AppContainer>

        <AppContainer
          className={classes.productGalleryContainer}
          disableGutters="tabletDown"
        >
          <ProductGallery />
        </AppContainer>

        <AppContainer>
          <Grid container spacing={2.5}>
            <Grid item xs={12} tablet={8}>
              <ProductContent />
            </Grid>
            <Grid
              item
              xs={12}
              tablet={4}
              sx={{ display: { xs: "none", tablet: "block" } }}
            >
              <AppStickyBox
                thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}
                offsetBottom={20}
              >
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <SellerCard />
                  </Grid>
                  <AuthSellerGuard>
                    <Grid item xs={12}>
                      <SellerActionCard />
                    </Grid>
                  </AuthSellerGuard>
                </Grid>
              </AppStickyBox>
            </Grid>
          </Grid>
        </AppContainer>
        <SimilarProductList className={classes.similarProductList} />
      </AppContent>
      <BuyerActionBottomAppBar />
      <SellerActionBottomAppBar />
      <StyledProductItemReportDialog />
      <StyledProductPurchaseVisitsFormDialog />
      {/* <FacebookVideoDialog /> */}
    </SlugProductContext.Provider>
  );
};

export default SlugProduct;
