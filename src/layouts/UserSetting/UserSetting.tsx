import { commonConstants } from "@/utils/constants";

import { Divider, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import useStyles from "./UserSetting.styles";
import AppToolbar from "@/components/AppToolbar";
import AppTypography from "@/components/AppTypography";
import AppList from "@/components/AppList";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemText from "@/components/AppListItemText";
import AppStickyBox from "@/components/AppStickyBox";
import AppLink from "@/components/AppLink";

import { useRouter } from "next/router";
import { useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";

type UserSettingProps = {
  children: React.ReactNode;
};

const Setting = () => {
  const { classes, theme } = useStyles();

  const { handleAuthNavigationPush } = useAuthUser();

  const router = useRouter();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  if (isTabletDown) return null;

  return (
    <>
      <div className={classes.setting}>
        <AppStickyBox
          thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}
          offsetBottom={20}
        >
          <AppToolbar>
            <AppTypography variant="titleSemi20">{t("setting")}</AppTypography>
          </AppToolbar>
          <Divider />
          <AppList>
            {commonConstants.settingMenus.map((settingMenu) => (
              <AppListItemButton
                className={classes.settingItem}
                key={settingMenu.code}
                selected={settingMenu.activatedPathReg.test(router.asPath)}
                component={AppLink}
                href={settingMenu.path}
                underline="none"
                hoverColor="none"
                onClick={handleAuthNavigationPush(settingMenu.path)}
              >
                <AppListItemText
                  primary={t(settingMenu.label)}
                  primaryTypographyProps={{
                    variant: settingMenu.activatedPathReg.test(router.asPath)
                      ? "bodyMed14"
                      : "bodyReg14",
                  }}
                />
              </AppListItemButton>
            ))}
          </AppList>
        </AppStickyBox>
      </div>
      <div>
        <Divider className={classes.dividerVertical} orientation="vertical" />
      </div>
    </>
  );
};

const UserSetting = (props: UserSettingProps) => {
  const { children } = props;

  const { classes } = useStyles();

  return (
    <AppContainer disableGutters>
      <div className={classes.content}>
        <Setting />
        <main className={classes.main}>{children}</main>
      </div>
    </AppContainer>
  );
};

export default UserSetting;
