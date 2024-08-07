import _isObject from "lodash/isObject";

import nextI18nextConfig from "@@/next-i18next.config";
import { appStorageService, jwtService } from "@/services";
import { impressionPackageOrderApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ParsedQuery } from "query-string";
import { impressionPackageOrderConstants } from "@/utils/constants";

type RequestQuery = {
  order_id: ParsedQuery<string>;
  success: ParsedQuery<number>;
  redirect_pathname: ParsedQuery<string>;
  language: ParsedQuery<string>;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as unknown as RequestQuery;
  const orderId = commonHelpers.getOneRouterQueryValue(
    query.order_id
  ) as string;
  const queryRedirectPathname = commonHelpers.getOneRouterQueryValue(
    query.redirect_pathname
  ) as string;
  const language = commonHelpers.getOneRouterQueryValue(
    query.language
  ) as string;
  const querySuccess = commonHelpers.getOneRouterQueryValue(
    query.success
  ) as string;
  const success = commonHelpers.isNumber(querySuccess)
    ? Number(querySuccess)
    : 0;

  const languagePathPrefix =
    (language ?? "").toLocaleLowerCase() ===
      nextI18nextConfig.i18n.defaultLocale.toLocaleLowerCase() || !language
      ? "/"
      : `/${language}/`;

  // const redirectPathname = `${languagePathPrefix}${
  //   !!queryRedirectPathname ? queryRedirectPathname.replace(/^\/*/, "") : "404/"
  // }`;

  const redirectPathname = !!queryRedirectPathname
    ? queryRedirectPathname
    : `${languagePathPrefix}404/`;

  const token = jwtService.getToken({
    cookieOptions: {
      req,
      res,
    },
  });

  if (!orderId || !token) {
    res.redirect("/404");
    return;
  }

  const isAppCallback = redirectPathname.includes(
    "/apps/impression-package-order-payment-results"
  );

  try {
    const { data: response } =
      await impressionPackageOrderApi.dispatchImpressionPackageOrderPaymentCallback(
        {
          params: {
            order_id: orderId,
            success: success,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    if (axiosHelpers.checkRequestSuccess(response)) {
      appStorageService.saveCookieImpressionPackageOrderPaymentCallbackResponse(
        {
          data: {
            order_id: orderId,
            product_id: response.data.product_id!,
            is_app_callback: isAppCallback,
          },
          message:
            impressionPackageOrderConstants
              .resultNumberToImpressionPackageOrderCallbackMessageMap[
              response.data.result
            ] ?? "",
          success: !!success,
        },
        { req, res }
      );
    } else {
      appStorageService.saveCookieImpressionPackageOrderPaymentCallbackResponse(
        {
          data: {
            order_id: orderId,
            is_app_callback: isAppCallback,
          },
          message: response.message,
          success: false,
        },
        { req, res }
      );
    }
  } catch (error) {
    const message = axiosHelpers.getErrorMessage(error);
    appStorageService.saveCookieImpressionPackageOrderPaymentCallbackResponse(
      {
        data: {
          order_id: orderId,
          is_app_callback: isAppCallback,
        },
        message,
        success: false,
      },
      { req, res }
    );
  }

  res.redirect(redirectPathname);
};

export default handler;
