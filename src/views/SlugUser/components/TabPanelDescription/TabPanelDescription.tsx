import { Divider } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppToolbar from "@/components/AppToolbar";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./TabPanelDescription.styles";
import NoSearchResults from "@/components/NoSearchResults";

const TabPanelDescription = () => {
  const { t } = useTranslation();

  const $s_userDescription = useAppSelector(
    (state) => state.user.user?.shop?.describe
  );

  const { classes } = useStyles();

  return (
    <div>
      <AppToolbar>
        <AppTypography className={classes.title} variant="titleSemi20" noWrap>
          {t("description")}
        </AppTypography>
      </AppToolbar>
      <Divider className={classes.titleDivider} />
      <AppContainer sx={{ overflowY: "clip" }}>
        <div className={classes.content}>
          {!!$s_userDescription ? (
            <AppTypography whiteSpace="pre-line">
              {$s_userDescription}
            </AppTypography>
          ) : (
            <NoSearchResults variant="description" />
          )}
        </div>
      </AppContainer>
    </div>
  );
};

export default TabPanelDescription;
