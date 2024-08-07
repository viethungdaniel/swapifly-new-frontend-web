import { createContext } from "react";

export interface SlugUserContextValue {
  userSlug: string;
}

const SlugUserContext = createContext<SlugUserContextValue>(null!);

export default SlugUserContext;
