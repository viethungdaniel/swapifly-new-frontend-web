import { createContext } from "react";

export type AiChatUserListTurnOffDialogContextValue = {
  inboxThreadOfferProductAiChatUsersLoading: boolean;
  selectedInboxThreadOfferProductAiChatUserIds: number[];
  changeUserItemSize: (index: number, size: number) => void;
  toggleInboxThreadOfferProductAiChatUserId: (
    inboxThreadOfferProductAiChatUserId: number
  ) => void;
  addAllInboxThreadOfferProductAiChatUserIds: () => void;
  removeAllInboxThreadOfferProductAiChatUserIds: () => void;
};

const AiChatUserListTurnOffDialogContext =
  createContext<AiChatUserListTurnOffDialogContextValue>(null!);

export default AiChatUserListTurnOffDialogContext;
