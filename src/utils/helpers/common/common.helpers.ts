import { commonConstants } from "@/utils/constants";
import { toast } from "react-toastify";
import { commonConfig } from "@/utils/config";
import _capitalize from "lodash/capitalize";
import _camelCase from "lodash/camelCase";
import _uniqueId from "lodash/uniqueId";
import _kebabCase from "lodash/kebabCase";
import _round from "lodash/round";
import parser from "ua-parser-js";

import type { GetServerSidePropsContext } from "next";

export const isMobile = () => {
  return (
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

export const getPhoneModel = () => {
  if (typeof window !== "undefined" && /Android/i.test(navigator.userAgent))
    return "android";

  if (typeof window !== "undefined" && /iPhone/i.test(navigator.userAgent))
    return "iPhone";

  if (typeof window !== "undefined" && /iPad/i.test(navigator.userAgent))
    return "iPad";

  if (typeof window !== "undefined" && /BlackBerry/i.test(navigator.userAgent))
    return "blackBerry";

  return "";
};

export const isIOS = () => {
  return (
    typeof window !== "undefined" &&
    ([
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
      navigator.userAgent.includes("Mac"))
  );
};

export const getMobileOperatingSystem = () => {
  if (typeof window === "undefined") return null;

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/windows phone/i.test(userAgent)) {
    return "WINDOW_PHONE";
  }

  if (/android/i.test(userAgent)) {
    return "ANDROID";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) || userAgent.includes("Mac")) {
    return "IOS";
  }

  return null;
};

export const isEmpty = (value: any) => {
  return (
    ["", null, undefined].includes(value) ||
    (Array.isArray(value) && value.length === 0)
  );
};

export const isSomeEmpty = (values: any[]) => {
  return Array.isArray(values)
    ? values.some((val) => {
        return isEmpty(val);
      })
    : false;
};

export const isEveryEmpty = (values: any[]) => {
  return Array.isArray(values)
    ? values.every((val) => {
        return isEmpty(val);
      })
    : false;
};

export const isNumber = (number: any) => {
  return !isEmpty(number) && !isNaN(Number(number));
};

export const isUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export const formatNumber = (
  number?: number | string,
  options?: Intl.NumberFormatOptions
) => {
  if (!isNumber(number)) return number;
  const locale = window.NextPublic.lang;
  return new Intl.NumberFormat(locale, options).format(Number(number));
};

export const decodeHTML = (input: string) => {
  const e = document.createElement("textarea");
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue || "";
};

export const formatFormData = (data: Object) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "undefined") return;
    if (Array.isArray(value) && value.some((v) => v instanceof File)) {
      fd.append(`${key}[]`, value as any);
    } else {
      fd.append(
        key,
        typeof value === "string" || value instanceof File
          ? value
          : JSON.stringify(value)
      );
    }
  });
  return fd;
};

export const checkAndNoticeToastError = (error: string, loading: boolean) => {
  if (!!error && !loading) toast.error(error);
};

export const parseJSS = (stringStyles: string | React.CSSProperties) =>
  typeof stringStyles === "string"
    ? stringStyles.split(";").reduce((acc, style) => {
        const colonPosition = style.indexOf(":");

        if (colonPosition === -1) {
          return acc;
        }

        const camelCaseProperty = style
          .substr(0, colonPosition)
          .trim()
          .replace(/^-ms-/, "ms-")
          .replace(/-./g, (c) => c.substr(1).toUpperCase());
        let value = style.substr(colonPosition + 1).trim();

        return value ? { ...acc, [camelCaseProperty]: value } : acc;
      }, {})
    : {};

export const isBooleanNumber = (value: any) => {
  return ["0", "1", 0, 1].includes(value);
};

export const prepareRequestParams = <Data = {}>(
  data: Data,
  options?: { enableClearEmptyValue?: boolean }
) => {
  const newData = { ...data } as any;
  Object.keys(newData).forEach((key) => {
    if (
      newData[key] == null ||
      (!!options?.enableClearEmptyValue && isEmpty(newData[key]))
    ) {
      delete newData[key];
    }
  });
  return newData as Data;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatBytes = (bytes: number, decimals: number = 2) => {
  if (!+bytes) return "0 bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "Kb", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getURL = (path: string) => {
  const baseURL =
    typeof window === "undefined"
      ? commonConfig.BASE_URL
      : window.location.origin;
  return new URL(path, baseURL).toString();
};

export const generateClassName = (
  sheetName: string,
  ruleName: string,
  identifier?: string
) => {
  return `${_capitalize(commonConfig.APP_CACHE_KEY)}${_capitalize(
    _camelCase(sheetName)
  )}-${_camelCase(ruleName)}${!isEmpty(identifier) ? `-${identifier}` : ""}`;
};

export const getTitleByLanguage = (item: any = {} as any, language: string) => {
  return (
    (item?.[
      commonConstants.localeToLanguageTitleKeyMap[language] as keyof typeof item
    ] as string) || ""
  );
};

export const generateUniqueId = _uniqueId;

export const generateSlug = (slug?: string, suffix?: string | number) => {
  const kebabCaseSlug = _kebabCase(slug ?? "");
  const suffixLengthCount = !isEmpty(suffix) ? String(suffix).length + 1 : 0;
  return `${kebabCaseSlug.slice(0, 60 - suffixLengthCount)}${
    !isEmpty(suffix) ? `-${suffix}` : ""
  }`;
};

export const generateProductSlug = (
  productName?: string,
  productId?: string | number
) => {
  return generateSlug(productName, `p${productId}`);
};

export const generateProductCategorySlug = (
  productCategoryName?: string,
  productCategoryId?: string | number
) => {
  return generateSlug(productCategoryName, `c${productCategoryId}`);
};

export const generateUserSlug = <
  User extends {
    id?: string | number;
    username?: string;
    nickname?: string;
    realname?: string;
    [x: string]: any;
  } | null
>(
  user?: User
) => {
  if (!!user?.username) return user.username;
  const slug = user?.nickname;
  const suffix = user?.id;
  const kebabCaseSlug = _kebabCase(slug ?? "");
  const suffixLengthCount = !isEmpty(suffix) ? String(suffix).length + 1 : 0;
  return `${kebabCaseSlug.slice(0, 60 - suffixLengthCount)}${
    !isEmpty(suffix) ? `#${suffix}` : ""
  }`
    .replaceAll("-", ".")
    .replaceAll("#", "-");
};

export const getSlugId = (slug?: string) => {
  const splittedSlugs = (slug || "").split("-");
  if (splittedSlugs.length < 2) return null;
  const id = splittedSlugs.reverse()[0];
  return isNumber(id) ? parseInt(id) : null;
};

export const getUserSlugId = (slug?: string) => {
  const splittedSlugs = (slug || "").split("-");
  if (splittedSlugs.length < 2) return null;
  const id = splittedSlugs.reverse()[0];
  return isNumber(id) ? parseInt(id) : null;
};

export const getProductSlugId = (slug?: string) => {
  const splittedSlugs = (slug || "").split("-");
  if (splittedSlugs.length < 2) return null;
  const id = splittedSlugs.reverse()[0];
  if (id.charAt(0) !== "p") return null;
  return isNumber(id.replace(/^p/, "")) ? parseInt(id.replace(/^p/, "")) : null;
};

export const getProductCategorySlugId = (slug?: string) => {
  const splittedSlugs = (slug || "").split("-");
  if (splittedSlugs.length < 2) return null;
  const id = splittedSlugs.reverse()[0];
  if (id.charAt(0) !== "c") return null;
  return isNumber(id.replace(/^c/, "")) ? parseInt(id.replace(/^c/, "")) : null;
};

export const encodeURIComponentQueryItem = (
  name?: string,
  value?: string | number
) => {
  return encodeURIComponent(`${name}:${value}`);
};

export const decodeURIComponentQueryItem = (queryValue: string) => {
  const decodedQueryValue = decodeURIComponent(queryValue).split(":");
  return [decodedQueryValue[0] ?? "", decodedQueryValue[1] ?? ""];
};

export const getOneRouterQueryValue = (queryValue: any) => {
  return Array.isArray(queryValue)
    ? [...queryValue].reverse()?.[0] ?? ""
    : queryValue;
};

export const getQueryItems = (queryValue?: string | string[]) => {
  const queryValues = Array.isArray(queryValue)
    ? queryValue
    : !isEmpty(queryValue)
    ? [queryValue!]
    : [];
  const items = [] as { name: string; value: any }[];
  queryValues.forEach((item) => {
    const [name, value] = decodeURIComponentQueryItem(item);
    if (isEmpty(value)) return;
    items.push({
      name,
      value,
    });
  });
  return items;
};

export const downloadFiles = async (
  images:
    | {
        src: string;
        name?: string;
      }[]
    | {
        src: string;
        name?: string;
      }
) => {
  const _images = Array.isArray(images) ? images : [images];

  const preparedImages = _images.map((img) => {
    let name = img.name;
    if (!name) {
      name = img.src.split("/").reverse()[0];
    }
    return {
      src: img.src,
      name,
    };
  });

  try {
    for (const preparedImage of preparedImages) {
      const response = await fetch(preparedImage.src);

      const blobImage = await response.blob();

      const href = URL.createObjectURL(blobImage);

      const anchorElement = document.createElement("a");
      anchorElement.href = href;
      anchorElement.download = preparedImage.name;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    }
  } catch (error: any) {
    const message = error?.response?.data || error.message;
    return {
      status: false,
      message,
    };
  }

  return {
    status: true,
  };
};

export const encodeBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const decodeBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str, "base64").toString("ascii")
    : window.atob(str);

export const filePathLoader = (path?: string) => {
  return !!path ? `${commonConfig.CDN_HOST}${path ?? ""}` : "";
};

export const parseStyles = (stringStyles: string | React.CSSProperties) =>
  typeof stringStyles === "string"
    ? stringStyles.split(";").reduce((acc, style) => {
        const colonPosition = style.indexOf(":");

        if (colonPosition === -1) {
          return acc;
        }

        const camelCaseProperty = style
            .substr(0, colonPosition)
            .trim()
            .replace(/^-ms-/, "ms-")
            .replace(/-./g, (c) => c.substr(1).toUpperCase()),
          value = style.substr(colonPosition + 1).trim();

        return value ? { ...acc, [camelCaseProperty]: value } : acc;
      }, {})
    : {};

export const isYoutubeUrl = (youtubeUrl?: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  const match = (youtubeUrl ?? "").match(regExp);
  return !!match && match[2].length == 11;
};

export const formatYoutubeUrl = (youtubeUrl?: string) => {
  if (!isYoutubeUrl(youtubeUrl)) return youtubeUrl;
  return (youtubeUrl ?? "").replace(/shorts\//, "embed/");
};

export const serverSideAppSettings = async (
  ctx?: GetServerSidePropsContext
) => {
  const deviceType = !!ctx?.req
    ? parser(ctx.req.headers["user-agent"]).device.type || "desktop"
    : "desktop";

  return {
    deviceType,
  };
};

export const validateUrl = (url?: string) => {
  try {
    return !!new URL(url!);
  } catch {}
  return false;
};

export const validateDomain = (domain?: string) => {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
    domain ?? ""
  );
};

export const parseHtmlWithUrl = (str: string) => {
  const restrictedUrlRegex =
    /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(?:com|org|net|edu|gov|mil|int|biz|info|tv|io|me|co|uk|jp|au|ca|de|fr|it|es|nl|se|ch|at|eu|ru|cn|in|br|mx|ar|za|eg|ng)\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*))/gm;

  return str.replace(restrictedUrlRegex, (matched) => {
    let newMatched = matched;
    const urlPrefixExisted = ["https:", "http:", "www."].some((keyWord) =>
      matched.includes(keyWord)
    );
    if (!urlPrefixExisted) {
      newMatched = `//www.${matched}`;
    }
    const urlHtml = `<a href="${newMatched}">${matched}</a>`;
    return urlHtml;
  });
};

export const generateProductDeepLink = (productId: number) => {
  return `${commonConfig.DEEPLINK_SCHEME}://page/product/${productId}`;
};

export const generateUserProfileDeepLink = (userId: number) => {
  return `${commonConfig.DEEPLINK_SCHEME}://page/user/${userId}`;
};
