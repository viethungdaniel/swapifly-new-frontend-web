import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import AuthGuardPage from "@/guards/AuthGuardPage";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

const ViewNotifications = dynamic(() => import("@/views/Notifications"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const Notifications: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
      <ViewNotifications />
    </>
  );
};

Notifications.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: t(`notice`),
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

export default Notifications;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
    },
  };
}) satisfies GetServerSideProps;
