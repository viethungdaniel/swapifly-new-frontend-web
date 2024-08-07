import axios from "axios";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";

import { axiosHelpers, productHelpers, reduxHelpers } from "@/utils/helpers";
import { storeInboxSelectors, storeProductAction } from "@/store";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import AppButton from "@/components/AppButton";

import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useMemo, useRef } from "react";

import type { CancelTokenSource } from "axios";

const SoldProductMarkButton = () => {
  const markSoldProductSourceRef = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_inboxThreadOfferProduct = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferProduct
  );

  const isMarkedProductSold = productHelpers.isSoldProduct(
    $s_inboxThreadOfferProduct?.state
  );

  const handleSoldProductMark = async () => {
    if (isMarkedProductSold) return;
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
          id: $s_inboxThreadOfferProduct?.id!,
        },
        cancelToken: markSoldProductSourceRef.current.token,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("markedSuccessfullySold"));
    } else toast.error(response.message);
    loadingScreenOverlayService.close();
  };

  return (
    <>
      <AppButton
        disabled={isMarkedProductSold}
        variant="contained"
        color="primary"
        onClick={handleSoldProductMark}
      >
        {t("markSold")}
      </AppButton>
    </>
  );
};

export default SoldProductMarkButton;
