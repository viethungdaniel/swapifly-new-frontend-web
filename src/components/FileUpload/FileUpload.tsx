import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import _isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { axiosHelpers, imageHelpers } from "@/utils/helpers";
import { commonApi } from "@/utils/apis";
import {
  IMAGE_FILE_MAX_SIZE,
  VIDEO_FILE_MAX_SIZE,
  FILE_MAX_SIZE,
  imageExtensions,
  videoExtensions,
  otherFileExtensions,
  commonFileExtensions,
} from "@/utils/constants/common.constants";

import { Box, ButtonBase, Divider, Grid } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppIconButton from "@/components/AppIconButton";
import AppImage from "@/components/AppImage";
import LoadingLinearProgress from "@/components/LoadingLinearProgress";
import AppTooltip from "@/components/AppTooltip";
import AppFormHelperText from "@/components/AppFormHelperText";

import AddAPhotoIcon from "@@/public/images/icons/add-a-photo.svg";
import AddAVideoIcon from "@@/public/images/icons/add-a-video.svg";
import AddIcon from "@@/public/images/icons/add.svg";
import CancelIcon from "@@/public/images/icons/cancel.svg";
import PlayIcon from "@@/public/images/icons/play.svg";
import FileSvg from "@@/public/images/svgs/file.svg";
import ArrowMoveLeft from "@@/public/images/icons/arrow-move-left.svg";
import ArrowMoveRight from "@@/public/images/icons/arrow-move-right.svg";

import { Trans, useTranslation } from "next-i18next";
import { useEventCallback, useIsMounted } from "@/hooks";

import useStyles from "./FileUpload.styles";

import type { CancelTokenSource } from "axios";
import type { BoxProps, GridProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { AppFormHelperTextProps } from "@/components/AppFormHelperText";
import type { AppInputLabelProps } from "@/components/AppInputLabel";
import AppInputLabel from "@/components/AppInputLabel";
import { commonConstants } from "@/utils/constants";

export type FileValue = {
  uuid?: string;
  name: string;
  extension?: string;
  thumbnail?: string;
  thumbnailPath?: string;
  value?: string;
  file?: File;
  uploading?: boolean;
};

type CustomFileUploadProps = {
  variant?: "video" | "image" | "file";
  acceptedFileExtensions?: Array<(typeof commonFileExtensions)[number]>;
  acceptedFileTypes?: Array<"video" | "image" | "other">;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  moveable?: boolean;
  max?: number;
  value?: any;
  name?: string;
  label?: React.ReactNode;
  inputLabelProps?: AppInputLabelProps;
  helperText?: React.ReactNode;
  formHelperTextProps?: AppFormHelperTextProps;
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
  fileItemGridContainerProps?: GridProps;
  fileItemGridItemProps?: GridProps;
  getFileItemTag?: (file: any, index: number) => React.ReactNode;
  onChange?: (
    event: {
      target: {
        value?: any;
        name?: string;
      };
    },
    value: FileValue
  ) => void;
  onUploadRequested?: () => void;
  onUploadSucceed?: () => void;
  onUploadFailed?: () => void;
};

export type FileUploadProps = Omit<BoxProps, keyof CustomFileUploadProps> &
  CustomFileUploadProps;

type FileUploadTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & FileUploadProps;
  defaultComponent: D;
};
type FileUploadComponent = OverridableComponent<FileUploadTypeMap>;

const mapValueToFileValue = <
  V extends Partial<FileValue> | null | Partial<FileValue>[]
>(
  value: V,
  options?: { multiple?: boolean }
): FileValue[] => {
  const { multiple } = options || {};
  if (!!multiple) {
    return Array.isArray(value)
      ? value.map((v) => {
          const uuid = uuidv4();

          return {
            uuid: uuid,
            name: v.name!,
            extension: v.extension,
            thumbnail: v.thumbnail,
            uploading: false,
            value: v.value,
          };
        })
      : [];
  }
  const uuid = uuidv4();
  const v = value as FileValue | null;
  return !!v
    ? [
        {
          uuid: uuid,
          name: v.name!,
          extension: v.extension,
          thumbnail: v.thumbnail,
          uploading: false,
          value: v.value,
        },
      ]
    : [];
};

const FileUpload: FileUploadComponent = forwardRef(
  (props: FileUploadProps, ref: React.ForwardedRef<any>) => {
    const {
      required,
      disabled,
      error,
      multiple,
      moveable,
      name,
      max,
      value,
      label,
      inputLabelProps,
      helperText,
      formHelperTextProps,
      className,
      variant = "file",
      acceptedFileExtensions: controlledAcceptedFileExtensions,
      acceptedFileTypes,
      classes: appClasses,
      fileItemGridContainerProps,
      fileItemGridItemProps,
      getFileItemTag,
      onChange,
      onUploadRequested = () => {},
      onUploadSucceed = () => {},
      onUploadFailed = () => {},
      ...rest
    } = props;

    const { t } = useTranslation();

    const [hightLight, setHightLight] = useState(false);
    const [files, setFiles] = useState<FileValue[]>(
      mapValueToFileValue(value, { multiple })
    );

    const currentValueRef = useRef(value);
    const currentFilesRef = useRef(files);
    const uploadedCountRef = useRef(0);
    const keyToUploadFileSourceMapRef = useRef<{
      [uuid: string]: CancelTokenSource;
    }>({});

    const { classes, cx } = useStyles(undefined, {
      props: {
        classes: appClasses,
      },
    });

    const inputRef = useRef<HTMLInputElement>(null!);

    const acceptedFileExtensions = useMemo(() => {
      if (!!controlledAcceptedFileExtensions) {
        return controlledAcceptedFileExtensions.map(
          (acceptedFileExtension) => `.${acceptedFileExtension}`
        );
      }
      if (!!acceptedFileTypes) {
        let newAcceptedFileExtensions: string[] = [];
        if (acceptedFileTypes.includes("image"))
          newAcceptedFileExtensions =
            newAcceptedFileExtensions.concat(imageExtensions);
        if (acceptedFileTypes.includes("video"))
          newAcceptedFileExtensions =
            newAcceptedFileExtensions.concat(videoExtensions);
        if (acceptedFileTypes.includes("other"))
          newAcceptedFileExtensions =
            newAcceptedFileExtensions.concat(otherFileExtensions);
        return newAcceptedFileExtensions;
      }
      if (variant === "video") return videoExtensions as unknown as string[];
      if (variant === "image") return imageExtensions as unknown as string[];
      return commonFileExtensions as unknown as string[];
    }, [variant, controlledAcceptedFileExtensions, acceptedFileTypes]);

    const Icon = useMemo(() => {
      if (variant === "video") return AddAVideoIcon;
      if (variant === "image") return AddAPhotoIcon;
      return AddIcon;
    }, [variant]);

    const title = useMemo(() => {
      if (variant === "video")
        return (
          <Trans
            t={t}
            defaults="selectOrDragVideo"
            components={{
              p1: (
                <AppTypography
                  variant="bodyMed14"
                  color={disabled ? "text.disabled" : "common.blue"}
                  component="span"
                />
              ),
            }}
          />
        );
      if (variant === "image")
        return (
          <Trans
            t={t}
            defaults="selectOrDragPhoto"
            components={{
              p1: (
                <AppTypography
                  variant="bodyMed14"
                  color={disabled ? "text.disabled" : "common.blue"}
                  component="span"
                />
              ),
            }}
          />
        );
      return (
        <Trans
          t={t}
          defaults="selectOrDragFile"
          components={{
            p1: (
              <AppTypography
                variant="bodyMed14"
                color={disabled ? "text.disabled" : "common.blue"}
                component="span"
              />
            ),
          }}
        />
      );
    }, [variant, disabled, t]);

    const subtitle = useMemo(() => {
      if (variant === "video")
        return (
          <AppTypography color="text.secondary">
            (
            {t("uploadVideoMaxCountWithCount", {
              count: !!multiple ? max ?? 1 : 1,
            })}
            )
          </AppTypography>
        );
      if (variant === "image")
        return (
          <AppTypography color="text.secondary">
            (
            {t("uploadPhotoMaxCountWithCount", {
              count: !!multiple ? max ?? 1 : 1,
            })}
            )
          </AppTypography>
        );
      return (
        <AppTypography color="text.secondary">
          (
          {t("uploadFileMaxCountWithCount", {
            count: !!multiple ? max ?? 1 : 1,
          })}
          )
        </AppTypography>
      );
    }, [variant, max, multiple, t]);

    const handleFileUploadSucceeded = useEventCallback(
      (payload: { srcPath: string; thumbnailPath: string; uuid: string }) => {
        const { srcPath, thumbnailPath, uuid } = payload;
        uploadedCountRef.current =
          uploadedCountRef.current - 1 <= 0 ? 0 : uploadedCountRef.current - 1;
        delete keyToUploadFileSourceMapRef.current[uuid];
        if (Object.entries(keyToUploadFileSourceMapRef.current).length === 0)
          onUploadSucceed();

        const prevFiles = [...currentFilesRef.current];
        const newFiles = prevFiles.map((prevFile) => {
          if (prevFile.uuid === uuid) {
            return {
              ...prevFile,
              thumbnail: imageHelpers.imagePathLoader(thumbnailPath),
              thumbnailPath,
              value: srcPath,
              uploading: false,
            };
          }
          return prevFile;
        });

        currentValueRef.current = multiple ? newFiles : newFiles[0];
        currentFilesRef.current = newFiles;
        setFiles(newFiles);
        onChange &&
          onChange(
            {
              target: {
                name,
                value: currentValueRef.current,
              },
            },
            currentValueRef.current
          );
      }
    );

    const handleFileUploadFailed = useEventCallback(
      (payload: { uuid: string }) => {
        onUploadFailed();

        const { uuid } = payload;

        uploadedCountRef.current =
          uploadedCountRef.current - 1 <= 0 ? 0 : uploadedCountRef.current - 1;
        delete keyToUploadFileSourceMapRef.current[uuid];

        const prevFiles = [...currentFilesRef.current];
        const newFiles = prevFiles.filter((prevFile) => {
          return prevFile.uuid !== uuid;
        });
        currentFilesRef.current = newFiles;
        setFiles(newFiles);
      }
    );

    const changeFileValue = async (newFiles: File[]) => {
      if (multiple && !!max && (max ?? 1) < files.length + newFiles.length) {
        toast.error(t("uploadedFileMaxCountErrorMessage"));
        return;
      }
      const acceptedFiles: typeof files = [];
      const invalidFiles: string[] = [];
      const overSizedFiles: string[] = [];
      const overSizedVideoFiles: string[] = [];
      const overSizedImageFiles: string[] = [];

      newFiles.forEach((newFile) => {
        const fileExtension = `.${
          newFile.name.split(".").reverse()[0]
        }`.toLowerCase();
        if (
          commonConstants.imageExtensions.includes(fileExtension as any) &&
          newFile.size > IMAGE_FILE_MAX_SIZE
        )
          overSizedImageFiles.push(newFile.name);
        else if (
          commonConstants.videoExtensions.includes(fileExtension as any) &&
          newFile.size > VIDEO_FILE_MAX_SIZE
        )
          overSizedVideoFiles.push(newFile.name);
        else if (newFile.size > FILE_MAX_SIZE)
          overSizedFiles.push(newFile.name);
        else if (!acceptedFileExtensions.includes(fileExtension))
          invalidFiles.push(newFile.name);
        else {
          const uuid = uuidv4();
          const duplicateFileCount = files.filter(
            (f) => f.name === newFile.name
          ).length;
          if (duplicateFileCount > 0 && !!multiple) {
            const blob = newFile.slice(0, newFile.size, newFile.type);
            const originalName = newFile.name.split(".").slice(0, -1).join(".");
            newFile = new File(
              [blob],
              `${originalName}-${uuid}${fileExtension}`,
              {
                type: newFile.type,
              }
            );
          }

          acceptedFiles.push({
            uuid,
            extension: fileExtension,
            name: newFile.name,
            file: newFile,
            uploading: true,
            thumbnail: (imageExtensions as unknown as string).includes(
              fileExtension
            )
              ? URL.createObjectURL(newFile)
              : "",
            value: "",
          });
        }
      });

      invalidFiles.length > 0 &&
        toast.error(
          t("invalidObjectMessage", {
            count: invalidFiles.length,
            object: invalidFiles.join(", "),
          })
        );

      overSizedFiles.length > 0 &&
        toast.error(
          t("uploadedFileMaxSizeErrorMessage", {
            count: invalidFiles.length,
            fileName: invalidFiles.join(", "),
            fileMaxSize: FILE_MAX_SIZE / 1000000,
          })!
        );
      overSizedImageFiles.length > 0 &&
        toast.error(
          t("uploadedFileMaxSizeErrorMessage", {
            count: invalidFiles.length,
            fileName: invalidFiles.join(", "),
            fileMaxSize: IMAGE_FILE_MAX_SIZE / 1000000,
          })
        );
      overSizedVideoFiles.length > 0 &&
        toast.error(
          t("uploadedFileMaxSizeErrorMessage", {
            count: invalidFiles.length,
            fileName: invalidFiles.join(", "),
            fileMaxSize: VIDEO_FILE_MAX_SIZE / 1000000,
          })
        );

      if (acceptedFiles.length < 1) return;

      if (
        !multiple &&
        Object.entries(keyToUploadFileSourceMapRef.current).length > 0
      ) {
        Object.entries(keyToUploadFileSourceMapRef.current).forEach(
          ([_, source]) => {
            source.cancel();
          }
        );
        uploadedCountRef.current =
          uploadedCountRef.current - 1 < 0 ? 0 : uploadedCountRef.current - 1;
        keyToUploadFileSourceMapRef.current = {};
      }

      onUploadRequested && onUploadRequested();

      setFiles((prevFile) => {
        const newFiles = multiple
          ? [...prevFile, ...acceptedFiles]
          : [...acceptedFiles];
        currentFilesRef.current = newFiles;
        return newFiles;
      });

      for (const acceptedFile of acceptedFiles) {
        const source = axios.CancelToken.source();
        Object.assign(keyToUploadFileSourceMapRef.current, {
          [`${acceptedFile.uuid}`]: source,
        });
        if (
          (videoExtensions as unknown as string).includes(
            acceptedFile.extension!
          )
        ) {
          uploadedCountRef.current += 1;
          commonApi
            .uploadVideoFile({
              params: {
                file: acceptedFile.file!,
              },
              cancelToken: source.token,
            })
            .then(({ data: response }) => {
              if (!isMounted()) return;
              if (axiosHelpers.checkRequestSuccess(response)) {
                handleFileUploadSucceeded({
                  srcPath: response.data.video_path,
                  thumbnailPath: response.data.thumbnail_path,
                  uuid: `${acceptedFile.uuid}`,
                });
              } else {
                toast.error(
                  t("failedUploadFileNameErrorMessage", {
                    fileName: acceptedFile.name,
                  })
                );
                handleFileUploadFailed({ uuid: `${acceptedFile.uuid}` });
              }
            })
            .catch((error) => {
              if (!isMounted()) return;
              !axios.isCancel(error) &&
                toast.error(
                  t("failedUploadFileNameErrorMessage", {
                    fileName: acceptedFile.name,
                  })
                );
              handleFileUploadFailed({ uuid: `${acceptedFile.uuid}` });
            });
        } else {
          commonApi
            .uploadFile({
              params: {
                file: acceptedFile.file!,
                type: (imageExtensions as unknown as string).includes(
                  acceptedFile.extension!
                )
                  ? "image"
                  : "file",
              },
              cancelToken: source.token,
            })
            .then(({ data: response }) => {
              if (!isMounted()) return;
              if (axiosHelpers.checkRequestSuccess(response)) {
                handleFileUploadSucceeded({
                  srcPath: response.data,
                  thumbnailPath: response.data,
                  uuid: `${acceptedFile.uuid}`,
                });
              } else {
                toast.error(
                  t("failedUploadFileNameErrorMessage", {
                    fileName: acceptedFile.name,
                  })
                );
                handleFileUploadFailed({ uuid: `${acceptedFile.uuid}` });
              }
            })
            .catch((error) => {
              if (!isMounted()) return;
              !axios.isCancel(error) &&
                toast.error(
                  t("failedUploadFileNameErrorMessage", {
                    fileName: acceptedFile.name,
                  })
                );
              handleFileUploadFailed({ uuid: `${acceptedFile.uuid}` });
            });
        }
      }
    };

    const handleRemove =
      ({ index, uuid }: { index: number; uuid?: string }) =>
      () => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        if (!!keyToUploadFileSourceMapRef.current[`${uuid}`]?.cancel) {
          keyToUploadFileSourceMapRef.current[`${uuid}`].cancel();
        }
        currentFilesRef.current = newFiles;
        setFiles(newFiles);
        currentValueRef.current = multiple ? newFiles : newFiles[0];
        onChange &&
          onChange(
            {
              target: {
                name,
                value: currentValueRef.current,
              },
            },
            currentValueRef.current
          );
      };

    const handleChange: React.ChangeEventHandler<
      HTMLInputElement & EventTarget
    > = (event) => {
      const files = Array.from(event.target.files!);
      changeFileValue(files);
      event.target.value = "";
    };

    const handleDragOver: React.DragEventHandler = (event) => {
      event.preventDefault();
      if (!!disabled) return;
      setHightLight(true);
    };

    const handleDragLeave = () => {
      setHightLight(false);
    };

    const handleFileItemMoveRight = (fileIndex: number) => () => {
      const newFiles = [...currentFilesRef.current];
      if (fileIndex + 1 > newFiles.length - 1) return;
      const [reorderedNewFiles] = newFiles.splice(fileIndex, 1);
      newFiles.splice(fileIndex + 1, 0, reorderedNewFiles);
      currentFilesRef.current = newFiles;
      currentValueRef.current = multiple ? newFiles : newFiles[0];
      setFiles(newFiles);
      onChange &&
        onChange(
          {
            target: {
              name,
              value: currentValueRef.current,
            },
          },
          currentValueRef.current
        );
    };

    const handleFileItemMoveLeft = (fileIndex: number) => () => {
      if (fileIndex - 1 < 0) return;
      const newFiles = [...currentFilesRef.current];
      const [reorderedNewFiles] = newFiles.splice(fileIndex, 1);
      newFiles.splice(fileIndex - 1, 0, reorderedNewFiles);
      currentFilesRef.current = newFiles;
      currentValueRef.current = multiple ? newFiles : newFiles[0];
      setFiles(newFiles);
      onChange &&
        onChange(
          {
            target: {
              name,
              value: currentValueRef.current,
            },
          },
          currentValueRef.current
        );
    };

    const handleDrop: React.DragEventHandler = (event) => {
      event.preventDefault();
      setHightLight(false);
      if (!!disabled) return;
      const files = Array.from(event.dataTransfer.files);
      changeFileValue(files);
    };

    useEffect(() => {
      if (!isMounted()) return;
      if (!_isEqual(value, currentValueRef.current)) {
        currentValueRef.current = value;
        const newFiles = mapValueToFileValue(value, { multiple });
        currentFilesRef.current = newFiles;
        setFiles(newFiles);
      }
    }, [value, multiple]);

    useEffect(() => {
      if (!isMounted()) return;
      currentFilesRef.current = [];
      setFiles([]);
      Object.entries(keyToUploadFileSourceMapRef.current).forEach(
        ([_, source]) => {
          source.cancel();
        }
      );
      keyToUploadFileSourceMapRef.current = {};
    }, [multiple]);

    useEffect(() => {
      return () => {
        Object.entries(keyToUploadFileSourceMapRef.current).forEach(
          ([_, source]) => {
            source.cancel();
          }
        );
        keyToUploadFileSourceMapRef.current = {};
      };
    }, []);

    const isMounted = useIsMounted();

    return (
      <Box
        ref={ref}
        className={cx(
          classes.root,
          {
            [classes.error]: !!error && !disabled,
            [classes.disabled]: !!disabled,
          },
          className
        )}
        {...rest}
      >
        {typeof label !== "undefined" && (
          <AppInputLabel
            error={error}
            required={required}
            {...inputLabelProps}
            className={cx(classes.inputLabel, inputLabelProps?.className)}
            component="p"
          >
            {label}
          </AppInputLabel>
        )}
        <ButtonBase
          component="label"
          className={cx(classes.outlinedUpload, {
            [classes.outlinedUploadDragOver]: !disabled && hightLight,
          })}
          disableRipple={!!disabled}
          disableTouchRipple={!!disabled}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            disabled={!!disabled}
            type="file"
            accept={acceptedFileExtensions.join(", ")}
            multiple={!!multiple}
            className={classes.outlinedUploadInput}
            onChange={handleChange}
          />
          <AppSvgIcon
            component={Icon}
            color={disabled ? "text.disabled" : "common.blue"}
          />
          <AppTypography
            mt={0.5}
            color={disabled ? "text.disabled" : "text.primary"}
          >
            {title}
          </AppTypography>
          {subtitle}
        </ButtonBase>
        {typeof helperText !== "undefined" && (
          <AppFormHelperText error={error} {...formHelperTextProps}>
            {helperText}
          </AppFormHelperText>
        )}
        {files.length > 0 && (
          <>
            <Divider sx={{ my: 2.5 }} />
            <Grid container spacing={2.5} {...fileItemGridContainerProps}>
              {files.map((file, fileIndex) => (
                <Grid
                  xs="auto"
                  {...fileItemGridItemProps}
                  key={file.uuid || `${file.name}-${fileIndex}`}
                  item
                >
                  <div
                    className={cx(
                      classes.fileItem,
                      !!file.uploading && classes.loading
                    )}
                  >
                    <div className={classes.fileItemThumbnail}>
                      <div className={classes.fileItemToolbar}>
                        {moveable && (
                          <>
                            <AppTooltip placement="top" title={t("moveLeft")}>
                              <Box component="span" display="flex">
                                <AppIconButton
                                  variant="text"
                                  color="text.primary"
                                  borderRadius="circular"
                                  sx={{ p: 0.25, m: -0.25 }}
                                  disabled={fileIndex === 0}
                                >
                                  <AppSvgIcon
                                    component={ArrowMoveLeft}
                                    fontSize="inherit"
                                    onClick={handleFileItemMoveLeft(fileIndex)}
                                  />
                                </AppIconButton>
                              </Box>
                            </AppTooltip>
                            <AppTooltip placement="top" title={t("moveRight")}>
                              <Box component="span" display="flex">
                                <AppIconButton
                                  variant="text"
                                  color="text.primary"
                                  borderRadius="circular"
                                  sx={{ p: 0.25, m: -0.25 }}
                                  disabled={fileIndex === files.length - 1}
                                >
                                  <AppSvgIcon
                                    component={ArrowMoveRight}
                                    fontSize="inherit"
                                    onClick={handleFileItemMoveRight(fileIndex)}
                                  />
                                </AppIconButton>
                              </Box>
                            </AppTooltip>
                          </>
                        )}
                        <AppTooltip placement="top" title={t("delete")}>
                          <AppIconButton
                            variant="text"
                            color="text.primary"
                            borderRadius="circular"
                            sx={{ p: 0.25, m: -0.25 }}
                          >
                            <AppSvgIcon
                              component={CancelIcon}
                              fontSize="inherit"
                              onClick={handleRemove({
                                index: fileIndex,
                                uuid: file.uuid,
                              })}
                            />
                          </AppIconButton>
                        </AppTooltip>
                      </div>
                      {!!file.thumbnail && (
                        <AppImage
                          src={file.thumbnail}
                          fill
                          objectFit="cover"
                          objectPosition="center"
                        />
                      )}
                      {(videoExtensions as unknown as string).includes(
                        file.extension!
                      ) ? (
                        <AppSvgIcon
                          className={classes.fileItemPlayIcon}
                          component={PlayIcon}
                        />
                      ) : (
                        !(imageExtensions as unknown as string).includes(
                          file.extension!
                        ) && <FileSvg className={classes.fileItemFileSvg} />
                      )}
                      <div className={classes.fileItemBottomToolbar}>
                        <LoadingLinearProgress
                          className={classes.fileItemLoadingLinearProgress}
                          color="text.primary"
                          loading={!!file.uploading}
                        />
                        {getFileItemTag &&
                          !!getFileItemTag(file, fileIndex) && (
                            <div className={classes.fileItemTag}>
                              {getFileItemTag(file, fileIndex)}
                            </div>
                          )}
                      </div>
                    </div>
                    {!!file.name && (
                      <AppTypography className={classes.fileItemLabel}>
                        {file.name}
                      </AppTypography>
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    );
  }
);

export default FileUpload;
