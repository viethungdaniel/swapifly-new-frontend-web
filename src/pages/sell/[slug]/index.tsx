import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { productApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers, imageHelpers } from "@/utils/helpers";
import { appStorageService, storageService } from "@/services";
import {
  productConstants,
  regionConstants,
  storageKeyConstants,
} from "@/utils/constants";
import { reduxWrapper, storeProductAction } from "@/store";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuardPage from "@/guards/AuthGuardPage";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import PageAnalytics from "@/components/PageAnalytics";

import { useMemo } from "react";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { FetchProductResponseData } from "@/utils/apis/product";
import type { PageAnalyticsProps } from "@/components/PageAnalytics";

type SellSlugParams = {
  slug: string;
};

type SellSlugProps = {
  product?: FetchProductResponseData;
};

const ViewSellSlugProductSlug = dynamic(
  () => import("@/views/SellSlugProduct"),
  {
    ssr: false,
    loading: () => <PageLazyLoading />,
  }
);

const SellSlugProductPageAnalytics = (
  props: Pick<SellSlugProps, "product">
) => {
  const { product } = props;

  const productId = product?.product?.id;

  const productCategoryId = (
    Array.isArray(product?.product?.rid) ? [...product!.product!.rid] : []
  ).reverse()[0]?.id;

  const data = useMemo<PageAnalyticsProps["data"]>(() => {
    return {
      productId,
      productCategoryId,
    };
  }, [productId, productCategoryId]);

  return <PageAnalytics data={data} />;
};

const SellSlug: NextPageWithLayout<SellSlugProps> = () => {
  return (
    <>
      <SellSlugProductPageAnalytics />
      <ViewSellSlugProductSlug />
    </>
  );
};

SellSlug.getLayout = (page, pageProps) => {
  const product = pageProps.product!;

  return (
    <LayoutRoot
      headParams={{
        title: product.product?.title,
        description: product.product?.describe,
        openGraph: {
          url: commonHelpers.getURL(
            `/sell/${commonHelpers.generateProductSlug(
              product.product?.title,
              product.product?.id
            )}`
          ),
          title: product.product?.title,
          description: product.product?.describe,
          images: (product.product?.images ?? []).map((image) => ({
            url: imageHelpers.imagePathLoader(image),
            alt: product.product?.title ?? "",
          })),
        },
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

export default SellSlug;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { params, locale, req } = ctx;

      const token =
        storageService.getCookieItem(storageKeyConstants.AUTH_TOKEN, {
          req,
        }) ?? "";
      const authUserId =
        appStorageService.getCookieAuthUserId({
          req,
        }) ?? "";

      const regionId =
        appStorageService.getCookieAuthUserRegionId({
          req,
        }) ?? regionConstants.DEFAULT_REGION_ID;

      const _params = params as SellSlugParams;

      const productId = commonHelpers.getProductSlugId(_params.slug);

      if (!commonHelpers.isEmpty(productId)) {
        try {
          const { data: response } = await productApi.fetchProduct({
            params: {
              id: productId!,
            },
            headers: {
              "x-lang": (locale ?? "").toLowerCase(),
              "x-region": `${regionId}`,
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          });

          if (
            axiosHelpers.checkRequestSuccess(response) &&
            response.data.seller.id === authUserId &&
            response.data.product.state !== productConstants.SOLD_STATE_NUMBER
          ) {
            store.dispatch(
              storeProductAction.fetchProductSucceededSever(response.data)
            );

            return {
              props: {
                ...(await commonHelpers.serverSideAppSettings(ctx)),
                ...(await serverSideTranslations(locale || "")),
                product: response.data,
              },
            };
          }
        } catch (_) {}
        return {
          props: {
            ...(await commonHelpers.serverSideAppSettings(ctx)),
            ...(await serverSideTranslations(locale || "")),
          },
          notFound: true,
        };
      }

      return {
        props: {
          ...(await commonHelpers.serverSideAppSettings(ctx)),
          ...(await serverSideTranslations(locale || "")),
        },
        notFound: true,
      };
    }) satisfies GetServerSideProps<SellSlugProps>
);
