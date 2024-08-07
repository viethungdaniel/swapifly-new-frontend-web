import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { inboxConstants } from "@/utils/constants";

import { ClickAwayListener, Grow, Popper, useTheme } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppPaper from "@/components/AppPaper";
import AppMenuList from "@/components/AppMenuList";
import AppMenuItem from "@/components/AppMenuItem";
import AppListItemText from "@/components/AppListItemText";

import ArrowDropDownIcon from "@@/public/images/icons/arrow-dropdown.svg";

import { useContext, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/hooks";

import InboxListContext from "@/views/InboxSlug/components/InboxThreadList/InboxThreadList.context";

const InboxTypeSelect = () => {
  const { changeInboxThreadsType } = useContext(InboxListContext);

  const [inboxThreadTypeListPopperAnchor, setInboxThreadTypeListPopperAnchor] =
    useState<HTMLButtonElement | null>(null);
  const inboxThreadTypeListPopperOpen = !!inboxThreadTypeListPopperAnchor;

  const { t } = useTranslation();

  const theme = useTheme();

  const $s_selectedInboxThreadType = useAppSelector(
    (state) => state.inbox.selectedInboxThreadType
  );

  const selectedInboxThreadTypeLabel = useMemo(() => {
    return (
      t(
        inboxConstants.inboxThreadTypeToInboxTypeLabelMap[
          $s_selectedInboxThreadType!
        ]
      ) ?? "--"
    );
  }, [$s_selectedInboxThreadType, t]);

  const handleInboxThreadTypeListPopperToggle = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setInboxThreadTypeListPopperAnchor((prevInboxThreadTypeListPopperAnchor) =>
      !prevInboxThreadTypeListPopperAnchor ? event.currentTarget : null
    );
  };

  const handleInboxThreadTypeListPopperClose = (_: any) => {
    setInboxThreadTypeListPopperAnchor(null);
  };

  const handleInboxThreadsTypeChange = (inboxThreadType: number) => () => {
    changeInboxThreadsType(inboxThreadType);
    setInboxThreadTypeListPopperAnchor(null);
  };

  return (
    <>
      <AppButton
        variant="text"
        size="small"
        edge="xy"
        color="text.primary"
        noWrap
        endIcon={
          <AppSvgIcon component={ArrowDropDownIcon} fontSize="inherit" />
        }
        onClick={handleInboxThreadTypeListPopperToggle}
      >
        <AppTypography variant="titleSemi20" component="span">
          {selectedInboxThreadTypeLabel}
        </AppTypography>
      </AppButton>
      <Popper
        open={!!inboxThreadTypeListPopperOpen}
        anchorEl={inboxThreadTypeListPopperAnchor}
        placement="bottom-start"
        transition
        modifiers={[
          {
            name: "flip",
            enabled: true,
          },
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: true,
            },
          },
        ]}
        style={{
          zIndex: theme.zIndex.tooltip,
        }}
      >
        {({ TransitionProps, placement }) => (
          <ClickAwayListener
            onClickAway={handleInboxThreadTypeListPopperClose as any}
          >
            <Grow
              {...TransitionProps}
              timeout={theme.transitions.duration.shortest}
              style={{
                transformOrigin:
                  placement === "bottom-end" ? "100% 0 0" : "100% 100% 0",
              }}
            >
              <AppPaper
                boxShadowVariant="menuPopper"
                sx={{ maxWidth: "100vw" }}
              >
                <AppMenuList
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === "Escape")
                      handleInboxThreadTypeListPopperClose(event as any);
                  }}
                >
                  {inboxConstants.inboxThreadTypes.map((inboxThreadType) => (
                    <AppMenuItem
                      key={inboxThreadType.value}
                      selected={
                        inboxThreadType.value === $s_selectedInboxThreadType
                      }
                      onClick={handleInboxThreadsTypeChange(
                        inboxThreadType.value
                      )}
                    >
                      <AppListItemText
                        primary={t(inboxThreadType.label)}
                        primaryTypographyProps={{
                          variant:
                            inboxThreadType.value === $s_selectedInboxThreadType
                              ? "bodyMed14"
                              : "bodyReg14",
                        }}
                      />
                    </AppMenuItem>
                  ))}
                </AppMenuList>
              </AppPaper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default InboxTypeSelect;
