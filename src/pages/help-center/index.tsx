import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutPortal from "@/layouts/Portal";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

type HelpCenterProps = {
  query: {
    platform?: "app" | "";
  };
};

const ViewHelpCenter = dynamic(() => import("@/views/HelpCenter"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const HelpCenter: NextPageWithLayout<HelpCenterProps> = () => {
  return (
    <>
      <PageAnalytics />
      <ViewHelpCenter />
    </>
  );
};

HelpCenter.getLayout = (page, pageProps, { translation }) => {
  const { query } = pageProps;
  const { t } = translation;
  const platform = query?.platform;

  return (
    <LayoutRoot
      headParams={{
        title: t(`helpCenter`),
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

export default HelpCenter;

export const getServerSideProps = (async (ctx) => {
  const query = ctx.query;

  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
      query: {
        platform: commonHelpers.getOneRouterQueryValue(query.platform) ?? "",
      } as HelpCenterProps["query"],
    },
  };
}) satisfies GetServerSideProps;
