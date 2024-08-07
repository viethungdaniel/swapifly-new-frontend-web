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

type UserSearchProps = {
  query: {
    keyword: string;
  };
};

const ViewUserSearch = dynamic(() => import("@/views/UserSearch"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const UserSearch: NextPageWithLayout<UserSearchProps> = () => {
  return (
    <>
      <PageAnalytics />
      <ViewUserSearch />
    </>
  );
};

UserSearch.getLayout = (page, pageProps, { translation }) => {
  const keyword = pageProps.query?.keyword || "";
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${keyword ? `${keyword} - ` : ""}${t("userSearch")}`,
      }}
    >
      <AuthGuard>
        <LayoutMain disabledMainHeaderMobileHomeIconButton>{page}</LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default UserSearch;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
      query: ctx.query,
    },
  };
}) satisfies GetServerSideProps;
