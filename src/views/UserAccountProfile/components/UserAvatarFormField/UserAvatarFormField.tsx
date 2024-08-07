import axios from "axios";
import { toast } from "react-toastify";

import { axiosHelpers, imageHelpers } from "@/utils/helpers";
import { commonApi } from "@/utils/apis";
import {
  IMAGE_FILE_MAX_SIZE,
  imageExtensions,
} from "@/utils/constants/common.constants";

import AppAvatar from "@/components/AppAvatar";
import AppLoading from "@/components/AppLoading";
import AppButton from "@/components/AppButton";

import { useEffect, useRef } from "react";

import { useTranslation } from "next-i18next";
import { useIsMounted } from "@/hooks";

import useStyles from "./UserAvatarFormField.styles";

import type { CancelTokenSource } from "axios";
import type { FastFieldProps } from "formik";

const UserAvatar = (props: FastFieldProps) => {
  const { field, form } = props;

  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFileSourceRef = useRef<CancelTokenSource | null>(null);

  const { classes, cx } = useStyles();

  const handleAvatarReset = () => {
    form.setFieldValue("avatar", form.initialValues.avatar);
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file = Array.from(event.target.files!)[0];
    event.target.value = "";

    const fileExtension = `.${file.name.split(".").reverse()[0]}`.toLowerCase();

    if (file.size > IMAGE_FILE_MAX_SIZE) {
      toast.error(
        t("uploadedFileMaxSizeErrorMessage", {
          count: 1,
          fileName: file.name,
          fileMaxSize: IMAGE_FILE_MAX_SIZE / 1000000,
        })
      );
      return;
    }
    if (!(imageExtensions as unknown as string).includes(fileExtension)) {
      toast.error(
        t("invalidObjectMessage", {
          count: 1,
          fileName: file.name,
        })
      );
    }
    uploadFileSourceRef.current = axios.CancelToken.source();
    form.setFieldValue("avatar_uploading", true);
    try {
      const { data: response } = await commonApi.uploadFile({
        params: {
          file,
          type: "image",
        },
        cancelToken: uploadFileSourceRef.current.token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        form.setValues((prevValues: any) => ({
          ...prevValues,
          avatar_uploading: false,
          avatar: response.data,
        }));
        return;
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (!isMounted()) return;
      if (axios.isCancel(error)) return;
      const message = axiosHelpers.getErrorMessage(error);
      toast.error(message);
    }
    form.setFieldValue("avatar_uploading", false);
  };

  const handleFileInputClick = () => {
    if (!!form.values.avatar_uploading) return;
    fileInputRef.current?.click && fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      uploadFileSourceRef.current?.cancel &&
        uploadFileSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <div
      className={cx(
        classes.root,
        !!form.values.avatar_uploading && classes.loading
      )}
    >
      <div className={classes.content}>
        <div className={classes.avatarWrapper}>
          <AppAvatar
            className={classes.avatar}
            src={imageHelpers.imagePathLoader(field.value)}
            onClick={handleFileInputClick}
          />
          {!!form.values.avatar_uploading && (
            <AppLoading className={classes.avatarLoading} />
          )}
        </div>
        <div className={classes.actions}>
          <AppButton
            disabled={!!form.values.avatar_uploading}
            variant="text"
            size="small"
            color="common.blue"
            onClick={handleFileInputClick}
          >
            {t("changePhoto")}
          </AppButton>
          {field.value !== form.initialValues.avatar && (
            <AppButton
              disabled={!!form.values.avatar_uploading}
              variant="text"
              size="small"
              color="common.darkNeutral"
              onClick={handleAvatarReset}
            >
              {t("reset")}
            </AppButton>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={imageExtensions.join(", ")}
        style={{
          display: "none",
        }}
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default UserAvatar;
