import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "userSearch",
})((theme) => {
  return {
    userList: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(3.75),
    },
    userItem: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
    userItemAvatar: {
      width: 60,
      height: 60,
      filter: "brightness(1)",
      transition: theme.transitions.create(["filter"]),
      "&:hover": {
        filter: `brightness(${1 + theme.palette.action.hoverOpacity})`,
      },
    },
    userItemContent: {
      flex: 1,
      overflow: "hidden",
    },
    userItemContentName: {
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      wordBreak: "break-word",
    },
    userItemActions: {
      display: "flex",
      gap: theme.spacing(1.25),
    },
    userNoResults: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
    userNoResultsSvg: {
      height: 80,
    },
    loadMore: {
      marginTop: theme.spacing(3.75),
      display: "flex",
      justifyContent: "center",
    },
  };
});

export default useStyles;
