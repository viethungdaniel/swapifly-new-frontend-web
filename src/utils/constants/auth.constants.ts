export const AUTH = "";

export const PENDING_STATE_ID = 0;
export const VERIFIED_STATE_ID = 1;
export const REJECTED_STATE_ID = 2;

export const stateIdToLabelMap: { [id: string]: string } = {
  [PENDING_STATE_ID]: "pending",
  [VERIFIED_STATE_ID]: "verified",
  [REJECTED_STATE_ID]: "rejected",
};

export const AUTH_LOGIN_CALLBACK_WECHAT_NEW_USER_ERROR_MESSAGE =
  "AUTH_LOGIN_CALLBACK_WECHAT_NEW_USER_ERROR_MESSAGE";
