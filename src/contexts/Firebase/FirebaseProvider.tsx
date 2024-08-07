import { initializeApp } from "firebase/app";

import { commonConstants } from "@/utils/constants";

import { useMemo, useRef } from "react";

import FirebaseContext from "./Firebase.context";

import type { FirebaseContextValue } from "./Firebase.context";

type FirebaseProviderProps = {
  children: React.ReactNode;
};

const FirebaseProvider = (props: FirebaseProviderProps) => {
  const { children } = props;

  const appRef = useRef<FirebaseContextValue["app"] | null>(null);

  const initializeFirebaseApp = () => {
    if (typeof window === "undefined" || !!appRef.current) return;
    appRef.current = initializeApp(commonConstants.firebaseConfig);
  };

  if (!appRef.current) {
    initializeFirebaseApp();
  }

  const value = useMemo<FirebaseContextValue>(() => {
    return {
      app: appRef.current!,
    };
  }, []);

  return (
    <FirebaseContext.Provider value={value!}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
