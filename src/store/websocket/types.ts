export enum WebsocketActionTypes {
  CONNECT_WEBSOCKET = "@@websocket/CONNECT_WEBSOCKET",
}

// State

export interface WebsocketState {
  websocket: WebSocket | null;
}

export type ConnectWebsocketAction = {
  type: WebsocketActionTypes.CONNECT_WEBSOCKET;
};

// ---- Reducer Action ----

export type WebsocketAction = ConnectWebsocketAction;
