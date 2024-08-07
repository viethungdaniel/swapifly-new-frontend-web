import axios from "axios";
import { toast } from "react-toastify";

import { axiosHelpers } from "@/utils/helpers";
import { productReportApi } from "@/utils/apis";

import AppDialog from "@/components/AppDialog";
import ProductItemReportDialogContext from "./ProductItemReportDialog.context";
import ProductItemReportContent from "@/containers/ProductItemReportDialog/components/ProductItemReportContent";

import { useEffect, useRef, useState } from "react";

import type { CancelTokenSource } from "axios";
import type { ProductItemReportDialogContextValue } from "./ProductItemReportDialog.context";

export type ProductItemReportDialogProps = {
  productId?: number;
  disabledPurchaseVisits?: boolean;
  open?: boolean;
  onClose?: Function;
};

const ProductItemReportDialog = (props: ProductItemReportDialogProps) => {
  const { disabledPurchaseVisits, productId, open, onClose } = props;

  const [productReport, setProductReport] =
    useState<ProductItemReportDialogContextValue["productReport"]>(null);
  const [productReportLoading, setProductReportLoading] = useState(false);
  const [productReportError, setProductReportError] = useState("");

  const fetchedProductReportRef = useRef<CancelTokenSource | null>(null);

  const fetchProductReport = async () => {
    setProductReportLoading(true);
    setProductReportError("");
    setProductReport(null);
    fetchedProductReportRef.current?.cancel &&
      fetchedProductReportRef.current.cancel();
    fetchedProductReportRef.current = axios.CancelToken.source();

    try {
      const { data: response } = await productReportApi.fetchProductReport({
        params: {
          product_id: productId!,
        },
        cancelToken: fetchedProductReportRef.current.token,
      });

      if (axiosHelpers.checkRequestSuccess(response)) {
        setProductReport(response.data);
      } else {
        setProductReportError(response.message);
        toast.error(response.message);
      }
      setProductReportLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) return;
      const message = axiosHelpers.getErrorMessage(error);
      setProductReportError(message);
      setProductReportLoading(false);
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!!open && !!productId) {
      fetchProductReport();
      return () => {
        fetchedProductReportRef.current?.cancel &&
          fetchedProductReportRef.current.cancel();
      };
    }
    return;
  }, [open, productId]);

  return (
    <ProductItemReportDialogContext.Provider
      value={{
        disabledPurchaseVisits,
        productReport,
        productReportLoading,
        productReportError,
        open,
        onClose,
      }}
    >
      <AppDialog
        maxWidth="lg"
        scroll="body"
        mobileScroll="paper"
        mobileFullScreen
        fullWidth
        open={!!open}
        onClose={onClose as any}
      >
        <ProductItemReportContent />
      </AppDialog>
    </ProductItemReportDialogContext.Provider>
  );
};

export default ProductItemReportDialog;
