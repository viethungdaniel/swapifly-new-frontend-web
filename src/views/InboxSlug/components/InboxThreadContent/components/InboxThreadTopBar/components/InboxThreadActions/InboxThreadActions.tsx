import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { ClickAwayListener, Grow, Popper, useTheme } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppPaper from "@/components/AppPaper";
import AppMenuList from "@/components/AppMenuList";
import AppMenuItem from "@/components/AppMenuItem";
import AppListItemText from "@/components/AppListItemText";
import AppIconButton from "@/components/AppIconButton";
import UserReportDialog from "@/components/UserReportDialog";

import MoreHorizIcon from "@@/public/images/icons/more-horiz.svg";

import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  useAppMomentWithLocale,
  useAppSelector,
  useCountDownTimer,
} from "@/hooks";
import { storeInboxSelectors } from "@/store";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";
import { inboxConstants } from "@/utils/constants";

const INBOX_THREAD_ACTIONS_TOGGLE_AI_CHAT_EVENT = "TOGGLE_AI_CHAT";
const INBOX_THREAD_ACTIONS_ARCHIVED_MESSAGE_EVENT = "ARCHIVED_MESSAGE";
const INBOX_THREAD_ACTIONS_BLOCKED_USER_EVENT = "BLOCKED_USER";
const INBOX_THREAD_ACTIONS_DELETE_INBOX_THREAD_EVENT = "DELETE_USER";
const INBOX_THREAD_ACTIONS_REPORT_USER_EVENT = "REPORT_USER";

const InboxThreadActions = () => {
  const {
    changeInboxThreadBlocked,
    changeInboxThreadArchived,
    deleteInboxThread,
    openAiChatUserListTurnOffDialog,
    openAiChatUserListTurnOnDialog,
  } = useContext(InboxSlugContext);

  const [inboxThreadActionListAnchor, setInboxThreadActionListAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [userReportDialogOpen, setUserReportDialogOpen] = useState(false);

  const threadActionListOpen = !!inboxThreadActionListAnchor;

  const $s_inboxThreadOfferUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferUser
  );
  const $s_inboxThreadAuthArchived = useAppSelector(
    storeInboxSelectors.selectInboxThreadAuthArchived
  );
  const $s_inboxThreadUserBlocked = useAppSelector(
    storeInboxSelectors.selectInboxThreadUserBlocked
  );
  const $s_inboxThreadOfferAutoReplyStatus = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_switch_status
  );
  const $s_inboxThreadOfferAiChatTurnedOffSeconds = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_resume_at
  );

  const { momentWithLocale } = useAppMomentWithLocale();

  const { asSeconds } = useCountDownTimer(
    $s_inboxThreadOfferAiChatTurnedOffSeconds
      ? momentWithLocale($s_inboxThreadOfferAiChatTurnedOffSeconds, "X")
      : undefined
  );

  const { t } = useTranslation();

  const inboxThreadActions = [
    ...(!!$s_inboxThreadOfferUser?.is_buyer &&
    $s_inboxThreadOfferAutoReplyStatus !==
      inboxConstants.INBOX_THREAD_AI_CHAT_DISABLED_TYPE
      ? [
          {
            event: INBOX_THREAD_ACTIONS_TOGGLE_AI_CHAT_EVENT,
            label: t(
              $s_inboxThreadOfferAutoReplyStatus ===
                inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE ||
                ($s_inboxThreadOfferAutoReplyStatus ===
                  inboxConstants.INBOX_THREAD_AI_CHAT_OFF_TYPE &&
                  asSeconds < 1)
                ? "turnOffAiChat"
                : "turnOnAiChat"
            ),
          },
        ]
      : []),
    {
      event: INBOX_THREAD_ACTIONS_ARCHIVED_MESSAGE_EVENT,
      label: t(
        $s_inboxThreadAuthArchived ? "unarchiveMessage" : "archiveMessage"
      ),
    },
    {
      event: INBOX_THREAD_ACTIONS_BLOCKED_USER_EVENT,
      label: t($s_inboxThreadUserBlocked ? "unblockUser" : "blockUser"),
    },
    {
      event: INBOX_THREAD_ACTIONS_DELETE_INBOX_THREAD_EVENT,
      label: t("deleteInbox"),
    },
    {
      event: INBOX_THREAD_ACTIONS_REPORT_USER_EVENT,
      label: t("reportUser"),
    },
  ] as const;

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );

  const handleUserReportDialogClose = () => {
    setUserReportDialogOpen(false);
  };

  const theme = useTheme();

  const handleInboxThreadActionListToggle = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setInboxThreadActionListAnchor((prevInboxThreadActionListAnchor) =>
      !prevInboxThreadActionListAnchor ? event.currentTarget : null
    );
  };

  const handleInboxThreadActionListClose = (
    _: TouchEvent | MouseEvent | React.KeyboardEvent<HTMLUListElement>
  ) => {
    setInboxThreadActionListAnchor(null);
  };

  const handleThreadActionClick =
    (eventCode: (typeof inboxThreadActions)[number]["event"]) => () => {
      switch (eventCode) {
        case INBOX_THREAD_ACTIONS_REPORT_USER_EVENT: {
          setUserReportDialogOpen(true);
          break;
        }
        case INBOX_THREAD_ACTIONS_ARCHIVED_MESSAGE_EVENT: {
          changeInboxThreadArchived({
            inboxThreadIds: [$s_selectedInboxThreadId!],
            isArchived: !$s_inboxThreadAuthArchived,
            closeInboxThreadSelectableOnChange: true,
          });
          break;
        }
        case INBOX_THREAD_ACTIONS_BLOCKED_USER_EVENT: {
          changeInboxThreadBlocked({
            isBlocked: !$s_inboxThreadUserBlocked,
          });
          break;
        }
        case INBOX_THREAD_ACTIONS_DELETE_INBOX_THREAD_EVENT: {
          deleteInboxThread({
            inboxThreadIds: [$s_selectedInboxThreadId!],
          });
          break;
        }
        case INBOX_THREAD_ACTIONS_TOGGLE_AI_CHAT_EVENT: {
          if (
            $s_inboxThreadOfferAutoReplyStatus ===
            inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE
          )
            openAiChatUserListTurnOffDialog();
          else openAiChatUserListTurnOnDialog();
          break;
        }
      }

      setInboxThreadActionListAnchor(null);
    };

  return (
    <>
      <AppIconButton
        variant="text"
        borderRadius="circular"
        edge="xy"
        color="text.primary"
        onClick={handleInboxThreadActionListToggle}
      >
        <AppSvgIcon component={MoreHorizIcon} fontSize="inherit" />
      </AppIconButton>
      <Popper
        open={!!threadActionListOpen}
        anchorEl={inboxThreadActionListAnchor}
        placement="bottom-end"
        transition
        modifiers={[
          {
            name: "flip",
            enabled: true,
          },
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: true,
            },
          },
        ]}
        style={{
          zIndex: theme.zIndex.tooltip,
        }}
      >
        {({ TransitionProps, placement }) => (
          <ClickAwayListener onClickAway={handleInboxThreadActionListClose}>
            <Grow
              {...TransitionProps}
              timeout={theme.transitions.duration.shortest}
              style={{
                transformOrigin:
                  placement === "bottom-end" ? "100% 0 0" : "100% 100% 0",
              }}
            >
              <AppPaper
                boxShadowVariant="menuPopper"
                sx={{ maxWidth: "100vw" }}
              >
                <AppMenuList
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === "Escape")
                      handleInboxThreadActionListClose(event);
                  }}
                >
                  {inboxThreadActions.map((threadAction) => (
                    <AppMenuItem
                      key={threadAction.event}
                      onClick={handleThreadActionClick(threadAction.event)}
                    >
                      <AppListItemText primary={t(threadAction.label)} />
                    </AppMenuItem>
                  ))}
                </AppMenuList>
              </AppPaper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
      <UserReportDialog
        open={userReportDialogOpen}
        userId={$s_inboxThreadOfferUser?.id}
        onProductReportSubmitSucceed={handleUserReportDialogClose}
        onClose={handleUserReportDialogClose}
      />
    </>
  );
};

export default InboxThreadActions;
