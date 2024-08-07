import { createContext, useRef } from "react";

export type InboxThreadMessageListContextValue = {
  inboxRefreshing: boolean;
  inboxThreadMessagesRefreshing: boolean;
  isScrolledBottom: boolean;
  inboxThreadAITyping: boolean;
  inboxAITypingLabelIndex: number;
  inboxThreadMessagesLoading: boolean;
  inboxThreadMessageListEndAnchorRef: ReturnType<typeof useRef>;
  changeInboxThreadMessageItemSize: (index: number, size: number) => void;
  scrollInboxThreadMessageListBottom: (options?: { forced?: boolean }) => void;
  getInboxThreadMessageIndex: (variableSizeListIndex: number) => number;
};

const InboxThreadMessageListContext =
  createContext<InboxThreadMessageListContextValue>(null!);

export default InboxThreadMessageListContext;
