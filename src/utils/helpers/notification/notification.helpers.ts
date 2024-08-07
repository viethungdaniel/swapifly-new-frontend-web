import queryString from "query-string";
import { notificationConstants } from "@/utils/constants";
import { commonHelpers } from "@/utils/helpers";

import type { FetchNotificationResponseData } from "@/utils/apis/notification";

export const isNotificationText = (notificationType: string) => {
  return notificationType === notificationConstants.NOTIFICATION_TEXT_TYPE;
};
export const isNotificationUrl = (notificationType: string) => {
  return notificationType === notificationConstants.NOTIFICATION_URL_TYPE;
};
export const isNotificationRelatedContent = (notificationType: string) => {
  return (
    notificationType === notificationConstants.NOTIFICATION_RELATED_CONTENT_TYPE
  );
};

export const isNotificationRelatedContentUser = (
  notificationRelatedType: string
) => {
  return (
    notificationRelatedType ===
    notificationConstants.NOTIFICATION_RELATED_CONTENT_USER_RELATED_TYPE
  );
};

export const isNotificationRelatedContentProduct = (
  notificationRelatedType: string
) => {
  return (
    notificationRelatedType ===
    notificationConstants.NOTIFICATION_RELATED_CONTENT_PRODUCT_RELATED_TYPE
  );
};

export const isNotificationRelatedContentProducts = (
  notificationRelatedType: string
) => {
  return (
    notificationRelatedType ===
    notificationConstants.NOTIFICATION_RELATED_CONTENT_PRODUCTS_RELATED_TYPE
  );
};

export const isNotificationRelatedContentNewsItem = (
  notificationRelatedType: string
) => {
  return (
    notificationRelatedType ===
    notificationConstants.NOTIFICATION_RELATED_CONTENT_NEWS_ITEM_RELATED_TYPE
  );
};

export const isNotificationRelatedContentHelpCenter = (
  notificationRelatedType: string
) => {
  return (
    notificationRelatedType ===
    notificationConstants.NOTIFICATION_RELATED_CONTENT_HELP_CENTER_RELATED_TYPE
  );
};

export const getNotificationRelatedContentPath = (
  notification?: Pick<
    Partial<FetchNotificationResponseData>,
    "related_type" | "related_value_item"
  >
) => {
  const { related_type, related_value_item } = notification || {};

  if (isNotificationRelatedContentUser(related_type!)) {
    return `/${commonHelpers.generateUserSlug(related_value_item)}`;
  }
  if (isNotificationRelatedContentProduct(related_type!)) {
    return `/${commonHelpers.generateProductSlug(
      related_value_item?.title,
      related_value_item?.id
    )}`;
  }
  if (isNotificationRelatedContentProducts(related_type!)) {
    const query = queryString.stringify(
      {
        product_category: related_value_item?.category_id,
        brand: Array.isArray(related_value_item?.brand_ids)
          ? related_value_item?.brand_ids
          : related_value_item?.brand_id
          ? [related_value_item?.brand_id]
          : [],
        is_post_courier: related_value_item?.by_post_and_courier,
        is_trade_in_person: related_value_item?.trade_in_person,
        max_price: related_value_item?.max_price,
        min_price: related_value_item?.min_price,
        product_condition: Array.isArray(related_value_item?.product_conditions)
          ? related_value_item?.product_conditions
          : [],
        merchant_location: Array.isArray(
          related_value_item?.merchant_location_ids
        )
          ? related_value_item?.merchant_location_ids
          : [],
        user: Array.isArray(related_value_item?.merchant_ids)
          ? related_value_item?.merchant_ids
          : [],
        product_sort: related_value_item?.sort_id,
      },
      { skipEmptyString: true, skipNull: true }
    );
    return `/search?${query}`;
  }
  if (isNotificationRelatedContentNewsItem(related_type!)) {
    return `/news/${commonHelpers.generateSlug(
      related_value_item?.title,
      related_value_item?.id
    )}`;
  }
  if (isNotificationRelatedContentHelpCenter(related_type!)) {
    return `/help-center/${commonHelpers.generateSlug(
      related_value_item?.title,
      related_value_item?.id
    )}`;
  }
  return "/notifications";
};
