import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "productFilterBar",
})((theme) => {
  return {
    root: {
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
    filtering: {
      flexWrap: "wrap",
    },
    filterProductCategory: {},
    filterAutocomplete: {
      flex: 1,
      "& .MuiInputBase-root": {
        flexWrap: "nowrap",
      },
      "& .MuiChip-root": {
        maxWidth: 120,
      },
      "& input": {
        flex: 1,
        minWidth: "50px !important",
        "&::placeholder": {
          color: theme.palette.text.primary,
          opacity: 1,
        },
      },
    },
    filterSelect: {
      "& .MuiChip-root": {
        maxWidth: 120,
      },
    },
    filterRest: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: theme.spacing(1.25),
    },
    filterInputPlaceholder: {
      color: theme.palette.text.primary,
      opacity: 1,
    },
  };
});

export default useStyles;
