import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { commonHelpers } from "@/utils/helpers";

import LayoutRoot from "@/layouts/Root";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";

const ImpressionPackageOrderPaymentResults: NextPageWithLayout = () => {
  return (
    <>
      <PageAnalytics />
    </>
  );
};

ImpressionPackageOrderPaymentResults.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: t("impressionPackageOrderPaymentResults"),
      }}
    >
      {page}
    </LayoutRoot>
  );
};

export default ImpressionPackageOrderPaymentResults;

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await commonHelpers.serverSideAppSettings(ctx)),
      ...(await serverSideTranslations(ctx.locale || "")),
    },
  };
}) satisfies GetServerSideProps;
