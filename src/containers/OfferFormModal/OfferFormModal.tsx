import _isEqual from "lodash/isEqual";
import * as yup from "yup";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { axiosHelpers, formikHelpers } from "@/utils/helpers";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import { FastField, Form, Formik, useFormikContext } from "formik";
import AppButton from "@/components/AppButton";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppNumberFormat from "@/components/AppNumberFormat";
import AppDialog from "@/components/AppDialog";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppDialogActions from "@/components/AppDialogActions";
import AppPaper from "@/components/AppPaper";

import { forwardRef, useContext, useEffect, useMemo, useRef } from "react";
import {
  useAppSelector,
  useAppWebsocket,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import OfferFormModalContext from "@/containers/OfferFormModal/OfferFormModal.context";

import type { FastFieldProps, FormikProps } from "formik";

export type OfferFormModalProps = {
  open: boolean;
  inboxThreadId: number;
  currency?: string;
  defaultValues?: Partial<OfferFormValues>;
  variant?: "created" | "updated" | null;
  onClose: () => void;
  onSubmitSucceed: () => void;
};

export type OfferFormValues = {
  price: EmptySafeNumber;
};

const LeavePageConfirmation = () => {
  const { open } = useContext(OfferFormModalContext);
  const { values, initialValues } = useFormikContext<OfferFormValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues) && !!open,
  });

  return null;
};

const PaperForm = forwardRef((props: any, ref: React.ForwardedRef<any>) => (
  <AppPaper ref={ref} {...props} component={Form} />
));

const SubmitButton = () => {
  const { variant } = useContext(OfferFormModalContext);
  const { values, validateForm, handleSubmit } =
    useFormikContext<OfferFormValues>();

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
      {variant === "updated" ? t("update") : t("offer")}
    </AppButton>
  );
};

const SimpleForm = () => {
  const { variant, currency, onClose } = useContext(OfferFormModalContext);

  const $s_commonCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  const offerInputRef = useRef<HTMLInputElement>(null!);

  const { t } = useTranslation();

  useEffect(() => {
    offerInputRef.current && offerInputRef.current.focus();
  }, []);

  return (
    <>
      <LeavePageConfirmation />
      <AppDialogTitle onCloseButtonClick={onClose}>
        {variant === "updated" ? t("editOffer") : t("offer")}
      </AppDialogTitle>
      <AppDialogContent>
        <FastField name="price">
          {({ field, form, meta }: FastFieldProps) => (
            <AppTextField
              autoFocus
              fullWidth
              placeholder="00.00"
              type="tel"
              inputProps={{
                pattern: "[0-9]*",
                decimalScale: 2,
                valueIsNumericString: true,
                allowNegative: false,
                isAllowed: (values: any) => {
                  const { floatValue } = values;
                  return (
                    typeof floatValue === "undefined" || (floatValue || 0) >= 1
                  );
                },
              }}
              inputComponent={AppNumberFormat as any}
              inputRef={offerInputRef}
              startAdornment={
                <AppInputAdornment position="start">
                  {currency || $s_commonCurrency}
                </AppInputAdornment>
              }
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

const OfferFormModal = (props: OfferFormModalProps) => {
  const {
    open,
    inboxThreadId,
    currency,
    defaultValues,
    variant = "created",
    onClose,
    onSubmitSucceed,
  } = props;

  const formikRef = useRef<FormikProps<OfferFormValues>>(null!);
  const submitFailedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const curFeIdRef = useRef<string | null>(null);

  const { t } = useTranslation();

  const appWebsocket = useAppWebsocket({
    onInboxThreadOfferCreate: (_, eventData) => {
      if (
        (eventData.data?.thread_id || eventData.data?.chat_id) !==
          inboxThreadId ||
        eventData.data?.fe_id !== curFeIdRef.current
      )
        return;
      curFeIdRef.current = null;
      clearTimeout(submitFailedTimeoutRef.current!);
      if (eventData.success) {
        onSubmitSucceed && onSubmitSucceed();
        formikRef.current.resetForm({
          values: formikRef.current.values,
          submitCount: 0,
          errors: {},
          touched: {},
        });
        toast.success(t("createdOfferSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
    onInboxThreadOfferUpdate: (_, eventData) => {
      if (
        (eventData.data?.thread_id || eventData.data?.chat_id) !==
          inboxThreadId ||
        eventData.data?.fe_id !== curFeIdRef.current
      )
        return;
      clearTimeout(submitFailedTimeoutRef.current!);
      if (eventData.success) {
        onSubmitSucceed && onSubmitSucceed();
        formikRef.current.resetForm({
          values: formikRef.current.values,
          submitCount: 0,
          errors: {},
          touched: {},
        });
        toast.success(t("updatedOfferSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
  });

  const initialValues = useMemo<OfferFormValues>(() => {
    return {
      price: defaultValues?.price ?? "",
    };
  }, [defaultValues]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      price: yup
        .number()
        .required(t("priceIsRequired")!)
        .min(
          1,
          ({ min }) =>
            t("priceMinNumberWithCount", {
              count: min,
            })!
        ),
    });
  }, [t]);

  const submitFailed = () => {
    toast.error(t("noResponseServerErrorMessage"));
    loadingScreenOverlayService.close();
  };

  const handleOfferFormSubmit = async (values: OfferFormValues) => {
    if (!inboxThreadId) return;
    if (variant === "updated") {
      const { isConfirmed } = await alertDialogService.fire({
        title: t("reOfferConfirmationTitle"),
        content: t("reOfferConfirmationContent"),
      });
      if (!isConfirmed) return;
    }
    curFeIdRef.current = uuidv4();

    const response =
      variant === "created"
        ? appWebsocket.createInboxThreadOffer({
            feId: curFeIdRef.current,
            inboxThreadId,
            price: values.price,
          })
        : appWebsocket.updateInboxThreadOffer({
            feId: curFeIdRef.current,
            inboxThreadId,
            price: values.price,
          });
    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      submitFailedTimeoutRef.current = setTimeout(submitFailed, 30000);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (!isMounted()) return;
    if (formikRef.current) {
      const initialValues = formikRef.current.initialValues;
      formikRef.current.resetForm({
        values: {
          ...initialValues,
          ...defaultValues,
        },
        touched: {},
        errors: {},
        submitCount: 0,
      });
    }
  }, [defaultValues]);

  useEffect(() => {
    return () => {
      loadingScreenOverlayService.close();
      alertDialogService.close();
      curFeIdRef.current = null;
      clearTimeout(submitFailedTimeoutRef.current!);
    };
  }, [open]);

  const isMounted = useIsMounted();

  return (
    <OfferFormModalContext.Provider
      value={{
        open,
        variant,
        currency,
        onClose,
      }}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleOfferFormSubmit}
      >
        <AppDialog
          maxWidth="xs"
          open={open && !!variant}
          PaperComponent={PaperForm}
          onClose={onClose}
        >
          <SimpleForm />
        </AppDialog>
      </Formik>
    </OfferFormModalContext.Provider>
  );
};

export default OfferFormModal;
