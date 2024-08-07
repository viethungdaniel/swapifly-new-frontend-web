import dynamic from "next/dynamic";
import axios from "axios";

import { productApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import { eventBusService } from "@/services";
import { eventBusConstants } from "@/utils/constants";

import AppDialog from "@/components/AppDialog";
import LoadingOverlay from "@/components/LoadingOverlay";

import { useEffect, useRef, useState } from "react";
import { useIsMounted } from "@/hooks";
import { useRouter } from "next/router";

import ImpressionPackageOrderPaymentStatusDialogContext from "@/components/ImpressionPackageOrderPaymentStatusDialog/ImpressionPackageOrderPaymentStatusDialog.context";

import type { ImpressionPackageOrderPaymentStatusDialogContextValue } from "@/components/ImpressionPackageOrderPaymentStatusDialog/ImpressionPackageOrderPaymentStatusDialog.context";
import type { CancelTokenSource } from "axios";

export type OnImpressionPackageOrderPaymentStatusDialogOpenData = {
  data?: {
    product_id: number;
    is_app_callback: boolean;
  } | null;
  message?: string;
  success: boolean;
};

const PaymentSuccess = dynamic(
  () =>
    import(
      "@/components/ImpressionPackageOrderPaymentStatusDialog/components/PaymentSuccess"
    ),
  {
    ssr: false,
    loading: () => <LoadingOverlay loading />,
  }
);
const PaymentFailure = dynamic(
  () =>
    import(
      "@/components/ImpressionPackageOrderPaymentStatusDialog/components/PaymentFailure"
    ),
  {
    ssr: false,
    loading: () => <LoadingOverlay loading />,
  }
);

const ImpressionPackageOrderPaymentStatusDialog = () => {
  const [open, setOpen] = useState(false);
  const [isAppCallback, setIsAppCallback] = useState(false);
  const [product, setProduct] =
    useState<ImpressionPackageOrderPaymentStatusDialogContextValue["product"]>(
      null
    );
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const fetchedProductSourceRef = useRef<CancelTokenSource | null>(null);

  const router = useRouter();

  const closeImpressionPackageOrderPaymentStatusDialog = () => {
    if (isAppCallback) {
      const productId = product?.product?.id;
      if (!!productId)
        window.open(commonHelpers.generateProductDeepLink(productId), "_self");
      else {
        setOpen(false);
        router.push("/");
      }
      return;
    }
    setOpen(false);
  };

  const fetchProduct = async (payload: {
    params: {
      id: number;
    };
  }) => {
    fetchedProductSourceRef.current?.cancel &&
      fetchedProductSourceRef.current.cancel();
    fetchedProductSourceRef.current = axios.CancelToken.source();
    setProductError("");
    setProductLoading(true);
    setProduct(null);
    try {
      const { data: response } = await productApi.fetchProduct({
        params: {
          id: payload.params.id,
        },
        cancelToken: fetchedProductSourceRef.current.token,
      });
      if (axiosHelpers.checkRequestSuccess(response)) {
        setProduct(response.data);
      } else {
        setProductError(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      const message = axiosHelpers.getErrorMessage(error);
      setProductError(message);
    }
    setProductLoading(false);
  };

  const handleImpressionPackageOrderPaymentStatusDialogOpen = (
    data: OnImpressionPackageOrderPaymentStatusDialogOpenData
  ) => {
    if (!!data?.success) {
      setPaymentError("");
      setPaymentSucceeded(true);
      fetchProduct({
        params: {
          id: data?.data?.product_id!,
        },
      });
    } else {
      setPaymentSucceeded(false);
      setPaymentError(data?.message ?? "");
    }
    setIsAppCallback(!!data?.data?.is_app_callback);
    setOpen(true);
  };

  useEffect(() => {
    if (!isMounted()) return;
    !open && setIsAppCallback(false);
  }, [open]);

  useEffect(() => {
    eventBusService.on(
      eventBusConstants.IMPRESSION_PACKAGE_ORDER_PAYMENT_STATUS_DIALOG_OPEN,
      handleImpressionPackageOrderPaymentStatusDialogOpen
    );
    return () => {
      eventBusService.remove(
        eventBusConstants.IMPRESSION_PACKAGE_ORDER_PAYMENT_STATUS_DIALOG_OPEN,
        handleImpressionPackageOrderPaymentStatusDialogOpen
      );
    };
  }, [handleImpressionPackageOrderPaymentStatusDialogOpen]);

  const isMounted = useIsMounted();

  return (
    <ImpressionPackageOrderPaymentStatusDialogContext.Provider
      value={{
        product,
        productError,
        productLoading,
        paymentError,
        isAppCallback,
        closeImpressionPackageOrderPaymentStatusDialog,
      }}
    >
      <AppDialog
        open={open}
        onClose={closeImpressionPackageOrderPaymentStatusDialog}
        mobileScroll="paper"
        scroll="body"
        mobileFullScreen
        fullScreen={isAppCallback}
        fullWidth
        {...(!!paymentSucceeded
          ? {
              maxWidth: "md",
            }
          : {
              maxWidth: "sm",
            })}
      >
        {!!paymentSucceeded && <PaymentSuccess />}
        {!paymentSucceeded && <PaymentFailure />}
      </AppDialog>
    </ImpressionPackageOrderPaymentStatusDialogContext.Provider>
  );
};

export default ImpressionPackageOrderPaymentStatusDialog;
