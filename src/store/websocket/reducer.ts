import { commonConfig } from "@/utils/config";

import { WebsocketActionTypes } from "./types";

import type { WebsocketState, WebsocketAction } from "./types";

export const initialState: WebsocketState = {
  websocket: null,
};

const reducer = (
  state = initialState,
  action: WebsocketAction
): WebsocketState => {
  switch (action.type) {
    case WebsocketActionTypes.CONNECT_WEBSOCKET: {
      return {
        ...state,
        websocket: new WebSocket(commonConfig.WEBSOCKET_ENDPOINT),
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
