import {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
  useImperativeHandle,
  isValidElement,
  forwardRef,
  createContext,
} from "react";
import _take from "lodash/take";

import { VariableSizeList } from "react-window";
import { ListSubheader, CircularProgress, Box } from "@mui/material";
import AppMenuList from "@/components/AppMenuList";
import AppMenuItem, { type AppMenuItemProps } from "@/components/AppMenuItem";

import { useTheme } from "@mui/material/styles";
import { useIsomorphicLayoutEffect } from "@/hooks";

type VirtualizationAutocompleteListboxProps =
  React.ComponentPropsWithoutRef<"ul"> & {
    menuItemProps?: AppMenuItemProps;
  };

const MENU_ITEM_MIN_HEIGHT = 40;

const StyledList = forwardRef<any>((props, ref) => {
  return <AppMenuList ref={ref} {...props} disablePadding />;
});

const Loading = (props: any) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingTop={0.375}
      paddingBottom={0.375}
      component="li"
      {...props}
    >
      <CircularProgress color="primary" size={24} />
    </Box>
  );
};

const RowMenuItem = (props: any) => {
  const { index, data, parentElementWidth, style, onSizeChange } = props;
  const rowRef = useRef<any>(null!);

  const parentNode = data[index][0];
  const children = data[index][1];

  const { menuItemProps } = useContext(OuterElementContext);

  useEffect(() => {
    if (rowRef.current.childNodes[0]) {
      const rowHeight = rowRef.current.getBoundingClientRect().height;
      onSizeChange(index, rowHeight);
    }
  }, [onSizeChange, parentElementWidth]);

  return (
    <AppMenuItem
      {...parentNode}
      {...menuItemProps}
      ref={rowRef}
      style={{
        ...style,
        minHeight: MENU_ITEM_MIN_HEIGHT,
        ...menuItemProps?.style,
      }}
    >
      {children}
    </AppMenuItem>
  );
};

const renderRowMenuItem =
  ({ theme, parentElementWidth, onSizeChange }: any) =>
  (props: {
    data: React.ReactElement[];
    index: number;
    style: React.CSSProperties;
  }) => {
    const { data, index, style } = props;
    if (!data[index])
      return (
        <Loading
          style={{
            ...style,
            top: `calc(${style.top as number}px + ${theme.spacing(2.5)})`,
          }}
        />
      );
    const styleProps = {
      ...style,
      // top: `calc(${style.top as number}px + ${theme.spacing(1.25)})`,
      top: `calc(${style.top as number}px)`,
      // width: `calc(100% - ${theme.spacing(1.25 * 2)})`,
      width: `calc(100%)`,
      left: "50%",
      transform: "translateX(-50%)",
    };

    return (
      <RowMenuItem
        style={styleProps}
        index={index}
        data={data}
        onSizeChange={onSizeChange}
        parentElementWidth={parentElementWidth}
      />
    );
  };

const OuterElementContext =
  createContext<VirtualizationAutocompleteListboxProps>(undefined!);

const OuterElementType = forwardRef(
  (props: any, ref: React.ForwardedRef<any>) => {
    const { role, menuItemProps, ...rest } = useContext(OuterElementContext);

    const rootElRef = useRef<HTMLDivElement>();

    useIsomorphicLayoutEffect(() => {
      const rootEl = rootElRef.current;
      if (!rootEl) return;
      const rootElRect = rootEl.getBoundingClientRect();
      rootEl.style.maxHeight = `calc(100vh - ${rootElRect.y}px - ${MENU_ITEM_MIN_HEIGHT}px)`;
    });

    useImperativeHandle(ref, () => rootElRef.current);

    return <div ref={rootElRef} {...props} role={role} {...rest} />;
  }
);

const useResetCacheRef = (props: { itemCount: number }) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!!ref.current?.resetAfterIndex) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [props.itemCount]);

  return ref;
};

const VirtualizationAutocompleteListbox = (
  props: VirtualizationAutocompleteListboxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { children, ...rest } = props;

  const [rootWidth, setRootWidth] = useState(0);

  const itemData = children as React.ReactChild[];

  const theme = useTheme();
  const itemCount = itemData.length;
  const itemSize = MENU_ITEM_MIN_HEIGHT;

  const gridRef = useResetCacheRef({ itemCount });
  const sizeMap = useRef({});
  const rootRef = useRef<HTMLDivElement>(null!);

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    gridRef.current.resetAfterIndex(index);
  }, []);

  const getMenuItemSize = (child: React.ReactNode, index: number) => {
    if ((sizeMap.current as any)[index]) return (sizeMap.current as any)[index];
    if (isValidElement(child) && child.type === ListSubheader) {
      return itemSize;
    }
    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 6) {
      return _take(itemData, 6)
        .map(getMenuItemSize)
        .reduce((a, b) => a + b, 0);
    }
    return itemData.map(getMenuItemSize).reduce((a, b) => a + b, 0);
  };

  useEffect(() => {
    const rootEl = rootRef.current;
    const resizeObserverRoot = new ResizeObserver(() => {
      if (!!rootEl) {
        setRootWidth(rootEl.getBoundingClientRect().width);
      }
    });
    resizeObserverRoot.observe(rootEl);
  }, []);

  useImperativeHandle(ref, () => rootRef.current, []);

  return (
    <div ref={rootRef}>
      <OuterElementContext.Provider value={rest}>
        <VariableSizeList
          itemData={itemData as any}
          height={getHeight() + parseInt(theme.spacing(2.5))}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType={StyledList}
          itemSize={(index: number) => getMenuItemSize(itemData[index], index)}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRowMenuItem({
            theme,
            parentElementWidth: rootWidth,
            onSizeChange: setSize,
          })}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
};

export default forwardRef(VirtualizationAutocompleteListbox);
