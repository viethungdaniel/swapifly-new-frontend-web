// import { commonConfig } from "@/utils/config";
import moment from "moment";

import { useTranslation } from "next-i18next";
import { useCallback } from "react";

const useAppMomentWithLocale = () => {
  const { i18n } = useTranslation();
  const momentWithLocale = useCallback(moment, [i18n.language]);
  momentWithLocale.locale(i18n.language);

  const momentWithLocaleByCurrentTz = (
    value: number | string,
    format: string
  ) => {
    return momentWithLocale(value, format);
    // return momentWithLocale(
    //   `${momentWithLocale(value, format).format("YYYY-MM-DD HH:mm:ss")}${
    //     commonConfig.DEFAULT_SYSTEM_UTC_OFFSET
    //   }`,
    //   "YYYY-MM-DD HH:mm:ssZ"
    // );
  };

  return {
    momentWithLocale,
    momentWithLocaleByCurrentTz,
  };
};

export default useAppMomentWithLocale;
