import AppButton from "@/components/AppButton";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import UserReportDialog from "@/components/UserReportDialog";

import FlagIcon from "@@/public/images/icons/flag.svg";

import { useState } from "react";
import { useAppSelector, useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { SxProps } from "@mui/material";

type ReportButtonProps = {
  className?: string;
  viewMode?: "desktop" | "mobile";
  sx?: SxProps;
};

const ReportButton = (props: ReportButtonProps) => {
  const { className, viewMode, sx } = props;

  const [productReportDialogOpen, setProductReportDialogOpen] = useState(false);

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const { t } = useTranslation();

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);

  const handleProductReportDialogOpen = () => {
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    setProductReportDialogOpen(true);
  };

  const handleProductReportDialogClose = () => {
    setProductReportDialogOpen(false);
  };

  return (
    <>
      {viewMode === "mobile" ? (
        <AppIconButton
          color="text.primary"
          className={className}
          sx={sx}
          onClick={handleProductReportDialogOpen}
        >
          <AppSvgIcon component={FlagIcon} fontSize="inherit" />
        </AppIconButton>
      ) : (
        <AppButton
          className={className}
          sx={sx}
          variant="outlined"
          color="text.primary"
          startIcon={<AppSvgIcon component={FlagIcon} fontSize="inherit" />}
          onClick={handleProductReportDialogOpen}
        >
          {t("report")}
        </AppButton>
      )}
      <UserReportDialog
        userId={$s_userId}
        open={productReportDialogOpen}
        onClose={handleProductReportDialogClose}
        onProductReportSubmitSucceed={handleProductReportDialogClose}
      />
    </>
  );
};

export default ReportButton;
