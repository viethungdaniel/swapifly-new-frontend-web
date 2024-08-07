import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import { storageService } from "@/services";
import { storageKeyConstants } from "@/utils/constants";
import { productApi } from "@/utils/apis";
import { reduxWrapper, storeProductAction } from "@/store";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import AuthGuardPage from "@/guards/AuthGuardPage";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

const ViewSellNewItem = dynamic(() => import("@/views/SellNewItem"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const SellNewItem: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
      <ViewSellNewItem />
    </>
  );
};

SellNewItem.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${t("newItem")} - ${t("sell")}`,
      }}
    >
      <AuthGuard requiredAuth>
        <LayoutMain
          disabledMainFooter
          disabledMainBottomAppBar
          disabledSellIconButton
        >
          <AuthGuardPage>{page}</AuthGuardPage>
        </LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default SellNewItem;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { query, req } = ctx;

      const itemDraft: string = commonHelpers.getOneRouterQueryValue(
        query.item_draft
      );
      const productId = commonHelpers.getProductSlugId(itemDraft);
      const token =
        storageService.getCookieItem(storageKeyConstants.AUTH_TOKEN, {
          req,
        }) ?? "";

      if (!commonHelpers.isEmpty(productId)) {
        try {
          const { data: response } = await productApi.fetchDraftProduct({
            params: {
              id: productId!,
            },
            headers: {
              "x-lang": (ctx.locale ?? "").toLowerCase(),
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          });

          if (axiosHelpers.checkRequestSuccess(response)) {
            store.dispatch(
              storeProductAction.fetchDraftProductSucceededSever(response.data)
            );
          }
        } catch {}
      }

      return {
        props: {
          ...(await commonHelpers.serverSideAppSettings(ctx)),
          ...(await serverSideTranslations(ctx.locale || "")),
        },
      };
    }) satisfies GetServerSideProps
);
