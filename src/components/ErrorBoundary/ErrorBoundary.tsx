import { storageService } from "@/services";

import { Component } from "react";
import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";

import N500Svg from "@@/public/images/svgs/500.svg";

import { withTranslation } from "next-i18next";

import { withStyles } from "tss-react/mui";

import type { WithTranslation } from "react-i18next";

interface Props extends WithTranslation<"translation", "common"> {
  children?: React.ReactNode;
  classes?: Partial<Record<"content" | "n500Svg", string>>;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error) {
    console.error("Uncaught error:", error.message);
    storageService.clearLocal();
    storageService.clearSession();
  }

  public handleGoToHome() {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/") window.location.reload();
  }

  public render() {
    const { classes, children, t } = this.props;

    if (this.state.hasError) {
      return (
        <div>
          <AppContainer maxWidth="sm">
            <div className={classes!.content}>
              <N500Svg className={classes!.n500Svg} />
              <AppTypography
                variant="bodyMed18"
                align="center"
                textTransform="capitalize"
                marginBottom={6}
              >
                {t("internalServerError")}
              </AppTypography>
              <AppButton
                fullWidth
                noWrap
                variant="contained"
                color="primary"
                component={AppLink}
                underline="none"
                hoverColor="none"
                href={{
                  pathname: "/",
                }}
                onClick={this.handleGoToHome}
                sx={{ width: 320, maxWidth: "100%" }}
              >
                {t("backToHome")}
              </AppButton>
            </div>
          </AppContainer>
        </div>
      );
    }

    return children;
  }
}

const ErrorBoundaryStyled = withStyles(ErrorBoundary, (theme) => {
  return {
    content: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as any,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
    },
    n500Svg: {
      height: 140,
      marginBottom: theme.spacing(3),
    },
  };
});

const ErrorBoundaryStyledWithTranslation =
  withTranslation()(ErrorBoundaryStyled);

export default ErrorBoundaryStyledWithTranslation;
