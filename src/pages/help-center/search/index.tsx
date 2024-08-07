import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutPortal from "@/layouts/Portal";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

export type HelpCenterSearchProps = {
  query: {
    keyword: string;
    page: string;
    platform: "app" | "";
  };
};

const ViewHelpCenterSearch = dynamic(() => import("@/views/HelpCenterSearch"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const HelpCenterSearch: NextPageWithLayout<HelpCenterSearchProps> = (props) => {
  const { query } = props;

  return (
    <>
      <PageAnalytics />
      <ViewHelpCenterSearch query={query} />
    </>
  );
};

HelpCenterSearch.getLayout = (page, pageProps, { translation }) => {
  const { query } = pageProps;
  const keyword = query.keyword;
  const platform = query.platform;
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${keyword} - ${t("searchHelpCenter")}`,
      }}
    >
      <LayoutPortal
        disablePortalFooter={platform === "app"}
        disablePortalHeader={platform === "app"}
        variant="helpCenter"
      >
        {page}
      </LayoutPortal>
    </LayoutRoot>
  );
};

export default HelpCenterSearch;

export const getServerSideProps = (async (ctx) => {
  const { locale, query } = ctx;

  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(locale || "")),
      query: {
        keyword: commonHelpers.getOneRouterQueryValue(query.keyword) ?? "",
        page: commonHelpers.getOneRouterQueryValue(query.page) ?? "",
        platform: commonHelpers.getOneRouterQueryValue(query.platform) ?? "",
      },
    },
  };
}) satisfies GetServerSideProps<HelpCenterSearchProps>;
