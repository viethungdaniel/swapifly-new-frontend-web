import _isEqual from "lodash/isEqual";
import _take from "lodash/take";

import { Box } from "@mui/material";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList } from "react-window";
import AppMenuList from "@/components/AppMenuList";
import AppMenuItem from "@/components/AppMenuItem";
import AppLoading from "@/components/AppLoading";

import { useEventCallback, useIsomorphicLayoutEffect } from "@/hooks";

import VirtualizationListboxComponentContext from "@/components/AsyncAutocomplete/components/VirtualizationListboxComponent/VirtualizationListboxComponent.context";

import {
  useRef,
  useContext,
  useState,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";

import type { VirtualizationListboxComponentContextValue } from "@/components/AsyncAutocomplete/components/VirtualizationListboxComponent/VirtualizationListboxComponent.context";

type CustomVirtualizationListboxComponentProps = {
  hasNextPage: boolean;
  isLoadingNextPage: boolean;
  enabledInfiniteLoader: boolean;
  onNextPageLoad: () => void;
  children: [{}, React.ReactNode][];
};

export type VirtualizationListboxComponentProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof CustomVirtualizationListboxComponentProps
> &
  CustomVirtualizationListboxComponentProps;

const ITEM_SIZE = 50;
const ITEM_MAX_COUNT = 8;

const OuterElementType = forwardRef(
  (props: any, ref: React.ForwardedRef<any>) => {
    const { virtualizationListboxComponentProps } = useContext(
      VirtualizationListboxComponentContext
    );
    const {
      children,
      hasNextPage,
      isLoadingNextPage,
      enabledInfiniteLoader,
      onNextPageLoad,
      ...rest
    } = virtualizationListboxComponentProps || {};

    return (
      <AppMenuList
        ref={ref}
        {...props}
        {...rest}
        sx={{ position: "relative" }}
        component="div"
      />
    );
  }
);

const ItemList = forwardRef((props: any, ref: React.ForwardedRef<any>) => {
  return <AppMenuList ref={ref} {...props} disablePadding />;
});

const RowItemLoading = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingTop={0.375}
      paddingBottom={0.375}
    >
      <AppLoading color="primary" size={24} />
    </Box>
  );
};

const RowItem = (props: { index: number; style: React.CSSProperties }) => {
  const { index, style } = props;

  const { items, changeSize } = useContext(
    VirtualizationListboxComponentContext
  );

  const rootElRef = useRef<HTMLLIElement>(null!);

  const item = items[index];
  const menuItemProps = item[0];
  const children = item[1];
  const loading = !items[index];

  useIsomorphicLayoutEffect(() => {
    const rootEl = rootElRef.current;

    const resizeObserverRoot = new ResizeObserver(() => {
      if (!!rootEl) {
        const rootHeight = rootEl.getBoundingClientRect().height;
        changeSize(index, rootHeight);
      }
    });
    rootEl && resizeObserverRoot.observe(rootEl);
    return () => {
      resizeObserverRoot.disconnect();
    };
  });

  const itemStyle = {
    ...style,
    height: "auto",
  };

  return (
    <AppMenuItem ref={rootElRef} {...menuItemProps} style={itemStyle}>
      {loading ? <RowItemLoading /> : children}
    </AppMenuItem>
  );
};

const renderItem = memo(
  (props: { index: number; style: React.CSSProperties }) => {
    const { index, style } = props;

    return <RowItem style={style} index={index} />;
  },
  _isEqual
);

const VirtualizationListboxComponent = forwardRef(
  (
    props: VirtualizationListboxComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const {
      children,
      hasNextPage,
      isLoadingNextPage,
      enabledInfiniteLoader,
      onNextPageLoad,
    } = props;

    const items =
      children as VirtualizationListboxComponentContextValue["items"];

    const itemCount =
      enabledInfiniteLoader && hasNextPage
        ? children.length + 1
        : children.length;

    const [variableSizeListHeight, setVariableSizeListHeight] = useState(() => {
      return (
        ITEM_SIZE * (itemCount > ITEM_MAX_COUNT ? ITEM_MAX_COUNT : itemCount)
      );
    });

    const variableSizeListRef = useRef<any>();
    const indexToItemSizeMap = useRef<{
      [index: number]: number;
    }>({});
    const rootElRef = useRef<HTMLDivElement>(null!);

    const updateVariableSizeListHeight = useEventCallback(() => {
      const newVariableSizeListHeight = Object.entries(
        indexToItemSizeMap.current
      ).reduce((variableSizeListHeight, [_, itemSize]) => {
        return (
          variableSizeListHeight +
          (itemSize >= variableSizeListHeight
            ? itemSize
            : variableSizeListHeight)
        );
      }, ITEM_SIZE);
      const maxHeight =
        getHeight() ||
        ITEM_SIZE * (itemCount > ITEM_MAX_COUNT ? ITEM_MAX_COUNT : itemCount);
      setVariableSizeListHeight(
        newVariableSizeListHeight >= maxHeight
          ? maxHeight
          : newVariableSizeListHeight
      );
    });

    const changeSize = useEventCallback((index: number, itemSize: number) => {
      indexToItemSizeMap.current = {
        ...indexToItemSizeMap.current,
        [index]: itemSize || ITEM_SIZE,
      };
      variableSizeListRef.current.resetAfterIndex(index);
      updateVariableSizeListHeight();
    });

    const getItemSize = (itemIndex: number) => {
      return indexToItemSizeMap.current[itemIndex] ?? ITEM_SIZE;
    };

    const getHeight = () => {
      if (itemCount > ITEM_MAX_COUNT) {
        return _take(items, ITEM_MAX_COUNT)
          .map((_, index) => getItemSize(index))
          .reduce((a, b) => a + b, 0);
      }
      return items
        .map((_, index) => getItemSize(index))
        .reduce((a, b) => a + b, 0);
    };

    const isItemLoaded = (index: number) =>
      !hasNextPage || index < children.length - 1;

    const loadMoreItems = isLoadingNextPage ? () => {} : onNextPageLoad;

    useImperativeHandle(ref, () => rootElRef.current);

    return (
      <VirtualizationListboxComponentContext.Provider
        value={{
          changeSize,
          items,
          virtualizationListboxComponentProps: props,
        }}
      >
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <VariableSizeList
              onItemsRendered={onItemsRendered}
              itemData={items as any}
              height={variableSizeListHeight + 20}
              width="100%"
              ref={(_variableSizeListRef) => {
                variableSizeListRef.current = _variableSizeListRef;
                ref(variableSizeListRef);
              }}
              outerRef={rootElRef}
              outerElementType={OuterElementType}
              innerElementType={ItemList}
              itemSize={getItemSize}
              overscanCount={5}
              itemCount={itemCount}
            >
              {renderItem}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      </VirtualizationListboxComponentContext.Provider>
    );
  }
);

export default VirtualizationListboxComponent;
