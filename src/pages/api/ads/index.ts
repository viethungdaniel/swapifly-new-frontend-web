import { commonConfig } from "@/utils/config";
import type { NextApiRequest, NextApiResponse } from "next";

type Rule = {
  domain: string;
  publisherId: string;
  relationshipType: "DIRECT" | "RESELLER";
  certificationAuthorityId: string;
};

type Ads = {
  rules: Rule | Rule[];
};

const mapRuleItemToText = (ruleItem: Rule) => {
  let text = ``;
  if (typeof ruleItem.domain === "string") text = `${text}${ruleItem.domain}, `;
  if (typeof ruleItem.publisherId === "string")
    text = `${text}${ruleItem.publisherId}, `;
  if (typeof ruleItem.relationshipType === "string")
    text = `${text}${ruleItem.relationshipType}, `;
  if (typeof ruleItem.certificationAuthorityId === "string")
    text = `${text}${ruleItem.certificationAuthorityId}`;
  return text;
};

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  let adsText = ``;

  try {
    const adsConfig = JSON.parse(commonConfig.ADS_CONFIG) as Ads;
    adsText = "";
    if (Array.isArray(adsConfig.rules)) {
      const ruleText = adsConfig.rules.map(mapRuleItemToText).join(`\n`);
      adsText = `${adsText}${ruleText}\n\n`;
    } else if (typeof adsConfig.rules === "string") {
      adsText = `${adsText}${mapRuleItemToText(adsConfig.rules)}\n\n`;
    }
  } catch (_) {}
  res.send(adsText);
};

export default handler;
