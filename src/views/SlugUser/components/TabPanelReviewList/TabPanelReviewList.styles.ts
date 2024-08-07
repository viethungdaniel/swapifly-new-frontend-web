import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "TabPanelReviewList",
  uniqId: "guDW9u",
})((theme, _, classes) => {
  return {
    title: {
      flex: 1,
      [theme.breakpoints.down("tablet")]: {
        "& span": {
          display: "none",
        },
      },
    },
    titleDivider: {
      [theme.breakpoints.down("tablet")]: {
        display: "none",
      },
    },
    sortTypeSelect: {
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    },
    reviewToolbar: {
      display: "flex",
      alignItems: "stretch",
    },
    reviewToolbarState: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingRight: theme.spacing(3),
      borderRight: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.down("sm")]: {
        paddingRight: theme.spacing(2),
      },
    },
    reviewToolbarStateStarPoint: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    reviewToolbarTypeChip: {
      flex: 1,
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
      paddingLeft: theme.spacing(3),
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing(1.25),
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        paddingLeft: theme.spacing(2),
      },
    },
    actions: {
      marginTop: theme.spacing(3.75),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    typeItemChip: {
      [`&.${classes.selected}`]: {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.tonalOpacity
        ),
        color: theme.palette.primary.main,
        ...theme.typography.bodyMed14,
        "&:hover": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.tonalOpacity
          ),
        },
      },
    },

    noSearchResults: {
      padding: theme.spacing(1.25),
    },

    reviewItem: {
      padding: theme.spacing(3.75, 0),
      display: "flex",
      gap: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        padding: theme.spacing(2.5, 0),
      },
    },
    reviewItemAvatar: {
      width: 40,
      height: 40,
    },
    reviewItemContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    reviewItemTitle: {
      display: "flex",
      alignItems: "baseline",
      gap: theme.spacing(1.25),
    },
    reviewItemProductItemPhoto: {
      width: 50,
      height: 50,
      borderRadius: 4,
    },
    reviewItemProductItem: {
      display: "flex",
      padding: theme.spacing(1.25),
      gap: theme.spacing(2.5),
      backgroundColor: theme.palette.common.lighterNeutral,
    },
    selected: {},
  };
});

export default useStyles;
