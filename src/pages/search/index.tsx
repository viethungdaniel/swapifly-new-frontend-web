import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import PageAnalytics from "@/components/PageAnalytics";

import { useMemo } from "react";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { PageAnalyticsProps } from "@/components/PageAnalytics";
import type { ParsedUrlQuery } from "querystring";
import type { SearchProps as ViewSearchProps } from "@/views/Search";

export type RouterQuery = {
  keyword?: ParsedUrlQuery;
  product_category?: ParsedUrlQuery;
  brand?: ParsedUrlQuery;
  product_sort?: ParsedUrlQuery;
  product_condition?: ParsedUrlQuery;
  max_price?: ParsedUrlQuery;
  min_price?: ParsedUrlQuery;
  is_trade_in_person?: ParsedUrlQuery;
  is_post_courier?: ParsedUrlQuery;
  merchant_location?: ParsedUrlQuery;
  user?: ParsedUrlQuery;
};

export type SearchProps = {
  query: RouterQuery;
};

const ViewSearch = dynamic(() => import("@/views/Search"), {
  suspense: true,
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const SearchPageAnalytics = (props: { productCategoryId?: number | null }) => {
  const { productCategoryId } = props;

  const data = useMemo<PageAnalyticsProps["data"]>(() => {
    return {
      productCategoryId: productCategoryId ?? "",
    };
  }, [productCategoryId]);

  return <PageAnalytics data={data} />;
};

const Search: NextPageWithLayout<SearchProps> = (props) => {
  const { query } = props;

  const viewSearchQuery = useMemo<ViewSearchProps["query"]>(() => {
    const queryKeyword = commonHelpers.getOneRouterQueryValue(query.keyword);
    const queryProductCategory = commonHelpers.getOneRouterQueryValue(
      query.product_category
    );
    const queryBrand = Array.isArray(query.brand) ? query.brand : [query.brand];
    const queryProductSort = commonHelpers.getOneRouterQueryValue(
      query.product_sort
    );
    const queryProductCondition = Array.isArray(query.product_condition)
      ? query.product_condition
      : [query.product_condition];
    const queryMerchantLocation = Array.isArray(query.merchant_location)
      ? query.merchant_location
      : [query.merchant_location];
    const queryUser = Array.isArray(query.user) ? query.user : [query.user];

    const queryMinPrice = commonHelpers.getOneRouterQueryValue(query.min_price);
    const queryMaxPrice = commonHelpers.getOneRouterQueryValue(query.max_price);
    const queryIsPostCourier = commonHelpers.getOneRouterQueryValue(
      query.is_post_courier
    );
    const queryIsTradeInPerson = commonHelpers.getOneRouterQueryValue(
      query.is_trade_in_person
    );

    return {
      keyword: queryKeyword ?? "",
      product_category_id: commonHelpers.isNumber(queryProductCategory)
        ? Number(queryProductCategory)
        : null,
      brand_ids: queryBrand
        .map((brandId) =>
          commonHelpers.isNumber(brandId) ? Number(brandId) : null
        )
        .filter(
          (brandId) => !commonHelpers.isEmpty(brandId)
        ) as ViewSearchProps["query"]["brand_ids"],
      product_sort_id: commonHelpers.isNumber(queryProductSort)
        ? Number(queryProductSort)
        : null,
      product_condition_ids: queryProductCondition
        .map((productConditionId) =>
          commonHelpers.isNumber(productConditionId)
            ? Number(productConditionId)
            : null
        )
        .filter(
          (productConditionId) => !commonHelpers.isEmpty(productConditionId)
        ) as ViewSearchProps["query"]["product_condition_ids"],
      merchant_location_ids: queryMerchantLocation
        .map((merchantLocationId) =>
          commonHelpers.isNumber(merchantLocationId)
            ? Number(merchantLocationId)
            : null
        )
        .filter(
          (merchantLocationId) => !commonHelpers.isEmpty(merchantLocationId)
        ) as ViewSearchProps["query"]["merchant_location_ids"],
      user_ids: queryUser
        .map((userId) =>
          commonHelpers.isNumber(userId) ? Number(userId) : null
        )
        .filter(
          (userId) => !commonHelpers.isEmpty(userId)
        ) as ViewSearchProps["query"]["user_ids"],
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
    query.keyword,
    query.product_category,
    query.brand,
    query.product_sort,
    query.product_condition,
    query.min_price,
    query.max_price,
    query.is_post_courier,
    query.is_trade_in_person,
    query.merchant_location,
    query.user,
  ]);

  return (
    <>
      <SearchPageAnalytics
        productCategoryId={viewSearchQuery.product_category_id}
      />
      <ViewSearch query={viewSearchQuery} />
    </>
  );
};

Search.getLayout = (page, pageProps, { translation }) => {
  const keyword = commonHelpers.getOneRouterQueryValue(
    pageProps.query?.keyword
  );
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${keyword ? `${keyword} - ` : ""}${t("search")}`,
      }}
    >
      <AuthGuard>
        <LayoutMain disabledMainHeaderMobileHomeIconButton>{page}</LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default Search;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
      query: ctx.query,
    },
  };
}) satisfies GetServerSideProps;
