import { alertDialogService, eventBusService } from "@/services";
import { eventBusConstants } from "@/utils/constants";
import {
  PRIVACY_POLICY_VIEW,
  RESET_PASSWORD_VIEW,
  SELECT_PREFERENCES_VIEW,
  SIGN_IN_VIEW,
  SIGN_UP_VIEW,
  TERMS_OF_SERVICE_VIEW,
} from "./SignInAndSignUpDialog.constants";

import { Box } from "@mui/material";
import AppDialog from "@/components/AppDialog";
import ViewSignIn from "./components/ViewSignIn";
import ViewSignUp from "./components/ViewSignUp";
import ViewTermsOfService from "./components/ViewTermsOfService";
import ViewPrivacyPolicy from "./components/ViewPrivacyPolicy";
import ViewResetPassword from "./components/ViewResetPassword";
import ViewSelectPreferences from "./components/ViewSelectPreferences";

import SignInAndSignUpDialogContext from "./SignInAndSignUpDialog.context";

import { useContext, useEffect, useRef, useState } from "react";
import {
  useAuthUser,
  useEventCallback,
  useIsMounted,
  useIsomorphicLayoutEffect,
  useOnLeavePageConfirmation,
  usePrevious,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import type { LinkProps as NextLinkProps } from "next/link";
import type { ViewSignUpApiRef } from "@/containers/SignInAndSignUpDialog/components/ViewSignUp/ViewSignUp";

export type SignInAndSignUpDialogOpenPayload = {
  href?: NextLinkProps["href"];
  view?: string;
  hasNewUserAlert?: boolean;
} | null;

const views = [
  PRIVACY_POLICY_VIEW,
  RESET_PASSWORD_VIEW,
  SELECT_PREFERENCES_VIEW,
  SIGN_IN_VIEW,
  SIGN_UP_VIEW,
  TERMS_OF_SERVICE_VIEW,
];

const ViewBox = (
  props: React.ComponentProps<typeof Box> & { show?: boolean }
) => {
  const { show, ...rest } = props;

  return (
    <Box
      flexDirection="inherit"
      overflow="inherit"
      maxHeight="inherit"
      width="100%"
      flex={1}
      {...rest}
      sx={{
        ...props.sx,
        display: !show ? "none" : "inherit",
      }}
    />
  );
};

const CloseDialogOnHasAuth = () => {
  const { closeSignInAndSignUpDialogOnAuth } = useContext(
    SignInAndSignUpDialogContext
  );

  const { hasAuth } = useAuthUser();

  useEffect(() => {
    if (!isMounted()) return;
    hasAuth && closeSignInAndSignUpDialogOnAuth();
  }, [hasAuth]);

  const isMounted = useIsMounted();

  return null;
};

const SignInAndSignUpDialog = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(SIGN_IN_VIEW);
  const [
    signInAndSignUpDialogOpenPayload,
    setSignInAndSignUpDialogOpenPayload,
  ] = useState<SignInAndSignUpDialogOpenPayload>(null);
  const prevView = usePrevious(view);

  const dialogElRef = useRef<HTMLDivElement>();
  const viewSignUpApiRef = useRef<ViewSignUpApiRef | null>(null);

  const { t } = useTranslation();

  const { fireLeaveConfirmationAlert } = useOnLeavePageConfirmation();

  const handleSignInAndSignUpDialogClose = async () => {
    if (view === SIGN_UP_VIEW && !!viewSignUpApiRef.current) {
      const formFiling = viewSignUpApiRef.current.isFillingForm();
      if (formFiling) {
        const { isConfirmed } = await fireLeaveConfirmationAlert();
        if (!isConfirmed) return;
      }
    }
    viewSignUpApiRef.current && viewSignUpApiRef.current.resetForm();
    setOpen(false);
  };
  const closeSignInAndSignUpDialogOnAuth = useEventCallback(() => {
    if (view === SELECT_PREFERENCES_VIEW && prevView === SIGN_UP_VIEW) return;
    if (view === SIGN_UP_VIEW && !!viewSignUpApiRef.current) {
      viewSignUpApiRef.current && viewSignUpApiRef.current.resetForm();
    }
    setOpen(false);
  });

  const handleSignInAndSignUpDialogOpen = async (
    payload: SignInAndSignUpDialogOpenPayload
  ) => {
    setOpen(true);
    setSignInAndSignUpDialogOpenPayload(payload ?? null);
    views.includes(payload?.view!) && setView(payload!.view!);
    if (!!payload?.hasNewUserAlert) {
      const { name } = await alertDialogService.fire({
        content: t("newUserConfirmationContent"),
        actions: [
          {
            name: "CANCEL",
            children: t("cancel"),
            buttonProps: {
              variant: "outlined",
              color: "text.primary",
            },
          },
          {
            name: SIGN_UP_VIEW,
            children: t("registerNow"),
            buttonProps: {
              color: "primary",
              variant: "contained",
            },
          },
        ],
      });
      if (name === SIGN_UP_VIEW) {
        setView(SIGN_UP_VIEW);
      }
    }
  };

  const handleViewSignInPush = () => {
    setView(SIGN_IN_VIEW);
  };

  const handleViewSignUpPush = () => {
    setView(SIGN_UP_VIEW);
  };

  const handleViewTermsOfServicePush = () => {
    setView(TERMS_OF_SERVICE_VIEW);
  };

  const handleViewPrivacyPolicyPush = () => {
    setView(PRIVACY_POLICY_VIEW);
  };

  const handleViewResetPasswordPush = () => {
    setView(RESET_PASSWORD_VIEW);
  };

  const handleViewSelectPreferencesPush = () => {
    setView(SELECT_PREFERENCES_VIEW);
  };

  useIsomorphicLayoutEffect(() => {
    const dialogEl = dialogElRef.current;
    if (!!dialogEl) {
      const dialogScrollBodyEl = dialogEl.querySelector(
        ".MuiDialog-scrollBody"
      );
      if (!!dialogScrollBodyEl) {
        dialogScrollBodyEl.scrollTop = 0;
      }
    }
  }, [view]);

  useEffect(() => {
    eventBusService.on(
      eventBusConstants.SIGN_IN_AND_SIGN_UP_DIALOG_OPEN,
      handleSignInAndSignUpDialogOpen
    );
    return () => {
      eventBusService.remove(
        eventBusConstants.SIGN_IN_AND_SIGN_UP_DIALOG_OPEN,
        handleSignInAndSignUpDialogOpen
      );
    };
  }, [handleSignInAndSignUpDialogOpen]);

  return (
    <SignInAndSignUpDialogContext.Provider
      value={{
        signInAndSignUpDialogOpen: !!open,
        view,
        setView,
        signInAndSignUpDialogOpenPayload,
        closeSignInAndSignUpDialogOnAuth,
        handleSignInAndSignUpDialogClose,
        handleViewSignInPush,
        handleViewSignUpPush,
        handleViewTermsOfServicePush,
        handleViewPrivacyPolicyPush,
        handleViewResetPasswordPush,
        handleViewSelectPreferencesPush,
      }}
    >
      <AppDialog
        fullWidth
        keepMounted
        mobileFullScreen
        mobileScroll={
          [
            SELECT_PREFERENCES_VIEW,
            TERMS_OF_SERVICE_VIEW,
            PRIVACY_POLICY_VIEW,
            RESET_PASSWORD_VIEW,
          ].includes(view)
            ? "paper"
            : "body"
        }
        scroll={[SELECT_PREFERENCES_VIEW].includes(view) ? "paper" : "body"}
        maxWidth="sm"
        open={open}
        ref={dialogElRef as any}
        sx={{
          pointerEvents: open ? "auto" : "none",
        }}
        onClose={handleSignInAndSignUpDialogClose}
        onTransitionEnd={() => {
          if (!open) {
            !open && setView(SIGN_IN_VIEW);
          }
        }}
      >
        <CloseDialogOnHasAuth />
        <ViewBox show={view === SIGN_IN_VIEW}>
          <ViewSignIn />
        </ViewBox>
        <ViewBox show={view === SIGN_UP_VIEW}>
          <ViewSignUp apiRef={viewSignUpApiRef} />
        </ViewBox>
        <ViewBox show={view === RESET_PASSWORD_VIEW}>
          <ViewResetPassword />
        </ViewBox>
        <ViewBox show={view === TERMS_OF_SERVICE_VIEW}>
          <ViewTermsOfService />
        </ViewBox>
        <ViewBox show={view === PRIVACY_POLICY_VIEW}>
          <ViewPrivacyPolicy />
        </ViewBox>
        <ViewBox show={view === SELECT_PREFERENCES_VIEW}>
          <ViewSelectPreferences />
        </ViewBox>
      </AppDialog>
    </SignInAndSignUpDialogContext.Provider>
  );
};

export default SignInAndSignUpDialog;
