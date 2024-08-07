import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { productApi, productCategoryApi, userApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers, imageHelpers } from "@/utils/helpers";
import { appGtagService, appStorageService, storageService } from "@/services";
import { regionConstants, storageKeyConstants } from "@/utils/constants";
import { reduxWrapper, storeProductAction, storeUserAction } from "@/store";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import PageAnalytics from "@/components/PageAnalytics";

import { useEffect, useMemo } from "react";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { FetchProductResponseData } from "@/utils/apis/product";
import type { RootProps } from "@/layouts/Root";
import type { FetchProductCategoryResponseData } from "@/utils/apis/productCategory";
import type { PageAnalyticsProps } from "@/components/PageAnalytics";
import type { FetchUserResponseData } from "@/utils/apis/user";
import type { SlugProductCategoryProps as ViewSlugProductCategoryProps } from "@/views/SlugProductCategory";
import type { ParsedUrlQuery } from "querystring";

type SlugParams = {
  slug: string;
  menu_tab: string | string[];
};

type RouterQuery = {
  brand?: ParsedUrlQuery;
  product_sort?: ParsedUrlQuery;
  product_condition?: ParsedUrlQuery;
  max_price?: ParsedUrlQuery;
  min_price?: ParsedUrlQuery;
  is_trade_in_person?: ParsedUrlQuery;
  is_post_courier?: ParsedUrlQuery;
};

type SlugProps = {
  product?: FetchProductResponseData;
  productCategory?: FetchProductCategoryResponseData;
  user?: FetchUserResponseData;
  query?: RouterQuery;
};

const ViewSlugProduct = dynamic(() => import("@/views/SlugProduct"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const ViewSlugUser = dynamic(() => import("@/views/SlugUser"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const ViewSlugProductCategory = dynamic(
  () => import("@/views/SlugProductCategory"),
  {
    ssr: false,
    loading: () => <PageLazyLoading />,
  }
);

const SlugProductCategoryPageAnalytics = (props: {
  productCategoryId?: number;
}) => {
  const { productCategoryId } = props;

  const data = useMemo<PageAnalyticsProps["data"]>(() => {
    return {
      productCategoryId,
    };
  }, [productCategoryId]);

  return <PageAnalytics data={data} />;
};

const SlugProductPageAnalytics = (props: Pick<SlugProps, "product">) => {
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

const Slug: NextPageWithLayout<SlugProps> = (props) => {
  const { product, user, productCategory, query } = props;

  const viewSlugProductCategoryQuery = useMemo<
    ViewSlugProductCategoryProps["query"]
  >(() => {
    if (!productCategory?.id) return {};
    const queryBrand = Array.isArray(query!.brand)
      ? query!?.brand
      : [query!?.brand];
    const queryProductSort = commonHelpers.getOneRouterQueryValue(
      query!?.product_sort
    );
    const queryProductCondition = Array.isArray(query!?.product_condition)
      ? query!?.product_condition
      : [query!?.product_condition];
    const queryMinPrice = commonHelpers.getOneRouterQueryValue(
      query!?.min_price
    );
    const queryMaxPrice = commonHelpers.getOneRouterQueryValue(
      query!?.max_price
    );
    const queryIsPostCourier = commonHelpers.getOneRouterQueryValue(
      query!?.is_post_courier
    );
    const queryIsTradeInPerson = commonHelpers.getOneRouterQueryValue(
      query!?.is_trade_in_person
    );

    return {
      product_category_id: productCategory.id,
      brand_ids: queryBrand
        .map((brandId) =>
          commonHelpers.isNumber(brandId) ? Number(brandId) : null
        )
        .filter(
          (brandId) => !commonHelpers.isEmpty(brandId)
        ) as ViewSlugProductCategoryProps["query"]["brand_ids"],
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
        ) as ViewSlugProductCategoryProps["query"]["product_condition_ids"],
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
    productCategory?.id,
    query?.brand,
    query?.product_sort,
    query?.product_condition,
    query?.min_price,
    query?.max_price,
    query?.is_post_courier,
    query?.is_trade_in_person,
  ]);

  useEffect(() => {
    !!product &&
      appGtagService.dispatchProductViewEvent({
        title: product.product?.title,
      });
  }, [product]);

  useEffect(() => {
    !!user &&
      appGtagService.dispatchUserViewEvent({
        username: user.shop?.username,
      });
  }, [user]);

  if (!!product)
    return (
      <>
        <SlugProductPageAnalytics product={product} />
        <ViewSlugProduct />
      </>
    );
  if (!!productCategory) {
    return (
      <>
        <SlugProductCategoryPageAnalytics
          productCategoryId={productCategory.id}
        />
        <ViewSlugProductCategory
          productCategory={productCategory}
          query={viewSlugProductCategoryQuery}
        />
      </>
    );
  }
  if (!!user)
    return (
      <>
        <PageAnalytics />
        <ViewSlugUser />
      </>
    );
  return null;
};

Slug.getLayout = (page, pageProps, { translation }) => {
  const { t } = translation;

  const product = pageProps.product;
  const productCategory = pageProps.productCategory;
  const user = pageProps.user;

  let headParams: RootProps["headParams"] = {};
  let pageName: "user" | "product" | "productCategory";

  if (!!user) {
    pageName = "user";
    const description = [
      user.shop.nickname,
      t("likeWithCount", { count: user?.shop?.point_average }),
      t("followerWithCount", { count: user?.shop?.followers ?? 0 }),
      t("followingWithCount", { count: user?.shop?.following ?? 0 }),
      user.shop?.describe ?? "",
    ]
      .filter((text) => !!text)
      .join(" | ");
    headParams = {
      title: user.shop?.nickname,
      description,
      openGraph: {
        url: commonHelpers.getURL(
          `/${commonHelpers.generateUserSlug({
            id: user.shop?.id!,
            nickname: user.shop?.nickname!,
            username: user?.shop?.username!,
          })}`
        ),
        title: user.shop.nickname,
        description,
        images: [
          {
            url: imageHelpers.imagePathLoader(user.shop.avatar),
            alt: user.shop?.nickname ?? "",
          },
        ],
        profile: {
          firstName: user.shop?.nickname,
          lastName: "",
          username: user.shop?.nickname,
        },
      },
    };
  }

  if (!!product) {
    pageName = "product";
    headParams = {
      title: product.product?.title,
      description: product.product?.describe,
      openGraph: {
        url: commonHelpers.getURL(
          `/${commonHelpers.generateProductSlug(
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
    };
  }

  if (!!productCategory) {
    pageName = "productCategory";
    headParams = {
      title: productCategory.title,
      openGraph: {
        url: commonHelpers.getURL(
          `/${commonHelpers.generateProductCategorySlug(
            productCategory.title,
            productCategory.id
          )}`
        ),
        title: productCategory?.title,
        images: [
          {
            url: productCategory.background,
            alt: productCategory.title,
          },
        ],
      },
    };
  }

  return (
    <LayoutRoot headParams={headParams}>
      <AuthGuard>
        <LayoutMain
          disabledMainBottomAppBar={pageName! === "product"}
          disabledMainHeaderMobileHomeIconButton={[
            "user",
            "productCategory",
          ].includes(pageName!)}
        >
          {page}
        </LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default Slug;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { params, locale, req } = ctx;

      const token =
        storageService.getCookieItem(storageKeyConstants.AUTH_TOKEN, {
          req,
        }) ?? "";

      const regionId =
        appStorageService.getCookieAuthUserRegionId({
          req,
        }) ?? regionConstants.DEFAULT_REGION_ID;

      const _params = params as SlugParams;

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

          if (axiosHelpers.checkRequestSuccess(response)) {
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

      const productCategoryId = commonHelpers.getProductCategorySlugId(
        _params.slug
      );
      if (!commonHelpers.isEmpty(productCategoryId)) {
        try {
          const { data: response } =
            await productCategoryApi.fetchProductCategory({
              params: {
                id: productCategoryId!,
              },
              headers: {
                "x-lang": (locale ?? "").toLowerCase(),
              },
            });

          if (axiosHelpers.checkRequestSuccess(response)) {
            return {
              props: {
                ...(await commonHelpers.serverSideAppSettings(ctx)),
                ...(await serverSideTranslations(locale || "")),
                productCategory: response.data,
                query: ctx.query,
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

      const userId = commonHelpers.getUserSlugId(_params.slug);
      try {
        const { data: response } = await userApi.fetchUser({
          params: {
            id: commonHelpers.isNumber(userId) ? userId! : _params.slug,
          },
          headers: {
            "x-lang": (locale ?? "").toLowerCase(),
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (axiosHelpers.checkRequestSuccess(response)) {
          store.dispatch(
            storeUserAction.fetchUserSucceededServer(response.data)
          );

          return {
            props: {
              ...(await commonHelpers.serverSideAppSettings(ctx)),
              ...(await serverSideTranslations(locale || "")),
              user: response.data,
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
    }) satisfies GetServerSideProps<SlugProps>
);
