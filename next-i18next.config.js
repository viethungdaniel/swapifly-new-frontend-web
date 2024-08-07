module.exports = {
  i18n: {
    locales: ["en-US", "zh-HK", "zh-CN", "ko-KR", "ja-JP"],
    defaultLocale: "en-US",
  },
  fallbackLng: {
    default: ["en-us", "en"],
    "zh-HK": ["zh-hk", "hk"],
    "zh-CN": ["zh-cn", "cn"],
    "ko-KR": ["ko-KR", "ko"],
    "ja-JP": ["ja-jp", "ja"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
