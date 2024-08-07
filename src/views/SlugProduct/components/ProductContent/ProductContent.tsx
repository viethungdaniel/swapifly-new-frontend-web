import { commonHelpers, imageHelpers } from "@/utils/helpers";
import { productConstants, userConstants } from "@/utils/constants";
import { storeAdSelectors } from "@/store";

import { Box, Divider, Grid } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";
import AppTooltip from "@/components/AppTooltip";
import AppAvatar from "@/components/AppAvatar";
import ReadMoreTypography from "@/components/ReadMoreTypography";
import AppChip from "@/components/AppChip";
import HtmlParser from "@/components/HtmlParser";
import AdCard from "@/components/AdCard";

import AccessTimeIcon from "@@/public/images/icons/access-time.svg";
import HeartOutlinedIcon from "@@/public/images/icons/heart-outlined.svg";
import CubeBoxIcon from "@@/public/images/icons/cube-box.svg";
import InfoIcon from "@@/public/images/icons/info.svg";
import BrandIcon from "@@/public/images/icons/brand.svg";
import VeryResponsiveIcon from "@@/public/images/icons/very-responsive.svg";
import VerifiedEmailIcon from "@@/public/images/icons/verified-email.svg";
import VerifiedPhoneIcon from "@@/public/images/icons/verified-phone.svg";
import StarIcon from "@@/public/images/icons/star.svg";
import LocationIcon from "@@/public/images/icons/location.svg";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./ProductContent.styles";

const LikeCount = () => {
  const $s_productLikeCount = useAppSelector(
    (state) => state.product.product?.product?.like
  );

  const { t } = useTranslation();

  return t("likeWithCount", {
    count: $s_productLikeCount ?? 0,
  });
};

const ProductAd = () => {
  const $s_productsAd = useAppSelector(storeAdSelectors.selectProductAd);

  if (!$s_productsAd) return null;

  return <AdCard ad={$s_productsAd!} fullWidth mediaShape="rectangle" />;
};

const ProductContent = () => {
  const $s_productTitle = useAppSelector(
    (state) => state.product.product?.product?.title
  );
  const $s_productCurrency = useAppSelector(
    (state) => state.product.product?.product?.currency
  );
  const $s_productPrice = useAppSelector(
    (state) => state.product.product?.product?.price
  );
  const $s_productCreateTime = useAppSelector(
    (state) => state.product.product?.product?.create_time_text
  );
  const $s_productStateNumber = useAppSelector(
    (state) => state.product.product?.product?.state
  );
  const $s_productSeller = useAppSelector(
    (state) => state.product.product?.seller
  );
  const $s_productSellerResponseState = useAppSelector(
    (state) => state.product.product?.seller?.r_state
  );
  const $s_productCondition = useAppSelector(
    (state) => state.product.product?.condition_item
  );
  const $s_productBrand = useAppSelector(
    (state) => state.product.product?.brand
  );
  const $s_productMailNote = useAppSelector(
    (state) => state.product.product?.product?.mail_note
  );
  const $s_productOfflineAddresses = useAppSelector(
    (state) => state.product.product?.product?.offline_address
  );

  const $s_productCategories =
    useAppSelector((state) => state.product.product?.product?.rid) ?? [];
  const $s_productDescribe =
    useAppSelector((state) => state.product.product?.product?.describe) ?? "";

  const { t } = useTranslation();

  const { classes, cx } = useStyles();

  return (
    <div>
      <AppTypography variant="bodyMed18" marginBottom={0.5}>
        {$s_productTitle}
      </AppTypography>
      {$s_productStateNumber === productConstants.SOLD_STATE_NUMBER ? (
        <AppChip
          label={
            <AppTypography variant="titleSemi20" component="span">
              {t("sold")}
            </AppTypography>
          }
          borderRadius="rounded"
          color="common.darkNeutral"
          textColor="common.white"
          sx={{ mb: 1, mt: 0.5 }}
        />
      ) : (
        <AppTypography variant="headerSemi35">
          {$s_productCurrency} {$s_productPrice}
        </AppTypography>
      )}

      <Grid container spacing={0.5} justifyContent={"space-between"}>
        <Grid item xs={12} tablet="auto">
          <div className={classes.typicalItem}>
            <AppSvgIcon
              className={classes.typicalItemIcon}
              component={AccessTimeIcon}
            />
            <div className={classes.typicalItemContent}>
              <AppTypography component="span">
                {$s_productCreateTime}
              </AppTypography>{" "}
              <AppLink
                href={`/${commonHelpers.generateUserSlug($s_productSeller)}`}
                variant="bodySemi16"
                color="common.blue"
                hoverColor="common.blue"
              >
                {$s_productSeller?.nickname}
              </AppLink>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} tablet="auto">
          <div className={classes.typicalItem}>
            <AppSvgIcon
              className={classes.typicalItemIcon}
              component={HeartOutlinedIcon}
            />
            <AppTypography className={classes.typicalItemContent}>
              <LikeCount />
            </AppTypography>
          </div>
        </Grid>

        <Grid item xs={12} tablet="auto">
          <div className={classes.typicalItem}>
            <AppSvgIcon
              className={classes.typicalItemIcon}
              component={CubeBoxIcon}
            />
            <AppTypography className={classes.typicalItemContent}>
              {$s_productCondition?.title}
              {$s_productCondition?.advice && (
                <AppTooltip placement="top" title={$s_productCondition?.advice}>
                  <Box display="flex" component="span">
                    <AppSvgIcon
                      className={classes.typicalItemIcon}
                      component={InfoIcon}
                    />
                  </Box>
                </AppTooltip>
              )}
            </AppTypography>
          </div>
        </Grid>
        {!!$s_productBrand?.title && (
          <Grid item xs={12} tablet="auto">
            <div className={classes.typicalItem}>
              <AppSvgIcon
                className={classes.typicalItemIcon}
                component={BrandIcon}
              />
              <AppTypography className={classes.typicalItemContent}>
                {$s_productBrand?.title}
              </AppTypography>
            </div>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 2.5 }} />

      <AppTypography
        variant="bodyMed16"
        color="primary.main"
        marginBottom={0.5}
      >
        {$s_productCategories
          .map((productCategory) => productCategory.title)
          .join(" / ")}
      </AppTypography>

      <ReadMoreTypography marginBottom={2.5}>
        <HtmlParser
          html={commonHelpers.parseHtmlWithUrl($s_productDescribe! ?? "")}
          sx={{ whiteSpace: "pre-line" }}
        />
      </ReadMoreTypography>

      <ProductAd />

      <div className={classes.relatedMenuList}>
        <div className={classes.relatedMenuItem}>
          <AppTypography variant="bodyMed18">
            {t("tradeInPerson")}
          </AppTypography>
          <AppTypography color="text.secondary" component="div">
            <div className={classes.addressList}>
              {($s_productOfflineAddresses || []).map(
                (address, addressIndex) => (
                  <div key={addressIndex} className={classes.addressItem}>
                    <AppSvgIcon fontSize="small" component={LocationIcon} />
                    <div className={classes.addressItemContent}>
                      <AppTypography color="text.primary" marginBottom={0.5}>
                        {address.title}
                      </AppTypography>
                      <AppTypography>{address.address}</AppTypography>
                    </div>
                  </div>
                )
              )}
              {($s_productOfflineAddresses ?? []).length < 1 && t("noSupport")}
            </div>
          </AppTypography>
        </div>
        <div className={classes.relatedMenuItem}>
          <AppTypography variant="bodyMed18">
            {t("byPostAndCourier")}
          </AppTypography>
          <AppTypography color="text.secondary">
            {$s_productMailNote || t("noSupport")}
          </AppTypography>
        </div>
      </div>

      <Divider sx={{ my: 2.5 }} />

      <div className={classes.seller}>
        <AppAvatar
          component={AppLink}
          href={`/${commonHelpers.generateUserSlug($s_productSeller as any)}`}
          className={classes.sellerAvatar}
          src={imageHelpers.imagePathLoader($s_productSeller?.avatar)}
        />
        <div className={classes.sellerInfo}>
          <AppTypography
            variant="bodySemi16"
            className={classes.sellerInfoText}
          >
            <AppLink
              href={`/${commonHelpers.generateUserSlug(
                $s_productSeller as any
              )}`}
              variant="inherit"
            >
              {$s_productSeller?.nickname}
            </AppLink>
            <AppTypography
              variant="bodyReg14"
              color="text.secondary"
              component="span"
            >
              @{commonHelpers.generateUserSlug($s_productSeller)}
            </AppTypography>
          </AppTypography>
          <AppTypography className={classes.sellerInfoText}>
            {t(
              userConstants.responseStateToResponseStateLabelMap[
                $s_productSellerResponseState!
              ]
            )}
            {$s_productSellerResponseState ===
              userConstants.HIGH_RESPONSE_STATE && (
              <AppSvgIcon
                className={cx(classes.sellerInfoIcon)}
                fontSize="small"
                component={VeryResponsiveIcon}
              />
            )}
          </AppTypography>
          <AppTypography className={classes.sellerInfoText}>
            {t("verified")}
            <AppTooltip title="Email">
              <Box display="flex" component="span">
                <AppSvgIcon
                  className={cx(
                    classes.sellerInfoIcon,
                    !$s_productSeller?.email && classes.disabled
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
                    classes.sellerInfoIcon,
                    !$s_productSeller?.phone && classes.disabled
                  )}
                  fontSize="small"
                  component={VerifiedPhoneIcon}
                />
              </Box>
            </AppTooltip>
          </AppTypography>
          <AppTypography className={classes.sellerInfoText}>
            {t("joinedDate", {
              date: $s_productSeller?.create_time,
            })}
          </AppTypography>
          <AppTypography className={classes.sellerInfoText}>
            {commonHelpers.formatNumber($s_productSeller?.point_average ?? 0)}{" "}
            <AppSvgIcon
              fontSize="small"
              component={StarIcon}
              color="common.starYellow"
            />{" "}
            {!!$s_productSeller?.e_num
              ? `(${t("reviewWithCount", {
                  count: $s_productSeller.e_num,
                })})`
              : t("noReviewsYet")}
          </AppTypography>
          {$s_productSeller?.merchant_location && (
            <div>
              <AppChip
                size="small"
                color="common.blue"
                label={$s_productSeller?.merchant_location?.label_name!}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductContent;
