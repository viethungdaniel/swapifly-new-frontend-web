import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "rotated">({
  name: "PhoneTextField",
  uniqId: "j63zwY",
})((theme, _, classes) => {
  return {
    countryCodeAutocomplete: {
      padding: theme.spacing(2.5, 2.5, 1),
    },
    countryCodeAutocompletePopper: {
      width: "100% !important" as any,
      position: "relative !important" as any,
      transform: "initial !important" as any,
    },
    arrowDropdownIcon: {
      rotate: "0deg",
      transition: theme.transitions.create(["rotate"], {
        duration: theme.transitions.duration.shortest,
      }),
      [`&.${classes.rotated}`]: {
        rotate: "180deg",
      },
    },
    rotated: {},
  };
});

export default useStyles;
