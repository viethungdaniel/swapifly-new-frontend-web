import moment from "moment";

import { commonHelpers } from "@/utils/helpers";

import { useEffect, useRef, useState } from "react";
import { useIsMounted } from "@/hooks";

import type { Moment } from "moment";

const getReturnValues = (diffTime: number) => {
  const duration = moment.duration(diffTime, "milliseconds");

  const seconds = duration.seconds();
  const asSeconds = Math.ceil(duration.asSeconds());

  const minutes = duration.minutes();
  const asMinutes = duration.asMinutes();

  const hours = duration.hours();
  const asHours = duration.asHours();

  const days = duration.days();
  const asDays = duration.asDays();

  return {
    days,
    asDays,
    hours,
    asHours,
    minutes,
    asMinutes,
    seconds,
    asSeconds,
  };
};

const useCountdownTimer = (
  dateTime?: Date | null | Moment | string | number
) => {
  const countDownTime = commonHelpers.isEmpty(dateTime)
    ? 0
    : new Date(dateTime! as any).getTime();

  const curCountDownTimeRef = useRef(countDownTime);

  const [diffTime, setDiffTime] = useState(() => {
    const curDiffTime = countDownTime - new Date().getTime();
    return curDiffTime >= 0 ? curDiffTime : 0;
  });

  const updateDiffTime = () => {
    const newDiffTime = countDownTime - new Date().getTime();
    setDiffTime(newDiffTime >= 0 ? newDiffTime : 0);
  };

  useEffect(() => {
    curCountDownTimeRef.current = countDownTime;

    const diffTimeInterval = setInterval(updateDiffTime, 1000);

    if (isMounted()) {
      updateDiffTime();
    }

    return () => clearInterval(diffTimeInterval);
  }, [countDownTime]);

  const isMounted = useIsMounted();

  return getReturnValues(
    curCountDownTimeRef.current !== countDownTime
      ? countDownTime - new Date().getTime()
      : diffTime
  );
};

export default useCountdownTimer;
