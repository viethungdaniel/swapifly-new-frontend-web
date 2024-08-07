import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import _isEqual from "lodash/isEqual";

import { userApi } from "@/utils/apis";
import { axiosHelpers, formikHelpers } from "@/utils/helpers";
import { loadingScreenOverlayService } from "@/services";
import { commonConstants } from "@/utils/constants";

import { FastField, Form, Formik, useFormikContext } from "formik";
import AppDialog from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppButton from "@/components/AppButton";
import AppPaper from "@/components/AppPaper";
import AppTextField from "@/components/AppTextField";
import AppDialogActions from "@/components/AppDialogActions";

import { forwardRef, useContext, useMemo, useRef } from "react";
import { useIsMounted, useOnLeavePageConfirmation } from "@/hooks";

import UserReportDialogContext from "@/components/UserReportDialog/UserReportDialog.context";

import { useTranslation } from "next-i18next";

import type { FastFieldProps, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";

type ProductReportValues = {
  contact: string;
  why: string;
};

export type UserReportDialogProps = {
  userId?: number | null;
  open?: boolean;
  onClose?: Function;
  onProductReportSubmitSucceed?: Function;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const LeavePageConfirmation = () => {
  const { open } = useContext(UserReportDialogContext);

  const { values, initialValues } = useFormikContext<ProductReportValues>();

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

const SimpleForm = () => {
  const { onClose } = useContext(UserReportDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("reportListing")}
      </AppDialogTitle>
      <AppDialogContent>
        <FastField name="contact">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("contactInformation")}
              placeholder={t("contactInformationReminderPlaceholder")}
              required
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
        <FastField name="why">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("reason")}
              placeholder={t("reasonReminderPlaceholder")}
              required
              bgColor="common.white"
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
              fullWidth
              multiline
              minRows={5}
              maxRows={8}
              {...field}
            />
          )}
        </FastField>
      </AppDialogContent>
      <AppDialogActions>
        <SubmitButton />
      </AppDialogActions>
    </>
  );
};

const UserReportDialog = (props: UserReportDialogProps) => {
  const { open, userId, onClose, onProductReportSubmitSucceed } = props;

  const formikRef = useRef<FormikProps<ProductReportValues>>(null!);
  const reportProductSourceRef = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const handleSubmit = async (values: ProductReportValues) => {
    if (!userId) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    reportProductSourceRef.current?.cancel &&
      reportProductSourceRef.current.cancel();
    reportProductSourceRef.current = axios.CancelToken.source();
    try {
      const { data: response } = await userApi.reportUser({
        params: {
          user_id: userId,
          contact: values.contact,
          why: values.why,
        },
        cancelToken: reportProductSourceRef.current.token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        onProductReportSubmitSucceed && onProductReportSubmitSucceed();
        formikRef.current.resetForm({
          values: initialValues,
          submitCount: 0,
          errors: {},
          touched: {},
        });
        toast.success(t("reportedSuccessfully"));
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

  const initialValues = useMemo<ProductReportValues>(() => {
    return {
      contact: "",
      why: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      contact: yup
        .string()
        .trim()
        .required(t("contactInformationIsRequired")!)
        .min(commonConstants.TITLE_TEXT_MIN_LENGTH, ({ min }) =>
          t("contactInformationMinCharacterWithCount", {
            count: min,
          })
        )
        .max(commonConstants.DESCRIPTION_TEXT_MAX_LENGTH, ({ max }) =>
          t("contactInformationMaxCharacterWithCount", {
            count: max,
          })
        ),
      why: yup
        .string()
        .trim()
        .min(commonConstants.TITLE_TEXT_MIN_LENGTH, ({ min }) =>
          t("reasonMinCharacterWithCount", {
            count: min,
          })
        )
        .max(commonConstants.DESCRIPTION_TEXT_MAX_LENGTH, ({ max }) =>
          t("reasonMaxCharacterWithCount", {
            count: max,
          })
        )
        .required(t("reasonIsRequired")!),
    });
  }, [t]);

  const isMounted = useIsMounted();

  return (
    <UserReportDialogContext.Provider
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
        >
          <SimpleForm />
        </AppDialog>
      </Formik>
    </UserReportDialogContext.Provider>
  );
};

export default UserReportDialog;
