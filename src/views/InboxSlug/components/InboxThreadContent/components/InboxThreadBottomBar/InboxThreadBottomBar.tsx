import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import { storeInboxAction, storeInboxSelectors } from "@/store";
import { commonConstants, inboxConstants } from "@/utils/constants";
import { commonConfig } from "@/utils/config";
import { commonApi } from "@/utils/apis";
import { loadingScreenOverlayService } from "@/services";

import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppToolbar from "@/components/AppToolbar";
import AppTypography from "@/components/AppTypography";

import SendIcon from "@@/public/images/icons/send.svg";
import PhotoIcon from "@@/public/images/icons/photo.svg";

import { useEffect, useMemo, useRef, useState } from "react";

import useStyles from "./InboxThreadBottomBar.styles";
import {
  useAppDispatch,
  useAppMomentWithLocale,
  useAppSelector,
  useAppWebsocket,
  useDebouncedCallback,
  useIsMounted,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import type { CancelTokenSource } from "axios";

const InboxThreadBottomBar = () => {
  const [texting, setTexting] = useState("");

  const { momentWithLocale } = useAppMomentWithLocale();

  const { t } = useTranslation();

  const idToCheckInboxThreadMessageFailedTimeoutMap = useRef<{
    [feId: string]: ReturnType<typeof setTimeout>;
  }>({});
  const keyToUploadFileSourceMapRef = useRef<{
    [feId: string]: CancelTokenSource;
  }>({});
  const imageFileInputRef = useRef<HTMLInputElement>(null!);

  const dispatch = useAppDispatch();

  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );
  const $s_inboxThreadBlocked = useAppSelector(
    storeInboxSelectors.selectInboxThreadAuthBlocked
  );
  const $s_authUser = useAppSelector((state) => state.auth.user);

  const appWebsocket = useAppWebsocket({
    onInboxThreadMessageSubmit: (_, eventData) => {
      if (
        idToCheckInboxThreadMessageFailedTimeoutMap.current[
          eventData.data?.fe_id!
        ]
      ) {
        clearTimeout(
          idToCheckInboxThreadMessageFailedTimeoutMap.current[
            eventData.data?.fe_id!
          ]
        );
      }
    },
  });

  const acceptedFileExtensions = useMemo(() => {
    return commonConstants.imageExtensions as unknown as string[];
  }, []);

  const { classes } = useStyles();

  const checkInboxThreadMessageFailed = (feId: string) => () => {
    $s_inboxAction.submitInboxThreadMessageFailed({
      fe_id: feId,
    });
  };

  const changeFileValue = async (files: File[]) => {
    const acceptedFiles: {
      uuid: string;
      name: string;
      file: File;
    }[] = [];
    const invalidFiles: string[] = [];
    const overSizedImageFiles: string[] = [];

    files.forEach((file) => {
      const fileExtension = `.${
        file.name.split(".").reverse()[0]
      }`.toLowerCase();
      if (
        commonConstants.imageExtensions.includes(fileExtension as any) &&
        file.size > commonConstants.IMAGE_FILE_MAX_SIZE
      )
        overSizedImageFiles.push(file.name);
      else if (!acceptedFileExtensions.includes(fileExtension))
        invalidFiles.push(file.name);
      else {
        const uuid = uuidv4();
        const duplicateFileCount = files.filter(
          (f) => f.name === file.name
        ).length;
        if (duplicateFileCount > 0) {
          const blob = file.slice(0, file.size, file.type);
          const originalName = file.name.split(".").slice(0, -1).join(".");
          file = new File([blob], `${originalName}-${uuid}${fileExtension}`, {
            type: file.type,
          });
        }

        acceptedFiles.push({
          uuid,
          name: file.name,
          file,
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

    overSizedImageFiles.length > 0 &&
      toast.error(
        t("uploadedFileMaxSizeErrorMessage", {
          count: invalidFiles.length,
          fileName: invalidFiles.join(", "),
          fileMaxSize: commonConstants.IMAGE_FILE_MAX_SIZE / 1000000,
        })
      );

    if (acceptedFiles.length < 1) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);

    for (const acceptedFile of acceptedFiles) {
      const source = axios.CancelToken.source();
      Object.assign(keyToUploadFileSourceMapRef.current, {
        [`${acceptedFile.uuid}`]: source,
      });
      commonApi
        .uploadFile({
          params: {
            file: acceptedFile.file!,
            type: "image",
          },
          cancelToken: source.token,
        })
        .then(({ data: response }) => {
          if (!isMounted()) return;
          if (axiosHelpers.checkRequestSuccess(response)) {
            submitFileForm(response.data);
          } else {
            toast.error(
              t("failedUploadFileNameErrorMessage", {
                fileName: acceptedFile.name,
              })
            );
          }
        })
        .catch((error) => {
          if (!isMounted() || axios.isCancel(error)) return;
          toast.error(
            t("failedUploadFileNameErrorMessage", {
              fileName: acceptedFile.name,
            })
          );
        });
    }
    loadingScreenOverlayService.close();
  };

  const sendMessage = useDebouncedCallback((message: string) => {
    const feId = uuidv4();
    $s_inboxAction.submitInboxThreadMessage({
      fe_id: feId,
      content: message,
      content_type: inboxConstants.INBOX_THREAD_CONTENT_TEXT_TYPE,
      created_time: Number(
        momentWithLocale(
          momentWithLocale()
            .utcOffset(commonConfig.DEFAULT_SYSTEM_UTC_OFFSET)
            .format("YYYY-MM-DD HH:mm:ss")
        ).format("X")
      ),
      user_avatar: $s_authUser?.avatar!,
      user_id: $s_authUser?.id!,
      user_nickname: $s_authUser?.nickname!,
    });
    appWebsocket.submitInboxThreadMessage({
      feId,
      content: message,
      contentType: inboxConstants.INBOX_THREAD_CONTENT_TEXT_TYPE,
      inboxThreadId: $s_selectedInboxThreadId!,
    });
    idToCheckInboxThreadMessageFailedTimeoutMap.current[feId] = setTimeout(
      checkInboxThreadMessageFailed(feId),
      30000
    );
  }, 0);

  const handleTextingFormSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setTexting("");
    if (!texting) return;
    sendMessage(texting);
  };

  const submitFileForm = (fileUrl: string) => {
    if (!fileUrl) return;
    const feId = uuidv4();
    $s_inboxAction.submitInboxThreadMessage({
      fe_id: feId,
      content: fileUrl,
      content_type: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_IMAGE_TYPE,
      created_time: Number(
        momentWithLocale()
          .utcOffset(commonConfig.DEFAULT_SYSTEM_UTC_OFFSET)
          .format("X")
      ),
      user_avatar: $s_authUser?.avatar!,
      user_id: $s_authUser?.id!,
      user_nickname: $s_authUser?.nickname!,
    });
    appWebsocket.submitInboxThreadMessage({
      feId,
      content: fileUrl,
      contentType: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_IMAGE_TYPE,
      inboxThreadId: $s_selectedInboxThreadId!,
    });
    idToCheckInboxThreadMessageFailedTimeoutMap.current[feId] = setTimeout(
      checkInboxThreadMessageFailed(feId),
      30000
    );
  };

  const handleTextingTextFieldKeydown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !commonHelpers.isMobile() &&
      !event.shiftKey &&
      !event.repeat
    ) {
      const form = (event.target as HTMLTextAreaElement).closest("form");
      if (form) {
        event.preventDefault();
        form.requestSubmit();
      }
    }
  };

  const handleTextingChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTexting(event.target.value);
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files!);
    changeFileValue(files);
    event.target.value = "";
  };

  useEffect(() => {
    return () => {
      Object.entries(
        idToCheckInboxThreadMessageFailedTimeoutMap.current
      ).forEach(([_, callback]) => {
        clearTimeout(callback);
      });
      loadingScreenOverlayService.close();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <AppToolbar
      component="form"
      className={classes.root}
      onSubmit={handleTextingFormSubmit}
    >
      {$s_inboxThreadBlocked ? (
        <AppTypography className={classes.blockMessage}>
          {t("youCantReplayConversation")}
        </AppTypography>
      ) : (
        <>
          <div className={classes.startActions}>
            <AppIconButton
              edge={["start", "y"]}
              variant="text"
              color="text.primary"
              component="label"
            >
              <input
                ref={imageFileInputRef}
                type="file"
                accept={commonConstants.imageExtensions.join(", ")}
                className={classes.fileInput}
                onChange={handleImageFileChange}
              />
              <AppSvgIcon component={PhotoIcon} fontSize="inherit" />
            </AppIconButton>
          </div>
          <AppTextField
            classes={{
              root: classes.textingTextField,
            }}
            borderRadius="rounded"
            bgColor="common.lighterNeutral"
            fullWidth
            multiline
            maxRows={8}
            value={texting}
            onKeyDown={handleTextingTextFieldKeydown}
            onChange={handleTextingChange}
            endAdornment={
              <AppInputAdornment
                className={classes.textingInputAdornmentEnd}
                position="end"
              >
                <AppIconButton
                  type="submit"
                  variant="text"
                  edge="xy"
                  color="primary"
                >
                  <AppSvgIcon component={SendIcon} fontSize="inherit" />
                </AppIconButton>
              </AppInputAdornment>
            }
          />
        </>
      )}
    </AppToolbar>
  );
};

export default InboxThreadBottomBar;
