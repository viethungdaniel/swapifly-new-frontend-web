import { useState } from "react";

import { commonConfig } from "@/utils/config";

import useAppMomentWithLocale from "@/hooks/useAppMomentWithLocale";

const useIntervalAppNow = () => {
  const { momentWithLocale } = useAppMomentWithLocale();

  const [now, setNow] = useState(
    momentWithLocale().utcOffset(commonConfig.DEFAULT_SYSTEM_UTC_OFFSET)
  );

  setInterval(() => {
    setNow(
      momentWithLocale().utcOffset(commonConfig.DEFAULT_SYSTEM_UTC_OFFSET)
    );
  }, 1000);

  return now;
};

export default useIntervalAppNow;
