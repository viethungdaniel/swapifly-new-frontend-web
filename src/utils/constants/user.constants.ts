export const FOLLOW_ID = 1;
export const UN_FOLLOW_ID = 2;

export const HIGH_RESPONSE_STATE = 1;
export const MEDIUM_RESPONSE_STATE = 2;
export const LOW_RESPONSE_STATE = 3;

export const CUSTOM_GENDER_ID = 0;
export const MALE_GENDER_ID = 1;
export const FEMALE_GENDER_ID = 2;
export const NON_BINARY_GENDER_ID = 3;
export const NOT_TO_SAY_GENDER_ID = 4;

export const responseStateToResponseStateLabelMap: {
  [state: number]: string;
} = {
  [HIGH_RESPONSE_STATE]: "highResponseRate",
  [MEDIUM_RESPONSE_STATE]: "goodResponseRate",
  [LOW_RESPONSE_STATE]: "responseInfrequently",
};

export const idToGenderLabelMap = {
  [CUSTOM_GENDER_ID]: "custom",
  [MALE_GENDER_ID]: "male",
  [FEMALE_GENDER_ID]: "female",
  [NON_BINARY_GENDER_ID]: "nonBinary",
  [NOT_TO_SAY_GENDER_ID]: "notToSay",
};
