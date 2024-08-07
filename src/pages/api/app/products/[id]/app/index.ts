import { jwtService } from "@/services";
import { authApi } from "@/utils/apis";
import { commonConstants } from "@/utils/constants";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ParsedQuery } from "query-string";

type RequestQuery = {
  id: number;
  token?: ParsedQuery<string>;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as unknown as RequestQuery;

  const productId = commonHelpers.isNumber(query.id) ? Number(query.id) : null;
  const authOneTimeToken: string = commonHelpers.getOneRouterQueryValue(
    query.token
  );

  if (!productId || !authOneTimeToken) {
    res.redirect(`/404`);
    return;
  }

  try {
    const { data: response } = await authApi.signInWithOneTimeToken({
      headers: {
        Authorization: `Bearer ${authOneTimeToken}`,
      },
    });
    if (axiosHelpers.checkRequestSuccess(response)) {
      jwtService.saveToken(response.data.token, {
        cookieOptions: {
          req,
          res,
        },
      });
    } else {
      res.redirect(`/404`);
      return;
    }
  } catch (error) {
    res.redirect(`/404`);
    return;
  }

  res.redirect(
    `/details-p${productId}?app_action=${commonConstants.COMMON_QUERY_APP_ACTION_PURCHASE_VISITS}`
  );
};

export default handler;
