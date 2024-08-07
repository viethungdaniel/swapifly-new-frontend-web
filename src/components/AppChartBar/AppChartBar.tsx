import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";

// import zoomPlugin from "chartjs-plugin-zoom"

import { forwardRef } from "react";

import useStyles from "./AppChartBar.styles";

import type { BoxProps } from "@mui/material";

type BarProps = React.ComponentProps<typeof Bar>;
export type AppChartBarData = BarProps["data"];
export type AppChartBarOptions = BarProps["options"];

type CustomAppChartBar = {
  options?: AppChartBarOptions;
  data: AppChartBarData;
  minHeight?: number | `${number}px`;
};

export type AppBarCharProps = Omit<BoxProps, keyof CustomAppChartBar> &
  CustomAppChartBar;

const AppChartBar = forwardRef(
  (props: AppBarCharProps, ref: React.ForwardedRef<any>) => {
    const {
      data,
      options: controlledOptions,
      minHeight,
      className,
      sx,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles({ minHeight });

    const options: AppChartBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      ...controlledOptions,
      scales: {
        ...controlledOptions?.scales,
        y: {
          beginAtZero: true,
          ...(controlledOptions?.scales?.y as any),
          grid: {
            color: theme.palette.common.lightNeutral,
            tickLength: 20,
            lineWidth: 1,
            tickColor: "transparent",
            ...(controlledOptions?.scales?.y?.grid as any),
          },
          ticks: {
            color: theme.palette.text.primary,
            font: {
              size: theme.app.utils.remToPx(
                theme.typography.captionReg12.fontSize!
              ),
              weight: `${theme.typography.captionReg12.fontWeight}`,
              lineHeight: theme.typography.captionReg12.lineHeight,
              style: "normal",
            },
            crossAlign: "near",
            backdropPadding: 0,
            ...(controlledOptions?.scales?.y?.ticks as any),
            // stepSize: 5,
          },
          border: {
            display: false,
            ...(controlledOptions?.scales?.y?.border as any),
          },
        },
        x: {
          ...(controlledOptions?.scales?.x as any),
          grid: {
            display: false,
            ...(controlledOptions?.scales?.x?.grid as any),
          },
          ticks: {
            color: theme.palette.text.primary,
            font: {
              size: theme.app.utils.remToPx(
                theme.typography.captionReg12.fontSize!
              ),
              weight: `${theme.typography.captionReg12.fontWeight}`,
              lineHeight: theme.typography.captionReg12.lineHeight,
              style: "normal",
            },
            ...(controlledOptions?.scales?.x?.ticks as any),
          },
        },
      },
      plugins: {
        ...controlledOptions?.plugins,
        legend: {
          position: "top" as const,
          ...controlledOptions?.plugins?.legend,
          labels: {
            padding: 20,
            boxWidth: 30,
            boxHeight: 16,
            borderRadius: 4,
            useBorderRadius: true,
            color: theme.palette.text.primary,
            font: {
              size: theme.app.utils.remToPx(
                theme.typography.bodyReg14.fontSize!
              ),
              weight: theme.typography.bodyReg14.fontWeight as string,
              lineHeight: theme.typography.bodyReg14.lineHeight,
            },
            ...controlledOptions?.plugins?.legend?.labels,
          },
        },
        title: {
          color: theme.palette.text.primary,
          padding: {
            bottom: 10,
          },
          font: {
            size: theme.app.utils.remToPx(theme.typography.bodyReg16.fontSize!),
            weight: theme.typography.bodyReg16.fontWeight as string,
            lineHeight: theme.typography.bodyReg16.lineHeight,
          },
          ...controlledOptions?.plugins?.title,
          display:
            typeof controlledOptions?.plugins?.title?.display !== "undefined"
              ? controlledOptions?.plugins?.title?.display
              : !!controlledOptions?.plugins?.title?.text,
        },
        tooltip: {
          titleColor: theme.palette.common.white,
          bodyColor: theme.palette.common.white,
          backgroundColor: theme.palette.common.darkNeutral,
          padding: {
            x: 10.25,
            y: 6.25,
          },
          titleFont: {
            size: theme.app.utils.remToPx(theme.typography.bodyReg14.fontSize!),
            family: theme.typography.bodyReg14.fontFamily,
            weight: `${theme.typography.bodyReg14.fontWeight}`,
          },
          cornerRadius: 4,
          ...controlledOptions?.plugins?.tooltip,
        },
        // zoom: {
        //   pan: {
        //     enabled: true,
        //   },
        //   limits: {
        //     x: { min: 0, max: "original" },
        //     y: { min: 0, max: "original" },
        //   },
        //   zoom: {
        //     drag: {
        //       enabled: true,
        //       modifierKey: "alt",
        //     },
        //   },
        //   mode: "x",
        // },
      },
    };

    return (
      <Box
        ref={ref}
        {...rest}
        className={cx(
          classes.root,
          className,
          sx && css(theme.unstable_sx(sx) as any)
        )}
      >
        <Bar
          className={classes.bar}
          updateMode="resize"
          options={options}
          plugins={[
            {
              id: "custom",
              beforeInit: (chart) => {
                const originalFit = (chart.legend as any).fit;
                (chart.legend as any).fit = function fit() {
                  originalFit.bind(chart.legend)();
                  this.height += 40;
                };
              },
            },
          ]}
          data={data}
        />
      </Box>
    );
  }
);

export default AppChartBar;
