import axios from "axios";
import { bindActionCreators } from "redux";
import { useEffect, useMemo, useRef } from "react";

import { storeProductAction } from "@/store";

import { Divider } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppContent from "@/components/AppContent";
import DraftProductList from "@/views/Sell/components/DraftProductList";
import SalesForm from "@/views/Sell/components/SalesForm";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppTypography from "@/components/AppTypography";

import { useAppDispatch } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./Sell.styles";

import type { CancelTokenSource } from "axios";

const FetchData = () => {
  const fetchDraftProductsSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  useEffect(() => {
    fetchDraftProductsSourceRef.current = axios.CancelToken.source();

    $s_productAction.fetchDraftProductsSaga({
      cancelToken: fetchDraftProductsSourceRef.current.token,
    });
    return () => {
      fetchDraftProductsSourceRef.current!.cancel();

      fetchDraftProductsSourceRef.current = null;
    };
  }, []);

  return null;
};

const Sell = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <>
      <FetchData />
      <AppContainer>
        <AppContent className={classes.sales}>
          <AppBreadcrumbs>
            <AppTypography color="text.primary">Sell</AppTypography>
          </AppBreadcrumbs>
          <div>
            <AppTypography variant="titleSemi20" mb={2.5}>
              {t("whatWouldYouLikeToSellToday")}
            </AppTypography>
            <SalesForm />
          </div>
          <Divider />
          <div>
            <AppTypography variant="titleSemi20" mb={2.5}>
              {t("yourDraft")}
            </AppTypography>
            <DraftProductList />
          </div>
        </AppContent>
      </AppContainer>
    </>
  );
};

export default Sell;
