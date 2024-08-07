import { Box } from "@mui/material";
import { Radar } from "react-chartjs-2";

import { forwardRef, useRef } from "react";

import useStyles from "./AppChartRadar.styles";

import type { BoxProps } from "@mui/material";

type RadarProps = React.ComponentProps<typeof Radar>;
export type AppChartRadarData = RadarProps["data"];
export type AppChartRadarOptions = RadarProps["options"];

type CustomAppChartRadar = {
  options?: AppChartRadarOptions;
  data: AppChartRadarData;
  minHeight?: number | `${number}px`;
};

export type AppChartRadarProps = Omit<BoxProps, keyof CustomAppChartRadar> &
  CustomAppChartRadar;

const AppChartRadar = forwardRef(
  (props: AppChartRadarProps, ref: React.ForwardedRef<any>) => {
    const {
      data,
      options: controlledOptions,
      minHeight,
      className,
      sx,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles({ minHeight });

    const radarRef = useRef<any>();

    const options: AppChartRadarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      ...controlledOptions,
      scales: {
        ...controlledOptions?.scales,
        r: {
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
            ...(controlledOptions?.scales?.r?.ticks as any),
            // stepSize: 2,
          },
          grid: {
            color: theme.palette.common.lightNeutral,
            tickLength: 20,
            lineWidth: 1,
            tickColor: "transparent",
            ...(controlledOptions?.scales?.r?.grid as any),
          },
        },
      },
      plugins: {
        ...controlledOptions?.plugins,
        legend: {
          position: "top" as const,
          ...controlledOptions?.plugins?.legend,
          display: true,
          labels: {
            padding: 20,
            boxWidth: 20,
            boxHeight: 4,
            borderRadius: 2,
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
        <Radar
          ref={radarRef}
          className={classes.radar}
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

export default AppChartRadar;
