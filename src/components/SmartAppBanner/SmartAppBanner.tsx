import { commonConfig } from "@/utils/config";

import SmartAppBannerToolbar from "@/components/SmartAppBannerToolbar";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppIconButton from "@/components/AppIconButton";
import AppTypography from "@/components/AppTypography";
import AppButton from "@/components/AppButton";
import AppImage from "@/components/AppImage";

import CloseIcon from "@@/public/images/icons/close.svg";

import smartAppBannerIconImg from "@@/public/images/smart-app-banner-icon.jpg";

import { useAppLink } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./SmartAppBanner.styles";

type SmartAppBannerProps = {
  onClose?: React.MouseEventHandler;
};

const SmartAppBanner = (props: SmartAppBannerProps) => {
  const { onClose } = props;

  const appLink = useAppLink();

  const handleAppOpen = () => {
    window.location.href = appLink;
  };

  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <div className={classes.smartAppBanner}>
      <SmartAppBannerToolbar>
        <AppIconButton
          edge={"xy"}
          color="common.white"
          size="small"
          borderRadius="circular"
          onClick={onClose}
        >
          <AppSvgIcon component={CloseIcon} fontSize="inherit" />
        </AppIconButton>
        <AppImage
          className={classes.smartAppBannerIconImg}
          src={smartAppBannerIconImg}
          width={40}
          height={40}
          alt={`smart app banner - ${commonConfig.DOCUMENT_TITLE}`}
        />
        <div className={classes.content}>
          <AppTypography variant="bodyMed14">
            {t("smartAppBannerDownloadAppTitle")}
          </AppTypography>
          <AppTypography className={classes.contentText} variant="captionReg12">
            {t("smartAppBannerContent")}
          </AppTypography>
        </div>
        <AppButton
          size="small"
          variant="contained"
          color="common.white"
          onClick={handleAppOpen}
        >
          {t("open")}
        </AppButton>
      </SmartAppBannerToolbar>
    </div>
  );
};

export default SmartAppBanner;
