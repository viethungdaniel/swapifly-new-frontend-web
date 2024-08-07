import { imageHelpers } from "@/utils/helpers";

import styled from "@emotion/styled";
import { Box, Skeleton } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppImage from "@/components/AppImage";
import AppTypography from "@/components/AppTypography";
import VirtualizationInfiniteScrollLoader from "@/components/VirtualizationInfiniteScrollLoader";
import AppLink from "@/components/AppLink/AppLink";
import AppContent from "@/components/AppContent/AppContent";

import SectionMobileBrandListContext from "@/views/Home/components/SectionBrandList/SectionBrandList.context";

import { useAppSelector } from "@/hooks";
import { forwardRef, useContext, useMemo } from "react";

import useStyles from "./MobileBrandList.styles";

import type { AppState } from "@/store";
import type { VirtualizationInfiniteScrollLoaderProps } from "@/components/VirtualizationInfiniteScrollLoader";

type BrandItemProps = {
  skeletonLoading?: boolean;
  brand: AppState["brand"]["brands"][number] | null;
} & React.ComponentPropsWithoutRef<"div">;

const StyledAppContainer = styled(AppContainer)`
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const BrandItem = forwardRef(
  (props: BrandItemProps, ref: React.ForwardedRef<any>) => {
    const { brand, skeletonLoading, ...rest } = props;

    const { classes } = useStyles();

    return (
      <Box
        {...rest}
        component={skeletonLoading ? "div" : AppLink}
        href={
          skeletonLoading
            ? undefined
            : {
                pathname: "/search",
                query: {
                  brand: brand?.id,
                },
              }
        }
        underline="none"
        ref={ref}
        className={classes.brandItem}
      >
        {skeletonLoading && (
          <>
            <Skeleton
              animation="wave"
              variant="circular"
              className={classes.brandItemLogo}
              sx={{ width: 70 }}
            />
            <AppTypography variant="bodyMed16">
              <Skeleton animation="wave" variant="text" />
            </AppTypography>
          </>
        )}
        {!skeletonLoading && (
          <>
            <div className={classes.brandItemLogo}>
              <AppImage
                fill
                sizes={"70px"}
                src={brand?.img}
                loader={imageHelpers.appImageLoader}
                alt={brand?.title}
                objectFit="cover"
                objectPosition="center"
                priority
                defaultPlaceholderVariant="default"
              />
            </div>
            <AppTypography
              className={classes.brandItemTitle}
              variant="bodyMed16"
              align="center"
            >
              {brand?.title}
            </AppTypography>
          </>
        )}
      </Box>
    );
  }
);

const MobileBrandList = () => {
  const { brandsLimit, brandsPage, setBrandsPage, fetchBrands } = useContext(
    SectionMobileBrandListContext
  );

  const $s_brands = useAppSelector((state) => state.brand.brands);
  const $s_brandsLoading = useAppSelector((state) => state.brand.brandsLoading);
  const $s_brandsError = useAppSelector((state) => state.brand.brandsError);
  const $s_brandsCount = useAppSelector((state) => state.brand.brandsCount);

  const brands = useMemo(() => {
    if (($s_brandsLoading || !!$s_brandsError) && brandsPage === 1)
      return [...Array.from(Array(8))].map(() => null);
    return $s_brands;
  }, [$s_brandsLoading, $s_brands, $s_brandsError, brandsPage]);

  const { theme } = useStyles();

  const handleBrandsFetchMore: VirtualizationInfiniteScrollLoaderProps<any>["onItemsFetch"] =
    (payload) => {
      fetchBrands(
        {
          params: {
            ...payload,
          },
        },
        {
          isLoadMore: true,
        }
      );
    };

  return (
    <section>
      <AppContent>
        <VirtualizationInfiniteScrollLoader
          overScanCount={8 * 5}
          items={brands}
          loading={$s_brandsLoading}
          itemsPage={brandsPage}
          itemsCount={$s_brandsCount}
          itemsLimit={brandsLimit}
          spacing={theme.spacing(2) as unknown as number}
          defaultItemSize={70}
          renderItem={(props, item, { loading }) => {
            return (
              <BrandItem {...props} brand={item} skeletonLoading={loading} />
            );
          }}
          orientation="horizontal"
          outerComponent={StyledAppContainer}
          onItemsFetch={handleBrandsFetchMore}
          onItemsPageChange={setBrandsPage}
        />
      </AppContent>
    </section>
  );
};

export default MobileBrandList;
