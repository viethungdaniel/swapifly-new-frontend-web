import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import {
  useRef,
  useEffect,
  useContext,
  useState,
  forwardRef,
  createContext,
  memo,
  useImperativeHandle,
} from "react";
import { Box } from "@mui/material";

import { useEventCallback, useIsomorphicLayoutEffect } from "@/hooks";
import useStyles from "./VirtualizationInfiniteScrollLoader.styles";

import type { BoxProps } from "@mui/material";
import { commonHelpers } from "@/utils/helpers";

type CustomVirtualizationInfiniteScrollLoaderProps<Item> = {
  width?: number;
  height?: number;
  appClasses?: Partial<ReturnType<typeof useStyles>["classes"]>;
  itemsPage?: number;
  itemsLimit?: number;
  itemsCount: number;
  items: Item[];
  orientation?: "horizontal" | "vertical";
  loading?: boolean;
  defaultItemSize?: number;
  spacing?: number | `${number}px`;
  overScanCount?: number;
  outerComponent?: React.ElementType;
  innerComponent?: React.ElementType;
  onItemsPageChange?: (newPage: number) => void;
  onItemsFetch?: (payload: { page: number; limit: number }) => void;
  renderItem: (
    props: { style: React.CSSProperties; ref: React.ForwardedRef<any> },
    item: Item,
    options: { loading: boolean }
  ) => React.ReactNode;
};

export type VirtualizationInfiniteScrollLoaderProps<Item> = Omit<
  BoxProps,
  keyof CustomVirtualizationInfiniteScrollLoaderProps<Item>
> &
  CustomVirtualizationInfiniteScrollLoaderProps<Item>;

type ItemProps = {
  index: number;
  style: React.CSSProperties;
};

const VirtualizationInfiniteScrollLoaderContext = createContext<
  Pick<
    VirtualizationInfiniteScrollLoaderProps<any>,
    "renderItem" | "items" | "spacing" | "orientation"
  > & {
    hasControlledWidth?: boolean;
    hasControlledHeight?: boolean;
    onSizeChange: (
      index: number,
      size: { width: number; height: number }
    ) => void;
  }
>(undefined!);

const ItemList = forwardRef((props: any, ref: React.ForwardedRef<any>) => {
  return <Box ref={ref} {...props} sx={{ position: "relative" }} />;
});

const Item = (props: ItemProps) => {
  const { index, style } = props;

  const {
    hasControlledHeight,
    hasControlledWidth,
    items,
    renderItem,
    onSizeChange,
  } = useContext(VirtualizationInfiniteScrollLoaderContext);

  const rootElRef = useRef<HTMLDivElement>(null!);

  const item = items[index];

  useIsomorphicLayoutEffect(() => {
    const rootEl = rootElRef.current;

    const resizeObserverRoot = new ResizeObserver(() => {
      if (!!rootEl) {
        const rootWidth = rootEl.getBoundingClientRect().width;
        const rootHeight = rootEl.getBoundingClientRect().height;
        onSizeChange(index, {
          width: rootWidth,
          height: rootHeight,
        });
      }
    });
    rootEl && resizeObserverRoot.observe(rootEl);
    return () => {
      resizeObserverRoot.disconnect();
    };
  });

  const itemStyle = {
    ...style,
    height: hasControlledHeight ? style.height : undefined,
    width: hasControlledWidth ? style.width : undefined,
  };

  return (
    <>
      {renderItem({ ref: rootElRef, style: itemStyle }, item, {
        loading: !items[index],
      })}
    </>
  );
};

const renderItem = memo(
  (props: { index: number; style: React.CSSProperties }) => {
    const { index, style } = props;

    return <Item style={style} index={index} />;
  },
  _isEqual
);

const VirtualizationInfiniteScrollLoader = forwardRef(
  <Item,>(
    props: VirtualizationInfiniteScrollLoaderProps<Item>,
    ref: React.ForwardedRef<any>
  ) => {
    const {
      width,
      height,
      appClasses,
      itemsPage: controlledItemsPage,
      itemsLimit: controlledItemsLimit = 16,
      itemsCount,
      items,
      loading,
      orientation = "vertical",
      defaultItemSize,
      spacing = 0,
      overScanCount = 16,
      outerComponent,
      innerComponent,
      className,
      renderItem: controlledRenderItem,
      onItemsFetch,
      onItemsPageChange,
      ...rest
    } = props;

    const [itemsPage, setItemsPage] = useState(controlledItemsPage ?? 1);
    const [variableSizeListWidth, setVariableSizeListWidth] = useState(
      width ?? 0
    );
    const [variableSizeListHeight, setVariableSizeListHeight] = useState(
      height ?? 0
    );

    const curItemsPageRef = useRef(itemsPage);
    const variableSizeListRef = useRef<any>();
    const indexToItemSizeMap = useRef<{
      [index: number]: { width: number; height: number };
    }>({});
    const rootElRef = useRef<HTMLDivElement>(null!);

    const hasNextPage = itemsPage * itemsCount <= itemsCount;
    const itemCount = hasNextPage ? items.length + 1 : items.length;
    const hasControlledWidth = typeof width !== "undefined";
    const hasControlledHeight = typeof height !== "undefined";

    const { classes, cx } = useStyles(undefined, {
      props: {
        classes: appClasses,
      },
    });

    const handleItemSizeChange = useEventCallback(
      (index: number, itemSize: { width: number; height: number }) => {
        indexToItemSizeMap.current = {
          ...indexToItemSizeMap.current,
          [index]: itemSize,
        };
        if (typeof height === "undefined") {
          const newVariableSizeListHeight = Object.entries(
            indexToItemSizeMap.current
          ).reduce((variableSizeListHeight, [_, brandSize]) => {
            return brandSize.height >= variableSizeListHeight
              ? brandSize.height
              : variableSizeListHeight;
          }, 0);
          setVariableSizeListHeight(newVariableSizeListHeight);
        }
        variableSizeListRef.current.resetAfterIndex(index);
      }
    );

    const handleLoadMoreItems =
      !!loading || !hasNextPage || !onItemsFetch
        ? () => {}
        : () => {
            const newItemsPage = itemsPage + 1;
            curItemsPageRef.current = newItemsPage;
            setItemsPage(newItemsPage);

            onItemsFetch({
              limit: controlledItemsLimit,
              page: newItemsPage,
            });
            onItemsPageChange && onItemsPageChange(newItemsPage);
          };

    const isItemLoaded = (itemIndex: number) => {
      return !hasNextPage || itemIndex < items.length;
    };

    const getItemSize = (itemIndex: number) => {
      return (
        (indexToItemSizeMap.current[itemIndex]?.width || defaultItemSize || 0) +
        (itemIndex !== itemCount - 1 || commonHelpers.isIOS()
          ? parseInt(`${spacing}`)
          : 0)
      );
    };

    useEffect(() => {
      if (typeof width !== "undefined") {
        return;
      }
      const rootEl = rootElRef.current;
      const resizeObserverContainer = new ResizeObserver(() => {
        if (!!rootEl) {
          setVariableSizeListWidth(
            width ?? rootEl.getBoundingClientRect().width
          );
        }
      });
      rootEl && resizeObserverContainer.observe(rootEl);
      return () => {
        resizeObserverContainer.disconnect();
      };
    }, [width]);

    useEffect(() => {
      if (controlledItemsPage !== curItemsPageRef.current) {
        curItemsPageRef.current = controlledItemsPage ?? 1;
        setItemsPage(controlledItemsPage ?? 1);
      }
    }, [controlledItemsPage]);

    useImperativeHandle(ref, () => rootElRef.current, []);

    return (
      <VirtualizationInfiniteScrollLoaderContext.Provider
        value={{
          spacing,
          orientation,
          hasControlledWidth,
          hasControlledHeight,
          items,
          renderItem: controlledRenderItem,
          onSizeChange: handleItemSizeChange,
        }}
      >
        <Box
          {...rest}
          className={cx(className, {
            [classes.horizontal]:
              orientation === "horizontal" && !hasControlledWidth,
            [classes.vertical]:
              orientation === "vertical" && !hasControlledHeight,
          })}
          ref={rootElRef}
        >
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={() => handleLoadMoreItems()}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                onItemsRendered={onItemsRendered}
                itemData={items as any}
                height={variableSizeListHeight}
                width={variableSizeListWidth}
                ref={(_variableSizeListRef) => {
                  variableSizeListRef.current = _variableSizeListRef;
                  ref(_variableSizeListRef);
                }}
                layout={orientation}
                outerElementType={outerComponent}
                innerElementType={innerComponent ?? ItemList}
                overscanCount={overScanCount}
                itemSize={getItemSize}
                itemCount={itemCount}
              >
                {renderItem}
              </VariableSizeList>
            )}
          </InfiniteLoader>
        </Box>
      </VirtualizationInfiniteScrollLoaderContext.Provider>
    );
  }
);

export default VirtualizationInfiniteScrollLoader;
