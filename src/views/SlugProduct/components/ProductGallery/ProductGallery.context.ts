import { createContext } from "react";
import type { GalleryDialogProps } from "@/components/GalleryDialog";

export type ProductGalleryContextValue = {
  galleryItems: Array<
    GalleryDialogProps["items"][number] & {
      mediaData?: string;
    }
  >;
  openGalleryDialog: (galleyDialogItems: GalleryDialogProps["items"]) => void;
};

const ProductGalleryContext = createContext<ProductGalleryContextValue>(null!);

export default ProductGalleryContext;
