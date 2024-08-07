import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import _isEqual from "lodash/isEqual";

import { authApi } from "@/utils/apis";
import { axiosHelpers, commonHelpers, formikHelpers } from "@/utils/helpers";
import { loadingScreenOverlayService } from "@/services";

import { FastField, Form, Formik, useFormikContext } from "formik";
import AppDialog from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppButton from "@/components/AppButton";
import AppPaper from "@/components/AppPaper";
import AppTextField from "@/components/AppTextField";
import AppDialogActions from "@/components/AppDialogActions";
import FileUpload from "@/components/FileUpload";
import AppTypography from "@/components/AppTypography";

import SubmissionSuccessSvg from "@@/public/images/svgs/submission-success.svg";

import { forwardRef, useContext, useMemo, useRef, useState } from "react";
import { useIsMounted, useOnLeavePageConfirmation } from "@/hooks";

import SellerVerificationRequestDialogContext from "./SellerVerificationRequestDialog.context";

import { Trans, useTranslation } from "next-i18next";

import useStyles from "./SellerVerificationRequestDialog.styles";

import type { FastFieldProps, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";
import type { FileValue } from "@/components/FileUpload";
import type { FetchMerchantLocationsResponseData } from "@/utils/apis/common";
import AsyncAutocomplete from "@/components/AsyncAutocomplete";

type UserShopVerificationRequestValues = {
  title: string;
  address: string;
  contact: string;
  website: string;
  image: {
    value: FileValue | null;
    uploading: boolean;
  };
  merchant_location: FetchMerchantLocationsResponseData[number] | null;
};

export type SellerVerificationRequestDialogProps = {
  userShopId?: number;
  open?: boolean;
  onClose?: Function;
  onUserShopVerificationRequestSubmitSucceed?: Function;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const LeavePageConfirmation = () => {
  const { open } = useContext(SellerVerificationRequestDialogContext);

  const { values, initialValues } =
    useFormikContext<UserShopVerificationRequestValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues) && !!open,
  });

  return null;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } = useFormikContext();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      color="primary"
      variant="contained"
      type="submit"
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t("submit")}
    </AppButton>
  );
};

const SubmissionSuccessContent = () => {
  const { onClose } = useContext(SellerVerificationRequestDialogContext);

  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <>
      <AppDialogTitle onCloseButtonClick={onClose as any}></AppDialogTitle>
      <AppDialogContent className={classes.submissionSuccessContent}>
        <SubmissionSuccessSvg className={classes.submissionSuccessSvg} />
        <AppTypography variant="bodyMed18" align="center" mb={0.5}>
          {t("submissionSuccess")}
        </AppTypography>
        <AppTypography align="center" color="text.secondary">
          {t("submittedSellerVerificationRequestFormSuccessMessage")}
        </AppTypography>
      </AppDialogContent>
      <AppDialogActions>
        <AppButton
          fullWidth
          color="common.darkNeutral"
          variant="contained"
          type="submit"
          onClick={onClose as any}
        >
          {t("done")}
        </AppButton>
      </AppDialogActions>
    </>
  );
};

const SimpleForm = () => {
  const { onClose } = useContext(SellerVerificationRequestDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("verificationRequest")}
      </AppDialogTitle>
      <AppDialogContent>
        <AppTypography variant="bodyReg16" align="center" mb={2.5}>
          {t("verificationRequestFormSubTitle")}
        </AppTypography>
        <FastField name="title">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("sellerName")}
              bgColor="common.white"
              required
              fullWidth
              error={
                !!formikHelpers.showError({
                  error: meta.error,
                  submitCount: form.submitCount,
                  touched: meta.touched,
                })
              }
              helperText={formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              })}
              sx={{
                mb: 1.25,
              }}
              {...field}
            />
          )}
        </FastField>
        <FastField name="address">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("sellerAddress")}
              bgColor="common.white"
              fullWidth
              error={
                !!formikHelpers.showError({
                  error: meta.error,
                  submitCount: form.submitCount,
                  touched: meta.touched,
                })
              }
              helperText={formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              })}
              sx={{
                mb: 1.25,
              }}
              {...field}
            />
          )}
        </FastField>
        <FastField name="contact">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("contactNumber")}
              bgColor="common.white"
              type="tel"
              fullWidth
              required
              error={
                !!formikHelpers.showError({
                  error: meta.error,
                  submitCount: form.submitCount,
                  touched: meta.touched,
                })
              }
              helperText={formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              })}
              sx={{
                mb: 1.25,
              }}
              {...field}
            />
          )}
        </FastField>
        <FastField name="website">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("website")}
              bgColor="common.white"
              fullWidth
              required
              error={
                !!formikHelpers.showError({
                  error: meta.error,
                  submitCount: form.submitCount,
                  touched: meta.touched,
                })
              }
              helperText={formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              })}
              sx={{
                mb: 1.25,
              }}
              {...field}
            />
          )}
        </FastField>
        <FastField name="merchant_location">
          {({ field }: FastFieldProps) => (
            <AsyncAutocomplete
              fullWidth
              module="merchantLocations"
              defaultInputProps={{
                label: t("specialMerchant"),
                bgColor: "common.white",
              }}
              sx={{
                mb: 1.25,
              }}
              {...field}
            />
          )}
        </FastField>
        <FastField name="image">
          {({ field, form, meta }: FastFieldProps) => (
            <>
              <FileUpload
                variant="file"
                acceptedFileTypes={["image", "other"]}
                name={field.name}
                value={field.value.value}
                fileItemGridItemProps={{
                  xs: 6,
                  sm: 4,
                  tablet: 3,
                }}
                required
                error={
                  !!formikHelpers.showError({
                    error: meta.error,
                    submitCount: form.submitCount,
                    touched: meta.touched,
                  })
                }
                label={t("businessCertification")}
                helperText={
                  <>
                    {formikHelpers.showError({
                      error: meta.error,
                      submitCount: form.submitCount,
                      touched: meta.touched,
                    })}
                    <br />
                    <AppTypography
                      color="text.secondary"
                      variant="inherit"
                      component="span"
                    >
                      {t("businessCertificationHelperText1")}
                      <br />
                      <Trans
                        t={t}
                        defaults="businessCertificationHelperText2"
                        components={{
                          p1: (
                            <AppTypography
                              variant="bodyMed14"
                              color="text.primary"
                              lineHeight={"inherit"}
                              component="span"
                            />
                          ),
                        }}
                      />
                    </AppTypography>
                  </>
                }
                onUploadRequested={() => {
                  form.setFieldValue("image.uploading", true);
                }}
                onUploadSucceed={() => {
                  form.setFieldValue("image.uploading", false);
                }}
                onUploadFailed={() => {
                  form.setFieldValue("image.uploading", false);
                }}
                onChange={(_, value) => {
                  form.setFieldValue("image.value", value);
                }}
              />
            </>
          )}
        </FastField>
      </AppDialogContent>
      <AppDialogActions>
        <SubmitButton />
      </AppDialogActions>
    </>
  );
};

const SellerVerificationRequestDialog = (
  props: SellerVerificationRequestDialogProps
) => {
  const {
    userShopId,
    open,
    onClose,
    onUserShopVerificationRequestSubmitSucceed,
  } = props;

  const [submitted, setSubmitted] = useState(false);

  const formikRef = useRef<FormikProps<UserShopVerificationRequestValues>>(
    null!
  );
  const submitUserShopVerificationRequestSourceRef =
    useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const handleSubmit = async (values: UserShopVerificationRequestValues) => {
    if (!!values.image?.uploading) {
      toast.info(t("uploadingFileInfoMessage")!);
      return;
    }
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    submitUserShopVerificationRequestSourceRef.current?.cancel &&
      submitUserShopVerificationRequestSourceRef.current.cancel();
    submitUserShopVerificationRequestSourceRef.current =
      axios.CancelToken.source();
    try {
      const { data: response } = await (!!userShopId
        ? authApi.updateUserShop({
            params: {
              id: userShopId,
              address: values.address,
              contact: values.contact,
              image: values.image?.value?.value!,
              title: values.title,
              website: values.website,
              merchant_location_id: values?.merchant_location?.id,
            },
            cancelToken:
              submitUserShopVerificationRequestSourceRef.current.token,
          })
        : authApi.submitUserShopVerificationRequest({
            params: {
              address: values.address,
              contact: values.contact,
              image: values.image?.value?.value!,
              title: values.title,
              website: values.website,
              merchant_location_id: values?.merchant_location?.id,
            },
            cancelToken:
              submitUserShopVerificationRequestSourceRef.current.token,
          }));
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        setSubmitted(true);
        onUserShopVerificationRequestSubmitSucceed &&
          onUserShopVerificationRequestSubmitSucceed();
        formikRef.current.resetForm({
          values: initialValues,
          submitCount: 0,
          errors: {},
          touched: {},
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      const message = axios.isAxiosError(error)
        ? (error.response?.data as any)?.message || error.message
        : "";
      toast.error(message);
    }

    loadingScreenOverlayService.close();
  };

  const initialValues = useMemo<UserShopVerificationRequestValues>(() => {
    return {
      address: "",
      contact: "",
      image: {
        uploading: false,
        value: null,
      },
      title: "",
      website: "",
      merchant_location: null,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required(t("sellerNameIsRequired")),
      contact: yup
        .string()
        .required(t("contactNumberIsRequired"))
        .test(
          "valid-phone",
          t("contactNumberIsInvalid")!,
          (phoneNumber: any) => {
            return !phoneNumber || /^[+\d]\d+$/gi.test(phoneNumber ?? "");
          }
        ),
      website: yup
        .string()
        .required(t("websiteIsRequired"))
        .test("url", t("urlIsInvalid")!, (website: any) => {
          return (
            commonHelpers.validateUrl(website) ||
            commonHelpers.validateDomain(website)
          );
        }),
      image: yup
        .object()
        .nullable()
        .test(
          "required",
          t("businessCertificationIsRequired"),
          (image: any) => {
            return !!image?.value;
          }
        ),
    });
  }, [t]);

  const isMounted = useIsMounted();

  return (
    <SellerVerificationRequestDialogContext.Provider
      value={{
        open,
        onClose,
      }}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <AppDialog
          maxWidth="sm"
          scroll="body"
          mobileScroll="paper"
          mobileFullScreen
          fullWidth
          keepMounted
          open={!!open}
          sx={{
            pointerEvents: !!open ? "auto" : "none",
          }}
          PaperComponent={PaperForm}
          onClose={onClose as any}
          onTransitionEnd={() => {
            !open && setSubmitted(false);
          }}
        >
          {!submitted && <SimpleForm />}
          {!!submitted && <SubmissionSuccessContent />}
        </AppDialog>
      </Formik>
    </SellerVerificationRequestDialogContext.Provider>
  );
};

export default SellerVerificationRequestDialog;
