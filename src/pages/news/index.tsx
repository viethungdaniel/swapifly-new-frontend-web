import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutPortal from "@/layouts/Portal";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

export type NewsProps = {
  query: {
    keyword: string;
    page: string;
    platform: "app" | "";
  };
};

const ViewNews = dynamic(() => import("@/views/News"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const News: NextPageWithLayout<NewsProps> = (props) => {
  const { query } = props;

  return (
    <>
      <PageAnalytics />
      <ViewNews query={query} />
    </>
  );
};

News.getLayout = (page, pageProps, { translation }) => {
  const { query } = pageProps;
  const keyword = query.keyword;
  const platform = query.platform;
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: !!keyword ? `${keyword} - ${t("searchNews")}` : t("news"),
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

export default News;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
      query: {
        keyword: commonHelpers.getOneRouterQueryValue(ctx.query.keyword) ?? "",
        page: commonHelpers.getOneRouterQueryValue(ctx.query.page) ?? "",
        platform:
          commonHelpers.getOneRouterQueryValue(ctx.query.platform) ?? "",
      },
    },
  };
}) satisfies GetServerSideProps<NewsProps>;
