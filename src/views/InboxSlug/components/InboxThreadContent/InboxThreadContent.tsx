import InboxThreadEmpty from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadEmpty";
import InboxThreadTopBar from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadTopBar";
import InboxThreadBottomBar from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadBottomBar";
import InboxThreadMessageList from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadMessageList";
import LoadingOverlay from "@/components/LoadingOverlay";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

import { useAppSelector } from "@/hooks";
import { useContext } from "react";

import useStyles from "./InboxThreadContent.styles";

const InboxThreadContent = () => {
  const { inboxThreadContentShow } = useContext(InboxSlugContext);

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );

  const $s_inboxThreadsLoading = useAppSelector(
    (state) => state.inbox.inboxThreadOfferLoading
  );
  const $s_inboxThreadsError = useAppSelector(
    (state) => state.inbox.inboxThreadOfferError
  );

  const isLoading = $s_inboxThreadsLoading || !!$s_inboxThreadsError;

  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      {(!$s_selectedInboxThreadId || !inboxThreadContentShow) && (
        <InboxThreadEmpty />
      )}
      {!!$s_selectedInboxThreadId && inboxThreadContentShow && (
        <>
          <LoadingOverlay
            className={classes.loadingOverlay}
            loading={isLoading}
          >
            <InboxThreadTopBar />
            <div className={classes.inboxThreadMessageBodyContainer}>
              <InboxThreadMessageList />
            </div>
            <InboxThreadBottomBar />
          </LoadingOverlay>
        </>
      )}
    </div>
  );
};

export default InboxThreadContent;
