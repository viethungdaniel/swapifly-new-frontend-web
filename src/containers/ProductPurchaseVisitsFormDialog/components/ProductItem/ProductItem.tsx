import { commonHelpers, imageHelpers } from "@/utils/helpers";

import AppImage from "@/components/AppImage";
import AppTypography from "@/components/AppTypography";

import { useContext } from "react";
import { useAppMomentWithLocale, useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import ProductPurchaseVisitsFormDialogContext from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog.context";

import useStyles from "./ProductItem.styles";

const ProductItem = () => {
  const { product } = useContext(ProductPurchaseVisitsFormDialogContext);

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  const { t } = useTranslation();

  const { classes } = useStyles();

  return (
    <div className={classes.productItem}>
      <div className={classes.productItemPhoto}>
        <AppImage
          src={product?.product?.image}
          loader={imageHelpers.appImageLoader}
          fill
          alt=""
          sizes="50px"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className={classes.productItemContent}>
        <AppTypography>{product?.product?.title}</AppTypography>
        <AppTypography
          display="flex"
          flexWrap={"wrap"}
          alignItems="center"
          gap={0.5}
        >
          <AppTypography variant="bodyMed16" component="span">
            {$s_regionCurrency}{" "}
            {commonHelpers.formatNumber(product?.product?.price)}
          </AppTypography>

          {!!product?.product?.create_time && (
            <span>
              <AppTypography variant="bodyMed16" component="span" mr={0.5}>
                •
              </AppTypography>
              {t("publishedOnDate", {
                date: momentWithLocaleByCurrentTz(
                  product.product.create_time,
                  "X"
                ).format("DD/MM/YYYY"),
              })}
            </span>
          )}
        </AppTypography>
      </div>
    </div>
  );
};

export default ProductItem;
