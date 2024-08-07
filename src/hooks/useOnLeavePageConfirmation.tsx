import SingletonRouter, { Router } from "next/router";

import { alertDialogService } from "@/services";

import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import useEventCallback from "@/hooks/useEventCallback";

import type { AlertDialogOptions } from "@/services/alertDialog";
import type { AlertDialogServiceFireResponse } from "@/services/alertDialog/alertDialog.service";

type OnLeavePageConfirmationProps = {
  shouldConfirmLeave?: boolean;
  title?: string;
  message?: string;
  alertDialogServiceOptions?: AlertDialogOptions;
  alertDialogServiceBeforeFire?: () => Promise<any>;
  routeBeforeChange?: (payload: {
    alertDialogServiceFireResponse: AlertDialogServiceFireResponse;
  }) => Promise<any>;
};

const useOnLeavePageConfirmation = (props?: OnLeavePageConfirmationProps) => {
  const { t } = useTranslation();

  const {
    shouldConfirmLeave = false,
    title = t("leavePageConfirmationTitle"),
    message = t("leavePageConfirmationContent"),
    alertDialogServiceOptions,
    routeBeforeChange,
    alertDialogServiceBeforeFire,
  } = props || {};

  const executeRouteBeforeChange = useEventCallback(
    routeBeforeChange! ?? (() => {})
  );
  const executeAlertDialogServiceBeforeFire = useEventCallback(
    alertDialogServiceBeforeFire! ?? (() => {})
  );

  const fireLeaveConfirmationAlert = async () => {
    return await alertDialogService.fire({
      title,
      content: message,
      confirmButtonProps: {
        color: "common.darkNeutral",
        variant: "contained",
      },
      cancelButtonProps: {
        color: "common.darkNeutral",
        variant: "outlined",
      },
    });
  };

  useEffect(() => {
    if (!(SingletonRouter as any).router?.change) {
      return;
    }

    const originalChangeFunction = (SingletonRouter as any).router.change;
    const originalOnBeforeUnloadFunction = window.onbeforeunload;

    /*
     * Modifying the window.onbeforeunload event stops the browser tab/window from
     * being closed or refreshed. Since it is not possible to alter the close or reload
     * alert message, an empty string is passed to trigger the alert and avoid confusion
     * about the option to modify the message.
     */
    if (shouldConfirmLeave) {
      window.onbeforeunload = () => "";
    } else {
      window.onbeforeunload = originalOnBeforeUnloadFunction;
    }

    /*
     * Overriding the router.change function blocks Next.js route navigations
     * and disables the browser's back and forward buttons. This opens up the
     * possibility to use the window.confirm alert instead.
     */
    if (shouldConfirmLeave) {
      (SingletonRouter as any).router.change = async (...args: any[]) => {
        const [historyMethod, , as] = args;
        const currentUrl = (SingletonRouter as any).router?.state.asPath.split(
          "?"
        )[0];
        const changedUrl = as.split("?")[0];
        const hasNavigatedAwayFromPage = currentUrl !== changedUrl;
        const wasBackOrForwardBrowserButtonClicked =
          historyMethod === "replaceState";
        let confirmed = false;
        let alertDialogServiceFireResponse: AlertDialogServiceFireResponse;

        if (hasNavigatedAwayFromPage) {
          if (!!alertDialogServiceBeforeFire) {
            const blocked = await executeAlertDialogServiceBeforeFire();
            if ((blocked as any) === false) return;
          }
          alertDialogServiceFireResponse = await alertDialogService.fire({
            title,
            content: message,
            confirmButtonProps: {
              color: "common.darkNeutral",
              variant: "contained",
            },
            cancelButtonProps: {
              color: "common.darkNeutral",
              variant: "outlined",
            },
            ...alertDialogServiceOptions,
          });
          confirmed = alertDialogServiceFireResponse.isConfirmed!!;
        }

        if (confirmed) {
          if (!!routeBeforeChange) {
            await executeRouteBeforeChange({
              alertDialogServiceFireResponse: alertDialogServiceFireResponse!,
            });
          }

          (Router as any).prototype.change.apply(
            (SingletonRouter as any).router,
            args
          );
        } else if (
          wasBackOrForwardBrowserButtonClicked &&
          hasNavigatedAwayFromPage
        ) {
          /*
           * The URL changes even if the user clicks "false" to navigate away from the page.
           * It is necessary to update it to reflect the current URL.
           */
          await (SingletonRouter as any).router?.push(
            (SingletonRouter as any).router?.state.asPath
          );

          /*
           * @todo
           *   I attempted to determine if the user clicked the forward or back button on the browser,
           *   but was unable to find a solution after several hours of effort. As a result, I temporarily
           *   hardcoded it to assume the back button was clicked, since that is the most common scenario.
           *   However, this may cause issues with the URL if the forward button is actually clicked.
           *   I hope that a solution can be found in the future.
           */
          const browserDirection = "back";

          browserDirection === "back"
            ? history.go(1) // back button
            : history.go(-1); // forward button
        }
      };
    }

    /*
     * When the component is unmounted, the original change function is assigned back.
     */
    return () => {
      (SingletonRouter as any).router.change = originalChangeFunction;
      window.onbeforeunload = originalOnBeforeUnloadFunction;
    };
  }, [shouldConfirmLeave, message, title, routeBeforeChange]);

  return {
    fireLeaveConfirmationAlert,
  };
};

export default useOnLeavePageConfirmation;
