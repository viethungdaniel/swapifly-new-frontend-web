import { createContext } from "react";

export interface BookmarksContextValue {
  unBookmarkedProductCountRef: React.MutableRefObject<number>;
}

const BookmarksContext = createContext<BookmarksContextValue>(null!);

export default BookmarksContext;
