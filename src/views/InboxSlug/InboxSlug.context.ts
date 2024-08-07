import { createContext } from "react";

import type { GalleryDialogProps } from "@/components/GalleryDialog";

export type InboxSlugContextValue = {
  inboxThreadContentShow: boolean;
  selectedInboxThreadIds: number[];
  inboxThreadSelectable: boolean;
  inboxThreadContentDrawerOpen: boolean;
  offerCreateFormModalOpen: boolean;
  offerUpdateFormModalOpen: boolean;
  inboxThreadReviewsFormDialogOpen: boolean;
  aiChatUserListTurnOffDialogOpen: boolean;
  aiChatUserListTurnOnDialogOpen: boolean;
  turnOffInboxThreadAiChatUsers: (payload: {
    userIds: number[];
    seconds: number;
  }) => void;
  turnOnInboxThreadAiChatUsers: (payload: { userIds: number[] }) => void;
  openAiChatUserListTurnOffDialog: () => void;
  closeAiChatUserListTurnOffDialog: () => void;
  openAiChatUserListTurnOnDialog: () => void;
  closeAiChatUserListTurnOnDialog: () => void;
  openInboxThreadContentShow: () => void;
  closeInboxThreadContentShow: () => void;
  deleteInboxThread: (payload: {
    inboxThreadIds: number[];
    closeInboxThreadSelectableOnChange?: boolean;
  }) => void;
  openGalleryDialog: (payload: {
    items: GalleryDialogProps["items"];
    selectedItemIndex?: number;
  }) => void;
  addSelectedInboxThreadId: (inboxId: number) => void;
  removeSelectedInboxThreadId: (inboxId: number) => void;
  openInboxThreadSelectable: () => void;
  closeInboxThreadSelectable: () => void;
  removeAllSelectedInboxThreadId: () => void;
  changeSelectedInboxThreadId: (inboxThreadId: number) => void;
  closeInboxThreadContentDrawer: () => void;
  openOfferCreateFormModal: () => void;
  closeOfferCreateFormModal: () => void;
  openOfferUpdateFormModal: () => void;
  closeOfferUpdateFormModal: () => void;
  cancelInboxOffer: () => void;
  acceptInboxOffer: () => void;
  declineInboxOffer: () => void;
  changeInboxThreadBlocked: (payload: { isBlocked: boolean }) => void;
  changeInboxThreadArchived: (payload: {
    isArchived: boolean;
    inboxThreadIds: number[];
    closeInboxThreadSelectableOnChange?: boolean;
  }) => void;
  openInboxThreadReviewsFormDialog: () => void;
  closeInboxThreadReviewsFormDialog: () => void;
};

const InboxSlugContext = createContext<InboxSlugContextValue>(null!);

export default InboxSlugContext;
