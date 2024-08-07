import type { FormikHelpers, FormikHandlers, FormikProps } from "formik";
import _get from "lodash/get";

export const handleValidateAndSubmit =
  <V>({
    values,
    handleSubmit,
    validateForm,
  }: {
    values: V;
    handleSubmit: FormikHandlers["handleSubmit"];
    validateForm: FormikHelpers<V>["validateForm"];
  }) =>
  async (event?: any) => {
    let formEl: HTMLFormElement | null = null;
    const buttonEl = event.target as HTMLButtonElement;
    if (!!buttonEl) formEl = buttonEl.closest("form") || null;
    handleSubmit(event);

    const errors = await validateForm(values);

    if (!formEl) return;

    let isFocused = false;

    const focusErrorEl = (errors: Object, namePath: string = "") => {
      for (const [name, error] of Object.entries(errors)) {
        if (isFocused) break;
        if (typeof error === "string") {
          const inputEl = (formEl!.querySelector(
            `input[name="${namePath}${name}"]`
          ) || formEl!.querySelector(`textarea[name="${namePath}${name}"]`)) as
            | HTMLInputElement
            | HTMLTextAreaElement;
          if (!!inputEl) {
            isFocused = true;
            inputEl.focus();
            break;
          } else {
            const el = formEl!.querySelector(
              `*[data-name="${namePath}${name}"]`
            ) as HTMLElement;
            if (!!el) {
              isFocused = true;
              el.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              break;
            }
          }
        } else if (Array.isArray(error) && error.length > 0) {
          for (const [errIndex, err] of (error as any).entries()) {
            // error.forEach((err, errIndex) =>
            focusErrorEl(err, `${namePath}${name}.${errIndex}.`);
            // );
          }
        } else focusErrorEl(error, `${namePath}${name}.`);
      }
    };
    focusErrorEl(errors);
  };

export const showError = ({
  error,
  submitCount,
  touched,
}: {
  error?: string;
  submitCount: number;
  touched?: boolean;
}) => {
  return (!!touched || submitCount > 0) && typeof error === "string"
    ? error
    : "";
};

export const shouldUpdate =
  (otherFieldName?: string | string[]) =>
  (
    prevFastFieldProps: { name: string; formik: FormikProps<any> },
    curFastFieldProps: { name: string; formik: FormikProps<any> }
  ) => {
    const otherFieldNames = Array.isArray(otherFieldName)
      ? otherFieldName
      : otherFieldName
      ? [otherFieldName]
      : [];
    const names = [curFastFieldProps.name].concat(otherFieldNames);

    const res = names.some((name) => {
      if (
        _get(curFastFieldProps.formik.values, name) !==
          _get(prevFastFieldProps.formik.values, name) ||
        _get(curFastFieldProps.formik.errors, name) !==
          _get(prevFastFieldProps.formik.errors, name) ||
        _get(curFastFieldProps.formik.touched, name) !==
          _get(prevFastFieldProps.formik.touched, name) ||
        Object.keys(curFastFieldProps).length !==
          Object.keys(prevFastFieldProps).length ||
        curFastFieldProps.formik.isSubmitting !==
          prevFastFieldProps.formik.isSubmitting
      ) {
        return true;
      } else {
        return false;
      }
    });
    return res;
  };
