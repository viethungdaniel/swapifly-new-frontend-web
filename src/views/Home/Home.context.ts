import { createContext } from "react";

export type HomeContextValue = {
  openAdPopupDialog: () => void;
};

const HomeContext = createContext<HomeContextValue>(null!);

export default HomeContext;
