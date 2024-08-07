import { makeStyles } from "tss-react/mui";
import { commonHelpers } from "@/utils/helpers";

type SafeNumber = number | `${number}`;

const useStyles = makeStyles<{ width?: SafeNumber; height?: SafeNumber }>({
  name: "logoImages",
})((_, { width, height }) => {
  return {
    root: {
      height: !commonHelpers.isEmpty(height)
        ? height
        : !commonHelpers.isEmpty(width)
        ? "auto"
        : undefined,
      width: !commonHelpers.isEmpty(width)
        ? width
        : !commonHelpers.isEmpty(height)
        ? "auto"
        : undefined,
      objectFit: "contain",
      objectPosition: "center",
    },
  };
});

export default useStyles;
