import { commonHelpers, imageHelpers, userHelpers } from "@/utils/helpers";

import {
  Box,
  ClickAwayListener,
  Grow,
  Popper,
  useMediaQuery,
} from "@mui/material";
import AppAvatar from "@/components/AppAvatar";
import AppPaper from "@/components/AppPaper";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemText from "@/components/AppListItemText";
import AppListItemIcon from "@/components/AppListItemIcon";
import FollowButton from "@/views/SlugUser/components/FollowButton";
import ReportButton from "@/views/SlugUser/components/ReportButton";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppButton from "@/components/AppButton";
import AppTooltip from "@/components/AppTooltip";
import AppLink from "@/components/AppLink";
import GalleryDialog from "@/components/GalleryDialog";
import ShareButton from "@/views/SlugUser/components/ShareButton";

import EditIcon from "@@/public/images/icons/edit.svg";
import VerifiedEmailIcon from "@@/public/images/icons/verified-email.svg";
import VerifiedPhoneIcon from "@@/public/images/icons/verified-phone.svg";
import MerchantCircularTagSvg from "@@/public/images/svgs/merchant-circular-tag.svg";
import StarSvg from "@@/public/images/svgs/star.svg";
import ShieldSvg from "@@/public/images/icons/shield.svg";
import ArrowDownSvg from "@@/public/images/icons/arrow-down.svg";
import CheckCircleIcon from "@@/public/images/icons/check-circle.svg";

import { useMemo, useState } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./UserInfo.styles";

import type { GalleryDialogProps } from "@/components/GalleryDialog";
import AppChip from "@/components/AppChip";

const MerchantVerifiedDropdown = () => {
  const [menuPopperAnchorEl, setMenuPopperAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [menuPopperOpen, setMenuPopperOpen] = useState(false);

  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_userShopNumber = useAppSelector(
    (state) => state.user.user?.shop?.shop
  );
  const $s_userShopExistingBrVerified = useAppSelector(
    (state) => state.auth?.userShop?.existing_br_verified
  );
  const $s_userShopOnlineShopVerified = useAppSelector(
    (state) => state.auth?.userShop?.online_shop_verified
  );
  const $s_userShopPhysicalAddressVerified = useAppSelector(
    (state) => state.auth?.userShop?.physical_address_verified
  );

  const isOwner = $s_authUserId === $s_userId;

  const merchantVerified = useMemo(() => {
    return userHelpers.isMerchant($s_userShopNumber);
  }, [$s_userShopNumber]);

  const handleMenuPopperToggle = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!isOwner) return;
    setMenuPopperAnchorEl(event.currentTarget);
    setMenuPopperOpen((prevMenuPopperOpen) => !prevMenuPopperOpen);
  };

  const handleMenuPopperClose = () => {
    setMenuPopperOpen(false);
  };

  return (
    <>
      <AppButton
        className={classes.merchantVerifiedDropdownButton}
        color="common.blue"
        variant="containedTonal"
        startIcon={<AppSvgIcon component={ShieldSvg} fontSize="inherit" />}
        endIcon={
          !!merchantVerified && !!isOwner ? (
            <AppSvgIcon
              className={classes.merchantVerifiedDropdownArrowDownIcon}
              component={ArrowDownSvg}
              fontSize="inherit"
              sx={{
                rotate: menuPopperOpen ? "180deg" : "0deg",
              }}
            />
          ) : undefined
        }
        disabled={!merchantVerified}
        disableRipple={!isOwner}
        sx={{ textTransform: "initial" }}
        onClick={handleMenuPopperToggle}
      >
        {t(!!merchantVerified ? "merchantVerified" : "merchantNotYetVerified")}
      </AppButton>
      <Popper
        anchorEl={menuPopperAnchorEl}
        open={menuPopperOpen}
        placement="bottom-start"
        transition
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
        ]}
        style={{
          zIndex: theme.zIndex.tooltip,
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleMenuPopperClose as any}>
            <Grow
              {...TransitionProps}
              timeout={theme.transitions.duration.shortest}
              style={{ transformOrigin: "0 0 0" }}
            >
              <AppPaper boxShadowVariant="menuPopper">
                <AppList>
                  {[
                    "physicalAddressVerified",
                    "onlineShopVerified",
                    "existingBRVerified",
                  ].map((content, contentIndex) => {
                    let checked = false;
                    if (contentIndex === 0) {
                      checked = !!$s_userShopPhysicalAddressVerified;
                    }
                    if (contentIndex === 1) {
                      checked = !!$s_userShopOnlineShopVerified;
                    }
                    if (contentIndex === 2) {
                      checked = !!$s_userShopExistingBrVerified;
                    }
                    return (
                      <AppListItem
                        className={classes.merchantVerifiedMenuItem}
                        key={contentIndex}
                      >
                        <AppListItemIcon
                          className={classes.merchantVerifiedMenuItemIcon}
                        >
                          <AppSvgIcon
                            component={CheckCircleIcon}
                            fontSize="inherit"
                            color={checked ? "common.blue" : "text.disabled"}
                          />
                        </AppListItemIcon>
                        <AppListItemText
                          className={classes.merchantVerifiedMenuItemText}
                          primary={t(content)}
                          primaryTypographyProps={{
                            color: checked ? "text.primary" : "text.disabled",
                          }}
                        />
                      </AppListItem>
                    );
                  })}
                </AppList>
              </AppPaper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

const UserAvatar = () => {
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [galleryDialogItems, setGalleryDialogItems] = useState<
    GalleryDialogProps["items"]
  >([]);

  const $s_userShopNumber = useAppSelector(
    (state) => state.user.user?.shop?.shop
  );
  const $s_userNickname = useAppSelector(
    (state) => state.user.user?.shop?.nickname
  );
  const $s_userAvatar = useAppSelector(
    (state) => state.user.user?.shop?.avatar
  );

  const merchantVerified = useMemo(() => {
    return userHelpers.isMerchant($s_userShopNumber);
  }, [$s_userShopNumber]);

  const { classes } = useStyles();

  const handleGalleryDialogOpen = () => {
    if (!$s_userAvatar) return;
    setGalleryDialogOpen(true);
    setGalleryDialogItems([
      {
        src: imageHelpers.imagePathLoader($s_userAvatar),
        title: $s_userNickname ?? "",
        type: "image",
        thumbnail: imageHelpers.imagePathLoader($s_userAvatar),
      },
    ]);
  };

  const handleGalleryDialogClose = () => {
    setGalleryDialogOpen(false);
  };

  return (
    <>
      <div className={classes.userAvatar}>
        <AppAvatar
          src={
            !!$s_userAvatar
              ? imageHelpers.appImageLoader({
                  src: $s_userAvatar,
                })
              : undefined
          }
          imgProps={{
            alt: $s_userNickname,
          }}
          className={classes.userAvatarPhoto}
          sx={{
            cursor: !!$s_userAvatar ? "pointer" : "auto",
          }}
          onClick={handleGalleryDialogOpen}
        />
        {merchantVerified && (
          <MerchantCircularTagSvg className={classes.userAvatarMerchantTag} />
        )}
      </div>
      <GalleryDialog
        open={galleryDialogOpen}
        items={galleryDialogItems}
        onClose={handleGalleryDialogClose}
      />
    </>
  );
};

const UserInfo = () => {
  const { classes, theme, cx } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_userNickname = useAppSelector(
    (state) => state.user.user?.shop?.nickname
  );
  const $s_userUsername = useAppSelector(
    (state) => state.user.user?.shop?.username
  );
  const $s_userStarPoint = useAppSelector(
    (state) => state.user.user?.shop?.point_average
  );
  const $s_userReviewCount = useAppSelector(
    (state) => state.user.user?.shop?.e_num
  );
  const $s_userEmail = useAppSelector((state) => state.user.user?.shop?.email);
  const $s_userPhone = useAppSelector((state) => state.user.user?.shop?.phone);
  const $s_userFollowerCount = useAppSelector(
    (state) => state.user.user?.shop?.followers
  );
  const $s_userFollowingCount = useAppSelector(
    (state) => state.user.user?.shop?.following
  );
  const $s_userShopMerchantLocation = useAppSelector(
    (state) => state.user.user?.shop?.merchant_location
  );

  return (
    <div className={classes.root}>
      {isTabletDown && (
        <div className={classes.floatAction}>
          <ShareButton viewMode="mobile" />
          {$s_userId !== $s_authUserId && <ReportButton viewMode="mobile" />}
        </div>
      )}
      <UserAvatar />
      <div>
        <AppTypography variant="headerSemi35">{$s_userNickname}</AppTypography>
        <AppTypography
          className={classes.userInfoBottom}
          variant="bodyReg14"
          color="textSecondary"
        >
          @
          {commonHelpers.generateUserSlug({
            id: $s_userId,
            nickname: $s_userNickname,
            username: $s_userUsername,
          })}
        </AppTypography>
        <AppTypography
          className={cx(classes.userInfoText, classes.userInfoBottom)}
        >
          {commonHelpers.formatNumber($s_userStarPoint || 0)}{" "}
          <AppSvgIcon component={StarSvg} fontSize="small" />
          {!!$s_userReviewCount
            ? `(${t("reviewWithCount", {
                count: $s_userReviewCount,
              })})`
            : t("noReviewsYet")}
        </AppTypography>
        <AppTypography
          className={cx(classes.userInfoText, classes.userInfoBottom)}
        >
          {t("verified")}
          <AppTooltip title="Email">
            <Box display="flex" component="span">
              <AppSvgIcon
                className={cx(
                  classes.userInfoIcon,
                  !$s_userEmail && classes.disabled
                )}
                fontSize="small"
                component={VerifiedEmailIcon}
              />
            </Box>
          </AppTooltip>
          <AppTooltip title={t("phoneNumber")}>
            <Box display="flex" component="span">
              <AppSvgIcon
                className={cx(
                  classes.userInfoIcon,
                  !$s_userPhone && classes.disabled
                )}
                fontSize="small"
                component={VerifiedPhoneIcon}
              />
            </Box>
          </AppTooltip>
        </AppTypography>
        <AppTypography className={classes.userInfoText}>
          {t("followerWithCount", {
            count: $s_userFollowerCount || 0,
          })}{" "}
          {t("followingWithCount", {
            count: $s_userFollowingCount || 0,
          })}
        </AppTypography>

        {!!$s_userShopMerchantLocation?.id && (
          <AppChip
            sx={{ mt: 1 }}
            color="common.blue"
            size="small"
            title={$s_userShopMerchantLocation.label_name}
            label={$s_userShopMerchantLocation.label_name}
          />
        )}

        <MerchantVerifiedDropdown />
        {isTabletDown && $s_userId !== $s_authUserId && (
          <FollowButton viewMode="mobile" sx={{ mb: 1.25 }} />
        )}
        {isTabletDown && $s_userId === $s_authUserId && (
          <AppButton
            fullWidth
            variant="outlined"
            color="text.primary"
            startIcon={<AppSvgIcon component={EditIcon} fontSize="inherit" />}
            sx={{ mb: 1.25 }}
            component={AppLink}
            underline="none"
            hoverColor="none"
            href="/user/account/profile"
          >
            {t("editProfile")}
          </AppButton>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
