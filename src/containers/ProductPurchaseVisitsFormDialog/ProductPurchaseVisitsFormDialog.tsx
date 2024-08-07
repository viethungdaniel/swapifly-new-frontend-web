import _isEqual from "lodash/isEqual";
import axios from "axios";

import {
  impressionPackageApi,
  impressionPackageOrderApi,
  productApi,
} from "@/utils/apis";
import { axiosHelpers, commonHelpers, formikHelpers } from "@/utils/helpers";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import { Box, Divider } from "@mui/material";
import { FastField, Form, Formik, useFormikContext } from "formik";
import AppButton from "@/components/AppButton";
import AppDialog from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppDialogActions from "@/components/AppDialogActions";
import AppPaper from "@/components/AppPaper";
import LoadingOverlay from "@/components/LoadingOverlay";
import ProductItem from "@/containers/ProductPurchaseVisitsFormDialog/components/ProductItem";
import AppTypography from "@/components/AppTypography";
import ImpressionPackageList from "@/containers/ProductPurchaseVisitsFormDialog/components/ImpressionPackageSelectFormField";
import CouponCodeTextFieldFormField from "@/containers/ProductPurchaseVisitsFormDialog/components/CouponCodeTextFieldFormField";
import OrderSummary from "@/containers/ProductPurchaseVisitsFormDialog/components/OrderSummary";

import {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIsMounted, useOnLeavePageConfirmation } from "@/hooks";
import { useTranslation } from "next-i18next";

import ProductPurchaseVisitsFormDialogContext from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog.context";

import type { ProductPurchaseVisitsFormDialogContextValue } from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog.context";
import type { FastFieldProps, FormikProps } from "formik";
import type { CheckImpressionPackageOrderCouponCodeResponseData } from "@/utils/apis/impressionPackageOrder";
import type { CancelTokenSource } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { commonConstants } from "@/utils/constants";

export type ProductPurchaseVisitsFormDialogProps = {
  open?: boolean;
  productId: number;
  onClose?: (
    event?: React.MouseEventHandler<HTMLButtonElement> | {},
    reason?: string
  ) => void;
};

export type ImpressionPackageOrderFormValues = {
  impression_package_id: number | null;
  impression_package_order_coupon_code: string;
  impression_package_order_coupon_state: CheckImpressionPackageOrderCouponCodeResponseData | null;
};

const LeavePageConfirmation = () => {
  const { open } = useContext(ProductPurchaseVisitsFormDialogContext);
  const { values, initialValues } =
    useFormikContext<ImpressionPackageOrderFormValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues) && !!open,
  });

  return null;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const SubmitButton = () => {
  const { values, handleSubmit } =
    useFormikContext<ImpressionPackageOrderFormValues>();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      color="primary"
      variant="contained"
      type="submit"
      disabled={!values.impression_package_id}
      onClick={handleSubmit as any}
    >
      {t("pay")}
    </AppButton>
  );
};

const SimpleForm = () => {
  const {
    impressionPackagesLoading,
    impressionPackagesError,
    productLoading,
    productError,
    onClose,
  } = useContext(ProductPurchaseVisitsFormDialogContext);

  const loadingOverlayLoading =
    productLoading ||
    impressionPackagesLoading ||
    !!productError ||
    !!impressionPackagesError;

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose}>
        {t("purchaseVisits")}
      </AppDialogTitle>
      <AppDialogContent>
        <LoadingOverlay loading={loadingOverlayLoading}>
          <ProductItem />
          <AppTypography variant="bodyReg16" mt={2.5} mb={1.25}>
            {t("purchaseVisitsPayCaption")}
          </AppTypography>
          <FastField name="impression_package_id">
            {(fastFieldProps: FastFieldProps) => (
              <ImpressionPackageList {...fastFieldProps} />
            )}
          </FastField>
          <Box mb={2.5} />
          <FastField
            name="impression_package_order_coupon_code"
            shouldUpdate={formikHelpers.shouldUpdate([
              "impression_package_id",
              "impression_package_order_coupon_state",
            ])}
          >
            {(fastFieldProps: FastFieldProps) => (
              <CouponCodeTextFieldFormField {...fastFieldProps} />
            )}
          </FastField>
          <Divider sx={{ mt: 2.5, mb: 2.5 }} />
          <FastField
            name="impression_package_order_coupon_state"
            shouldUpdate={formikHelpers.shouldUpdate(["impression_package_id"])}
          >
            {(fastFieldProps: FastFieldProps) => (
              <OrderSummary {...fastFieldProps} />
            )}
          </FastField>
        </LoadingOverlay>
      </AppDialogContent>
      <AppDialogActions>
        <SubmitButton />
      </AppDialogActions>
    </>
  );
};

const ProductPurchaseVisitsFormDialog = (
  props: ProductPurchaseVisitsFormDialogProps
) => {
  const { open, productId, onClose } = props;

  const [product, setProduct] =
    useState<ProductPurchaseVisitsFormDialogContextValue["product"]>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState("");

  const [impressionPackages, setImpressionPackages] = useState<
    ProductPurchaseVisitsFormDialogContextValue["impressionPackages"]
  >([]);
  const [impressionPackagesLoading, setImpressionPackagesLoading] =
    useState(false);
  const [impressionPackagesError, setImpressionPackagesError] = useState("");

  const fetchedProductSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchedImpressionPackagesSourceRef = useRef<CancelTokenSource | null>(
    null
  );
  const submittedImpressionPackageOrderSourceRef =
    useRef<CancelTokenSource | null>(null);
  const formikRef = useRef<FormikProps<ImpressionPackageOrderFormValues>>(
    null!
  );

  const router = useRouter();

  const { t, i18n } = useTranslation();

  const initialValues = useMemo<ImpressionPackageOrderFormValues>(() => {
    return {
      impression_package_id: null,
      impression_package_order_coupon_code: "",
      impression_package_order_coupon_state: null,
    };
  }, []);

  const handleProductPurchaseVisitsFormSubmit = async (
    values: ImpressionPackageOrderFormValues
  ) => {
    const selectedImpressionPackage = impressionPackages.find(
      (impressionPackage) =>
        impressionPackage.id === values.impression_package_id
    );
    const { isConfirmed } = await alertDialogService.fire({
      title: t("pay"),
      content: t("payConfirmationContent", {
        impressionWithCount: selectedImpressionPackage?.number ?? 0,
        dayWithCount: selectedImpressionPackage?.days ?? 0,
      }),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    submittedImpressionPackageOrderSourceRef.current =
      axios.CancelToken.source();
    try {
      const { data: response } =
        await impressionPackageOrderApi.submitImpressionPackageOrder({
          params: {
            exposure_id: values.impression_package_id!,
            product_id: product?.product?.id!,
            promotion_code: values.impression_package_order_coupon_state?.code!,
            redirect_pathname:
              router.query.app_action ===
              commonConstants.COMMON_QUERY_APP_ACTION_PURCHASE_VISITS
                ? `/${i18n.language}/apps/impression-package-order-payment-results`
                : typeof window !== "undefined"
                ? `${window.location.pathname}${window.location.search}`
                : router.asPath,
          },
          cancelToken: submittedImpressionPackageOrderSourceRef.current.token,
        });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        formikRef.current.resetForm({
          values,
          touched: {},
          errors: {},
          submitCount: 0,
        });
        await commonHelpers.sleep(150);
        window.location.href = response.data.url;
        return;
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        const message = axiosHelpers.getErrorMessage(error);
        toast.error(message);
      }
    }
    loadingScreenOverlayService.close();
  };

  const fetchProduct = async () => {
    fetchedProductSourceRef.current = axios.CancelToken.source();
    setProductError("");
    setProduct(null);
    setProductLoading(true);
    try {
      const { data: response } = await productApi.fetchProduct({
        params: {
          id: productId,
        },
        cancelToken: fetchedProductSourceRef.current.token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        setProduct(response.data);
      } else {
        setProductError(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (!isMounted()) return;
      const message = axiosHelpers.getErrorMessage(error);
      setProductError(message);
    }
    setProductLoading(false);
  };

  const fetchImpressionPackages = async () => {
    fetchedImpressionPackagesSourceRef.current = axios.CancelToken.source();
    setImpressionPackagesError("");
    setImpressionPackages([]);
    setImpressionPackagesLoading(true);
    try {
      const { data: response } =
        await impressionPackageApi.fetchImpressionPackages({
          cancelToken: fetchedImpressionPackagesSourceRef.current.token,
        });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        setImpressionPackages(response.data);
      } else {
        setImpressionPackagesError(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (!isMounted()) return;
      const message = axiosHelpers.getErrorMessage(error);
      setImpressionPackagesError(message);
    }
    setImpressionPackagesLoading(false);
  };

  useEffect(() => {
    !!open && fetchProduct();
    return () => {
      fetchedProductSourceRef.current?.cancel &&
        fetchedProductSourceRef.current?.cancel();
    };
  }, [productId, open]);

  useEffect(() => {
    open && fetchImpressionPackages();
    return () => {
      fetchedImpressionPackagesSourceRef.current?.cancel &&
        fetchedImpressionPackagesSourceRef.current?.cancel();
    };
  }, [open]);

  useEffect(() => {
    return () => {
      loadingScreenOverlayService.close();
      submittedImpressionPackageOrderSourceRef.current?.cancel &&
        submittedImpressionPackageOrderSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <ProductPurchaseVisitsFormDialogContext.Provider
      value={{
        open,
        impressionPackages,
        impressionPackagesError,
        impressionPackagesLoading,
        product,
        productError,
        productLoading,
        onClose,
      }}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={handleProductPurchaseVisitsFormSubmit}
      >
        <AppDialog
          maxWidth="md"
          fullWidth
          mobileFullScreen
          mobileScroll="paper"
          open={!!open}
          PaperComponent={PaperForm}
          onClose={onClose}
        >
          <SimpleForm />
        </AppDialog>
      </Formik>
    </ProductPurchaseVisitsFormDialogContext.Provider>
  );
};

export default ProductPurchaseVisitsFormDialog;
