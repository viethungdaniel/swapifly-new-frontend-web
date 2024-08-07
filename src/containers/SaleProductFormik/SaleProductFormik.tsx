import * as yup from "yup";
import axios from "axios";

import { commonHelpers, formikHelpers, userHelpers } from "@/utils/helpers";
import { commonConstants, productConstants } from "@/utils/constants";

import { FastField, Field, Form, Formik, useFormikContext } from "formik";

import { Box, Grid, useMediaQuery } from "@mui/material";
import AppPaper from "@/components/AppPaper";
import AppPaperContent from "@/components/AppPaperContent";
import FileUpload from "@/components/FileUpload";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import PlayFilledSvg from "@@/public/images/svgs/play-filled.svg";
import ReactPlayer from "react-player/youtube";
import AppTextField from "@/components/AppTextField";
import ProductCategoryAutocomplete from "@/containers/ProductCategoryAutocomplete";
import AsyncAutocomplete from "@/components/AsyncAutocomplete";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppNumberFormat from "@/components/AppNumberFormat";
import ItemDescriptionFormField from "@/containers/SaleProductFormik/components/ItemDescriptionFormField";
import AppSelect from "@/components/AppSelect";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import AppListItemText from "@/components/AppListItemText";
import WeekdaysFormField from "@/containers/SaleProductFormik/components/WeekdaysFormField";
import AppTimePicker from "@/components/AppTimePicker";
import ProductConditionFormField from "@/containers/SaleProductFormik/components/ProductConditionFormField";
import DatesFormField from "@/containers/SaleProductFormik/components/DatesFormField";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";
import AppButton from "@/components/AppButton";
import AppBottomAppBar from "@/components/AppBottomAppBar";
import MainBottomAppBarToolbar from "@/components/MainBottomAppBarToolbar";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useImperativeHandle, useMemo, useRef } from "react";

import { storeProductConditionAction } from "@/store";
import { bindActionCreators } from "redux";

import { useTranslation } from "next-i18next";

import useStyles from "./SaleProductFormik.styles";

import type { FileValue } from "@/components/FileUpload";
import type { CancelTokenSource } from "axios";
import type { FastFieldProps, FormikConfig, FormikProps } from "formik";

export type SaleProductFormValues = {
  id?: number;
  youtube_link: string;
  images: {
    files: FileValue[];
    uploading: boolean;
  };
  video: {
    file: FileValue | null;
    uploading: boolean;
  };
  product_category: {
    id: number;
    title: string;
  } | null;
  title: string;
  brand: {
    id: number;
    title: string;
  } | null;
  product_condition: {
    id: number;
    title: string;
  } | null;
  region: {
    id: number;
    title: string;
    currency: string;
    [key: string]: any;
  } | null;
  price: EmptySafeNumber;
  describe: string;
  chat_auto_reply: BooleanNumber;
  chat_time_type: string;
  chat_days: string[];
  chat_weekdays: number[];
  chat_time_from: string;
  chat_time_to: string;
  chat_ai_style: {
    id: string;
    name: string;
  } | null;
  offline: BooleanNumber;
  offline_address: {
    title: string;
    address: string;
    lat: number;
    lng: number;
  }[];
  mail: BooleanNumber;
  mail_note: string;
};

export type SaleProductFormikProps = {
  formikRef?: React.ForwardedRef<any>;
  initialValues: SaleProductFormValues;
  beforeFormNode?: React.ReactNode;
  onSubmit: FormikConfig<SaleProductFormValues>["onSubmit"];
};

export const DATETIME_ANYTIME_OPTION = "anytime";
export const DATETIME_WEEKDAY_TIME_OPTION = "weekdaytime";
export const DATETIME_SPECIFY_DAY_TIME_OPTION = "specifydaytime";

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<SaleProductFormValues>();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      color="primary"
      variant="contained"
      type="submit"
      sx={{ textTransform: "capitalize" }}
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t(values.id ? "update" : "postNow")}
    </AppButton>
  );
};

const SimpleForm = (props: Pick<SaleProductFormikProps, "beforeFormNode">) => {
  const { beforeFormNode } = props;

  const { t } = useTranslation();

  const { classes, theme } = useStyles();

  const iseTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const $s_isAuthUserMerchant = useAppSelector((state) =>
    userHelpers.isMerchant(state.auth.user?.shop)
  );
  const $s_authUserMerchantLocation = useAppSelector(
    (state) => state.auth.user?.merchant_location
  );

  const numberToAutoReplyOptionMap = useMemo<{
    [key: number]: {
      title: string;
      subtitle: string;
    };
  }>(
    () => ({
      0: {
        title: t("no"),
        subtitle: t("numberToAutoReplyOptionManual"),
      },
      1: {
        title: t("yes"),
        subtitle: t("numberToAutoReplyOptionAI"),
      },
    }),
    []
  );

  const idToDateTimeOptionMap = useMemo(
    () =>
      Object.entries(productConstants.idToDateTimeOptionMap).reduce(
        (
          results: typeof productConstants.idToDateTimeOptionMap,
          [id, label]
        ) => {
          Object.assign(results, {
            [id]: t(label),
          });
          return results;
        },
        {}
      ),
    [t]
  );

  const autoReplyOptions = useMemo(
    () =>
      Object.entries(numberToAutoReplyOptionMap).map(([value, item]) => ({
        ...item,
        value: Number(value),
      })),
    [numberToAutoReplyOptionMap]
  );

  const dateTimeOptions = useMemo(
    () =>
      Object.entries(idToDateTimeOptionMap).map(([value, label]) => ({
        label,
        value,
      })),
    [idToDateTimeOptionMap]
  );

  return (
    <Form>
      {beforeFormNode}
      <Grid container spacing={2.5}>
        <Grid item xs={12} tablet={6}>
          <AppPaper className={classes.paper}>
            <AppPaperContent className={classes.paperContent}>
              <FastField name="images">
                {({ field, form }: FastFieldProps) => (
                  <Box data-name={"images.files"} mb={2.5}>
                    <FileUpload
                      variant="image"
                      acceptedFileTypes={["image"]}
                      max={10}
                      multiple
                      moveable
                      error={
                        !!formikHelpers.showError({
                          error: (form.errors as any)?.images?.files,
                          touched: (form.touched as any)?.images?.files,
                          submitCount: form.submitCount,
                        })
                      }
                      helperText={formikHelpers.showError({
                        error: (form.errors as any)?.images?.files,
                        touched: (form.touched as any)?.images?.files,
                        submitCount: form.submitCount,
                      })}
                      value={field.value.files}
                      fileItemGridItemProps={{
                        xs: 6,
                        sm: 3,
                      }}
                      getFileItemTag={(_, index) =>
                        index === 0 ? (
                          <AppTypography>{t("cover")}</AppTypography>
                        ) : null
                      }
                      onUploadRequested={() => {
                        form.setFieldValue("images.uploading", true);
                      }}
                      onUploadSucceed={() => {
                        form.setFieldValue("images.uploading", false);
                      }}
                      onUploadFailed={() => {
                        form.setFieldValue("images.uploading", false);
                      }}
                      onChange={(_, value) => {
                        form.setFieldValue("images.files", value);
                      }}
                    />
                  </Box>
                )}
              </FastField>
              <FastField name="video">
                {({ field, form }: FastFieldProps) => (
                  <FileUpload
                    variant="video"
                    acceptedFileTypes={["video"]}
                    value={field.value.file}
                    fileItemGridItemProps={{
                      xs: 6,
                      sm: 3,
                    }}
                    data-name="video"
                    sx={{ mb: 2.5 }}
                    getFileItemTag={(_, index) =>
                      index === 0 ? (
                        <AppTypography>{t("cover")}</AppTypography>
                      ) : null
                    }
                    onUploadRequested={() => {
                      form.setFieldValue("video.uploading", true);
                    }}
                    onUploadSucceed={() => {
                      form.setFieldValue("video.uploading", false);
                    }}
                    onUploadFailed={() => {
                      form.setFieldValue("video.uploading", false);
                    }}
                    onChange={(_, value) => {
                      form.setFieldValue("video.file", value);
                    }}
                  />
                )}
              </FastField>
              <FastField name="youtube_link">
                {({ field, form, meta }: FastFieldProps) => (
                  <>
                    <AppTextField
                      label={t("youtubeLink")}
                      fullWidth
                      bgColor="common.white"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
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
                      {...field}
                    />
                    {!!field.value &&
                      !formikHelpers.showError({
                        error: meta.error,
                        touched: meta.touched,
                        submitCount: form.submitCount,
                      }) && (
                        <AppPaperContent className={classes.youtubePreview}>
                          <AppTypography whiteSpace="nowrap">
                            {t("preview")}:
                          </AppTypography>
                          <div className={classes.youtubePreviewPlayerWrapper}>
                            <ReactPlayer
                              width="100%"
                              height="100%"
                              playsinline
                              config={{
                                playerVars: {
                                  autoplay: 0,
                                  frameborder: 0,
                                  controls: 0,
                                },
                              }}
                              url={commonHelpers.formatYoutubeUrl(field.value)}
                              light
                              playIcon={
                                <AppSvgIcon
                                  component={PlayFilledSvg}
                                  sx={{ fontSize: 50 }}
                                />
                              }
                              playing={false}
                            />
                          </div>
                        </AppPaperContent>
                      )}
                  </>
                )}
              </FastField>
            </AppPaperContent>
          </AppPaper>
        </Grid>
        <Grid item xs={12} tablet={6}>
          <AppPaper className={classes.paper}>
            <AppPaperContent className={classes.paperContent}>
              <Box display="flex" flexDirection="column" gap={1.25}>
                <FastField name="product_category">
                  {({ field, form, meta }: FastFieldProps) => (
                    <ProductCategoryAutocomplete
                      fullWidth
                      selectOnlyLastOption
                      showBreadcrumbs
                      disableClearable
                      defaultInputProps={{
                        label: t("category"),
                        bgColor: "common.white",
                        placeholder: `${t("pleaseSelect")}...`,
                        required: true,
                        error: !!formikHelpers.showError({
                          error: meta.error,
                          touched: meta.touched,
                          submitCount: form.submitCount,
                        }),
                        helperText: formikHelpers.showError({
                          error: meta.error,
                          touched: meta.touched,
                          submitCount: form.submitCount,
                        }),
                      }}
                      {...field}
                    />
                  )}
                </FastField>
                <FastField name="title">
                  {({ field, form, meta }: FastFieldProps) => (
                    <AppTextField
                      label={t("Item Name")}
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
                      {...field}
                    />
                  )}
                </FastField>
              </Box>
              <AppTypography variant="titleSemi20" align="center" my={2.5}>
                {t("aboutItem")}
              </AppTypography>
              <Box display="flex" flexDirection="column" gap={1.25}>
                <FastField name="brand">
                  {({ field }: FastFieldProps) => (
                    <AsyncAutocomplete
                      fullWidth
                      module="brands"
                      defaultInputProps={{
                        label: t("brand"),
                        bgColor: "common.white",
                        placeholder: `${t("pleaseSelect")}...`,
                      }}
                      {...field}
                    />
                  )}
                </FastField>
                <FastField name="product_condition">
                  {(fastFieldProps: FastFieldProps) => (
                    <ProductConditionFormField {...fastFieldProps} />
                  )}
                </FastField>
                <FastField name="region">
                  {({ field, form, meta }: FastFieldProps) => (
                    <AsyncAutocomplete
                      fullWidth
                      module="regions"
                      disableClearable
                      defaultInputProps={{
                        label: t("countryOrArea"),
                        bgColor: "common.white",
                        required: true,
                        placeholder: `${t("pleaseSelect")}...`,
                        error: !!formikHelpers.showError({
                          error: meta.error,
                          touched: meta.touched,
                          submitCount: form.submitCount,
                        }),
                        helperText: formikHelpers.showError({
                          error: meta.error,
                          touched: meta.touched,
                          submitCount: form.submitCount,
                        }),
                      }}
                      {...field}
                    />
                  )}
                </FastField>
                <FastField
                  name="price"
                  shouldUpdate={formikHelpers.shouldUpdate(["region"])}
                >
                  {({ field, form, meta }: FastFieldProps) => (
                    <AppTextField
                      label={t("price")}
                      fullWidth
                      required
                      bgColor="common.white"
                      type="tel"
                      inputProps={{
                        pattern: "[0-9]*",
                        decimalScale: 2,
                        valueIsNumericString: true,
                        allowNegative: false,
                        isAllowed: (values: any) => {
                          const { floatValue } = values;
                          return (
                            typeof floatValue === "undefined" ||
                            (floatValue || 0) >= productConstants.MIN_PRICE
                          );
                        },
                      }}
                      inputComponent={AppNumberFormat as any}
                      startAdornment={
                        form.values.region?.currency ? (
                          <AppInputAdornment position="start">
                            {form.values.region?.currency}
                          </AppInputAdornment>
                        ) : undefined
                      }
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
                      {...field}
                    />
                  )}
                </FastField>
                <Field
                  name="describe"
                  shouldUpdate={formikHelpers.shouldUpdate(["brand", "title"])}
                >
                  {(fastFieldProps: FastFieldProps) => (
                    <ItemDescriptionFormField {...fastFieldProps} />
                  )}
                </Field>
              </Box>
              {$s_isAuthUserMerchant && (
                <>
                  <AppTypography variant="titleSemi20" my={2.5} align="center">
                    {t("chatSetting")}
                  </AppTypography>
                  <Box display="flex" flexDirection="column" gap={1.25}>
                    <FastField name="chat_auto_reply">
                      {({ field, form, meta }: FastFieldProps) => (
                        <AppSelect
                          label={t("autoReply")}
                          fullWidth
                          required
                          bgColor="common.white"
                          renderValue={(selected: any) => {
                            const selectedAutoReplyOption =
                              numberToAutoReplyOptionMap[selected];
                            if (!selectedAutoReplyOption)
                              return `${t("pleaseSelect")}...`;
                            return (
                              <AppListItemText
                                primary={selectedAutoReplyOption.title}
                                secondary={selectedAutoReplyOption.subtitle}
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
                          {...field}
                        >
                          {autoReplyOptions.map((autoReplyOption) => (
                            <AppSelectMenuItem
                              key={autoReplyOption.value}
                              value={autoReplyOption.value}
                            >
                              <AppListItemText
                                primary={autoReplyOption.title}
                                secondary={autoReplyOption.subtitle}
                              />
                            </AppSelectMenuItem>
                          ))}
                        </AppSelect>
                      )}
                    </FastField>

                    <Field name="chat_auto_reply">
                      {({ field }: FastFieldProps) =>
                        !!field.value && (
                          <>
                            <FastField name="chat_time_type">
                              {({ field, form, meta }: FastFieldProps) => (
                                <AppSelect
                                  label={t("setDateOrTime")}
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
                                  {...field}
                                >
                                  {dateTimeOptions.map((dateTimeOption) => (
                                    <AppSelectMenuItem
                                      key={dateTimeOption.value}
                                      value={dateTimeOption.value}
                                    >
                                      <AppListItemText
                                        sx={{ m: 0 }}
                                        primary={dateTimeOption.label}
                                      />
                                    </AppSelectMenuItem>
                                  ))}
                                </AppSelect>
                              )}
                            </FastField>
                            <Field name="chat_time_type">
                              {({ field: chatTimeTypeField }: FastFieldProps) =>
                                [
                                  DATETIME_WEEKDAY_TIME_OPTION,
                                  DATETIME_SPECIFY_DAY_TIME_OPTION,
                                ].includes(chatTimeTypeField.value) && (
                                  <>
                                    <div>
                                      {chatTimeTypeField.value ===
                                        DATETIME_WEEKDAY_TIME_OPTION && (
                                        <FastField name="chat_weekdays">
                                          {(fastFieldProps: FastFieldProps) => (
                                            <WeekdaysFormField
                                              {...fastFieldProps}
                                            />
                                          )}
                                        </FastField>
                                      )}
                                      {chatTimeTypeField.value ===
                                        DATETIME_SPECIFY_DAY_TIME_OPTION && (
                                        <FastField name="chat_days">
                                          {(fastFieldProps: FastFieldProps) => (
                                            <DatesFormField
                                              {...fastFieldProps}
                                            />
                                          )}
                                        </FastField>
                                      )}
                                    </div>
                                    <Grid container spacing={2.5}>
                                      <Grid item xs={6}>
                                        <FastField name="chat_time_from">
                                          {({
                                            field,
                                            form,
                                            meta,
                                          }: FastFieldProps) => (
                                            <AppTimePicker
                                              label={t("startTime")}
                                              slotProps={{
                                                textField: {
                                                  bgColor: "common.white",
                                                  fullWidth: true,
                                                  required: true,
                                                  error:
                                                    !!formikHelpers.showError({
                                                      error: meta.error,
                                                      touched: meta.touched,
                                                      submitCount:
                                                        form.submitCount,
                                                    }),
                                                  helperText:
                                                    formikHelpers.showError({
                                                      error: meta.error,
                                                      touched: meta.touched,
                                                      submitCount:
                                                        form.submitCount,
                                                    }),
                                                },
                                              }}
                                              {...field}
                                            />
                                          )}
                                        </FastField>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <FastField name="chat_time_to">
                                          {({
                                            field,
                                            form,
                                            meta,
                                          }: FastFieldProps) => (
                                            <AppTimePicker
                                              label={t("endTime")}
                                              slotProps={{
                                                textField: {
                                                  bgColor: "common.white",
                                                  fullWidth: true,
                                                  required: true,
                                                  error:
                                                    !!formikHelpers.showError({
                                                      error: meta.error,
                                                      touched: meta.touched,
                                                      submitCount:
                                                        form.submitCount,
                                                    }),
                                                  helperText:
                                                    formikHelpers.showError({
                                                      error: meta.error,
                                                      touched: meta.touched,
                                                      submitCount:
                                                        form.submitCount,
                                                    }),
                                                },
                                              }}
                                              {...field}
                                            />
                                          )}
                                        </FastField>
                                      </Grid>
                                    </Grid>
                                  </>
                                )
                              }
                            </Field>
                            <FastField name="chat_ai_style">
                              {({ field, form, meta }: FastFieldProps) => (
                                <AsyncAutocomplete
                                  fullWidth
                                  module="aIStyles"
                                  defaultInputProps={{
                                    label: t("aiChattingStyle"),
                                    bgColor: "common.white",
                                    required: true,
                                    placeholder: `${t("pleaseSelect")}...`,
                                    error: !!formikHelpers.showError({
                                      error: meta.error,
                                      touched: meta.touched,
                                      submitCount: form.submitCount,
                                    }),
                                    helperText: formikHelpers.showError({
                                      error: meta.error,
                                      touched: meta.touched,
                                      submitCount: form.submitCount,
                                    }),
                                  }}
                                  {...field}
                                />
                              )}
                            </FastField>
                          </>
                        )
                      }
                    </Field>
                  </Box>
                </>
              )}
              <AppTypography variant="titleSemi20" align="center" my={2.5}>
                {t("dealMethod")}
              </AppTypography>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <FastField name="offline">
                  {({ field }: FastFieldProps) => (
                    <div>
                      <AppFormControlLabel
                        label={t("tradeInPerson")}
                        control={<AppCheckbox checked={!!field.value} />}
                        {...field}
                        onChange={(_, checked) => {
                          field.onChange({
                            target: {
                              name: field.name,
                              value: checked ? 1 : 0,
                            },
                          });
                        }}
                      />
                    </div>
                  )}
                </FastField>
                <Field name="offline">
                  {({ field: offlineField }: FastFieldProps) =>
                    !!offlineField.value && (
                      <FastField name="offline_address">
                        {({ field, form, meta }: FastFieldProps) => (
                          <AsyncAutocomplete
                            fullWidth
                            module="locations"
                            multiple
                            sx={{ mb: 0.5 }}
                            defaultInputProps={{
                              bgColor: "common.white",
                              required: true,
                              placeholder: t("addLocation"),
                              error: !!formikHelpers.showError({
                                error: meta.error,
                                touched: meta.touched,
                                submitCount: form.submitCount,
                              }),
                              helperText: formikHelpers.showError({
                                error: meta.error,
                                touched: meta.touched,
                                submitCount: form.submitCount,
                              }),
                            }}
                            {...field}
                          />
                        )}
                      </FastField>
                    )
                  }
                </Field>
              </Box>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <FastField name="mail">
                  {({ field }: FastFieldProps) => (
                    <div>
                      <AppFormControlLabel
                        label={t("byPostAndCourier")}
                        control={<AppCheckbox checked={!!field.value} />}
                        {...field}
                        onChange={(_, checked) => {
                          field.onChange({
                            target: {
                              name: field.name,
                              value: checked ? 1 : 0,
                            },
                          });
                        }}
                      />
                    </div>
                  )}
                </FastField>
                <Field name="mail">
                  {({ field: mailField }: FastFieldProps) =>
                    !!mailField.value && (
                      <FastField name="mail_note">
                        {({ field, form, meta }: FastFieldProps) => (
                          <AppTextField
                            placeholder={t("mailNotePlaceholder")}
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
                            multiline
                            minRows={5}
                            maxRows={8}
                            {...field}
                          />
                        )}
                      </FastField>
                    )
                  }
                </Field>
              </Box>
              {!iseTabletDown && (
                <>
                  {!!$s_authUserMerchantLocation && (
                    <AppTypography align="center" mt={1.25}>
                      {t("localeTolMerchantLocation", {
                        merchantLocation: $s_authUserMerchantLocation?.title,
                      })}
                    </AppTypography>
                  )}
                  <Box marginTop={1.25}>
                    <SubmitButton />
                  </Box>
                </>
              )}
              {iseTabletDown && (
                <AppBottomAppBar>
                  <MainBottomAppBarToolbar
                    className={
                      commonConstants.MAIN_BOTTOM_APP_BAR_TOOLBAR_ELE_CLASS
                    }
                    enablePaddingY
                    autoHeight
                    sx={{ flexDirection: "column", justifyContent: "center" }}
                  >
                    {!!$s_authUserMerchantLocation && (
                      <AppTypography align="center" mb={2}>
                        {t("localeTolMerchantLocation", {
                          merchantLocation: $s_authUserMerchantLocation?.title,
                        })}
                      </AppTypography>
                    )}
                    <SubmitButton />
                  </MainBottomAppBarToolbar>
                </AppBottomAppBar>
              )}
            </AppPaperContent>
          </AppPaper>
        </Grid>
      </Grid>
    </Form>
  );
};

const SaleProductFormik = (props: SaleProductFormikProps) => {
  const {
    initialValues,
    formikRef: controlledFormikRef,
    beforeFormNode,
    onSubmit,
  } = props;

  const formikRef = useRef<FormikProps<SaleProductFormValues>>(null!);
  const fetchProductConditionsSource = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const $s_isAuthUserMerchant = useAppSelector((state) =>
    userHelpers.isMerchant(state.auth.user?.shop)
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      images: yup.object().shape({
        files: yup.array().min(1, ({ min }) =>
          t("photoMinNumberWithCount", {
            count: min,
          })
        ),
      }),
      youtube_link: yup
        .string()
        .test("youtube-url-valid", t("youtubeLinkIsInvalid"), (youtubeLink) => {
          return !youtubeLink || commonHelpers.isYoutubeUrl(youtubeLink);
        }),
      product_category: yup
        .object()
        .nullable()
        .required(t("categoryIsRequired")),
      title: yup.string().required(t("itemNameIsRequired")),
      product_condition: yup
        .object()
        .nullable()
        .required(t("conditionIsRequired")),
      region: yup.object().nullable().required(t("regionIsRequired")),
      price: yup
        .number()
        .required("Price is required")
        .min(productConstants.MIN_PRICE, ({ min }) =>
          t("priceMinNumberWithCount", {
            count: min,
          })
        )
        .max(productConstants.MAX_PRICE, ({ max }) =>
          t("priceMaxNumberWithCount", {
            count: max,
          })
        ),
      describe: yup.string().trim().required(t("itemDescriptionIsRequired")),
      ...($s_isAuthUserMerchant
        ? {
            chat_days: yup.array().when("chat_time_type", {
              is: productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION,
              then: (schema) =>
                schema.min(1, ({ min }) =>
                  t("selectedSpecifyDayMinDayCountWithCount", {
                    count: min,
                  })
                ),
            }),
            chat_weeks: yup.array().when("chat_time_type", {
              is: productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION,
              then: (schema) =>
                schema.min(1, ({ min }) =>
                  t("selectedWeekdayMinWeekdayCountWithCount", {
                    count: min,
                  })
                ),
            }),
            chat_time_from: yup
              .string()
              .nullable()
              .when("chat_time_type", {
                is: (chatTimeType: string) =>
                  [
                    productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION,
                    productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION,
                  ].includes(chatTimeType),
                then: (schema) => schema.required(t("startTimeIsRequired")),
              }),
            chat_time_to: yup
              .string()
              .nullable()
              .when("chat_time_type", {
                is: (chatTimeType: string) =>
                  [
                    productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION,
                    productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION,
                  ].includes(chatTimeType),
                then: (schema) =>
                  schema
                    .required(t("endTimeIsRequired"))
                    .test(
                      "greater-than-start-time",
                      t("endTimeMustBeGreaterThanStartTime"),
                      (chatTimeTo, context) => {
                        const chatTimeFrom: string =
                          context.parent.chat_time_from ?? "";
                        return !!chatTimeFrom && chatTimeFrom <= chatTimeTo;
                      }
                    ),
              }),
          }
        : {}),
      offline_address: yup.array().when("offline", {
        is: (offline: BooleanNumber) => !!offline,
        then: (schema) =>
          schema.min(1, ({ min }) =>
            t("selectedLocationMinNumberCountWithCount", {
              count: min,
            })
          ),
      }),
      mail_note: yup
        .string()
        .trim()
        .when("mail", {
          is: (mail: BooleanNumber) => !!mail,
          then: (schema) => schema.required(t("mailNoteIsRequired")),
        }),
    });
  }, [t, $s_isAuthUserMerchant]);

  const dispatch = useAppDispatch();

  const $s_productConditionAction = useMemo(
    () => bindActionCreators(storeProductConditionAction, dispatch),
    [dispatch]
  );

  useImperativeHandle(controlledFormikRef, () => formikRef.current as any);

  useEffect(() => {
    fetchProductConditionsSource.current = axios.CancelToken.source();
    $s_productConditionAction.fetchProductConditionsSaga({
      cancelToken: fetchProductConditionsSource.current.token,
    });
    return () => {
      fetchProductConditionsSource.current!.cancel();
    };
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <SimpleForm beforeFormNode={beforeFormNode} />
    </Formik>
  );
};

export default SaleProductFormik;
