import { Tab } from "@mui/material";

import useStyles from "./AppTab.styles";

import type { TabProps } from "@mui/material";
import type {
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
} from "@mui/material/ButtonBase";

type CustomAppTabProps = {};

export type AppTabProps = Omit<TabProps, keyof CustomAppTabProps> &
  CustomAppTabProps;

type AppTabTypeMap<
  P = {},
  D extends React.ElementType = "div"
> = ExtendButtonBaseTypeMap<{
  props: P & AppTabProps;
  defaultComponent: D;
}>;

type AppTabComponent = ExtendButtonBase<AppTabTypeMap>;

const AppTab: AppTabComponent = (props: AppTabProps) => {
  const { classes: muiClasses, ...rest } = props;

  const { classes, cx } = useStyles();

  return (
    <Tab
      {...rest}
      classes={{
        ...muiClasses,
        root: cx(classes.root, muiClasses?.root),
        selected: cx(classes.selected, muiClasses?.selected),
      }}
    />
  );
};

export default AppTab;
