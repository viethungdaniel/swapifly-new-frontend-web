import axios from "axios";
import { bindActionCreators } from "redux";

import { commonHelpers } from "@/utils/helpers";
import { storeHelpCenterAction } from "@/store";

import { Divider, Grid } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppContent from "@/components/AppContent";
import AppLink from "@/components/AppLink";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTreeItem from "@/components/AppTreeItem";
import AppTreeView from "@/components/AppTreeView";
import AppTypography from "@/components/AppTypography";
import PortalHelpCenterHeader from "@/components/PortalHelpCenterHeader";
import LoadingOverlay from "@/components/LoadingOverlay";

import ArrowExpandDownIcon from "@@/public/images/icons/arrow-expand-down.svg";
import ArrowExpandRightIcon from "@@/public/images/icons/arrow-expand-right.svg";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { Fragment, useEffect, useId, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import type { AppState } from "@/store";
import type { HelpCentersItem } from "@/utils/apis/helpCenter";
import type { CancelTokenSource } from "axios";
import type { AppTreeViewProps } from "@/components/AppTreeView/AppTreeView";
import type { AppTypographyProps } from "@/components/AppTypography";

type HelpCenterItemListProps = {
  variant?: keyof NonNullable<AppState["helpCenter"]["helpCentersItem"]>;
  items?: HelpCentersItem[];
  label?: string;
  level?: number;
  id?: string;
};

const FetchData = () => {
  const fetchHelpCentersItemSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_helpCenterAction = useMemo(
    () => bindActionCreators(storeHelpCenterAction, dispatch),
    [dispatch]
  );

  useEffect(() => {
    fetchHelpCentersItemSourceRef.current = axios.CancelToken.source();

    $s_helpCenterAction.fetchHelpCentersItemSaga({
      cancelToken: fetchHelpCentersItemSourceRef.current.token,
    });
    return () => {
      fetchHelpCentersItemSourceRef.current!.cancel();
      fetchHelpCentersItemSourceRef.current!.cancel();
      fetchHelpCentersItemSourceRef.current = null;
    };
  }, []);

  return null;
};

const HelpCenterItemList = (props: HelpCenterItemListProps) => {
  const {
    id: controlledId,
    label,
    items: controlledItems,
    level = 0,
    variant,
  } = props;

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const $s_helpCenters = useAppSelector(
    (state) =>
      state.helpCenter.helpCentersItem?.[
        variant as keyof typeof state.helpCenter.helpCentersItem
      ]
  );

  const id = useId();

  const items = useMemo<HelpCentersItem[]>(() => {
    if (Array.isArray(controlledItems)) return controlledItems;
    return $s_helpCenters ?? [];
  }, [controlledItems, $s_helpCenters]);

  const TreeViewComponent: any = level !== 0 ? AppTypography : AppTreeView;
  const treeViewComponentProps = useMemo(
    () =>
      level !== 0
        ? ({
            variant: level === 1 ? "bodyMed16" : "bodyReg14",
            component: AppTreeItem,
            nodeId: id ?? controlledId,
            label,
          } as AppTypographyProps)
        : ({
            disableSelection: true,
            defaultCollapseIcon: <AppSvgIcon component={ArrowExpandDownIcon} />,
            defaultExpandIcon: <AppSvgIcon component={ArrowExpandRightIcon} />,
          } as AppTreeViewProps),
    [level, label, id, controlledId]
  );

  return (
    <TreeViewComponent {...(treeViewComponentProps as any)}>
      {items.map((item, itemIndex) => {
        return (
          <Fragment key={item.id}>
            {itemIndex !== 0 && <Divider />}
            {(item.children?.length ?? 0) > 0 ||
            (item.help_centers?.length ?? 0) > 0 ? (
              <HelpCenterItemList
                id={`${item.id}`}
                level={level + 1}
                label={item.title}
                items={item.children! ?? item.help_centers! ?? []}
              />
            ) : (
              <AppLink
                href={{
                  pathname: `/help-center/${commonHelpers.generateSlug(
                    item.title,
                    item.id
                  )}`,
                  query: {
                    ...navigatedQuery,
                  },
                }}
                variant={level === 0 ? "bodyMed16" : "inherit"}
                color="initial"
                underline="none"
              >
                <AppTreeItem nodeId={`${item.id}`} label={item.title} />
              </AppLink>
            )}
          </Fragment>
        );
      })}
    </TreeViewComponent>
  );
};

const HelpCenter = () => {
  const { t } = useTranslation();

  const $s_helpCenterItemLoading = useAppSelector(
    (state) => state.helpCenter.helpCentersItemLoading
  );
  const $s_helpCenterItemError = useAppSelector(
    (state) => state.helpCenter.helpCentersItemError
  );

  return (
    <>
      <FetchData />
      <div>
        <PortalHelpCenterHeader />
        <AppContainer>
          <AppContent>
            <LoadingOverlay
              loading={$s_helpCenterItemLoading || !!$s_helpCenterItemError}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <AppTypography mb={2.5} variant="titleSemi20">
                    {t("topic")}
                  </AppTypography>
                  <HelpCenterItemList variant="topic" />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} tablet={6}>
                  <AppTypography mb={2.5} variant="titleSemi20">
                    {t("announcement")}
                  </AppTypography>
                  <HelpCenterItemList variant="faq" />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: { sm: "initial", tablet: "none" } }}
                >
                  <Divider />
                </Grid>
                <Grid item xs={12} tablet={6}>
                  <AppTypography mb={2.5} variant="titleSemi20">
                    {t("frequentAskedQuestions")}
                  </AppTypography>
                  <HelpCenterItemList variant="announcement" />
                </Grid>
              </Grid>
            </LoadingOverlay>
          </AppContent>
        </AppContainer>
      </div>
    </>
  );
};

export default HelpCenter;
