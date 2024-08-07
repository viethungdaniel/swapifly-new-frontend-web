import axios from "axios";

import { aiApi } from "@/utils/apis";
import { axiosHelpers } from "@/utils/helpers";

import { Divider, Skeleton } from "@mui/material";
import AIStylesSelectDialogContext from "@/components/AIStylesSelectDialog/AIStylesSelectDialog.context";
import AppDialogContent from "@/components/AppDialogContent";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemText from "@/components/AppListItemText";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppListItemIcon from "@/components/AppListItemIcon";
import AppSvgIcon from "@/components/AppSvgIcon";

import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import {
  AIStylesSelectDialogPropsContext,
  AI_STYLES_LIST_VIEW,
} from "@/components/AIStylesSelectDialog/AIStylesSelectDialog";

import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { FetchAiStylesResponseData } from "@/utils/apis/ai";
import type { CancelTokenSource } from "axios";

const AIStylesList = () => {
  const { onClose } = useContext(AIStylesSelectDialogPropsContext);
  const { view, changeSelectedAIStyles } = useContext(
    AIStylesSelectDialogContext
  );

  const [aiStyles, setAiStyles] = useState<FetchAiStylesResponseData["data"]>(
    []
  );
  const [aiStylesLoading, setAiStylesLoading] = useState(true);
  const [aiStylesError, setAiStylesError] = useState("");

  const fetchAiStylesSource = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const fetchAiStyles = async () => {
    fetchAiStylesSource.current = axios.CancelToken.source();
    setAiStylesLoading(true);
    setAiStylesError("");

    try {
      const { data: response } = await aiApi.fetchAiStyles({
        cancelToken: fetchAiStylesSource.current.token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        setAiStyles(response.data?.data ?? []);
      } else {
        setAiStylesError(response.message);
      }
    } catch (error) {
      if (!isMounted() || axios.isCancel(error)) return;
      setAiStylesError(axiosHelpers.getErrorMessage(error));
    }
    setAiStylesLoading(false);
  };

  const handleAIStylesChange = (aIStyles: (typeof aiStyles)[number]) => () => {
    changeSelectedAIStyles(aIStyles);
  };

  useEffect(() => {
    fetchAiStyles();

    return () => {
      fetchAiStylesSource.current?.cancel &&
        fetchAiStylesSource.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  if (view !== AI_STYLES_LIST_VIEW) return null;

  return (
    <>
      <AppDialogTitle
        onCloseButtonClick={
          !!onClose ? (event) => onClose(event, "escapeKeyDown") : undefined
        }
      >
        {t("selectAIStyle")}
      </AppDialogTitle>
      <AppDialogContent sx={{ p: "0px !important" }}>
        <AppList>
          {aiStylesLoading ? (
            [...Array.from(Array(8)).keys()].map((key, keyIndex) => (
              <Fragment key={key}>
                {keyIndex !== 0 && (
                  <AppListItem sx={{ py: 0, minHeight: "initial" }}>
                    <Divider sx={{ width: "100%" }} />
                  </AppListItem>
                )}
                <AppListItem>
                  <Skeleton sx={{ width: "100%" }} />
                </AppListItem>
              </Fragment>
            ))
          ) : aiStylesError ? (
            <AppListItem>
              <AppListItemText
                primary={"aiStylesError"}
                primaryTypographyProps={{
                  color: "error.main",
                }}
              />
            </AppListItem>
          ) : (
            aiStyles.map((aiStyle, aiStyleIndex) => (
              <Fragment key={aiStyle.id}>
                {aiStyleIndex !== 0 && (
                  <AppListItem sx={{ py: 0, minHeight: "initial" }}>
                    <Divider sx={{ width: "100%" }} />
                  </AppListItem>
                )}
                <AppListItemButton onClick={handleAIStylesChange(aiStyle)}>
                  <AppListItemText primary={aiStyle.name} />
                  <AppListItemIcon>
                    <AppSvgIcon
                      component={ArrowRightIcon}
                      fontSize="inherit"
                      sx={{ mr: "-2px" }}
                    />
                  </AppListItemIcon>
                </AppListItemButton>
              </Fragment>
            ))
          )}
        </AppList>
      </AppDialogContent>
    </>
  );
};

export default AIStylesList;
