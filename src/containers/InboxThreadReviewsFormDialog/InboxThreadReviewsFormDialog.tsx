import * as yup from "yup";
import { toast } from "react-toastify";
import _isEqual from "lodash/isEqual";

import { axiosHelpers, formikHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";
import { loadingScreenOverlayService } from "@/services";

import { Box } from "@mui/material";
import { FastField, Form, Formik, useFormikContext } from "formik";
import AppDialog from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppButton from "@/components/AppButton";
import AppPaper from "@/components/AppPaper";
import AppTextField from "@/components/AppTextField";
import AppDialogActions from "@/components/AppDialogActions";
import AppFormHelperText from "@/components/AppFormHelperText";
import AppRating from "@/components/AppRating";
import AppInputLabel from "@/components/AppInputLabel";

import { useTranslation } from "next-i18next";
import { forwardRef, useContext, useEffect, useMemo, useRef } from "react";
import { useAppWebsocket, useOnLeavePageConfirmation } from "@/hooks";

import InboxThreadReviewsFormDialogContext from "@/containers/InboxThreadReviewsFormDialog/InboxThreadReviewsFormDialog.context";

import type { FastFieldProps, FormikProps } from "formik";

type InboxThreadReviewsValues = {
  num: EmptySafeNumber;
  content: string;
};

export type InboxThreadReviewsFormDialogProps = {
  inboxThreadId?: number | null;
  open?: boolean;
  onClose?: Function;
  onSubmitSucceed?: Function;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const LeavePageConfirmation = () => {
  const { open } = useContext(InboxThreadReviewsFormDialogContext);

  const { values, initialValues } =
    useFormikContext<InboxThreadReviewsValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues) && !!open,
  });

  return null;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<InboxThreadReviewsValues>();

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
  const { onClose } = useContext(InboxThreadReviewsFormDialogContext);

  const { t } = useTranslation();

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("submitAReview")}
      </AppDialogTitle>
      <AppDialogContent>
        <FastField name="num">
          {({ field, form, meta }: FastFieldProps) => {
            const error = formikHelpers.showError({
              error: meta.error,
              submitCount: form.submitCount,
              touched: meta.touched,
            });
            return (
              <Box data-name={field.name} mb={1.25}>
                <AppInputLabel required error={!!error}>
                  {t("score")}
                </AppInputLabel>
                <AppRating
                  sx={{ mt: 0.5 }}
                  {...field}
                  value={field.value || 0}
                  onChange={(_, value) => {
                    form.setFieldValue(field.name, value);
                    form.setFieldTouched(field.name, true);
                  }}
                />
                {!!error && (
                  <AppFormHelperText error>{error}</AppFormHelperText>
                )}
              </Box>
            );
          }}
        </FastField>
        <FastField name="content">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              label={t("reviewDetails")}
              placeholder={t("reviewDetailsPlaceholder")}
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
        <AppFormHelperText>{t("reviewDetailsTextHelper")}</AppFormHelperText>
      </AppDialogContent>
      <AppDialogActions>
        <SubmitButton />
      </AppDialogActions>
    </>
  );
};

const InboxThreadReviewsFormDialog = (
  props: InboxThreadReviewsFormDialogProps
) => {
  const { open, inboxThreadId, onClose, onSubmitSucceed } = props;

  const formikRef = useRef<FormikProps<InboxThreadReviewsValues>>(null!);

  const toastSubmitFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const { t } = useTranslation();

  const appWebsocket = useAppWebsocket({
    onInboxThreadReviewsSubmit: (_, eventData) => {
      if (eventData.data?.chat_id !== inboxThreadId) return;
      clearTimeout(toastSubmitFailedTimeoutRef.current!);

      if (eventData.success) {
        toast.success(t("submittedReviewsSuccessfully"));
        onSubmitSucceed && onSubmitSucceed();
        formikRef.current.resetForm({
          values: formikRef.current.values,
          submitCount: 0,
          errors: {},
          touched: {},
        });
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
  });

  const toastSubmitFailed = () => {
    toast.error(t("noResponseServerErrorMessage"));
    loadingScreenOverlayService.close();
  };

  const handleSubmit = async (values: InboxThreadReviewsValues) => {
    if (!inboxThreadId) return;
    const response = appWebsocket.submitInboxThreadReviews({
      inboxThreadId,
      content: values.content,
      num: values.num,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      toastSubmitFailedTimeoutRef.current = setTimeout(
        toastSubmitFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const initialValues = useMemo<InboxThreadReviewsValues>(() => {
    return {
      num: "",
      content: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      num: yup.number().required(t("scoreIsRequired")!),
      content: yup
        .string()
        .trim()
        .min(commonConstants.TITLE_TEXT_MIN_LENGTH, ({ min }) =>
          t("reviewDetailsMinCharacterWithCount", {
            count: min,
          })
        )
        .max(commonConstants.DESCRIPTION_TEXT_MAX_LENGTH, ({ max }) =>
          t("reviewDetailsMaxCharacterWithCount", {
            count: max,
          })
        )
        .required(t("reviewDetailsIsRequired")!),
    });
  }, [t]);

  useEffect(() => {
    return () => {
      loadingScreenOverlayService.close();
      clearTimeout(toastSubmitFailedTimeoutRef.current!);
    };
  }, []);

  return (
    <InboxThreadReviewsFormDialogContext.Provider
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
    </InboxThreadReviewsFormDialogContext.Provider>
  );
};

export default InboxThreadReviewsFormDialog;
