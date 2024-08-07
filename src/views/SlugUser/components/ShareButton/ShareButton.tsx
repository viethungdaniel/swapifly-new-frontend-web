import { appGtagService } from "@/services";

import AppButton from "@/components/AppButton";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import ShareDialog from "@/components/ShareDialog";

import IosShareIcon from "@@/public/images/icons/ios-share.svg";

import { useMemo, useState } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { SxProps } from "@mui/material";
import type { ShareDialogProps } from "@/components/ShareDialog";

type ReportButtonProps = {
  className?: string;
  viewMode?: "desktop" | "mobile";
  sx?: SxProps;
};

const ReportButton = (props: ReportButtonProps) => {
  const { className, viewMode, sx } = props;

  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const $s_userUsername = useAppSelector(
    (state) => state.user.user?.shop?.username
  );

  const { t } = useTranslation();

  const shareDialogData = useMemo<ShareDialogProps["data"]>(() => {
    return {
      url: typeof window === "undefined" ? "" : window.location.href,
      title: $s_userUsername,
    };
  }, [$s_userUsername]);

  const handleShareDialogOpen = () => {
    appGtagService.dispatchShareEvent({
      title: $s_userUsername!,
    });
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  return (
    <>
      {viewMode === "mobile" ? (
        <AppIconButton
          color="text.primary"
          className={className}
          sx={sx}
          onClick={handleShareDialogOpen}
        >
          <AppSvgIcon component={IosShareIcon} fontSize="inherit" />
        </AppIconButton>
      ) : (
        <AppButton
          className={className}
          sx={sx}
          variant="outlined"
          color="text.primary"
          startIcon={<AppSvgIcon component={IosShareIcon} fontSize="inherit" />}
          onClick={handleShareDialogOpen}
        >
          {t("share")}
        </AppButton>
      )}
      <ShareDialog
        open={shareDialogOpen}
        data={shareDialogData}
        onClose={handleShareDialogClose}
      />
    </>
  );
};

export default ReportButton;
