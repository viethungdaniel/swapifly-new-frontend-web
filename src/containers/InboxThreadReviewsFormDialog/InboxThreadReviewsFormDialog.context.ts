import { createContext } from "react";

export type InboxThreadReviewsFormDialogContextValue = {
  open?: boolean;
  onClose?: Function;
};

const InboxThreadReviewsFormDialogContext =
  createContext<InboxThreadReviewsFormDialogContextValue>(null!);

export default InboxThreadReviewsFormDialogContext;
