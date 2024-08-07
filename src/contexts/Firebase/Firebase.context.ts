import { createContext } from "react";

import type { FirebaseApp } from "firebase/app";

export type FirebaseContextValue = {
  app: FirebaseApp;
};

const FirebaseContext = createContext<FirebaseContextValue>(undefined!);

export default FirebaseContext;
