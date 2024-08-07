import { commonConfig } from "@/utils/config";
import type { NextApiRequest, NextApiResponse } from "next";

type Rule = {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

type Robots = {
  rules: Rule | Rule[];
  sitemap?: string | string[];
  host?: string;
};

const mapRuleItemToText = (ruleItem: Rule) => {
  let text = ``;
  if (typeof ruleItem.userAgent === "string")
    text = `${text}User-Agent: ${ruleItem.userAgent}\n`;
  if (typeof ruleItem.allow === "string")
    text = `${text}Allow: ${ruleItem.allow}\n`;
  if (typeof ruleItem.disallow === "string")
    text = `${text}Disallow: ${ruleItem.disallow}\n`;
  if (typeof ruleItem.crawlDelay === "string")
    text = `${text}Crawl-Delay: ${ruleItem.crawlDelay}`;
  return text;
};

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  let robotsText = `User-agent: *
Allow: /`;

  try {
    const robotsConfig = JSON.parse(commonConfig.ROBOTS_CONFIG) as Robots;
    robotsText = "";
    if (Array.isArray(robotsConfig.rules)) {
      const ruleText = robotsConfig.rules.map(mapRuleItemToText).join(`\n\n`);
      robotsText = `${robotsText}${ruleText}\n\n`;
    } else if (typeof robotsConfig.rules === "string") {
      robotsText = `${robotsText}${mapRuleItemToText(robotsConfig.rules)}\n\n`;
    }
    if (Array.isArray(robotsConfig.sitemap)) {
      const sitemapText = robotsConfig.sitemap
        .map((text) => `${text}\n`)
        .join(`\n\n`);
      robotsText = `${robotsText}${sitemapText}\n\n`;
    } else if (typeof robotsConfig.sitemap === "string") {
      robotsText = `${robotsText}${robotsConfig.sitemap}\n\n`;
    }
    if (typeof robotsConfig.host === "string") {
      robotsText = `${robotsText}Host: ${robotsConfig.host}`;
    }
  } catch (_) {}
  res.send(robotsText);
};

export default handler;
