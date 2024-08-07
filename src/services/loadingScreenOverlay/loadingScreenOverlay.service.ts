import eventBus from "@/services/eventBus";
import {
  LOADING_SCREEN_OVERLAY_CLOSE,
  LOADING_SCREEN_OVERLAY_FIRE,
} from "@/utils/constants/eventBus.constants";

export interface LoadingScreenOverlayOptions {
  content: React.ReactNode;
}

export const fire = (
  message?: string | LoadingScreenOverlayOptions,
  options?: LoadingScreenOverlayOptions
) => {
  if (typeof message === "string") {
    const { content, ...otherOptions } = options || {};
    return eventBus.asyncDispatch(LOADING_SCREEN_OVERLAY_FIRE, {
      content: message,
      ...otherOptions,
    });
  }
  return eventBus.asyncDispatch(LOADING_SCREEN_OVERLAY_FIRE, message);
};

export const close = () => {
  return eventBus.asyncDispatch(LOADING_SCREEN_OVERLAY_CLOSE);
};
