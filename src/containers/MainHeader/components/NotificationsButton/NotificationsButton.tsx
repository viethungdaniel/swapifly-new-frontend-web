import AppBadge from "@/components/AppBadge";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTooltip from "@/components/AppTooltip";
import AppLink from "@/components/AppLink";

import NotificationsIcon from "@@/public/images/icons/notifications.svg";
import NotificationsOutlinedIcon from "@@/public/images/icons/notifications-outlined.svg";

import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

type NotificationsButtonProps = {
  variant?: "desktop" | "mobile";
};

const NotificationsButton = (props: NotificationsButtonProps) => {
  const { variant = "desktop" } = props;

  const router = useRouter();

  const { t } = useTranslation();

  const $s_unreadNotificationCount = useAppSelector(
    (state) => state.notification.unreadNotificationCount
  );

  return (
    <AppTooltip title={t("notification")}>
      <AppIconButton
        edge={"xy"}
        borderRadius={"circular"}
        component={AppLink}
        whiteSpace="nowrap"
        underline="none"
        href="/notifications"
        color={
          !!router.pathname.match(/^\/notifications/)
            ? "primary"
            : "text.primary"
        }
        variant={
          !!router.pathname.match(/^\/notifications/)
            ? "containedTonal"
            : "text"
        }
      >
        <AppBadge
          color="common.dotRed"
          badgeContent={$s_unreadNotificationCount}
          max={99}
        >
          <AppSvgIcon
            component={
              variant === "desktop" &&
              !router.pathname.match(/^\/notifications/)
                ? NotificationsOutlinedIcon
                : NotificationsIcon
            }
          />
        </AppBadge>
      </AppIconButton>
    </AppTooltip>
  );
};

export default NotificationsButton;
