import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import LayoutUserSetting from "@/layouts/UserSetting";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import AuthGuardPage from "@/guards/AuthGuardPage";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

const ViewUserAccountProfile = dynamic(
  () => import("@/views/UserAccountProfile"),
  {
    ssr: false,
    loading: () => <PageLazyLoading />,
  }
);

const UserAccountProfile: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
      <ViewUserAccountProfile />
    </>
  );
};

UserAccountProfile.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: t("editProfile"),
      }}
    >
      <AuthGuard requiredAuth>
        <LayoutMain
          disabledMainBottomAppBar
          disabledMainBottomAppBarToolbar
          disabledSellIconButton
        >
          <LayoutUserSetting>
            <AuthGuardPage>{page}</AuthGuardPage>
          </LayoutUserSetting>
        </LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default UserAccountProfile;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
    },
  };
}) satisfies GetServerSideProps;
