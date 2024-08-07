import _isEqual from "lodash/isEqual";

import { formikHelpers } from "@/utils/helpers";
import { alertDialogService } from "@/services";

import AppFormHelperText from "@/components/AppFormHelperText";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppTextField from "@/components/AppTextField";
import AppButton from "@/components/AppButton";
import AppTooltip from "@/components/AppTooltip";
import AIStylesSelectDialog from "@/components/AIStylesSelectDialog";

import AiSwapiflySvg from "@@/public/images/svgs/ai-swapifly.svg";

import { createContext, memo, useCallback, useContext, useState } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./ItemDescriptionFormField.styles";

import type { FastFieldProps } from "formik";
import type { AIStylesSelectDialogProps } from "@/components/AIStylesSelectDialog";
// import QuillTextEditor from "@/components/QuillTextEditor";

export type ItemDescriptionFormFieldProps = FastFieldProps;

const ItemDescriptionFormFieldPropsContext =
  createContext<ItemDescriptionFormFieldProps>(null!);

const MemoAIStylesSelectDialog = memo(AIStylesSelectDialog, _isEqual);

const SelectStylePopperButton = () => {
  const { form } = useContext(ItemDescriptionFormFieldPropsContext);

  const [aIStyleSelectDialogOpen, setAIStyleSelectDialogOpen] = useState(false);
  const [selectedAIStylesName, setSelectedAIStylesName] = useState("");

  const [aIStylesDescriptionParams, setAIStylesDescriptionParams] = useState<
    AIStylesSelectDialogProps["aIStylesDescriptionParams"] | null
  >(null);

  const { t } = useTranslation();

  const handleAIStyleSelectDialogClose = useCallback(() => {
    setAIStyleSelectDialogOpen(false);
  }, []);

  const handleSelectStylesSelectDialogOpen = () => {
    if (!form.values.title) {
      alertDialogService.fire({
        title: t("selectStyle"),
        content: t("pleaseEnterItemName"),
        cancelButtonProps: {
          show: false,
        },
      });
      return;
    }
    setAIStylesDescriptionParams({
      brandName: form.values.brand?.name,
      title: form.values.title,
    });
    setAIStyleSelectDialogOpen(true);
  };

  const handleAIStyleSelectDialogComplete = useCallback(
    ((data) => {
      form.setFieldTouched("describe", true);
      form.setFieldValue("describe", data.aIStylesDescription);
      setSelectedAIStylesName(data.aIStyles.name);
    }) as NonNullable<AIStylesSelectDialogProps["onComplete"]>,
    []
  );

  return (
    <>
      <AppButton
        variant="contained"
        color="text.primary"
        size="small"
        onClick={handleSelectStylesSelectDialogOpen}
      >
        {!!selectedAIStylesName
          ? t("selectedAIStylesName", {
              aiStylesName: selectedAIStylesName,
            })
          : t("selectStyle")}
      </AppButton>
      <MemoAIStylesSelectDialog
        open={aIStyleSelectDialogOpen}
        aIStylesDescriptionParams={aIStylesDescriptionParams}
        onClose={handleAIStyleSelectDialogClose}
        onComplete={handleAIStyleSelectDialogComplete}
      />
    </>
  );
};

const ItemDescriptionFormField = (props: ItemDescriptionFormFieldProps) => {
  const { field, form, meta } = props;

  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <ItemDescriptionFormFieldPropsContext.Provider value={props}>
      <div>
        {/* <QuillTextEditor /> */}
        <AppTextField
          classes={{
            root: classes.itemDescriptionTextField,
          }}
          label={t("itemDescription")}
          fullWidth
          required
          bgColor="common.white"
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
          endAdornment={
            <AppTooltip title={t("aiSsProvidedBySwapifly")}>
              <AppInputAdornment
                className={classes.itemDescriptionInputAdornmentEnd}
                position="end"
              >
                <AiSwapiflySvg className={classes.aiSwapiflySvg} />
              </AppInputAdornment>
            </AppTooltip>
          }
          multiline
          minRows={5}
          maxRows={8}
          {...field}
        />
        <AppFormHelperText color="text.secondary">
          {t("aiSsProvidedBySwapiflyRecommendedDescription")}
        </AppFormHelperText>
        <div className={classes.actions}>
          <SelectStylePopperButton />
        </div>
      </div>
    </ItemDescriptionFormFieldPropsContext.Provider>
  );
};

export default ItemDescriptionFormField;
