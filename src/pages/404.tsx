import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import AuthGuard from "@/guards/AuthGuard";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetStaticProps } from "next";

const View404 = dynamic(() => import("@/views/404"), {
  ssr: true,
  loading: () => <PageLazyLoading />,
});

const _404: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
      <View404 />
    </>
  );
};

_404.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: t("pageNotFound")!,
      }}
    >
      <AuthGuard>
        <LayoutMain disabledMainHeaderMobileHomeIconButton>{page}</LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings()),
      ...(await serverSideTranslations(locale || "")),
    },
  };
};

export default _404;
