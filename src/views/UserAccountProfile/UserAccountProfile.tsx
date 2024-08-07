import * as yup from "yup";
import { toast } from "react-toastify";
import { bindActionCreators } from "@reduxjs/toolkit";
import _isEqual from "lodash/isEqual";
import moment from "moment";
import axios from "axios";

import { axiosHelpers, formikHelpers, reduxHelpers } from "@/utils/helpers";
import loadingScreenOverlay from "@/services/loadingScreenOverlay";
import { storeAuthAction } from "@/store";
import { commonConstants, userConstants } from "@/utils/constants";

import { FastField, Form, Formik, useFormikContext } from "formik";
import { Box, Divider, FormGroup, useMediaQuery } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppTextField from "@/components/AppTextField";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";
import AppToolbar from "@/components/AppToolbar";
import AppTypography from "@/components/AppTypography";
import StickyAppBar from "@/components/StickyAppBar";
import AppContainer from "@/components/AppContainer";
import AppSelect from "@/components/AppSelect";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import UserAvatarFormField from "@/views/UserAccountProfile/components/UserAvatarFormField";
import UsernameFormField from "@/views/UserAccountProfile/components/UsernameFormField";
import AppDatePicker from "@/components/AppDatePicker";
import PhoneForm from "@/views/UserAccountProfile/components/PhoneForm";
import EmailForm from "@/views/UserAccountProfile/components/EmailForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import AsyncAutocomplete from "@/components/AsyncAutocomplete";

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";
import {
  useAppDispatch,
  useAppSelector,
  useIsMounted,
  useOnLeavePageConfirmation,
} from "@/hooks";

import useStyles from "./UserAccountProfile.styles";

import type { FastFieldProps, FormikHelpers, FormikProps } from "formik";
import type { CancelTokenSource } from "axios";

export type UpdateUserValues = {
  nickname: string;
  username: string;
  server_side_username_valid: boolean;
  avatar: string;
  avatar_uploading: boolean;
  describe: string;
  region: {
    id: number;
    title: string;
    [key: string]: any;
  } | null;
  sex: number | null;
  birthday: string;
  newsletter_swapifly: BooleanNumber;
  newsletter_partners: BooleanNumber;
};

const LeavePageConfirmation = () => {
  const { values, initialValues } = useFormikContext<UpdateUserValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues),
  });

  return null;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<UpdateUserValues>();

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
      {t("save")}
    </AppButton>
  );
};

const SimpleForm = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const genders = useMemo(() => {
    return Object.entries(userConstants.idToGenderLabelMap).map(
      ([id, label]) => ({
        id: Number(id),
        label,
      })
    );
  }, []);

  return (
    <Form>
      <LeavePageConfirmation />
      <StickyAppBar thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}>
        <AppToolbar>
          <AppTypography
            variant="titleSemi20"
            textTransform="capitalize"
            flex={1}
          >
            {t("editProfile")}
          </AppTypography>
          <div>
            <SubmitButton />
          </div>
        </AppToolbar>
      </StickyAppBar>
      {!isTabletDown && <Divider />}
      <AppContainer>
        <div className={classes.content}>
          <Box mb={2.5}>
            <FastField
              name="avatar"
              shouldUpdate={formikHelpers.shouldUpdate(["avatar_uploading"])}
            >
              {(fastFieldProps: FastFieldProps) => (
                <UserAvatarFormField {...fastFieldProps} />
              )}
            </FastField>
          </Box>
          <FastField name="nickname">
            {({ field, form, meta }: FastFieldProps) => (
              <AppTextField
                label={t("displayName")}
                fullWidth
                required
                bgColor="common.white"
                sx={{ mb: 1.25 }}
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
          <Box mb={1.25}>
            <FastField
              name="username"
              shouldUpdate={formikHelpers.shouldUpdate([
                "nickname",
                "server_side_username_valid",
              ])}
            >
              {(fastFieldProps: FastFieldProps) => (
                <UsernameFormField {...fastFieldProps} />
              )}
            </FastField>
          </Box>
          <FastField name="describe">
            {({ field, form, meta }: FastFieldProps) => (
              <AppTextField
                label={t("personalProfile")}
                fullWidth
                bgColor="common.white"
                sx={{ mb: 1.25 }}
                multiline
                minRows={5}
                maxRows={8}
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
          <FastField name="region">
            {({ field }: FastFieldProps) => (
              <AsyncAutocomplete
                module="regions"
                defaultInputProps={{
                  label: t("countryOrArea"),
                  bgColor: "white",
                }}
                {...field}
              />
            )}
          </FastField>
          <AppTypography my={2.5} variant="bodySemi16">
            {t("personalDetails")}
          </AppTypography>
          <EmailForm />
          <PhoneForm />
          <FastField name="sex">
            {({ field, form, meta }: FastFieldProps) => (
              <AppSelect
                label={t("gender")}
                fullWidth
                required
                bgColor="common.white"
                sx={{ mb: 1.25 }}
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
                {genders.map((gender) => (
                  <AppSelectMenuItem key={gender.id} value={gender.id}>
                    {t(gender.label)}
                  </AppSelectMenuItem>
                ))}
              </AppSelect>
            )}
          </FastField>
          <FastField name="birthday">
            {({ field, form, meta }: FastFieldProps) => (
              <AppDatePicker
                label={t("birthday")}
                format="DD-MM-YYYY"
                disableFuture
                slotProps={{
                  textField: {
                    fullWidth: true,
                    bgColor: "common.white",
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
                  },
                }}
                sx={{
                  mb: 1.25,
                }}
                {...field}
              />
            )}
          </FastField>
          <FormGroup>
            <FastField name="newsletter_partners">
              {({ field }: FastFieldProps) => (
                <AppFormControlLabel
                  label={t("latestTrendsAndUpdatesFromSwapifly")}
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
              )}
            </FastField>
            <FastField name="newsletter_swapifly">
              {({ field }: FastFieldProps) => (
                <AppFormControlLabel
                  label={t("promotionalOffersFromPartnersOfSwapifly")}
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
              )}
            </FastField>
          </FormGroup>
        </div>
      </AppContainer>
    </Form>
  );
};

const UserAccountProfile = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUser = useAppSelector((state) => state.auth.user);
  const $s_authUserLoading = useAppSelector((state) => state.auth.userLoading);
  const $s_authUserError = useAppSelector((state) => state.auth.userError);
  const $s_authUserChecking = useAppSelector(
    (state) => state.auth.userAuthChecking
  );

  const formikRef = useRef<FormikProps<UpdateUserValues>>(null!);
  const updateAuthUserSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchAuthUserSourceRef = useRef<CancelTokenSource | null>(null);

  const initialValues = useMemo<UpdateUserValues>(
    () => ({
      id: $s_authUser?.id!,
      nickname: $s_authUser?.nickname! ?? "",
      username: $s_authUser?.username! ?? "",
      server_side_username_valid: true,
      avatar: $s_authUser?.avatar! ?? "",
      avatar_uploading: false,
      describe: $s_authUser?.describe! ?? "",
      region: $s_authUser?.region ? $s_authUser?.region : null,
      sex: $s_authUser?.sex! ?? userConstants.CUSTOM_GENDER_ID,
      birthday: !!$s_authUser?.birthday!
        ? moment($s_authUser?.birthday!).format("DD-MM-YYYY")
        : "",
      newsletter_swapifly: $s_authUser?.newsletter_swapifly! ?? 0,
      newsletter_partners: $s_authUser?.newsletter_partners! ?? 0,
    }),
    [$s_authUser]
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      nickname: yup
        .string()
        .trim()
        .required(t("displayNameIsRequired")!)
        .min(commonConstants.NAME_TEXT_MIN_LENGTH, ({ min }) =>
          t("displayNameMinCharacterWithCount", {
            count: min,
          })
        )
        .max(commonConstants.TITLE_TEXT_MAX_LENGTH, ({ max }) =>
          t("displayNameMaxCharacterWithCount", {
            count: max,
          })
        ),
      username: yup
        .string()
        .trim()
        .required(t("usernameIsRequired")!)
        .matches(/(^[0-9a-z]+$)|(^[0-9a-z]+(\.[0-9a-z]+)+)$/, {
          excludeEmptyString: true,
          message: t("usernameContainsRules"),
        })
        .min(3, ({ min }) =>
          t("usernameMinCharacterWithCount", {
            count: min,
          })
        )
        .max(20, ({ max }) =>
          t("usernameMaxCharacterWithCount", {
            count: max,
          })
        )
        .test("valid-username", "username-existed", (username, cxt) => {
          const { server_side_username_valid } = cxt.parent;
          return !username || !!server_side_username_valid;
        }),
      describe: yup
        .string()
        .max(commonConstants.DESCRIPTION_TEXT_MAX_LENGTH, ({ max }) =>
          t("personalProfileMaxCharacterWithCount", {
            count: max,
          })
        ),
    });
  }, [t]);

  const handleSubmit = async (
    values: UpdateUserValues,
    formikHelpers: FormikHelpers<UpdateUserValues>
  ) => {
    if (values.avatar_uploading) {
      toast.info(t("uploadingFileInfoMessage")!);
      return;
    }
    loadingScreenOverlay.fire(`${t("saving")}...`);
    updateAuthUserSourceRef.current?.cancel &&
      updateAuthUserSourceRef.current.cancel();
    updateAuthUserSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.updateUserSaga,
      {
        params: {
          avatar: values.avatar,
          nickname: values.nickname,
          username: values.username,
          describe: values.describe,
          region: values.region?.id,
          sex: values.sex!,
          birthday: values.birthday,
          newsletter_partners: values.newsletter_partners,
          newsletter_swapifly: values.newsletter_swapifly,
        },
        cancelToken: updateAuthUserSourceRef.current.token,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      formikHelpers.resetForm({
        values: values,
        submitCount: 0,
        errors: {},
        touched: {},
      });
      toast.success(t("savedSuccessfully"));
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlay.close();
  };

  useEffect(() => {
    if (!$s_authUserChecking) {
      fetchAuthUserSourceRef.current = axios.CancelToken.source();
      $s_authAction.fetchUserSaga({
        cancelToken: fetchAuthUserSourceRef.current.token,
      });
    }
    return () => {
      fetchAuthUserSourceRef.current?.cancel &&
        fetchAuthUserSourceRef.current.cancel();
      updateAuthUserSourceRef.current?.cancel &&
        updateAuthUserSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <LoadingOverlay
      loading={$s_authUserLoading || !!$s_authUserError || !$s_authUser}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <SimpleForm />
      </Formik>
    </LoadingOverlay>
  );
};

export default UserAccountProfile;
