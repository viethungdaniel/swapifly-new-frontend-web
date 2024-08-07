import { createContext } from "react";

export type AiChatUserListTurnOnDialogContextValue = {
  inboxThreadOfferProductAiChatUsersLoading: boolean;
  selectedInboxThreadOfferProductAiChatUserIds: number[];
  changeUserItemSize: (index: number, size: number) => void;
  toggleInboxThreadOfferProductAiChatUserId: (
    inboxThreadOfferProductAiChatUserId: number
  ) => void;
  addAllInboxThreadOfferProductAiChatUserIds: () => void;
  removeAllInboxThreadOfferProductAiChatUserIds: () => void;
};

const AiChatUserListTurnOnDialogContext =
  createContext<AiChatUserListTurnOnDialogContextValue>(null!);

export default AiChatUserListTurnOnDialogContext;
