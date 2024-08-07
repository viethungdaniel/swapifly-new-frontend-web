import axios from "axios";

import { aiApi } from "@/utils/apis";
import { axiosHelpers } from "@/utils/helpers";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import LoadingOverlay from "@/components/LoadingOverlay";
import AppDialogActions from "@/components/AppDialogActions";
import AppButton from "@/components/AppButton";
import AppTypewriter from "@/components/AppTypewriter";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppTypography from "@/components/AppTypography";

import ReGenerateIcon from "@@/public/images/icons/re-generate.svg";

import { useEventCallback, useIsMounted } from "@/hooks";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  AIStylesSelectDialogPropsContext,
  AI_STYLES_DESCRIPTION_VIEW,
  AI_STYLES_LIST_VIEW,
} from "@/components/AIStylesSelectDialog/AIStylesSelectDialog";
import AIStylesSelectDialogContext from "@/components/AIStylesSelectDialog/AIStylesSelectDialog.context";

import { useTranslation } from "next-i18next";

import useStyles from "./ViewAIStylesDescription.styles";

import type { CancelTokenSource } from "axios";

const ViewAIStylesDescription = () => {
  const { view, setView } = useContext(AIStylesSelectDialogContext);
  const { aIStylesDescriptionParams, onClose, onComplete } = useContext(
    AIStylesSelectDialogPropsContext
  );
  const { selectedAIStyles } = useContext(AIStylesSelectDialogContext);

  const { t } = useTranslation();

  const [
    aIStylesIdToAIStylesDescriptionItemMap,
    setAIStylesIdToAIStylesDescriptionItemMap,
  ] = useState<{
    [id: string]: {
      data: string;
      error: string;
      loading: boolean;
      fetchedCount: number;
    };
  }>({});

  const aIStylesIdToAIStylesDescriptionSourceMapRef = useRef<{
    [id: string]: CancelTokenSource;
  }>({});

  const aIStylesDescriptionItem = useMemo(() => {
    return (
      aIStylesIdToAIStylesDescriptionItemMap[selectedAIStyles!?.id] ?? null
    );
  }, [aIStylesIdToAIStylesDescriptionItemMap[selectedAIStyles!?.id]]);

  const { classes } = useStyles();

  const handleViewBack = () => {
    setView(AI_STYLES_LIST_VIEW);
  };

  const handleAIStylesDescriptionReGenerate = () => {
    fetchAIStylesDescription();
  };

  const handleAIStylesDescriptionApply = () => {
    onComplete &&
      onComplete({
        aIStyles: selectedAIStyles!,
        aIStylesDescription: aIStylesDescriptionItem.data,
      });
    onClose && onClose({}, "escapeKeyDown");
  };

  const fetchAIStylesDescription = useEventCallback(async () => {
    const aiStylesId = selectedAIStyles?.id;
    if (!aiStylesId) return;

    const aIStylesDescriptionItem =
      aIStylesIdToAIStylesDescriptionItemMap[aiStylesId];
    const aIStylesDescriptionSource =
      aIStylesIdToAIStylesDescriptionSourceMapRef.current[aiStylesId];
    aIStylesDescriptionSource?.cancel && aIStylesDescriptionSource.cancel();
    aIStylesIdToAIStylesDescriptionSourceMapRef.current[aiStylesId] =
      axios.CancelToken.source();
    const fetchedAIStylesDescriptionCount =
      (aIStylesDescriptionItem?.fetchedCount ?? 0) + 1;
    setAIStylesIdToAIStylesDescriptionItemMap(
      (prevAIStylesIdToAIStylesDescriptionItemMap) => ({
        ...prevAIStylesIdToAIStylesDescriptionItemMap,
        [aiStylesId]: {
          data: "",
          error: "",
          fetchedCount: fetchedAIStylesDescriptionCount,
          loading: true,
        },
      })
    );
    try {
      const { data: response } = await aiApi.fetchAiStyleDescription({
        params: {
          ai_style: aiStylesId,
          ord: fetchedAIStylesDescriptionCount,
          title: aIStylesDescriptionParams!?.title!,
          brand: aIStylesDescriptionParams!?.brandName,
        },
        cancelToken:
          aIStylesIdToAIStylesDescriptionSourceMapRef.current[aiStylesId].token,
      });
      if (!isMounted()) return;
      if (axiosHelpers.checkRequestSuccess(response)) {
        setAIStylesIdToAIStylesDescriptionItemMap(
          (prevAIStylesIdToAIStylesDescriptionItemMap) => ({
            ...prevAIStylesIdToAIStylesDescriptionItemMap,
            [aiStylesId]: {
              ...prevAIStylesIdToAIStylesDescriptionItemMap[aiStylesId],
              data: response.data,
              loading: false,
            },
          })
        );
      } else {
        setAIStylesIdToAIStylesDescriptionItemMap(
          (prevAIStylesIdToAIStylesDescriptionItemMap) => ({
            ...prevAIStylesIdToAIStylesDescriptionItemMap,
            [aiStylesId]: {
              ...prevAIStylesIdToAIStylesDescriptionItemMap[aiStylesId],
              data: response.data,
              loading: false,
            },
          })
        );
      }
    } catch (error) {
      if (!isMounted() || axios.isCancel(error)) return;
      const errorMessage = axiosHelpers.getErrorMessage(error);
      setAIStylesIdToAIStylesDescriptionItemMap(
        (prevAIStylesIdToAIStylesDescriptionItemMap) => ({
          ...prevAIStylesIdToAIStylesDescriptionItemMap,
          [aiStylesId]: {
            ...prevAIStylesIdToAIStylesDescriptionItemMap[aiStylesId],
            error: errorMessage,
            loading: false,
          },
        })
      );
    }
  });

  const fetchAiStyleDescriptionOnChangeSelectedAIStyles = useEventCallback(
    () => {
      const selectedAIStylesId = selectedAIStyles?.id;
      if (
        !!selectedAIStylesId &&
        !aIStylesIdToAIStylesDescriptionItemMap[selectedAIStylesId]
      )
        fetchAIStylesDescription();
    }
  );

  useEffect(() => {
    if (!isMounted() || view !== AI_STYLES_DESCRIPTION_VIEW) return;
    fetchAiStyleDescriptionOnChangeSelectedAIStyles();
  }, [selectedAIStyles?.id]);

  useEffect(() => {
    return () => {
      Object.entries(
        aIStylesIdToAIStylesDescriptionSourceMapRef.current
      ).forEach(([_, source]) => {
        source?.cancel && source.cancel();
      });
      aIStylesIdToAIStylesDescriptionSourceMapRef.current = {};
    };
  }, []);

  const isMounted = useIsMounted();

  if (view !== AI_STYLES_DESCRIPTION_VIEW) return null;

  return (
    <>
      <AppDialogTitle
        startActions={
          <>
            <AppIconButton
              edge="xy"
              color="text.primary"
              borderRadius="circular"
              variant="text"
              onClick={handleViewBack}
            >
              <AppSvgIcon
                component={ArrowLeftIcon}
                color="inherit"
                fontSize="inherit"
              />
            </AppIconButton>
          </>
        }
        onCloseButtonClick={
          !!onClose ? (event) => onClose(event, "escapeKeyDown") : undefined
        }
      >
        {selectedAIStyles?.name}
      </AppDialogTitle>
      <AppDialogContent>
        {!!aIStylesDescriptionItem && (
          <LoadingOverlay loading={aIStylesDescriptionItem.loading}>
            <div className={classes.aIDescriptionContent}>
              <AppTypography
                align="justify"
                className={classes.aIDescriptionContentPlaceholder}
              >
                {aIStylesDescriptionItem.data}
              </AppTypography>
              <AppTypewriter
                className={classes.typewriter}
                align="justify"
                options={{
                  strings: aIStylesDescriptionItem.data,
                  autoStart: true,
                  delay: 1,
                }}
              />
            </div>
          </LoadingOverlay>
        )}
      </AppDialogContent>
      {aIStylesDescriptionItem && (
        <AppDialogActions>
          <AppButton
            disabled={aIStylesDescriptionItem.loading}
            variant="outlined"
            color="text.primary"
            fullWidth
            noWrap
            startIcon={
              <AppSvgIcon
                component={ReGenerateIcon}
                fontSize="inherit"
                color={
                  aIStylesDescriptionItem.loading ? "inherit" : "common.blue"
                }
              />
            }
            onClick={handleAIStylesDescriptionReGenerate}
          >
            {t("reGenerate")}
          </AppButton>
          <AppButton
            disabled={aIStylesDescriptionItem.loading}
            variant="contained"
            color="primary"
            fullWidth
            noWrap
            onClick={handleAIStylesDescriptionApply}
          >
            {t("apply")}
          </AppButton>
        </AppDialogActions>
      )}
    </>
  );
};

export default ViewAIStylesDescription;
