import { ToastContainer } from "react-toastify";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import { Portal } from "@mui/material";

import CloseSmallIcon from "@@/public/images/icons/close-small.svg";
import InfoIcon from "@@/public/images/icons/info-filled.svg";
import WarningIcon from "@@/public/images/icons/warning.svg";
import ErrorIcon from "@@/public/images/icons/error.svg";
import SuccessIcon from "@@/public/images/icons/success.svg";

import useStyles from "./AppToastContainer.styles";

import type {
  CloseButtonProps,
  IconProps,
  ToastContainerProps,
} from "react-toastify";

const ToastCloseButton = (props: CloseButtonProps) => {
  const { closeToast } = props;

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    closeToast(event);
  };

  return (
    <div>
      <AppIconButton
        variant="text"
        color="text.primary"
        size="small"
        borderRadius="circular"
        edge="xy"
        onClick={handleClose}
      >
        <AppSvgIcon component={CloseSmallIcon} fontSize="inherit" />
      </AppIconButton>
    </div>
  );
};

const ToastIcon = (props: IconProps) => {
  const { type } = props;

  if (type === "error")
    return <AppSvgIcon component={ErrorIcon} color="error.main" />;
  if (type === "success")
    return <AppSvgIcon component={SuccessIcon} color="success.main" />;
  if (type === "warning")
    return <AppSvgIcon component={WarningIcon} color="warning.main" />;
  if (type === "info")
    return <AppSvgIcon component={InfoIcon} color="info.main" />;

  return null;
};

const AppToastContainer = (props: ToastContainerProps) => {
  const { ...rest } = props;

  const { classes, cx } = useStyles();

  return (
    <Portal>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        icon={ToastIcon}
        closeButton={ToastCloseButton}
        limit={3}
        {...rest}
        className={(ctx) => {
          return cx(ctx?.defaultClassName, classes.root, {
            [classes.toastContainerTopLeft]: ctx?.position === "top-left",
            [classes.toastContainerTopRight]: ctx?.position === "top-right",
            [classes.toastContainerTopCenter]: ctx?.position === "top-center",
            [classes.toastContainerBottomLeft]: ctx?.position === "bottom-left",
            [classes.toastContainerBottomRight]:
              ctx?.position === "bottom-right",
            [classes.toastContainerBottomCenter]:
              ctx?.position === "bottom-center",
          });
        }}
        toastClassName={classes.toast}
        bodyClassName={classes.body}
      />
    </Portal>
  );
};

export default AppToastContainer;
