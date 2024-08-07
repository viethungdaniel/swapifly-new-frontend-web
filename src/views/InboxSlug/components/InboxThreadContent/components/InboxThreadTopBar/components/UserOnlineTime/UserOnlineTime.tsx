import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { storeInboxSelectors } from "@/store";

import { useEffect, useState, useCallback } from "react";
import { useAppMomentWithLocale, useAppSelector, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";
import useInterval from "@/hooks/useInterval";

const UserOnlineTime = () => {
  const $s_inboxThreadOfferUserLatestOnlineTime = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferUserLatestOnlineTime
  );
  const { t } = useTranslation();
  const { momentWithLocale, momentWithLocaleByCurrentTz } =
    useAppMomentWithLocale();

  const getOnlineTimeText = useCallback(() => {
    if (!$s_inboxThreadOfferUserLatestOnlineTime) return "";
    const nowDateTime = momentWithLocale();
    const onlineTimeDateTime = momentWithLocaleByCurrentTz(
      $s_inboxThreadOfferUserLatestOnlineTime,
      "X"
    );

    const isToday = nowDateTime.isSame(onlineTimeDateTime, "days");
    if (isToday) {
      const diffMinutes = nowDateTime.diff(onlineTimeDateTime, "minutes");
      const diffHours = nowDateTime.diff(onlineTimeDateTime, "hours");
      if (diffMinutes <= 59) {
        return t("onlineMinuteAgoWithCount", {
          count: diffMinutes || 1,
        });
      }
      return t("onlineHourAgoWithCount", {
        count: diffHours || 1,
      });
    }
    const nowDate = momentWithLocale(nowDateTime.format("YYYY-MM-DD"));
    const onlineTimeDate = momentWithLocale(
      onlineTimeDateTime.format("YYYY-MM-DD")
    );
    const isYesterday = nowDate.diff(onlineTimeDate, "days") === 1;
    if (isYesterday) {
      return t("yesterday");
    }
    const isOneWeekApart = nowDate.diff(onlineTimeDate, "weeks") < 1;
    if (isOneWeekApart) {
      const diffDays = nowDate.diff(onlineTimeDate, "days");
      return t("onlineDayAgoWithCount", {
        count: diffDays || 1,
      });
    }
    const isFourWeekApart = nowDate.diff(onlineTimeDate, "weeks") <= 4;
    const diffMonths = nowDate.diff(onlineTimeDate, "months");
    if (isFourWeekApart || diffMonths === 0) {
      const diffWeeks = nowDate.diff(onlineTimeDate, "week");
      return t("onlineWeekAgoWithCount", {
        count: diffWeeks || 1,
      });
    }
    const isOneYearApart = nowDate.diff(onlineTimeDate, "years") < 1;

    if (isOneYearApart) {
      return t("onlineMonthAgoWithCount", {
        count: diffMonths,
      });
    }
    return onlineTimeDateTime.format("DD/MM/YYYY");
  }, [$s_inboxThreadOfferUserLatestOnlineTime, t, momentWithLocale]);

  const [onlineTimeText, setOnlineTimeText] = useState(getOnlineTimeText());

  const updateOnlineTimeText = useCallback(() => {
    setOnlineTimeText(getOnlineTimeText());
  }, [getOnlineTimeText]);

  useInterval(updateOnlineTimeText, 1000);

  useEffect(() => {
    if (!isMounted()) return;
    updateOnlineTimeText();
  }, [updateOnlineTimeText]);

  const isMounted = useIsMounted();

  return onlineTimeText;
};

export default UserOnlineTime;
