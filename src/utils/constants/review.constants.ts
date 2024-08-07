export const BUYER_TYPE_ID = 1;
export const SELLER_TYPE_ID = 2;

export const LATEST_SORT_TYPE_ID = 1;
export const OLDEST_SORT_TYPE_ID = 2;
export const HIGHEST_SCORE_SORT_TYPE_ID = 3;
export const LOWEST_SCORE_SORT_TYPE_ID = 4;

export const idToTypeItemMap = {
  [BUYER_TYPE_ID]: {
    label: "fromBuyer",
    value: BUYER_TYPE_ID,
  },
  [SELLER_TYPE_ID]: {
    label: "fromSeller",
    value: SELLER_TYPE_ID,
  },
} as {
  [key: number]: {
    label: string;
    value: number;
  };
};

export const idToSortTypeItemMap = {
  [LATEST_SORT_TYPE_ID]: {
    label: "latest",
    value: LATEST_SORT_TYPE_ID,
  },
  [OLDEST_SORT_TYPE_ID]: {
    label: "oldest",
    value: OLDEST_SORT_TYPE_ID,
  },
  [HIGHEST_SCORE_SORT_TYPE_ID]: {
    label: "highestScore",
    value: HIGHEST_SCORE_SORT_TYPE_ID,
  },
  [LOWEST_SCORE_SORT_TYPE_ID]: {
    label: "lowestScore",
    value: LOWEST_SCORE_SORT_TYPE_ID,
  },
} as {
  [key: number]: {
    label: string;
    value: number;
  };
};
