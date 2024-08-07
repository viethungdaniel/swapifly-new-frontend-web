import { v4 as uuidv4 } from "uuid";

import { appStorageService } from "@/services";
import { commonConfig } from "@/utils/config";
import { commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";

type RequestQuery = {
  redirect_path: string;
  language: string;
  context: "signin" | "binding";
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { language, redirect_path, context } = req.query as RequestQuery;

  if (!["signin", "binding"].includes(context) || !redirect_path) {
    res.redirect("/404");
    return;
  }

  const wechatSessionId = uuidv4();
  const wechatStateItem = {
    redirect_path,
    language,
    context,
    session_id: wechatSessionId,
    env: "dev_v2",
  };
  const wechatState = commonHelpers.encodeBase64(
    JSON.stringify(wechatStateItem)
  );

  if (context === "signin")
    appStorageService.saveCookieAuthWeChatSignInSessionId(wechatSessionId, {
      req,
      res,
    });
  if (context === "binding")
    appStorageService.saveCookieAuthWeChatBindingSessionId(wechatSessionId, {
      req,
      res,
    });

  res.redirect(
    `https://open.weixin.qq.com/connect/qrconnect?appid=${commonConfig.WECHAT_APP_ID}&response_type=code&scope=snsapi_login&state=${wechatState}&redirect_uri=${commonConfig.WECHAT_REDIRECT_URI}`
  );
};

export default handler;
