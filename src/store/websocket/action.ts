import { WebsocketActionTypes } from "./types";
import type { WebsocketAction } from "./types";

// ---- REDUCER ACTION ----

export const connectWebsocket = (): WebsocketAction => ({
  type: WebsocketActionTypes.CONNECT_WEBSOCKET,
});
