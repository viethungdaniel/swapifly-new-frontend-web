import * as yup from "yup";
import _isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";

import { commonHelpers, formikHelpers } from "@/utils/helpers";
import { loadingScreenOverlayService } from "@/services";
import { storeProductAction } from "@/store";

import AppPaper from "@/components/AppPaper";
import AppPaperContent from "@/components/AppPaperContent";
import AppTextField from "@/components/AppTextField";
import FileUpload from "@/components/FileUpload";
import { Grid, useMediaQuery } from "@mui/material";
import { FastField, Form, Formik, useFormikContext } from "formik";
import MainBottomAppBarToolbar from "@/components/MainBottomAppBarToolbar";
import AppBottomAppBar from "@/components/AppBottomAppBar/AppBottomAppBar";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import AppContainer from "@/components/AppContainer";
import AppButton from "@/components/AppButton";
import ReactPlayer from "react-player/youtube";
// import ReactPlayerFacebook from "react-player/facebook";

import PlayFilledSvg from "@@/public/images/svgs/play-filled.svg";

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useOnLeavePageConfirmation } from "@/hooks";
import { useRouter } from "next/router";

import useStyles from "./SalesForm.styles";

import type { FileValue } from "@/components/FileUpload";
import type { FastFieldProps, FormikProps } from "formik";

type SalesFormValues = {
  youtube_link: string;
  images: {
    files: FileValue[];
    uploading: boolean;
  };
  video: {
    file: FileValue | null;
    uploading: boolean;
  };
};

const LeavePageConfirmation = () => {
  const { values, initialValues } = useFormikContext<SalesFormValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues),
  });

  return null;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } =
    useFormikContext<SalesFormValues>();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      variant="contained"
      color="primary"
      type="submit"
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t("next")}
    </AppButton>
  );
};

const SubmitBottomAppBar = () => {
  const { theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return isTabletDown ? (
    <>
      <AppBottomAppBar>
        <MainBottomAppBarToolbar>
          <SubmitButton />
        </MainBottomAppBarToolbar>
      </AppBottomAppBar>
    </>
  ) : null;
};

const SimpleForm = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <Form>
      <LeavePageConfirmation />
      <Grid container spacing={2.5}>
        <Grid item xs={12} tablet={6}>
          <AppPaper className={classes.paper}>
            <AppPaperContent className={classes.paperContent}>
              <FastField name="images">
                {({ field, form }: FastFieldProps) => (
                  <div data-name={"images.files"} className={classes.photo}>
                    <FileUpload
                      variant="image"
                      acceptedFileTypes={["image"]}
                      max={10}
                      multiple
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
                      classes={{
                        root: classes.photoFileUpload,
                        outlinedUpload: classes.fileUploadOutlinedUpload,
                      }}
                      value={field.value.files}
                      fileItemGridItemProps={{
                        xs: 4,
                        sm: 3,
                      }}
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
                  </div>
                )}
              </FastField>
            </AppPaperContent>
          </AppPaper>
        </Grid>
        <Grid item xs={12} tablet={6}>
          <AppPaper className={classes.paper}>
            <AppPaperContent className={classes.paperContent}>
              <FastField name="video">
                {({ field, form }: FastFieldProps) => (
                  <FileUpload
                    variant="video"
                    acceptedFileTypes={["video"]}
                    sx={{ mb: 2.5 }}
                    value={field.value.file}
                    fileItemGridItemProps={{
                      xs: 4,
                      sm: 3,
                    }}
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

              {/* <AppPaperContent className={classes.youtubePreview}>
                <AppTypography whiteSpace="nowrap">Preview:</AppTypography>
                <div className={classes.youtubePreviewPlayerWrapper}>
                  <ReactPlayerFacebook
                    key={Math.random()}
                    width="100%"
                    height={"100%"}
                    playsinline
                    config={{
                      appId: commonConfig.FACEBOOK_APP_ID,
                      attributes: {
                        // width: "100%",
                        // height: "100%",
                        // width: "277px",
                        width: "100%",
                        height: "100%",
                      },
                    }}
                    url={
                      "https://www.facebook.com/facebook/videos/1852431991605654/"
                    }
                    playIcon={
                      <AppSvgIcon
                        component={PlayFilledSvg}
                        sx={{ fontSize: 50 }}
                      />
                    }
                    playing={false}
                  />
                </div>
              </AppPaperContent> */}
            </AppPaperContent>
          </AppPaper>
        </Grid>
        {!isTabletDown && (
          <Grid item xs={12}>
            <AppContainer maxWidth="xs" disableGutters>
              <SubmitButton />
            </AppContainer>
          </Grid>
        )}
        {isTabletDown && <SubmitBottomAppBar />}
      </Grid>
    </Form>
  );
};

const SalesForm = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const formikRef = useRef<FormikProps<SalesFormValues>>(null!);

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const initialValues = useMemo<SalesFormValues>(() => {
    return {
      images: {
        files: [],
        uploading: false,
      },
      video: {
        file: null,
        uploading: false,
      },
      youtube_link: "",
    };
  }, []);

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
    });
  }, [t]);

  const handleSubmit = async (values: SalesFormValues) => {
    if (!!values.images?.uploading || !!values.video.uploading) {
      toast.info(t("uploadingFileInfoMessage")!);
      return;
    }
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    $s_productAction.setDraftProduct({
      videos: values.video.file?.value ? [values.video.file.value!] : [],
      video_thumbnails: values.video.file?.thumbnailPath
        ? [values.video.file.thumbnailPath!]
        : [],
      images:
        values.images.files.length > 0
          ? values.images.files.map((file) => file.value!)
          : [],
      youtube_link: values.youtube_link,
    });
    formikRef.current.resetForm({
      values,
      errors: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      touched: {},
    });
    await commonHelpers.sleep(250);
    router.push("/sell/new-item");
  };

  useEffect(() => {
    return () => {
      loadingScreenOverlayService.close();
    };
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <SimpleForm />
    </Formik>
  );
};

export default SalesForm;
