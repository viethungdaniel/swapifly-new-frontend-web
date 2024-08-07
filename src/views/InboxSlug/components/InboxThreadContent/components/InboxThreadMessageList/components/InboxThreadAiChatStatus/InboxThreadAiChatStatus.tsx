import { inboxConstants } from "@/utils/constants";

import AppChip from "@/components/AppChip";
import AppToolbar from "@/components/AppToolbar";
import AppTypography from "@/components/AppTypography";

import { useTranslation } from "next-i18next";
import {
  useAppMomentWithLocale,
  useAppSelector,
  useCountDownTimer,
} from "@/hooks";

import useStyles from "./InboxThreadAiChatStatus.styles";

type InboxThreadAiChatStatusProps = {
  className?: string;
};

const AiChatStatusText = () => {
  const { momentWithLocale } = useAppMomentWithLocale();

  const { t } = useTranslation();

  const $s_inboxThreadOfferAutoReplyStatus = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_switch_status
  );
  const $s_inboxThreadOfferAutoReplyTurnedOffSeconds = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_resume_at ?? 0
  );

  const { minutes, seconds, asSeconds } = useCountDownTimer(
    momentWithLocale($s_inboxThreadOfferAutoReplyTurnedOffSeconds, "X")
  );

  return $s_inboxThreadOfferAutoReplyStatus ===
    inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE || asSeconds <= 1
    ? t("aiChatIsWorking")
    : t("aiChatWillResumeAfterMinute", {
        time: `${minutes >= 10 ? minutes : `0${minutes}`}:${
          seconds >= 10 ? seconds : `0${seconds}`
        }`,
      });
};

const InboxThreadAiChatStatus = (props: InboxThreadAiChatStatusProps) => {
  const { className } = props;

  const { classes, cx } = useStyles();

  return (
    <AppToolbar className={cx(classes.root, className)}>
      <AppChip
        variant="filled"
        color="common.lightestPink"
        textColor="primary.main"
        label={
          <AppTypography
            component="span"
            variant="captionMed12"
            color="inherit"
          >
            <AiChatStatusText />
          </AppTypography>
        }
        classes={{
          root: classes.chip,
          label: classes.chipLabel,
        }}
      />
    </AppToolbar>
  );
};

export default InboxThreadAiChatStatus;
