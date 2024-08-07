import AppButton from "@/components/AppButton";

import { useContext } from "react";
import { useTranslation } from "next-i18next";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

const DeleteButton = () => {
  const { selectedInboxThreadIds, deleteInboxThread } =
    useContext(InboxSlugContext);

  const { t } = useTranslation();

  const handleInboxThreadDelete = () => {
    deleteInboxThread({
      inboxThreadIds: selectedInboxThreadIds,
      closeInboxThreadSelectableOnChange: true,
    });
  };

  return (
    <AppButton
      variant="outlined"
      size="small"
      color="primary"
      edge="y"
      noWrap
      disabled={selectedInboxThreadIds.length < 1}
      onClick={handleInboxThreadDelete}
    >
      {t("delete")}
    </AppButton>
  );
};

export default DeleteButton;
