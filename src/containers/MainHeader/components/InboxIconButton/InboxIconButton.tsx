import AppBadge from "@/components/AppBadge";
import AppIconButton from "@/components/AppIconButton";
import AppLink from "@/components/AppLink";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTooltip from "@/components/AppTooltip";

import InboxOutlinedIcon from "@@/public/images/icons/inbox-outlined.svg";

import { useAppSelector } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const InboxIconButton = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const linkActivated = !!router.pathname.match(/^\/inbox/);

  const $s_unreadInboxThreadMessageCount = useAppSelector(
    (state) => state.inbox.unreadInboxThreadMessageCount
  );

  return (
    <AppTooltip title={t("inbox")}>
      <AppIconButton
        edge={"xy"}
        borderRadius="circular"
        component={AppLink}
        href="/inbox"
        color={linkActivated ? "primary" : "text.primary"}
        variant={linkActivated ? "containedTonal" : "text"}
        underline="none"
      >
        <AppBadge
          color="common.dotRed"
          badgeContent={$s_unreadInboxThreadMessageCount}
          max={99}
          sx={{ whiteSpace: "nowrap" }}
        >
          <AppSvgIcon component={InboxOutlinedIcon} />
        </AppBadge>
      </AppIconButton>
    </AppTooltip>
  );
};

export default InboxIconButton;
