import { Column, type ColumnConfig } from "@ant-design/plots";
import { BRAND_COLOR } from "@/config/theme";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/utils/format";
import type { RevenueBucket } from "../types";

/** Revenue per time bucket. Imported lazily because the chart library is large. */
export function RevenueChart({ buckets }: { buckets: RevenueBucket[] }) {
  const config: ColumnConfig = {
    data: buckets,
    xField: "type",
    yField: "totalAmount",
    height: 320,
    style: { fill: BRAND_COLOR, maxWidth: 56, radiusTopLeft: 4, radiusTopRight: 4 },
    axis: {
      x: { title: false },
      y: { title: false, labelFormatter: (value: number) => formatCompactCurrency(value) },
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
  return <Column {...config} />;
}
