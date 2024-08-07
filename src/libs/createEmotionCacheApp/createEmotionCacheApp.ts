import createCache from "@emotion/cache";
import { commonConfig } from "../../utils/config";

export function createTssEmotionCache() {
  return createCache({
    key: commonConfig.APP_CACHE_KEY,
  });
}

export default createTssEmotionCache;
