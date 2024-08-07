import { inboxHelpers } from "@/utils/helpers";

import AppButton from "@/components/AppButton";

import { useContext } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

const ArchiveButton = () => {
  const { selectedInboxThreadIds, changeInboxThreadArchived } =
    useContext(InboxSlugContext);

  const { t } = useTranslation();

  const $s_inboxThreadType = useAppSelector(
    (state) => state.inbox.selectedInboxThreadType
  );

  const handleInboxThreadArchivedChange = () => {
    changeInboxThreadArchived({
      inboxThreadIds: selectedInboxThreadIds,
      isArchived: !inboxHelpers.isInboxThreadArchivedType($s_inboxThreadType!),
      closeInboxThreadSelectableOnChange: true,
    });
  };

  return (
    <AppButton
      variant="outlined"
      size="small"
      color="text.primary"
      edge="y"
      noWrap
      disabled={selectedInboxThreadIds.length < 1}
      onClick={handleInboxThreadArchivedChange}
    >
      {t(
        inboxHelpers.isInboxThreadArchivedType($s_inboxThreadType!)
          ? "unarchive"
          : "archive"
      )}
    </AppButton>
  );
};

export default ArchiveButton;
