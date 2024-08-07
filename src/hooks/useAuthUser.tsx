import { eventBusService } from "@/services";
import { eventBusConstants } from "@/utils/constants";

import useAppSelector from "@/hooks/useAppSelector";

import type { LinkProps as NextLinkProps } from "next/link";
import type { SignInAndSignUpDialogOpenPayload } from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog";

const useAuthUser = () => {
  const $s_hasAuthUser = useAppSelector((state) => !!state.auth.user?.id);
  const $s_authUserChecking = useAppSelector(
    (state) => state.auth.userAuthChecking
  );

  const openSignInAndSignUpDialog = (
    payload?: SignInAndSignUpDialogOpenPayload
  ) => {
    eventBusService.dispatch(
      eventBusConstants.SIGN_IN_AND_SIGN_UP_DIALOG_OPEN,
      payload
    );
  };

  const handleAuthNavigationPush =
    (href?: NextLinkProps["href"]) => (event?: React.SyntheticEvent) => {
      if ($s_hasAuthUser) return;
      if (!!event) {
        event.preventDefault();
        event.stopPropagation();
      }
      openSignInAndSignUpDialog({
        href,
      });
    };

  return {
    authChecking: $s_authUserChecking,
    hasAuth: $s_hasAuthUser,
    openSignInAndSignUpDialog,
    handleAuthNavigationPush,
  };
};

export default useAuthUser;
