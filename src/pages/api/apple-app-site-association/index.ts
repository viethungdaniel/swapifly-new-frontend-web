import { commonConfig } from "@/utils/config";

import type { NextApiRequest, NextApiResponse } from "next";

const association = {
  applinks: {
    apps: [],
    details: [
      {
        appID: `${commonConfig.APPLE_TEAM_ID}.${commonConfig.APPLE_BUNDLE_ID}`,
        paths: ["*"],
      },
    ],
  },
};

const handler = (_: NextApiRequest, response: NextApiResponse) => {
  return response.status(200).send(association);
};

export default handler;
