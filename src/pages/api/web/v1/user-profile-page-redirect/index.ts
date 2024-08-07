import { commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ParsedQuery } from "query-string";

type RequestQuery = {
  userId?: ParsedQuery<number>;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as unknown as RequestQuery;

  const userId = commonHelpers.getOneRouterQueryValue(query.userId);

  if (!commonHelpers.isNumber(userId)) {
    res.redirect(`/404`);
    return;
  }

  res.redirect(`/profile-${userId}`);
};

export default handler;
