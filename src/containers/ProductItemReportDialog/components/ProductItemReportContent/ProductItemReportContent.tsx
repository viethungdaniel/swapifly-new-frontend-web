import dynamic from "next/dynamic";
import _startCase from "lodash/startCase";

import { commonHelpers, imageHelpers } from "@/utils/helpers";
import { alertDialogService } from "@/services";
import { commonConstants } from "@/utils/constants";

import SwipeableViews from "react-swipeable-views";
import { Divider, Grid, alpha, useMediaQuery } from "@mui/material";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppImage from "@/components/AppImage";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";
import LoadingOverlay from "@/components/LoadingOverlay";
import AppDialogActions from "@/components/AppDialogActions";
import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import ButtonTabs from "@/components/ButtonTabs";
import ButtonTab from "@/components/ButtonTab";
import AppTabPanel from "@/components/AppTabPanel";
import AppLink from "@/components/AppLink";
import ProductPurchaseVisitsFormDialog from "@/containers/ProductPurchaseVisitsFormDialog";

import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import { useContext, useMemo, useState } from "react";
import { useAppMomentWithLocale, useAppSelector } from "@/hooks";
import { Trans, useTranslation } from "next-i18next";

import ProductItemReportDialogContext from "@/containers/ProductItemReportDialog/ProductItemReportDialog.context";

import useStyles from "./ProductItemReportContent.styles";

import type { AppChartBarData } from "@/components/AppChartBar";
import type { AppChartRadarData } from "@/components/AppChartRadar";

const AppChartBar = dynamic(() => import("@/components/AppChartBar"), {
  ssr: false,
  loading: () => <LoadingOverlay loading />,
});
const AppChartRadar = dynamic(() => import("@/components/AppChartRadar"), {
  ssr: false,
  loading: () => <LoadingOverlay loading />,
});

const TabPanelImpressionChartBar = () => {
  const { productReport } = useContext(ProductItemReportDialogContext);

  const { theme } = useStyles();

  const { t } = useTranslation();

  const chartBarItem = useMemo(() => {
    const dataItems: {
      date: string;
      paidImpressionTotal: number;
      impressionTotal: number;
    }[] = [];

    const paidImpressions = productReport?.impression?.paid ?? [];
    const impressions = productReport?.impression?.natural ?? [];
    let stepSize = 1;

    paidImpressions.forEach((paidImpression) => {
      stepSize =
        stepSize - paidImpression.total >= 0 ? stepSize : stepSize * 10;
      dataItems.push({
        date: paidImpression.date,
        paidImpressionTotal: paidImpression.total,
        impressionTotal: 0,
      });
    });

    impressions.forEach((impression) => {
      stepSize = stepSize - impression.total >= 0 ? stepSize : stepSize * 10;
      const dataItemIndex = dataItems.findIndex(
        (dataItem) => dataItem.date === impression.date
      );
      if (dataItemIndex < 0) {
        dataItems.push({
          date: impression.date,
          paidImpressionTotal: 0,
          impressionTotal: impression.total,
        });
      } else dataItems[dataItemIndex].impressionTotal = impression.total;
    });

    const sortedDataItems = dataItems.sort((itemA, itemB) =>
      itemA.date > itemB.date ? 1 : -1
    );

    return {
      data: {
        labels: sortedDataItems.map((sortedDataItem) => sortedDataItem.date),
        datasets: [
          {
            label: _startCase(t("paidImpressions")),
            borderRadius: 4,
            data: sortedDataItems.map(
              (sortedDataItem) => sortedDataItem.paidImpressionTotal
            ),
            backgroundColor: theme.palette.common.darkBlue,
          },
          {
            label: t("impressions"),
            borderRadius: 4,
            data: sortedDataItems.map(
              (sortedDataItem) => sortedDataItem.impressionTotal
            ),
            backgroundColor: theme.palette.common.green,
          },
        ],
      },
      stepSize,
    };
  }, [productReport?.impression?.paid, productReport?.impression?.natural, t]);

  return (
    <AppChartBar
      options={{
        plugins: {
          title: {
            text: t("numberOfImpressionsItemReceived"),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: chartBarItem.stepSize,
            },
          },
        },
      }}
      data={chartBarItem.data}
    />
  );
};

const TabPanelClickChartBar = () => {
  const { productReport } = useContext(ProductItemReportDialogContext);

  const { theme } = useStyles();

  const { t } = useTranslation();

  const chartBarItem = useMemo(() => {
    const dataItems: {
      date: string;
      total: number;
    }[] = [];

    const clickItems = productReport?.click ?? [];
    let stepSize = 1;
    clickItems.forEach((clickItem) => {
      stepSize = stepSize - clickItem.total >= 0 ? stepSize : stepSize * 10;
      dataItems.push({
        date: clickItem.date,
        total: clickItem.total,
      });
    });

    const sortedDataItems = dataItems.sort((itemA, itemB) =>
      itemA.date > itemB.date ? 1 : -1
    );

    return {
      data: {
        labels: sortedDataItems.map((sortedDataItem) => sortedDataItem.date),
        datasets: [
          {
            label: t("numberOfTimes"),
            borderRadius: 4,
            data: sortedDataItems.map((sortedDataItem) => sortedDataItem.total),
            backgroundColor: theme.palette.common.darkBlue,
          },
        ],
      } as AppChartBarData,
      stepSize,
    };
  }, [productReport?.click, t]);

  return (
    <AppChartBar
      options={{
        plugins: {
          legend: {
            display: false,
          },
          title: {
            text: t("numberOfTimesUserClickedToViewItem"),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: chartBarItem.stepSize,
            },
          },
        },
      }}
      data={chartBarItem.data}
    />
  );
};

const TabPanelInboxChartBar = () => {
  const { productReport } = useContext(ProductItemReportDialogContext);

  const { theme } = useStyles();

  const { t } = useTranslation();

  const chartBarItem = useMemo(() => {
    const dataItems: {
      date: string;
      total: number;
    }[] = [];

    const inboxItems = productReport?.inbox ?? [];
    let stepSize = 1;
    inboxItems.forEach((inboxItem) => {
      stepSize = stepSize - inboxItem.total >= 0 ? stepSize : stepSize * 10;
      dataItems.push({
        date: inboxItem.date,
        total: inboxItem.total,
      });
    });

    const sortedDataItems = dataItems.sort((itemA, itemB) =>
      itemA.date > itemB.date ? 1 : -1
    );

    return {
      data: {
        labels: sortedDataItems.map((sortedDataItem) => sortedDataItem.date),
        datasets: [
          {
            label: t("numberOfInboxMessage"),
            borderRadius: 4,
            data: sortedDataItems.map((sortedDataItem) => sortedDataItem.total),
            backgroundColor: theme.palette.common.darkBlue,
          },
        ],
      } as AppChartBarData,
      stepSize,
    };
  }, [productReport?.click, t]);

  return (
    <AppChartBar
      options={{
        plugins: {
          legend: {
            display: false,
          },
          title: {
            text: t("numberOfInboxMessageOffersYouReceived"),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: chartBarItem.stepSize,
            },
          },
        },
      }}
      data={chartBarItem.data}
    />
  );
};

const TabPanelAIRatingRadar = () => {
  const { productReport } = useContext(ProductItemReportDialogContext);

  const { theme } = useStyles();

  const { t } = useTranslation();

  const colors = useMemo(
    () => [theme.palette.common.darkBlue, theme.palette.common.darkRed],
    [theme.palette.common.darkBlue, theme.palette.common.darkRed]
  );

  const chartBarItem = useMemo(() => {
    let stepSize = 1;

    const datasets = [
      {
        label: _startCase(t("overallSellingProduct")),
        data: [
          productReport?.product?.ai_rating_overal?.price || 0,
          productReport?.product?.ai_rating_overal?.description || 0,
          productReport?.product?.ai_rating_overal?.requirement || 0,
          productReport?.product?.ai_rating_overal?.traffic || 0,
          productReport?.product?.ai_rating_overal?.review || 0,
          productReport?.product?.ai_rating_overal?.photo || 0,
        ],
        backgroundColor: alpha(colors[0], theme.palette.action.tonalOpacity),
        pointBackgroundColor: "transparent",
        borderColor: colors[0],
        borderWidth: 2,
      },
      {
        label: _startCase(t("yourProduct")),
        data: [
          productReport?.product?.ai_rating_price || 0,
          productReport?.product?.ai_rating_description || 0,
          productReport?.product?.ai_rating_requirement || 0,
          productReport?.product?.ai_rating_traffic || 0,
          productReport?.product?.ai_rating_review || 0,
          productReport?.product?.ai_rating_photo || 0,
        ],
        backgroundColor: alpha(colors[1], theme.palette.action.tonalOpacity),
        pointBackgroundColor: "transparent",
        borderColor: colors[1],
        borderWidth: 2,
      },
    ] as AppChartRadarData["datasets"];

    datasets.forEach((dataset) => {
      (dataset.data as number[]).forEach((d) => {
        stepSize = stepSize - d >= 0 ? stepSize : stepSize * 10;
      });
    });

    return {
      data: {
        labels: [
          t("pricing"),
          t("description"),
          t("requirement"),
          t("traffic"),
          t("Reliability"),
          t("photo"),
        ],
        datasets,
      } as AppChartRadarData,
      stepSize,
    };
  }, [
    productReport?.product?.ai_rating_overal,
    productReport?.product?.ai_rating_photo,
    productReport?.product?.ai_rating_price,
    productReport?.product?.ai_rating_requirement,
    productReport?.product?.ai_rating_review,
    productReport?.product?.ai_rating_description,
    productReport?.product?.ai_rating_traffic,
    colors,
    t,
  ]);

  return (
    <AppChartRadar
      options={{
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: chartBarItem.stepSize,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              generateLabels: (chart) => {
                return chart.data.datasets.map((dataset, datasetIndex) => {
                  const labelMeta = chart.getDatasetMeta(datasetIndex);

                  return {
                    datasetIndex,
                    text: dataset.label ?? "",
                    fillStyle: colors[datasetIndex],
                    strokeStyle: colors[datasetIndex],
                    fontColor: theme.palette.text.primary,
                    borderRadius: 2,
                    ...labelMeta,
                  };
                });
              },
            },
          },
        },
      }}
      data={chartBarItem.data}
    />
  );
};

const MenuButtonTabList = () => {
  const [selectedTabValue, setSelectedTabValue] = useState(0);

  const { classes } = useStyles();

  const { t } = useTranslation();

  const menuTabs = useMemo(() => {
    return [
      {
        key: "impression",
        label: t("impression"),
        value: 0,
        TabPanelContent: TabPanelImpressionChartBar,
      },
      {
        key: "click",
        label: t("click"),
        value: 1,
        TabPanelContent: TabPanelClickChartBar,
      },
      {
        key: "inbox",
        label: t("inbox"),
        value: 2,
        TabPanelContent: TabPanelInboxChartBar,
      },
      {
        key: "aIRating",
        label: t("aiRating"),
        value: 3,
        TabPanelContent: TabPanelAIRatingRadar,
      },
    ];
  }, []);

  const handleSelectedTabIndexChange = (
    _: React.SyntheticEvent,
    value: number
  ) => {
    setSelectedTabValue(value);
  };

  const handleSwipeableViewsIndexChange = (value: number) => {
    setSelectedTabValue(value);
  };

  return (
    <>
      <ButtonTabs
        classes={{
          root: classes.menuButtonTabs,
        }}
        noWrap
        variant="fullWidth"
        indicatorColor="text.primary"
        value={selectedTabValue}
        sx={{
          mb: 2.5,
        }}
        onChange={handleSelectedTabIndexChange}
      >
        {menuTabs.map((menuTab) => (
          <ButtonTab
            key={menuTab.key}
            label={menuTab.label}
            value={menuTab.value}
          />
        ))}
      </ButtonTabs>
      <SwipeableViews
        index={selectedTabValue}
        onChangeIndex={handleSwipeableViewsIndexChange}
      >
        {menuTabs.map(({ TabPanelContent, ...menuTab }) => (
          <AppTabPanel
            key={menuTab.key}
            keepMounted
            value={selectedTabValue}
            tabIndex={menuTab.value}
          >
            <TabPanelContent />
          </AppTabPanel>
        ))}
      </SwipeableViews>
    </>
  );
};

const PurchaseVisitsButton = () => {
  const { productReport, disabledPurchaseVisits } = useContext(
    ProductItemReportDialogContext
  );

  const product = productReport?.product ?? null;

  const { t } = useTranslation();

  const [
    productPurchaseVisitsFormDialogOpen,
    setProductPurchaseVisitsFormDialogOpen,
  ] = useState(false);

  const handleProductPurchaseVisitsFormDialogOpen = () => {
    setProductPurchaseVisitsFormDialogOpen(true);
  };

  const handleProductPurchaseVisitsFormDialogClose = () => {
    setProductPurchaseVisitsFormDialogOpen(false);
  };

  return (
    <>
      <AppButton
        noWrap
        fullWidth
        variant="contained"
        disabled={disabledPurchaseVisits}
        onClick={handleProductPurchaseVisitsFormDialogOpen}
      >
        {t("purchaseVisits")}
      </AppButton>
      <ProductPurchaseVisitsFormDialog
        productId={product?.id!}
        open={productPurchaseVisitsFormDialogOpen}
        onClose={handleProductPurchaseVisitsFormDialogClose}
      />
    </>
  );
};

const ProductItemReportContent = () => {
  const { productReport, productReportError, productReportLoading, onClose } =
    useContext(ProductItemReportDialogContext);

  const loadingOverlayLoading = productReportLoading || !!productReportError;

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const { t } = useTranslation();

  const handleContactCSClick = () => {
    alertDialogService.fire({
      title: t("contactCS"),
      content: (
        <>
          If you have any question, please email to{" "}
          <AppLink
            href={`mailto:${commonConstants.CS_EMAIL}`}
            variant="bodyMed14"
            color="primary"
            noWrap
          >
            {commonConstants.CS_EMAIL}
          </AppLink>
        </>
      ),
      actions: [
        {
          children: t("iUnderstand"),
          buttonProps: {
            variant: "contained",
            color: "text.primary",
          },
        },
      ],
    });
  };

  return (
    <>
      <AppDialogTitle onCloseButtonClick={onClose as any}>
        {t("itemReport")}
      </AppDialogTitle>
      <AppDialogContent>
        <LoadingOverlay loading={loadingOverlayLoading}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} tablet={6}>
              <div className={classes.productItem}>
                <div className={classes.productItemPhoto}>
                  <AppImage
                    src={productReport?.product?.image}
                    loader={imageHelpers.appImageLoader}
                    fill
                    alt=""
                    sizes="50px"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>
                <div className={classes.productItemContent}>
                  <AppTypography>{productReport?.product?.title}</AppTypography>
                  <AppTypography
                    display="flex"
                    flexWrap={"wrap"}
                    alignItems="center"
                    gap={0.5}
                  >
                    <AppTypography variant="bodyMed16" component="span">
                      {$s_regionCurrency}{" "}
                      {commonHelpers.formatNumber(
                        productReport?.product?.price
                      )}
                    </AppTypography>

                    {!!productReport?.product?.create_time && (
                      <span>
                        <AppTypography
                          variant="bodyMed16"
                          component="span"
                          mr={0.5}
                        >
                          •
                        </AppTypography>
                        <Trans
                          t={t}
                          defaults="publishedOnDate"
                          values={{
                            date: momentWithLocaleByCurrentTz(
                              productReport.product.create_time,
                              "X"
                            ).format("DD/MM/YYYY"),
                          }}
                        />
                      </span>
                    )}
                  </AppTypography>
                </div>
              </div>
              <Divider sx={{ my: 3.75 }} />
              <AppTypography mb={2.5}>
                {t("numberDaysPerformanceAnalysisWithCount", {
                  count: 7,
                })}
              </AppTypography>
              <Grid container alignItems="center" justifyContent="space-around">
                <Grid item xs>
                  <AppTypography variant="titleSemi20" align="center">
                    {commonHelpers.formatNumber(
                      productReport?.product?.impression_num ?? 0
                    )}
                  </AppTypography>
                  <AppTypography align="center">
                    {t("impression")}
                  </AppTypography>
                </Grid>
                <Grid item xs="auto">
                  <AppSvgIcon component={ArrowRightIcon} />
                </Grid>
                <Grid item xs>
                  <AppTypography variant="titleSemi20" align="center">
                    {commonHelpers.formatNumber(
                      productReport?.product?.click_num ?? 0
                    )}
                  </AppTypography>
                  <AppTypography align="center">{t("click")}</AppTypography>
                </Grid>
                <Grid item xs="auto">
                  <AppSvgIcon component={ArrowRightIcon} />
                </Grid>
                <Grid item xs>
                  <AppTypography variant="titleSemi20" align="center">
                    {commonHelpers.formatNumber(
                      productReport?.product?.inbox_num ?? 0
                    )}
                  </AppTypography>
                  <AppTypography align="center">{t("inbox")}</AppTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} tablet={6}>
              <MenuButtonTabList />
            </Grid>
          </Grid>
        </LoadingOverlay>
      </AppDialogContent>
      <AppDialogActions>
        <AppContainer
          maxWidth={isTabletDown ? "tablet" : "xs"}
          disableGutters={"tabletDown"}
          sx={{ display: "flex", alignItems: "center", gap: "inherit" }}
        >
          <AppButton
            noWrap
            fullWidth
            variant="outlined"
            color="text.primary"
            onClick={handleContactCSClick}
          >
            {t("contactCS")}
          </AppButton>
          <PurchaseVisitsButton />
        </AppContainer>
      </AppDialogActions>
    </>
  );
};

export default ProductItemReportContent;
