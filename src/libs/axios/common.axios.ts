import axios from "axios";

import { commonConfig } from "@/utils/config";
import { appStorageService } from "@/services";
import { regionConstants } from "@/utils/constants";

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
    // if (!["", null, undefined].includes(res?.data?.error_code)) {
    // 	// helpers.axios.allocateRoute(res.data.error_code)
    // }

    return res;
  },
  (err) => {
    if (!axios.isCancel(err)) {
      // console.log(err);
    }
    return Promise.reject(err);
  }
);

export default commonAxios;
