import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "popperScrollingPaper",
})(() => {
  return {
    root: {
      "--offset": "16px",
      "--rect-bottom": "0px",
      "--rect-y": "0px",
      overflowY: "auto",
      overflowX: "clip",
      [`.MuiPopper-root[data-popper-placement="top"] &, .MuiPopper-root[data-popper-placement="top-start"] &, .MuiPopper-root[data-popper-placement="top-end"] &, .MuiPopper-root[data-popper-placement="left-end"] &, .MuiPopper-root[data-popper-placement="right-end"] &`]:
        {
          maxHeight: "calc(var(--rect-bottom) - var(--offset))",
        },
      [`.MuiPopper-root[data-popper-placement="bottom"] &, .MuiPopper-root[data-popper-placement="bottom-start"] &, .MuiPopper-root[data-popper-placement="bottom-end"] &, .MuiPopper-root[data-popper-placement="left-start"] &, .MuiPopper-root[data-popper-placement="right-start"] &`]:
        {
          maxHeight: "calc(100vh - var(--rect-y) - var(--offset))",
        },
      [`.MuiPopper-root[data-popper-placement="left"] &, .MuiPopper-root[data-popper-placement="right"] &`]:
        {
          maxHeight: "calc(100vh - var(--offset) - var(--offset))",
          marginTop: "var(--offset)",
          marginBottom: "var(--offset)",
        },
    },
  };
});

export default useStyles;
