import { getAuth } from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

import { commonConfig } from "@/utils/config";

import { useCallback, useContext, useEffect, useState } from "react";

import { FirebaseContext } from "@/contexts/Firebase";

import type { Auth } from "firebase/auth";
import type { Messaging } from "firebase/messaging";

const useFirebase = () => {
  const { app } = useContext(FirebaseContext);

  const [auth] = useState<Auth>(() => {
    return getAuth(app);
  });
  const [messaging, setMessaging] = useState<Messaging | null>(null);

  const _getToken = useCallback(async () => {
    if (!messaging) return "";
    return await getToken(messaging, {
      vapidKey: commonConfig.FIREBASE_MESSAGING_VAPID_KEY,
    }).catch(() => {
      return "";
    });
  }, [messaging]);

  const initFirebaseMessaging = async () => {
    const isSupportedBrowser = await isSupported();
    let newMessaging: typeof messaging = null;
    if (isSupportedBrowser) {
      newMessaging = getMessaging(app);
    }
    setMessaging(newMessaging);
  };

  useEffect(() => {
    initFirebaseMessaging();
  }, []);

  return {
    app,
    auth,
    messaging,
    getToken: _getToken,
  };
};

export default useFirebase;
