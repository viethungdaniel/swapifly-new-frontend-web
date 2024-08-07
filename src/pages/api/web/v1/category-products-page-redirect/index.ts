import { commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ParsedQuery } from "query-string";

type RequestQuery = {
  keyword?: ParsedQuery<string>;
  id?: ParsedQuery<number>;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as unknown as RequestQuery;

  const categoryId = commonHelpers.getOneRouterQueryValue(query.id) ?? "";

  if (!commonHelpers.isNumber(categoryId)) {
    res.redirect(`/404`);
    return;
  }

  res.redirect(`/products-category-c${categoryId}`);
};

export default handler;
