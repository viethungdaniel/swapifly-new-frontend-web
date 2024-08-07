import axios from "axios";

import { commonConfig } from "@/utils/config";
import { appStorageService, jwtService } from "@/services";
import {
  appBroadcastChannelConstants,
  regionConstants,
} from "@/utils/constants";

import type { AxiosError } from "axios";

const commonAxios = axios.create({
  baseURL: commonConfig.API_BASE_URL,
});

commonAxios.interceptors.request.use(
  (req) => {
    if (typeof req.headers["x-lang"] === "undefined") {
      req.headers["x-lang"] =
        typeof window !== "undefined"
          ? window.NextPublic.lang.toLowerCase()
          : undefined;
    }

    if (typeof req.headers["x-region"] === "undefined") {
      const regionId = appStorageService.getCookieAuthUserRegionId();

      req.headers["x-region"] = regionId || regionConstants.DEFAULT_REGION_ID;
    }

    if (!req.headers.Authorization) {
      const token = jwtService.getToken();
      if (!!token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }

    switch ((req.method as string).toUpperCase()) {
      case "GET": {
        req.params = req.params || {};
        // Object.assign(req.params, {});
        break;
      }
      case "POST": {
        // if (!(req.data instanceof FormData) && !!req.data) {
        //   req.data = commonHelpers.formatFormData(req.data);
        // }

        // if (req.data instanceof FormData) {
        // } else {
        //   req.data = req.data || {};
        //   // Object.assign(req.params, {});
        // }
        break;
      }
      case "PUT": {
        // if (!(req.data instanceof FormData) && !!req.data) {
        //   req.data = commonHelpers.formatFormData(req.data);
        // }
        // if (req.data instanceof FormData) {
        //   // req.data.append("language", window.NextPublic.lang);
        // } else {
        //   req.data = req.data || {};
        //   // Object.assign(req.params, {});
        // }
        break;
      }
    }
    return req;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

commonAxios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const authExpiredTokenBc = new BroadcastChannel(
          appBroadcastChannelConstants.AUTH_EXPIRED_TOKEN_CHANNEL_NAME
        );
        authExpiredTokenBc.postMessage(null);
      }
    }
    return Promise.reject(error);
  }
);

export default commonAxios;
