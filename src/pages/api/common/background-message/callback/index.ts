import { commonHelpers } from "@/utils/helpers";
import nextI18nextConfig from "@@/next-i18next.config";

import type { NextApiRequest, NextApiResponse } from "next";

type RequestQuery = {
  type: "notification_details";
  language: string;
  id: string;
  title: string;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { type, language, title, id } = req.query as RequestQuery;
  const languagePathPrefix =
    language === nextI18nextConfig.i18n.defaultLocale.toLocaleLowerCase()
      ? ""
      : !!language
      ? `/${language}`
      : "";

  switch (type) {
    case "notification_details": {
      return res.redirect(
        `${languagePathPrefix}/notifications/${commonHelpers.generateSlug(
          title,
          id
        )}`
      );
    }
    default: {
      return res.redirect(`${languagePathPrefix}/`);
    }
  }
};

export default handler;
