import { bindActionCreators } from "redux";

import { storeInboxAction, storeInboxSelectors } from "@/store";
import { inboxAITypingLabels } from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadMessageList/InboxThreadMessageList";

import { Box } from "@mui/material";
import AppAvatar from "@/components/AppAvatar";
import useStyles from "./InboxThreadMessageContent.styles";
import AppTypography from "@/components/AppTypography";
import AppToolbar from "@/components/AppToolbar";
import AppImage from "@/components/AppImage";
import AppLink from "@/components/AppLink";
import AppLoading from "@/components/AppLoading";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTooltip from "@/components/AppTooltip";
import AppTypewriter from "@/components/AppTypewriter";
import TypingEffect from "@/components/TypingEffect";

import ErrorIcon from "@@/public/images/icons/error.svg";
import SwapiflyAISvg from "@@/public/images/svgs/ai-swapifly.svg";

import { commonHelpers, imageHelpers, inboxHelpers } from "@/utils/helpers";
import {
  useAppDispatch,
  useAppMomentWithLocale,
  useAppSelector,
  useAppWebsocket,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import useInterval from "@/hooks/useInterval";
import { useInView } from "react-intersection-observer";

import type { AppState } from "@/store";
import HtmlParser from "@/components/HtmlParser";

type InboxThreadMessageContentProps = {
  inboxThreadMessageIndex: number;
  isStartInboxThreadMessage?: boolean;
  isEndInboxThreadMessage?: boolean;
  previousInboxThreadMessage?: AppState["inbox"]["inboxThreadMessages"][number];
  inboxThreadMessage?: AppState["inbox"]["inboxThreadMessages"][number];
  nextInboxThreadMessage?: AppState["inbox"]["inboxThreadMessages"][number];
  inboxThreadAITyping?: boolean;
  inboxAITypingLabelIndex?: number;

  onPhotoOpen?: (imgPathname: string) => void;
};

const MessageCreatedDate = (props: {
  messageCreatedTime?: number;
  previousMessageCreatedTime?: number;
  nextMessageCreatedTime?: number;
  onDateShow?: (show: boolean) => void;
}) => {
  const {
    messageCreatedTime: controlledThreadCreatedTime,
    previousMessageCreatedTime: controlledPreviousThreadCreatedTime,
    nextMessageCreatedTime: controlledNextThreadCreatedTime,
    onDateShow,
  } = props;

  const { t } = useTranslation();
  const { momentWithLocale } = useAppMomentWithLocale();

  const { classes } = useStyles();

  const getThreadCreatedTimeText = useCallback(
    (createdTime?: number) => {
      if (!createdTime) return "";
      const nowDateTime = momentWithLocale(
        momentWithLocale().format("YYYY-MM-DD HH:mm:ss")
      );
      const messageCreatedTime = momentWithLocale(
        momentWithLocale(createdTime!, "X").format("YYYY-MM-DD HH:mm:ss")
      );
      const isToday = nowDateTime.isSame(messageCreatedTime, "days");
      if (isToday) {
        return t("today");
      }
      const nowDate = momentWithLocale(nowDateTime.format("YYYY-MM-DD"));
      const onlineTimeDate = momentWithLocale(
        messageCreatedTime.format("YYYY-MM-DD")
      );
      const isYesterday = nowDate.diff(onlineTimeDate, "days") === 1;
      if (isYesterday) {
        return t("yesterday");
      }
      const isOneWeekApart = nowDateTime.diff(messageCreatedTime, "days") < 7;
      if (isOneWeekApart) {
        return messageCreatedTime.format("dddd");
      }
      return messageCreatedTime.format("YYYY/MM/DD");
    },
    [
      controlledThreadCreatedTime,
      controlledPreviousThreadCreatedTime,
      t,
      momentWithLocale,
    ]
  );

  const [
    previousThreadCreatedDateTimeText,
    setPreviousThreadCreatedDateTimeText,
  ] = useState(getThreadCreatedTimeText(controlledPreviousThreadCreatedTime));
  const [nextThreadCreatedDateTimeText, setNextThreadCreatedDateTimeText] =
    useState(getThreadCreatedTimeText(controlledNextThreadCreatedTime));
  const [threadCreatedDateTimeText, setThreadCreatedDateTimeText] = useState(
    getThreadCreatedTimeText(controlledThreadCreatedTime)
  );

  const updateThreadCreatedTimeText = useCallback(() => {
    setPreviousThreadCreatedDateTimeText(
      getThreadCreatedTimeText(controlledPreviousThreadCreatedTime)
    );
    setNextThreadCreatedDateTimeText(
      getThreadCreatedTimeText(controlledNextThreadCreatedTime)
    );
    setThreadCreatedDateTimeText(
      getThreadCreatedTimeText(controlledThreadCreatedTime)
    );
  }, [getThreadCreatedTimeText]);

  useInterval(updateThreadCreatedTimeText, 1000);

  useEffect(() => {
    if (!isMounted()) return;
    updateThreadCreatedTimeText();
  }, [updateThreadCreatedTimeText]);

  useEffect(() => {
    onDateShow &&
      onDateShow(
        !!nextThreadCreatedDateTimeText &&
          nextThreadCreatedDateTimeText !== threadCreatedDateTimeText
      );
  }, [onDateShow, nextThreadCreatedDateTimeText, threadCreatedDateTimeText]);

  const isMounted = useIsMounted();

  if (previousThreadCreatedDateTimeText === threadCreatedDateTimeText)
    return null;

  return (
    <AppTypography className={classes.messageDate} noWrap>
      {threadCreatedDateTimeText}
    </AppTypography>
  );
};

const InboxThreadMessageContent = (props: InboxThreadMessageContentProps) => {
  const {
    isStartInboxThreadMessage,
    isEndInboxThreadMessage,
    inboxThreadMessage = null,
    nextInboxThreadMessage,
    previousInboxThreadMessage,
    inboxThreadAITyping,
    inboxAITypingLabelIndex,
    onPhotoOpen,
  } = props;

  const [isNewInboxThreadMessage] = useState(
    !!inboxThreadMessage?.is_new_message
  );
  const [isDateLastMessage, setIsDateLastMessage] = useState(false);

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const inView = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const appWebsocket = useAppWebsocket();

  const { t } = useTranslation();

  const { classes, cx } = useStyles();

  const dispatch = useAppDispatch();

  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );
  const $s_inboxThreadOfferUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferUser
  );
  const $s_authUser = useAppSelector((state) => state.auth.user);

  const isMyThread =
    !!inboxThreadMessage?.uid && inboxThreadMessage?.uid === $s_authUser?.id;

  const threadUser = useMemo(() => {
    if (isMyThread)
      return {
        id: $s_authUser?.id,
        nickname: $s_authUser?.nickname,
        username: $s_authUser?.username,
        avatar: $s_authUser?.avatar,
      };
    return {
      id: $s_inboxThreadOfferUser?.id,
      nickname: $s_inboxThreadOfferUser?.nickname,
      username: $s_inboxThreadOfferUser?.username,
      avatar: $s_inboxThreadOfferUser?.avatar,
    };
  }, [isMyThread, $s_inboxThreadOfferUser, $s_authUser]);

  const isLastMessage = useMemo(() => {
    return inboxThreadMessage?.uid !== nextInboxThreadMessage?.uid;
  }, [inboxThreadMessage?.uid, nextInboxThreadMessage?.uid]);

  const isThreadMessageAI = inboxHelpers.isThreadMessageAI(
    inboxThreadMessage?.from_type
  );
  const isInboxThreadNormalMessageType =
    inboxHelpers.isInboxThreadNormalMessageType(inboxThreadMessage?.type);
  const isInboxThreadCreatedOfferMessageType =
    inboxHelpers.isInboxThreadCreatedOfferMessageType(inboxThreadMessage?.type);
  const isInboxThreadUpdatedOfferMessageType =
    inboxHelpers.isInboxThreadUpdatedOfferMessageType(inboxThreadMessage?.type);
  const isInboxThreadAcceptedOfferMessageType =
    inboxHelpers.isInboxThreadAcceptedOfferMessageType(
      inboxThreadMessage?.type
    );
  const isInboxThreadDeclinedOfferMessageType =
    inboxHelpers.isInboxThreadDeclinedOfferMessageType(
      inboxThreadMessage?.type
    );
  const isInboxThreadCancelledOfferMessageType =
    inboxHelpers.isInboxThreadCancelledOfferMessageType(
      inboxThreadMessage?.type
    );

  const isInboxThreadMessageContentTextType =
    inboxHelpers.isInboxThreadMessageContentTextType(
      inboxThreadMessage?.c_type
    );
  const isInboxThreadMessageContentImageType =
    inboxHelpers.isInboxThreadMessageContentImageType(
      inboxThreadMessage?.c_type
    );

  const handleMessageCreatedDateShow = useCallback(
    (show: boolean) => {
      setIsDateLastMessage(show);
    },
    [isLastMessage]
  );

  const markInboxThreadMessageRead = useEventCallback(() => {
    if (
      !isEndInboxThreadMessage ||
      isMyThread ||
      !!inboxThreadMessage?.isread ||
      !inboxThreadMessage?.id
    )
      return;

    appWebsocket.markInboxThreadMessageRead({
      inboxThreadMessageId: inboxThreadMessage?.id!,
    });
    $s_inboxAction.markInboxThreadMessageRead({
      inboxThreadId: $s_selectedInboxThreadId!,
      inboxThreadMessageId: inboxThreadMessage?.id!,
    });
  });

  useEffect(() => {
    inView.inView && markInboxThreadMessageRead();
  }, [inView.inView]);

  useEffect(() => {
    if (!!inboxThreadMessage?.id && !!inboxThreadMessage.is_new_message) {
      $s_inboxAction.unmarkInboxThreadMessageNewMessage(inboxThreadMessage?.id);
    }
  }, []);

  if (inboxThreadAITyping && !inboxThreadMessage) {
    return (
      <>
        <AppToolbar
          className={cx(
            classes.root,
            classes.messageEnd,
            classes.swapiflyAITypingToolbar,
            {
              [classes.me]: !$s_inboxThreadOfferUser?.is_seller,
            }
          )}
        >
          <div className={classes.user}>
            <SwapiflyAISvg className={classes.swapiflyAISvg} />
            <div className={classes.userMessage}>
              <AppTypography className={classes.userMessageBox}>
                <TypingEffect sx={{ minHeight: 21 }} />
              </AppTypography>
            </div>
          </div>
          {inboxAITypingLabels[inboxAITypingLabelIndex!] && (
            <AppTypography
              className={classes.userHelperText}
              variant="captionReg12"
            >
              {t(inboxAITypingLabels[inboxAITypingLabelIndex!])}
            </AppTypography>
          )}
        </AppToolbar>
      </>
    );
  }

  return (
    <AppToolbar
      className={cx(classes.root, {
        [classes.me]: isMyThread,
        [classes.messageStart]: isStartInboxThreadMessage,
        [classes.messageEnd]: isEndInboxThreadMessage,
      })}
    >
      <MessageCreatedDate
        previousMessageCreatedTime={previousInboxThreadMessage?.create_time}
        nextMessageCreatedTime={nextInboxThreadMessage?.create_time}
        messageCreatedTime={inboxThreadMessage?.create_time}
        onDateShow={handleMessageCreatedDateShow}
      />
      <div className={classes.user}>
        {isThreadMessageAI ? (
          <SwapiflyAISvg className={classes.swapiflyAISvg} />
        ) : (
          <AppLink
            href={`/${commonHelpers.generateUserSlug(threadUser)}`}
            display="flex"
          >
            <AppAvatar
              src={
                !!threadUser.avatar
                  ? imageHelpers.appImageLoader({
                      src: threadUser.avatar,
                    })
                  : undefined
              }
              className={classes.userAvatar}
            />
          </AppLink>
        )}
        <div className={classes.userMessage}>
          <AppTypography className={classes.userMessageBox}>
            {isInboxThreadNormalMessageType && (
              <>
                {isInboxThreadMessageContentTextType &&
                  (!!isNewInboxThreadMessage &&
                  inboxHelpers.isThreadMessageAI(
                    inboxThreadMessage?.from_type
                  ) ? (
                    <AppTypewriter
                      align="justify"
                      options={{
                        strings: commonHelpers.parseHtmlWithUrl(
                          inboxThreadMessage?.content ?? ""
                        ),
                        autoStart: true,
                        delay: 1,
                      }}
                    />
                  ) : (
                    <HtmlParser
                      html={commonHelpers.parseHtmlWithUrl(
                        inboxThreadMessage?.content ?? ""
                      )}
                    />
                  ))}
                {isInboxThreadMessageContentImageType && (
                  <AppImage
                    className={classes.userMessageBoxImage}
                    src={inboxThreadMessage?.content}
                    loader={imageHelpers.appImageLoader}
                    width={500}
                    height={500}
                    priority
                    onClick={() =>
                      onPhotoOpen && onPhotoOpen(inboxThreadMessage?.content!)
                    }
                  />
                )}
              </>
            )}
            {isInboxThreadCreatedOfferMessageType &&
              t("offerWithPrice", {
                price: inboxThreadMessage?.price,
                currency: inboxThreadMessage?.currency,
              })}
            {isInboxThreadUpdatedOfferMessageType &&
              t("editOfferWithPrice", {
                price: inboxThreadMessage?.price,
                currency: inboxThreadMessage?.currency,
              })}
            {isInboxThreadAcceptedOfferMessageType && <>{t("acceptOffer")}</>}
            {isInboxThreadDeclinedOfferMessageType && <>{t("declineOffer")}</>}
            {isInboxThreadCancelledOfferMessageType && <>{t("cancelOffer")}</>}
          </AppTypography>
        </div>
        {!!inboxThreadMessage?.is_sending && <AppLoading size={20} />}
        {!!inboxThreadMessage?.is_error && (
          <AppTooltip title={t("failedToSendMessage")}>
            <Box display="flex" component="span">
              <AppSvgIcon
                component={ErrorIcon}
                fontSize="small"
                color="error.main"
              />
            </Box>
          </AppTooltip>
        )}
      </div>
      <div ref={inView.ref}></div>
      {(isLastMessage || isDateLastMessage) && (
        <AppTypography
          className={classes.userHelperText}
          variant="captionReg12"
        >
          {isEndInboxThreadMessage &&
            isMyThread &&
            (inboxThreadMessage.isread ? t("seen") : t("delivered"))}{" "}
          {!!inboxThreadMessage?.create_time
            ? momentWithLocaleByCurrentTz(
                inboxThreadMessage!.create_time,
                "X"
              ).format("HH:mm")
            : ""}
        </AppTypography>
      )}
    </AppToolbar>
  );
};

export default InboxThreadMessageContent;
