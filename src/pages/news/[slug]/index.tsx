import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { newsItemApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers, imageHelpers } from "@/utils/helpers";
import { reduxWrapper, storeNewsItemAction } from "@/store";

import LayoutPortal from "@/layouts/Portal";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { FetchNewsItemResponseData } from "@/utils/apis/newsItem";

type NewsSlugParams = {
  slug: string;
};

type NewsSlugProps = {
  newsItem: FetchNewsItemResponseData["news"];
  newsItemId: number;
  query: {
    platform: "app" | "";
  };
};

const ViewNewsSlug = dynamic(() => import("@/views/NewsSlug"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const NewsSlug: NextPageWithLayout<NewsSlugProps> = (props) => {
  const { newsItemId } = props;

  return (
    <>
      <PageAnalytics />
      <ViewNewsSlug newsItemId={newsItemId} />
    </>
  );
};

NewsSlug.getLayout = (page, pageProps, { translation }) => {
  const { newsItem, query } = pageProps;
  const platform = query.platform;
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${newsItem.title} - ${t("news")}`,
        openGraph: {
          url: commonHelpers.getURL(
            `/news/${commonHelpers.generateSlug(newsItem.title, newsItem.id)}`
          ),
          title: newsItem.title,
          description: newsItem.abstract,
          images: [
            {
              url: imageHelpers.imagePathLoader(newsItem.img),
              alt: newsItem.title,
            },
          ],
        },
      }}
    >
      <LayoutPortal
        disablePortalFooter={platform === "app"}
        disablePortalHeader={platform === "app"}
        variant="news"
      >
        {page}
      </LayoutPortal>
    </LayoutRoot>
  );
};

export default NewsSlug;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { params, locale, res, query } = ctx;

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      );

      const _params = params as NewsSlugParams;

      const newsItemId = commonHelpers.getSlugId(_params.slug);
      if (!commonHelpers.isEmpty(newsItemId)) {
        try {
          const { data: response } = await newsItemApi.fetchNewsItem({
            params: {
              id: newsItemId!,
            },
            headers: {
              "x-lang": (locale ?? "").toLowerCase(),
            },
          });

          if (axiosHelpers.checkRequestSuccess(response)) {
            store.dispatch(
              storeNewsItemAction.fetchNewsItemSucceededServer(response.data)
            );

            return {
              props: {
                ...(await commonHelpers.serverSideAppSettings(ctx)),
                ...(await serverSideTranslations(locale || "")),
                newsItem: response.data.news,
                newsItemId: newsItemId!,
                query: {
                  platform:
                    commonHelpers.getOneRouterQueryValue(query.platform) ?? "",
                },
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
    }) satisfies GetServerSideProps<NewsSlugProps>
);
