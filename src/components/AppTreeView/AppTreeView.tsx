import { forwardRef } from "react";

import { TreeView } from "@mui/x-tree-view/TreeView";

import type { TreeViewProps } from "@mui/x-tree-view/TreeView";

export type AppTreeViewProps<Multiple extends boolean | undefined = undefined> =
  TreeViewProps<Multiple> & React.RefAttributes<HTMLUListElement>;

const AppTreeView = forwardRef(
  <Multiple extends boolean | undefined = undefined>(
    props: AppTreeViewProps<Multiple>,
    ref: React.ForwardedRef<any>
  ) => {
    const { ...rest } = props;

    return <TreeView ref={ref} {...rest} />;
  }
);

export default AppTreeView;
