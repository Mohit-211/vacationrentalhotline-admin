import { Column, type ColumnConfig } from "@ant-design/plots";
import { chartStyle } from "@/styles/theme";
import { formatCents, formatCompactCents, formatNumber } from "@/utils/format";
import type { TrendMetric, TrendPoint } from "../series";

const axisLabel = {
  labelFill: chartStyle.axisLabelColor,
  labelOpacity: chartStyle.axisLabelOpacity,
};

const METRIC_NAMES: Record<TrendMetric, string> = {
  revenueCents: "Revenue",
  newCustomers: "New customers",
  newProperties: "New properties",
};

/** One column per day, week or month. Imported lazily because the chart library is large. */
export function TrendChart({ points, metric }: { points: TrendPoint[]; metric: TrendMetric }) {
  const isMoney = metric === "revenueCents";
  const config: ColumnConfig = {
    data: points,
    xField: "label",
    yField: "value",
    style: {
      fill: chartStyle.barColor,
      maxWidth: chartStyle.barMaxWidth,
      radiusTopLeft: chartStyle.barRadius,
      radiusTopRight: chartStyle.barRadius,
    },
    axis: {
      // On narrow screens, skip labels that would overlap instead of turning them sideways.
      x: { title: false, tick: false, labelAutoRotate: false, labelAutoHide: true, ...axisLabel },
      y: {
        title: false,
        tick: false,
        labelFormatter: (value: number) =>
          isMoney ? formatCompactCents(value) : formatNumber(value),
        ...axisLabel,
      },
    },
    tooltip: {
      items: [
        {
          channel: "y",
          name: METRIC_NAMES[metric],
          valueFormatter: (value: number) => (isMoney ? formatCents(value) : formatNumber(value)),
        },
      ],
    },
  };
  // The chart takes the height of .chart-area (global.css), the same as its loading placeholder.
  return (
    <div className="chart-area">
      <Column {...config} />
    </div>
  );
}
