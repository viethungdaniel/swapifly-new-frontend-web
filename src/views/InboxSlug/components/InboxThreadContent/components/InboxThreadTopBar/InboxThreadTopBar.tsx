import { storeInboxSelectors } from "@/store";
import { commonHelpers, imageHelpers } from "@/utils/helpers";

import InboxToolbar from "@/views/InboxSlug/components/InboxToolbar";
import AppAvatar from "@/components/AppAvatar";
import AppTypography from "@/components/AppTypography";
import OfferedProduct from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadTopBar/components/OfferedProduct";
import ThreadActions from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadTopBar/components/InboxThreadActions";
import UserOnlineTime from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadTopBar/components/UserOnlineTime";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";

import { useContext } from "react";
import { useAppSelector } from "@/hooks";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

import useStyles from "./InboxThreadTopBar.styles";

const InboxThreadTopBar = () => {
  const { closeInboxThreadContentDrawer } = useContext(InboxSlugContext);

  const $s_inboxThreadOfferUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferUser
  );

  const userPathname = `/${commonHelpers.generateUserSlug({
    id: $s_inboxThreadOfferUser?.id,
    nickname: $s_inboxThreadOfferUser?.nickname,
    username: $s_inboxThreadOfferUser?.username,
  })}`;

  const { classes } = useStyles();

  const handleInboxThreadContentDrawerClose = () => {
    closeInboxThreadContentDrawer();
  };

  return (
    <div>
      <InboxToolbar>
        <AppIconButton
          variant="text"
          color="text.primary"
          borderRadius="circular"
          edge={["start", "y"]}
          className={classes.backButton}
          onClick={handleInboxThreadContentDrawerClose}
        >
          <AppSvgIcon component={ArrowLeftIcon} fontSize="inherit" />
        </AppIconButton>

        <AppLink href={userPathname} display="flex" hoverColor="none">
          <AppAvatar
            className={classes.userAvatar}
            src={
              !!$s_inboxThreadOfferUser?.avatar
                ? imageHelpers.appImageLoader({
                    src: $s_inboxThreadOfferUser?.avatar,
                  })
                : undefined
            }
            imgProps={{
              alt: $s_inboxThreadOfferUser?.nickname,
            }}
          />
        </AppLink>
        <div className={classes.userInfo}>
          <AppLink href={userPathname} underline="none" variant="bodySemi16">
            {$s_inboxThreadOfferUser?.nickname}
          </AppLink>
          <AppTypography variant="captionReg12" color="text.secondary">
            <UserOnlineTime />
          </AppTypography>
        </div>
        <ThreadActions />
      </InboxToolbar>
      <OfferedProduct />
    </div>
  );
};

export default InboxThreadTopBar;
