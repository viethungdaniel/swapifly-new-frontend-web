import { useEffect, useRef, useState } from "react";

import { eventBusService } from "@/services";
import {
  ALERT_DIALOG_CLOSE,
  ALERT_DIALOG_FIRE,
} from "@/utils/constants/eventBus.constants";
import { AlertDialogOptions } from "@/services/alertDialog";
import { isEmpty } from "@/utils/helpers/common";

import AppDialogTitle from "@/components/AppDialogTitle";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogActions from "@/components/AppDialogActions";
import AppDialog from "@/components/AppDialog";
import AppButton from "@/components/AppButton";
import AppTypography from "@/components/AppTypography";
import AppContainer from "@/components/AppContainer";

import { useTranslation } from "next-i18next";
import { useEventCallback } from "@/hooks";

import useStyles from "./AlertDialog.styles";

const defaultConfirmButtonProps: Partial<
  AlertDialogOptions["confirmButtonProps"]
> = {
  show: true,
  children: "ok",
  color: "text.primary",
  variant: "contained",
};
const defaultCancelButtonProps: Partial<
  AlertDialogOptions["cancelButtonProps"]
> = {
  show: true,
  children: "cancel",
  color: "text.primary",
  variant: "outlined",
};

const AlertDialog = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AlertDialogOptions>({
    title: "",
    content: "",
    actions: null,
    disabledActions: false,
    confirmButtonProps: {
      ...defaultConfirmButtonProps,
      children: t(defaultConfirmButtonProps.children as unknown as string),
    },
    cancelButtonProps: {
      ...defaultCancelButtonProps,
      children: t(defaultCancelButtonProps.children as unknown as string),
    },
  });

  // const confirmButtonPropsShow = !!options.confirmButtonProps?.show
  // const cancelButtonPropsShow = !!options.cancelButtonProps?.show

  const {
    title,
    content,
    disabledActions,
    actions,
    confirmButtonProps,
    cancelButtonProps,
  } = options;

  const { show: confirmButtonPropsShow, ...otherConfirmButtonProps } =
    confirmButtonProps || {};
  const { show: cancelButtonPropsShow, ...otherCancelButtonProps } =
    cancelButtonProps || {};

  const resolveRef = useRef<Function | null>(null);
  const resolve = resolveRef.current;

  const handleClose = (params: any) => {
    setOpen(false);
    resolve && resolve(params);
    removePromiseMethod();
  };
  const removePromiseMethod = () => {
    resolveRef.current = null;
  };

  const updateOptions = useEventCallback(
    (data: any, resolveFromPromise: any) => {
      resolveRef.current = resolveFromPromise;
      setOptions({
        ...options,
        title: "",
        content: "",
        actions: null,
        ...data,
        confirmButtonProps: {
          ...defaultConfirmButtonProps,
          children: t(defaultConfirmButtonProps.children as unknown as string),
          ...data?.confirmButtonProps,
        },
        cancelButtonProps: {
          ...defaultCancelButtonProps,
          children: t(defaultCancelButtonProps.children as unknown as string),
          ...data?.cancelButtonProps,
        },
      });
      setOpen(true);
    }
  );

  const closeAlertDialog = () => {
    handleClose({ isConfirmed: false });
  };

  const { classes, cx } = useStyles();

  useEffect(() => {
    eventBusService.on(ALERT_DIALOG_FIRE, updateOptions);
    eventBusService.on(ALERT_DIALOG_CLOSE, closeAlertDialog);
    return () => {
      eventBusService.remove(ALERT_DIALOG_CLOSE, closeAlertDialog);
      eventBusService.remove(ALERT_DIALOG_FIRE, updateOptions);
      removePromiseMethod();
    };
  }, []);

  return (
    <AppDialog
      open={open}
      classes={{
        root: classes.dialog,
        paper: classes.dialogPaper,
      }}
      maxWidth="xs"
      scroll="body"
      onClose={() => handleClose({ isConfirmed: false })}
    >
      {!isEmpty(title) && (
        <AppDialogTitle
          appClasses={{
            title: classes.dialogTitleText,
          }}
          align="center"
        >
          {title}
        </AppDialogTitle>
      )}
      {!isEmpty(content) && (
        <AppDialogContent className={classes.dialogContent}>
          <AppTypography align="center">{content}</AppTypography>
        </AppDialogContent>
      )}
      {!disabledActions && (
        <AppDialogActions>
          <AppContainer
            className={classes.dialogActions}
            maxWidth="xs"
            disableGutters
          >
            {Array.isArray(actions) ? (
              actions.map((action, actIndex) => (
                <AppButton
                  key={actIndex}
                  onClick={() =>
                    handleClose({
                      payload: action.payload,
                      name: action.name,
                      isConfirmed: !!action.isConfirmAction,
                    })
                  }
                  color="text.primary"
                  autoFocus
                  noWrap
                  fullWidth
                  {...action.buttonProps}
                >
                  {action.children}
                </AppButton>
              ))
            ) : actions ? (
              actions
            ) : (
              <>
                {cancelButtonPropsShow && (
                  <AppButton
                    noWrap
                    fullWidth
                    {...otherCancelButtonProps}
                    className={cx(
                      otherCancelButtonProps?.className &&
                        otherCancelButtonProps.className
                    )}
                    onClick={() => handleClose({ isConfirmed: false })}
                  />
                )}
                {confirmButtonPropsShow && (
                  <AppButton
                    noWrap
                    fullWidth
                    {...otherConfirmButtonProps}
                    className={cx(
                      otherConfirmButtonProps?.className &&
                        otherConfirmButtonProps.className
                    )}
                    onClick={() => handleClose({ isConfirmed: true })}
                  />
                )}
              </>
            )}
          </AppContainer>
        </AppDialogActions>
      )}
    </AppDialog>
  );
};

export default AlertDialog;
