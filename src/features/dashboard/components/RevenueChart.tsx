import { Column, type ColumnConfig } from "@ant-design/plots";
import { chartStyle } from "@/styles/theme";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/utils/format";
import type { RevenueBucket } from "../types";

const axisLabel = {
  labelFill: chartStyle.axisLabelColor,
  labelOpacity: chartStyle.axisLabelOpacity,
};

/** Revenue per time bucket. Imported lazily because the chart library is large. */
export function RevenueChart({ buckets }: { buckets: RevenueBucket[] }) {
  const config: ColumnConfig = {
    data: buckets,
    xField: "type",
    yField: "totalAmount",
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
        labelFormatter: (value: number) => formatCompactCurrency(value),
        ...axisLabel,
      },
    },
    tooltip: {
      items: [
        { channel: "y", name: "Revenue", valueFormatter: (value: number) => formatCurrency(value) },
        {
          field: "totalCount",
          name: "Payments",
          valueFormatter: (value: number) => formatNumber(value),
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
