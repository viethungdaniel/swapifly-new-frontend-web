import { createContext } from "react";

import type { FetchAiStylesResponseData } from "@/utils/apis/ai";

type SelectedAIStyles = FetchAiStylesResponseData["data"][number] | null;

export interface AIStylesSelectDialogContextValue {
  view: string;
  selectedAIStyles: SelectedAIStyles | null;
  changeSelectedAIStyles: (selectedAIStyles: SelectedAIStyles | null) => void;
  setView: React.Dispatch<string>;
}

const AIStylesSelectDialogContext =
  createContext<AIStylesSelectDialogContextValue>(null!);

export default AIStylesSelectDialogContext;
