import { inboxConstants } from "@/utils/constants";

export const isInboxThreadArchivedType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_ARCHIVED_TYPE === type;
};

export const isInboxThreadMessageContentImageType = (contentType?: number) => {
  return inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_IMAGE_TYPE === contentType;
};
export const isInboxThreadMessageContentTextType = (contentType?: number) => {
  return inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE === contentType;
};

//

export const isInboxThreadNormalMessageType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_NORMAL_MESSAGE_TYPE === type;
};
export const isInboxThreadCreatedOfferMessageType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_CREATED_OFFER_MESSAGE_TYPE === type;
};
export const isInboxThreadUpdatedOfferMessageType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_UPDATED_OFFER_MESSAGE_TYPE === type;
};
export const isInboxThreadDeclinedOfferMessageType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_DECLINED_OFFER_MESSAGE_TYPE === type;
};
export const isInboxThreadCancelledOfferMessageType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_CANCELLED_OFFER_MESSAGE_TYPE === type;
};
export const isInboxThreadAcceptedOfferMessageType = (type?: number) => {
  return inboxConstants.INBOX_THREAD_ACCEPTED_OFFER_MESSAGE_TYPE === type;
};

//

export const isInboxThreadOfferNormalOfferStatus = (offerStatus?: number) => {
  return inboxConstants.INBOX_THREAD_OFFER_NORMAL_OFFER_STATUS === offerStatus;
};
export const isInboxThreadOfferCreatedOfferStatus = (offerStatus?: number) => {
  return inboxConstants.INBOX_THREAD_OFFER_CREATED_OFFER_STATUS === offerStatus;
};
export const isInboxThreadOfferAcceptedOfferStatus = (offerStatus?: number) => {
  return (
    inboxConstants.INBOX_THREAD_OFFER_ACCEPTED_OFFER_STATUS === offerStatus
  );
};
export const isInboxThreadOfferDeclinedOfferStatus = (offerStatus?: number) => {
  return (
    inboxConstants.INBOX_THREAD_OFFER_DECLINED_OFFER_STATUS === offerStatus
  );
};

//

export const isSeller = (userType?: string) => {
  return userType === "seller";
};
export const isBuyer = (userType?: string) => {
  return userType === "buyer";
};

//

export const isThreadMessageAI = (contentFromType?: number) => {
  return contentFromType === inboxConstants.INBOX_THREAD_MESSAGE_AI_FROM_TYPE;
};
