import { commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ParsedQuery } from "query-string";

type RequestQuery = {
  id?: ParsedQuery<number>;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as unknown as RequestQuery;

  const helpCenterId = commonHelpers.getOneRouterQueryValue(query.id);

  if (!commonHelpers.isNumber(helpCenterId)) {
    res.redirect(`/404`);
    return;
  }

  res.redirect(`/help-center/details-${helpCenterId}`);
};

export default handler;
