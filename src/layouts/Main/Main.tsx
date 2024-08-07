import { NoSsr } from "@mui/material";
import MainHeader from "@/containers/MainHeader";
import MainFooter from "@/components/MainFooter";
import MainBottomAppBar from "@/components/MainBottomAppBar";
import FloatActions from "./components/FloatActions";
import GoogleOneTabLogin from "@/containers/GoogleOneTabLogin";
import CookieConsentAppBar from "@/components/CookieConsentAppBar";

import useStyles from "./Main.styles";

type MainProps = {
  children: React.ReactNode;
  disabledMainHeaderMobileHomeIconButton?: boolean;
  disabledMainFooter?: boolean;
  disabledMainBottomAppBar?: boolean;
  disabledSellIconButton?: boolean;
  disabledMainBottomAppBarToolbar?: boolean;
  disabledFloatActions?: boolean;
};

const Main = (props: MainProps) => {
  const {
    disabledMainFooter,
    disabledMainBottomAppBar,
    disabledMainBottomAppBarToolbar,
    disabledSellIconButton,
    disabledMainHeaderMobileHomeIconButton,
    disabledFloatActions,
    children,
  } = props;

  const { classes } = useStyles();

  return (
    <>
      <GoogleOneTabLogin />
      <div className={classes.root}>
        <MainHeader
          disabledMobileHomeIconButton={disabledMainHeaderMobileHomeIconButton}
        />
        <main className={classes.main}>{children}</main>
        <NoSsr>
          {!disabledMainFooter && <MainFooter />}
          <MainBottomAppBar
            disabledAppBar={disabledMainBottomAppBar}
            disabledAppBarToolbar={disabledMainBottomAppBarToolbar}
          />
          {!disabledFloatActions && (
            <FloatActions disabledSellIconButton={disabledSellIconButton} />
          )}
          <CookieConsentAppBar />
        </NoSsr>
      </div>
    </>
  );
};

export default Main;
