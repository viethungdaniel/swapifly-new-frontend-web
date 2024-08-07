import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";
import AppTooltip from "@/components/AppTooltip";

import BookmarkOutlinedIcon from "@@/public/images/icons/bookmark-outlined.svg";

import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";

const BookmarkIconButton = () => {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <AppTooltip title={t("bookmark")!}>
      <AppIconButton
        component={AppLink}
        underline="none"
        href="/bookmarks"
        color={
          !!router.pathname.match(/^\/bookmarks/) ? "primary" : "text.primary"
        }
        variant={
          !!router.pathname.match(/^\/bookmarks/) ? "containedTonal" : "text"
        }
        edge={"xy"}
        borderRadius="circular"
      >
        <AppSvgIcon
          component={BookmarkOutlinedIcon}
          sx={(theme) =>
            !!router.pathname.match(/^\/bookmarks/)
              ? {
                  color: theme.palette.primary.main,
                  "& path": {
                    fill: theme.palette.primary.main,
                  },
                }
              : {}
          }
        />
      </AppIconButton>
    </AppTooltip>
  );
};

export default BookmarkIconButton;
