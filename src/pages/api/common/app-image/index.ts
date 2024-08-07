import { commonConfig } from "@/utils/config";
import { axiosHelpers, commonHelpers } from "@/utils/helpers";

import type { NextApiRequest, NextApiResponse } from "next";

enum MediaQuery {
  MOBILE = "mobile",
  DESKTOP = "desktop",
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  const imagePathname = commonHelpers.getOneRouterQueryValue(
    query.pathname
  ) as string;
  const mediaQuery = commonHelpers.getOneRouterQueryValue(query.media_query) as
    | MediaQuery.DESKTOP
    | MediaQuery.MOBILE;

  let readStream: Awaited<ReturnType<typeof fetch> | null> = null;

  if (mediaQuery === MediaQuery.DESKTOP) {
    readStream = await fetch(
      `${commonConfig.CDN_HOST}compressed/images/1200/${imagePathname}.webp`
    )
      .then((res) => {
        if (res.status === 200) return res;
        return null;
      })
      .catch(() => null);
  } else if (mediaQuery === MediaQuery.MOBILE) {
    readStream = await fetch(
      `${commonConfig.CDN_HOST}compressed/images/600/${imagePathname}.webp`
    )
      .then((res) => {
        if (res.status === 200) return res;
        return null;
      })
      .catch(() => null);
  }

  if (!readStream) {
    readStream = await fetch(`${commonConfig.CDN_HOST}${imagePathname}`)
      .then((res) => {
        if (res.status === 200) return res;
        return null;
      })
      .catch(() => null);
  }

  if (!readStream) {
    const cacheMaxAge = 1 * 60; // 1 minutes
    res.setHeader("cache-control", `public, max-age=${cacheMaxAge}`);
    res.status(500).send({
      message: "Media not found",
      success: false,
    });
  }

  try {
    const readStreamEncode = await readStream!.arrayBuffer();
    const readStreamBuffer = Buffer.from(readStreamEncode);
    res.setHeader("Content-Type", readStream!.headers.get("content-type")!);

    res.send(readStreamBuffer);
  } catch (error) {
    const cacheMaxAge = 1 * 60; // 1 minutes
    res.setHeader("cache-control", `public, max-age=${cacheMaxAge}`);
    const message = axiosHelpers.getErrorMessage(error);
    res.status(500).send({
      message,
      success: false,
    });
  }
};

export default handler;
