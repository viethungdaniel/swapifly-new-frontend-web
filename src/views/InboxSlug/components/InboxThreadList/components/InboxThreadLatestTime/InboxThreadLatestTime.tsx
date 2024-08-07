import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { useEffect, useState, useCallback } from "react";
import { useAppMomentWithLocale, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";
import useInterval from "@/hooks/useInterval";

const InboxThreadLatestTime = (props: { latestTime?: number }) => {
  const { latestTime } = props || {};

  const { t } = useTranslation();
  const { momentWithLocale, momentWithLocaleByCurrentTz } =
    useAppMomentWithLocale();

  const getLatestTimeText = useCallback(() => {
    if (!latestTime) return "";
    const nowDateTime = momentWithLocale();
    const latestTimeDateTime = momentWithLocaleByCurrentTz(latestTime, "X");
    const isToday = nowDateTime.isSame(latestTimeDateTime, "days");
    if (isToday) {
      const diffMinutes = nowDateTime.diff(latestTimeDateTime, "minutes");
      const diffHours = nowDateTime.diff(latestTimeDateTime, "hours");
      if (diffMinutes <= 59) {
        return t("minuteWithCount", { count: diffMinutes || 1 });
      }
      return t("hourWithCount", { count: diffHours || 1 });
    }
    const nowDate = momentWithLocale(nowDateTime.format("YYYY-MM-DD"));
    const latestTimeDate = momentWithLocale(
      latestTimeDateTime.format("YYYY-MM-DD")
    );
    const isYesterday = nowDate.diff(latestTimeDate, "days") === 1;
    if (isYesterday) {
      return t("yesterday");
    }
    const isOneWeekApart = nowDateTime.diff(latestTimeDateTime, "weeks") < 1;
    if (isOneWeekApart) {
      // const isCurrentWeek = nowDate.isSame(latestTimeDate, "weeks");
      return latestTimeDateTime.format("dddd");
    }
    const isCurrentYear = nowDate.isSame(latestTimeDate, "years");
    if (isCurrentYear) {
      return latestTimeDateTime.format("DD/MM");
    }
    return latestTimeDateTime.format("DD/MM/YYYY");
  }, [latestTime, t, momentWithLocale]);

  const [latestTimeText, setLatestTimeText] = useState(getLatestTimeText());

  const updateLatestTimeText = useCallback(() => {
    setLatestTimeText(getLatestTimeText());
  }, [getLatestTimeText]);

  useInterval(updateLatestTimeText, 1000);

  useEffect(() => {
    if (!isMounted()) return;
    updateLatestTimeText();
  }, [updateLatestTimeText]);

  const isMounted = useIsMounted();

  return latestTimeText;
};

export default InboxThreadLatestTime;
