import AppToolbar from "@/components/AppToolbar";

import useStyles from "./InboxToolbar.styles";

import type { AppToolbarProps } from "@/components/AppToolbar";

type InboxToolbarProps = AppToolbarProps;

const InboxToolbar = (props: InboxToolbarProps) => {
  const { className, ...rest } = props;

  const { classes, cx } = useStyles();

  return <AppToolbar className={cx(classes.root, className)} {...rest} />;
};

export default InboxToolbar;
