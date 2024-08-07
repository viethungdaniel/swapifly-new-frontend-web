import AppDialog from "@/components/AppDialog";
import ViewAIStylesList from "@/components/AIStylesSelectDialog/components/ViewAIStylesList";
import ViewAIStylesDescription from "@/components/AIStylesSelectDialog/components/ViewAIStylesDescription";

import { createContext, useEffect, useState } from "react";

import AIStylesSelectDialogContext from "@/components/AIStylesSelectDialog/AIStylesSelectDialog.context";

import type { AppDialogProps } from "@/components/AppDialog";
import type { AIStylesSelectDialogContextValue } from "@/components/AIStylesSelectDialog/AIStylesSelectDialog.context";

export type AIStylesSelectDialogProps = {
  aIStylesDescriptionParams?: {
    title?: string;
    brandName?: string;
  } | null;
  open?: boolean;
  onClose?: AppDialogProps["onClose"];
  onComplete?: (data: {
    aIStyles: {
      id: string;
      name: string;
    };
    aIStylesDescription: string;
  }) => void;
};

export const AIStylesSelectDialogPropsContext =
  createContext<AIStylesSelectDialogProps>(null!);

export const AI_STYLES_LIST_VIEW = "AI_STYLES_LIST_VIEW";
export const AI_STYLES_DESCRIPTION_VIEW = "AI_STYLES_DESCRIPTION_VIEW";

const AIStylesSelectDialog = (props: AIStylesSelectDialogProps) => {
  const { open, aIStylesDescriptionParams, onClose } = props;

  const [selectedAIStyles, setSelectedAIStyles] =
    useState<AIStylesSelectDialogContextValue["selectedAIStyles"]>(null);
  const [view, setView] = useState(AI_STYLES_LIST_VIEW);

  const changeSelectedAIStyles: AIStylesSelectDialogContextValue["changeSelectedAIStyles"] =
    (newSelectedAIStyles) => {
      setSelectedAIStyles(newSelectedAIStyles);
      setView(AI_STYLES_DESCRIPTION_VIEW);
    };

  useEffect(() => {
    setView(AI_STYLES_LIST_VIEW);
    setSelectedAIStyles(null);
  }, [aIStylesDescriptionParams?.brandName, aIStylesDescriptionParams?.title]);

  return (
    <AIStylesSelectDialogContext.Provider
      value={{
        view,
        selectedAIStyles,
        changeSelectedAIStyles,
        setView,
      }}
    >
      <AIStylesSelectDialogPropsContext.Provider
        value={{
          ...props,
        }}
      >
        <AppDialog
          open={!!open}
          scroll="paper"
          mobileScroll="paper"
          mobileFullScreen
          keepMounted
          fullWidth
          maxWidth="xs"
          onClose={onClose}
          onTransitionEnd={() => {
            if (!open) {
              setSelectedAIStyles(null);
              setView(AI_STYLES_LIST_VIEW);
            }
          }}
        >
          <ViewAIStylesList />
          <ViewAIStylesDescription />
        </AppDialog>
      </AIStylesSelectDialogPropsContext.Provider>
    </AIStylesSelectDialogContext.Provider>
  );
};

export default AIStylesSelectDialog;
