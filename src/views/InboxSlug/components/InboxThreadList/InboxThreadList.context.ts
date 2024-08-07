import { createContext } from "react";

export type InboxThreadListContextValue = {
  changeInboxThreadItemSize: (index: number, size: number) => void;
  changeInboxThreadsType: (newInboxType: number) => void;
};

const InboxThreadListContext = createContext<InboxThreadListContextValue>(
  null!
);

export default InboxThreadListContext;
