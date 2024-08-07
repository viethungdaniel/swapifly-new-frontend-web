export const INBOX_THREAD_AI_CHAT_ON_TYPE = "on";
export const INBOX_THREAD_AI_CHAT_OFF_TYPE = "off";
export const INBOX_THREAD_AI_CHAT_DISABLED_TYPE = "disable";

export const INBOX_THREAD_ALL_TYPE = 0;
export const INBOX_THREAD_ON_SELL_TYPE = 1;
export const INBOX_THREAD_UNDER_PURCHASE_TYPE = 2;
export const INBOX_THREAD_ARCHIVED_TYPE = 3;

export const INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE = 0;
export const INBOX_THREAD_MESSAGE_CONTENT_IMAGE_TYPE = 1;

export const INBOX_THREAD_NORMAL_MESSAGE_TYPE = 0;
export const INBOX_THREAD_CREATED_OFFER_MESSAGE_TYPE = 1;
export const INBOX_THREAD_UPDATED_OFFER_MESSAGE_TYPE = 2;
export const INBOX_THREAD_CANCELLED_OFFER_MESSAGE_TYPE = 3;
export const INBOX_THREAD_DECLINED_OFFER_MESSAGE_TYPE = 4;
export const INBOX_THREAD_ACCEPTED_OFFER_MESSAGE_TYPE = 5;

export const INBOX_THREAD_OFFER_NORMAL_OFFER_STATUS = 0;
export const INBOX_THREAD_OFFER_CREATED_OFFER_STATUS = 1;
export const INBOX_THREAD_OFFER_ACCEPTED_OFFER_STATUS = 2;
export const INBOX_THREAD_OFFER_DECLINED_OFFER_STATUS = 3;

export const INBOX_THREAD_CONTENT_TEXT_TYPE = 0;
export const INBOX_THREAD_CONTENT_IMAGE_TYPE = 1;

export const INBOX_THREAD_MESSAGE_NORMAL_FROM_TYPE = 1;
export const INBOX_THREAD_MESSAGE_AI_FROM_TYPE = 2;

export const INBOX_THREAD_OFFER_PRODUCT_TEN_MINUTE_AI_CHAT_TURN_OFF_SECONDS =
  60 * 10;
export const INBOX_THREAD_OFFER_PRODUCT_TWENTY_MINUTE_AI_CHAT_TURN_OFF_SECONDS =
  60 * 20;
export const INBOX_THREAD_OFFER_PRODUCT_THIRTY_MINUTE_AI_CHAT_TURN_OFF_SECONDS =
  60 * 30;

export const inboxThreadOfferProductAiChatTurnOffTimeOptions = [
  INBOX_THREAD_OFFER_PRODUCT_TEN_MINUTE_AI_CHAT_TURN_OFF_SECONDS,
  INBOX_THREAD_OFFER_PRODUCT_TWENTY_MINUTE_AI_CHAT_TURN_OFF_SECONDS,
  INBOX_THREAD_OFFER_PRODUCT_THIRTY_MINUTE_AI_CHAT_TURN_OFF_SECONDS,
];

export const inboxThreadTypeToInboxTypeLabelMap: {
  [type: number]: string;
} = {
  [INBOX_THREAD_ALL_TYPE]: "inbox",
  [INBOX_THREAD_ON_SELL_TYPE]: "onSell",
  [INBOX_THREAD_UNDER_PURCHASE_TYPE]: "underPurchase",
  [INBOX_THREAD_ARCHIVED_TYPE]: "archived",
};

export const inboxThreadMessageTypeToInboxThreadMessageStateItemMap: {
  [type: number]: {
    label: string;
    color: AppThemeColor;
    textColor: AppThemeColor;
  };
} = {
  [INBOX_THREAD_ACCEPTED_OFFER_MESSAGE_TYPE]: {
    label: "accepted",
    color: "success.main",
    textColor: "success.contrastText",
  },
  [INBOX_THREAD_DECLINED_OFFER_MESSAGE_TYPE]: {
    label: "declined",
    color: "error.main",
    textColor: "error.contrastText",
  },
};

export const inboxThreadTypes = Object.entries(
  inboxThreadTypeToInboxTypeLabelMap
).map(([value, label]) => ({
  value: Number(value),
  label,
}));
