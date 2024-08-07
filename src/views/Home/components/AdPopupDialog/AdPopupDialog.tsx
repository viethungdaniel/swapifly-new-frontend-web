import { forwardRef } from "react";

import { storeAdSelectors } from "@/store";
import { adHelpers, imageHelpers } from "@/utils/helpers";
import { appGtagService } from "@/services";

import { Box, Dialog } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppTypography from "@/components/AppTypography";
import AppImage from "@/components/AppImage";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";

import DoubleArrowUpIcon from "@@/public/images/icons/double-arrow-up.svg";

import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/hooks";

import useStyles from "./AdPopupDialog.styles";

import type { PaperProps } from "@mui/material";

type AdPopupDialogProps = {
  open?: boolean;
  onClose?: () => void;
};

const StyledDialogPaper = forwardRef(
  (props: PaperProps, ref: React.ForwardedRef<any>) => {
    return <div ref={ref} {...props} />;
  }
);

const AdPopupDialog = (props: AdPopupDialogProps) => {
  const { open, onClose } = props;

  const { t } = useTranslation();

  const $s_popupAd = useAppSelector(storeAdSelectors.selectPopupAd);

  const { classes, theme } = useStyles();

  const handlePopupAdClick = () => {
    appGtagService.dispatchPopupAdClickEvent({
      adRefName: $s_popupAd?.ref_tilte!,
    });
    onClose && onClose();
  };

  return (
    <Dialog
      maxWidth="xs"
      PaperComponent={StyledDialogPaper}
      scroll="paper"
      open={!!open && !!$s_popupAd}
      className={classes.root}
      classes={{
        paper: classes.dialogPaper,
      }}
      onClose={onClose}
    >
      <div className={classes.adToolbarTop}>
        <AppButton
          variant="outlined"
          size="small"
          color="common.white"
          noWrap
          onClick={onClose}
        >
          {t("skipAd")}
        </AppButton>
      </div>
      {!!$s_popupAd && (
        <Box className={classes.adContent}>
          <div className={classes.adTag}>
            <AppTypography component="span" noWrap>
              {t("advertisement")}
            </AppTypography>
          </div>
          <AppLink
            {...adHelpers.getAdLink($s_popupAd)}
            className={classes.adMedia}
            onClick={handlePopupAdClick}
          >
            {adHelpers.isAdImageMediaType($s_popupAd?.media_type) ? (
              <>
                <AppImage
                  src={$s_popupAd?.photo}
                  loader={imageHelpers.appImageLoader}
                  width={theme.breakpoints.values.md}
                  height={theme.breakpoints.values.md}
                  priority
                  alt={`${$s_popupAd?.title} - ${$s_popupAd?.description}`}
                  className={classes.adMediaImage}
                />
              </>
            ) : (
              <>
                <video
                  className={classes.adMediaVideo}
                  playsInline
                  loop
                  autoPlay
                  muted
                >
                  <source
                    src={imageHelpers.imagePathLoader($s_popupAd?.video)}
                  />
                </video>
              </>
            )}
          </AppLink>
        </Box>
      )}
      <div className={classes.adToolbarBottom}>
        <div className={classes.learnMore}>
          <AppSvgIcon component={DoubleArrowUpIcon} color="inherit" />
          <AppTypography align="center" noWrap>
            {t("learnMore")}
          </AppTypography>
        </div>
      </div>
    </Dialog>
  );
};

export default AdPopupDialog;
