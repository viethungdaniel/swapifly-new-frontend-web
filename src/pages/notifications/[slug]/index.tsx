import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { notificationApi } from "@/utils/apis";
import {
  axiosHelpers,
  commonHelpers,
  notificationHelpers,
} from "@/utils/helpers";
import { storageService } from "@/services";
import { storageKeyConstants } from "@/utils/constants";
import { reduxWrapper, storeNotificationAction } from "@/store";

import LayoutMain from "@/layouts/Main";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import AuthGuard from "@/guards/AuthGuard/AuthGuard";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { FetchNotificationResponseData } from "@/utils/apis/notification";

type NotificationsSlugParams = {
  slug: string;
};

type NotificationsSlugProps = {
  notification: FetchNotificationResponseData;
};

const ViewNotificationsSlug = dynamic(
  () => import("@/views/NotificationsSlug"),
  {
    ssr: false,
    loading: () => <PageLazyLoading />,
  }
);

const NotificationsSlug: NextPageWithLayout<NotificationsSlugProps> = () => {
  return (
    <>
      <PageAnalytics />
      <ViewNotificationsSlug />
    </>
  );
};

NotificationsSlug.getLayout = (page, pageProps, { translation }) => {
  const notification = pageProps.notification;
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${notification.msg} - ${t("notice")}`,
        openGraph: {
          url: commonHelpers.getURL(
            `/${commonHelpers.generateSlug(notification.msg, notification.id)}`
          ),
          title: notification.msg,
          description: notification.short_desc,
          images: [
            {
              url: notification.image,
              alt: notification.msg,
            },
          ],
        },
      }}
    >
      <AuthGuard>
        <LayoutMain disabledMainHeaderMobileHomeIconButton>{page}</LayoutMain>
      </AuthGuard>
    </LayoutRoot>
  );
};

export default NotificationsSlug;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { params, locale, res, req } = ctx;

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      );

      const token =
        storageService.getCookieItem(storageKeyConstants.AUTH_TOKEN, {
          req,
        }) ?? "";

      const _params = params as NotificationsSlugParams;

      const notificationId = commonHelpers.getSlugId(_params.slug);
      if (!commonHelpers.isEmpty(notificationId)) {
        try {
          const { data: response } = await notificationApi.fetchNotification({
            params: {
              id: notificationId!,
            },
            headers: {
              "x-lang": (locale ?? "").toLowerCase(),
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          });

          if (
            axiosHelpers.checkRequestSuccess(response) &&
            notificationHelpers.isNotificationText(response.data.type)
          ) {
            store.dispatch(
              storeNotificationAction.fetchNotificationSucceededServer(
                response.data
              )
            );

            return {
              props: {
                ...(await commonHelpers.serverSideAppSettings(ctx)),
                ...(await serverSideTranslations(locale || "")),
                notification: response.data,
              },
            };
          }
        } catch (_) {}
        return {
          props: {
            ...(await commonHelpers.serverSideAppSettings(ctx)),
            ...(await serverSideTranslations(locale || "")),
          },
          notFound: true,
        };
      }

      return {
        props: {
          ...(await commonHelpers.serverSideAppSettings(ctx)),
          ...(await serverSideTranslations(locale || "")),
        },
        notFound: true,
      };
    }) satisfies GetServerSideProps<NotificationsSlugProps>
);
