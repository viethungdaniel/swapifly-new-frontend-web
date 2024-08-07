import { commonConstants } from "@/utils/constants";

import AppDrawer from "@/components/AppDrawer";
import AppDrawerBody from "@/components/AppDrawerBody";
import AppDrawerTitle from "@/components/AppDrawerTitle";
import AppDrawerTitleIcon from "@/components/AppDrawerTitleIcon";
import AppIconButton from "@/components/AppIconButton";
import AppList from "@/components/AppList";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemText from "@/components/AppListItemText";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";

import CloseIcon from "@@/public/images/icons/close.svg";

import { useRouter } from "next/router";
import { useAuthUser } from "@/hooks";
import { useTranslation } from "react-i18next";

import useStyles from "./SettingMenuDrawer.styles";

type SettingMenuDrawerProps = {
  open?: boolean;
  onClose: Function;
  onMenuClick?: React.MouseEventHandler;
};

const SettingMenuDrawer = (props: SettingMenuDrawerProps) => {
  const { open = true, onClose = () => {}, onMenuClick = () => {} } = props;

  const { hasAuth, handleAuthNavigationPush } = useAuthUser();

  const router = useRouter();

  const { t } = useTranslation();

  const { classes } = useStyles();

  return (
    <AppDrawer open={open} onClose={onClose as any}>
      <AppDrawerTitle stickyHeader>
        {t("setting")}
        <AppDrawerTitleIcon position="end">
          <AppIconButton
            edge="xy"
            borderRadius="circular"
            color="text.primary"
            onClick={onClose as any}
          >
            <AppSvgIcon component={CloseIcon} />
          </AppIconButton>
        </AppDrawerTitleIcon>
      </AppDrawerTitle>
      <AppDrawerBody disablePadding>
        <AppList disablePadding>
          {commonConstants.settingMenus.map((settingMenu, settingMenuIndex) => {
            return (
              <AppListItemButton
                key={settingMenu.code}
                divider={
                  settingMenuIndex !== commonConstants.settingMenus.length - 1
                }
                classes={{ gutters: classes.menuItemGutters }}
                component={AppLink}
                href={settingMenu.path}
                underline="none"
                hoverColor="none"
                selected={settingMenu.activatedPathReg.test(router.asPath)}
                onClick={(event) => {
                  if (!!hasAuth || !settingMenu.auth) {
                    onMenuClick && onMenuClick(event);
                  } else handleAuthNavigationPush(settingMenu.path)(event);
                }}
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
            );
          })}
        </AppList>
      </AppDrawerBody>
    </AppDrawer>
  );
};

export default SettingMenuDrawer;
