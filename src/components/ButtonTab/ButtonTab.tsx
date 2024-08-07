import { Tab } from "@mui/material";

import useStyles from "./ButtonTab.styles";

import type { TabProps } from "@mui/material";
import type {
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
} from "@mui/material/ButtonBase";

type CustomButtonTabProps = {};

export type ButtonTabProps = Omit<TabProps, keyof CustomButtonTabProps> &
  CustomButtonTabProps;

type ButtonTabTypeMap<
  P = {},
  D extends React.ElementType = "div"
> = ExtendButtonBaseTypeMap<{
  props: P & ButtonTabProps;
  defaultComponent: D;
}>;

type ButtonTabComponent = ExtendButtonBase<ButtonTabTypeMap>;

const ButtonTab: ButtonTabComponent = (props: ButtonTabProps) => {
  const { classes: muiClasses, label, ...rest } = props;

  const { classes, cx } = useStyles();

  return (
    <Tab
      {...rest}
      label={
        label ? <span className="ButtonTab-label">{label}</span> : undefined
      }
      classes={{
        ...muiClasses,
        root: cx(classes.root, muiClasses?.root),
        selected: cx(classes.selected, muiClasses?.selected),
      }}
    />
  );
};

export default ButtonTab;
