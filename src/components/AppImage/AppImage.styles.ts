import { makeStyles } from "tss-react/mui";

type Params = {
  width?: number | `${number}`;
  height?: number | `${number}`;
  objectFit?: string;
  objectPosition?: string;
};

const useStyles = makeStyles<Params>({
  name: "appImage",
})((_, params) => {
  return {
    root: {
      position: "relative",
      width: params?.width,
      height: params?.height,
    },
    img: {
      objectFit: params.objectFit || ("cover" as any),
      objectPosition: params.objectPosition || "top center",
    },
    errorImg: {
      objectFit: "contain" as any,
      objectPosition: "center",
    },
  };
});

export default useStyles;
