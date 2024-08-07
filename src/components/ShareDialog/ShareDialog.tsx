import { alpha } from "@mui/material/styles";

import { commonConfig } from "@/utils/config";

import { Box, ButtonBase, Link } from "@mui/material";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "react-share";
import AppDialog from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import AppTooltip from "@/components/AppTooltip";
import AppButton from "@/components/AppButton";
import AppSwiper from "@/components/AppSwiper";
import { SwiperSlide } from "swiper/react";

import FacebookFLetterSvg from "@@/public/images/svgs/facebook-f-letter.svg";
import MessengerSvg from "@@/public/images/svgs/messenger.svg";
import WhatsappSvg from "@@/public/images/svgs/whatsapp.svg";
import TwitterSvg from "@@/public/images/svgs/twitter.svg";
import GmailSvg from "@@/public/images/svgs/gmail.svg";
import MoreHorizIcon from "@@/public/images/icons/more-horiz.svg";
import LinkIcon from "@@/public/images/icons/link.svg";

import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./ShareDialog.styles";

import type { AppButtonProps } from "@/components/AppButton";

type SharedData = {
  title?: string;
  text?: string;
  url: string;
  hashtag?: string | string[];
};

export type ShareDialogProps = {
  data?: SharedData | null;
  open?: boolean;
  onClose: Function;
};

const CopyButton = (props: AppButtonProps) => {
  const { onClick, ...rest } = props;

  const [tooltipOpen, setToolTipOpen] = useState(false);

  const closeTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { t } = useTranslation();

  const handleTooltipClose = () => {
    clearTimeout(closeTooltipTimeoutRef.current);
    setToolTipOpen(false);
  };

  const handleCopyButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    clearTimeout(closeTooltipTimeoutRef.current);
    setToolTipOpen(true);
    closeTooltipTimeoutRef.current = setTimeout(() => {
      if (!isMounted()) return;
      setToolTipOpen(false);
    }, 1000);
    onClick && onClick(event);
  };

  useEffect(() => {
    return () => {
      clearTimeout(closeTooltipTimeoutRef.current);
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <AppTooltip
      title={t("copiedToClipboard")}
      placement="top"
      disableFocusListener
      disableHoverListener
      disableTouchListener
      onClose={handleTooltipClose}
      open={tooltipOpen}
    >
      <AppButton
        {...rest}
        variant="contained"
        color="primary"
        onClick={handleCopyButtonClick}
      >
        {t("copy")}
      </AppButton>
    </AppTooltip>
  );
};

const ShareDialog = (props: ShareDialogProps) => {
  const { open, data, onClose } = props;

  const { classes } = useStyles();

  const swiperRootElRef = useRef<HTMLDivElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const [swiperSpaceBetween, setSwiperSpaceBetween] = useState(0);

  const { t } = useTranslation();

  const handleAnotherAppShare = async () => {
    try {
      await navigator.share({
        title: data?.title ?? "",
        text: data?.text ?? "",
        url: data?.url ?? "",
      });
    } catch (_) {}
  };

  const handleUrlCopy = () => {
    const copyText = urlInputRef.current;
    if (!copyText) return;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  };

  const mediaSocials = useMemo(() => {
    const options = [
      {
        title: "Facebook",
        MediaSocialIcon: FacebookFLetterSvg,
        ModuleComponent: FacebookShareButton,
        ModuleProps: {
          url: data?.url ?? "",
          quote: data?.title ?? "",
          hashtag: Array.isArray(data?.hashtag)
            ? data!.hashtag.map((ht) => `#${ht}`).join(" ")
            : !!data?.hashtag
            ? `#${data?.hashtag}`
            : "",
        } as React.ComponentProps<typeof FacebookShareButton>,
        color: "#3D6AD6",
      },
      {
        title: "Messenger",
        MediaSocialIcon: MessengerSvg,
        ModuleComponent: FacebookMessengerShareButton,
        ModuleProps: {
          appId: commonConfig.FACEBOOK_APP_ID,
          url: data?.url ?? "",
        } as React.ComponentProps<typeof FacebookMessengerShareButton>,
        color: "#2196F3",
      },
      {
        title: "Whatsapp",
        MediaSocialIcon: WhatsappSvg,
        ModuleComponent: Link,
        ModuleProps: {
          href: `https://api.whatsapp.com/send?text=${data?.title} ${data?.url}"`,
          target: "_blank",
        } as React.ComponentProps<typeof Link>,
        color: "#4CAF50",
      },
      {
        title: "Twitter",
        MediaSocialIcon: TwitterSvg,
        ModuleComponent: TwitterShareButton,
        ModuleProps: {
          title: [
            data?.title,
            data?.text,
            Array.isArray(data?.hashtag)
              ? data!.hashtag.map((ht) => `#${ht}`).join(" ")
              : !!data?.hashtag
              ? `#${data?.hashtag}`
              : "",
          ]
            .filter((item) => !!item)
            .join("\n\n"),
          url: data?.url ?? window?.location?.href,
        } as React.ComponentProps<typeof TwitterShareButton>,
        color: "#000000",
      },
      {
        title: "Email",
        MediaSocialIcon: GmailSvg,
        ModuleComponent: EmailShareButton,
        ModuleProps: {
          subject: data?.title ?? "",
          title: data?.title ?? "",
          body: [
            data?.text,
            Array.isArray(data?.hashtag)
              ? data!.hashtag.map((ht) => `#${ht}`).join(" ")
              : !!data?.hashtag
              ? `#${data?.hashtag}`
              : "",
          ]
            .filter((item) => !!item)
            .join("\n\n"),
          url: data?.url,
          separator: "\n\n",
        } as React.ComponentProps<typeof EmailShareButton>,
        color: "#383838",
      },
    ];

    if (typeof window !== "undefined" && !!navigator.share) {
      options.push({
        title: t("shareMoreAnotherApp"),
        MediaSocialIcon: MoreHorizIcon,
        ModuleComponent: "div",
        ModuleProps: {
          onClick: handleAnotherAppShare,
        } as React.ComponentProps<typeof Box>,
        color: "#383838",
      } as any);
    }

    return options;
  }, [data, handleAnotherAppShare]);

  const handleSwiperRootObserver = () => {
    const swiperRootElWidth = swiperRootElRef.current?.offsetWidth ?? 0;

    open && setSwiperSpaceBetween(swiperRootElWidth >= 60 * 5 + 8 * 4 ? 0 : 8);
  };

  useEffect(() => {
    let swiperRootObserverTimeout;

    const swiperRootObserver = new MutationObserver(handleSwiperRootObserver);
    if (swiperRootElRef.current) {
      swiperRootObserver.observe(swiperRootElRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      swiperRootObserver.disconnect();
      clearTimeout(swiperRootObserverTimeout!);
    };
  });

  return (
    <AppDialog
      maxWidth="sm"
      scroll="body"
      mobileScroll="body"
      fullWidth
      open={!!open && !!data}
      onClose={onClose as any}
      onTransitionEnd={handleSwiperRootObserver}
    >
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("share")}
      </AppDialogTitle>
      <AppDialogContent>
        <AppTypography variant="bodyMed14" marginBottom={1.25}>
          {t("shareThisLinkVia")}
        </AppTypography>
        <AppSwiper
          rootProps={{
            ref: swiperRootElRef,
            className: classes.swiperRoot,
          }}
          slidesPerView={"auto"}
          spaceBetween={swiperSpaceBetween}
          freeMode
          navigation={{ enabled: true }}
          wrapperClass={classes.swiperWrapper}
        >
          {mediaSocials.map(
            (
              { MediaSocialIcon, ModuleComponent, ModuleProps, ...mediaSocial },
              mediaSocialIndex
            ) => (
              <SwiperSlide
                className={classes.mediaSocialSwiperSlide}
                key={mediaSocialIndex}
              >
                <AppTooltip title={mediaSocial.title} placement="top">
                  <Box
                    component="span"
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <Box
                      component={ModuleComponent as any}
                      {...(ModuleProps as any)}
                    >
                      <ButtonBase
                        component={
                          ((ModuleComponent as any) === "div"
                            ? "button"
                            : "div") as any
                        }
                        className={classes.mediaSocialButton}
                        sx={(theme) => ({
                          "--color": mediaSocial.color,
                          "--hovered-color": alpha(
                            mediaSocial.color,
                            theme.palette.action.hoverOpacity
                          ),
                        })}
                      >
                        <AppSvgIcon
                          className={classes.mediaSocialIcon}
                          component={MediaSocialIcon}
                        />
                      </ButtonBase>
                    </Box>
                  </Box>
                </AppTooltip>
              </SwiperSlide>
            )
          )}
        </AppSwiper>

        <AppTypography variant="bodyMed14" marginBottom={1.25}>
          {t("orCopySharedLink")}
        </AppTypography>
        <div className={classes.link}>
          <AppSvgIcon className={classes.linkIcon} component={LinkIcon} />
          <AppTypography flex={1} noWrap>
            {data?.url}
          </AppTypography>
          <CopyButton onClick={handleUrlCopy} />
          <Box
            component="input"
            readOnly
            ref={urlInputRef}
            value={data?.url}
            sx={{ display: "none" }}
          />
        </div>
      </AppDialogContent>
    </AppDialog>
  );
};

export default ShareDialog;
