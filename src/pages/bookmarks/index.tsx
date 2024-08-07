import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import AuthGuardPage from "@/guards/AuthGuardPage";
import PageAnalytics from "@/components/PageAnalytics";

import { useMemo } from "react";

import type { NextPageWithLayout } from "@/pages/_app";
import type { PageAnalyticsProps } from "@/components/PageAnalytics";
import type { GetServerSideProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { BookmarksProps as ViewBookmarksProps } from "@/views/Bookmarks";

type RouterQuery = {
  product_category?: ParsedUrlQuery;
  brand?: ParsedUrlQuery;
  product_condition?: ParsedUrlQuery;
  max_price?: ParsedUrlQuery;
  min_price?: ParsedUrlQuery;
  is_trade_in_person?: ParsedUrlQuery;
  is_post_courier?: ParsedUrlQuery;
};

type BookmarksProps = {
  query: RouterQuery;
};

const ViewBookmarks = dynamic(() => import("@/views/Bookmarks"), {
  suspense: true,
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const BookmarksPageAnalytics = (props: { productCategoryId?: number }) => {
  const { productCategoryId } = props;

  const data = useMemo<PageAnalyticsProps["data"]>(() => {
    return {
      productCategoryId: productCategoryId ?? "",
    };
  }, [productCategoryId]);

  return <PageAnalytics data={data} />;
};

const Bookmarks: NextPageWithLayout<BookmarksProps> = (props) => {
  const { query } = props;

  const viewBookmarksQuery = useMemo<ViewBookmarksProps["query"]>(() => {
    const queryProductCategory = commonHelpers.getOneRouterQueryValue(
      query.product_category
    );
    const queryBrand = Array.isArray(query.brand) ? query.brand : [query.brand];
    const queryProductCondition = Array.isArray(query.product_condition)
      ? query.product_condition
      : [query.product_condition];
    const queryMinPrice = commonHelpers.getOneRouterQueryValue(query.min_price);
    const queryMaxPrice = commonHelpers.getOneRouterQueryValue(query.max_price);
    const queryIsPostCourier = commonHelpers.getOneRouterQueryValue(
      query.is_post_courier
    );
    const queryIsTradeInPerson = commonHelpers.getOneRouterQueryValue(
      query.is_trade_in_person
    );

    return {
      product_category_id: commonHelpers.isNumber(queryProductCategory)
        ? Number(queryProductCategory)
        : null,
      brand_ids: queryBrand
        .map((brandId) =>
          commonHelpers.isNumber(brandId) ? Number(brandId) : null
        )
        .filter(
          (brandId) => !commonHelpers.isEmpty(brandId)
        ) as ViewBookmarksProps["query"]["brand_ids"],
      product_condition_ids: queryProductCondition
        .map((productConditionId) =>
          commonHelpers.isNumber(productConditionId)
            ? Number(productConditionId)
            : null
        )
        .filter(
          (productConditionId) => !commonHelpers.isEmpty(productConditionId)
        ) as ViewBookmarksProps["query"]["product_condition_ids"],
      min_price: commonHelpers.isNumber(queryMinPrice)
        ? Number(queryMinPrice)
        : "",
      max_price: commonHelpers.isNumber(queryMaxPrice)
        ? Number(queryMaxPrice)
        : "",
      is_post_courier: ["0", "1"].includes(queryIsPostCourier)
        ? (Number(queryIsPostCourier) as BooleanNumber)
        : 0,
      is_trade_in_person: ["0", "1"].includes(queryIsTradeInPerson)
        ? (Number(queryIsTradeInPerson) as BooleanNumber)
        : 0,
    };
  }, [
    query.product_category,
    query.brand,
    query.product_condition,
    query.min_price,
    query.max_price,
    query.is_post_courier,
    query.is_trade_in_person,
  ]);

  return (
    <>
      <BookmarksPageAnalytics
        productCategoryId={viewBookmarksQuery?.product_category_id!}
      />
      <ViewBookmarks query={viewBookmarksQuery} />
    </>
  );
};

Bookmarks.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: t("bookmark"),
      }}
    >
      <AuthGuard requiredAuth>
        <LayoutMain disabledMainHeaderMobileHomeIconButton>
          <AuthGuardPage>{page}</AuthGuardPage>
        </LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default Bookmarks;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
      query: ctx.query,
    },
  };
}) satisfies GetServerSideProps;
