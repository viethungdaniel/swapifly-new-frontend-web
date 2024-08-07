import { commonConfig } from "@/utils/config";

export const localeToLanguageTitleKeyMap: {
  [locale: string]: string;
} = {
  "en-US": "title_en",
  "zh-HK": "title",
  "zh-CN": "title_cn",
  "ko-KR": "title_ko",
  "ja-JP": "title_ja",
};

export const CS_EMAIL = "swapifly.ga@gmail.com";

export const languages: {
  id: number;
  value: string;
  title: string;
}[] = [
  {
    id: 1,
    value: "zh-HK",
    title: "繁體中文",
  },
  {
    id: 2,
    value: "zh-CN",
    title: "简体中文",
  },
  {
    id: 3,
    value: "en-US",
    title: "English",
  },
  {
    id: 4,
    value: "ja-JP",
    title: "日语",
  },
  {
    id: 5,
    value: "ko-KR",
    title: "한국인",
  },
];

export const settingMenus = [
  {
    code: "EDIT_PROFILE" as const,
    label: "editProfile",
    path: "/user/account/profile",
    activatedPathReg: new RegExp("^/user/account/profile"),
    auth: true,
  },
  {
    code: "CHANGE_PASSWORD" as const,
    label: "changePassword",
    path: "/user/account/change-password",
    activatedPathReg: new RegExp("^/user/account/change-password"),
    auth: true,
  },
  {
    code: "CHANGE_PREFERENCES" as const,
    label: "changePreferences",
    path: "/user/account/change-preferences",
    activatedPathReg: new RegExp("^/user/account/change-preferences"),
    auth: true,
  },
  {
    code: "HELP_CENTER" as const,
    label: "helpCenter",
    path: "/help-center",
    activatedPathReg: new RegExp("^/help-center"),
    auth: false,
  },
  {
    code: "TERMS_AND_CONDITIONS" as const,
    label: "termsAndConditions",
    path: "/terms-of-service",
    activatedPathReg: new RegExp("^/terms-of-service"),
    auth: false,
  },
  {
    code: "PRIVACY_POLICY" as const,
    label: "privacyPolicy",
    path: "/privacy-policy",
    activatedPathReg: new RegExp("^/privacy-policy"),
    auth: false,
  },
];

export const FETCHED_MAXIMUM_PAGE = 5;

export const MAIN_HEADER_ELE_ID = "MainHeader-root";
export const PORTAL_HEADER_ELE_ID = "PortalHeader-root";
export const MAIN_BOTTOM_APP_BAR_TOOLBAR_ELE_CLASS =
  "MainBottomAppBarToolbar-root";
export const FIREBASE_RECAPTCHA_CONTAINER_ANCHOR_ID = `${commonConfig.APP_NAME}-firebase-recaptcha-container`;

export const NAME_TEXT_MIN_LENGTH = 3;
export const NAME_TEXT_MAX_LENGTH = 50;
export const TITLE_TEXT_MIN_LENGTH = 5;
export const TITLE_TEXT_MAX_LENGTH = 200;
export const DESCRIPTION_TEXT_MAX_LENGTH = 1000;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

export const FILE_MAX_SIZE = 2000 * 1000000; // 2000MB
export const VIDEO_FILE_MAX_SIZE = 100 * 1000000; // 100MB
export const IMAGE_FILE_MAX_SIZE = 5 * 1000000; // 5MB
export const videoExtensions = [
  ".mp4",
  ".m4p",
  ".m4v",
  ".webm",
  ".mpg",
  ".mp2",
  ".mpeg",
  ".mpe",
  ".mpv",
  ".ogg",
  ".avi",
  ".wmv",
  ".qt",
  ".flv",
  ".swf",
  ".avchd",
  ".mov",
] as const;
export const imageExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".gif",
  ".jfif",
  ".pjpeg",
  ".pjp",
] as const;
export const otherFileExtensions = [".pdf"] as const;
export const commonFileExtensions = [
  ...videoExtensions,
  ...imageExtensions,
  ...otherFileExtensions,
] as const;

export const firebaseConfig = {
  apiKey: commonConfig.FIREBASE_API_KEY,
  authDomain: commonConfig.FIREBASE_AUTH_DOMAIN,
  databaseURL: commonConfig.FIREBASE_DATABASE_URL,
  projectId: commonConfig.FIREBASE_PROJECT_ID,
  storageBucket: commonConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: commonConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: commonConfig.FIREBASE_APP_ID,
  measurementId: commonConfig.FIREBASE_MEASUREMENT_ID,
};

export const FIREBASE_NOTIFICATION_NORMAL_NOTICE_TYPE = "NORMAL_NOTICE";
export const FIREBASE_NOTIFICATION_INBOX_NOTICE_TYPE = "INBOX_NOTICE";

export const COMMON_QUERY_APP_ACTION_PURCHASE_VISITS = "purchase_visits";
