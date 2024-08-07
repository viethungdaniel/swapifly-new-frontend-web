import _isObject from "lodash/isObject";

import { appStorageService, jwtService } from "@/services";
import { authApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import nextI18nextConfig from "@@/next-i18next.config";

import type { NextApiRequest, NextApiResponse } from "next";

type RequestQuery = {
  state: string;
  code: string;
};

type WechatState = {
  redirect_path?: string;
  language?: string;
  session_id?: string;
  context?: "signin" | "binding";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { state, code } = req.query as RequestQuery;

  let stateItem: WechatState | null = null;

  try {
    stateItem = JSON.parse(commonHelpers.decodeBase64(state));
  } catch {}

  const languagePathPrefix =
    (stateItem?.language ?? "").toLocaleLowerCase() ===
    nextI18nextConfig.i18n.defaultLocale.toLocaleLowerCase()
      ? ""
      : !!stateItem?.language
      ? `/${stateItem.language}`
      : "";

  const redirectPath = `${languagePathPrefix}${
    stateItem?.redirect_path || "/404"
  }`;

  switch (stateItem?.context) {
    case "binding": {
      const wechatBindingSessionId =
        appStorageService.getCookieAuthWeChatBindingSessionId({
          res,
          req,
        });
      appStorageService.destroyCookieAuthWeChatBindingSessionId({
        res,
        req,
      });

      if (stateItem?.session_id !== wechatBindingSessionId) {
        res.redirect(`${languagePathPrefix}${"/404"}`);
      }

      const token = jwtService.getToken({
        cookieOptions: {
          req,
          res,
        },
      });
      try {
        const { data: response } = await authApi.bindWeChat({
          params: {
            code,
            platform: "website",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (axiosHelpers.checkRequestSuccess(response)) {
          appStorageService.saveCookieWechatBindingCallbackResponse(
            {
              message: response.message,
              success: true,
            },
            { req, res }
          );
        } else {
          appStorageService.saveCookieWechatBindingCallbackResponse(
            {
              message: response.message,
              success: false,
            },
            { req, res }
          );
        }
      } catch (error) {
        const message = axiosHelpers.getErrorMessage(error);
        appStorageService.saveCookieWechatBindingCallbackResponse(
          {
            message: message,
            success: false,
          },
          { req, res }
        );
      }
      break;
    }

    case "signin": {
      const wechatSignInSessionId =
        appStorageService.getCookieAuthWeChatSignInSessionId({
          res,
          req,
        });
      appStorageService.destroyCookieAuthWeChatSignInSessionId({
        res,
        req,
      });

      if (stateItem?.session_id !== wechatSignInSessionId) {
        res.redirect(`${languagePathPrefix}${"/404"}`);
      }

      try {
        const { data: response } = await authApi.signInWithWeChat({
          params: {
            code,
            platform: "website",
          },
        });
        if (axiosHelpers.checkRequestSuccess(response)) {
          jwtService.saveToken(response.data.token, {
            cookieOptions: {
              req,
              res,
            },
          });
          appStorageService.saveCookieAuthUserId(response.data.id, {
            req,
            res,
          });
          appStorageService.saveCookieWechatSignInCallbackResponse(
            {
              message: "Logged successfully",
              success: true,
            },
            { req, res }
          );
        } else {
          appStorageService.saveCookieWechatSignInCallbackResponse(
            {
              message: response.message,
              success: false,
            },
            { req, res }
          );
        }
      } catch (error) {
        const message = axiosHelpers.getErrorMessage(error);
        appStorageService.saveCookieWechatSignInCallbackResponse(
          {
            message: message,
            success: false,
          },
          { req, res }
        );
      }
      break;
    }
  }

  res.redirect(redirectPath);
};

export default handler;
