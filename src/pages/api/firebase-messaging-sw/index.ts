import { commonConfig } from "@/utils/config";
import {
  appBroadcastChannelConstants,
  commonConstants,
  notificationConstants,
} from "@/utils/constants";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const scriptTextt = `importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);
importScripts("/js/libs/lodash@4.17.15/lodash.min.js");

const appConfig = {
  baseUrl: "${commonConfig.BASE_URL}",
  notification: {
    textType: "${notificationConstants.NOTIFICATION_TEXT_TYPE}",
    urlType: "${notificationConstants.NOTIFICATION_URL_TYPE}",
    relatedContentType: "${notificationConstants.NOTIFICATION_RELATED_CONTENT_TYPE}",
    relatedContentUserRelatedType: "${notificationConstants.NOTIFICATION_RELATED_CONTENT_USER_RELATED_TYPE}",
    relatedContentProductRelatedType: "${notificationConstants.NOTIFICATION_RELATED_CONTENT_PRODUCT_RELATED_TYPE}",
    relatedContentNewsItemRelatedType: "${notificationConstants.NOTIFICATION_RELATED_CONTENT_NEWS_ITEM_RELATED_TYPE}",
    relatedContentHelpCenterRelatedType: "${notificationConstants.NOTIFICATION_RELATED_CONTENT_HELP_CENTER_RELATED_TYPE}",
    relatedContentProductsRelatedType: "${notificationConstants.NOTIFICATION_RELATED_CONTENT_PRODUCTS_RELATED_TYPE}",
  },
};

const isEmpty = (value) => {
  return (
    ["", null, undefined].includes(value) ||
    (Array.isArray(value) && value.length === 0)
  );
};

const generateSlug = (slug, suffix) => {
  const kebabCaseSlug = _.kebabCase(slug);
  const suffixLengthCount = !isEmpty(suffix) ? String(suffix).length + 1 : 0;
  return \`\${kebabCaseSlug.slice(0, 60 - suffixLengthCount)}\${
    !isEmpty(suffix) ? \`-\${suffix}\` : ""
  }\`;
};

const generateUserSlug = (user) => {
  if (!!user?.username) return user.username;
  const slug = user?.nickname;
  const suffix = user?.id;
  const kebabCaseSlug = _.kebabCase(slug);
  const suffixLengthCount = !isEmpty(suffix) ? String(suffix).length + 1 : 0;
  return \`\${kebabCaseSlug.slice(0, 60 - suffixLengthCount)}\${
    !isEmpty(suffix) ? \`#\${suffix}\` : ""
  }\`
    .replaceAll("-", ".")
    .replaceAll("#", "-");
};

const generateProductSlug = (productName, productId) => {
  return generateSlug(productName, \`p\${productId}\`);
};

const isNotificationText = (notificationType) => {
  return notificationType === appConfig?.notification?.textType;
};
const isNotificationUrl = (notificationType) => {
  return notificationType === appConfig?.notification?.urlType;
};
const isNotificationRelatedContent = (notificationType) => {
  return notificationType === appConfig?.notification?.relatedContentType;
};

const isNotificationRelatedContentUser = (notificationRelatedType) => {
  return (
    notificationRelatedType ===
    appConfig?.notification?.relatedContentUserRelatedType
  );
};

const isNotificationRelatedContentProduct = (notificationRelatedType) => {
  return (
    notificationRelatedType ===
    appConfig?.notification?.relatedContentProductRelatedType
  );
};

const isNotificationRelatedContentProducts = (notificationRelatedType) => {
  return (
    notificationRelatedType ===
    appConfig?.notification?.relatedContentProductsRelatedType
  );
};

const isNotificationRelatedContentNewsItem = (notificationRelatedType) => {
  return (
    notificationRelatedType ===
    appConfig?.notification?.relatedContentNewsItemRelatedType
  );
};

const isNotificationRelatedContentHelpCenter = (notificationRelatedType) => {
  return (
    notificationRelatedType ===
    appConfig?.notification?.relatedContentHelpCenterRelatedType
  );
};

const getNotificationRouterLocation = (notificationData) => {
  const {
    related_value_item: encodedRelatedValueItem,
    msg,
    id,
    related_type,
    notice_type,
    chat_value: encodedChatValue,
    url,
    type,
  } = notificationData || {};

  let relatedValueItem = {};
  let chatValueItem = {};
  try {
    relatedValueItem = JSON.parse(encodedRelatedValueItem);
  } catch {}
  try {
    chatValueItem = JSON.parse(encodedChatValue);
  } catch {}

  const baseUrl = (appConfig?.baseUrl ?? "").replace(/\\/*$/, "");

  if (notice_type === "${commonConstants.FIREBASE_NOTIFICATION_INBOX_NOTICE_TYPE}") {
    return {
      baseUrl,
      pathname: \`/inbox/\${chatValueItem?.thread_id}\`,
      search: "",
      query: {},
      url: "",
    };
  }

  if (isNotificationText(type)) {
    return {
      baseUrl,
      pathname: \`/notifications/\${generateSlug(msg, id)}\`,
      search: "",
      query: {},
      url: "",
    };
  }

  if (isNotificationUrl(type)) {
    return {
      baseUrl,
      pathname: "",
      search: "",
      query: {},
      url,
    };
  }

  if (isNotificationRelatedContent(type)) {
    if (isNotificationRelatedContentUser(related_type)) {
      return {
        baseUrl,
        pathname: \`/\${generateUserSlug(relatedValueItem)}\`,
        search: "",
        query: {},
        url: "",
      };
    }
    if (isNotificationRelatedContentProduct(related_type)) {
      return {
        baseUrl,
        pathname: \`/\${generateProductSlug(
          relatedValueItem?.title,
          relatedValueItem?.id
        )}\`,
        search: "",
        query: {},
        url: "",
      };
    }
    if (isNotificationRelatedContentProducts(related_type)) {
      const queryItem = {
        product_category: relatedValueItem?.category_id,
        brand: Array.isArray(relatedValueItem?.brand_ids)
          ? relatedValueItem?.brand_ids
          : relatedValueItem?.brand_id
          ? [relatedValueItem?.brand_id]
          : [],
        is_post_courier: relatedValueItem?.by_post_and_courier,
        is_trade_in_person: relatedValueItem?.trade_in_person,
        max_price: relatedValueItem?.max_price,
        min_price: relatedValueItem?.min_price,
        product_condition: Array.isArray(relatedValueItem?.product_conditions)
          ? relatedValueItem?.product_conditions
          : [],
        merchant_location: Array.isArray(relatedValueItem?.merchant_location_ids)
          ? relatedValueItem?.merchant_location_ids
          : [],
        user: Array.isArray(relatedValueItem?.merchant_ids)
          ? relatedValueItem?.merchant_ids
          : [],
        product_sort: relatedValueItem?.sort_id,
      }

      Object.entries(queryItem).forEach(([key, value]) => {
        if (isEmpty(value)) delete queryItem[key];
      });

      const urlParams = new URLSearchParams();

      Object.entries(queryItem).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            urlParams.append(key, val);
          })
        } else {
          urlParams.append(key, value);
        }
      });

      return {
        baseUrl,
        pathname: \`/search\`,
        search: \`?\${urlParams.toString()}\`,
        query: queryItem,
        url: "",
      };
    }
    if (isNotificationRelatedContentNewsItem(related_type)) {
      return {
        baseUrl,
        pathname: \`/news/\${generateSlug(
          relatedValueItem?.title,
          relatedValueItem?.id
        )}\`,
        url: "",
      };
    }
    if (isNotificationRelatedContentHelpCenter(related_type)) {
      return {
        baseUrl,
        pathname: \`/help-center/\${generateSlug(
          relatedValueItem?.title,
          relatedValueItem?.id
        )}\`,
        url: "",
      };
    }
  }
  return {
    baseUrl,
    pathname: "/",
    url: "",
  };
};

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const eventData = event.notification.data.FCM_MSG.data;
  const routerLocation = getNotificationRouterLocation(eventData);
  
  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: "window",
      })
      .then((windowClients) => {
        const channel = new BroadcastChannel(
          "${appBroadcastChannelConstants.FIREBASE_NOTIFICATION_CLICK_CHANNEL_NAME}"
        );
        if (!routerLocation.url) {
          for (const client of windowClients) {
            const linkUrl = new URL(client.url);
            if (
              linkUrl.origin === routerLocation.baseUrl &&
              linkUrl.pathname === routerLocation.pathname &&
              "focus" in client
            ) {
              channel.postMessage({
                payload: event.notification.data?.FCM_MSG,
                routerLocation,
              });
              return client.focus();
            }
          }
        }
        if (clients.openWindow) {
          channel.postMessage({
            payload: event.notification.data?.FCM_MSG,
            routerLocation,
          });
          const routerLocationFullUrl = \`\${routerLocation.baseUrl ?? ""}\${
            routerLocation.pathname ?? ""
          }\${routerLocation.search ?? ""}\`;
          return clients.openWindow(
            routerLocation.url || routerLocationFullUrl
          );
        }
      })
      .catch(() => {})
  );
});

const defaultFirebaseConfig = {
  apiKey: "***",
  authDomain: "***.firebaseapp.com",
  databaseURL: "https://***.firebaseio.com",
  projectId: "***",
  storageBucket: "***.appspot.com",
  messagingSenderId: "***",
  appId: "***",
};

firebase.initializeApp(defaultFirebaseConfig);
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  const channel = new BroadcastChannel(
    "${appBroadcastChannelConstants.FIREBASE_NOTIFICATION_BACKGROUND_MESSAGE_CHANNEL_NAME}"
  );
  messaging.onBackgroundMessage((payload) => {
    channel.postMessage(payload);
  });
}`;

  res.writeHead(200, {
    "Content-Type": "application/javascript",
  });
  res.end(scriptTextt);
};

export default handler;
