import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

const ViewTermsOfService = dynamic(() => import("@/views/TermsOfService"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const TermsOfService: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
      <ViewTermsOfService />
    </>
  );
};

TermsOfService.getLayout = (page, _, { translation }) => {
  const { t } = translation;
  return (
    <LayoutRoot
      headParams={{
        title: t("termOfService"),
      }}
    >
      <AuthGuard>
        <LayoutMain disabledMainHeaderMobileHomeIconButton>{page}</LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default TermsOfService;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
    },
  };
}) satisfies GetServerSideProps;
