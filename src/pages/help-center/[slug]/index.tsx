import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { helpCenterApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers, imageHelpers } from "@/utils/helpers";
import { reduxWrapper, storeHelpCenterAction } from "@/store";

import LayoutPortal from "@/layouts/Portal";
import LayoutRoot from "@/layouts/Root";
import PageLazyLoading from "@/components/PageLazyLoading";
import PageAnalytics from "@/components/PageAnalytics";

import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { FetchHelpCenterResponseData } from "@/utils/apis/helpCenter";

type HelpCenterSlugParams = {
  slug: string;
};

type HelpCenterSlugProps = {
  helpCenter: FetchHelpCenterResponseData["help_center"];
  query: {
    platform: "app" | "";
  };
};

const ViewHelpCenterSlug = dynamic(() => import("@/views/HelpCenterSlug"), {
  ssr: false,
  loading: () => <PageLazyLoading />,
});

const HelpCenterSlug: NextPageWithLayout<HelpCenterSlugProps> = () => {
  return (
    <>
      <PageAnalytics />
      <ViewHelpCenterSlug />
    </>
  );
};

HelpCenterSlug.getLayout = (page, pageProps, { translation }) => {
  const { query, helpCenter } = pageProps;
  const platform = query.platform;
  const { t } = translation;

  return (
    <LayoutRoot
      headParams={{
        title: `${helpCenter.title} - ${t("helpCenter")}`,
        openGraph: {
          url: commonHelpers.getURL(
            `/help-center/${commonHelpers.generateSlug(
              helpCenter.title,
              helpCenter.id
            )}`
          ),
          title: helpCenter.title,
          description: helpCenter.abstract,
          images: [
            {
              url: imageHelpers.imagePathLoader(helpCenter.meta_image),
              alt: helpCenter.title,
            },
          ],
        },
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

export default HelpCenterSlug;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) =>
    (async (ctx) => {
      const { params, locale, res, query } = ctx;

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      );

      const _params = params as HelpCenterSlugParams;

      const helpCenterId = commonHelpers.getSlugId(_params.slug);
      if (!commonHelpers.isEmpty(helpCenterId)) {
        try {
          const { data: response } = await helpCenterApi.fetchHelpCenter({
            params: {
              id: helpCenterId!,
            },
            headers: {
              "x-lang": (locale ?? "").toLowerCase(),
            },
          });

          if (axiosHelpers.checkRequestSuccess(response)) {
            store.dispatch(
              storeHelpCenterAction.fetchHelpCenterSucceededServer(
                response.data
              )
            );

            return {
              props: {
                ...(await commonHelpers.serverSideAppSettings(ctx)),
                ...(await serverSideTranslations(locale || "")),
                helpCenter: response.data.help_center,
                query: {
                  platform:
                    commonHelpers.getOneRouterQueryValue(query.platform) ?? "",
                },
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
    }) satisfies GetServerSideProps<HelpCenterSlugProps>
);
