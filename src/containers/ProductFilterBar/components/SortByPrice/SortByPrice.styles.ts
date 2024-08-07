import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "sortByPrice",
})((theme) => {
  return {
    sortByPriceForm: {
      maxWidth: `calc(100% - ${theme.spacing(4)})`,
      padding: theme.spacing(2.5, 3),
    },
    sortByPriceFormActions: {
      marginTop: theme.spacing(2.5),
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: theme.spacing(1.25),
    },
    sortByPriceArrowIcon: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create(["transform"]),
    },
    sortByPriceArrowIconRotated: {
      transform: "rotate(180deg)",
    },
  };
});

export default useStyles;
