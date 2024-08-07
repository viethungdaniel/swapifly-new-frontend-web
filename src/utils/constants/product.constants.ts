export const SORT_NEAR_FEATURE_NUMBER = 1;
export const SORT_PRICE_HIGH_TO_LOW_NUMBER = 2;
export const SORT_PRICE_LOW_TO_HIGH_NUMBER = 3;
export const SORT_NEAR_NUMBER = 4;

export const LIKE_ID = 1;
export const UN_LIKE_ID = 2;

export const NORMAL_STATE_NUMBER = 1;
export const SOLD_STATE_NUMBER = 2;
export const OUT_OF_STOCK_STATE_NUMBER = 3;

export const numberToSortMap = {
  [SORT_NEAR_FEATURE_NUMBER]: "In the near feature",
  [SORT_PRICE_HIGH_TO_LOW_NUMBER]: "Price - High to low",
  [SORT_PRICE_LOW_TO_HIGH_NUMBER]: "Price - Low to high",
  [SORT_NEAR_NUMBER]: "Near",
};

export const AUTO_REPLY_DATE_TIME_ANYTIME_OPTION = "anytime";
export const AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION = "weekdaytime";
export const AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION = "specifydaytime";

export const MIN_PRICE = 1;
export const MAX_PRICE = 99999999;

export const idToDateTimeOptionMap = {
  [AUTO_REPLY_DATE_TIME_ANYTIME_OPTION]: "anyTime",
  [AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION]: "weekdayAndTime",
  [AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION]: "specifyDayAndTime",
} as {
  [id: string]: string;
};
