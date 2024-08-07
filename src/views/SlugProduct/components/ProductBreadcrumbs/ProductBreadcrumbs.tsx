import { commonHelpers } from "@/utils/helpers";

import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

const ProductBreadcrumbs = () => {
  const $s_productCategories = useAppSelector(
    (state) => state.product.product?.product?.rid
  );
  const $s_productTitle = useAppSelector(
    (state) => state.product.product?.product?.title
  );

  const { t } = useTranslation();

  return (
    <AppBreadcrumbs>
      <AppLink color="text.secondary" href={"/"}>
        {t("home")}
      </AppLink>
      {($s_productCategories ?? []).map((productCategory) => (
        <AppLink
          key={productCategory.id}
          color="text.secondary"
          href={{
            pathname: `/${commonHelpers.generateProductCategorySlug(
              productCategory.title,
              productCategory.id
            )}`,
            query: {
              product_category: commonHelpers.encodeURIComponentQueryItem(
                productCategory.title,
                productCategory.id
              ),
            },
          }}
        >
          {productCategory.title}
        </AppLink>
      ))}
      {!!$s_productTitle && (
        <AppTypography color="text.primary">{$s_productTitle}</AppTypography>
      )}
    </AppBreadcrumbs>
  );
};

export default ProductBreadcrumbs;
