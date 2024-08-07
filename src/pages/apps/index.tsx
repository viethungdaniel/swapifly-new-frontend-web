import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers, imageHelpers } from "@/utils/helpers";

import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

const ViewApps = dynamic(() => import("@/views/Apps"), {
  suspense: true,
  ssr: true,
  loading: () => <PageLazyLoading />,
});

const Apps: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
      <ViewApps />
    </>
  );
};

Apps.getLayout = (page) => {
  return (
    <LayoutRoot
      headParams={{
        title: "Swapifly app",
        openGraph: {
          images: [
            {
              url: imageHelpers.imagePathLoader(
                "swapifly/apps/app-preview.jpeg"
              ),
              alt: "Swapifly app",
            },
          ],
        },
      }}
    >
      {page}
    </LayoutRoot>
  );
};

export default Apps;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
    },
  };
}) satisfies GetServerSideProps;
