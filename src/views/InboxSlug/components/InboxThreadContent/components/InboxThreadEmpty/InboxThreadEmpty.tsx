import AppTypography from "@/components/AppTypography";

import InboxUserChattingSvg from "@@/public/images/svgs/inbox-user-chatting.svg";

import { useTranslation } from "next-i18next";

import useStyles from "./InboxThreadEmpty.styles";

const InboxThreadEmpty = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <InboxUserChattingSvg className={classes.inboxUserChattingSvg} />
      <AppTypography variant="titleSemi20" align="center" mb={0.5}>
        {t("inboxThreadEmptyTitle")}
      </AppTypography>
      <AppTypography variant="bodyReg14" align="center" color="text.secondary">
        {t("inboxThreadEmptyContent")}
      </AppTypography>
    </div>
  );
};

export default InboxThreadEmpty;
