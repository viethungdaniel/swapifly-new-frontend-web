import { forwardRef } from "react";

import { TreeItem } from "@mui/x-tree-view/TreeItem";

import type { TreeItemProps } from "@mui/x-tree-view/TreeItem";

import useStyles from "./AppTreeItem.styles";

export type AppTreeItemProps = TreeItemProps;

const AppTreeItem = forwardRef(
  (props: AppTreeItemProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, sx, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <TreeItem
        ref={ref}
        {...rest}
        classes={{
          root: cx(
            muiClasses?.root,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
          label: cx(classes.label, muiClasses?.label),
          content: cx(classes.content, muiClasses?.content),
          iconContainer: cx(classes.iconContainer, muiClasses?.iconContainer),
          selected: cx(classes.selected, muiClasses?.selected),
          focused: cx(classes.focused, muiClasses?.focused),
        }}
      />
    );
  }
);

export default AppTreeItem;
