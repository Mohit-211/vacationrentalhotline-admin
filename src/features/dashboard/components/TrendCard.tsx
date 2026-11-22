import { Card, Empty, Flex, Segmented, Spin } from "antd";
import { lazy, Suspense, useState } from "react";
import { toTrend, type TrendMetric } from "../series";
import type { DailyStats } from "../types";

const TrendChart = lazy(() =>
  import("./TrendChart").then((module) => ({ default: module.TrendChart })),
);

const METRICS: { value: TrendMetric; label: string }[] = [
  { value: "revenueCents", label: "Revenue" },
  { value: "newCustomers", label: "Customers" },
  { value: "newProperties", label: "Properties" },
];

const chartFallback = (
  <Flex align="center" justify="center" className="chart-area">
    <Spin />
  </Flex>
);

interface TrendCardProps {
  daily: DailyStats[] | undefined;
  days: number;
  loading: boolean;
}

/** Revenue, new customers or new properties over the chosen period. */
export function TrendCard({ daily, days, loading }: TrendCardProps) {
  const [metric, setMetric] = useState<TrendMetric>("revenueCents");
  const points = daily ? toTrend(daily, days, metric) : [];
  const isEmpty = points.every((point) => point.value === 0);

  return (
    <Card
      title="Trend"
      extra={
        <Segmented<TrendMetric>
          size="small"
          aria-label="Figure to chart"
          options={METRICS}
          value={metric}
          onChange={setMetric}
        />
      }
    >
      {loading ? (
        chartFallback
      ) : isEmpty ? (
        <Flex align="center" justify="center" className="chart-area">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nothing in this period yet" />
        </Flex>
      ) : (
        <Suspense fallback={chartFallback}>
          <TrendChart points={points} metric={metric} />
        </Suspense>
      )}
    </Card>
  );
}
