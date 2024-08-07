import { imageHelpers } from "@/utils/helpers";

import AppContainer from "@/components/AppContainer";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent/AppContent";
import AppImage from "@/components/AppImage";
import HtmlParser from "@/components/HtmlParser";

import { useAppMomentWithLocale, useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./NotificationsSlug.styles";

const NotificationsSlug = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const $s_notification = useAppSelector(
    (state) => state.notification.notification
  );

  return (
    <>
      <AppContent className={classes.main}>
        <AppContainer sx={{ marginBottom: 2.5 }}>
          <AppBreadcrumbs>
            <AppLink href="/notifications" color="text.secondary">
              {t("notice")}
            </AppLink>
            <AppTypography color="text.primary">{t("details")}</AppTypography>
          </AppBreadcrumbs>
        </AppContainer>

        <AppContainer maxWidth="md">
          {$s_notification && (
            <>
              <AppTypography
                variant="bodyMed14"
                color="text.secondary"
                flex={1}
                mb={0.5}
              >
                {momentWithLocaleByCurrentTz(
                  $s_notification.create_time,
                  "X"
                ).format("DD/MM/YYYY HH:mm")}
              </AppTypography>
              <AppTypography variant="bodyMed16" mb={2.5}>
                {$s_notification.msg}
              </AppTypography>
              {!!$s_notification.image && (
                <AppImage
                  className={classes.notificationImage}
                  src={$s_notification.image}
                  loader={imageHelpers.appImageLoader}
                  width={500}
                  height={500}
                />
              )}
              <HtmlParser html={$s_notification.content ?? ""} />
            </>
          )}
        </AppContainer>
      </AppContent>
    </>
  );
};

export default NotificationsSlug;
