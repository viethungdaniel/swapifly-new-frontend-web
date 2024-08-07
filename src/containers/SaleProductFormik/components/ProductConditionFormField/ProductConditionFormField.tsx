import { commonHelpers, formikHelpers } from "@/utils/helpers";

import AppSelect from "@/components/AppSelect";
import AppListItemText from "@/components/AppListItemText";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppLoading from "@/components/AppLoading";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { FastFieldProps } from "formik";

type ProductConditionFormFieldProps = FastFieldProps;

const ProductConditionFormField = (props: ProductConditionFormFieldProps) => {
  const { field, form, meta } = props;

  const { t } = useTranslation();

  const $s_productConditions = useAppSelector(
    (state) => state.productCondition.productConditions
  );
  const $s_productConditionsError = useAppSelector(
    (state) => state.productCondition.productConditionsError
  );
  const $s_productConditionsLoading = useAppSelector(
    (state) => state.productCondition.productConditionsLoading
  );

  const handleProductConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProductConditionId = event.target.value as unknown as number;
    const productCondition = $s_productConditions.find(
      (productCondition) => productCondition.id === newProductConditionId
    );
    form.setFieldTouched(field.name, true);
    form.setFieldValue(field.name, productCondition);
  };

  return (
    <AppSelect
      label={t("condition")}
      fullWidth
      required
      bgColor="common.white"
      renderValue={() => {
        const selectedProductCondition = field.value;
        if (!selectedProductCondition) return "";
        return (
          <AppListItemText
            primary={selectedProductCondition.title}
            secondary={selectedProductCondition.advice ?? undefined}
            sx={{ m: 0 }}
          />
        );
      }}
      error={
        !!formikHelpers.showError({
          error: meta.error,
          touched: meta.touched,
          submitCount: form.submitCount,
        })
      }
      helperText={formikHelpers.showError({
        error: meta.error,
        touched: meta.touched,
        submitCount: form.submitCount,
      })}
      displayEmpty
      placeholder={`${t("pleaseSelect")}...`}
      {...field}
      value={!commonHelpers.isEmpty(field.value?.id) ? field.value?.id : ""}
      native={false}
      endAdornment={
        $s_productConditionsLoading && (
          <AppInputAdornment position="end">
            <AppLoading size={20} />
          </AppInputAdornment>
        )
      }
      onChange={handleProductConditionChange as any}
    >
      {$s_productConditionsLoading ? (
        <AppSelectMenuItem disabled native={false}>
          <AppListItemText primary={`${t("loading")}...`} />
        </AppSelectMenuItem>
      ) : !!$s_productConditionsError ? (
        <AppSelectMenuItem disabled sx={{ opacity: 1 }} native={false}>
          <AppListItemText primary={$s_productConditionsError} /> :
        </AppSelectMenuItem>
      ) : (
        $s_productConditions.map((productCondition) => (
          <AppSelectMenuItem
            key={productCondition.id}
            value={productCondition.id}
            native={false}
          >
            <AppListItemText
              primary={productCondition.title}
              secondary={productCondition.advice}
            />
          </AppSelectMenuItem>
        ))
      )}
    </AppSelect>
  );
};

export default ProductConditionFormField;
