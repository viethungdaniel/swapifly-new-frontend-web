import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import { reduxWrapper, storeInboxAction } from "@/store";

import { jwtService } from "@/services";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import PageAnalytics from "@/components/PageAnalytics";
import AuthGuardPage from "@/guards/AuthGuardPage";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import { inboxApi } from "@/utils/apis";

type InboxSlugParams = {
  slug: any;
};

type InboxSlugProps = {};

const ViewInboxSlug = dynamic(() => import("@/views/InboxSlug"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const InboxSlug: NextPageWithLayout<InboxSlugProps> = () => {
  return (
    <>
      <PageAnalytics />
      <ViewInboxSlug />
    </>
  );
};

InboxSlug.getLayout = (page, _, { translation }) => {
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: t("inbox"),
      }}
    >
      <AuthGuard requiredAuth>
        <LayoutMain disabledMainFooter disabledFloatActions>
          <AuthGuardPage>{page}</AuthGuardPage>
        </LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default InboxSlug;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { params, locale, res, req } = ctx;

      const { slug = [] } = params as InboxSlugParams;

      if (slug.length > 2)
        return {
          props: {
            ...(await serverSideTranslations(locale || "")),
          },
          notFound: true,
        };

      const token =
        jwtService.getToken({
          cookieOptions: {
            req,
            res,
          },
        }) ?? "";

      const [inboxThreadId] = [...slug].reverse();

      if (commonHelpers.isNumber(inboxThreadId)) {
        try {
          const { data: response } = await inboxApi.fetchInboxThreadOffer({
            params: {
              inbox_thread_id: inboxThreadId,
            },
            headers: {
              "x-lang": (locale ?? "").toLowerCase(),
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          });
          if (axiosHelpers.checkRequestSuccess(response)) {
            store.dispatch(
              storeInboxAction.fetchInboxThreadOfferSucceededServer({
                inboxThreadOffer: response.data,
                selectedInboxThreadId: Number(inboxThreadId),
              })
            );
          } else {
            store.dispatch(storeInboxAction.destroySelectedInboxThreadServer());
          }
        } catch {}
      } else {
        store.dispatch(storeInboxAction.destroySelectedInboxThreadServer());
      }

      return {
        props: {
          ...(await commonHelpers.serverSideAppSettings(ctx)),
          ...(await serverSideTranslations(locale || "")),
        },
      };
    }) satisfies GetServerSideProps<InboxSlugProps>
);
