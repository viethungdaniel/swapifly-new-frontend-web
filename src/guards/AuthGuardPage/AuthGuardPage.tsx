import { SIGN_UP_VIEW } from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.constants";

import AppTypography from "@/components/AppTypography";
import AppContainer from "@/components/AppContainer";
import AppButton from "@/components/AppButton";
import AppContent from "@/components/AppContent";

import N401Svg from "@@/public/images/svgs/401.svg";

import { useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./AuthGuardPage.styles";

type AuthGuardPageProps = {
  children?: React.ReactNode | React.ReactNode[];
};

const AuthGuardPage = (props: AuthGuardPageProps) => {
  const { children } = props;

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const { classes } = useStyles();

  const { t } = useTranslation();

  const handleSignInDialogOpen = () => {
    openSignInAndSignUpDialog();
  };

  const handleSignUpDialogOpen = () => {
    openSignInAndSignUpDialog({
      view: SIGN_UP_VIEW,
    });
  };

  if (!!hasAuth) return children;

  return (
    <AppContainer className={classes.root} maxWidth="xs">
      <AppContent className={classes.content}>
        <N401Svg className={classes.n401Svg} />
        <AppTypography
          variant="bodySemi18"
          align="center"
          textTransform="capitalize"
          marginBottom={6}
        >
          {t("pleaseLoginOrRegisterFirst")}
        </AppTypography>
        <AppButton
          fullWidth
          variant="contained"
          sx={{ mb: 3 }}
          onClick={handleSignInDialogOpen}
        >
          {t("login")}
        </AppButton>
        <AppButton
          fullWidth
          variant="outlined"
          onClick={handleSignUpDialogOpen}
        >
          {t("register")}
        </AppButton>
      </AppContent>
    </AppContainer>
  );
};

export default AuthGuardPage;
