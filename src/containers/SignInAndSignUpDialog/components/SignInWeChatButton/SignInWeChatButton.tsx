import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import WechatIcon from "@@/public/images/icons/wechat.svg";

import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { useRouter } from "next/router";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import type { AppButtonProps } from "@/components/AppButton";

type SignInWeChatButtonProps = Omit<
  AppButtonProps,
  "children" | "variant" | "color" | "fullWidth" | "startIcon"
>;

const SignInWeChatButton = (props: SignInWeChatButtonProps) => {
  const { onClick, ...rest } = props;

  const router = useRouter();

  const { t, i18n } = useTranslation();

  const { signInAndSignUpDialogOpenPayload } = useContext(
    SignInAndSignUpDialogContext
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.location.href = `/api/auth/wechat/qrconnect?redirect_path=${
      typeof signInAndSignUpDialogOpenPayload?.href === "string" &&
      !!signInAndSignUpDialogOpenPayload?.href
        ? signInAndSignUpDialogOpenPayload?.href
        : router.asPath
    }&language=${i18n.language}&context=signin`;
    onClick && onClick(event);
  };

  return (
    <AppButton
      {...rest}
      variant="contained"
      color="common.weChat"
      textColor="common.white"
      fullWidth
      noWrap
      startIcon={<AppSvgIcon component={WechatIcon} fontSize="inherit" />}
      onClick={handleClick}
    >
      {t("continueWithWeChat")}
    </AppButton>
  );
};

export default SignInWeChatButton;
